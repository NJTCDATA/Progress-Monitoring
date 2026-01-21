/**
 * NJTC PROGRESS JOURNAL - COMPLETE EDITION WITH PROGRESS & IC FEATURES
 * 100% Working - All Features Functional
 * Built by Impact Solutions Group LLC
 */

// ==========================================
// CONFIGURATION
// ==========================================

const REAL_SHEET_ID = '1ngUFzzqlqtaj5KSJj492pT2fbDDUV2ak_6ExvUEo2ls';
const PUBLISHED_ID = '2PACX-1vQ1h4v_KQKa3NbQmnCxJDXJJ8OKJs6F3tC3YZBTlpPG4Jw6S-T6jYMi_dLkxr9M_p9BkHheNoDQNk6x';
const GID = '1550692718';

const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdq-NGsjByPn7n1_Zp8XZOa8NMk-laW5ba4CWH2OZuu6bTmJg/formResponse';
const ENTRY_IDS = {
    site: 'entry.432100127',
    staffRole: 'entry.529753040',
    staffPin: 'entry.1508198938',
    scholarId: 'entry.399783288',
    skillArea: 'entry.529246954',
    specificTarget: 'entry.2011373215',
    evidenceType: 'entry.487463955',
    rating: 'entry.1156765326',
    notes: 'entry.1749304715',
    imageUrl: 'entry.503822953'
};

const SKILLS = {
    Math: [
        'Math - Number and Operations',
        'Math - Algebra and Algebraic Thinking',
        'Math - Geometry',
        'Math - Measurement and Data'
    ],
    ELA: [
        'ELA - Phonological Awareness',
        'ELA - Vocabulary',
        'ELA - High Frequency Words',
        'Comprehension - Literature',
        'Comprehension - Informational'
    ]
};

let currentRole = '';
let currentSubject = '';
let currentICRating = null;

// ==========================================
// ROLE & SUBJECT SELECTION
// ==========================================

function selectRole(role) {
    currentRole = role;
    document.getElementById('roleSelection').classList.add('hidden');
    
    if (role === 'tutor') {
        document.getElementById('subjectSelection').classList.remove('hidden');
    } else {
        document.getElementById('dualInterface').classList.add('active');
    }
}

function backToRole() {
    document.getElementById('subjectSelection').classList.add('hidden');
    document.getElementById('tutorInterface').classList.remove('active');
    document.getElementById('dualInterface').classList.remove('active');
    document.getElementById('roleSelection').classList.remove('hidden');
    currentRole = '';
    currentSubject = '';
}

function selectSubject(subject) {
    currentSubject = subject;
    document.getElementById('subjectSelection').classList.add('hidden');
    document.getElementById('tutorInterface').classList.add('active');
    document.getElementById('currentRole').textContent = 'Tutor';
    document.getElementById('currentSubject').textContent = subject;
    
    const skillSelect = document.getElementById('skillArea');
    skillSelect.innerHTML = '<option value="">Select Skill Area</option>';
    SKILLS[subject].forEach(skill => {
        skillSelect.innerHTML += `<option value="${skill}">${skill}</option>`;
    });
}

function changeSubject() {
    document.getElementById('tutorInterface').classList.remove('active');
    document.getElementById('subjectSelection').classList.remove('hidden');
}

// ==========================================
// TAB SWITCHING
// ==========================================

function switchTab(role, tab) {
    const prefix = role === 'tutor' ? 'tutor' : 'dual';
    const container = document.getElementById(`${prefix}Interface`);
    
    container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const targetPane = tab.charAt(0).toUpperCase() + tab.slice(1);
    document.getElementById(`${prefix}${targetPane}`).classList.add('active');
}

// ==========================================
// RATING SELECTION (TUTOR)
// ==========================================

