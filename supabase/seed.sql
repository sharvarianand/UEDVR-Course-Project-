-- ==============================================================================
-- JohAR Mine Safety Seed Data
-- ==============================================================================

INSERT INTO public.workers (worker_id, name, role, sector, language, safety_score, created_at, last_active_at)
VALUES 
    ('W-7042', 'Ramesh Soren', 'Level 1 Safety Trainee', 'Sector 4 Mine', 'Hindi', 98, now() - INTERVAL '3 days', now() - INTERVAL '12 minutes'),
    ('W-4108', 'Birsa Marandi', 'Blasting Technician', 'Sector 2 Deep Shaft', 'Santali', 92, now() - INTERVAL '10 days', now() - INTERVAL '1 hour'),
    ('W-5521', 'Sunil Kumar Mahto', 'Heavy Machinery Operator', 'Sector 4 Mine', 'Hindi', 88, now() - INTERVAL '14 days', now() - INTERVAL '3 hours'),
    ('W-1099', 'Anjali Murmu', 'Environmental Air Monitor', 'Sector 1 Processing', 'Santali', 100, now() - INTERVAL '20 days', now() - INTERVAL '5 hours'),
    ('W-8834', 'Vikramaditya Roy', 'Underground Rescue Officer', 'Sector 3 Incline', 'English', 95, now() - INTERVAL '30 days', now() - INTERVAL '25 minutes')
ON CONFLICT (worker_id) DO UPDATE SET
    last_active_at = EXCLUDED.last_active_at,
    safety_score = EXCLUDED.safety_score;

INSERT INTO public.training_sessions (client_session_id, worker_id, module_type, pass_protocol_success, time_taken_seconds, score, rating_stars, completed_at, synced_at)
VALUES
    ('SESSION-SEED-01', 'W-7042', 'FIRE_SAFETY_PASS', true, 8.45, 100, 3, now() - INTERVAL '15 minutes', now() - INTERVAL '14 minutes'),
    ('SESSION-SEED-02', 'W-4108', 'FIRE_SAFETY_PASS', true, 12.10, 95, 3, now() - INTERVAL '2 hours', now() - INTERVAL '2 hours'),
    ('SESSION-SEED-03', 'W-5521', 'FIRE_SAFETY_PASS', true, 19.80, 85, 2, now() - INTERVAL '1 day', now() - INTERVAL '1 day'),
    ('SESSION-SEED-04', 'W-1099', 'FIRE_SAFETY_PASS', true, 7.20, 100, 3, now() - INTERVAL '1 day', now() - INTERVAL '1 day'),
    ('SESSION-SEED-05', 'W-8834', 'FIRE_SAFETY_PASS', true, 6.90, 100, 3, now() - INTERVAL '3 days', now() - INTERVAL '3 days')
ON CONFLICT (client_session_id) DO NOTHING;

INSERT INTO public.hazard_reports (client_report_id, worker_id, hazard_type, zone, severity, description, status, reported_at, synced_at)
VALUES
    ('HAZARD-SEED-01', 'W-7042', 'Methane Anomaly', 'Zone 4 Underground', 'Critical', 'CH4 concentration spike detected near conveyor junction C-4.', 'Investigating', now() - INTERVAL '45 minutes', now() - INTERVAL '44 minutes'),
    ('HAZARD-SEED-02', 'W-5521', 'Structural Wall Fracture', 'Sector 4 Incline Shaft', 'High', 'Hairline crack widening on timber support pillar #14.', 'Pending Triage', now() - INTERVAL '2 hours', now() - INTERVAL '2 hours'),
    ('HAZARD-SEED-03', 'W-4108', 'Water Influx', 'Sector 2 Level -150m', 'Medium', 'Uncontrolled seepage from north sump chamber.', 'Mitigated', now() - INTERVAL '1 day', now() - INTERVAL '1 day'),
    ('HAZARD-SEED-04', 'W-1099', 'Ventilation Fan Flutter', 'Vent Shaft #3', 'Low', 'Periodic vibration and RPM drop on secondary intake fan.', 'Resolved', now() - INTERVAL '3 days', now() - INTERVAL '3 days')
ON CONFLICT (client_report_id) DO NOTHING;

INSERT INTO public.sos_events (client_sos_id, worker_id, beacon_id, zone, status, triggered_at, resolved_at, synced_at)
VALUES
    ('SOS-SEED-01', 'W-7042', 'Beacon-408', 'Exit Shaft B / Zone 4', 'Active Distress', now() - INTERVAL '18 minutes', NULL, now() - INTERVAL '18 minutes'),
    ('SOS-SEED-02', 'W-4108', 'Beacon-212', 'Sector 2 Drainage Corridor', 'Resolved', now() - INTERVAL '2 days', now() - INTERVAL '2 days' + INTERVAL '24 minutes', now() - INTERVAL '2 days')
ON CONFLICT (client_sos_id) DO NOTHING;
