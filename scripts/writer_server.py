#!/usr/bin/env python3
"""
writer_server.py — a local, Overleaf-style editor for journal drafts.

Serves a browser editor for drafts/<slug>.md with live preview and inline
comments addressed to Claude. No terminal needed once it's running.

Flow:
  - You edit prose + drop comments in the browser (comments can quote a
    selection, like Overleaf margin notes).
  - Comments persist to drafts/<slug>.comments.json.
  - Claude reads that file + the .md, incorporates your notes, and can write a
    reply / mark a comment resolved. The browser polls, so replies and Claude's
    edits show up live.

Concurrency is handled optimistically: saves carry the hash the browser last
loaded; if Claude edited the file underneath you, the save is rejected with 409
and the browser offers to reload (your text is never silently clobbered).

Run:   python3 scripts/writer_server.py [--port 8777]
Open:  http://127.0.0.1:8777/?slug=<draft-slug>
"""
import json, os, re, sys, hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAFTS = os.path.join(ROOT, "drafts")
HERE   = os.path.dirname(os.path.abspath(__file__))
SLUG_RE = re.compile(r'^[A-Za-z0-9._-]+$')


def slug_ok(s):
    return bool(s) and bool(SLUG_RE.match(s)) and ".." not in s

def md_path(slug):        return os.path.join(DRAFTS, slug + ".md")
def comments_path(slug):  return os.path.join(DRAFTS, slug + ".comments.json")
def review_path(slug):    return os.path.join(DRAFTS, slug + ".review-request")

def list_drafts():
    if not os.path.isdir(DRAFTS):
        return []
    return sorted(f[:-3] for f in os.listdir(DRAFTS) if f.endswith(".md"))

def read_md(slug):
    p = md_path(slug)
    if not os.path.isfile(p):
        return None
    with open(p, encoding="utf-8") as fh:
        return fh.read()

def write_md(slug, text):
    with open(md_path(slug), "w", encoding="utf-8") as fh:
        fh.write(text)

def md_hash(text):
    return hashlib.sha256((text or "").encode("utf-8")).hexdigest()[:16]

def read_comments(slug):
    p = comments_path(slug)
    if not os.path.isfile(p):
        return []
    try:
        with open(p, encoding="utf-8") as fh:
            return json.load(fh)
    except Exception:
        return []

def write_comments(slug, comments):
    with open(comments_path(slug), "w", encoding="utf-8") as fh:
        json.dump(comments, fh, indent=2, ensure_ascii=False)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):  # keep the console quiet
        pass

    def _send(self, code, body, ctype="application/json"):
        if isinstance(body, (dict, list)):
            body = json.dumps(body)
        data = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _body(self):
        n = int(self.headers.get("Content-Length", "0") or 0)
        raw = self.rfile.read(n) if n else b""
        try:
            return json.loads(raw.decode("utf-8") or "{}")
        except Exception:
            return {}

    def do_GET(self):
        u = urlparse(self.path)
        q = parse_qs(u.query)
        if u.path in ("/", "/index.html"):
            with open(os.path.join(HERE, "writer.html"), encoding="utf-8") as fh:
                return self._send(200, fh.read(), "text/html; charset=utf-8")
        if u.path == "/api/list":
            return self._send(200, {"drafts": list_drafts()})
        if u.path == "/api/draft":
            slug = (q.get("slug") or [""])[0]
            if not slug_ok(slug):
                return self._send(400, {"error": "bad slug"})
            md = read_md(slug)
            if md is None:
                return self._send(404, {"error": "not found"})
            return self._send(200, {
                "slug": slug, "markdown": md, "hash": md_hash(md),
                "comments": read_comments(slug),
                "reviewPending": os.path.exists(review_path(slug)),
            })
        return self._send(404, {"error": "not found"})

    def do_POST(self):
        u = urlparse(self.path)
        b = self._body()
        slug = b.get("slug", "")
        if not slug_ok(slug):
            return self._send(400, {"error": "bad slug"})

        if u.path == "/api/save":
            cur = read_md(slug)
            if cur is None:
                return self._send(404, {"error": "not found"})
            base = b.get("baseHash")
            if base is not None and base != md_hash(cur) and not b.get("force"):
                return self._send(409, {
                    "error": "conflict", "hash": md_hash(cur),
                    "markdown": cur, "comments": read_comments(slug),
                })
            write_md(slug, b.get("markdown", ""))
            return self._send(200, {"ok": True, "hash": md_hash(read_md(slug))})

        if u.path == "/api/comment":
            comments = read_comments(slug)
            nid = (max((c.get("id", 0) for c in comments), default=0)) + 1
            comments.append({
                "id": nid,
                "anchor": ((b.get("anchor") or "").strip()[:400]) or None,
                "text": (b.get("text") or "").strip(),
                "created": b.get("created") or "",
                "resolved": False,
                "reply": None,
            })
            write_comments(slug, comments)
            return self._send(200, {"ok": True, "comments": comments})

        if u.path == "/api/comment/resolve":
            cid = b.get("id")
            comments = read_comments(slug)
            for c in comments:
                if c.get("id") == cid:
                    c["resolved"] = not c.get("resolved", False)
            write_comments(slug, comments)
            return self._send(200, {"ok": True, "comments": comments})

        if u.path == "/api/request-review":
            # Drop a marker file; a background watcher notices it and re-invokes
            # Claude, who reads the comments, edits, replies, and clears the marker.
            with open(review_path(slug), "w", encoding="utf-8") as fh:
                fh.write(b.get("created", ""))
            return self._send(200, {"ok": True})

        if u.path == "/api/comment/delete":
            cid = b.get("id")
            comments = [c for c in read_comments(slug) if c.get("id") != cid]
            write_comments(slug, comments)
            return self._send(200, {"ok": True, "comments": comments})

        return self._send(404, {"error": "not found"})


def main():
    port = 8777
    if "--port" in sys.argv:
        port = int(sys.argv[sys.argv.index("--port") + 1])
    os.makedirs(DRAFTS, exist_ok=True)
    srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Writer running at http://127.0.0.1:{port}/  (Ctrl-C to stop)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
