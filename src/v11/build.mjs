// Builds french_life_v11.html from the v0.10 single-file build plus the files in this folder.
// Usage: node src/v11/build.mjs
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
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
js = cut(js, '// src/app.js', '\n})();', read('guestbook.js') + '\n' + read('archive.js') + '\n' + read('app.js'));
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
js = patch(js, 'yearlyPaths(s); applyFocus(s); familyYear(s);', 'yearlyPaths(s); applyFocus(s); knowledgeYear(s); familyYear(s); fateYear(s);');
js = patch(js, '    birthdayFacts(s);', '    birthdayFacts(s);\n    familyMonth(s);\n    if (s.dead) return true;');
js = patch(js, `    newLife(scenario = null) {`, `    newLife(scenario = null, options = {}) {`);
js = patch(js, `createState(seed())); autosave(); return true;`, `createState(seed(), options)); autosave(); return true;`);
// Health drift: no average decline before 40, so early death comes from bad luck rather than attrition.
js = patch(js, 'changeStats(s, {건강:rand(s,-2,1)});', 'changeStats(s, {건강: ageOf(s) < 40 ? rand(s,-1,1) : rand(s,-2,1)});');
// 2c. Era decisions, softer health penalties, rationed repeatable decisions, extra conditions.
js = patch(js, '// src/engine.js', read('decisions2.js') + '\n// src/engine.js');
js = patch(js, 'const candidates = decisions.filter(d => matches(s, d.when)', 'const candidates = decisions.filter(d => !d.historic && decisionAllowed(s, d) && matches(s, d.when) && (d.chance === undefined || random(s) < d.chance)');
js = patch(js, '    remember(s,d);', '    remember(s,d); noteDecision(s,d);');
js = patch(js, '(s.year-s.born)*12+s.month-s.birthMonth<=c.maxAgeMonths);', `(s.year-s.born)*12+s.month-s.birthMonth<=c.maxAgeMonths)
    && (!c.sexes || c.sexes.includes(s.sex))
    && (!c.years || c.years.includes(s.year))
    && (!c.excludeYears || s.year < c.excludeYears[0] || s.year > c.excludeYears[1])
    && (!c.noLivingRoles || !c.noLivingRoles.some(role => s.relations.some(r => r.role === role && r.alive)))
    && (!c.hadRoles || c.hadRoles.every(role => s.relations.some(r => r.role === role)))
    && (!c.jobMatch || new RegExp(c.jobMatch).test(s.job))
    && (!c.notPlaces || !c.notPlaces.includes(s.place))
    && (c.minAptitude === undefined || (s.aptitude || 50) >= c.minAptitude)
    && (c.minKnowledge === undefined || s.stats.지식 >= c.minKnowledge)
    && (!c.noCareer || !s.career)
    && (c.parentAgeMin === undefined || s.relations.some(r => ['아버지','어머니'].includes(r.role) && r.alive && ageOf(s, r) >= c.parentAgeMin))
    && (!c.childAge || s.relations.some(r => r.role === '자녀' && r.alive && ageOf(s, r) >= c.childAge[0] && ageOf(s, r) <= c.childAge[1] && (!c.childSex || personSex(r) === c.childSex)))
    && (!c.flagSet || !!s.flags[c.flagSet])
    && (!c.after || [].concat(c.after.id).some(id => typeof s.familyEvents['t-' + id] === 'number' && s.year - s.familyEvents['t-' + id] >= c.after.years))
    && (!c.careerIs || (s.career && c.careerIs.includes(s.career.id)))
    && (c.minRank === undefined || (s.career && s.career.rank >= c.minRank))
    && (c.maxAptitude === undefined || (s.aptitude || 50) <= c.maxAptitude)
    && (c.minRelation === undefined || relationScore(s) >= c.minRelation)
    && (c.maxHealth === undefined || s.stats.건강 <= c.maxHealth)
    && (!c.notPlaceIncludes || !s.place.includes(c.notPlaceIncludes))
    && (!c.pathIs || Object.entries(c.pathIs).every(([k, v]) => s.paths[k] === v))
    && (!c.knows || c.knows.every(id => s.relations.some(r => r.role === '인물' && r.name === FIGURES[id]?.name)));`);
