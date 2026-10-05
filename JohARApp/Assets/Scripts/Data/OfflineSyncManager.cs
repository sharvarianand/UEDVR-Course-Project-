using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace JohAR.Data
{
    public class OfflineSyncManager : MonoBehaviour
    {
        private static OfflineSyncManager _instance;
        public static OfflineSyncManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    var existing = FindAnyObjectByType<OfflineSyncManager>();
                    if (existing != null)
                    {
                        _instance = existing;
                    }
                    else
                    {
                        GameObject go = new GameObject("[JohAR_OfflineSyncManager]");
                        _instance = go.AddComponent<OfflineSyncManager>();
                        DontDestroyOnLoad(go);
                    }
                }
                return _instance;
            }
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void AutoInitialize()
        {
            _ = Instance;
        }

        public event Action<bool, int, string> OnSyncStatusChanged;

        public bool IsOnline => Application.internetReachability != NetworkReachability.NotReachable;
        public int PendingCount => OfflineDatabase.Instance.GetPendingCount();

        private bool isSyncing = false;
        private Coroutine syncLoopCoroutine;

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            // Initial sync & worker list fetch
            if (IsOnline)
            {
                StartCoroutine(FetchRemoteWorkersCoroutine());
                TriggerSyncNow();
            }

            if (syncLoopCoroutine == null)
            {
                syncLoopCoroutine = StartCoroutine(SyncHeartbeat());
            }
        }

        private IEnumerator SyncHeartbeat()
        {
            while (true)
            {
                if (IsOnline)
                {
                    if (PendingCount > 0 && !isSyncing)
                    {
                        yield return FlushQueueCoroutine();
                    }
                    else
                    {
                        NotifyStatus("Online • Synced");
                    }
                }
                else
                {
                    NotifyStatus($"Offline ({PendingCount} pending)");
                }

                yield return new WaitForSeconds(SupabaseConfig.SyncIntervalSeconds);
            }
        }

        public void TriggerSyncNow()
        {
            if (!isSyncing && IsOnline)
            {
                StartCoroutine(FlushQueueCoroutine());
            }
            else
            {
                NotifyStatus(IsOnline ? "Syncing..." : "Offline (Saved locally)");
            }
        }

        public void RefreshWorkersFromCloud()
        {
            if (IsOnline)
            {
                StartCoroutine(FetchRemoteWorkersCoroutine());
            }
        }

        private IEnumerator FetchRemoteWorkersCoroutine()
        {
            yield return SupabaseRestClient.Instance.FetchRegisteredWorkers((success, workers, err) => {
                if (success && workers != null && workers.Count > 0)
                {
                    OfflineDatabase.Instance.UpdateRegisteredWorkers(workers);
                    Debug.Log($"[OfflineSyncManager] Successfully refreshed {workers.Count} authorized workers from Supabase.");
                }
                else
                {
                    Debug.LogWarning($"[OfflineSyncManager] Could not fetch remote workers: {err}");
                }
            });
        }

        // =========================================================================
        // High-level App Recording API
        // =========================================================================

        public void RecordLogin(string workerId, LanguageManager.Language lang)
        {
            var worker = OfflineDatabase.Instance.GetRegisteredWorker(workerId);
            if (worker == null)
            {
                Debug.LogWarning($"[OfflineSyncManager] Cannot record login for unregistered worker '{workerId}'.");
                return;
            }

            OfflineDatabase.Instance.SetCurrentWorker(worker);

            if (IsOnline)
            {
                StartCoroutine(SupabaseRestClient.Instance.UpdateWorkerActivity(worker.worker_id, null, (s, e) => {
                    if (s) Debug.Log($"[OfflineSyncManager] Worker {worker.worker_id} activity updated on Supabase.");
                }));
            }
        }

        public void RecordTrainingSession(string moduleType, bool passSuccess, float duration, int score = 100, int stars = 3)
        {
            string workerId = PlayerPrefs.GetString("WorkerID", "W-7042");
            TrainingSessionRecord record = new TrainingSessionRecord(workerId, moduleType, passSuccess, duration, score, stars);

            OfflineDatabase.Instance.QueueTrainingSession(record);

            // Update worker safety score on Supabase and trigger immediate sync
            if (IsOnline)
            {
                StartCoroutine(SupabaseRestClient.Instance.UpdateWorkerActivity(workerId, score, (s, e) => {
                    if (s) Debug.Log($"[OfflineSyncManager] Worker {workerId} safety score updated to {score}.");
                }));
            }

            TriggerSyncNow();
        }

        public void RecordHazardReport(string hazardType, string zone, string severity, string description)
        {
            string workerId = PlayerPrefs.GetString("WorkerID", "W-7042");
            HazardReportRecord record = new HazardReportRecord(workerId, hazardType, zone, severity, description);

            OfflineDatabase.Instance.QueueHazardReport(record);
            TriggerSyncNow();
        }

        public void RecordSOSEvent(string beaconId, string zone)
        {
            string workerId = PlayerPrefs.GetString("WorkerID", "W-7042");
            SOSEventRecord record = new SOSEventRecord(workerId, beaconId, zone);

            OfflineDatabase.Instance.QueueSOSEvent(record);
            TriggerSyncNow();
        }

        public string GetSyncStatusSummary()
        {
            if (!IsOnline)
            {
                return $"OFFLINE ({PendingCount} pending sync)";
            }
            if (isSyncing)
            {
                return "SYNCING TO SUPABASE...";
            }
            return PendingCount > 0 ? $"ONLINE ({PendingCount} syncing...)" : "ONLINE • ALL DATA SYNCED";
        }

        // =========================================================================
        // Queue Flushing Coroutine
        // =========================================================================

        private IEnumerator FlushQueueCoroutine()
        {
            if (isSyncing) yield break;
            isSyncing = true;
            NotifyStatus("Syncing...");

            var state = OfflineDatabase.Instance.State;

            // 1. Sync Training Sessions
            if (state.pendingTrainingSessions != null && state.pendingTrainingSessions.Count > 0)
            {
                var sessionsCopy = new List<TrainingSessionRecord>(state.pendingTrainingSessions);
                foreach (var s in sessionsCopy)
                {
                    bool done = false;
                    bool success = false;
                    string err = "";

                    yield return SupabaseRestClient.Instance.PostTrainingSession(s, (succ, e) => {
                        done = true;
                        success = succ;
                        err = e;
                    });

                    if (success)
                    {
                        OfflineDatabase.Instance.MarkTrainingSessionSynced(s.client_session_id);
                        Debug.Log($"[OfflineSyncManager] Training session '{s.client_session_id}' synced.");
                    }
                    else
                    {
                        Debug.LogWarning($"[OfflineSyncManager] Training session sync deferred: {err}");
                        break;
                    }
                }
            }

            // 2. Sync Hazard Reports
            if (state.pendingHazardReports != null && state.pendingHazardReports.Count > 0)
            {
                var hazardsCopy = new List<HazardReportRecord>(state.pendingHazardReports);
                foreach (var h in hazardsCopy)
                {
                    bool done = false;
                    bool success = false;
                    string err = "";

                    yield return SupabaseRestClient.Instance.PostHazardReport(h, (succ, e) => {
                        done = true;
                        success = succ;
                        err = e;
                    });

                    if (success)
                    {
                        OfflineDatabase.Instance.MarkHazardReportSynced(h.client_report_id);
                        Debug.Log($"[OfflineSyncManager] Hazard report '{h.client_report_id}' synced.");
                    }
                    else
                    {
                        Debug.LogWarning($"[OfflineSyncManager] Hazard report sync deferred: {err}");
                        break;
                    }
                }
            }

            // 3. Sync SOS Distress Events
            if (state.pendingSOSEvents != null && state.pendingSOSEvents.Count > 0)
            {
                var sosCopy = new List<SOSEventRecord>(state.pendingSOSEvents);
                foreach (var sos in sosCopy)
                {
                    bool done = false;
                    bool success = false;
                    string err = "";

                    yield return SupabaseRestClient.Instance.PostSOSEvent(sos, (succ, e) => {
                        done = true;
                        success = succ;
                        err = e;
                    });

                    if (success)
                    {
                        OfflineDatabase.Instance.MarkSOSEventSynced(sos.client_sos_id);
                        Debug.Log($"[OfflineSyncManager] SOS Event '{sos.client_sos_id}' synced.");
                    }
                    else
                    {
                        Debug.LogWarning($"[OfflineSyncManager] SOS Event sync deferred: {err}");
                        break;
                    }
                }
            }

            isSyncing = false;
            NotifyStatus(PendingCount == 0 ? "Synced successfully" : $"{PendingCount} items pending");
        }

        private void NotifyStatus(string message)
        {
            OnSyncStatusChanged?.Invoke(IsOnline, PendingCount, message);
        }
    }
}
