import { supabase } from './supabase.js';

const QUEUE_KEYS = {
  TRAININGS: 'johar_pending_trainings',
  HAZARDS: 'johar_pending_hazards',
  SOS: 'johar_pending_sos',
  WORKERS_CACHE: 'johar_cached_workers',
  ACTIVE_WORKER: 'johar_active_worker',
  LANGUAGE: 'johar_selected_language'
};

// Seed dataset in case app starts offline
const FALLBACK_WORKERS = [
  {
    worker_id: "W-7042",
    name: "Ramesh Soren",
    role: "Level 1 Safety Trainee",
    sector: "Sector 4 Mine",
    language: "Hindi",
    safety_score: 98,
    last_active_at: new Date().toISOString()
  },
  {
    worker_id: "W-5521",
    name: "Sunil Kumar Mahto",
    role: "Heavy Machinery Operator",
    sector: "Sector 4 Mine",
    language: "Hindi",
    safety_score: 88,
    last_active_at: new Date().toISOString()
  },
  {
    worker_id: "W-8834",
    name: "Vikramaditya Roy",
    role: "Underground Rescue Officer",
    sector: "Sector 3 Incline",
    language: "English",
    safety_score: 95,
    last_active_at: new Date().toISOString()
  },
  {
    worker_id: "W-4108",
    name: "Birsa Marandi",
    role: "Blasting Technician",
    sector: "Sector 2 Deep Shaft",
    language: "Santali",
    safety_score: 92,
    last_active_at: new Date().toISOString()
  },
  {
    worker_id: "W-1099",
    name: "Anjali Murmu",
    role: "Environmental Air Monitor",
    sector: "Sector 1 Processing",
    language: "Santali",
    safety_score: 100,
    last_active_at: new Date().toISOString()
  }
];

