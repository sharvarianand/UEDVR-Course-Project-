# JohAR Supabase Setup & Deployment Guide

This project includes complete Supabase database schemas, migrations, and seed data for offline & online synchronization of worker profiles, AR training drills, hazard reports, and SOS distress events.

---

## Active Cloud Project (Already Configured & Deployed!)

Your Supabase project has been connected and configured:
- **Project Ref**: `zxtliiedkohmsxwlnxux` (`itssahildhavale@gmail.com's Project`)
- **API URL**: `https://zxtliiedkohmsxwlnxux.supabase.co`
- **Status**: **LIVE & POPULATED** (All schemas, RLS policies, and seed rows applied)
- **Admin Portal**: Running locally on `http://localhost:3000` (auto-syncing with cloud every 6s)

Both `JohARApp/Assets/Scripts/Data/SupabaseConfig.cs` and `AdminPortal/config.js` have been populated with your live credentials.

---

## Option 1: Supabase Cloud Dashboard

You can view and inspect your database directly in your browser:
1. Open [Supabase Table Editor](https://supabase.com/dashboard/project/zxtliiedkohmsxwlnxux/editor).
2. The 4 tables are already active: `workers`, `training_sessions`, `hazard_reports`, `sos_events`.

---

## Option 2: Local Supabase CLI (Offline / Local Dev)

If you have Docker installed and want to run Supabase completely locally on your machine:

```bash
# 1. Start local Supabase containers (Postgres, Kong, PostgREST, Studio)
npx supabase start

# 2. Apply migrations and seed data automatically
npx supabase db reset

# 3. View database in local Supabase Studio
# Usually opens at: http://localhost:54323
```

Local API credentials will be output to your terminal:
- **API URL**: `http://localhost:54321` (or your local IP for mobile LAN testing, e.g. `http://192.168.1.X:54321`)
- **anon key**: Listed in terminal output.

---

## Database Architecture Summary

| Table | Purpose | Sync Method |
|---|---|---|
| `workers` | Worker ID, credentials, safety score, preferred language | Upsert on app login |
| `training_sessions` | AR drill completion times, scores, P.A.S.S. protocol compliance | FIFO queued sync |
| `hazard_reports` | Methane gas leaks, wall fractures, equipment failures with triage status | FIFO queued sync + Admin status updates |
| `sos_events` | Real-time miner emergency distress signals and rescue beacon status | Priority sync + Live Admin Portal alerts |

---

## Offline-First Guarantee

The Unity app writes all transactions immediately to `Application.persistentDataPath/johar_offline_data.json`.
Even if underground miners lose Wi-Fi or cellular connectivity:
- The app operates with zero lag.
- As soon as the device reconnects to any network, `OfflineSyncManager` automatically flushes and confirms every queued transaction.
