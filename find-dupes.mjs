import fs from 'fs';
const lines = fs.readFileSync('js/translations.js', 'utf8').split(/\r?\n/);
let lang = '';
const seen = {};
lines.forEach((l, i) => {
  const b = l.match(/^\s*(de|en|es)\s*:\s*\{/);
  if (b) { lang = b[1]; return; }
  const k = l.match(/^\s*["']([^"']+)["']\s*:\s*(.*)$/);
  if (!k) return;
  const id = lang + ' | ' + k[1];
  (seen[id] = seen[id] || []).push((i + 1) + (k[2].trim().startsWith('{') ? ' [OBJEKT]' : ''));
});
for (const [id, v] of Object.entries(seen)) if (v.length > 1 || v[0].includes('OBJEKT')) console.log(id, '→ Zeilen', v.join(', '));