js = patch(js, 'birthYear: s.year - rand(s, 19, 33)', 'birthYear: s.year - Math.max(18, ageOf(s) + rand(s, -7, 4))');
// 2d. Innate aptitude: bell-curve starting knowledge and a learning multiplier.
js = patch(js, '// src/engine.js', read('aptitude.js') + '\n// src/engine.js');
js = patch(js, '  for (const key of STAT_KEYS) if (key in delta) s.stats[key] = clamp(s.stats[key] + delta[key]);',
  "  for (const key of STAT_KEYS) if (key in delta) s.stats[key] = clamp(s.stats[key] + (key === '지식' ? knowledgeDelta(s, delta[key]) : delta[key]));");
js = patch(js, "dailyCategories:{universal:0,personal:0,historical:0}});", "dailyCategories:{universal:0,personal:0,historical:0}});\n  assignAptitude(s);");
js = patch(js, 'stats:{건강:82,행복:65,지식:4,재산:37}', 'stats:{건강:82,행복:65,지식:s.stats.지식,재산:37}');
js = patch(js, '  s.experience=emptyExperience();', "  s.aptitude = number(v.aptitude,'선천적 능력',1,100,legacyAptitude(v));\n  s.experience=emptyExperience();");
// 2e. Historic participation decisions ("역사의 현장"), opened in the month of the event.
js = patch(js, '// src/engine.js', read('historic.js') + '\n' + read('historic2.js') + '\n' + read('historic3.js') + '\n// src/engine.js');
js = patch(js, '    familyMonth(s);\n    if (s.dead) return true;', '    familyMonth(s);\n    if (s.dead) return true;\n    historicDecision(s);\n    if (s.decision) return true;');
js = patch(js, "  if (effects.milestone) milestone(s, effects.milestone === '$job'", "  if (effects.doom) s.familyEvents.doom = String(effects.doom).slice(0, 300);\n  if (effects.milestone) milestone(s, effects.milestone === '$job'");
js = patch(js, '    s.decision=null; s.decisionResult=null;\n    return true;', "    s.decision=null; s.decisionResult=null;\n    if (s.familyEvents.doom) { const reason = s.familyEvents.doom; delete s.familyEvents.doom; endLife(s, reason); }\n    return true;");
js = patch(js, '      if (!engine.acknowledgeDecision()) return false;\n      clock.reset(); changed(); return true;', '      if (!engine.acknowledgeDecision()) return false;\n      clock.reset(); changed(); if (engine.state.dead) clock.stop(); return true;');
// 2f. Concrete everyday events by place, class, period and stage; prefer fresh ones.
js = patch(js, '// src/engine.js', read('daily2.js') + '\n' + read('midlife.js') + '\n// src/engine.js');
js = patch(js, 'return pick(s,group.events.filter(e=>e.overrideChance===undefined).length ? group.events.filter(e=>e.overrideChance===undefined) : group.events);',
  'return pick(s,preferFresh(s,group.events.filter(e=>e.overrideChance===undefined).length ? group.events.filter(e=>e.overrideChance===undefined) : group.events));');
