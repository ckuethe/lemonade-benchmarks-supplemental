const SCORING = {
    '2': ['Winning (+2)', 'winning'],
    '1': ['Good (+1)', 'good'],
    '0': ['---'],
    '-1': ['Bad (-1)', 'bad'],
    '-2': ['Fail (-2)', 'fail']
};
let scenarioMap = {}; // name -> scenario object
let resultRows = []; // flat array of {scenarioName, ...resultFields}
let activeScenario = null;

/* ── file loading (when opened directly) or data injection (via Python server) ─────────────── */

document.getElementById('scenarios-file').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    new FileReader().readAsText(f);
    document.getElementById('scenarios-file').onloadend = ev => {
        try {
            scenarioMap = {};
            (JSON.parse(ev.target.result).scenarios || []).forEach(s => {
                scenarioMap[s.name] = s
            });
            renderAll();
        } catch (err) {
            alert('Failed to parse scenarios: ' + err.message);
        }
    };
});

document.getElementById('results-file').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    new FileReader().readAsText(f);
    document.getElementById('results-file').onloadend = ev => {
        resultRows = ev.target.result.split('\n').map(l => l.trim()).filter(Boolean).map(JSON.parse);
        renderAll();
    };
});

/* ── scoring persistence (per-card, per-backend) ─────── */

const STORAGE_KEY = 'vision_bench_scores';

function loadScores() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

function saveScore(cardId, scoreKey) {
    const s = loadScores();
    if (scoreKey === '0') delete s[cardId];
    else s[cardId] = scoreKey;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    updateStorageInfo();
}

