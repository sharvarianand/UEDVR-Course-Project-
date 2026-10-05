// ==============================================================================
// JohAR Web Admin Portal - Operations Logic & Supabase Sync
// ==============================================================================

let currentConfig = getSavedConfig();
let state = {
    workers: [],
    trainings: [],
    isUsingFallback: false,
    activeTab: 'overview',
    audioCtx: null
};

// ==============================================================================
// Initialization
// ==============================================================================
function bootAdminPortal() {
    initNavigation();
    initModals();
    initSettingsForm();
    initSearchAndFilters();
    initHashRouting();
    
    // Initial fetch, start auto-poll, and connect Realtime WebSockets
    fetchDashboardData();
    setInterval(fetchDashboardData, currentConfig.autoPollIntervalMs);
    initRealtimeSubscription();

    // Bind audio unlock on first user interaction
    document.body.addEventListener('click', () => {
        if (!state.audioCtx) {
            try {
                state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch(e) {
                console.warn("AudioContext not supported", e);
            }
        }
    }, { once: true });
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", bootAdminPortal);
} else {
    bootAdminPortal();
}

// ==============================================================================
// Navigation / Tabs
// ==============================================================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const btn = item.querySelector('button');
        btn.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const targetTab = item.dataset.tab;
            state.activeTab = targetTab;
            if (window.location.hash.replace('#', '') !== targetTab) {
                window.location.hash = targetTab;
            }

            document.querySelectorAll('.tab-view').forEach(view => {
                view.classList.remove('active');
            });

            const targetView = document.getElementById(`tab-${targetTab}`);
            if (targetView) targetView.classList.add('active');

            // Update Page Title
            const pageTitleEl = document.getElementById('pageTitle');
            const pageDescEl = document.getElementById('pageDesc');
            if (pageTitleEl) {
                switch(targetTab) {
                    case 'overview':
                        pageTitleEl.innerText = 'Mine Safety Operations Center';
                        pageDescEl.innerText = 'Real-time telemetry, AR training drill completion & personnel safety certifications.';
                        break;
                    case 'workers':
                        pageTitleEl.innerText = 'Worker Directory & Credentials';
                        pageDescEl.innerText = 'Underground personnel profiles, safety certifications & sector assignments.';
                        break;
                    case 'trainings':
                        pageTitleEl.innerText = 'AR Safety & Field Protocol Drills';
                        pageDescEl.innerText = 'Simulation logs, completion durations, protocol accuracy & star ratings.';
                        break;
                }
            }
        });
    });

    // Refresh Button
    const refreshBtn = document.getElementById('btnRefresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<span>⟳</span> Syncing...';
            fetchDashboardData().finally(() => {
                setTimeout(() => {
                    refreshBtn.disabled = false;
                    refreshBtn.innerHTML = '<i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i><span>Sync</span>';
                    if (window.lucide && typeof window.lucide.createIcons === 'function') {
                        window.lucide.createIcons();
                    }
                }, 500);
            });
        });
    }
}

function initHashRouting() {
    function applyHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const btn = document.querySelector(`.nav-item[data-tab="${hash}"] button`);
            if (btn) btn.click();
        }
    }
    window.addEventListener('hashchange', applyHash);
    if (window.location.hash) {
        setTimeout(applyHash, 100);
    }
}

// ==============================================================================
// Data Fetching & Sync
// ==============================================================================
async function fetchDashboardData() {
    const pingDot = document.getElementById('pingDot');
    const pingText = document.getElementById('pingText');
    const startTime = performance.now();

    try {
        const headers = {
            'apikey': currentConfig.supabaseAnonKey,
            'Authorization': `Bearer ${currentConfig.supabaseAnonKey}`
        };

        // Parallel fetch of workers and training_sessions
        const [workersRes, trainingsRes] = await Promise.all([
            fetch(`${currentConfig.supabaseUrl}/rest/v1/workers?select=*&order=created_at.asc`, { headers }),
            fetch(`${currentConfig.supabaseUrl}/rest/v1/training_sessions?select=*&order=completed_at.desc&limit=100`, { headers })
        ]);

        if (!workersRes.ok || !trainingsRes.ok) {
            throw new Error(`Supabase query failed: workers ${workersRes.status}, trainings ${trainingsRes.status}`);
        }

        const workers = await workersRes.json();
        const trainings = await trainingsRes.json();

        state.workers = workers;
        state.trainings = trainings;
        state.isUsingFallback = false;

        const latency = Math.round(performance.now() - startTime);
        if (pingDot) {
            pingDot.className = 'ping-dot';
            pingText.innerText = `Supabase Online (${latency}ms)`;
        }
    } catch (err) {
        console.warn("[AdminPortal] Fetch failed, falling back to local dataset:", err);
        state.workers = DEMO_FALLBACK_DATA.workers;
        state.trainings = DEMO_FALLBACK_DATA.trainings;
        state.isUsingFallback = true;

        if (pingDot) {
            pingDot.className = 'ping-dot offline';
            pingText.innerText = `Demo Mode (Offline)`;
        }
    }

    renderAllViews();
}

