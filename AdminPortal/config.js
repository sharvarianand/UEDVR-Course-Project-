// ==============================================================================
// JohAR Web Admin Portal - Configuration & Default Settings
// ==============================================================================

const DEFAULT_CONFIG = {
    // Supabase Credentials (can be updated dynamically in the Admin Settings modal)
    supabaseUrl: "https://zxtliiedkohmsxwlnxux.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dGxpaWVka29obXN4d2xueHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTQyMDksImV4cCI6MjA5OTE5MDIwOX0.SKBNe-P6D5_ogibp_BX093HLFbD9-oYvmVn3SbLmNGc",
    autoPollIntervalMs: 2500,
    enableRealtimeSound: true
};

// LocalStorage Persistence Keys
const STORAGE_KEYS = {
    URL: "johar_admin_supabase_url",
    KEY: "johar_admin_supabase_key",
    POLL_INTERVAL: "johar_admin_poll_interval"
};

function getSavedConfig() {
    return {
        supabaseUrl: localStorage.getItem(STORAGE_KEYS.URL) || DEFAULT_CONFIG.supabaseUrl,
        supabaseAnonKey: localStorage.getItem(STORAGE_KEYS.KEY) || DEFAULT_CONFIG.supabaseAnonKey,
        autoPollIntervalMs: parseInt(localStorage.getItem(STORAGE_KEYS.POLL_INTERVAL) || DEFAULT_CONFIG.autoPollIntervalMs, 10),
        enableRealtimeSound: DEFAULT_CONFIG.enableRealtimeSound
    };
}

function saveConfig(url, key, pollInterval) {
    if (url) localStorage.setItem(STORAGE_KEYS.URL, url.trim().replace(/\/$/, ''));
    if (key) localStorage.setItem(STORAGE_KEYS.KEY, key.trim());
    if (pollInterval) localStorage.setItem(STORAGE_KEYS.POLL_INTERVAL, pollInterval);
}

// Built-in Seed / Demo Dataset to ensure the Admin Portal is immediately interactive
const DEMO_FALLBACK_DATA = {
    workers: [
        { id: "w-1", worker_id: "W-7042", name: "Ramesh Soren", role: "Level 1 Safety Trainee", sector: "Sector 4 Mine", language: "Hindi", safety_score: 98, last_active_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(), created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
        { id: "w-2", worker_id: "W-4108", name: "Birsa Marandi", role: "Blasting Technician", sector: "Sector 2 Deep Shaft", language: "Santali", safety_score: 92, last_active_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(), created_at: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString() },
        { id: "w-3", worker_id: "W-5521", name: "Sunil Kumar Mahto", role: "Heavy Machinery Operator", sector: "Sector 4 Mine", language: "Hindi", safety_score: 88, last_active_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), created_at: new Date(Date.now() - 1000 * 60 * 60 * 336).toISOString() },
        { id: "w-4", worker_id: "W-1099", name: "Anjali Murmu", role: "Environmental Air Monitor", sector: "Sector 1 Processing", language: "Santali", safety_score: 100, last_active_at: new Date(Date.now() - 1000 * 60 * 320).toISOString(), created_at: new Date(Date.now() - 1000 * 60 * 60 * 480).toISOString() },
        { id: "w-5", worker_id: "W-8834", name: "Vikramaditya Roy", role: "Underground Rescue Officer", sector: "Sector 3 Incline", language: "English", safety_score: 95, last_active_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), created_at: new Date(Date.now() - 1000 * 60 * 60 * 720).toISOString() }
    ],
    trainings: [
        { id: "t-1", client_session_id: "SESSION-SEED-01", worker_id: "W-7042", module_type: "FIRE_SAFETY_PASS", pass_protocol_success: true, time_taken_seconds: 8.45, score: 100, rating_stars: 3, completed_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: "t-2", client_session_id: "SESSION-SEED-02", worker_id: "W-4108", module_type: "FIRE_SAFETY_PASS", pass_protocol_success: true, time_taken_seconds: 12.10, score: 95, rating_stars: 3, completed_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: "t-3", client_session_id: "SESSION-SEED-03", worker_id: "W-5521", module_type: "FIRE_SAFETY_PASS", pass_protocol_success: true, time_taken_seconds: 19.80, score: 85, rating_stars: 2, completed_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
        { id: "t-4", client_session_id: "SESSION-SEED-04", worker_id: "W-1099", module_type: "FIRE_SAFETY_PASS", pass_protocol_success: true, time_taken_seconds: 7.20, score: 100, rating_stars: 3, completed_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
        { id: "t-5", client_session_id: "SESSION-SEED-05", worker_id: "W-8834", module_type: "FIRE_SAFETY_PASS", pass_protocol_success: true, time_taken_seconds: 6.90, score: 100, rating_stars: 3, completed_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() }
    ],
    hazards: [
        { id: "h-1", client_report_id: "HAZARD-SEED-01", worker_id: "W-7042", hazard_type: "Methane Anomaly", zone: "Zone 4 Underground", severity: "Critical", description: "CH4 concentration spike detected near conveyor junction C-4.", status: "Investigating", reported_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
        { id: "h-2", client_report_id: "HAZARD-SEED-02", worker_id: "W-5521", hazard_type: "Structural Wall Fracture", zone: "Sector 4 Incline Shaft", severity: "High", description: "Hairline crack widening on timber support pillar #14.", status: "Pending Triage", reported_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: "h-3", client_report_id: "HAZARD-SEED-03", worker_id: "W-4108", hazard_type: "Water Influx", zone: "Sector 2 Level -150m", severity: "Medium", description: "Uncontrolled seepage from north sump chamber.", status: "Mitigated", reported_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        { id: "h-4", client_report_id: "HAZARD-SEED-04", worker_id: "W-1099", hazard_type: "Ventilation Fan Flutter", zone: "Vent Shaft #3", severity: "Low", description: "Periodic vibration and RPM drop on secondary intake fan.", status: "Resolved", reported_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() }
    ],
    sos: [
        { id: "s-1", client_sos_id: "SOS-SEED-01", worker_id: "W-7042", beacon_id: "Beacon-408", zone: "Exit Shaft B / Zone 4", status: "Active Distress", triggered_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(), resolved_at: null },
        { id: "s-2", client_sos_id: "SOS-SEED-02", worker_id: "W-4108", beacon_id: "Beacon-212", zone: "Sector 2 Drainage Corridor", status: "Resolved", triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString() }
    ]
};

if (typeof window !== 'undefined') {
    window.DEFAULT_CONFIG = DEFAULT_CONFIG;
    window.STORAGE_KEYS = STORAGE_KEYS;
    window.getSavedConfig = getSavedConfig;
    window.saveConfig = saveConfig;
    window.DEMO_FALLBACK_DATA = DEMO_FALLBACK_DATA;
}
