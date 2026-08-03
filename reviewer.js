function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function escAttr(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

var SCORING = {
    0: ['---'],
    1: ['Pass', 'pass'],
    2: ['Marginal', 'ok'],
    3: ['Fail', 'fail']
};
var STORAGE_KEY = 'vision_bench_scores';

function loadScores() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveScore(cid, v) {
    var s = loadScores();
    s[cid] = v;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    updateStorageInfo();
}

function getVerdict(scoreKey) {
    if (!scoreKey || isNaN(parseInt(scoreKey)))
        return {
            text: '---',
            cls: ''
        };
    var idx = parseInt(scoreKey);
    if (idx >= SCORING.length)
        return null;
    if (SCORING[idx])
        return {
            text: SCORING[idx][0],
            cls: 'verdict-' + SCORING[idx][1]
        };
    return {
        text: '---',
        cls: ''
    };
}

function verdictDotClass(s) {
    var k = s || null;
    var v = getVerdict(k);
    if (!v) return '';
    return ' ' + v.cls.replace('verdict-', '');
}

function loadJson(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    try {
        return JSON.parse(el.textContent.trim());
    } catch (e) {
        console.error('Failed to parse', id, e);
        return null;
    }
}

/* ── data loading ─────────────────────── */
var SCENARIOS = loadJson('data-scenarios');
var IMG_MAP = loadJson('data-imgmap');
var RESULTS = loadJson('data-results');

/* ── cached grouping helper (parses once, caches result) ─ */

if (!SCENARIOS || !RESULTS) {
    document.getElementById('no-scenario-msg').style.display = 'block';
} else {
    init(SCENARIOS, IMG_MAP, RESULTS);
}

function init(scenariosData, imgMap, results) {
    var meta = scenariosData._meta || {};
    var cases = scenariosData.scenarios || [];
    document.getElementById('app-title').textContent = meta.scenarios_file || 'Vision Benchmark Reviewer';

    /* group results by scenario */
    var grouped = {};
    for (var i = 0; i < results.length; i++) {
        var r = results[i];
        if (!grouped[r.scenario]) grouped[r.scenario] = [];
        grouped[r.scenario].push(r);
    }

    /* collect models */
    var modelSet = new Set();
    for (var i = 0; i < results.length; i++) modelSet.add(results[i].model);
    var models = [];
    modelSet.forEach(function(m) {
        models.push(m);
    });
    models.sort();

    document.getElementById('stats').innerHTML = '<span>' + cases.length + ' scenario' + (cases.length !== 1 ? 's' : '') + '</span><span>' + results.length + ' result row' + (results.length !== 1 ? 's' : '') + '</span><span>' + Object.keys(grouped).length + '/' + cases.length + ' with results</span>';

    /* build nav bar */
    var navBar = document.getElementById('nav-bar');

    // Wrapper div to hold both cards row and leaderboard, appended once to navBar
    var innerNav = document.createElement('div');
    innerNav.style.cssText = 'display:flex;flex-direction:column';

    var cardsWrap = document.createElement('div');
    cardsWrap.style.cssText = 'display:flex;gap:10px;width:max-content';
    innerNav.appendChild(cardsWrap);

    for (var i = 0; i < cases.length; i++) {
        (function(sc, idx) {
            var card = document.createElement('div');
            card.className = 'nav-card';
            card.dataset.idx = idx;
            card.dataset.name = sc.name;
            if (imgMap[sc.name]) card.style.backgroundImage = 'url("' + imgMap[sc.name] + '")';
            else {
                var bg = document.createElement('div');
                bg.className = 'nav-label';
                bg.textContent = sc.name[0];
                bg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);font-size:1.4rem;font-weight:700;color:#393b57;background:none;padding:0;pointer-events:none';
                card.appendChild(bg);
            }

            var label = document.createElement('div');
            label.className = 'nav-label';
            label.textContent = sc.name;
            card.appendChild(label);

            var dot = document.createElement('div');
            dot.className = 'nav-dot';
            card.appendChild(dot);
            card.addEventListener('click', function() {
                showScenario(idx);
                highlightNav(card);
            });
            cardsWrap.appendChild(card);
        })(cases[i], i);
    }

    // collapsible leaderboard under the thumbnail row (clear any previous)
    var existingLb = navBar.querySelector('.nav-lb');
    if (existingLb) existingLb.remove();
    var lbDiv = document.createElement('details');
    lbDiv.className = 'nav-lb';
    var summaryEl = document.createElement('summary');
    summaryEl.textContent = 'Leaderboard';
    lbDiv.appendChild(summaryEl);
    var tblWrap = document.createElement('div');
    tblWrap.style.cssText = 'overflow-x:auto;margin-top:8px;padding-right:12px;max-height:300px;width:max-content';
    var lbTable = document.createElement('table');
    lbTable.id = 'leaderboard-tbl';
    tblWrap.appendChild(lbTable);
    lbDiv.appendChild(tblWrap);
    innerNav.appendChild(lbDiv);

    navBar.appendChild(innerNav);

    /* show first scenario */
    if (cases.length > 0) {
        var first = navBar.querySelector('[data-idx="0"]');
        if (first) first.click();
    }

    var msg = document.getElementById('no-scenario-msg');
    if (msg) {
        msg.style.display = 'none';
    }
    var models = [];
    modelSet.forEach(function(m) {
        models.push(m);
    });
    models.sort();
    buildLeaderboard(cases);
    updateStorageInfo();
}

