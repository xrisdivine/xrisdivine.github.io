# aisdivine.github.io — journal

Static GitHub Pages site. The journal ("Thoughts on Intelligence") lives entirely
in `index.html`: each post is a **card** (in `.pt-grid`) plus an **expanded post**
(`<div class="pt-expanded" id="…">`), linked by a shared id via
`togglePost('id')`. Drafts live in `drafts/` as `<slug>.md` and an optional
`<slug>-preview.html`.

## Publishing / editing rule (keep drafts and published in sync)

A stale sentence from an older draft once leaked into a published dek and made no
sense in context. To prevent that class of bug:

- **One edit, all copies.** When you change a post's dek or body, update *every*
  copy that exists: the `index.html` expanded post, the draft `.md`, and the
  `-preview.html`. Never edit one and leave the others behind.
- **The draft `.md` is the source of truth for a post's dek.** If a draft exists
  for a post, its `**Dek:**` line must match the published dek verbatim (modulo
  HTML entities/quotes). The coherence check enforces this.
- **Cards are newest-first** (top = most recent). See `feedback_journal_chronological`.
- **Verify external links before pushing** (see `feedback_verify_links`).
- A post may exist as an expanded `<div>` with **no card** only if its date line
  is marked `Draft` (intentionally hidden). Otherwise every card ↔ post pair.

## Coherence check (the test)

Run before every push:

```bash
python3 scripts/check_coherence.py
```

It fails (exit 1) on: unparseable HTML, duplicate ids, a card with no post, a
non-draft post with no card, a card wired to the wrong post, cards out of
newest-first order, or a draft dek that disagrees with the published dek.

CI runs the same script on every push/PR (`.github/workflows/coherence.yml`).
