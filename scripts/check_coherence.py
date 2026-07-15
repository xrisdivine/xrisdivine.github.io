#!/usr/bin/env python3
"""
Journal coherence checker for aisdivine.github.io.

Guards against the class of bug where a draft and its published post drift
apart (e.g. a stale sentence from an older draft lingering in the live dek).

Checks:
  1. HTML parses without error.
  2. No duplicate post ids.
  3. Every journal card points at an expanded post that exists (no dangling cards).
  4. Every expanded post has a matching card, UNLESS it is marked "Draft"
     in its date line (intentionally hidden work-in-progress).
  5. Each card's title matches its expanded post's title.
  6. Cards are ordered newest-first (the chronological rule).
  7. DRAFT COHERENCE: for every drafts/*.md that has a "# Title" and a
     "**Dek:**" line, the matching published post's dek must match the
     draft's dek exactly (after normalizing quotes/entities/whitespace).
     This is the check that would have caught the stale-sentence bug.
  8. CITATIONS SYNC: the private citations page (/toolbox/citations/, source
     in ~/eng/research/toolbox/citations-src.html) must be updated whenever a
     post's external links change.
       a) Fingerprint: sha256 over each post's external links, compared to the
          committed .citations-fingerprint. After updating the citations page
          and re-encrypting it, restamp with:
              python3 scripts/check_coherence.py --stamp-citations
       b) Coverage (runs only where the private repo exists, i.e. locally):
          every non-draft post that cites external links must have a section
          in citations-src.html (identified by a "#journal-<post-id>" link).

Run:  python3 scripts/check_coherence.py
Exit: 0 = coherent, 1 = problems found.
"""
import hashlib
import html
import json
import re
import sys
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
DRAFTS = ROOT / "drafts"

errors = []


def err(msg):
    errors.append(msg)


def normalize(text):
    """Canonicalize prose for comparison across .md and .html."""
    text = html.unescape(text)          # &mdash; -> —, &rsquo; -> ’, etc.
    text = text.replace("’", "'").replace("‘", "'")   # curly ' -> '
    text = text.replace("“", '"').replace("”", '"')   # curly " -> "
    text = text.replace("—", "--").replace("–", "-")  # dashes
    text = re.sub(r"<[^>]+>", " ", text)  # strip any stray inline tags
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_date(s):
    m = re.search(r"([A-Z][a-z]+ \d{1,2}, \d{4})", s)
    if not m:
        return None
    return datetime.strptime(m.group(1), "%B %d, %Y")


# --- Check 1: HTML parses ------------------------------------------------
html_text = INDEX.read_text(encoding="utf-8")
try:
    HTMLParser().feed(html_text)
except Exception as e:  # pragma: no cover
    err(f"index.html failed to parse: {e}")


# --- Extract cards -------------------------------------------------------
# A card block starts at a pt-card div with an onclick and carries a title + date.
cards = []  # (id, title, date_str, order_index)
card_re = re.compile(
    r'<div class="pt-card[^"]*"\s+onclick="togglePost\(\'([^\']+)\'\)">'
    r'.*?<div class="pt-title">(.*?)</div>'
    r'.*?<div class="pt-date">(.*?)</div>',
    re.DOTALL,
)
for i, m in enumerate(card_re.finditer(html_text)):
    cards.append((m.group(1), normalize(m.group(2)), m.group(3).strip(), i))

# --- Extract expanded posts ---------------------------------------------
# Split on each pt-expanded opening; each chunk holds one post.
posts = {}  # id -> {title, dek, date_line, is_draft}
chunks = re.split(r'<div class="pt-expanded"', html_text)
for chunk in chunks[1:]:
    idm = re.search(r'id="([^"]+)"', chunk)
    if not idm:
        continue
    pid = idm.group(1)
    h2 = re.search(r"<h2>(.*?)</h2>", chunk, re.DOTALL)
    date = re.search(r'class="pt-date-full">(.*?)</div>', chunk, re.DOTALL)
    dek = re.search(
        r'<p style="font-style:italic;color:#888;[^"]*">(.*?)</p>', chunk, re.DOTALL
    )
    date_line = date.group(1).strip() if date else ""
    if pid in posts:
        err(f"duplicate post id: {pid}")
    posts[pid] = {
        "title": normalize(h2.group(1)) if h2 else "",
        "dek": normalize(dek.group(1)) if dek else "",
        "date_line": date_line,
        "is_draft": "draft" in date_line.lower(),
    }