function updateScenarioBadge(sc) {
    try {
        var rows = getGrouped()[sc.name] || [];
        var ratedCount = 0;
        for (var i = 0; i < rows.length; i++) {
            if (loadScores()[(sc.name + '__' + (rows[i].model || '?'))]) {
                ratedCount++;
            }
        }
        var badge = document.querySelector('.scenario-name span');
        if (badge) badge.textContent = '(' + ratedCount + '/' + rows.length + ' rated)';
    } catch (e) {}
}

function highlightNav(activeCard) {
    document.querySelectorAll('.nav-card').forEach(function(c) {
        c.classList.remove('active');
    });
    if (activeCard) activeCard.classList.add('active');
    updateDotIndicators();
}

var _GROUPED = null;

function getGrouped() {
    if (!_GROUPED) {
        _GROUPED = {};
        JSON.parse(document.getElementById('data-results').textContent.trim()).forEach(function(r) {
            if (!_GROUPED[r.scenario]) _GROUPED[r.scenario] = [];
            _GROUPED[r.scenario].push(r);
        });
    }
    return _GROUPED;
}

function updateDotIndicators() {
    var scores = loadScores(),
        cards = document.querySelectorAll('.nav-card');
    for (var i = 0; i < cards.length; i++) {
        (function(card) {
            var name = card.dataset.name;
            if (!name) return;
            var scored = false,
                grouped = getGrouped();
            var rows = grouped[name] || [];
            for (var j = 0; j < rows.length; j++) {
                if (scores[(name + '__' + (rows[j].model || '?'))]) {
                    scored = true;
                    break;
                }
            }
            card.querySelector('.nav-dot').style.display = scored ? 'block' : 'none';
        })(cards[i]);
    }
}


function showScenario(idx) {
    var scenariosData = loadJson('data-scenarios');
    var cases = scenariosData.scenarios || [];
    var sc = cases[idx];
    if (!sc) return;
    var panel = document.getElementById('scenario-panel');
    var html = '<div class="panel-header">';

    /* image */
    var imgMap = {};
    try {
        imgMap = JSON.parse(document.getElementById('data-imgmap').textContent.trim());
    } catch (e) {
        console.error('imgMap parse error:', e);
    }
    if (imgMap[sc.name]) html += '<div class="source-image-container"><img src="' + escAttr(imgMap[sc.name]) + '" alt="' + escHtml(sc.name) + '"></div>';

    html += '<div class="panel-info">';
    var rows = getGrouped()[sc.name] || [];
    var ratedCount = 0;
    for (var i = 0; i < rows.length; i++) {
        if (loadScores()[(sc.name + '__' + (rows[i].model || '?'))]) {
            ratedCount++;
        }
    }
    html += '<div class="scenario-name">' + escHtml(sc.name) + ' <span style="font-size:.7em;color:#7aa2f7">(' + ratedCount + '/' + rows.length + ' rated)</span></div><div class="scenario-category">' + escHtml(sc.category || '') + '</div>';
    if (sc.messages) html += '<div class="prompt-box">' + escHtml(JSON.stringify(sc.messages)) + '</div>';

    var rows = getGrouped()[sc.name] || [];
    /* build results */
    html += '</div></div><div class="results-grid">';

    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var cid = sc.name + '__' + (r.model || '?');
        var scoreKey = loadScores()[cid] || null;
        html += buildResultRow(r, cid, scoreKey);
    }

    /* render */
    console.log('showScenario: rendering', rows.length, 'results');
    panel.innerHTML = html;
    attachListeners();
    updateStorageInfo();
}


