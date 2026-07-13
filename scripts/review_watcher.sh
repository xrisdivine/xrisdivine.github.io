#!/usr/bin/env bash
# review_watcher.sh — makes the writer's "Request review" button actually work.
#
# The browser writer drops a drafts/<slug>.review-request marker when you ask
# Claude to look at your comments. This watcher notices the marker, invokes
# Claude headlessly to read your comments, edit the draft, and write a reply,
# then clears the marker. The browser polls, so replies + edits show up live.
#
#   bash scripts/review_watcher.sh [interval_seconds]   # default 5s
#
# Requires the `claude` CLI. Ctrl-C to stop. Runs Claude with
# --dangerously-skip-permissions so it can edit files unattended; it only ever
# touches drafts/<slug>.md and drafts/<slug>.comments.json for the requested slug.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DRAFTS="$ROOT/drafts"
INTERVAL="${1:-5}"
echo "review watcher: polling $DRAFTS every ${INTERVAL}s (Ctrl-C to stop)"
while true; do
  shopt -s nullglob
  for marker in "$DRAFTS"/*.review-request; do
    slug="$(basename "$marker" .review-request)"
    echo "[$(date +%H:%M:%S)] review request: '$slug' — invoking Claude…"
    read -r -d '' PROMPT <<EOF || true
A writer left margin comments on the journal draft "$slug". Read drafts/$slug.md
and drafts/$slug.comments.json. For EACH comment whose "resolved" is false:
make the edit the comment asks for in drafts/$slug.md (keep the author's voice;
make the smallest change that satisfies the note), then in
drafts/$slug.comments.json set that comment's "reply" to a one- or two-sentence
note on what you changed, signed "— Claude", and set its "resolved" to true.
Leave already-resolved comments untouched. Then stop.
EOF
    ( cd "$ROOT" && claude -p "$PROMPT" --dangerously-skip-permissions \
        >"/tmp/review-$slug.log" 2>&1 ) \
      && echo "  ✓ processed; see /tmp/review-$slug.log" \
      || echo "  ✗ claude run failed; see /tmp/review-$slug.log"
    rm -f "$marker"
  done
  sleep "$INTERVAL"
done