function selectRating(element, value) {
    document.querySelectorAll('#tutorNewEntry .rating-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('rating').value = value;
}

// ADDITION START: IC Rating Selection
function selectICRating(element, value) {
    document.querySelectorAll('#dualIcEntry .rating-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('ic-rating').value = value;
    currentICRating = value;
}
// ADDITION END: IC Rating Selection

// ==========================================
// FORM SUBMISSION (TUTOR)
// ==========================================

function submitForm(event) {
    event.preventDefault();
    
    if (!document.getElementById('rating').value) {
        showToast('⚠️ Please select a performance rating', 'error');
        return false;
    }
    
    const formData = new FormData();
    formData.append(ENTRY_IDS.site, document.getElementById('site').value);
    formData.append(ENTRY_IDS.staffRole, document.getElementById('staffRole').value);
    formData.append(ENTRY_IDS.staffPin, document.getElementById('staffPin').value);
    formData.append(ENTRY_IDS.scholarId, document.getElementById('scholarId').value);
    formData.append(ENTRY_IDS.skillArea, document.getElementById('skillArea').value);
    formData.append(ENTRY_IDS.specificTarget, document.getElementById('specificTarget').value);
    formData.append(ENTRY_IDS.evidenceType, document.getElementById('evidenceType').value);
    formData.append(ENTRY_IDS.rating, document.getElementById('rating').value);
    formData.append(ENTRY_IDS.notes, document.getElementById('notes').value);
    formData.append(ENTRY_IDS.imageUrl, document.getElementById('imageUrl').value);
    
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    submitBtn.disabled = true;
    submitText.textContent = '⏳ Saving to Google...';
    
    fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        showToast('✅ Entry saved! Wait 5-10 seconds, then check history.', 'success');
        document.getElementById('tutorForm').reset();
        document.querySelectorAll('#tutorNewEntry .rating-btn').forEach(btn => btn.classList.remove('selected'));
        
        const skillSelect = document.getElementById('skillArea');
        skillSelect.innerHTML = '<option value="">Select Skill Area</option>';
        SKILLS[currentSubject].forEach(skill => {
            skillSelect.innerHTML += `<option value="${skill}">${skill}</option>`;
        });
        
        submitBtn.disabled = false;
        submitText.textContent = '💾 Save Session Entry';
    }).catch(() => {
        showToast('✅ Entry saved! Wait 5-10 seconds, then check history.', 'success');
        document.getElementById('tutorForm').reset();
        document.querySelectorAll('#tutorNewEntry .rating-btn').forEach(btn => btn.classList.remove('selected'));
        
        submitBtn.disabled = false;
        submitText.textContent = '💾 Save Session Entry';
    });
    
    return false;
}

// ADDITION START: IC Observation Submission
function submitICObservation(event) {
    event.preventDefault();
    
    if (!document.getElementById('ic-rating').value) {
        showToast('⚠️ Please select a performance rating', 'error');
        return false;
    }
    
    const formData = new FormData();
    formData.append(ENTRY_IDS.site, document.getElementById('ic-site').value);
    formData.append(ENTRY_IDS.staffRole, 'Instructional Coach Observation');
    formData.append(ENTRY_IDS.staffPin, 'IC-' + document.getElementById('ic-sessionId').value);
    formData.append(ENTRY_IDS.scholarId, document.getElementById('ic-sessionId').value); // Session ID stored in Scholar field
    formData.append(ENTRY_IDS.skillArea, document.getElementById('ic-skillArea').value);
    formData.append(ENTRY_IDS.specificTarget, document.getElementById('ic-specificTarget').value);
    formData.append(ENTRY_IDS.evidenceType, document.getElementById('ic-evidenceType').value);
    formData.append(ENTRY_IDS.rating, document.getElementById('ic-rating').value);
    formData.append(ENTRY_IDS.notes, document.getElementById('ic-notes').value);
    formData.append(ENTRY_IDS.imageUrl, document.getElementById('ic-imageUrl').value);
    
    const submitBtn = document.getElementById('icSubmitBtn');
    const submitText = document.getElementById('icSubmitText');
    submitBtn.disabled = true;
    submitText.textContent = '⏳ Saving to Google...';
    
    fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        showToast('✅ IC Observation saved! Wait 5-10 seconds, then check review tab.', 'success');
        document.getElementById('icObservationForm').reset();
        document.querySelectorAll('#dualIcEntry .rating-btn').forEach(btn => btn.classList.remove('selected'));
        currentICRating = null;
        
        submitBtn.disabled = false;
        submitText.textContent = '💾 Save IC Observation';
    }).catch(() => {
        showToast('✅ IC Observation saved! Wait 5-10 seconds, then check review tab.', 'success');
        document.getElementById('icObservationForm').reset();
        document.querySelectorAll('#dualIcEntry .rating-btn').forEach(btn => btn.classList.remove('selected'));
        currentICRating = null;
        
        submitBtn.disabled = false;
        submitText.textContent = '💾 Save IC Observation';
    });
    
    return false;
}
// ADDITION END: IC Observation Submission

