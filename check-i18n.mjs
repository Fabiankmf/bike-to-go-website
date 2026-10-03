import fs from 'fs';
const mod = await import('./js/translations.js');
const t = mod.translations || mod.default || Object.values(mod).find(v => v && typeof v === 'object' && v.de && v.en);
if (!t) { console.log('Kein Übersetzungsobjekt gefunden. Exporte:', Object.keys(mod)); process.exit(1); }
const flat = (o, p = '', r = {}) => { for (const [k, v] of Object.entries(o)) { const key = p ? p + '.' + k : k; if (v && typeof v === 'object') flat(v, key, r); else r[key] = v; } return r; };
const langs = ['de', 'en', 'es'];
const L = Object.fromEntries(langs.map(l => [l, flat(t[l] || {})]));
const used = new Set();
for (const f of (process.argv[2] ? [process.argv[2]] : fs.readdirSync('.').filter(f => f.endsWith('.html')))) {
  const h = fs.readFileSync(f, 'utf8');
  for (const m of h.matchAll(/data-i18n(?:-[a-z]+)?="([^"]+)"/g)) used.add(m[1]);
}
for (const m of fs.readFileSync('js/main.js', 'utf8').matchAll(/\bt\(\s*['"`]([^'"`]+)['"`]/g)) used.add(m[1]);
console.log('Schlüssel im Einsatz (HTML + main.js):', used.size);
for (const l of langs) console.log(l + ':', Object.keys(L[l]).length, 'Schlüssel');
for (const l of langs) {
  const miss = [...used].filter(k => !(k in L[l]));
  console.log('\n[' + l + '] fehlt (' + miss.length + '):');
  miss.forEach(k => console.log('  ' + k));
}
for (const l of ['en', 'es']) {
  const same = Object.keys(L.de).filter(k => L[l][k] === L.de[k] && String(L.de[k]).length > 12);
  console.log('\n[' + l + '] identisch mit Deutsch (' + same.length + '):');
  same.forEach(k => console.log('  ' + k + ' → ' + String(L.de[k]).slice(0, 60)));
}