/* ── helpers ─────────────────────────────── */
function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function escAttr(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ── rendering ─────────────────────────────── */

function getVerdict(scoreKey) {
    const e = SCORING[scoreKey];
    return e ? {
        text: e[0],
        cls: 'verdict-' + e[1]
    } : null;
}

function ratedCount(scName, rows) {
    let n = 0;
    for (let i = 0; i < rows.length; i++) {
        if (loadScores()[scName + '__' + (rows[i].model || '?')]) n++;
    }
    return n;
}

function renderAll() {
    const ribbon = document.getElementById('thumb-ribbon');
    if (!Object.keys(scenarioMap).length && !resultRows.length) {
        ribbon.classList.add('hidden');
        activeScenario = null;
        return;
    }
    ribbon.classList.remove('hidden');

    /* build thumbnail ribbon */
    let thumbHtml = '';
    Object.keys(scenarioMap).forEach(name => {
        const sc = scenarioMap[name];
        const imgEl = document.getElementById('data-imgmap');
        const imgJson = imgEl ? (imgEl.textContent.trim() || '{}') : '{}';
        const img = JSON.parse(imgJson)[sc.name] || null;
        const activeClass = activeScenario === name ? 'active' : '';
        let inner = `<div class="thumb-label">${escHtml(sc.name.slice(0,12))}</div>`;
        if (!img) {
            inner += '<span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.4rem;font-weight:700;color:#393b57;background:none;padding:0;pointer-events:none">' + name[0] + '</span>';
        }
        const style = img ? 'background-image:url(' + escAttr(img) + ')' : '';
        thumbHtml += '<div class="thumb-card ' + activeClass + '" data-name="' + escAttr(name) + '"' + (style ? ' style="' + style + '"' : '') + '>' + inner + '</div>';
    });
    ribbon.innerHTML = thumbHtml;

    /* attach click handlers to thumbnails */
    ribbon.querySelectorAll('.thumb-card').forEach(card => {
        card.addEventListener('click', () => showScenario(card.dataset.name));
    });

    buildSummary(grouped());
    updateStorageInfo();

    if (!activeScenario) activeScenario = Object.keys(scenarioMap)[0];
}

function grouped() {
    const g = {};
    resultRows.forEach(r => {
        (g[r.scenario] ||= []).push(r)
    });
    return g;
}

function showScenario(name) {
    activeScenario = name;
    document.querySelectorAll('.thumb-card').forEach(c => c.classList.toggle('active', c.dataset.name === name));
    const sc = scenarioMap[name];
    if (!sc) return;
    const rows = grouped()[name] || [];
    const rated = ratedCount(name, rows);

    const imgMap = JSON.parse(document.getElementById('data-imgmap').textContent.trim() || '{}');

    let html = '<div class="panel-header">' +
        (imgMap[name] ? '<div class="source-image-container"><img src="' + escAttr(imgMap[name]) + '" alt="' + escAttr(sc.name) + '"></div>' : '') + '<div class="panel-info">' +
        '<div class="scenario-name">' + escHtml(name) + ' <span class="rated-badge">(' + rated + '/' + rows.length + ' rated)</span></div>' +
        '<div class="scenario-category">' + escHtml(sc.category || '') + '</div>' +
        (sc.messages ? '<div class="prompt-box">' + escHtml(JSON.stringify(sc.messages)) + '</div>' : '') +
        '</div></div><div class="results-grid">';

    rows.forEach(r => {
        const cardId = name + '__' + (r.model || '?');
        const scoreKey = loadScores()[cardId];
        const v = getVerdict(scoreKey);
        const badge = v ? '<span style="font-size:.72rem;margin-left:8px" class="' + v.cls + '">' + escHtml(v.text) + '</span>' : '';

        /* scoring options */
        let opts = '';
        Array.from(Object.entries(SCORING)).sort((a, b) => b[0] - a[0]).forEach(([k, e]) => {
            const isSelected = (scoreKey === k) || (scoreKey === undefined && k === '0');
            opts += '<option value="' + k + '"' + (isSelected ? ' selected' : '') + '> ' + e[0] + '</option>';
        });

        const perfStr = [];
        if (r.ttft_ms != null) perfStr.push(Math.round(r.ttft_ms) + 'ms');
        if (r.tps != null) perfStr.push(parseFloat(r.tps).toFixed(1) + ' tok/s');
        const perfHtml = perfStr.length ? '<span>' + perfStr.join(' · ') + '</span>' : '';

        html += '<div class="result-row"><div class="result-labels">' +
            '<span class="model-name">' + escHtml(r.model || '?') + badge + '</span>' +
            '<div class="meta-row">' + (r.recipe ? '<span class="meta-tag">' + escHtml(r.recipe) + '</span>' : '') + (r.backend ? '<span class="meta-tag">' + escHtml(r.backend) + '</span>' : '') + '</div>' +
            '<div class="metrics-row">' +
            (r.input_tokens != null ? escHtml(String(r.input_tokens)) + ' in' : '') +
            (r.output_tokens != null ? ' · ' + escHtml(String(r.output_tokens)) + ' out' : '') +
            perfHtml + '</div>' +
            '<select data-card="' + cardId + '">' + opts + '</select></div><div class="result-response' + (((r.response || '').trim().toLowerCase().includes('error')) ? ' error' : '') + '" title="' + escAttr(JSON.stringify({
                model: r.model,
                response: (r.response || '').slice(0, 200)
            })) + '">' + escHtml(r.response || '(empty)') + '</div></div>';
    });

    html += '</div>';
    document.getElementById('scenario-panel').innerHTML = html;
    attachScoreListeners();
    updateStorageInfo();
}


/* ── summary table (leaderboard) ─────────────── */

function buildSummary(groupedData) {
    const tbl = document.getElementById('summary-tbl');
    if (!Object.keys(groupedData).length) {
        document.getElementById('summary-section').classList.add('hidden');
        return;
    }
    document.getElementById('summary-section').classList.remove('hidden');
    const scores = loadScores(),
        modelStats = {};
    resultRows.forEach(r => {
        if (!modelStats[r.model]) modelStats[r.model] = {
            good: 0,
            winning: 0,
            bad: 0,
            fail: 0,
            total: 0
        };
        const raw = scores[`${r.scenario}__${r.model}`];
        if (raw === '1') modelStats[r.model].good++;
        else if (raw === '2') modelStats[r.model].winning++;
        else if (raw === '-1') modelStats[r.model].bad++;
        else if (raw === '-2') modelStats[r.model].fail++;
        if (raw === '1' || raw === '2' || raw === '-1' || raw === '-2') modelStats[r.model].total++;
    });
    const sorted = Object.keys(modelStats).sort((a, b) => (modelStats[b].good + modelStats[b].winning*2 - modelStats[b].bad - modelStats[b].fail*2) - (modelStats[a].good + modelStats[a].winning*2 - modelStats[a].bad - modelStats[a].fail*2) || a.localeCompare(b));

    let html = '<thead><tr><th>Model</th><th>Total</th><th class="lb-winning">Winning (+2)</th><th class="lb-good">Good (+1)</th><th class="lb-bad">Bad (-1)</th><th class="lb-fail">Fail (-2)</th><th>Score</th></tr></thead>';
    const pct = (n, t) => t ? ((n * 100 / t).toFixed(1)) + '%' : '-';
    html += '<tbody>' + sorted.map(m => {
        const s = modelStats[m];
        return `<tr><td>${escHtml(m)}</td><td>${s.total}</td><td class="lb-winning">${s.winning} (${pct(s.winning,s.total)})</td><td class="lb-good">${s.good} (${pct(s.good,s.total)})</td><td class="lb-bad">${s.bad}</td><td class="lb-fail">${s.fail}</td><td>${s.good + s.winning*2 - s.bad - s.fail*2}</td></tr>`;
    }).join('') + '</tbody>';
    tbl.innerHTML = html;
}

/* ── event wiring ─────────────────────────────── */

function attachScoreListeners() {
    document.querySelectorAll('#scenario-panel select').forEach(sel => {
        sel.addEventListener('change', () => saveScore(sel.dataset.card, sel.value));
    });
}

/* ── storage info & backup/restore ─────────────────────── */

var BENCHMARK_VERSION = 2;

function buildMatrix() {
    const scores = loadScores();
    const models = [...new Set(resultRows.map(r => r.model || '?'))].sort();
    const scenarios = {};
    resultRows.forEach(r => {
        if (!scenarios[r.scenario]) scenarios[r.scenario] = {};
        const key = r.scenario + '__' + (r.model || '?');
        scenarios[r.scenario][r.model || '?'] = scores[key];
    });
    return {
        models,
        matrix: scenarios
    };
}

function updateStorageInfo() {
    const scores = loadScores(),
        scored = Object.keys(scores).filter(k => scores[k] === '1' || scores[k] === '2' || scores[k] === '-1' || scores[k] === '-2').length;
    document.getElementById('storage-info').textContent = `localStorage: ${scored} of ${Object.keys(scores).length} rated`;
}

function backupScores() {
    const m = buildMatrix();
    let modelsRated = 0;
    Object.values(m.matrix).forEach(row => {
        for (const v in row)
            if (row[v] === '1' || row[v] === '2' || row[v] === '-1' || row[v] === '-2') modelsRated++;
    });
    if (!modelsRated && !Object.keys(loadScores()).length) return alert('No scores to back up.');

    const exportData = {
        version: BENCHMARK_VERSION,
        exported: new Date().toISOString(),
        source_file: (scenarioMap[activeScenario] || {})._meta?.scenarios_file || 'unknown',
        total_models: m.models.length,
        models: m.models,
        scenarios_count: Object.keys(m.matrix).length
    };

    /* Build per-model detail arrays */
    exportData.detail = {};
    for (const modelName of m.models) {
        const details = [];
        for (const scName in m.matrix) {
            const verdictKey = m.matrix[scName][modelName];
            if (verdictKey != null && verdictKey !== '0') {
                const sv = SCORING[verdictKey] || ['???', ''];
                details.push({
                    scenario: scName,
                    score_key: verdictKey,
                    text: sv[0],
                    cls: sv[1]
                });
            } else if (m.matrix[scName][modelName] === undefined) {
                /* model not in this scenario */
            } else {
                details.push({
                    scenario: scName,
                    scored: false
                });
            }
        }
        exportData.detail[modelName] = details;
    }

    /* Build full matrix table with difficulty tags */
    const matRows = [];
    for (const s in m.matrix) {
        const row = {
            scenario: s
        };
        for (let mi2 = 0; mi2 < m.models.length; mi2++) {
            const vk = m.matrix[s][m.models[mi2]];
            if (vk != null && SCORING[vk]) row[m.models[mi2]] = SCORING[vk][0];
            else if (vk === '0') row[m.models[mi2]] = '-';
        }

        /* Compute scenario difficulty summary */
        let goodCount = 0,
            winningCount = 0,
            failCount = 0,
            ratedCount = 0;
        for (let mi3 = 0; mi3 < m.models.length; mi3++) {
            const sv2 = m.matrix[s][m.models[mi3]];
            if (sv2 === '1') goodCount++;
            else if (sv2 === '2') winningCount++;
            else if (sv2 === '-1' || sv2 === '-2') failCount++;
            if (sv2 != null && sv2 !== undefined) ratedCount++;
        }

        if (ratedCount > 0) {
            row.summary = `${goodCount+winningCount}/${ratedCount} pass`;
            if (failCount > 0) row.summary += `, ${failCount} fail`;
            const passPct = ((goodCount+winningCount) / m.models.length * 100).toFixed(0);
            row.summary += ` (${passPct}% of all models)`;

            if (ratedCount >= m.models.length - 1 && ratedCount > 0) {
                const passRatio = (goodCount+winningCount) / ratedCount;
                if (Math.round(passRatio * 1e6) === 10) row.difficulty_tag = 'TOO_EASY — all models score well';
                else if (passRatio === 0) row.difficulty_tag = 'ALL_FAIL — no model passes';
            }
        }
        matRows.push(row);
    }
    exportData.matrix_table = matRows;

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bench_backup_' + Date.now() + '.json';
    a.click();

    /* Alert with difficulty summary */
    const easyScenarios = matRows.filter(r => r.difficulty_tag && r.difficulty_tag.indexOf('TOO_EASY') >= 0);
    if (easyScenarios.length > 0) {
        setTimeout(() => {
            alert(`Backup complete.\n\n${easyScenarios.length} scenario(s) marked TOO_EASY:\n` +
                easyScenarios.map(r => '  - ' + r.scenario).join('\n') + '\n\nReview the full matrix in the backup file.');
        }, 100);
    }
}

function restoreScores(file) {
    new FileReader().readAsText(file).then(t => {});
    document.getElementById('import-input').onchange = e => {
        if (!e.target.files[0]) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const b = JSON.parse(ev.target.result),
                    merged = {};

                /* Handle v2+ (detailed matrix with detail[] per model) */
                if (b.detail && Array.isArray(b.detail)) {
                    for (const modelName in b.detail) {
                        const arr = b.detail[modelName];
                        for (let i = 0; i < arr.length; i++) {
                            if (!arr[i].scored) continue; /* skip unrated */
                            const key = arr[i].scenario + '__' + modelName;
                            merged[key] = arr[i].score_key || '0';
                        }
                    }
                } else {
                    /* v1 legacy: flat scores object keyed "scenario__model" */
                    Object.assign(merged, loadScores(), b.scores);
                }

                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                alert('Restored ' + Object.keys(merged).length + ' score(s)');
                location.reload();
            } catch (ex) {
                alert('Bad backup: ' + ex.message);
            }
        };
        reader.readAsText(e.target.files[0]);
    };
}
document.getElementById('import-input').addEventListener('change', e => {
    if (e.target.files[0]) restoreScores(e.target.files[0]);
});

