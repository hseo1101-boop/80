// English translation workflow.
//   node tools/i18n.mjs extract [lives=60]  collect the strings phase 1 needs (static content + text the engine
//                                           writes during simulated English lives) into src/v11/i18n/catalog.json
//   node tools/i18n.mjs todo [n=400] [file]  list untranslated catalogue entries as "hash<TAB>Korean", most needed first
//   node tools/i18n.mjs merge               build src/v11/i18n/en.json from src/v11/i18n/en/*.txt ("hash<TAB>English")
//   node tools/i18n.mjs status              coverage per source
// Rebuild (node src/v11/build.mjs) after merge. In the .txt files "\n" stands for a line break, # starts a comment.
import {createRequire} from 'node:module';
import {readFileSync, writeFileSync, readdirSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src', 'v11', 'i18n');
const catPath = join(dir, 'catalog.json');
const hash = t => { let v = 2166136261; for (let i = 0; i < t.length; i++) v = Math.imul(v ^ t.charCodeAt(i), 16777619); return (v >>> 0).toString(16).padStart(8, '0'); };
const HANGUL = /[가-힣]/;
const hangul = t => HANGUL.test(String(t).replace(/\{[^}]*\}/g, ''));
const loadCat = () => existsSync(catPath) ? JSON.parse(readFileSync(catPath, 'utf8')) : {};
function loadEN() {
  const cat = loadCat(), en = {}, bad = [];
  for (const f of readdirSync(join(dir, 'en')).filter(f => f.endsWith('.txt')).sort()) {
    readFileSync(join(dir, 'en', f), 'utf8').split('\n').forEach((line, i) => {
      if (!line.trim() || line.startsWith('#')) return;
      const direct = line.match(/^=([^\t]+)\t(.*)$/); // =Korean<TAB>English for short words typed directly
      if (direct) { en[direct[1]] = direct[2].replace(/\\n/g, '\n'); return; }
      const m = line.match(/^([0-9a-f]{8})\t(.*)$/);
      if (!m) return bad.push(`${f}:${i + 1} malformed`);
      const c = cat[m[1]]; if (!c) return bad.push(`${f}:${i + 1} unknown hash ${m[1]}`);
      en[c.ko] = m[2].replace(/\\n/g, '\n');
    });
  }
  return {en, bad, cat};
}
const PHASE_END = 1815;
const startYear = w => w?.fromDate?.[0] ?? w?.fromYear ?? (w?.years ? Math.min(...w.years) : null);
const inPhase = w => { const y = startYear(w); return y == null || y <= PHASE_END; };
const abroad = w => w && (w.abroad || w.exileIn);

