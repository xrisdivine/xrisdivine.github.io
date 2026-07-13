# Writing journal posts

The blog ("Thoughts on Intelligence") lives in `index.html`. Posts are written
as markdown drafts first, then folded into `index.html` when ready.

## The writer (main editing surface, Overleaf-style)

A local browser editor with live preview and margin comments you can address to
Claude:

```bash
python3 scripts/writer_server.py            # serves on 127.0.0.1:8777
```
Then open **http://127.0.0.1:8777/?slug=&lt;slug&gt;**. Comments persist to
`drafts/&lt;slug&gt;.comments.json`; "Request review" drops a marker so Claude
picks up your notes, edits the draft, and replies live. This is "the writer."

## The flow (the "Overleaf-like" setup)

1. **Start a draft** — scaffolds the markdown, links it into Obsidian for live
   split-preview, and opens a site-styled HTML preview:
   ```bash
   node scripts/draft.mjs new "Your Title" [interactivity|societal]
   ```
   (Then edit it in the writer above at `?slug=<slug>`.)
2. **Write it.** The `.md` in `drafts/` is the source of truth for the post's
   dek and body. Edit live in **Obsidian → `xrisdivine-drafts/<slug>.md`**
   (a symlink to `drafts/`, so it's the same file — no copies, no drift), or in
   any editor.
3. **See it as it'll look published** — re-render the HTML preview any time:
   ```bash
   node scripts/draft.mjs preview <slug>
   ```
4. **Publish** — fold the draft into `index.html` as a card (newest-first) plus
   an expanded post sharing one id. Keep the draft `.md` dek matching the
   published dek.
5. **Check before pushing:**
   ```bash
   python3 scripts/check_coherence.py   # draft↔published sync, ordering, links
   ```
   Then verify external links resolve, and push.

## Conventions

- Draft markdown: `# Title`, then an italic `*meta line*`, then `**Dek:** …`,
  then `---`, then the body (`##` sections, paragraphs, `- lists`, `[links](url)`).
- Categories: **interactivity** (blue) · **societal** (amber).
- Cards are newest-first. Verify links before publishing. Keep drafts and
  published copies in sync — the coherence check enforces the dek.

## Commands

```
node scripts/draft.mjs new "Title" [category]   scaffold + Obsidian + preview
node scripts/draft.mjs preview <slug>            re-render the HTML preview
node scripts/draft.mjs list                      list current drafts
```
