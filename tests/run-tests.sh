#!/usr/bin/env bash
# Runs tests/interaction-tests.js against index.html in headless Edge and prints the results.
# Usage (Git Bash on Windows): bash tests/run-tests.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"  # pwd -W gives a Windows path in Git Bash
URL_ROOT="file:///$(echo "$ROOT" | sed 's# #%20#g')"
EDGE="${EDGE:-/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe}"
TMP="$(cd "$(mktemp -d)" && (pwd -W 2>/dev/null || pwd))"
trap 'rm -rf "$TMP"' EXIT

# Copy of index.html with absolute asset URLs plus the test script, so it can live in a temp dir.
sed -e "s#href=\"styles.css\"#href=\"$URL_ROOT/styles.css\"#" \
    -e "s#src=\"\(icons\|data\|app\)\.js\"#src=\"$URL_ROOT/\1.js\"#" \
    -e "s#</body>#<script src=\"$URL_ROOT/tests/interaction-tests.js\"></script></body>#" \
    "$ROOT/index.html" > "$TMP/harness.html"

# Fresh profile each run, so localStorage starts empty and the app loads SEED.
# Virtual time lets the async tests (long-press waits) finish before the DOM is dumped.
"$EDGE" --headless=new --disable-gpu --user-data-dir="$TMP/profile" --window-size=1440,1300 --virtual-time-budget=10000 \
  --dump-dom "file:///$TMP/harness.html" 2>/dev/null \
  | sed -n '/<pre/,/<\/pre>/p' | sed -e 's#<[^>]*>##g' > "$TMP/out.txt"

cat "$TMP/out.txt"
echo "---"
echo "$(grep -c '^PASS' "$TMP/out.txt") passed, $(grep -cE '^(FAIL|ERROR)' "$TMP/out.txt" || true) failed"
grep -q '^PASS' "$TMP/out.txt" && ! grep -qE '^(FAIL|ERROR)' "$TMP/out.txt"
