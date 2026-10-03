import fs from 'fs';
const mod = await import('./js/translations.js');
const t = mod.translations || mod.default || Object.values(mod).find(v => v && v.de && v.en);
const flat = (o, p = '', r = {}) => { for (const [k, v] of Object.entries(o)) { const key = p ? p + '.' + k : k; if (v && typeof v === 'object') flat(v, key, r); else r[key] = v; } return r; };
const de = flat(t.de);
const file = process.argv[2] || 'index.html';
const html = fs.readFileSync(file, 'utf8');
const out = {};
const add = (k, v) => { if (k && v !== undefined && !(k in de) && !(k in out)) out[k] = v.replace(/\s+/g, ' ').trim(); };
const re = /<([a-zA-Z0-9]+)\b([^>]*)>/g;
let m;
while ((m = re.exec(html))) {
  const tag = m[1], attrs = m[2];
  const get = n => (attrs.match(new RegExp('(?<![\\w-])' + n + '="([^"]*)"')) || [])[1];
  const k = get('data-i18n') || get('data-i18n-html');
  if (k) {
    const rest = html.slice(m.index + m[0].length);
    const end = rest.search(new RegExp('</' + tag + '>', 'i'));
    add(k, rest.slice(0, end < 0 ? 200 : end).replace(/<[^>]+>/g, ''));
  }
  add(get('data-i18n-placeholder'), get('placeholder'));
  add(get('data-i18n-aria'), get('aria-label'));
  add(get('data-i18n-title'), get('title'));
}
fs.readFileSync('js/main.js', 'utf8').split('\n').forEach((line, i) => {
  for (const x of line.matchAll(/\bt\(\s*['"`]([^'"`]+)['"`]/g)) if (!(x[1] in de) && !(x[1] in out)) out[x[1]] = '[main.js:' + (i + 1) + '] ' + line.trim().slice(0, 120);
});
fs.writeFileSync('i18n-todo.json', JSON.stringify(out, null, 2));
console.log(Object.keys(out).length + ' fehlende Schlüssel in i18n-todo.json');
