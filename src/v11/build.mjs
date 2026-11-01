// Builds french_life_v11.html from the v0.10 single-file build plus the files in this folder.
// Usage: node src/v11/build.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..', '..');
const read = f => readFileSync(join(here, f), 'utf8');
const original = readFileSync(join(root, 'original', 'french_life_v10.html'), 'utf8');

const scriptStart = original.indexOf('<script>\n') + '<script>\n'.length;
let js = original.slice(scriptStart, original.lastIndexOf('</script>'));

function cut(text, from, to, replacement) {
  const a = text.indexOf(from), b = text.indexOf(to, a + from.length);
  if (a < 0 || b < 0) throw new Error(`marker not found: ${from} … ${to}`);
  return text.slice(0, a) + replacement + text.slice(b);
}
function patch(text, find, replace) {
  const n = text.split(find).length - 1;
  if (n !== 1) throw new Error(`expected exactly one match (${n}) for: ${find.slice(0, 80)}`);
  return text.replace(find, () => replace);
}

// 1. The 2 MB AI-image atlas and its SVG-based sprite UI are replaced by procedural pixel art.
js = cut(js, '// src/data/pixel-atlas.js', '// src/characters.js', '');
js = cut(js, '// src/characters.js', '// src/persistence.js', read('pixel.js') + '\n' + read('ui.js') + '\n');
js = cut(js, '// src/app.js', '\n})();', read('app.js'));
// 2. Yearly focus and era facts.
js = patch(js, '// src/engine.js', read('focus.js') + '\n// src/engine.js');
js = patch(js, 'yearlyPaths(s); familyYear(s);', 'yearlyPaths(s); applyFocus(s); familyYear(s);');
js = patch(js, `    historyMonth(s);
    if (s.dead) return true;`, `    historyMonth(s);
    if (s.dead) return true;
    birthdayFacts(s);`);
js = patch(js, '\n  setSpeed(speed) {\n', `
  setFocus(id) {
    const s = this.state;
    if (!s || s.dead || !focusOptions(s).some(f => f.id === id)) return false;
    s.focus = id; return true;
  }
  toggleStar(index) {
    const entry = this.state?.log[index];
    if (!entry) return false;
    if (entry.star) delete entry.star; else entry.star = true;
    return true;
  }
  // Runs months synchronously until a decision opens or the life ends.
  skipToDecision(maxMonths = 600) {
    const s = this.state;
    if (!s || s.dead || s.decision) return false;
    const paused = s.runtime.paused;
    s.runtime.paused = false; s.runtime.monthProgress = 0;
    let months = 0;
    while (months < maxMonths && !s.dead && !s.decision) { this.advanceMonth(); months++; }
    if (!s.dead) s.runtime.paused = paused;
    return months;
  }
  setSpeed(speed) {
`);
// 3. Saves: keep the focus and starred entries; accept the new 'fact' log type.
js = patch(js, '  s.experience=emptyExperience();', `  s.focus = v.focus == null ? null : string(v.focus,'올해의 초점',undefined,40);
  if (s.focus && !FOCUS_IDS.has(s.focus)) s.focus = null;
  s.experience=emptyExperience();`);