function buildResultRow(r, cid, scoreKey) {
    var respText = (r.response || '').trim();
    var isError = respText.toLowerCase().indexOf('error') !== -1 || respText.toLowerCase().indexOf('failed') !== -1;
    var perfStr = [];
    if (r.ttft_ms != null) perfStr.push(Math.round(r.ttft_ms) + 'ms');
    if (r.tps != null) perfStr.push(parseFloat(r.tps).toFixed(1) + ' tok/s');

    /* verdict badge */
    var v = getVerdict(scoreKey);
    var optsHtml = '';
    for (var k in SCORING) {
        var entry = SCORING[k];
        var sel = (scoreKey !== null && parseInt(scoreKey) === parseInt(k)) || (!loadScores()[cid] && k === "0");
        optsHtml += '<option value="' + k + '" ' + (sel ? 'selected' : '') + '> ' + entry[0] + '<\/option>\n';
    }

    var verdictLine = '';
    if (v) {
        verdictLine += '<br><span style="font-size:.72rem"' + (v.cls ? ' class="' + v.cls + '"' : '') + '>' + escHtml(v.text) + '</span>';
    }
    return '<div class="result-row"><div class="result-labels">' +
        '<span class="model-name">' + escHtml(r.model || '?') + verdictLine + '</span>' +
        '<div class="meta-row">' +
        (r.recipe ? '<span class="meta-tag" title="' + escAttr(JSON.stringify(r)) + '">' + escHtml(r.recipe) + '</span>' : '') +
        (r.backend ? '<span class="meta-tag" title="' + escAttr(JSON.stringify(r)) + '">' + escHtml(r.backend) + '</span>' : '') +
        '</div>' +
        '<div style="margin-top:3px;font-size:.72rem;color:#565f8e">' +
        (r.input_tokens != null ? escHtml(String(r.input_tokens)) + ' in' : '') + (r.output_tokens != null ? ' &middot; ' + escHtml(String(r.output_tokens)) + ' out' : '') + '</div></div>' +
        '<div class="result-response"><div class="response-body' + (isError ? ' error' : '') + '" title="' + escAttr(JSON.stringify({
            model: r.model,
            response: respText
        })) + '">' + escHtml(respText) + '</div>' +
        '<div class="score-panel">' +
        (perfStr.length ? '<div class="perf-strip"><span>' + perfStr.join('</span><span>') + '</span></div>' : '') +
        '<select data-card="' + escAttr(cid) + '">' + optsHtml + '</select>' +
        '</div></div></div>';
}

function buildSummaryTable(cases, grouped, models) {
    /* kept for backwards compat; nav-driven table is inline now */
}

function attachListeners() {
    var sels = document.querySelectorAll('.score-panel select');
    for (var i = 0; i < sels.length; i++) {
        (function(sel) {
            sel.addEventListener('change', function() {
                saveScore(this.dataset.card, this.value);
                highlightNav(document.querySelector('.nav-card.active'));
            });
        })(sels[i]);
    }
}

/* storage info */
function updateStorageInfo() {
    var scores = loadScores();
    var scored = Object.keys(scores).filter(function(k) {
        return parseInt(scores[k]) > 0;
    }).length;
    var total = Object.keys(scores).length;
    document.getElementById('storage-info').textContent = 'localStorage: ' + scored + ' of ' + total + ' rated';
}

