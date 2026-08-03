#!/usr/bin/env python3
"""Launch an interactive HTML reviewer for vision benchmark results.

Usage:
    python bench_vision_review.py --scenarios scenarios.json --results results.ndjson [--port 8765]

Serves a local HTTP server so the browser doesn't block resources or scripts via file:// restrictions.
Scores persist in localStorage (key: "vision_bench_scores") — visible as colored dots on nav thumbnails and per-result rows.
"""

import argparse
import base64
import http.server
import json
import mimetypes
import os
import socketserver
import sys


def find_port(start=8765):
    for port in range(start, start + 100):
        try:
            with socketserver.TCPServer(("127.0.0.1", port), lambda *a, **k: None) as s:
                return port
        except OSError:
            continue
    raise RuntimeError("No free port found")


def embed_images(scenarios_path, results_path):
    with open(scenarios_path) as f:
        scenario_data = json.load(f)

    scenarios = scenario_data.get("scenarios", [])

    scenario_dir = os.path.dirname(os.path.abspath(scenarios_path))
    img_map = {}
    for sc in scenarios:
        ipath = sc.get("image_path")
        if not ipath:
            img_map[sc["name"]] = None
            continue
        full = os.path.join(scenario_dir, ipath)
        if os.path.isfile(full):
            data = open(full, "rb").read()
            ext = mimetypes.guess_extension(mimetypes.guess_type(full)[0] or "image/jpeg")
            mime = ("image" + ext).replace(".jpg", "/jpeg").replace(".png", "/png") if ext else "image/jpeg"
            img_map[sc["name"]] = f"data:{mime};base64,{base64.b64encode(data).decode()}"
        else:
            print(f"[warn] image not found for '{sc['name']}': {full}", file=sys.stderr)
            img_map[sc["name"]] = None

    with open(results_path) as f:
        rows = []
        for i, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                print(f"[warn] skipping malformed JSONL line {i+1}", file=sys.stderr)
                continue
            rows.append(obj)

    return scenarios, img_map, rows


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vision Benchmark Reviewer</title>
<style>
  :root { --bg: #1a1b26; --surface: #24283b; --border: #393b57; --text: #c0caf5; --muted: #565f8e; --accent: #7aa2f7; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }

  /* toolbar */
  .toolbar { position: sticky; top: 0; z-index: 200; background: var(--surface); border-bottom: 1px solid var(--border); padding: 8px 24px; display: flex; gap: 16px; align-items: center; }
  .toolbar h1 { font-size: 0.95rem; color: var(--accent); margin-right: auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 30vw; cursor: pointer; }
  .stats-bar { padding: 6px 24px; font-size: 0.75rem; color: var(--muted); display: flex; gap: 20px; background: rgba(36,40,59,0.7); border-bottom: 1px solid var(--border); }

  /* nav bar */
  .nav-bar { position: sticky; top: 48px; z-index: 150; padding: 12px 16px; display: flex; gap: 10px; overflow-x: auto; border-bottom: 1px solid var(--border); background: #1a1b26; scrollbar-width: thin; }
  .nav-card { position:relative; flex-shrink:0; width:90px;height:85px;border-radius:8px;border:2px solid transparent;background-size:cover;background-position:center;cursor:pointer;transition:border-color .15s,transform .1s;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:4px;overflow:hidden }
  .nav-card:hover { transform:scale(1.08); border-color:#7aa2f7;border-width:2.5px }
  .nav-card.active { border-color:var(--accent); box-shadow:0 0 10px rgba(122,162,247,.4);border-width:2.5px;transform:scale(1.03) }
  .nav-label { background:rgba(26,27,38,.85);color:#c0caf5;font-size:.6rem;padding:1px 4px;text-align:center;border-radius:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.4 }
  .nav-dot { position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;border:1.5px solid rgba(26,27,38,.9);display:none }

  /* scenario panel */
  #scenario-panel { padding:16px 32px }
  .panel-header { display:flex;gap:20px;align-items:flex-start;margin-bottom:16px }
  .source-image-container img{ max-width:380px;max-height:320px;border-radius:8px;display:block;background:#12131c;object-fit:contain }
  .panel-info { flex:1;min-width:0 }
  .scenario-name{ font-size:1.15rem;font-weight:600;color:var(--accent);margin-bottom:4px }
  .scenario-category{ font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px }
  .prompt-box { padding:10px 14px;background:#1a1b26;border-radius:6px;font-size:.82rem;color:#565f8e;border-left:3px solid var(--accent);white-space:pre-wrap;word-break:break-word }

  /* results */
  .results-grid { display:grid;gap:10px;margin-top:14px }
  .result-row { display:grid;grid-template-columns:340px 1fr;border:1px solid var(--border);border-radius:8px;overflow:hidden }
  @media(max-width:900px){.result-row{grid-template-columns:1fr}.source-image-container img{max-width:320px}}

  .result-labels { background:rgba(122,162,247,.08);padding:10px 14px;font-size:.8rem;display:flex;flex-direction:column;gap:2px }
  .model-name{ font-weight:600;color:#7aa2f7;font-size:.95rem;margin-bottom:4px }
  .meta-row { display:flex;gap:8px;flex-wrap:wrap }
  .meta-tag { background:rgba(122,162,247,.1);color:#7aa2f7;padding:1px 7px;border-radius:3px;font-size:.75rem;white-space:nowrap }

  .result-response{ display:flex;align-items:stretch }
  .response-body { flex:1;padding:10px 14px;background:var(--bg);font-size:.82rem;line-height:1.6;overflow-y:auto;max-height:300px;white-space:pre-wrap;word-break:break-word;scrollbar-width:thin }
  .response-body.error{ color:#f7768e;font-style:italic }

  /* scoring */
  .score-panel { width:120px;padding:10px 8px;display:flex;flex-direction:column;gap:4px;justify-content:center;align-items:center;border-left:1px solid var(--border);background:#1a1b26;flex-shrink:0 }
  .score-panel select { width:100%;padding:3px;background:#24283b;color:#c0caf5;border:1px solid #393b57;border-radius:4px;font-size:.75rem;text-align:center;cursor:pointer }
  .perf-strip{ display:flex;gap:8px;margin-top:2px;font-size:.7rem;color:#565f8e;justify-content:center }

  /* verdict badge */
  .verdict-badge { display:inline-block;padding:1px 6px;border-radius:3px;font-size:.7rem;font-weight:600;text-transform:uppercase;margin-left:auto }
  .verdict-pass{ color:#9ece6a;background:rgba(158,206,106,.1) }
  .verdict-ok { color:#e0af68;background:rgba(224,175,104,.1) }
  .verdict-fail{ color:#f7768e;background:rgba(247,118,142,.1) }

  /* summary table */
  details.summary-section { margin-top:20px;border-bottom:1px solid var(--border);padding-top:8px }
  details.summary-section summary{ cursor:pointer;user-select:none;font-size:.9rem;color:#7aa2f7;margin-bottom:6px }
  .table-wrap{ overflow-x:auto;padding:4px 0 16px }
  table.summary { border-collapse:collapse;font-size:.82rem;width:100% }
  th,td{ padding:5px 8px;text-align:left;border-bottom:1px solid var(--border);vertical-align:top;white-space:nowrap }
  th:first-child,td:first-child{ position:sticky;left:0;background:#1a1b26;z-index:2;font-weight:600;min-width:140px;overflow:hidden;text-overflow:ellipsis }
  th { color:#565f8e;font-weight:500;background:#1a1b26;z-index:1;white-space:normal !important;line-height:1.3 }

  /* storage bar */
  .storage-bar { padding: 6px 24px; font-size: 0.7rem; color: var(--muted); display: flex; gap: 12px; align-items: center; background: rgba(36,40,59,0.7); border-bottom: 1px solid var(--border); }
  
  /* buttons */
  .btn{padding:3px 10px;font-size:.72rem;border:1px solid var(--border);background:#24283b;color:#c0caf5;border-radius:4px;cursor:pointer}
  .btn:hover{background:#393b57}.btn.danger{color:#f7768e;border-color:#f7768e}

  /* leaderboard - under thumbnail ribbon */
  .nav-lb { margin:-1px auto 0;max-width:960px;border-bottom:none }
  .nav-lb summary { cursor:pointer;padding:8px 16px;font-size:.75rem;color:#c0caf5;user-select:none }
  table.leaderboard { border-collapse:collapse;font-size:.8rem;width:100%;margin-bottom:16px }
  th,td{padding:5px 10px;text-align:left;border-bottom:1px solid var(--border)}
  .lb-pass{color:#9ece6a}.lb-ok{color:#e0af68}.lb-fail{color:#f7768e}

  /* storage info */

  
  #scenario-panel:empty::before { content:'Click a thumbnail above to begin'; color:#565f8e; font-size:.9rem; text-align:center; display:block; padding:40px }
</style>
</head>
<body>

<div class="toolbar">
  <h1 id="app-title"></h1>
</div>

<div class="stats-bar" id="stats"></div>
<nav class="nav-bar" id="nav-bar"></nav>

<main id="scenario-panel">
  <div class="empty-state" style="text-align:center;padding:30px 24px;color:#565f8e;font-size:.9rem;border-bottom:1px dashed var(--border)" id="no-scenario-msg">Click a scenario thumbnail above to review</div>
</main>

<div class="storage-bar">
  <span class="storage-info" id="storage-info"></span>
  <button class="btn" onclick="exportLeaderboardHtml()">Export Leaderboard</button>
  <button class="btn danger" onclick="resetAll()">Reset All</button>
</div>

<script type="application/json" id="data-scenarios">{SCENARIOS_JSON}</script>
<script type="application/json" id="data-imgmap">{IMG_MAP_JSON}</script>
<script type="application/json" id="data-results">{RESULTS_JSON}</script>

<script src="/reviewer.js"></script>
</body>
</html>"""


def main():
    parser = argparse.ArgumentParser(description="Interactive vision benchmark reviewer")
    parser.add_argument("--scenarios", required=True, help="Path to scenarios JSON file")
    parser.add_argument("--results",   required=True, help="Path to results JSONL/NDJSON file")
    parser.add_argument("--port",      type=int, default=8765, help="Port for local server (default: 8765)")
    args = parser.parse_args()

    scenarios, img_map, rows = embed_images(args.scenarios, args.results)

    meta = {
        "scenarios_file": os.path.basename(os.path.abspath(args.scenarios)),
        "count": len(scenarios),
    }

    port = find_port(args.port)

    html_page = HTML_TEMPLATE.replace("{SCENARIOS_JSON}", json.dumps({"_meta": meta, "scenarios": scenarios})).replace(
        "{IMG_MAP_JSON}", json.dumps(img_map)).replace("{RESULTS_JSON}", json.dumps(rows))

    # Load reviewer JS from standalone file
    import shutil as _shutil
    import tempfile, webbrowser, os.path as _p, shutil

    tmpdir = tempfile.mkdtemp(prefix="bench_vision_")
    try:
        with open(_p.join(tmpdir, "index.html"), "w") as hf:
            hf.write(html_page)
        src_path = _p.join(os.path.dirname(__file__), 'reviewer.js')
        with open(src_path, 'r') as sf:
            with open(_p.join(tmpdir, "reviewer.js"), "w") as jf:
                jf.write(sf.read())
        os.chdir(tmpdir)

        class QuietHandler(http.server.SimpleHTTPRequestHandler):
            def log_message(self, format, *args): pass

        with socketserver.TCPServer(("127.0.0.1", port), QuietHandler) as httpd:
            url = f"http://127.0.0.1:{port}"
            print(f"Server running at {url}")
            webbrowser.open(url)

            import atexit, signal
            def cleanup(*_):
                shutil.rmtree(tmpdir, ignore_errors=True)
            atexit.register(cleanup)
            httpd.serve_forever()

    except Exception as e:
        shutil.rmtree(tmpdir, ignore_errors=True)
        print(f"[error] {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