js = patch(js, "type:['normal','good','bad','major','history'].includes(x.type)", "type:['normal','good','bad','major','history','fact'].includes(x.type)");
js = patch(js, "eventId:x.eventId == null ? null : string(x.eventId,'사건 ID')};", "eventId:x.eventId == null ? null : string(x.eventId,'사건 ID'), ...(x.star === true ? {star:true} : {})};");
// 2b. Names, extended history, household births/deaths, player mortality, chosen birth year.
js = cut(js, '// src/data/male.js', '// src/random.js', read('content.js') + '\n');
js = patch(js, '// src/engine.js', read('mortality.js') + '\n// src/engine.js');
js = patch(js, 'const BIRTH_RANGE = [1760, 1792];', 'const BIRTH_RANGE = [BIRTH_CHOICE.min, 1820];');
js = patch(js, 'function createState(seed = Date.now()) {', 'function createState(seed = Date.now(), options = {}) {');
js = patch(js, 'born: rand(s, ...BIRTH_RANGE),', 'born: (year => Number.isInteger(options.born) ? Math.min(BIRTH_CHOICE.max, Math.max(BIRTH_CHOICE.min, options.born)) : year)(rand(s, ...BIRTH_RANGE)),');
js = patch(js, "  milestone(s, `${s.place}에서 출생`);\n  return s;", "  milestone(s, `${s.place}에서 출생`);\n  earlierLoss(s);\n  return s;");
js = patch(js, 'r.birthYear += birthShift; r.birthMonth = 4;', 'r.birthYear += birthShift; r.birthMonth = 4; if (r.deathYear !== undefined) r.deathYear += birthShift;');
js = patch(js, "milestone(s, '자녀 출생'); changeStats(s, {행복:7,재산:-4});", "milestone(s, '자녀 출생'); changeStats(s, {행복:7,재산:-4}); childbirthRisk(s); if (s.dead) return;");
js = patch(js, 'yearlyPaths(s); applyFocus(s); familyYear(s);', 'yearlyPaths(s); applyFocus(s); familyYear(s); fateYear(s);');
js = patch(js, '    birthdayFacts(s);', '    birthdayFacts(s);\n    familyMonth(s);\n    if (s.dead) return true;');
js = patch(js, `    newLife(scenario = null) {`, `    newLife(scenario = null, options = {}) {`);
js = patch(js, `createState(seed())); autosave(); return true;`, `createState(seed(), options)); autosave(); return true;`);
// Health drift: no average decline before 40, so early death comes from bad luck rather than attrition.
js = patch(js, 'changeStats(s, {건강:rand(s,-2,1)});', 'changeStats(s, {건강: ageOf(s) < 40 ? rand(s,-1,1) : rand(s,-2,1)});');
// 2c. Era decisions, softer health penalties, rationed repeatable decisions, extra conditions.
js = patch(js, '// src/engine.js', read('decisions2.js') + '\n// src/engine.js');
js = patch(js, 'const candidates = decisions.filter(d => matches(s, d.when)', 'const candidates = decisions.filter(d => decisionAllowed(s, d) && matches(s, d.when)');
js = patch(js, '    remember(s,d);', '    remember(s,d); noteDecision(s,d);');
js = patch(js, '(s.year-s.born)*12+s.month-s.birthMonth<=c.maxAgeMonths);', `(s.year-s.born)*12+s.month-s.birthMonth<=c.maxAgeMonths)
    && (!c.sexes || c.sexes.includes(s.sex))
    && (!c.years || c.years.includes(s.year))
    && (!c.excludeYears || s.year < c.excludeYears[0] || s.year > c.excludeYears[1])
    && (!c.noLivingRoles || !c.noLivingRoles.some(role => s.relations.some(r => r.role === role && r.alive)))
    && (!c.hadRoles || c.hadRoles.every(role => s.relations.some(r => r.role === role)));`);
js = patch(js, 'birthYear: s.year - rand(s, 19, 33)', 'birthYear: s.year - Math.max(18, ageOf(s) + rand(s, -7, 4))');
// 4. Controller actions for the new controls.
js = patch(js, '    togglePause() { if (engine.togglePause())', `    setFocus(id) { if (engine.setFocus(id)) changed(); },
    toggleStar(index) { if (engine.toggleStar(index)) changed(); },
    skipToDecision() {
      const months = engine.skipToDecision();
      if (months === false) return false;
      clock.reset(); changed();
      if (engine.state.dead) clock.stop();
      else if (!engine.state.decision) notify('50년 동안 중대 결정이 없었습니다.');
      return true;
    },
    togglePause() { if (engine.togglePause())`);

const html = read('head.html') + js + '</script></body></html>\n';
writeFileSync(join(root, 'french_life_v11.html'), html);
console.log(`french_life_v11.html: ${(html.length/1024).toFixed(1)} KB`);