/* ── global actions ─────────────────── */
function doExport() {
    var scores = loadScores(),
        scenariosData = JSON.parse(document.getElementById('data-scenarios').textContent.trim()),
        cases = scenariosData.scenarios,
        exportData = [];
    for (var i = 0; i < cases.length; i++) {
        (function(s) {
            var entry = {
                scenario: s.name,
                model_scores: {}
            };
            var grouped = getGrouped();
            var rows = grouped[s.name] || [];
            rows.forEach(function(r) {
                var m = r.model || '?';
                var raw = scores[(s.name + '__' + m)];
                if (raw && SCORING[parseInt(raw)]) entry.model_scores[m] = SCORING[parseInt(raw)][0];
                else entry.model_scores[m] = '---';
            });
            exportData.push(entry);
        })(cases[i]);
    }
    var blob = new Blob([JSON.stringify({
        exported: new Date().toISOString(),
        total: exportData.length,
        results: exportData
    }, null, 2)], {
        type: 'application/json'
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bench_scores_' + Date.now() + '.json';
    a.click();
}

/* ── leaderboard ─────────────────────── */
function buildLeaderboard(cases) {
    var scores = loadScores(),
        modelStats = {};
    for (var i = 0; i < cases.length; i++) {
        (function(s, idx) {
            var grouped = getGrouped(),
                rows = grouped[s.name] || [];
            rows.forEach(function(r) {
                var m = r.model || '?';
                if (!modelStats[m]) modelStats[m] = {
                    pass: 0,
                    marginal: 0,
                    fail: 0,
                    total: 0
                };
                var raw = scores[(s.name + '__' + m)];
                if (raw === '1') modelStats[m].pass++;
                else if (raw === '2') modelStats[m].marginal++;
                else if (raw === '3') modelStats[m].fail++;
                modelStats[m].total++;
            });
        })(cases[i], i);
        var models = Object.keys(modelStats).sort(),
            h = '<thead><tr><th>Model</th><th>Total</th><th class="lb-pass">Pass</th><th class="lb-ok">Marginal</th><th class="lb-fail">Fail</th></tr></thead><tbody>';
        models.forEach(function(m) {
            var s = modelStats[m],
                pct = function(n) {
                    return n > 0 ? ((n * 100 / s.total).toFixed(1)) + '%' : '-';
                };
            h += '<tr><td>' + escHtml(m) + '</td><td>' + s.total + '</td><td class="lb-pass">' + s.pass + ' (' + pct(s.pass) + ')</td><td class="lb-ok">' + s.marginal + ' (' + pct(s.marginal) + ')</td><td class="lb-fail">' + s.fail + ' (' + pct(s.fail) + ')</td></tr>';
        });
        h += '</tbody>';
        document.getElementById('leaderboard-tbl').innerHTML = h;
    }
}

function resetAll() {
    if (confirm('Clear all scores? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

function exportLeaderboardHtml() {
    var scores = loadScores(),
        modelStats = {},
        cases;
    try {
        cases = JSON.parse(document.getElementById('data-scenarios').textContent.trim()).scenarios || [];
    } catch (e) {
        return;
    }
    for (var i = 0; i < cases.length; i++) {
        (function(s, idx) {
            var grouped = getGrouped(),
                rows = grouped[s.name] || [];
            rows.forEach(function(r) {
                var m = r.model || '?';
                if (!modelStats[m]) modelStats[m] = {
                    pass: 0,
                    marginal: 0,
                    fail: 0,
                    total: 0
                };
                var raw = scores[(s.name + '__' + m)];
                if (raw === '1') modelStats[m].pass++;
                else if (raw === '2') modelStats[m].marginal++;
                else if (raw === '3') modelStats[m].fail++;
                modelStats[m].total++;
            });
        })(cases[i], i);
    }
    var sortedModels = Object.keys(modelStats);
    sortedModels.sort(function(a, b) {
        var sa = modelStats[a].pass * 2 + modelStats[a].marginal,
            sb = modelStats[b].pass * 2 + modelStats[b].marginal;
        return sb - sa || a.localeCompare(b)
    });
    var pct = function(n, t) {
        return n > 0 ? ((n * 100 / t).toFixed(1)) + '%' : '-'
    };
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Benchmark Leaderboard</title>' +
        '<style>body{font-family:sans-serif;padding:24px;color:#c0caf5;background:#1a1b26}' +
        'table{border-collapse:collapse;width:max-content;margin-bottom:16px}th,td{padding:8px 16px;text-align:left;border-bottom:1px solid #393b57}' +
        '.lb-pass{color:#9ece6a}.lb-ok{color:#e0af68}.lb-fail{color:#f7768e}h2{margin-top:0}</style></head><body>' +
        '<h2>Benchmark Leaderboard</h2>';
    html += '<table class="leaderboard"><thead><tr><th>Model</th><th>Total</th><th>Pass</th><th>Marginal</th><th>Fail</th></tr></thead><tbody>';
    sortedModels.forEach(function(m) {
        var s = modelStats[m];
        html += '<tr><td>' + escHtml(m) + '</td><td>' + s.total + '</td><td class="lb-pass">' + s.pass + ' (' + pct(s.pass, s.total) + ')</td><td class="lb-ok">' + s.marginal + ' (' + pct(s.marginal, s.total) + ')</td><td class="lb-fail">' + s.fail + ' (' + pct(s.fail, s.total) + ')</td></tr>';
    });
    html += '</tbody></table><p>Exported: ' + new Date().toISOString() + '</p></body></html>';
    var blob = new Blob([html], {
        type: 'text/html'
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leaderboard_' + Date.now() + '.html';
    a.click();
}
