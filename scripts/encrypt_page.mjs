// Encrypt an HTML page behind a password for static hosting (GitHub Pages).
// The output is a self-contained gate page: AES-256-GCM ciphertext embedded,
// key derived from the password via PBKDF2 (310k iterations, SHA-256).
// Without the password the server only ever serves ciphertext.
//
// Usage: node scripts/encrypt_page.mjs <password> <input.html> <output.html> [title] [backlink]
//   backlink: optional href shown as a "← back" link on the gate (e.g. /toolbox/)
//
// Unlock UX: on success the password is kept in sessionStorage under "tbx",
// so sibling pages encrypted with the same password auto-unlock for the session.

import { readFileSync, writeFileSync } from "node:fs";

const [, , password, input, output, title = "Protected", backlink = ""] = process.argv;
if (!password || !input || !output) {
  console.error("usage: node encrypt_page.mjs <password> <input.html> <output.html> [title] [backlink]");
  process.exit(1);
}

const ITERATIONS = 310000;
const data = new TextEncoder().encode(readFileSync(input, "utf8"));
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const keyMaterial = await crypto.subtle.importKey(
  "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data));
const b64 = (buf) => Buffer.from(buf).toString("base64");

const back = backlink
  ? `<div class="back"><a href="${backlink}">&larr; back</a></div>`
  : "";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<style>
  html { -webkit-font-smoothing: antialiased; }
  body {
    margin: 0; background: #fdfdfc; color: #1a1a1a;
    font-family: "Iowan Old Style", "Charter", "Georgia", "Times New Roman", Times, serif;
    font-size: 18px; line-height: 1.55;
  }
  main { max-width: 640px; margin: 0 auto; padding: 72px 28px 120px; }
  h1 { font-size: 22px; font-weight: 600; margin: 0 0 28px; }
  form { display: flex; gap: 10px; margin-top: 24px; }
  input[type=password] {
    flex: 1; max-width: 280px; font: inherit; font-size: 16px;
    padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; background: #fff;
  }
  button {
    font: inherit; font-size: 15px; padding: 8px 18px; cursor: pointer;
    border: 1px solid #1a1a1a; border-radius: 6px; background: #1a1a1a; color: #fdfdfc;
  }
  button:hover { background: #333; }
  .muted { color: #777; font-size: 15px; }
  #err { color: #b53a1d; font-size: 15px; }
  .back { font-family: ui-monospace, Menlo, monospace; font-size: 13px; margin-bottom: 32px; }
  .back a { color: #555; text-decoration: none; }
  .back a:hover { color: #b53a1d; text-decoration: underline; }
</style>
</head>
<body>
<main>
  ${back}
  <h1>${title}</h1>
  <p class="muted">This page is private. Enter the password to continue.</p>
  <form id="gate">
    <input type="password" id="pw" autocomplete="current-password" autofocus aria-label="Password">
    <button type="submit">Unlock</button>
  </form>
  <p id="err" hidden>That password didn&rsquo;t work.</p>
</main>
<script>
const SALT = "${b64(salt)}", IV = "${b64(iv)}", CT = "${b64(ct)}", ITER = ${ITERATIONS};
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function tryUnlock(pw) {
  const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: unb64(SALT), iterations: ITER, hash: "SHA-256" },
    km, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(IV) }, key, unb64(CT));
  const html = new TextDecoder().decode(pt);
  sessionStorage.setItem("tbx", pw);
  document.open(); document.write(html); document.close();
}
document.getElementById("gate").addEventListener("submit", async (e) => {
  e.preventDefault();
  try { await tryUnlock(document.getElementById("pw").value); }
  catch { document.getElementById("err").hidden = false; }
});
const saved = sessionStorage.getItem("tbx");
if (saved) tryUnlock(saved).catch(() => sessionStorage.removeItem("tbx"));
</script>
</body>
</html>
`;

writeFileSync(output, html);
console.log(`${output}: ${ct.length} bytes encrypted (${ITERATIONS} PBKDF2 iterations)`);
