-- ==============================================================================
-- JohAR Industrial Mine Safety & AR Training Database Schema
-- Supabase Migration: 20260906000000_johar_schema.sql
-- ==============================================================================

-- 1. Workers Table
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Level 1 Safety Trainee',
    sector TEXT NOT NULL DEFAULT 'Sector 4 Mine',
    language TEXT NOT NULL DEFAULT 'Hindi',
    safety_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Training Sessions Table
CREATE TABLE IF NOT EXISTS public.training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_session_id TEXT UNIQUE NOT NULL,
    worker_id TEXT NOT NULL REFERENCES public.workers(worker_id) ON UPDATE CASCADE ON DELETE CASCADE,
    module_type TEXT NOT NULL DEFAULT 'FIRE_SAFETY_PASS',
    pass_protocol_success BOOLEAN NOT NULL DEFAULT true,
    time_taken_seconds NUMERIC(6,2) NOT NULL DEFAULT 0.0,
    score INTEGER NOT NULL DEFAULT 100,
    rating_stars INTEGER NOT NULL DEFAULT 3,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Hazard Reports Table
CREATE TABLE IF NOT EXISTS public.hazard_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_report_id TEXT UNIQUE NOT NULL,
    worker_id TEXT REFERENCES public.workers(worker_id) ON UPDATE CASCADE ON DELETE SET NULL,
    hazard_type TEXT NOT NULL DEFAULT 'Toxic Gas Anomaly',
    zone TEXT NOT NULL DEFAULT 'Zone 4 Underground',
    severity TEXT NOT NULL DEFAULT 'High', -- 'Low', 'Medium', 'High', 'Critical'
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Pending Triage', -- 'Pending Triage', 'Investigating', 'Mitigated', 'Resolved'
    reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. SOS Distress Events Table
CREATE TABLE IF NOT EXISTS public.sos_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_sos_id TEXT UNIQUE NOT NULL,
    worker_id TEXT REFERENCES public.workers(worker_id) ON UPDATE CASCADE ON DELETE SET NULL,
    beacon_id TEXT NOT NULL DEFAULT 'Beacon-408',
    zone TEXT NOT NULL DEFAULT 'Exit Shaft B / Zone 4',
    status TEXT NOT NULL DEFAULT 'Active Distress', -- 'Active Distress', 'Rescue Dispatched', 'All Clear', 'Resolved'
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for rapid query & sync lookups
CREATE INDEX IF NOT EXISTS idx_workers_worker_id ON public.workers(worker_id);
CREATE INDEX IF NOT EXISTS idx_training_worker_id ON public.training_sessions(worker_id);
CREATE INDEX IF NOT EXISTS idx_training_completed_at ON public.training_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_hazard_severity_status ON public.hazard_reports(severity, status);
CREATE INDEX IF NOT EXISTS idx_hazard_reported_at ON public.hazard_reports(reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_sos_status ON public.sos_events(status);
CREATE INDEX IF NOT EXISTS idx_sos_triggered_at ON public.sos_events(triggered_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_events ENABLE ROW LEVEL SECURITY;

-- Permissive policies for Anon and Authenticated roles to facilitate mobile offline sync & admin web portal
DROP POLICY IF EXISTS "Allow anon select workers" ON public.workers;
CREATE POLICY "Allow anon select workers" ON public.workers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon insert/update workers" ON public.workers;
CREATE POLICY "Allow anon insert/update workers" ON public.workers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select training_sessions" ON public.training_sessions;
CREATE POLICY "Allow anon select training_sessions" ON public.training_sessions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon insert training_sessions" ON public.training_sessions;
CREATE POLICY "Allow anon insert training_sessions" ON public.training_sessions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select hazard_reports" ON public.hazard_reports;
CREATE POLICY "Allow anon select hazard_reports" ON public.hazard_reports FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon manage hazard_reports" ON public.hazard_reports;
CREATE POLICY "Allow anon manage hazard_reports" ON public.hazard_reports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select sos_events" ON public.sos_events;
CREATE POLICY "Allow anon select sos_events" ON public.sos_events FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon manage sos_events" ON public.sos_events;
CREATE POLICY "Allow anon manage sos_events" ON public.sos_events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