// ==============================================================================
// Render All Views
// ==============================================================================
function renderAllViews() {
    renderKPIs();
    renderOverviewRecentFeeds();
    renderOverviewWorkersList();
    renderWorkersTable();
    renderTrainingsTable();
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// Safe Dynamic Safety Score Calculation:
// Workers with 0 passed drills are strictly 0%.
// Workers with passed drills display verified safety_score or computed average score.
function calculateWorkerSafetyScore(worker, trainings) {
    if (!worker) return 0;
    const workerDrills = (trainings || []).filter(t => t.worker_id === worker.worker_id && t.pass_protocol_success);
    if (!workerDrills || workerDrills.length === 0) {
        return 0;
    }
    if (typeof worker.safety_score === 'number' && worker.safety_score > 0) {
        return Math.min(100, Math.max(0, Math.round(worker.safety_score)));
    }
    const avgScore = Math.round(workerDrills.reduce((acc, t) => acc + (Number(t.score) || 100), 0) / workerDrills.length);
    return Math.min(100, avgScore);
}

// 1. KPI Cards
function renderKPIs() {
    // Workers Count
    const kpiWorkersEl = document.getElementById('kpiWorkersVal');
    if (kpiWorkersEl) kpiWorkersEl.innerText = state.workers.length;

    // Drills Count & Dynamic Compliance Percentage
    const kpiDrillsEl = document.getElementById('kpiDrillsVal');
    const kpiDrillsSubEl = document.getElementById('kpiDrillsSub');
    const certifiedWorkers = state.workers.filter(w => 
        state.trainings.some(t => t.worker_id === w.worker_id && t.pass_protocol_success)
    );
    const compliancePct = state.workers.length > 0 
        ? Math.round((certifiedWorkers.length / state.workers.length) * 100) 
        : 0;

    if (kpiDrillsEl) {
        kpiDrillsEl.innerText = state.trainings.length;
        if (kpiDrillsSubEl) {
            kpiDrillsSubEl.innerHTML = `<span>●</span> ${certifiedWorkers.length}/${state.workers.length} Certified (${compliancePct}%)`;
        }
    }

    // DGMS Compliance
    const kpiComplianceEl = document.getElementById('kpiComplianceVal');
    if (kpiComplianceEl) {
        kpiComplianceEl.innerText = `${compliancePct}%`;
    }

    // Average Safety Score
    const kpiAvgScoreEl = document.getElementById('kpiAvgScoreVal');
    if (kpiAvgScoreEl) {
        const total = state.workers.length;
        const avgScore = total > 0
            ? Math.round(state.workers.reduce((acc, w) => acc + calculateWorkerSafetyScore(w, state.trainings), 0) / total)
            : 0;
        kpiAvgScoreEl.innerText = `${avgScore}%`;
    }

    // Nav Badges
    const badgeWorkers = document.getElementById('badgeWorkers');
    if (badgeWorkers) badgeWorkers.innerText = state.workers.length;

    const badgeTrainings = document.getElementById('badgeTrainings');
    if (badgeTrainings) badgeTrainings.innerText = state.trainings.length;
}

// 2. Overview Recent Feeds
function renderOverviewRecentFeeds() {
    const feedList = document.getElementById('overviewRecentList');
    if (!feedList) return;

    feedList.innerHTML = '';

    if (state.trainings.length === 0) {
        feedList.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 13px;">
                No field training drills recorded yet.
            </div>
        `;
        return;
    }

    state.trainings.slice(0, 8).forEach(t => {
        const item = document.createElement('div');
        item.className = 'panel';
        item.style.padding = '12px 16px';
        item.style.marginBottom = '8px';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.borderRadius = '10px';

        const timeStr = t.completed_at ? formatRelativeTime(new Date(t.completed_at)) : '';
        const scoreVal = Math.max(0, Math.min(100, Math.round(Number(t.score ?? 100))));
        const gradeVal = scoreVal >= 90 ? 'A+' : scoreVal >= 80 ? 'A' : scoreVal >= 70 ? 'B' : scoreVal >= 60 ? 'C' : 'D';
        const starsCount = Math.max(1, Math.min(3, Math.round(Number(t.rating_stars) || 3)));
        const starsStr = '★'.repeat(starsCount);

        item.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                    <strong style="color: var(--primary-amber); font-family: 'JetBrains Mono', monospace; font-size: 13px;">${t.worker_id}</strong>
                    <span class="badge badge-warning" style="font-size: 10px;">${formatModuleName(t.module_type)}</span>
                    <span class="badge badge-success" style="font-size: 10px;">${t.pass_protocol_success ? '✓ Passed' : 'Incomplete'}</span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted);">
                    Time: ${t.time_taken_seconds}s • Score: ${scoreVal}/100 (Grade ${gradeVal}) • Stars: ${starsStr}
                </div>
            </div>
            <span style="font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace;">${timeStr}</span>
        `;
        feedList.appendChild(item);
    });
}

