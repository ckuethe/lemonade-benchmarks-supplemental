#!/usr/bin/env python3
"""Launch an interactive HTML reviewer for vision benchmark results.

Usage:
    python bench_vision_review.py --scenarios scenarios.json --results results.ndjson [--port 8765]

Serves bench_vision_review.html with scenario/result data injected as JSON script tags.
Scores persist in localStorage (key: "vision_bench_scores") — visible as colored dots on nav thumbnails and per-result rows.

Backup / Restore: Use the Export, Backup State, Restore State, and Reset All buttons in the top toolbar.
Import merges into existing scores.
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


def main():
    parser = argparse.ArgumentParser(description="Interactive vision benchmark reviewer")
    parser.add_argument("--scenarios", required=True, help="Path to scenarios JSON file")
    parser.add_argument("--results", required=True, help="Path to results JSONL/NDJSON file")
    parser.add_argument("--port", type=int, default=8765, help="Port for local server (default: 8765)")
    args = parser.parse_args()

    scenarios, img_map, rows = embed_images(args.scenarios, args.results)

    meta = {
        "scenarios_file": os.path.basename(os.path.abspath(args.scenarios)),
        "count": len(scenarios),
    }

    port = find_port(args.port)

    html_page = open("bench_vision_review.html").read()
    html_page = (
        html_page.replace("{SCENARIOS_JSON}", json.dumps({"_meta": meta, "scenarios": scenarios}))
        .replace("{IMG_MAP_JSON}", json.dumps(img_map))
        .replace("{RESULTS_JSON}", json.dumps(rows))
    )

    import shutil as _shutil
    import tempfile, webbrowser, os.path as _p, shutil

    tmpdir = tempfile.mkdtemp(prefix="bench_vision_")
    try:
        with open(_p.join(tmpdir, "index.html"), "w") as hf:
            hf.write(html_page)
        src_path = _p.join(os.path.dirname(__file__), "reviewer.js")
        shutil.copy2(src_path, _p.join(tmpdir, "reviewer.js"))
        os.chdir(tmpdir)

        class QuietHandler(http.server.SimpleHTTPRequestHandler):
            def log_message(self, format, *args):
                pass

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