class OfflineSyncService {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
    this.subscribers = new Set();
    this.memoryStore = new Map();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
      this.initWorkersCache();
    }
  }

  storageGet(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return this.memoryStore.get(key) || null;
    } catch {
      return this.memoryStore.get(key) || null;
    }
  }

  storageSet(key, value) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
      this.memoryStore.set(key, value);
    } catch {
      this.memoryStore.set(key, value);
    }
  }

  storageRemove(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
      this.memoryStore.delete(key);
    } catch {
      this.memoryStore.delete(key);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    const status = {
      isOnline: this.isOnline,
      pendingCount: this.getPendingCount()
    };
    this.subscribers.forEach(cb => cb(status));
  }

  handleNetworkChange(isOnline) {
    this.isOnline = isOnline;
    console.log(`[OfflineSync] Network status changed: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
    this.notify();
    if (isOnline) {
      this.flushQueues();
    }
  }

  getPendingCount() {
    const trainings = this.getQueue(QUEUE_KEYS.TRAININGS).length;
    const hazards = this.getQueue(QUEUE_KEYS.HAZARDS).length;
    const sos = this.getQueue(QUEUE_KEYS.SOS).length;
    return trainings + hazards + sos;
  }

  getQueue(key) {
    try {
      const data = this.storageGet(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveQueue(key, items) {
    try {
      this.storageSet(key, JSON.stringify(items));
      this.notify();
    } catch (err) {
      console.error(`[OfflineSync] Failed to save queue ${key}:`, err);
    }
  }

  async initWorkersCache() {
    try {
      if (this.isOnline) {
        const { data, error } = await supabase.from('workers').select('*').order('worker_id');
        if (!error && data && data.length > 0) {
          this.storageSet(QUEUE_KEYS.WORKERS_CACHE, JSON.stringify(data));
          console.log(`[OfflineSync] Cached ${data.length} registered workers from Supabase.`);
          return data;
        }
      }
    } catch (err) {
      console.warn('[OfflineSync] Could not fetch remote workers, using fallback cache:', err);
    }

    if (!this.storageGet(QUEUE_KEYS.WORKERS_CACHE)) {
      this.storageSet(QUEUE_KEYS.WORKERS_CACHE, JSON.stringify(FALLBACK_WORKERS));
    }
    return this.getRegisteredWorkers();
  }

  getRegisteredWorkers() {
    const cached = this.getQueue(QUEUE_KEYS.WORKERS_CACHE);
    return cached && cached.length > 0 ? cached : FALLBACK_WORKERS;
  }

  async verifyWorker(workerId, autoSetActive = false) {
    const norm = (workerId || '').trim().toUpperCase();
    if (!norm) return null;

    // 1. Try cloud first if online
    if (this.isOnline) {
      try {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .ilike('worker_id', norm)
          .maybeSingle();

        if (!error && data) {
          const finalScore = typeof data.safety_score === 'number' ? data.safety_score : 0;
          data.safety_score = finalScore;
          data.score = finalScore;
          // Update activity timestamp in database
          supabase
            .from('workers')
            .update({ last_active_at: new Date().toISOString() })
            .ilike('worker_id', norm)
            .then();

          if (autoSetActive) {
            this.setActiveWorker(data);
          }
          return data;
        }
      } catch (err) {
        console.warn('[OfflineSync] Online worker verification failed, trying local cache:', err);
      }
    }

    // 2. Fallback to confirmed local cache of registered workers
    const cached = this.getQueue(QUEUE_KEYS.WORKERS_CACHE);
    const found = (cached.length > 0 ? cached : FALLBACK_WORKERS).find(
      w => w.worker_id.trim().toUpperCase() === norm
    );
    if (found) {
      const finalScore = typeof found.safety_score === 'number' ? found.safety_score : 0;
      found.safety_score = finalScore;
      found.score = finalScore;
      if (autoSetActive) {
        this.setActiveWorker(found);
      }
      return found;
    }

    // STRICT REJECTION: Only workers present in the mine database are permitted
    console.warn(`[OfflineSync] Access Denied: Worker ID '${norm}' is not registered in database.`);
    return null;
  }

  setActiveWorker(worker) {
    if (!worker) {
      this.clearActiveWorker();
      return;
    }
    this.storageSet(QUEUE_KEYS.ACTIVE_WORKER, JSON.stringify(worker));
  }

  clearActiveWorker() {
    this.storageRemove(QUEUE_KEYS.ACTIVE_WORKER);
  }

  getActiveWorker() {
    try {
      const data = this.storageGet(QUEUE_KEYS.ACTIVE_WORKER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Fetch all completed training sessions for a specific worker
  async getWorkerTrainings(workerId) {
    const norm = (workerId || '').trim().toUpperCase();
    if (!norm) return [];

    let cloudTrainings = [];
    if (this.isOnline) {
      try {
        const { data, error } = await supabase
          .from('training_sessions')
          .select('*')
          .ilike('worker_id', norm)
          .order('completed_at', { ascending: false });

        if (!error && data) {
          cloudTrainings = data;
        }
      } catch (err) {
        console.warn('[OfflineSync] Could not fetch training sessions from Supabase:', err);
      }
    }

    // Combine with locally queued trainings that haven't synced yet
    const localQueue = this.getQueue(QUEUE_KEYS.TRAININGS).filter(
      t => (t.worker_id || '').trim().toUpperCase() === norm
    );

    // Merge by client_session_id
    const merged = [...cloudTrainings];
    for (const pending of localQueue) {
      if (!merged.some(c => c.client_session_id === pending.client_session_id)) {
        merged.unshift(pending);
      }
    }

    return merged;
  }

  // Update worker safety competency score on Supabase
  async updateWorkerScore(workerId, newScore) {
    const norm = (workerId || '').trim().toUpperCase();
    if (!norm) return;

    if (this.isOnline) {
      try {
        const { error } = await supabase
          .from('workers')
          .update({
            safety_score: newScore,
            last_active_at: new Date().toISOString()
          })
          .ilike('worker_id', norm);

        if (!error) {
          console.log(`[OfflineSync] Updated worker ${norm} safety score to ${newScore} on Supabase.`);
        }
      } catch (err) {
        console.warn('[OfflineSync] Error updating worker score:', err);
      }
    }
  }

  // Real-time updates subscription across tables
  subscribeToRealtime(callback) {
    try {
      const channel = supabase
        .channel('worker_app_realtime_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'training_sessions' }, (payload) => {
          console.log('[Realtime] training_sessions change detected:', payload);
          callback && callback('training_sessions', payload);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, (payload) => {
          console.log('[Realtime] workers change detected:', payload);
          callback && callback('workers', payload);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'hazard_reports' }, (payload) => {
          console.log('[Realtime] hazard_reports change detected:', payload);
          callback && callback('hazard_reports', payload);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sos_events' }, (payload) => {
          console.log('[Realtime] sos_events change detected:', payload);
          callback && callback('sos_events', payload);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('[OfflineSync] Realtime subscription error:', err);
      return () => {};
    }
  }

  // Record Training Drill Session (e.g. Fire Safety AR Drill)
  async recordTrainingSession(moduleTypeOrObj, passProtocolSuccess, timeTakenSeconds, score, ratingStars) {
    const worker = this.getActiveWorker();
    let moduleType = moduleTypeOrObj;
    let success = passProtocolSuccess;
    let duration = timeTakenSeconds;
    let sc = score;
    let stars = ratingStars;
    let workerId = worker?.worker_id || 'W-5521';

    if (typeof moduleTypeOrObj === 'object' && moduleTypeOrObj !== null) {
      moduleType = moduleTypeOrObj.module_type || moduleTypeOrObj.module_id || 'FIRE_SAFETY_PASS';
      success = moduleTypeOrObj.pass_protocol_success !== undefined ? moduleTypeOrObj.pass_protocol_success : true;
      duration = moduleTypeOrObj.time_taken_seconds || moduleTypeOrObj.duration_seconds || 10.0;
      sc = moduleTypeOrObj.score !== undefined ? moduleTypeOrObj.score : 100;
      stars = moduleTypeOrObj.rating_stars || 3;
      if (moduleTypeOrObj.worker_id) workerId = moduleTypeOrObj.worker_id;
    }

    const sessionRecord = {
      client_session_id: `SESSION-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      worker_id: workerId,
      module_type: moduleType,
      pass_protocol_success: success !== undefined ? success : true,
      time_taken_seconds: parseFloat(duration) || 10.0,
      score: sc || 100,
      rating_stars: stars || 3,
      completed_at: new Date().toISOString()
    };

    if (this.isOnline) {
      try {
        const { data, error } = await supabase.from('training_sessions').insert([sessionRecord]).select();
        if (!error && data && data.length > 0) {
          console.log('[OfflineSync] Training session synced directly to Supabase cloud!', data[0]);
          // Calculate real safety score across the 3 core modules (PPE, Fire, Gas)
          const history = await this.getWorkerTrainings(workerId);
          const passedSessions = (history || []).filter(t => t.pass_protocol_success);
          const distinctModules = new Set(passedSessions.map(t => (t.module_type || '').toUpperCase()));
          const avgSc = passedSessions.length > 0
            ? Math.round(passedSessions.reduce((acc, t) => acc + (Number(t.score) || 100), 0) / passedSessions.length)
            : sc;
          const trueScore = Math.min(100, Math.round((distinctModules.size / 3) * avgSc));
          await this.updateWorkerScore(workerId, trueScore);
          return { success: true, synced: true, record: data[0] };
        } else if (error) {
          console.warn('[OfflineSync] Supabase insert warning:', error.message || error);
        }
      } catch (err) {
        console.warn('[OfflineSync] Failed to post training online, queuing locally:', err);
      }
    }

    // Queue offline
    const queue = this.getQueue(QUEUE_KEYS.TRAININGS);
    queue.push(sessionRecord);
    this.saveQueue(QUEUE_KEYS.TRAININGS, queue);
    console.log(`[OfflineSync] Training session queued offline. Total pending: ${queue.length}`);
    return { success: true, synced: false, record: sessionRecord };
  }

  // Record Incident / Hazard Report
  async recordHazardReport(hazardType, zone, severity, description) {
    const worker = this.getActiveWorker();
    const hazardRecord = {
      client_report_id: `HAZARD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      worker_id: worker.worker_id,
      hazard_type: hazardType,
      zone: zone || "Sector 4 Mine • Pit 4",
      severity: severity || "High",
      description: description || "Reported via JohAR Web Hub",
      status: "Pending Triage",
      reported_at: new Date().toISOString()
    };

    if (this.isOnline) {
      try {
        const { error } = await supabase.from('hazard_reports').insert([hazardRecord]);
        if (!error) {
          console.log('[OfflineSync] Hazard report synced to Supabase cloud!');
          return { success: true, synced: true, record: hazardRecord };
        }
      } catch (err) {
        console.warn('[OfflineSync] Hazard report failed online, queuing:', err);
      }
    }

    const queue = this.getQueue(QUEUE_KEYS.HAZARDS);
    queue.push(hazardRecord);
    this.saveQueue(QUEUE_KEYS.HAZARDS, queue);
    return { success: true, synced: false, record: hazardRecord };
  }

  // Trigger SOS Emergency Distress Beacon
  async recordSOSEvent(beaconId, zone) {
    const worker = this.getActiveWorker();
    const sosRecord = {
      client_sos_id: `SOS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      worker_id: worker.worker_id,
      beacon_id: beaconId || `BEACON-SHAFT-4`,
      zone: zone || "Exit Shaft B / Zone 4",
      status: "Active Distress",
      triggered_at: new Date().toISOString(),
      resolved_at: null
    };

    if (this.isOnline) {
      try {
        const { error } = await supabase.from('sos_events').insert([sosRecord]);
        if (!error) {
          console.log('[OfflineSync] SOS distress event sent to Supabase cloud!');
          return { success: true, synced: true, record: sosRecord };
        }
      } catch (err) {
        console.warn('[OfflineSync] SOS dispatch failed online, queuing with priority:', err);
      }
    }

    const queue = this.getQueue(QUEUE_KEYS.SOS);
    queue.push(sosRecord);
    this.saveQueue(QUEUE_KEYS.SOS, queue);
    return { success: true, synced: false, record: sosRecord };
  }

  // Background Flusher
  async flushQueues() {
    if (!this.isOnline) return;

    // 1. Flush SOS
    const sosQueue = this.getQueue(QUEUE_KEYS.SOS);
    if (sosQueue.length > 0) {
      const remainingSOS = [];
      for (const item of sosQueue) {
        try {
          const { error } = await supabase.from('sos_events').insert([item]);
          if (error) remainingSOS.push(item);
        } catch {
          remainingSOS.push(item);
        }
      }
      this.saveQueue(QUEUE_KEYS.SOS, remainingSOS);
    }

    // 2. Flush Hazards
    const hazardQueue = this.getQueue(QUEUE_KEYS.HAZARDS);
    if (hazardQueue.length > 0) {
      const remainingHazards = [];
      for (const item of hazardQueue) {
        try {
          const { error } = await supabase.from('hazard_reports').insert([item]);
          if (error) remainingHazards.push(item);
        } catch {
          remainingHazards.push(item);
        }
      }
      this.saveQueue(QUEUE_KEYS.HAZARDS, remainingHazards);
    }

    // 3. Flush Trainings
    const trainingQueue = this.getQueue(QUEUE_KEYS.TRAININGS);
    if (trainingQueue.length > 0) {
      const remainingTrainings = [];
      for (const item of trainingQueue) {
        try {
          const { error } = await supabase.from('training_sessions').insert([item]);
          if (error) remainingTrainings.push(item);
        } catch {
          remainingTrainings.push(item);
        }
      }
      this.saveQueue(QUEUE_KEYS.TRAININGS, remainingTrainings);
    }

    console.log('[OfflineSync] Queue flush completed. Remaining pending:', this.getPendingCount());
    this.notify();
  }
}

export const offlineSync = new OfflineSyncService();