# --- Check 3: cards point at real posts ---------------------------------
card_ids = [c[0] for c in cards]
for cid in card_ids:
    if cid not in posts:
        err(f"card '{cid}' has no matching expanded post")

# --- Check 4: posts have cards (unless draft) ---------------------------
for pid, p in posts.items():
    if pid not in card_ids and not p["is_draft"]:
        err(f"published post '{pid}' has no card and is not marked 'Draft'")

# --- Check 5: card title is (a prefix of) the post title ----------------
# Cards may use a short title and the expanded post the full one, so compare
# space/case-insensitively and allow the post title to extend the card title.
def compact(s):
    return re.sub(r"\s+", "", s).lower()

for cid, ctitle, _, _ in cards:
    if cid in posts and not compact(posts[cid]["title"]).startswith(compact(ctitle)):
        err(
            f"card title does not match its post for '{cid}':\n"
            f"    card: {ctitle}\n"
            f"    post: {posts[cid]['title']}"
        )

# --- Check 6: newest-first ordering -------------------------------------
dated = [(parse_date(d), cid) for cid, _, d, _ in cards]
for (d1, id1), (d2, id2) in zip(dated, dated[1:]):
    if d1 and d2 and d2 > d1:
        err(f"card order not newest-first: '{id2}' ({d2:%b %d}) is newer than "
            f"'{id1}' ({d1:%b %d}) but appears below it")

# --- Check 7: draft dek == published dek --------------------------------
for md in sorted(DRAFTS.glob("*.md")):
    text = md.read_text(encoding="utf-8")
    tm = re.search(r"^#\s+(.*)$", text, re.MULTILINE)
    dm = re.search(r"^\*\*Dek:\*\*\s*(.*)$", text, re.MULTILINE)
    if not tm or not dm:
        continue  # not a post draft; skip silently
    dtitle = normalize(tm.group(1))
    ddek = normalize(dm.group(1))
    match = [pid for pid, p in posts.items() if p["title"] == dtitle]
    if not match:
        continue  # WIP draft not yet published — nothing to compare against
    pid = match[0]
    if posts[pid]["dek"] != ddek:
        err(
            f"dek drift between draft and published for '{pid}':\n"
            f"    draft ({md.name}): {ddek}\n"
            f"    published:         {posts[pid]['dek']}"
        )

# --- Check 8: citations page stays in sync with posts --------------------
FINGERPRINT_FILE = ROOT / ".citations-fingerprint"
CITATIONS_SRC = Path.home() / "eng/research/toolbox/citations-src.html"

post_links = {}
for chunk in chunks[1:]:
    idm = re.search(r'id="([^"]+)"', chunk)
    if idm:
        post_links[idm.group(1)] = sorted(set(re.findall(r'href="(https?://[^"]+)"', chunk)))
fingerprint = hashlib.sha256(
    json.dumps(post_links, sort_keys=True).encode()
).hexdigest()

if "--stamp-citations" in sys.argv:
    FINGERPRINT_FILE.write_text(fingerprint + "\n")
    print(f"citations fingerprint stamped: {fingerprint[:12]}…")
    sys.exit(0)

if not FINGERPRINT_FILE.exists():
    err("no .citations-fingerprint — run: python3 scripts/check_coherence.py --stamp-citations")
elif FINGERPRINT_FILE.read_text().strip() != fingerprint:
    err(
        "post links changed since the citations page was last updated.\n"
        "    Update ~/eng/research/toolbox/citations-src.html, re-encrypt it into\n"
        "    toolbox/citations/index.html (scripts/encrypt_page.mjs), then restamp:\n"
        "    python3 scripts/check_coherence.py --stamp-citations"
    )

if CITATIONS_SRC.exists():
    cit_src = CITATIONS_SRC.read_text(encoding="utf-8")
    for pid, links in post_links.items():
        if links and not posts.get(pid, {}).get("is_draft") and f"#journal-{pid}" not in cit_src:
            err(
                f"post '{pid}' cites {len(links)} external link(s) but has no section "
                f"in the citations page (expected a '#journal-{pid}' link in citations-src.html)"
            )

# --- Report --------------------------------------------------------------
if errors:
    print(f"COHERENCE CHECK FAILED — {len(errors)} problem(s):\n")
    for e in errors:
        print(f"  ✗ {e}")
    sys.exit(1)

print(f"COHERENCE OK — {len(cards)} cards, {len(posts)} posts, drafts in sync.")
sys.exit(0)
