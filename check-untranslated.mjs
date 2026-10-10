import fs from 'fs';
const file = process.argv[2] || 'index.html';
const raw = fs.readFileSync(file, 'utf8');
const blank = m => m.replace(/[^\n]/g, ' ');
const html = raw.replace(/<!--[\s\S]*?-->/g, blank).replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, blank);
const VOID = new Set(['br','img','input','meta','link','hr','source','wbr','area','base','col','embed','track']);
const stack = [];
const line = i => html.slice(0, i).split('\n').length;
const found = [];
for (const m of html.matchAll(/<[^>]+>|[^<]+/g)) {
  const tok = m[0];
  if (tok.startsWith('<')) {
    if (tok.startsWith('<!')) continue;
    if (tok.startsWith('</')) { stack.pop(); continue; }
    const name = (tok.match(/^<([a-zA-Z0-9-]+)/) || [])[1];
    const has = /data-i18n(-html)?\s*=/.test(tok);
    const covered = has || stack[stack.length - 1] === true;
    const attr = (a, d) => { const x = tok.match(new RegExp('(?<![\\w-])' + a + '="([^"]+)"')); if (x && !new RegExp(d + '\\s*=').test(tok) && /[A-Za-zÄÖÜäöü]{3,}/.test(x[1])) found.push(line(m.index) + ': [' + a + '] ' + x[1]); };
    attr('aria-label', 'data-i18n-aria');
    attr('placeholder', 'data-i18n-placeholder');
    attr('title', 'data-i18n-title');
    attr('alt', 'data-i18n-alt');
    if (!VOID.has(name.toLowerCase()) && !tok.endsWith('/>')) stack.push(covered);
  } else if (stack[stack.length - 1] !== true && /[A-Za-zÄÖÜäöüß]{2,}/.test(tok)) {
    found.push(line(m.index) + ': ' + tok.replace(/\s+/g, ' ').trim());
  }
}
console.log(found.length + ' Stellen ohne data-i18n in ' + file);
found.forEach(f => console.log('  ' + f));