function collectStatic(G) {
  const out = []; // [ko, source, priority]
  const add = (t, src, pr) => { if (typeof t === 'string' && hangul(t)) out.push([t, src, pr]); };
  for (const f of G.families) { add(f.place, 'terms', 1); add(f.place.replace(' 농촌', ' 시골'), 'terms', 1); add(f.class, 'terms', 1); add(f.job, 'terms', 1); }
  for (const c of Object.values(G.CAREERS)) { add(c.label, 'careers', 2); for (const r of [...c.ranks, ...(c.women || [])]) add(r.label, 'careers', 2); }
  for (const v of Object.values(G.POLITICS_LABEL)) add(v, 'terms', 2);
  for (const f of Object.values(G.FIGURES)) { add(f.name, 'figures', 2); add(f.job, 'figures', 3); if (!f.death || f.death[0] <= PHASE_END) add(f.fate, 'figures', 4); }
  for (const e of G.historicalEvents) if (e.year <= PHASE_END) { add(e.text, 'history', 3); for (const i of e.impacts || []) add(i.text, 'history', 3); }
  for (const e of [...G.dailyEvents, ...G.childhoodEvents]) if (inPhase(e.when) && !abroad(e.when)) { add(e.title, 'daily', 4); add(e.text, 'daily', 4); }
  // Words an effect writes into the record: milestones, jobs, schooling.
  const fx = e => { if (!e) return; if (typeof e.milestone === 'string' && e.milestone !== '$job') add(e.milestone, 'milestones', 3); if (typeof e.job === 'string') add(e.job, 'milestones', 3); if (typeof e.education === 'string') add(e.education, 'milestones', 3); };
  for (const d of G.decisions) {
    if (d.realLife || d.when.real || d.when.bond || abroad(d.when) || !inPhase(d.when)) continue;
    const src = d.historic ? 'historic' : 'decisions', pr = d.historic ? 5 : 4;
    add(d.title, src, pr); add(d.text, src, pr);
    for (const c of d.choices) {
      if (c.when?.sceneRole || abroad(c.when)) continue;
      add(c.label, src, pr); add(c.preview, src, pr); add(c.result, src, pr);
      for (const o of c.outcomes || []) { add(o.title, src, pr); add(o.result, src, pr); fx(o.effects); }
      fx(c.effects);
    }
    for (const [k, v] of Object.entries(G.VOICE[d.id] || {})) if (!k.startsWith('role:')) add(v, 'voice', 6);
  }
  return out;
}
function collectRuntime(G, lives) {
  G.setLang('en'); G.I18N_MISS.clear();
  const engine = new G.GameEngine();
  let seed = 4242; const rnd = () => (seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296;
  for (let i = 0; i < lives; i++) {
    engine.replace(G.createState(5000 + i * 7919, {born: 1750 + (i * 7) % 50}));
    const s = engine.state; let steps = 0;
    while (!s.dead && steps++ < 3000) {
      if (s.year > PHASE_END + 5) break;
      if (s.decision) {
        if (s.decisionResult) { engine.acknowledgeDecision(); continue; }
        const d = G.decisions.find(x => x.id === s.decision);
        for (const t of [d.title]) G.L(t);
        const open = d.choices.map((c, j) => [c, j]).filter(([c]) => G.choiceAvailable(s, c));
        if (!open.length) break;
        engine.choose(open[Math.floor(rnd() * open.length)][1]);
      } else engine.skipToDecision(24);
    }
    for (const x of s.log) { G.L(x.title); G.L(x.desc); }
    for (const m of s.lifeMilestones) G.L(m);
    for (const r of s.relations) { G.L(r.role); G.L(r.job || ''); }
    G.L(s.job);
  }
  const out = [...G.I18N_MISS.entries()].map(([key, m]) => [key, 'runtime', 1, m.n, m.ex]);
  G.setLang('ko');
  return out;
}
const cmd = process.argv[2] || 'status';
if (cmd === 'extract') {
  const G = require('./engine.cjs');
  Object.assign(G.EN, loadEN().en);
  const cat = loadCat(), before = Object.keys(cat).length;
  const put = (ko, src, pr, n = 0, ex) => {
    const h = hash(ko); const c = cat[h];
    if (c && c.ko !== ko) { console.warn('hash collision', h, c.ko.slice(0, 30), '|', ko.slice(0, 30)); return; }
    if (c) { c.n = Math.max(c.n || 0, n); return; }
    cat[h] = {ko, src, pr, ...(n ? {n} : {}), ...(ex && ex !== ko ? {ex} : {})};
  };
  for (const [ko, src, pr] of collectStatic(G)) put(ko, src, pr);
  for (const [ko, src, pr, n, ex] of collectRuntime(G, Number(process.argv[3] || 60))) put(ko, src, pr, n, ex);
  writeFileSync(catPath, JSON.stringify(cat, null, 0).replace(/\},"/g, '},\n"'));
  console.log(`catalog: ${Object.keys(cat).length} entries (+${Object.keys(cat).length - before})`);
} else if (cmd === 'add') {
  // node tools/i18n.mjs add misses.json src  — entries [key, count, example] gathered in the browser
  const cat = loadCat(), rows = JSON.parse(readFileSync(process.argv[3], 'utf8')), src = process.argv[4] || 'ui';
  let added = 0;
  for (const [ko, n, ex] of rows) { const h = hash(ko); if (cat[h]) { cat[h].n = Math.max(cat[h].n || 0, n); continue; } cat[h] = {ko, src, pr:0, n, ...(ex && ex !== ko ? {ex} : {})}; added++; }
  writeFileSync(catPath, JSON.stringify(cat, null, 0).replace(/\},"/g, '},\n"'));
  console.log(`added ${added}`);
} else if (cmd === 'todo') {
  const {en, cat} = loadEN(), n = Number(process.argv[3] || 400);
  const rows = Object.entries(cat).filter(([, c]) => !(c.ko in en) && !c.retired).sort(([, a], [, b]) => a.pr - b.pr || (b.n || 0) - (a.n || 0));
  const lines = rows.slice(0, n).map(([h, c]) => `${h}\t${c.ko.replace(/\n/g, '\\n')}${c.ex ? `\t« e.g. ${c.ex.replace(/\n/g, '\\n')} »` : ''}`);
  if (process.argv[4]) writeFileSync(process.argv[4], lines.join('\n') + '\n'); else console.log(lines.join('\n'));
  console.error(`${rows.length} untranslated, ${lines.reduce((a, l) => a + l.length, 0)} chars listed`);
} else if (cmd === 'merge') {
  const {en, bad} = loadEN();
  for (const b of bad) console.warn(b);
  writeFileSync(join(dir, 'en.json'), JSON.stringify(en, null, 0).replace(/","/g, '",\n"'));
  console.log(`en.json: ${Object.keys(en).length} strings`);
} else if (cmd === 'status') {
  const {en, cat} = loadEN(), by = {};
  for (const c of Object.values(cat)) { const b = by[c.src] ??= {all:0, done:0, chars:0, left:0}; b.all++; if (c.ko in en) b.done++; else b.left += c.ko.length; }
  for (const [k, b] of Object.entries(by)) console.log(`${k.padEnd(10)} ${b.done}/${b.all}  (${b.left} Korean chars left)`);
}
