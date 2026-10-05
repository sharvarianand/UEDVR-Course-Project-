using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

namespace JohAR.Data
{
    public class SupabaseRestClient
    {
        private static SupabaseRestClient _instance;
        public static SupabaseRestClient Instance => _instance ??= new SupabaseRestClient();

        public IEnumerator PostTrainingSession(TrainingSessionRecord session, Action<bool, string> callback)
        {
            var dto = session.ToPostDto();
            string json = JsonUtility.ToJson(dto);
            yield return SendPostRequest(SupabaseConfig.TrainingEndpoint, json, false, callback);
        }

        public IEnumerator PostHazardReport(HazardReportRecord report, Action<bool, string> callback)
        {
            var dto = report.ToPostDto();
            string json = JsonUtility.ToJson(dto);
            yield return SendPostRequest(SupabaseConfig.HazardsEndpoint, json, false, callback);
        }

        public IEnumerator PostSOSEvent(SOSEventRecord sos, Action<bool, string> callback)
        {
            var dto = sos.ToPostDto();
            string json = JsonUtility.ToJson(dto);
            yield return SendPostRequest(SupabaseConfig.SOSEndpoint, json, false, callback);
        }

        public IEnumerator UpdateWorkerActivity(string workerId, int? newScore, Action<bool, string> callback)
        {
            string url = $"{SupabaseConfig.WorkersEndpoint}?worker_id=eq.{UnityWebRequest.EscapeURL(workerId)}";
            string now = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
            
            string json;
            if (newScore.HasValue)
            {
                json = $"{{\"last_active_at\":\"{now}\",\"safety_score\":{newScore.Value}}}";
            }
            else
            {
                json = $"{{\"last_active_at\":\"{now}\"}}";
            }

            yield return SendPatchRequest(url, json, callback);
        }

        public IEnumerator FetchRegisteredWorkers(Action<bool, List<WorkerRecord>, string> callback)
        {
            string url = $"{SupabaseConfig.WorkersEndpoint}?select=*&order=worker_id.asc";
            using (UnityWebRequest request = UnityWebRequest.Get(url))
            {
                request.timeout = 8;
                request.SetRequestHeader("apikey", SupabaseConfig.AnonKey);
                request.SetRequestHeader("Authorization", $"Bearer {SupabaseConfig.AnonKey}");

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success && (request.responseCode == 200 || request.responseCode == 201))
                {
                    string raw = request.downloadHandler?.text;
                    try
                    {
                        string wrapped = "{\"items\":" + raw + "}";
                        WorkerListWrapper wrapper = JsonUtility.FromJson<WorkerListWrapper>(wrapped);
                        callback?.Invoke(true, wrapper.items, "");
                    }
                    catch (Exception ex)
                    {
                        callback?.Invoke(false, null, $"JSON parse error: {ex.Message}");
                    }
                }
                else
                {
                    callback?.Invoke(false, null, $"HTTP {request.responseCode}: {request.error}");
                }
            }
        }

        public IEnumerator PingDatabase(Action<bool, long, string> callback)
        {
            string url = $"{SupabaseConfig.WorkersEndpoint}?select=count&limit=1";
            using (UnityWebRequest request = UnityWebRequest.Get(url))
            {
                request.timeout = 5;
                request.SetRequestHeader("apikey", SupabaseConfig.AnonKey);
                request.SetRequestHeader("Authorization", $"Bearer {SupabaseConfig.AnonKey}");

                long start = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                yield return request.SendWebRequest();
                long latency = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() - start;

                bool success = request.result == UnityWebRequest.Result.Success;
                string error = success ? "" : request.error;
                callback?.Invoke(success, latency, error);
            }
        }

        private IEnumerator SendPostRequest(string endpoint, string jsonBody, bool upsertMerge, Action<bool, string> callback)
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);

            using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
            {
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.timeout = 8;

                request.SetRequestHeader("Content-Type", "application/json");
                request.SetRequestHeader("apikey", SupabaseConfig.AnonKey);
                request.SetRequestHeader("Authorization", $"Bearer {SupabaseConfig.AnonKey}");

                if (upsertMerge)
                {
                    request.SetRequestHeader("Prefer", "resolution=merge-duplicates,return=minimal");
                }
                else
                {
                    request.SetRequestHeader("Prefer", "return=minimal");
                }

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success || request.responseCode == 200 || request.responseCode == 201)
                {
                    callback?.Invoke(true, "");
                }
                else
                {
                    string err = $"HTTP {request.responseCode}: {request.error} | {request.downloadHandler?.text}";
                    Debug.LogError($"[SupabaseRestClient] POST Error: {err}");
                    callback?.Invoke(false, err);
                }
            }
        }

        private IEnumerator SendPatchRequest(string endpoint, string jsonBody, Action<bool, string> callback)
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);

            using (UnityWebRequest request = new UnityWebRequest(endpoint, "PATCH"))
            {
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.timeout = 8;

                request.SetRequestHeader("Content-Type", "application/json");
                request.SetRequestHeader("apikey", SupabaseConfig.AnonKey);
                request.SetRequestHeader("Authorization", $"Bearer {SupabaseConfig.AnonKey}");
                request.SetRequestHeader("Prefer", "return=minimal");

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success || request.responseCode == 200 || request.responseCode == 204)
                {
                    callback?.Invoke(true, "");
                }
                else
                {
                    string err = $"HTTP {request.responseCode}: {request.error} | {request.downloadHandler?.text}";
                    Debug.LogError($"[SupabaseRestClient] PATCH Error: {err}");
                    callback?.Invoke(false, err);
                }
            }
        }

        [Serializable]
        private class WorkerListWrapper
        {
            public List<WorkerRecord> items = new List<WorkerRecord>();
        }
    }
}