js = patch(js, '  const group=groups.find(g=>(roll-=g.weight)<0)||groups.at(-1);', '  const group=personalFirst(s,groups,groups.find(g=>(roll-=g.weight)<0)||groups.at(-1));');
js = patch(js, "weight:category==='historical'?20:40", "weight:category==='historical'?20:category==='personal'?55:25");
// 2g. Birth lottery, hunger years, choice requirements, life report.
js = patch(js, '// src/engine.js', read('prices.js') + '\n' + read('lottery.js') + '\n' + read('summary.js') + '\n// src/engine.js');
js = patch(js, 'const family = pick(s, families), surname = pick(s, surnames);', 'const picked = pickFamily(s), family = (options.family && families.find(f => f.place === options.family.place && f.class === options.family.class)) || picked, surname = pick(s, surnames);');
js = patch(js, '  earlierLoss(s);\n  return s;', '  earlierLoss(s);\n  birthLottery(s);\n  return s;');
js = patch(js, 'familyYear(s); fateYear(s);', 'familyYear(s); crisisYear(s); fateYear(s);');
js = patch(js, 'if (!s || s.dead || !d || s.decisionResult || !Number.isInteger(index) || !d.choices[index]) return false;', 'if (!s || s.dead || !d || s.decisionResult || !Number.isInteger(index) || !d.choices[index] || !choiceAvailable(s, d.choices[index])) return false;');
// 2h. Careers with ranks and reputation, career doors, historical figures you meet.
js = patch(js, '// src/engine.js', read('careers.js') + '\n' + read('careers2.js') + '\n' + read('army.js') + '\n' + read('girls.js') + '\n' + read('family.js') + '\n' + read('careermid.js') + '\n' + read('mid19.js') + '\n' + read('outcomes.js') + '\n' + read('womenwork.js') + '\n' + read('reallives.js') + '\n' + read('bonds.js') + '\n' + read('revolution2.js') + '\n' + read('era52.js') + '\n' + read('childhood52.js') + '\n' + read('bonds2.js') + '\n' + read('facets.js') + '\n' + read('exile.js') + '\n' + read('voice.js') + '\n' + read('lifefix.js') + '\n' + read('scenes2.js') + '\n' + read('scenes3.js') + '\n' + read('scenes4.js') + '\n' + read('politics.js') + '\n' + read('groups.js') + '\n// src/engine.js');
js = patch(js, "  if (effects.doom) s.familyEvents.doom", "  applyCareerEffects(s, effects);\n  applyFamilyEffects(s, effects);\n  if (effects.doom) s.familyEvents.doom");
js = patch(js, 'familyYear(s); crisisYear(s);', 'familyYear(s); careerYear(s); crisisYear(s);');
js = patch(js, '    historicDecision(s);\n    if (s.decision) return true;', '    figureFates(s);\n    historicDecision(s);\n    if (s.decision) return true;');
js = patch(js, "  for (const r of s.relations) {\n    if (!r.alive) continue;\n    const a = ageOf(s, r);", "  for (const r of s.relations) {\n    if (!r.alive || r.role === '인물') continue;\n    const a = ageOf(s, r);");
js = patch(js, "education: '미정', reputation: 50,", "education: '미정', reputation: 10,");
// 2i. Real lives: a rare birth as someone who lived; recorded turning points; no chance death on the record.
js = patch(js, 'function createState(seed = Date.now(), options = {}) {', 'function createState(seed = Date.now(), options = {}) {\n  options = realLifeOptions(seed, options);');
js = patch(js, '  earlierLoss(s);\n  birthLottery(s);\n  return s;', '  earlierLoss(s);\n  birthLottery(s);\n  applyRealLife(s, options.real);\n  return s;');
js = patch(js, 'function endLife(s, reason) {\n  if (s.dead) return;', 'function endLife(s, reason) {\n  if (s.dead) return;\n  if (realGuard(s)) return;');
js = patch(js, '    && (!c.knows ||', '    && (!c.real || s.familyEvents.real === c.real)\n    && (!c.onHistory || !s.familyEvents.realOff)\n    && (!c.knows ||');
js = patch(js, '  applyCareerEffects(s, effects);\n', '  applyCareerEffects(s, effects);\n  applyRealEffects(s, effects);\n');
js = patch(js, '    figureFates(s);\n', '    figureFates(s);\n    realKeep(s);\n');
// 2j. Bonds that return decades later, and the same revolution seen from different places.
js = patch(js, '    && (!c.real || s.familyEvents.real === c.real)', '    && (!c.bond || !!bondPick(s, c.bond))\n    && (!c.terrorRisk || terrorRisk(s))\n    && (c.maxBonds === undefined || bondsOf(s).filter(b => s.year - b.year < 30).length < c.maxBonds)\n    && (!c.politicsIn || c.politicsIn.includes(s.paths.politics))\n    && (!c.abroad || isAbroad(s))\n    && (!c.eliteChild || isEliteChild(s))\n    && (!c.sceneRole || sceneRoleOf(s) === c.sceneRole)\n    && (!c.sceneRoleNot || !c.sceneRoleNot.includes(sceneRoleOf(s)))\n    && (!c.politicsDue || ageOf(s) >= 18 && s.year - (s.familyEvents.polAsked ?? -99) >= 9)\n    && (!c.kids || (n => n >= c.kids[0] && n <= c.kids[1])(kidCount(s)))\n    && (!c.exileIn || c.exileIn.includes(exileOf(s)))\n    && (!c.royalOfficer || royalOfficer(s))\n    && (!c.real || s.familyEvents.real === c.real)');
js = patch(js, '  applyRealEffects(s, effects);\n', '  applyRealEffects(s, effects);\n  applyBondEffects(s, effects);\n  applyFacetEffects(s, effects);\n  applyPoliticsEffects(s, effects);\n');
js = patch(js, 'careerYear(s); crisisYear(s);', 'careerYear(s); bondYear(s); kinMarry(s); lifeFixYear(s); crisisYear(s);');
js = patch(js, "    addLog(s, '역사적 사건', [event.text, ...impacts.map(i => i.text)].join('\\n'), 'history', event.id);", "    addLog(s, '역사적 사건', [event.text, ...impacts.map(i => i.text)].join('\\n'), 'history', event.id);\n    politicalMood(s, event);");
js = patch(js, "    if (r.deathYear !== undefined) p.deathYear = number(r.deathYear,'사망 연도',p.birthYear,s.year);", "    if (r.deathYear !== undefined) p.deathYear = number(r.deathYear,'사망 연도',p.birthYear,s.year);\n    if (Number.isInteger(r.married)) p.married = r.married;");
js = patch(js, 'function decisionText(s,d) {', 'function decisionText(s,d) {\n  if (d.id !== \'school\') return bondFill(s, d, voiceText(s, d));');
js = patch(js, '\\n선택: ${choice.label}\\n결과: ${outcome.title}\\n${outcome.result}`', '\\n선택: ${bondFill(s, d, choice.label)}\\n결과: ${outcome.title}\\n${bondFill(s, d, outcome.result)}`');

