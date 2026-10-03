import fs from 'fs';
const mod = await import('./js/translations.js');
const t = mod.translations || mod.default || Object.values(mod).find(v => v && v.de && v.en);
const flat = (o, p = '', r = {}) => { for (const [k, v] of Object.entries(o)) { const key = p ? p + '.' + k : k; if (v && typeof v === 'object') flat(v, key, r); else r[key] = v; } return r; };
const L = { de: flat(t.de), en: flat(t.en), es: flat(t.es) };
const norm = s => s.replace(/&amp;/g, '&').replace(/&copy;/g, '©').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/\s+%/g, '%').trim();
const rev = {};
for (const [k, v] of Object.entries(L.de)) if (typeof v === 'string') { const n = norm(v); if (!(n in rev)) rev[n] = k; }
const WANT = [
['Überzeugende Auswahl', 'section.vorteile.title'],
['Risikofrei', 'feature.risikofrei.title'],
['Volle Sicherheit für dein Unternehmen und deine Mitarbeitenden. Mit unserem Rundumschutz bist du bei Kündigung, längerer Krankheit, Elternzeit oder Diebstahl optimal abgesichert.', 'feature.risikofrei.desc'],
['Integrierter Vollkasko- & Diebstahlschutz', 'feature.risikofrei.item1', 'Integrated comprehensive & theft protection', 'Protección integrada a todo riesgo y contra robo'],
['Absicherung bei Jobwechsel & Elternzeit', 'feature.risikofrei.item2', 'Coverage during job changes & parental leave', 'Cobertura en caso de cambio de empleo y permiso parental'],
['24/7 deutschlandweite Mobilitätsgarantie', 'feature.risikofrei.item3', '24/7 nationwide mobility guarantee', 'Garantía de movilidad 24/7 en toda Alemania'],
['Einfache Einführung', 'feature.einfacheEinfuehrung.title'],
['In wenigen Klicks zum eigenen Firmenrad-Programm. Unser 100% digitaler Prozess spart wertvolle Zeit in der Personalabteilung und ermöglicht einen schnellen Start ohne bürokratische Hürden.', 'feature.einfacheEinfuehrung.desc'],
['100% digitale & papierlose Abwicklung', 'feature.einfacheEinfuehrung.item1', '100% digital & paperless processing', 'Gestión 100 % digital y sin papel'],
['Startbereit in unter 24 Stunden', 'feature.einfacheEinfuehrung.item2', 'Ready to start in under 24 hours', 'Listo para empezar en menos de 24 horas'],
['Persönlicher Ansprechpartner inklusive', 'feature.einfacheEinfuehrung.item3', 'Personal contact person included', 'Persona de contacto personal incluida'],
['Dein verlässlicher Partner für nachhaltiges, deutschlandweites Fahrradleasing. Mehr Gesundheit, weniger CO₂ und maximale Mobilität.', 'footer.brand.desc'],
['Zielgruppen', 'footer.title.targetGroups'],
['Service & Info', 'footer.title.services'],
['Rechtliches', 'footer.title.legal'],
['Für Arbeitgeber', 'footer.link.employer', 'For Employers', 'Para empleadores'],
['Für Arbeitnehmer', 'footer.link.employee', 'For Employees', 'Para empleados'],
['Für Selbständige', 'footer.link.freelancers', 'For Freelancers', 'Para autónomos'],
['Für Fahrradhändler', 'footer.link.dealers', 'For Bike Dealers', 'Para distribuidores de bicicletas'],
['Leasingrechner', 'footer.link.calculator', 'Leasing Calculator', 'Calculadora de leasing'],
['Schutzpakete', 'footer.link.packages', 'Protection Plans', 'Paquetes de protección'],
['Häufige Fragen (FAQ)', 'footer.link.faq', 'FAQ', 'Preguntas frecuentes (FAQ)'],
['Händlersuche', 'footer.link.dealerSearch', 'Find a Dealer', 'Buscar distribuidor'],
['Impressum', 'footer.link.imprint', 'Legal Notice', 'Aviso legal'],
['Datenschutz', 'footer.link.privacy', 'Privacy Policy', 'Política de privacidad'],
['AGB', 'footer.link.terms', 'Terms & Conditions', 'Condiciones generales'],
['Cookie-Einstellungen', 'footer.link.cookies', 'Cookie Settings', 'Configuración de cookies'],
['© 2026 bike to go GmbH. Alle Rechte vorbehalten. Deutschlandweites Fahrradleasing.', 'footer.bottom.copy']
];
const key = new Map(), add = { de: {}, en: {}, es: {} };
for (const [de, fb, en, es] of WANT) {
  const n = norm(de), k = rev[n] || fb;
  key.set(n, k);
  const vals = { de: n, en, es };
  for (const l of ['de', 'en', 'es']) {
    if (k in L[l]) continue;
    if (vals[l]) add[l][k] = vals[l]; else console.log('Achtung: Schlüssel ' + k + ' fehlt in ' + l + ' und hat keinen Text im Skript');
  }
}
const files = process.argv.length > 2 ? process.argv.slice(2) : fs.readdirSync('.').filter(f => f.endsWith('.html'));
const hit = new Set();
for (const f of files) {
  const tok = fs.readFileSync(f, 'utf8').match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || [];
  let skip = 0, n = 0;
  for (let i = 0; i < tok.length; i++) {
    const s = tok[i];
    if (s.startsWith('<!--')) continue;
    if (s[0] === '<') {
      if (/^<(script|style|title)\b/i.test(s)) skip++;
      else if (/^<\/(script|style|title)\b/i.test(s)) skip--;
      continue;
    }
    if (skip > 0) continue;
    const k = key.get(norm(s));
    if (!k) continue;
    hit.add(norm(s));
    const prev = tok[i - 1] || '', next = tok[i + 1] || '';
    const leaf = /^<[a-zA-Z]/.test(prev) && !prev.endsWith('/>') && /^<\/[a-zA-Z]/.test(next);
    if (leaf) {
      if (/data-i18n/.test(prev)) continue;
      tok[i - 1] = prev.replace(/>$/, ' data-i18n="' + k + '">'); n++;
    } else {
      const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
      tok[i] = m[1] + '<span data-i18n="' + k + '">' + m[2] + '</span>' + m[3]; n++;
    }
  }
  if (n) fs.writeFileSync(f, tok.join(''));
  console.log(f + ': ' + n + ' Attribute gesetzt');
}
for (const [de] of WANT) if (!hit.has(norm(de))) console.log('Nicht gefunden: ' + de.slice(0, 60));
const lines = fs.readFileSync('js/translations.js', 'utf8').split(/\r?\n/);
const starts = [];
lines.forEach((l, i) => { const m = l.match(/^\s*(de|en|es)\s*:\s*\{/); if (m) starts.push({ lang: m[1], i }); });
starts.sort((a, b) => b.i - a.i);
for (const s of starts) {
  const e = Object.entries(add[s.lang]);
  if (!e.length) continue;
  lines.splice(s.i + 1, 0, ...e.map(([k, v]) => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(v) + ','));
  console.log(s.lang + ': ' + e.length + ' Schlüssel ergänzt');
}
fs.writeFileSync('js/translations.js', lines.join('\n'));
