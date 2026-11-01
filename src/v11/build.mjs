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