// 3. Overview Worker Readiness List
function renderOverviewWorkersList() {
    const listEl = document.getElementById('overviewWorkersList');
    if (!listEl) return;

    listEl.innerHTML = '';

    state.workers.forEach(w => {
        const isCertified = state.trainings.some(t => t.worker_id === w.worker_id && t.pass_protocol_success);
        const drillCount = state.trainings.filter(t => t.worker_id === w.worker_id).length;

        const item = document.createElement('div');
        item.className = 'panel';
        item.style.padding = '12px 16px';
        item.style.marginBottom = '8px';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.borderRadius = '10px';

        const initial = w.name ? w.name.charAt(0).toUpperCase() : 'W';

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; color: #fff;">
                    ${initial}
                </div>
                <div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <strong style="font-size: 13px; color: #fff;">${w.name}</strong>
                        <span style="font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace;">${w.worker_id}</span>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted);">
                        ${w.role} • ${w.sector}
                    </div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace;">${drillCount} drill${drillCount !== 1 ? 's' : ''}</span>
                ${isCertified 
                    ? '<span class="badge badge-success" style="font-size: 10px;">✓ Certified</span>'
                    : '<span class="badge badge-gray" style="font-size: 10px;">Pending</span>'
                }
                <button class="btn" style="padding: 3px 8px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" onclick="openWorkerQRCode('${w.worker_id}')" title="Display Login QR Code">
                    <i data-lucide="qr-code" style="width: 12px; height: 12px;"></i>
                    <span>QR</span>
                </button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

// 4. Workers Table
function renderWorkersTable() {
    const tbody = document.getElementById('workersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const query = (document.getElementById('workerSearchInput')?.value || '').toLowerCase().trim();
    const sectorFilter = document.getElementById('workerSectorFilter')?.value || 'ALL';

    const filtered = state.workers.filter(w => {
        const matchesQuery = !query || 
            (w.worker_id && w.worker_id.toLowerCase().includes(query)) ||
            (w.name && w.name.toLowerCase().includes(query)) ||
            (w.role && w.role.toLowerCase().includes(query));
        const matchesSector = sectorFilter === 'ALL' || w.sector === sectorFilter;
        return matchesQuery && matchesSector;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-dim); padding: 30px;">No registered workers found matching search criteria.</td></tr>`;
        return;
    }

    filtered.forEach(w => {
        const tr = document.createElement('tr');
        const workerDrills = state.trainings.filter(t => t.worker_id === w.worker_id);
        const isCertified = workerDrills.some(t => t.pass_protocol_success);
        const displayScore = calculateWorkerSafetyScore(w, state.trainings);

        tr.innerHTML = `
            <td><strong style="font-family: 'JetBrains Mono', monospace; color: var(--primary-amber);">${w.worker_id}</strong></td>
            <td><strong>${w.name}</strong></td>
            <td style="color: var(--text-muted);">${w.role}</td>
            <td><span class="badge badge-gray">${w.sector}</span></td>
            <td>${w.language}</td>
            <td>
                ${isCertified 
                    ? '<span class="badge badge-success">✓ P.A.S.S. Certified</span>' 
                    : '<span class="badge badge-gray">Training Required</span>'
                }
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="progress-bar" style="width: 60px;">
                        <div class="progress-fill" style="width: ${displayScore}%;"></div>
                    </div>
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;">${displayScore}%</span>
                </div>
            </td>
            <td>
                <div style="display: flex; gap: 5px;">
                    <button class="btn" style="padding: 4px 8px; font-size: 11px;" onclick="openWorkerDetails('${w.worker_id}')">
                        Inspect
                    </button>
                    <button class="btn btn-primary" style="padding: 4px 8px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" onclick="openWorkerQRCode('${w.worker_id}')" title="Display Login QR Code">
                        <i data-lucide="qr-code" style="width: 12px; height: 12px;"></i>
                        <span>QR Code</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 5. Trainings Table
function renderTrainingsTable() {
    const tbody = document.getElementById('trainingsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (state.trainings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-dim); padding: 30px;">No AR training logs recorded in Supabase.</td></tr>`;
        return;
    }

    state.trainings.forEach(t => {
        const tr = document.createElement('tr');
        const scoreVal = Math.max(0, Math.min(100, Math.round(Number(t.score ?? 100))));
        const gradeVal = scoreVal >= 90 ? 'A+' : scoreVal >= 80 ? 'A' : scoreVal >= 70 ? 'B' : scoreVal >= 60 ? 'C' : 'D';
        const gradeColor = scoreVal >= 90 ? '#10b981' : scoreVal >= 80 ? '#f59e0b' : scoreVal >= 70 ? '#3b82f6' : scoreVal >= 60 ? '#f97316' : '#ef4444';
        const starsCount = Math.max(1, Math.min(3, Math.round(Number(t.rating_stars) || 3)));
        const stars = '★'.repeat(starsCount) + '☆'.repeat(3 - starsCount);

        tr.innerHTML = `
            <td style="font-family: 'JetBrains Mono', monospace; color: var(--text-dim); font-size: 11px;">${t.client_session_id || t.id}</td>
            <td><strong style="color: var(--primary-amber); font-family: 'JetBrains Mono', monospace;">${t.worker_id}</strong></td>
            <td><span class="badge badge-warning">${formatModuleName(t.module_type)}</span></td>
            <td>
                ${t.pass_protocol_success 
                    ? '<span class="badge badge-success">✓ Protocol Passed</span>' 
                    : '<span class="badge badge-danger">Failed / Incomplete</span>'
                }
            </td>
            <td style="font-family: 'JetBrains Mono', monospace; color: #fbbf24;">${t.time_taken_seconds}s</td>
            <td>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <strong style="color: var(--safety-green); font-family: 'JetBrains Mono', monospace;">${scoreVal}/100</strong>
                    <span style="font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; background: rgba(255,255,255,0.06); color: ${gradeColor}; border: 1px solid rgba(255,255,255,0.1);">Grade ${gradeVal}</span>
                </div>
            </td>
            <td style="color: var(--primary-amber); font-size: 12px;">${stars}</td>
            <td style="color: var(--text-dim); font-size: 11px; font-family: 'JetBrains Mono', monospace;">${t.completed_at ? new Date(t.completed_at).toLocaleString() : ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ==============================================================================
// Search & Filter Events
// ==============================================================================
function initSearchAndFilters() {
    document.getElementById('workerSearchInput')?.addEventListener('input', renderWorkersTable);
    document.getElementById('workerSectorFilter')?.addEventListener('change', renderWorkersTable);
}

// ==============================================================================
// Modals & Settings
// ==============================================================================
function initModals() {
    // Settings Modal
    document.getElementById('btnOpenSettings')?.addEventListener('click', () => {
        document.getElementById('modalSettings').classList.add('active');
        document.getElementById('cfgSupabaseUrl').value = currentConfig.supabaseUrl;
        document.getElementById('cfgSupabaseKey').value = currentConfig.supabaseAnonKey;
        document.getElementById('cfgPollInterval').value = currentConfig.autoPollIntervalMs;
    });

    // Register Worker Modal
    document.getElementById('btnRegisterWorker')?.addEventListener('click', () => {
        document.getElementById('modalRegisterWorker').classList.add('active');
    });

    // Print QR Badge Button
    document.getElementById('btnPrintQRBadge')?.addEventListener('click', () => {
        window.print();
    });

    // Close buttons
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        });
    });
}

function initSettingsForm() {
    document.getElementById('formSettings')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = document.getElementById('cfgSupabaseUrl').value;
        const key = document.getElementById('cfgSupabaseKey').value;
        const interval = document.getElementById('cfgPollInterval').value;

        saveConfig(url, key, interval);
        currentConfig = getSavedConfig();

        document.getElementById('modalSettings').classList.remove('active');
        fetchDashboardData();
    });

    // Test Ping Button
    document.getElementById('btnTestPing')?.addEventListener('click', async () => {
        const testResEl = document.getElementById('pingTestResult');
        testResEl.innerText = "Testing connectivity...";
        const start = performance.now();

        try {
            const url = document.getElementById('cfgSupabaseUrl').value.trim().replace(/\/$/, '');
            const key = document.getElementById('cfgSupabaseKey').value.trim();

            const res = await fetch(`${url}/rest/v1/workers?select=count&limit=1`, {
                headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
            });

            const latency = Math.round(performance.now() - start);
            if (res.ok) {
                testResEl.innerHTML = `<span style="color: var(--safety-green);">✓ Connection Successful! Latency: ${latency}ms</span>`;
            } else {
                testResEl.innerHTML = `<span style="color: var(--emergency-red);">✗ HTTP ${res.status}: ${res.statusText}</span>`;
            }
        } catch(err) {
            testResEl.innerHTML = `<span style="color: var(--emergency-red);">✗ Failed to connect: ${err.message}</span>`;
        }
    });

    // Add Worker Form
    document.getElementById('formAddWorker')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('newWorkerId').value.trim();
        const name = document.getElementById('newWorkerName').value.trim();
        const role = document.getElementById('newWorkerRole').value;
        const sector = document.getElementById('newWorkerSector').value;
        const lang = document.getElementById('newWorkerLang').value;

        const workerPayload = {
            worker_id: id,
            name: name,
            role: role,
            sector: sector,
            language: lang,
            safety_score: 0
        };

        if (state.isUsingFallback) {
            state.workers.unshift(workerPayload);
            renderAllViews();
            document.getElementById('modalRegisterWorker').classList.remove('active');
            return;
        }

        try {
            const res = await fetch(`${currentConfig.supabaseUrl}/rest/v1/workers`, {
                method: 'POST',
                headers: {
                    'apikey': currentConfig.supabaseAnonKey,
                    'Authorization': `Bearer ${currentConfig.supabaseAnonKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(workerPayload)
            });

            if (res.ok) {
                document.getElementById('modalRegisterWorker').classList.remove('active');
                fetchDashboardData();
            } else {
                alert("Failed to add worker. Please check unique Worker ID.");
            }
        } catch(err) {
            alert("Error: " + err.message);
        }
    });
}

// Inspect Worker Details
window.openWorkerDetails = function(workerId) {
    const worker = state.workers.find(w => w.worker_id === workerId);
    if (!worker) return;

    const workerDrills = state.trainings.filter(t => t.worker_id === workerId);

    const modal = document.getElementById('modalWorkerDetails');
    document.getElementById('detWorkerId').innerText = worker.worker_id;
    document.getElementById('detWorkerName').innerText = worker.name;
    document.getElementById('detWorkerRole').innerText = worker.role;
    document.getElementById('detWorkerSector').innerText = worker.sector;
    document.getElementById('detWorkerLang').innerText = worker.language;
    const isCertified = workerDrills.some(t => t.pass_protocol_success);
    const displayScore = calculateWorkerSafetyScore(worker, state.trainings);
    document.getElementById('detWorkerScore').innerText = `${displayScore}%`;
    document.getElementById('detDrillCount').innerText = workerDrills.length;

    modal.classList.add('active');
};

// Worker QR Code Generator
window.openWorkerQRCode = function(workerId) {
    const worker = state.workers.find(w => w.worker_id === workerId);
    if (!worker) return;

    document.getElementById('qrWorkerName').innerText = worker.name;
    document.getElementById('qrWorkerId').innerText = worker.worker_id;
    document.getElementById('qrWorkerRole').innerText = worker.role;
    document.getElementById('qrWorkerSector').innerText = worker.sector;

    const container = document.getElementById('workerQRCodeContainer');
    if (container) {
        container.innerHTML = '';
        const payload = JSON.stringify({
            app: "Jiwi-AR",
            type: "worker_auth",
            worker_id: worker.worker_id,
            name: worker.name
        });

        if (window.QRCode) {
            new window.QRCode(container, {
                text: payload,
                width: 192,
                height: 192,
                colorDark: "#090A0F",
                colorLight: "#FFFFFF",
                correctLevel: window.QRCode.CorrectLevel.H
            });
        }
    }

    const modal = document.getElementById('modalWorkerQR');
    if (modal) modal.classList.add('active');
};

// ==============================================================================
// Utilities
// ==============================================================================
function formatRelativeTime(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function formatModuleName(type) {
    if (!type) return 'Safety Drill';
    const m = type.toUpperCase();
    if (m === 'PPE_INSPECTION') return 'PPE & Hazard Inspection';
    if (m === 'FIRE_SAFETY_PASS') return 'Fire PASS Drill';
    if (m === 'GAS_LEAK_DETECTION') return 'Gas Leak & Confined Space';
    if (m === 'LOTO_ISOLATION') return 'LOTO Isolation';
    if (m === 'STRATA_ROOF_BOLT') return 'Strata Roof Bolting';
    return type;
}

// ==============================================================================
// Supabase Realtime WebSocket Channels
// ==============================================================================
function initRealtimeSubscription() {
    if (!window.supabase || !window.supabase.createClient) {
        console.warn("[AdminPortal] Supabase JS SDK not loaded yet. Retrying in 800ms...");
        setTimeout(initRealtimeSubscription, 800);
        return;
    }

    try {
        const client = window.supabase.createClient(currentConfig.supabaseUrl, currentConfig.supabaseAnonKey);
        
        client.channel('mine_safety_realtime_stream')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'training_sessions' }, (payload) => {
                console.log('[Realtime AR Drill]', payload);
                fetchDashboardData();
                if (payload.eventType === 'INSERT' && payload.new) {
                    showRealtimeAlertToast(
                        'DRILL COMPLETED',
                        `Worker ${payload.new.worker_id} completed ${formatModuleName(payload.new.module_type)} in ${payload.new.time_taken_seconds}s (Score: ${payload.new.score}/100)!`,
                        'success'
                    );
                    playBeepTone(880, 0.3);
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, (payload) => {
                console.log('[Realtime Worker]', payload);
                fetchDashboardData();
            })
            .subscribe((status) => {
                console.log('[AdminPortal] Realtime Channel Status:', status);
                const pill = document.getElementById('realtimePill');
                if (pill) {
                    if (status === 'SUBSCRIBED') {
                        pill.style.display = 'inline-flex';
                        pill.innerText = '⚡ REALTIME';
                        pill.className = 'realtime-live-badge';
                    } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
                        pill.innerText = '⟳ POLLING';
                    }
                }
            });
    } catch(err) {
        console.warn("[AdminPortal] Could not initialize Supabase Realtime channel:", err);
    }
}

function playBeepTone(freq, duration) {
    try {
        if (!state.audioCtx) {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, state.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        osc.start();
        osc.stop(state.audioCtx.currentTime + duration);
    } catch(e) {}
}

function showRealtimeAlertToast(title, body, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <span>${title}</span>
            <span style="cursor: pointer; opacity: 0.7;" onclick="this.parentElement.parentElement.remove()">✕</span>
        </div>
        <div class="toast-body">${body}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        setTimeout(() => toast.remove(), 300);
    }, 6000);
}