function resetAll() {
    if (!confirm('Clear all scores?')) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

/* ── export leaderboard HTML ─────────────── */

function exportLeaderboardHtml() {
    const scores = loadScores(),
        models = [...new Set(resultRows.map(r => r.model || '?'))].sort(),
        modelStats = {};
    resultRows.forEach(r => {
        if (!modelStats[r.model]) modelStats[r.model] = {
            good: 0,
            winning: 0,
            bad: 0,
            fail: 0,
            total: 0
        };
        const raw = scores[`${r.scenario}__${r.model}`];
        if (raw === '1') modelStats[r.model].good++;
        else if (raw === '2') modelStats[r.model].winning++;
        else if (raw === '-1') modelStats[r.model].bad++;
        else if (raw === '-2') modelStats[r.model].fail++;
        if (raw === '1' || raw === '2' || raw === '-1' || raw === '-2') {
            modelStats[r.model].total++;
        }
    });
    const sorted = Object.keys(modelStats).sort((a, b) => (modelStats[b].good + modelStats[b].winning*2 - modelStats[b].bad - modelStats[b].fail*2) - (modelStats[a].good + modelStats[a].winning*2 - modelStats[a].bad - modelStats[a].fail*2) || a.localeCompare(b));
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Benchmark Leaderboard</title><style>body{font-family:sans-serif;padding:24px;color:#c0caf5;background:#1a1b26}table{border-collapse:collapse;width:max-content;margin-bottom:16px}th,td{padding:8px 16px;text-align:left;border-bottom:1px solid #393b57}.lb-winning,.score-pass{color:#9ece6a}.lb-good,.score-good{color:#e0af68}.lb-bad,.score-bad{color:#7aa2f7}.lb-fail,.score-fail{color:#f7768}e h2{margin-top:0}</style></head><body><h2>Benchmark Leaderboard</h2>`;
    html += '<table class="leaderboard"><thead><tr><th>Model</th><th>Total</th><th>Winning</th> <th>Good</th> <th>Bad</th><th>Fail</th><th>Score</th></tr></thead><tbody>';
    sorted.forEach(m => {
        const s = modelStats[m],
            pct = n => n > 0 ? ((n * 100 / s.total).toFixed(1)) + '%' : '-';
        html += `<tr><td>${escHtml(m)}</td><td>${s.total}</td><td class="lb-winning">${s.winning} (${pct(s.winning)})</td> <td class="lb-good">${s.good} (${pct(s.good)})</td> <td class="lb-bad">${s.bad}</td><td class="lb-fail">${s.fail}</td><td>${s.good + s.winning*2 - s.bad - s.fail*2}</td></tr>`;
    });
    html += '</tbody></table><p>Exported: ' + new Date().toISOString() + '</p></body></html>';
    const blob = new Blob([html], {
            type: 'text/html'
        }),
        a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leaderboard_' + Date.now() + '.html';
    a.click();
}

/* ── auto-init when data is injected by Python server ─────────────── */

(function init() {
    try {
        const sc = document.getElementById('data-scenarios');
        if (sc && sc.textContent.trim().startsWith('{')) {
            scenarioMap = {};
            JSON.parse(sc.textContent).scenarios.forEach(s => {
                scenarioMap[s.name] = s
            });
        }
    } catch (e) {}
    try {
        const rs = document.getElementById('data-results');
        if (rs && rs.textContent.trim()) resultRows = JSON.parse(rs.textContent);
    } catch (e) {}
    renderAll();
    updateStorageInfo();
})();
