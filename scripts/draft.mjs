#!/usr/bin/env node
/**
 * draft.mjs — the writing tool for aisdivine journal posts.
 *
 * The "Overleaf-like" flow: write in drafts/<slug>.md (source of truth for a
 * post), live-edit it in Obsidian's split preview, and render a site-styled
 * HTML preview to see it the way it'll look published.
 *
 *   node scripts/draft.mjs new "Your Title" [category]
 *        → scaffolds drafts/<slug>.md, links it into the Obsidian vault,
 *          opens it in Obsidian (live preview) and renders + opens the HTML preview.
 *
 *   node scripts/draft.mjs preview <slug|path>
 *        → (re)renders drafts/<slug>-preview.html from the markdown and opens it.
 *
 *   node scripts/draft.mjs list
 *        → lists current drafts.
 *
 * Categories: interactivity (blue) · societal (amber). Default: interactivity.
 * No deps — pure Node. Markdown subset: # title, *meta line*, **Dek:**, ##,
 * paragraphs, - lists, ---, **bold**, *em*, [text](url).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRAFTS = path.join(ROOT, 'drafts');
const VAULT = '/Users/dkm/Documents/Obsidian Vault';
const VAULT_LINK = path.join(VAULT, 'xrisdivine-drafts');

const CAT_COLOR = { interactivity: '#2563eb', societal: '#b45309' };

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function openMac(target) {
  try { execFileSync('open', [target]); } catch { /* headless: ignore */ }
}

// ---------- markdown → html (the subset our drafts use) ----------
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function inline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
// Raw block-level HTML the author embeds (figures, svg, style…) passes through
// verbatim so the preview renders it exactly as the published page will.
const RAW_BLOCK = /^<(figure|style|div|svg|section|table|ol|ul|p|iframe|img|aside|details|blockquote|pre|h[1-6])[\s>]/i;
function renderBody(lines) {
  const out = [];
  let para = [], ul = [], ol = [], further = false;
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushUl = () => {
    if (ul.length) {
      const cls = further ? ' class="further-list"' : '';
      out.push(`<ul${cls}>${ul.map(li => `<li>${inline(li)}</li>`).join('')}</ul>`); ul = [];
    }
  };
  const flushOl = () => { if (ol.length) { out.push(`<ol>${ol.map(li => `<li>${inline(li)}</li>`).join('')}</ol>`); ol = []; } };
  const flushAll = () => { flushPara(); flushUl(); flushOl(); };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].replace(/\s+$/, '');
    const t = line.trim();
    if (t === '') { flushPara(); i++; continue; } // blank ends a paragraph but not a list, so loose lists still render 1..n
    if (!para.length && RAW_BLOCK.test(t)) {
      flushUl(); flushOl();
      const buf = [];
      while (i < lines.length && lines[i].trim() !== '') { buf.push(lines[i]); i++; }
      out.push(buf.join('\n'));
      continue;
    }
    if (/^>\s?/.test(t)) {
      flushAll();
      const bq = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        bq.push(inline(lines[i].trim().replace(/^>\s?/, '')));
        i++;
      }
      out.push(`<blockquote>${bq.join('<br>')}</blockquote>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      flushAll();
      const title = line.replace(/^##\s+/, '');
      further = /further reading/i.test(title);
      out.push(`<h3${further ? ' class="further"' : ''}>${inline(title)}</h3>`);
    } else if (/^-\s+/.test(line)) {
      flushPara(); flushOl(); ul.push(line.replace(/^-\s+/, ''));
    } else if (/^\d+\.\s+/.test(line)) {
      flushPara(); flushUl(); ol.push(line.replace(/^\d+\.\s+/, ''));
    } else if (/^---+\s*$/.test(line)) {
      flushAll(); out.push('<hr>');
    } else {
      flushUl(); flushOl(); para.push(t);
    }
    i++;
  }
  flushAll();
  return out.join('\n');
}

function toHtml(md, slug) {
  const lines = md.split('\n');
  let title = slug, meta = 'Draft', dek = '';
  let i = 0;
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    if (l.startsWith('# ')) { title = l.slice(2).trim(); i++; break; }
  }
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    if (/^\*.*\*$/.test(l)) { meta = l.replace(/^\*|\*$/g, ''); i++; }
    break;
  }
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    const m = l.match(/^\*\*Dek:\*\*\s*(.*)$/);
    if (m) { dek = m[1]; i++; }
    break;
  }
  // body starts after the first horizontal rule
  while (i < lines.length && !/^---+\s*$/.test(lines[i].trim())) i++;
  i++; // skip the ---
  const body = renderBody(lines.slice(i));

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Draft Preview</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;max-width:680px;
    margin:0 auto;padding:32px 20px 80px;color:#1a1a1a;line-height:1.7;font-size:16px;background:#fdfdfc}
  h2{font-size:26px;margin-bottom:4px}
  h3{font-size:16px;margin-top:28px;margin-bottom:8px}
  h3.further{font-size:14px;color:#888;margin-bottom:12px}
  .meta{color:#888;font-size:13px;margin-bottom:18px}
  .dek{font-style:italic;color:#888;margin-bottom:20px;font-size:15px}
  .draft-banner{background:#fffbeb;border:1px solid #f59e0b;border-radius:6px;padding:8px 14px;
    font-size:13px;color:#b45309;margin-bottom:24px}
  hr{border:none;border-top:1px solid #ddd;margin:36px 0}
  a{color:${CAT_COLOR[/societal/i.test(meta) ? 'societal' : 'interactivity']}}
  em{font-style:italic}
  ul{padding-left:1.3em}
  .further-list{font-size:14px;color:#666;line-height:1.6}
  code{background:#f3f3f0;padding:1px 5px;border-radius:4px;font-size:14px}
  blockquote{border-left:3px solid #ddd;margin:22px 0;padding:8px 18px;color:#444;font-size:15px}
  blockquote em{color:#222}
  @media (prefers-color-scheme:dark){
    body{background:#161618;color:#e5e5e5}
    .draft-banner{background:#2a2210;border-color:#a16207;color:#fbbf24}
    hr{border-top-color:#333}
    code{background:#26262a}
    blockquote{border-left-color:#3a3a3a;color:#bbb}
    blockquote em{color:#e5e5e5}
  }
</style></head><body>
<div class="draft-banner">DRAFT PREVIEW — not published · ${esc(meta)}</div>
<h2>${inline(title)}</h2>
<div class="meta">${esc(meta)}</div>
${dek ? `<p class="dek">${inline(dek)}</p>` : ''}
${body}
</body></html>`;
}

