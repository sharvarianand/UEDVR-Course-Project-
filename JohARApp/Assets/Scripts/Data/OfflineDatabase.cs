using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace JohAR.Data
{
    public class OfflineDatabase
    {
        private static OfflineDatabase _instance;
        public static OfflineDatabase Instance => _instance ??= new OfflineDatabase();

        private readonly string filePath;
        private OfflineDatabaseState state;
        private readonly object fileLock = new object();

        private OfflineDatabase()
        {
            filePath = Path.Combine(Application.persistentDataPath, "johar_offline_data.json");
            Load();
        }

        public OfflineDatabaseState State
        {
            get
            {
                if (state == null) Load();
                return state;
            }
        }

        public void Load()
        {
            lock (fileLock)
            {
                try
                {
                    if (File.Exists(filePath))
                    {
                        string json = File.ReadAllText(filePath);
                        state = JsonUtility.FromJson<OfflineDatabaseState>(json);
                    }
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"[OfflineDatabase] Failed to read offline database: {ex.Message}. Initializing fresh state.");
                }

                if (state == null)
                {
                    state = new OfflineDatabaseState();
                }

                // Ensure registered workers list is initialized with official mine workers
                if (state.registeredWorkers == null || state.registeredWorkers.Count == 0)
                {
                    state.registeredWorkers = WorkerRecord.GetDefaultRegisteredWorkers();
                }
            }
        }

        public void Save()
        {
            lock (fileLock)
            {
                try
                {
                    string json = JsonUtility.ToJson(state, true);
                    File.WriteAllText(filePath, json);
                }
                catch (Exception ex)
                {
                    Debug.LogError($"[OfflineDatabase] Failed to write offline database: {ex.Message}");
                }
            }
        }

        // =========================================================================
        // Registered Workers & Validation
        // =========================================================================

        public bool IsWorkerRegistered(string workerId)
        {
            if (string.IsNullOrEmpty(workerId)) return false;
            string norm = workerId.Trim().ToUpperInvariant();
            return State.registeredWorkers != null && State.registeredWorkers.Exists(w => w.worker_id.Trim().ToUpperInvariant() == norm);
        }

        public WorkerRecord GetRegisteredWorker(string workerId)
        {
            if (string.IsNullOrEmpty(workerId)) return null;
            string norm = workerId.Trim().ToUpperInvariant();
            return State.registeredWorkers?.Find(w => w.worker_id.Trim().ToUpperInvariant() == norm);
        }

        public void UpdateRegisteredWorkers(List<WorkerRecord> remoteWorkers)
        {
            if (remoteWorkers == null || remoteWorkers.Count == 0) return;
            state.registeredWorkers = remoteWorkers;
            Save();
            Debug.Log($"[OfflineDatabase] Cached {remoteWorkers.Count} registered workers from cloud.");
        }

        public void SetCurrentWorker(WorkerRecord worker)
        {
            state.currentWorker = worker;
            Save();
        }

        // =========================================================================
        // Queuing Events
        // =========================================================================

        public void QueueTrainingSession(TrainingSessionRecord session)
        {
            state.pendingTrainingSessions.Add(session);
            Save();
            Debug.Log($"[OfflineDatabase] Training session queued offline. Total pending: {state.pendingTrainingSessions.Count}");
        }

        public void QueueHazardReport(HazardReportRecord report)
        {
            state.pendingHazardReports.Add(report);
            Save();
            Debug.Log($"[OfflineDatabase] Hazard report queued offline. Total pending: {state.pendingHazardReports.Count}");
        }

        public void QueueSOSEvent(SOSEventRecord sos)
        {
            state.pendingSOSEvents.Add(sos);
            Save();
            Debug.Log($"[OfflineDatabase] SOS Event queued offline. Total pending: {state.pendingSOSEvents.Count}");
        }

        public int GetPendingCount()
        {
            if (state == null) return 0;
            return (state.pendingTrainingSessions != null ? state.pendingTrainingSessions.Count : 0) +
                   (state.pendingHazardReports != null ? state.pendingHazardReports.Count : 0) +
                   (state.pendingSOSEvents != null ? state.pendingSOSEvents.Count : 0);
        }

        // =========================================================================
        // Drill Progress Tracking
        // =========================================================================

        public bool HasWorkerCompletedDrill(string workerId, string moduleType = "FIRE_SAFETY_PASS")
        {
            if (string.IsNullOrEmpty(workerId)) return false;
            string norm = workerId.Trim().ToUpperInvariant();

            bool inPending = state.pendingTrainingSessions != null &&
                             state.pendingTrainingSessions.Exists(s => s.worker_id.Trim().ToUpperInvariant() == norm && s.module_type == moduleType && s.pass_protocol_success);

            bool inSynced = state.syncedTrainingSessions != null &&
                            state.syncedTrainingSessions.Exists(s => s.worker_id.Trim().ToUpperInvariant() == norm && s.module_type == moduleType && s.pass_protocol_success);

            return inPending || inSynced;
        }

        public bool GetWorkerDrillStats(string workerId, string moduleType, out float duration, out int score, out int stars)
        {
            duration = 0f;
            score = 0;
            stars = 0;
            if (string.IsNullOrEmpty(workerId)) return false;
            string norm = workerId.Trim().ToUpperInvariant();

            TrainingSessionRecord rec = null;
            if (state.pendingTrainingSessions != null)
            {
                rec = state.pendingTrainingSessions.FindLast(s => s.worker_id.Trim().ToUpperInvariant() == norm && s.module_type == moduleType && s.pass_protocol_success);
            }
            if (rec == null && state.syncedTrainingSessions != null)
            {
                rec = state.syncedTrainingSessions.FindLast(s => s.worker_id.Trim().ToUpperInvariant() == norm && s.module_type == moduleType && s.pass_protocol_success);
            }

            if (rec != null)
            {
                duration = rec.time_taken_seconds;
                score = rec.score;
                stars = rec.rating_stars;
                return true;
            }
            return false;
        }

        // =========================================================================
        // Sync Completion Markers
        // =========================================================================

        public void MarkTrainingSessionSynced(string clientSessionId)
        {
            int idx = state.pendingTrainingSessions.FindIndex(s => s.client_session_id == clientSessionId);
            if (idx >= 0)
            {
                var item = state.pendingTrainingSessions[idx];
                state.syncedTrainingSessions.Add(item);
                state.pendingTrainingSessions.RemoveAt(idx);
                state.lastSyncTimestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
                Save();
            }
        }

        public void MarkHazardReportSynced(string clientReportId)
        {
            int idx = state.pendingHazardReports.FindIndex(h => h.client_report_id == clientReportId);
            if (idx >= 0)
            {
                var item = state.pendingHazardReports[idx];
                state.syncedHazardReports.Add(item);
                state.pendingHazardReports.RemoveAt(idx);
                state.lastSyncTimestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
                Save();
            }
        }

        public void MarkSOSEventSynced(string clientSosId)
        {
            int idx = state.pendingSOSEvents.FindIndex(s => s.client_sos_id == clientSosId);
            if (idx >= 0)
            {
                var item = state.pendingSOSEvents[idx];
                state.syncedSOSEvents.Add(item);
                state.pendingSOSEvents.RemoveAt(idx);
                state.lastSyncTimestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
                Save();
            }
        }
    }
}
