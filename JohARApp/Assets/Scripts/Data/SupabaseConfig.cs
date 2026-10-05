using UnityEngine;

namespace JohAR.Data
{
    public static class SupabaseConfig
    {
        // Supabase Cloud Project URL
        public const string DefaultUrl = "https://zxtliiedkohmsxwlnxux.supabase.co";
        public const string DefaultAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dGxpaWVka29obXN4d2xueHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTQyMDksImV4cCI6MjA5OTE5MDIwOX0.SKBNe-P6D5_ogibp_BX093HLFbD9-oYvmVn3SbLmNGc";

        private const string PrefsUrlKey = "JohAR_SupabaseUrl";
        private const string PrefsApiKey = "JohAR_SupabaseAnonKey";

        public static string Url
        {
            get => PlayerPrefs.GetString(PrefsUrlKey, DefaultUrl).TrimEnd('/');
            set
            {
                PlayerPrefs.SetString(PrefsUrlKey, value.TrimEnd('/'));
                PlayerPrefs.Save();
            }
        }

        public static string AnonKey
        {
            get => PlayerPrefs.GetString(PrefsApiKey, DefaultAnonKey);
            set
            {
                PlayerPrefs.SetString(PrefsApiKey, value);
                PlayerPrefs.Save();
            }
        }

        // Supabase PostgREST Endpoints
        public static string WorkersEndpoint => $"{Url}/rest/v1/workers";
        public static string TrainingEndpoint => $"{Url}/rest/v1/training_sessions";
        public static string HazardsEndpoint => $"{Url}/rest/v1/hazard_reports";
        public static string SOSEndpoint => $"{Url}/rest/v1/sos_events";

        // Auto-sync heartbeat interval in seconds
        public const float SyncIntervalSeconds = 8.0f;
    }
}
