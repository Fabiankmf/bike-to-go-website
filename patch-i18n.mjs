import fs from 'fs';
const mod = await import('./js/translations.js');
const t = mod.translations || mod.default || Object.values(mod).find(v => v && v.de && v.en);
const flat = (o, p = '', r = {}) => { for (const [k, v] of Object.entries(o)) { const key = p ? p + '.' + k : k; if (v && typeof v === 'object') flat(v, key, r); else r[key] = v; } return r; };
const NEW = [
['header.logoAria','bike to go – Zur Startseite','bike to go – Go to homepage','bike to go – Ir a la página de inicio'],
['header.logoBadge','Deutschlandweit','Nationwide','En toda Alemania'],
['nav.ariaLabel','Hauptnavigation','Main navigation','Navegación principal'],
['header.langSelectAria','Sprache wählen','Choose language','Elegir idioma'],
['header.loginAria','Login zum Portal','Log in to the portal','Iniciar sesión en el portal'],
['header.mobileToggleAria','Menü öffnen','Open menu','Abrir menú'],
['hero.badge','Deutschlandweites Dienstrad-Leasing','Nationwide company bike leasing','Leasing de bicicletas de empresa en toda Alemania'],
['hero.cta.primary.title','Leasingrechner','Leasing Calculator','Calculadora de leasing'],
['hero.cta.primary.desc','Individuelle Ersparnis berechnen','Calculate your personal savings','Calcula tu ahorro personal'],
['hero.cta.secondary.title','Weitere Benefits & Pakete','More Benefits & Packages','Más ventajas y paquetes'],
['hero.cta.secondary.desc','Vollkasko, Service & Zubehör','Comprehensive insurance, service & accessories','Seguro a todo riesgo, servicio y accesorios'],
['hero.stats.climate','100% Klimafreundlich','100% Climate-friendly','100 % respetuoso con el clima'],
['hero.stats.upTo40','Bis zu 40%','Up to 40%','Hasta un 40 %'],
['hero.stats.savings','Ersparnis vs. Neukauf','Savings vs. buying new','Ahorro frente a la compra nueva'],
['hero.stats.full100','100%','100%','100 %'],
['hero.stats.flexible','Deutschlandweit flexibel','Flexible nationwide','Flexible en toda Alemania'],
['hero.stats.free0','0 €','€0','0 €'],
['hero.stats.employerCost','Arbeitgeber-Kosten','Employer costs','Costes para la empresa'],
['calculator.tag','Kostenlos & Live','Free & live','Gratis y en directo'],
['calculator.title','Leasingrechner','Leasing Calculator','Calculadora de leasing'],
['calculator.field.price','Fahrradpreis (brutto)','Bike price (gross)','Precio de la bicicleta (bruto)'],
['calculator.field.term','Laufzeit','Term','Duración'],
['calculator.unit.months','Monate','Months','Meses'],
['calculator.term.12','12 Monate','12 months','12 meses'],
['calculator.term.12desc','1 Jahr','1 year','1 año'],
['calculator.term.24','24 Monate','24 months','24 meses'],
['calculator.term.24desc','2 Jahre','2 years','2 años'],
['calculator.term.36','36 Monate','36 months','36 meses'],
['calculator.term.36desc','3 Jahre','3 years','3 años'],
['calculator.breakdown.priceLabel','Fahrradpreis (brutto):','Bike price (gross):','Precio de la bicicleta (bruto):'],
['calculator.breakdown.termLabel','Laufzeit:','Term:','Duración:'],
['calculator.breakdown.insuranceLabel','Versicherung & Service (10%):','Insurance & service (10%):','Seguro y servicio (10 %):'],
['calculator.breakdown.taxLabel','Steuerersparnis (Gehaltsumwandlung):','Tax savings (salary conversion):','Ahorro fiscal (retribución flexible):'],
['calculator.cta.text','Dieses Angebot anfragen','Request this offer','Solicitar esta oferta'],
['calculator.cta.subtext','Unverbindlich • 0 € Arbeitgeber-Kosten • Schnellstart','Non-binding • €0 employer costs • Quick start','Sin compromiso • 0 € de costes para la empresa • Inicio rápido'],
['google.review.title','Google Bewertung','Google Review','Reseña de Google'],
['google.review.verified','Verifiziert','Verified','Verificado'],
['google.review.experience','Ausgezeichnete Kundenerfahrung','Outstanding customer experience','Experiencia de cliente excelente'],
['google.review.reviewCount','Basierend auf über 1.500 Bewertungen','Based on 1,500+ reviews','Basado en más de 1.500 valoraciones'],
['google.review.recommendation','100% Weiterempfehlung','100% would recommend','100 % lo recomienda'],
['section.vorteile.tag','Warum bike to go','Why bike to go','Por qué bike to go'],
['liveChat.open','Live-Chat öffnen','Open live chat','Abrir chat en directo']
];
const OVER = [
['calculator.subtitle','Calculate your personal monthly leasing rate for your dream bike or e-bike in real time.','Calcula en tiempo real tu cuota mensual de leasing para tu bicicleta o e-bike soñada.'],
['calculator.field.priceAria','Bike price in euros','Precio de la bicicleta en euros'],
['calculator.rangeAria','Bike price slider','Control deslizante del precio de la bicicleta'],
['calculator.result.tag','Real-time calculation','Cálculo en tiempo real'],
['calculator.result.title','Your monthly rate','Tu cuota mensual'],
['calculator.cta.hint','Incl. 10% full protection & service','Incl. 10 % de protección total y servicio'],
['chat.input.placeholder','Write a message...','Escribe un mensaje...'],
['chat.quickAction.1','How does bike leasing work?','¿Cómo funciona el leasing de bicicletas?'],
['chat.quickAction.2','I want to register my company','Quiero registrar mi empresa'],
['chat.quickAction.3','Partner dealers near me','Concesionarios asociados cerca de mí'],
['footer.brand.desc','Your reliable partner for sustainable, nationwide bike leasing. Better health, less CO₂ and maximum mobility.','Tu socio de confianza para el leasing de bicicletas sostenible en toda Alemania. Más salud, menos CO₂ y máxima movilidad.'],
['footer.title.services','Service & Info','Servicio e información'],
['footer.bottom.copy','© 2026 bike to go GmbH. All rights reserved. Nationwide bike leasing.','© 2026 bike to go GmbH. Todos los derechos reservados. Leasing de bicicletas en toda Alemania.']
];
const lines = fs.readFileSync('js/translations.js', 'utf8').split(/\r?\n/);
const starts = [];
lines.forEach((l, i) => { const m = l.match(/^\s*(de|en|es)\s*:\s*\{/); if (m) starts.push({ lang: m[1], i }); });
starts.sort((a, b) => b.i - a.i);
const col = { de: 1, en: 2, es: 3 };
const oc = { en: 1, es: 2 };
const fmt = (k, v) => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(v) + ',';
for (const s of starts) {
  const end = lines.findIndex((l, i) => i > s.i && /^\s*(de|en|es)\s*:\s*\{/.test(l));
  const stop = end === -1 ? lines.length : end;
  const have = flat(t[s.lang] || {});
  const ins = [];
  let added = 0, replaced = 0;
  if (oc[s.lang]) for (const o of OVER) {
    const re = new RegExp('^\\s*"' + o[0].replace(/\./g, '\\.') + '"\\s*:');
    let done = false;
    for (let i = s.i + 1; i < stop; i++) if (re.test(lines[i])) { lines[i] = fmt(o[0], o[oc[s.lang]]); done = true; replaced++; break; }
    if (!done && !(o[0] in have)) { ins.push(fmt(o[0], o[oc[s.lang]])); added++; }
  }
  for (const n of NEW) if (!(n[0] in have)) { ins.push(fmt(n[0], n[col[s.lang]])); added++; }
  lines.splice(s.i + 1, 0, ...ins);
  console.log(s.lang + ': ' + added + ' neu, ' + replaced + ' ersetzt');
}
fs.writeFileSync('js/translations.js', lines.join('\n'));