// ---------- commands ----------
function cmdPreview(arg) {
  const slug = arg.replace(/^drafts\//, '').replace(/(-preview)?\.(md|html)$/, '');
  const mdPath = path.join(DRAFTS, `${slug}.md`);
  if (!fs.existsSync(mdPath)) { console.error(`✗ no draft: ${mdPath}`); process.exit(1); }
  const outPath = path.join(DRAFTS, `${slug}-preview.html`);
  fs.writeFileSync(outPath, toHtml(fs.readFileSync(mdPath, 'utf8'), slug));
  console.log(`✓ rendered ${path.relative(ROOT, outPath)}`);
  openMac(outPath);
}

function ensureVaultLink() {
  try {
    if (fs.existsSync(VAULT) && !fs.existsSync(VAULT_LINK)) {
      fs.symlinkSync(DRAFTS, VAULT_LINK);
      console.log('✓ linked drafts into Obsidian vault (xrisdivine-drafts)');
    }
  } catch { /* ignore */ }
}

function cmdNew(title, category = 'interactivity') {
  if (!title) { console.error('✗ usage: draft.mjs new "Title" [category]'); process.exit(1); }
  const cat = CAT_COLOR[category] ? category : 'interactivity';
  const slug = slugify(title);
  const mdPath = path.join(DRAFTS, `${slug}.md`);
  if (fs.existsSync(mdPath)) { console.error(`✗ already exists: ${path.relative(ROOT, mdPath)}`); process.exit(1); }
  const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const scaffold = `# ${title}

*Category: ${cat} · Draft — ${today}*

**Dek:** [one or two sentences — the promise of the piece, in your voice]

---

[Open with the wrong place everyone starts. Then the reframe.]

## [First section]

[...]

## [Second section]

[...]

---

## Further Reading

- Author (Year). ["Title."](https://example.com) — one line on why it matters.
`;
  fs.writeFileSync(mdPath, scaffold);
  console.log(`✓ created ${path.relative(ROOT, mdPath)}`);
  ensureVaultLink();
  cmdPreview(slug);
  openMac(`obsidian://open?vault=${encodeURIComponent(path.basename(VAULT))}&file=${encodeURIComponent('xrisdivine-drafts/' + slug + '.md')}`);
  console.log(`\n  Edit live in Obsidian → xrisdivine-drafts/${slug}.md`);
  console.log(`  Re-render preview → node scripts/draft.mjs preview ${slug}`);
}

function cmdList() {
  const files = fs.readdirSync(DRAFTS).filter(f => f.endsWith('.md'));
  if (!files.length) { console.log('(no drafts)'); return; }
  for (const f of files) {
    const first = fs.readFileSync(path.join(DRAFTS, f), 'utf8').split('\n').find(l => l.startsWith('# '));
    console.log(`  ${f.replace('.md', '').padEnd(34)} ${first ? first.slice(2) : ''}`);
  }
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'new') cmdNew(rest[0], rest[1]);
else if (cmd === 'preview') cmdPreview(rest[0] || '');
else if (cmd === 'list') cmdList();
else {
  console.log(`draft.mjs — journal writing tool
  new "Title" [interactivity|societal]   scaffold + open in Obsidian + preview
  preview <slug>                          re-render the site-styled HTML preview
  list                                    list current drafts`);
}
