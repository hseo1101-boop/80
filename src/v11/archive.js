// src/archive.js — 나의 연대기
// What every finished life leaves behind in this browser: historic scenes witnessed, figures met, careers
// reached and birthplaces tried. The start screen shows the progress and one scene still waiting, with a
// way to be born for it; the codex lists everything, unseen entries as year and place only.
const ARCHIVE_KEY = 'franceLife.archive';
const HISTORIC = decisions.filter(d => d.historic).sort((a, b) => a.when.fromDate[0] - b.when.fromDate[0] || a.when.fromDate[1] - b.when.fromDate[1]);
const BIRTHPLACES = families.map(f => `${f.place}|${f.class}`).filter((k, i, all) => all.indexOf(k) === i);
const RANK_TO_CAREER = Object.fromEntries(Object.entries(CAREERS).flatMap(([id, c]) => c.ranks.map(r => [r.label, id])));

function archiveLoad() {
  try {
    const a = JSON.parse(localStorage.getItem(ARCHIVE_KEY)) || {};
    return {lives:a.lives || 0, longest:a.longest || 0, scenes:a.scenes || {}, figures:a.figures || {}, careers:a.careers || {}, births:a.births || {}, done:a.done || {}};
  } catch { return {lives:0, longest:0, scenes:{}, figures:{}, careers:{}, births:{}, done:{}}; }
}
function archiveSave(a) { try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify(a)); } catch { /* optional */ } }
const lifeKey = s => `${s.name}|${s.born}|${s.year}|${s.month}`;

// What a life touched, whether or not it is finished.
function lifeTouches(s) {
  const scenes = [...new Set(s.log.filter(x => x.eventId && HISTORIC.some(d => d.id === x.eventId)).map(x => x.eventId))];
  const figures = Object.entries(FIGURES).filter(([, f]) => s.relations.some(r => r.role === '인물' && r.name === f.name)).map(([id]) => id);
  const labels = [s.job, s.familyEvents?.career_top, ...s.lifeMilestones.map(m => m.match(/직업: (.+)/)?.[1])].filter(Boolean);
  const careers = [...new Set(labels.map(l => RANK_TO_CAREER[l]).filter(Boolean))];
  const birthPlace = s.lifeMilestones.map(m => m.match(/^(?:\d+년 · )?(.+)에서 출생$/)?.[1]).find(Boolean) || s.place;
  return {scenes, figures, careers, birth:`${birthPlace}|${s.class}`, birthPlace};
}
// Records a finished life once and returns what was new in it.
function archiveRecord(s) {
  if (!s?.dead) return null;
  const a = archiveLoad(), key = lifeKey(s);
  if (a.done[key]) return a.done[key];
  const t = lifeTouches(s);
  const fresh = {scenes:t.scenes.filter(id => !a.scenes[id]), figures:t.figures.filter(id => !a.figures[id]), careers:t.careers.filter(id => !a.careers[id]), birth:!a.births[t.birth]};
  for (const id of t.scenes) a.scenes[id] = a.scenes[id] || s.born;
  for (const id of t.figures) a.figures[id] = 1;
  for (const id of t.careers) a.careers[id] = 1;
  a.births[t.birth] = 1;
  a.lives++; a.longest = Math.max(a.longest, ageOf(s));
  a.done[key] = fresh;
  const keys = Object.keys(a.done); if (keys.length > 60) delete a.done[keys[0]];
  archiveSave(a);
  return fresh;
}
const sceneIsNew = id => !archiveLoad().scenes[id];

function scenePlace(d) {
  const w = d.when;
  if (w.places) return w.places.length > 2 ? '여러 도시' : w.places.join('·');
  if (w.placeIncludes === '농촌') return '시골 마을';
  return '어디서나';
}
function sceneWho(d) {
  const w = d.when, bits = [];
  if (w.classes) bits.push(w.classes.join('·'));
  if (w.sexes) bits.push(w.sexes[0] === '여성' ? '여성' : '남성');
  if (w.jobMatch || w.pathIs || w.knows) bits.push('특정한 일을 하는 사람');
  if (w.minAge) bits.push(`${w.minAge}세 이상`);
  return bits.join(' · ');
}
// A birth that can reach the scene: the right place and class, about 25 at the time.
function sceneBirth(d) {
  const w = d.when, year = w.fromDate[0];
  const age = Math.max(w.minAge || 0, Math.min(25, (w.maxAge || 60) - 5));
  const born = Math.min(BIRTH_CHOICE.max, Math.max(BIRTH_CHOICE.min, year - age));
  const fit = families.filter(f => (!w.places || w.places.includes(f.place)) && (!w.placeIncludes || f.place.includes(w.placeIncludes))
    && (!w.notPlaces || !w.notPlaces.includes(f.place)) && (!w.classes || w.classes.includes(f.class)));
  const f = fit[(year + born) % Math.max(1, fit.length)];
  return {born, family:f && (w.places || w.placeIncludes || w.classes) ? {place:f.place, class:f.class} : null, reachable:year - born >= (w.minAge || 0)};
}
function archiveCounts(a = archiveLoad()) {
  return [
    ['역사의 현장', Object.keys(a.scenes).length, HISTORIC.length],
    ['만난 인물', Object.keys(a.figures).length, Object.keys(FIGURES).length],
    ['오른 직업', Object.keys(a.careers).length, Object.keys(CAREERS).length],
    ['태어난 곳', Object.keys(a.births).length, BIRTHPLACES.length]
  ];
}
// One unseen scene to aim for; it changes each time the start screen opens.
function archiveTarget(a = archiveLoad()) {
  const open = HISTORIC.filter(d => !a.scenes[d.id] && sceneBirth(d).reachable && !d.when.knows);
  return open.length ? open[Math.floor(Math.random() * open.length)] : null;
}