js = patch(js, "  s.aptitude = number(", `  if (v.career != null) {
    const c = object(v.career, '진로');
    if (!CAREERS[c.id]) throw new Error('알 수 없는 진로입니다.');
    s.career = {id:c.id, rank:number(c.rank, '진로 단계', 0, CAREERS[c.id].ranks.length - 1), since:number(c.since, '진로 시작 연도', 1600, 2200)};
  } else s.career = null;
  s.aptitude = number(`);
// 2i. Soldiers at the front: no home-town everyday events, discharge in peacetime.
js = patch(js, 'filter(e=>e.kind===kind && matches(s,e.when) &&', 'filter(e=>e.kind===kind && matches(s,e.when) && !(atFront(s) && (e.when.places || e.when.placeIncludes)) && !(isAbroad(s) && (e.when.places || e.when.placeIncludes || e.when.notPlaceIncludes || e.when.classes)) && !(e.when.parentJobs && ageOf(s) >= 14 && !e.when.parentJobs.some(p => (s.job || \'\').includes(p))) &&');
js = patch(js, 'familyYear(s); careerYear(s);', 'familyYear(s); careerYear(s); armyYear(s);');
// 2j. Girls' schooling and fewer informal chances to learn; the school scenario follows the player's sex.
js = patch(js, "  return Math.min(.8,.25+(s.experience?.educationInterest||0)*.04+(s.stats.재산>=55?.15:0))*burden;", "  return Math.min(.8,.25+(s.experience?.educationInterest||0)*.04+(s.stats.재산>=55?.15:0))*burden*girlsLearningFactor(s);");
js = patch(js, "  return s.paths.learning==='family' && s.paths.priority!=='study' ? .08 : .24;", "  return (s.paths.learning==='family' && s.paths.priority!=='study' ? .08 : .24) * girlsLearningFactor(s);");
js = patch(js, "s.decision='school'; s.lastDecision=s.year;", "s.decision=s.sex==='여성' ? 'school-girls' : 'school'; s.lastDecision=s.year;");
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
// GitHub Pages serves the repository root, so the game is also the site's index page.
writeFileSync(join(root, 'index.html'), html);
// community.html loads the same guestbook code as a plain script.
writeFileSync(join(root, 'guestbook.js'), read('guestbook.js'));
// The web build is the same game without the document skeleton, for hosts that wrap the page themselves.
const page = html.replace(/^<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport"[^>]*>/, '').replace('</style></head><body>', '</style>').replace('</script></body></html>', '</script>')
  // Embedded viewers block downloads; the copyable save code covers it there.
  .replace('<button id="saveFile">', '<button id="saveFile" data-off="1">')
  .replace('<button id="shareSave">', '<button id="shareSave" hidden>')
  .replace('const GUESTBOOK_EMBEDDED = false;', 'const GUESTBOOK_EMBEDDED = true;');
mkdirSync(join(root, 'site'), {recursive:true});
// Engine-only bundle (no DOM) for tools/simulate.mjs.
const body = js.replace(/^\(\(\) => \{\n'use strict';\n/, '');
const engineOnly = body.slice(0, body.indexOf('// src/ui.js'));
mkdirSync(join(root, 'tools'), {recursive:true});
writeFileSync(join(root, 'tools', 'engine.cjs'), `// Generated by src/v11/build.mjs — do not edit.\n'use strict';\n${engineOnly}\nmodule.exports = {CAREERS, GameEngine, createState, decisions, dailyEvents, childhoodEvents, ageOf, literacyOf, relationScore, lifeReport, choiceAvailable, outlivedPercent};\n`);
writeFileSync(join(root, 'site', 'index.html'), page);
console.log(`french_life_v11.html: ${(html.length/1024).toFixed(1)} KB`);

