// Balance report: plays many lives with random available choices and prints the distributions.
// Usage: node tools/simulate.mjs [lives=200] [--born=1780]   (rebuild first: node src/v11/build.mjs)
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const G = require('./engine.cjs');

const args = Object.fromEntries(process.argv.slice(2).map(a => a.startsWith('--') ? a.slice(2).split('=') : ['lives', a]));
const N = Number(args.lives || 200), bornFixed = args.born ? Number(args.born) : undefined;
let seed = 12345;
const rnd = () => (seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296;

const stats = {classes:{}, places:{}, deaths:[], causes:{}, decisions:[], repeats:0, events:0, generic:0, knowledge40:[], literate:0,
  historic:0, crisisLogs:0, careers:{}, tops:{}, figures:0, siblingsLost:0, locked:0, offered:0, outlived:[]};
const engine = new G.GameEngine();
for (let i = 0; i < N; i++) {
  engine.replace(G.createState(1000 + i * 7919, {born: bornFixed}));
  const s = engine.state;
  stats.classes[s.class] = (stats.classes[s.class] || 0) + 1;
  stats.places[s.place] = (stats.places[s.place] || 0) + 1;
  const seen = new Map(); let steps = 0, k40 = null;
  while (!s.dead && steps++ < 2000) {
    if (k40 === null && G.ageOf(s) >= 40) k40 = s.stats.지식;
    if (s.decision) {
      if (s.decisionResult) { engine.acknowledgeDecision(); continue; }
      const d = G.decisions.find(x => x.id === s.decision);
      seen.set(d.id, (seen.get(d.id) || 0) + 1);
      const open = d.choices.map((c, j) => [c, j]).filter(([c]) => G.choiceAvailable(s, c));
      stats.offered += d.choices.length; stats.locked += d.choices.length - open.length;
      engine.choose(open[Math.floor(rnd() * open.length)][1]);
    } else engine.skipToDecision();
  }
  stats.deaths.push(G.ageOf(s));
  const end = s.log.find(x => x.title === '생애의 끝');
  const raw = end?.desc.split('생애를 마쳤습니다. ')[1] || '?';
  const cause = /^\d{4}년/.test(raw) ? '역사의 현장에서 사망' : raw;
  stats.causes[cause] = (stats.causes[cause] || 0) + 1;
  stats.decisions.push([...seen.values()].reduce((a, b) => a + b, 0));
  stats.repeats += [...seen.values()].filter(n => n > 1).length;
  const adult = s.log.filter(x => x.eventId && x.title.includes(' · ') && !x.title.startsWith('중대') && x.year - s.born >= 12);
  stats.events += adult.length; stats.generic += adult.filter(x => /^daily-/.test(x.eventId)).length;
  if (k40 !== null) stats.knowledge40.push(k40);
  if (G.literacyOf(s) === 'basic') stats.literate++;
  stats.litSex = stats.litSex || {}; const ks = s.sex; stats.litSex[ks] = stats.litSex[ks] || [0, 0]; stats.litSex[ks][1]++; if (G.literacyOf(s) === 'basic') stats.litSex[ks][0]++;
  stats.historic += s.log.filter(x => x.title.includes('역사의 현장')).length;
  stats.crisisLogs += s.log.filter(x => x.title.endsWith('흉년')).length;
  stats.siblingsLost += s.relations.filter(r => ['형제자매','자녀'].includes(r.role) && !r.alive && r.deathYear - r.birthYear <= 1).length;
  stats.outlived.push(G.outlivedPercent(s));
  const top = s.familyEvents.career_top;
  if (top) {
    const id = Object.keys(G.CAREERS).find(k => G.CAREERS[k].ranks.some(r => r.label === top));
    const label = id ? G.CAREERS[id].label : '기타(실존 인물·망명 등)';
    stats.careers[label] = (stats.careers[label] || 0) + 1;
    stats.tops[top] = (stats.tops[top] || 0) + 1;
  }
  stats.figures += s.relations.filter(r => r.role === '인물').length;
}
const pct = (n, d = N) => (100 * n / d).toFixed(1) + '%';
const median = a => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
const table = o => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `  ${k.padEnd(28)} ${String(v).padStart(5)}  ${pct(v)}`).join('\n');
const bins = [[0,4],[5,19],[20,39],[40,59],[60,79],[80,120]];
const kb = [[0,34],[35,49],[50,64],[65,79],[80,100]];
console.log(`\n${N} lives${bornFixed ? ` born ${bornFixed}` : ''}\n`);
console.log('Birth class\n' + table(stats.classes) + '\n\nBirth place\n' + table(stats.places));
console.log(`\nAge at death: median ${median(stats.deaths)}`);
for (const [a, b] of bins) console.log(`  ${String(a).padStart(2)}–${String(b).padEnd(3)} ${pct(stats.deaths.filter(x => x >= a && x <= b).length)}`);
console.log('\nCause of death\n' + table(stats.causes));
console.log(`\nDecisions per life: median ${median(stats.decisions)} · decisions repeated within a life: ${(stats.repeats / N).toFixed(2)} per life`);
console.log(`Choices locked by requirements: ${pct(stats.locked, stats.offered)} of all choices shown`);
console.log(`Adult everyday events from the generic set: ${pct(stats.generic, stats.events)}`);
console.log(`Knowledge at 40: median ${median(stats.knowledge40)} · ` + kb.map(([a, b]) => `${a}–${b}: ${pct(stats.knowledge40.filter(x => x >= a && x <= b).length, stats.knowledge40.length)}`).join(' · '));
console.log(`Literate at death by sex: ${Object.entries(stats.litSex).map(([k, [a, b]]) => `${k} ${pct(a, b)}`).join(' · ')}`);
console.log(`Literate at death: ${pct(stats.literate)} · historic scenes per life: ${(stats.historic / N).toFixed(2)} · hunger years lived per life: ${(stats.crisisLogs / N).toFixed(2)}`);
console.log('Careers (lives that entered one)\n' + table(stats.careers) + '\n\nHighest rank reached\n' + table(stats.tops));
console.log(`Historical figures met per life: ${(stats.figures / N).toFixed(2)}`);
console.log(`Siblings/children lost before age 2, per life: ${(stats.siblingsLost / N).toFixed(2)} · median "outlived %" at death: ${median(stats.outlived)}%\n`);
