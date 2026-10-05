using System;
using System.Collections.Generic;
using UnityEngine;

namespace JohAR.Data
{
    [Serializable]
    public class WorkerRecord
    {
        public string worker_id;
        public string name;
        public string role;
        public string sector;
        public string language;
        public int safety_score;
        public string created_at;
        public string last_active_at;

        public WorkerRecord() {}

        public WorkerRecord(string id, string workerName, string workerRole, string workerSector, string lang, int score = 100)
        {
            worker_id = id;
            name = string.IsNullOrEmpty(workerName) ? "Miner " + id : workerName;
            role = string.IsNullOrEmpty(workerRole) ? "Level 1 Safety Trainee" : workerRole;
            sector = string.IsNullOrEmpty(workerSector) ? "Sector 4 Mine" : workerSector;
            language = lang;
            safety_score = score;
            string now = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
            created_at = now;
            last_active_at = now;
        }

        public static List<WorkerRecord> GetDefaultRegisteredWorkers()
        {
            return new List<WorkerRecord>
            {
                new WorkerRecord("W-7042", "Ramesh Soren", "Level 1 Safety Trainee", "Sector 4 Mine", "Hindi", 70),
                new WorkerRecord("W-4108", "Birsa Marandi", "Blasting Technician", "Sector 2 Deep Shaft", "Santali", 92),
                new WorkerRecord("W-5521", "Sunil Kumar Mahto", "Heavy Machinery Operator", "Sector 4 Mine", "Hindi", 88),
                new WorkerRecord("W-1099", "Anjali Murmu", "Environmental Air Monitor", "Sector 1 Processing", "Santali", 100),
                new WorkerRecord("W-8834", "Vikramaditya Roy", "Underground Rescue Officer", "Sector 3 Incline", "English", 95)
            };
        }
    }

    // Clean DTOs for Supabase PostgREST (omit empty strings so Postgres doesn't throw 400 bad request)
    [Serializable]
    public struct TrainingSessionPostDto
    {
        public string client_session_id;
        public string worker_id;
        public string module_type;
        public bool pass_protocol_success;
        public float time_taken_seconds;
        public int score;
        public int rating_stars;
        public string completed_at;
    }

    [Serializable]
    public struct HazardReportPostDto
    {
        public string client_report_id;
        public string worker_id;
        public string hazard_type;
        public string zone;
        public string severity;
        public string description;
        public string status;
        public string reported_at;
    }

    [Serializable]
    public struct SOSEventPostDto
    {
        public string client_sos_id;
        public string worker_id;
        public string beacon_id;
        public string zone;
        public string status;
        public string triggered_at;
    }

    [Serializable]
    public struct WorkerPatchDto
    {
        public string last_active_at;
        public int safety_score;
    }

    [Serializable]
    public class TrainingSessionRecord
    {
        public string client_session_id;
        public string worker_id;
        public string module_type;
        public bool pass_protocol_success;
        public float time_taken_seconds;
        public int score;
        public int rating_stars;
        public string completed_at;

        public TrainingSessionRecord() {}

        public TrainingSessionRecord(string workerId, string module, bool passed, float duration, int sessionScore, int stars)
        {
            client_session_id = "DRILL_" + Guid.NewGuid().ToString("N").Substring(0, 12);
            worker_id = workerId;
            module_type = module;
            pass_protocol_success = passed;
            time_taken_seconds = Mathf.Round(duration * 100f) / 100f;
            score = sessionScore;
            rating_stars = stars;
            completed_at = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
        }

        public TrainingSessionPostDto ToPostDto()
        {
            return new TrainingSessionPostDto
            {
                client_session_id = client_session_id,
                worker_id = worker_id,
                module_type = module_type,
                pass_protocol_success = pass_protocol_success,
                time_taken_seconds = time_taken_seconds,
                score = score,
                rating_stars = rating_stars,
                completed_at = completed_at
            };
        }
    }

    [Serializable]
    public class HazardReportRecord
    {
        public string client_report_id;
        public string worker_id;
        public string hazard_type;
        public string zone;
        public string severity;
        public string description;
        public string status;
        public string reported_at;

        public HazardReportRecord() {}

        public HazardReportRecord(string workerId, string type, string hazardZone, string hazardSeverity, string desc)
        {
            client_report_id = "HAZ_" + Guid.NewGuid().ToString("N").Substring(0, 12);
            worker_id = workerId;
            hazard_type = type;
            zone = hazardZone;
            severity = hazardSeverity;
            description = desc;
            status = "Pending Triage";
            reported_at = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
        }

        public HazardReportPostDto ToPostDto()
        {
            return new HazardReportPostDto
            {
                client_report_id = client_report_id,
                worker_id = worker_id,
                hazard_type = hazard_type,
                zone = zone,
                severity = severity,
                description = description,
                status = status,
                reported_at = reported_at
            };
        }
    }

    [Serializable]
    public class SOSEventRecord
    {
        public string client_sos_id;
        public string worker_id;
        public string beacon_id;
        public string zone;
        public string status;
        public string triggered_at;

        public SOSEventRecord() {}

        public SOSEventRecord(string workerId, string beacon, string sosZone)
        {
            client_sos_id = "SOS_" + Guid.NewGuid().ToString("N").Substring(0, 12);
            worker_id = workerId;
            beacon_id = beacon;
            zone = sosZone;
            status = "Active Distress";
            triggered_at = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
        }

        public SOSEventPostDto ToPostDto()
        {
            return new SOSEventPostDto
            {
                client_sos_id = client_sos_id,
                worker_id = worker_id,
                beacon_id = beacon_id,
                zone = zone,
                status = status,
                triggered_at = triggered_at
            };
        }
    }

    [Serializable]
    public class OfflineDatabaseState
    {
        public WorkerRecord currentWorker;
        public List<WorkerRecord> registeredWorkers = new List<WorkerRecord>();
        public List<TrainingSessionRecord> pendingTrainingSessions = new List<TrainingSessionRecord>();
        public List<HazardReportRecord> pendingHazardReports = new List<HazardReportRecord>();
        public List<SOSEventRecord> pendingSOSEvents = new List<SOSEventRecord>();

        // Local historical cache for offline inspection
        public List<TrainingSessionRecord> syncedTrainingSessions = new List<TrainingSessionRecord>();
        public List<HazardReportRecord> syncedHazardReports = new List<HazardReportRecord>();
        public List<SOSEventRecord> syncedSOSEvents = new List<SOSEventRecord>();

        public string lastSyncTimestamp = "";
    }
}