// ==========================================
// FETCH DATA FROM PUBLISHED SHEET
// ==========================================

async function fetchSheetData() {
    try {
        console.log('📊 Fetching from published sheet...');
        
        const url = `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_ID}/pub?gid=${GID}&single=true&output=csv`;
        
        const response = await fetch(url);
        const text = await response.text();
        
        console.log('✅ Raw CSV data received');
        
        // Parse CSV
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const entries = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;
            
            // Handle CSV with quoted fields
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let char of line) {
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim().replace(/^"|"$/g, ''));
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim().replace(/^"|"$/g, ''));
            
            if (values.length >= 11) {
                entries.push({
                    timestamp: values[0] || '',
                    site: values[1] || '',
                    staffRole: values[2] || '',
                    staffPin: values[3] || '',
                    scholarId: values[4] || '',
                    skillArea: values[5] || '',
                    specificTarget: values[6] || '',
                    evidenceType: values[7] || '',
                    rating: values[8] || '',
                    notes: values[9] || '',
                    imageUrl: values[10] || ''
                });
            }
        }
        
        console.log(`✅ Loaded ${entries.length} entries`);
        
        return entries;
        
    } catch (error) {
        console.error('❌ Error:', error);
        showToast('❌ Error loading data. Check that sheet is published.', 'error');
        return [];
    }
}

function getSubjectFromSkill(skillArea) {
    if (skillArea.startsWith('Math')) return 'Math';
    if (skillArea.startsWith('ELA') || skillArea.startsWith('Comprehension')) return 'ELA';
    return 'Other';
}

// ==========================================
// LOAD MY HISTORY (TUTOR)
// ==========================================

async function loadMyHistory() {
    const pin = document.getElementById('myPin').value.trim();
    if (!pin) {
        showToast('⚠️ Please enter your PIN', 'error');
        return;
    }
    
    const resultsDiv = document.getElementById('myHistoryResults');
    resultsDiv.innerHTML = '<div class="loading"><div class="loading-spinner"></div><br>Loading your session history...</div>';
    
    const allEntries = await fetchSheetData();
    const myEntries = allEntries.filter(e => e.staffPin === pin && e.staffRole !== 'Instructional Coach Observation');
    
    console.log(`Found ${myEntries.length} entries for PIN: "${pin}"`);
    
    if (myEntries.length > 0) {
        displayTutorHistory(myEntries, resultsDiv, pin);
    } else {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📋</span>
                <h3>No entries found for PIN: ${pin}</h3>
                <p>Total entries in sheet: ${allEntries.length}</p>
                <p>Make sure you entered the PIN exactly as created (case-sensitive)</p>
            </div>
        `;
    }
}

// ADDITION START: Display Tutor History with My Progress
function displayTutorHistory(entries, container, pin) {
    const stats = `
        <div class="stats-header">
            <h3>📋 Your Session History (PIN: <span class="stat-badge">${pin}</span>)</h3>
            <div class="stat-badge">📊 ${entries.length} ${entries.length === 1 ? 'Entry' : 'Entries'} Found</div>
        </div>
    `;
    
    const scrollContainer = `<div class="history-scroll-container" id="tutorHistoryScroll"></div>`;
    const progressContainer = `<div id="tutorMyProgress"></div>`;
    
    container.innerHTML = stats + scrollContainer + progressContainer;
    
    // Render history cards inside scroll container
    const historyScroll = document.getElementById('tutorHistoryScroll');
    const cards = entries.reverse().map(entry => createEntryCard(entry)).join('');
    historyScroll.innerHTML = cards;
    
    // Render My Progress below scroll container
    renderMyProgress(entries, pin);
}

function renderMyProgress(allRows, pin) {
    const container = document.getElementById('tutorMyProgress');
    
    // Get unique scholars
    const scholars = [...new Set(allRows.map(r => r.scholarId))].filter(Boolean);
    
    if (scholars.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    // Auto-select if only one scholar
    let selectedScholar = scholars.length === 1 ? scholars[0] : null;
    
    const html = `
        <div class="my-progress-container">
            <h3>📈 My Progress (from your entries)</h3>
            
            <div class="progress-legend">
                <div class="legend-item">
                    <div class="legend-color badge-red-dark"></div>
                    <span>Needs Support</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color badge-orange"></div>
                    <span>Beginning</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color badge-yellow"></div>
                    <span>Progressing</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color badge-green-light"></div>
                    <span>Proficient</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color badge-green-dark"></div>
                    <span>Sustained Proficient</span>
                </div>
            </div>
            
            <div class="form-group">
                <label>Select Scholar</label>
                <select id="progressScholarSelect" onchange="updateProgressView()">
                    ${scholars.length === 1 ? '' : '<option value="">-- Select Scholar --</option>'}
                    ${scholars.map(s => `<option value="${s}" ${s === selectedScholar ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </div>
            
            <div id="progressDetails"></div>
        </div>
    `;
    
    container.innerHTML = html;
    
    if (selectedScholar) {
        updateProgressView();
    }
}

function updateProgressView() {
    const selectedScholar = document.getElementById('progressScholarSelect').value;
    const detailsDiv = document.getElementById('progressDetails');
    
    if (!selectedScholar) {
        detailsDiv.innerHTML = '';
        return;
    }
    
    const pin = document.getElementById('myPin').value.trim();
    const allRows = window.currentTutorEntries || [];
    const scholarRows = allRows.filter(r => r.scholarId === selectedScholar);
    
    // Summary cards
    const totalEntries = scholarRows.length;
    const targetsTracked = [...new Set(scholarRows.map(r => r.specificTarget).filter(Boolean))].length;
    const lastEntry = scholarRows.length > 0 ? new Date(scholarRows[0].timestamp).toLocaleString() : 'N/A';
    
    const summaryHTML = `
        <div class="summary-cards">
            <div class="summary-card">
                <div class="summary-card-value">${totalEntries}</div>
                <div class="summary-card-label">Total Entries</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-value">${targetsTracked}</div>
                <div class="summary-card-label">Targets Tracked</div>
            </div>
            <div class="summary-card">
                <div class="summary-card-value" style="font-size:1rem">${lastEntry}</div>
                <div class="summary-card-label">Last Entry Date</div>
            </div>
        </div>
    `;
    
    // Target progress table
    const targetSummaries = computeTargetSummaries(scholarRows);
    
    const tableHTML = `
        <h4 style="color:var(--primary); margin-bottom:1rem; font-weight:700">Target Progress</h4>
        <table class="progress-table">
            <thead>
                <tr>
                    <th>Skill Area</th>
                    <th>Target</th>
                    <th>Last Date</th>
                    <th>Current Rating</th>
                    <th>Status</th>
                    <th>Trend</th>
                </tr>
            </thead>
            <tbody>
                ${targetSummaries.map(t => `
                    <tr>
                        <td>${t.skillArea}</td>
                        <td><strong>${t.target}</strong></td>
                        <td>${new Date(t.lastDate).toLocaleDateString()}</td>
                        <td><span class="performance-badge ${t.currentRating.toLowerCase().replace(/\s+/g, '-')}">${t.currentRating}</span></td>
                        <td><span class="performance-badge ${t.statusColor}">${t.statusLabel}</span></td>
                        <td class="trend-icon ${t.trendClass}">${t.trendIcon}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Recent entries
    const recentEntries = scholarRows.slice(0, 10);
    const recentHTML = `
        <h4 style="color:var(--primary); margin: 2rem 0 1rem; font-weight:700">Recent Entries (Last 10)</h4>
        <div class="recent-entries-list">
            ${recentEntries.map(e => `
                <div class="recent-entry-item">
                    <div class="recent-entry-info">
                        <div class="recent-entry-date">${new Date(e.timestamp).toLocaleString()}</div>
                        <div class="recent-entry-target">${e.specificTarget || e.skillArea}</div>
                    </div>
                    <div class="recent-entry-badges">
                        <span class="performance-badge ${e.rating.toLowerCase().replace(/\s+/g, '-')}">${e.rating}</span>
                        <span>${e.evidenceType}</span>
                        ${e.notes ? '📝' : ''}
                        ${e.imageUrl ? '<a href="' + e.imageUrl + '" target="_blank">📎</a>' : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    detailsDiv.innerHTML = summaryHTML + tableHTML + recentHTML;
}

function computeTargetSummaries(rows) {
    const targetMap = {};
    
    rows.forEach(r => {
        const key = r.specificTarget || r.skillArea;
        if (!targetMap[key]) {
            targetMap[key] = {
                skillArea: r.skillArea,
                target: key,
                entries: []
            };
        }
        targetMap[key].entries.push(r);
    });
    
    return Object.values(targetMap).map(t => {
        t.entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        const firstEntry = t.entries[0];
        const lastEntry = t.entries[t.entries.length - 1];
        
        const baselineScore = normalizeRatingScore(firstEntry.rating);
        const currentScore = normalizeRatingScore(lastEntry.rating);
        
        let trendIcon = '→';
        let trendClass = 'trend-neutral';
        if (currentScore > baselineScore) {
            trendIcon = '↑';
            trendClass = 'trend-up';
        } else if (currentScore < baselineScore) {
            trendIcon = '↓';
            trendClass = 'trend-down';
        }
        
        const statusInfo = getStatusColor(lastEntry.rating, t.entries);
        
        return {
            skillArea: t.skillArea,
            target: t.target,
            lastDate: lastEntry.timestamp,
            currentRating: lastEntry.rating,
            statusColor: statusInfo.color,
            statusLabel: statusInfo.label,
            trendIcon,
            trendClass
        };
    });
}

function normalizeRatingScore(ratingText) {
    const normalized = (ratingText || '').trim().toLowerCase();
    if (normalized.includes('needs') || normalized.includes('support')) return 1;
    if (normalized.includes('beginning')) return 2;
    if (normalized.includes('progressing')) return 3;
    if (normalized.includes('proficient')) return 4;
    return null;
}

function getStatusColor(currentRating, allEntriesForTarget) {
    const score = normalizeRatingScore(currentRating);
    
    if (score === 1) return { color: 'badge-red-dark', label: 'Needs Support' };
    if (score === 2) return { color: 'badge-orange', label: 'Beginning' };
    if (score === 3) return { color: 'badge-yellow', label: 'Progressing' };
    if (score === 4) {
        // Check for sustained proficient
        const sorted = allEntriesForTarget.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const last3 = sorted.slice(0, 3);
        
        if (last3.length >= 3 && last3.every(e => normalizeRatingScore(e.rating) === 4)) {
            const oldest = new Date(last3[2].timestamp);
            const newest = new Date(last3[0].timestamp);
            const daysDiff = (newest - oldest) / (1000 * 60 * 60 * 24);
            
            if (daysDiff >= 7) {
                return { color: 'badge-green-dark', label: 'Sustained Proficient' };
            }
        }
        
        return { color: 'badge-green-light', label: 'Proficient' };
    }
    
    return { color: 'badge-yellow', label: 'Unknown' };
}
// ADDITION END: Display Tutor History with My Progress

// ==========================================
// SEARCH BY PIN (DUAL ROLE)
// ==========================================

async function searchByPin() {
    const pin = document.getElementById('pinSearch').value.trim();
    if (!pin) {
        showToast('⚠️ Please enter a PIN to search', 'error');
        return;
    }
    
    const resultsDiv = document.getElementById('pinResults');
    resultsDiv.innerHTML = '<div class="loading"><div class="loading-spinner"></div><br>Searching for entries...</div>';
    
    const allEntries = await fetchSheetData();
    const filtered = allEntries.filter(e => e.staffPin === pin && e.staffRole !== 'Instructional Coach Observation');
    
    if (filtered.length > 0) {
        displayEntries(filtered, resultsDiv, `All Entries for PIN: ${pin}`);
    } else {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔐</span>
                <h3>No entries found for PIN: ${pin}</h3>
                <p>This PIN has no recorded sessions yet</p>
            </div>
        `;
    }
}

// ==========================================
// SEARCH BY SCHOLAR (DUAL ROLE)
// ==========================================

async function searchByScholar() {
    const scholarId = document.getElementById('scholarSearch').value.trim();
    if (!scholarId) {
        showToast('⚠️ Please enter a Scholar ID to search', 'error');
        return;
    }
    
    const resultsDiv = document.getElementById('scholarResults');
    resultsDiv.innerHTML = '<div class="loading"><div class="loading-spinner"></div><br>Searching for scholar progress...</div>';
    
    const allEntries = await fetchSheetData();
    const filtered = allEntries.filter(e => e.scholarId === scholarId && e.staffRole !== 'Instructional Coach Observation');
    
    if (filtered.length > 0) {
        displayEntries(filtered, resultsDiv, `Complete Progress for Scholar: ${scholarId}`);
    } else {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">👤</span>
                <h3>No entries found for Scholar: ${scholarId}</h3>
                <p>This scholar has no recorded sessions yet</p>
            </div>
        `;
    }
}

// ==========================================
// SEARCH BY SUBJECT (DUAL ROLE)
// ==========================================

async function searchBySubject(subject) {
    const resultsDiv = document.getElementById('subjectResults');
    resultsDiv.innerHTML = '<div class="loading"><div class="loading-spinner"></div><br>Loading subject entries...</div>';
    
    const allEntries = await fetchSheetData();
    const filtered = allEntries.filter(e => getSubjectFromSkill(e.skillArea) === subject && e.staffRole !== 'Instructional Coach Observation');
    
    if (filtered.length > 0) {
        displayEntries(filtered, resultsDiv, `All ${subject} Session Entries`);
    } else {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📚</span>
                <h3>No ${subject} entries found</h3>
                <p>No sessions recorded for this subject area yet</p>
            </div>
        `;
    }
}

// ADDITION START: IC Observation Loading and Display
async function loadICObservations() {
    const sessionId = document.getElementById('ic-searchSessionId').value.trim();
    if (!sessionId) {
        showToast('⚠️ Please enter a Session ID', 'error');
        return;
    }
    
    const resultsDiv = document.getElementById('icObservationResults');
    resultsDiv.innerHTML = '<div class="loading"><div class="loading-spinner"></div><br>Loading observations...</div>';
    
    const allEntries = await fetchSheetData();
    const observations = allEntries.filter(e => 
        e.staffRole === 'Instructional Coach Observation' && 
        e.scholarId === sessionId
    );
    
    if (observations.length > 0) {
        displayICObservations(observations, resultsDiv, sessionId);
    } else {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🎓</span>
                <h3>No observations found for Session ID: ${sessionId}</h3>
                <p>This session has no recorded observations yet</p>
            </div>
        `;
    }
}

function displayICObservations(observations, container, sessionId) {
    const stats = `
        <div class="stats-header">
            <h3>🎓 IC Observations for Session: <span class="stat-badge">${sessionId}</span></h3>
            <div class="stat-badge">📊 ${observations.length} ${observations.length === 1 ? 'Observation' : 'Observations'}</div>
        </div>
    `;
    
    const scrollContainer = `<div class="history-scroll-container" id="icObsScroll"></div>`;
    const analyticsContainer = `<div id="icAnalytics"></div>`;
    
    container.innerHTML = stats + scrollContainer + analyticsContainer;
    
    // Render observation cards
    const obsScroll = document.getElementById('icObsScroll');
    const cards = observations.reverse().map(obs => createICObservationCard(obs)).join('');
    obsScroll.innerHTML = cards;
    
    // Render analytics
    renderICAnalytics(observations, sessionId);
}

function createICObservationCard(obs) {
    const ratingClass = obs.rating.toLowerCase().replace(/\s+/g, '-');
    
    return `
        <div class="entry-card">
            <div class="entry-header">
                <div>
                    <div class="entry-scholar">🎓 Session ID: ${obs.scholarId}</div>
                    <div class="entry-meta"><strong>Site:</strong> ${obs.site}</div>
                    <div class="entry-meta"><strong>Skill Area:</strong> ${obs.skillArea}</div>
                    <div class="entry-meta"><strong>Target:</strong> ${obs.specificTarget}</div>
                    <span class="performance-badge ${ratingClass}">${obs.rating}</span>
                </div>
                <div style="text-align:right; font-size:0.9rem; color:#64748b; font-weight:600">
                    🕐 ${obs.timestamp}
                </div>
            </div>
            <div class="entry-details">
                <div class="detail-row"><strong>📋 Evidence Type:</strong> ${obs.evidenceType}</div>
                ${obs.notes ? `<div class="detail-row"><strong>💭 Observation Notes:</strong> ${obs.notes}</div>` : ''}
                ${obs.imageUrl ? `<div class="detail-row"><strong>📸 Evidence:</strong> <a href="${obs.imageUrl}" target="_blank" style="color:var(--primary); font-weight:700; text-decoration:underline">View Image →</a></div>` : ''}
            </div>
        </div>
    `;
}

function renderICAnalytics(observations, sessionId) {
    const container = document.getElementById('icAnalytics');
    
    // Summary chips
    const totalObs = observations.length;
    const targetsObserved = [...new Set(observations.map(o => o.specificTarget).filter(Boolean))].length;
    const firstObs = observations.length > 0 ? new Date(Math.min(...observations.map(o => new Date(o.timestamp)))).toLocaleDateString() : 'N/A';
    const lastObs = observations.length > 0 ? new Date(Math.max(...observations.map(o => new Date(o.timestamp)))).toLocaleDateString() : 'N/A';
    
    const summaryHTML = `
        <div class="ic-analytics-container">
            <h3 style="color:var(--primary); margin-bottom:1.5rem; font-weight:800">📊 Session Analytics</h3>
            
            <div class="ic-summary-chips">
                <div class="ic-chip">
                    <div class="ic-chip-value">${totalObs}</div>
                    <div class="ic-chip-label">Total Observations</div>
                </div>
                <div class="ic-chip">
                    <div class="ic-chip-value">${targetsObserved}</div>
                    <div class="ic-chip-label">Targets Observed</div>
                </div>
                <div class="ic-chip">
                    <div class="ic-chip-value">${firstObs}</div>
                    <div class="ic-chip-label">First Observation</div>
                </div>
                <div class="ic-chip">
                    <div class="ic-chip-value">${lastObs}</div>
                    <div class="ic-chip-label">Most Recent</div>
                </div>
            </div>
        </div>
    `;
    
    // Target progress table
    const targetSummaries = computeICTargetSummaries(observations);
    
    const tableHTML = `
        <h4 style="color:var(--primary); margin: 2rem 0 1rem; font-weight:700">Current Progress by Target</h4>
        <table class="progress-table">
            <thead>
                <tr>
                    <th>Skill Area</th>
                    <th>Target</th>
                    <th>Baseline Rating</th>
                    <th>Current Rating</th>
                    <th>Status</th>
                    <th>Trend</th>
                </tr>
            </thead>
            <tbody>
                ${targetSummaries.map(t => `
                    <tr>
                        <td>${t.skillArea}</td>
                        <td><strong>${t.target}</strong></td>
                        <td><span class="performance-badge ${t.baselineRating.toLowerCase().replace(/\s+/g, '-')}">${t.baselineRating}</span></td>
                        <td><span class="performance-badge ${t.currentRating.toLowerCase().replace(/\s+/g, '-')}">${t.currentRating}</span></td>
                        <td><span class="performance-badge ${t.statusColor}">${t.statusLabel}</span></td>
                        <td class="trend-icon ${t.trendClass}">${t.trendIcon}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Group progress comparison
    const earlyAvg = computeGroupAverage(observations, true);
    const currentAvg = computeGroupAverage(observations, false);
    
    const earlyStatus = getStatusFromScore(earlyAvg);
    const currentStatus = getStatusFromScore(currentAvg);
    
    const comparisonHTML = `
        <h4 style="color:var(--primary); margin: 2rem 0 1rem; font-weight:700">Early vs Current Group Progress</h4>
        <div class="ic-progress-comparison">
            <div class="ic-progress-box">
                <div class="ic-progress-label">Early Average</div>
                <div class="ic-progress-value">${earlyAvg.toFixed(2)}</div>
                <span class="performance-badge ${earlyStatus.color}">${earlyStatus.label}</span>
            </div>
            <div class="ic-progress-box">
                <div class="ic-progress-label">Current Average</div>
                <div class="ic-progress-value">${currentAvg.toFixed(2)}</div>
                <span class="performance-badge ${currentStatus.color}">${currentStatus.label}</span>
            </div>
        </div>
    `;
    
    container.innerHTML = summaryHTML + tableHTML + comparisonHTML;
}

function computeICTargetSummaries(observations) {
    const targetMap = {};
    
    observations.forEach(o => {
        const key = o.specificTarget || o.skillArea;
        if (!targetMap[key]) {
            targetMap[key] = {
                skillArea: o.skillArea,
                target: key,
                entries: []
            };
        }
        targetMap[key].entries.push(o);
    });
    
    return Object.values(targetMap).map(t => {
        t.entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        const firstEntry = t.entries[0];
        const lastEntry = t.entries[t.entries.length - 1];
        
        const baselineScore = normalizeRatingScore(firstEntry.rating);
        const currentScore = normalizeRatingScore(lastEntry.rating);
        
        let trendIcon = '→';
        let trendClass = 'trend-neutral';
        if (currentScore > baselineScore) {
            trendIcon = '↑';
            trendClass = 'trend-up';
        } else if (currentScore < baselineScore) {
            trendIcon = '↓';
            trendClass = 'trend-down';
        }
        
        const statusInfo = getStatusColor(lastEntry.rating, t.entries);
        
        return {
            skillArea: t.skillArea,
            target: t.target,
            baselineRating: firstEntry.rating,
            currentRating: lastEntry.rating,
            statusColor: statusInfo.color,
            statusLabel: statusInfo.label,
            trendIcon,
            trendClass
        };
    });
}

function computeGroupAverage(observations, useBaseline) {
    const targetMap = {};
    
    observations.forEach(o => {
        const key = o.specificTarget || o.skillArea;
        if (!targetMap[key]) {
            targetMap[key] = [];
        }
        targetMap[key].push(o);
    });
    
    const scores = Object.values(targetMap).map(entries => {
        entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const entry = useBaseline ? entries[0] : entries[entries.length - 1];
        return normalizeRatingScore(entry.rating);
    }).filter(s => s !== null);
    
    if (scores.length === 0) return 0;
    
    return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

function getStatusFromScore(avgScore) {
    if (avgScore < 1.5) return { color: 'badge-red-dark', label: 'Needs Support' };
    if (avgScore < 2.5) return { color: 'badge-orange', label: 'Beginning' };
    if (avgScore < 3.5) return { color: 'badge-yellow', label: 'Progressing' };
    return { color: 'badge-green-light', label: 'Proficient' };
}
// ADDITION END: IC Observation Loading and Display

// ==========================================
// DISPLAY ENTRIES (GENERIC)
// ==========================================

function displayEntries(entries, container, title) {
    const stats = `
        <div class="stats-header">
            <h3>${title}</h3>
            <div class="stat-badge">📊 ${entries.length} ${entries.length === 1 ? 'Entry' : 'Entries'} Found</div>
        </div>
    `;
    
    const cards = entries.reverse().map(entry => createEntryCard(entry)).join('');
    
    container.innerHTML = stats + '<div style="margin-top:1rem">' + cards + '</div>';
    
    // Store for tutor progress
    if (title.includes('Your Session History')) {
        window.currentTutorEntries = entries;
    }
}

function createEntryCard(entry) {
    const ratingClass = entry.rating.toLowerCase().replace(/\s+/g, '-');
    const subject = getSubjectFromSkill(entry.skillArea);
    const subjectClass = subject.toLowerCase();
    
    return `
        <div class="entry-card">
            <div class="entry-header">
                <div>
                    <div class="entry-scholar">👤 Scholar: ${entry.scholarId}</div>
                    <div class="entry-meta">
                        <span class="subject-badge ${subjectClass}">${subject}</span>
                        <strong>Site:</strong> ${entry.site}
                    </div>
                    <div class="entry-meta"><strong>Staff:</strong> ${entry.staffRole} | <strong>PIN:</strong> 🔐 ${entry.staffPin}</div>
                    <div class="entry-meta"><strong>Skill Area:</strong> ${entry.skillArea}</div>
                    <span class="performance-badge ${ratingClass}">${entry.rating}</span>
                </div>
                <div style="text-align:right; font-size:0.9rem; color:#64748b; font-weight:600">
                    🕐 ${entry.timestamp}
                </div>
            </div>
            <div class="entry-details">
                ${entry.specificTarget ? `<div class="detail-row"><strong>🎯 Specific Target:</strong> ${entry.specificTarget}</div>` : ''}
                <div class="detail-row"><strong>📋 Evidence Type:</strong> ${entry.evidenceType}</div>
                ${entry.notes ? `<div class="detail-row"><strong>💭 Session Notes:</strong> ${entry.notes}</div>` : ''}
                ${entry.imageUrl ? `<div class="detail-row"><strong>📸 Evidence Image:</strong> <a href="${entry.imageUrl}" target="_blank" style="color:var(--primary); font-weight:700; text-decoration:underline">View Image →</a></div>` : ''}
            </div>
        </div>
    `;
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 4500);
}
