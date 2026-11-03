// src/mortality.js
// Births and deaths in the household, and the player's own bad luck. A game model with rates
// rounded from French historical demography; not a reconstruction of any real family.
const monthIndex = (year, month) => year*12 + month;
function monthsOld(s, r) { return monthIndex(s.year, s.month) - monthIndex(r.birthYear, r.birthMonth || 1); }
function siblingWord(s, r) {
  const sex = personSex(r), older = monthIndex(r.birthYear, r.birthMonth || 1) < monthIndex(s.born, s.birthMonth);
  if (!older) return sex === '여성' ? '여동생' : '남동생';
  if (s.sex === '남성') return sex === '여성' ? '누나' : '형';
  return sex === '여성' ? '언니' : '오빠';
}
// A name nobody else in the living family already uses.
function freshName(s, list, surname) {
  const used = new Set([s.name, ...s.relations.filter(r => r.alive).map(r => r.name)].map(n => n.split(' ')[0]));
  const options = list.filter(n => !used.has(n));
  return pick(s, options.length ? options : list) + ' ' + surname;
}
function infantMonthlyRisk(s, birthYear) { return birthYear < 1800 ? .023 : .018; }

function familyMonth(s) {
  if (s.dead) return;
  const surname = s.name.split(' ').at(-1);
  const mother = s.relations.find(r => r.role === '어머니' && r.alive), father = s.relations.find(r => r.role === '아버지' && r.alive);
  // Younger siblings keep arriving while the parents are together and the mother is of age.
  if (mother && father && ageOf(s) < 20) {
    const births = [monthIndex(s.born, s.birthMonth), ...s.relations.filter(r => r.role === '형제자매').map(r => monthIndex(r.birthYear, r.birthMonth || 1))];
    const gap = monthIndex(s.year, s.month) - Math.max(...births), motherAge = ageOf(s, mother);
    if (motherAge >= 18 && motherAge <= 42 && births.length < 8 && gap >= 15 && random(s) < .03) {
      const sex = pick(s, ['남성','여성']);
      const r = {name:freshName(s, sex === '남성' ? male : female, surname), role:'형제자매', sex, birthYear:s.year, birthMonth:s.month,
        alive:true, closeness:rand(s, 55, 80), job:'없음'};
      s.relations.push(r);
      addLog(s, '가족의 변화', `${siblingWord(s, r)} ${r.name}이(가) 태어났습니다.`, 'good');
      changeStats(s, {행복:3});
    }
  }
  // Infant and child mortality for siblings and the player's own children.
  for (const r of s.relations) {
    if (!r.alive || !['형제자매','자녀'].includes(r.role)) continue;
    const m = monthsOld(s, r);
    if (m <= 0) continue;
    const q = (m < 12 ? infantMonthlyRisk(s, r.birthYear) : m < 60 ? .003 : m < 120 ? .0009 : 0) * crisisFactor(s);
    if (!q || random(s) >= q) continue;
    r.alive = false; r.deathYear = s.year;
    const who = r.role === '자녀' ? `${personSex(r) === '여성' ? '딸' : '아들'} ${r.name}` : `${siblingWord(s, r)} ${r.name}`;
    const text = m < 12 ? `갓 태어난 ${who}이(가) 첫돌을 넘기지 못하고 세상을 떠났습니다.`
      : `${who}이(가) ${Math.floor(m/12)}살의 어린 나이에 병으로 세상을 떠났습니다.`;
    addLog(s, '가족의 슬픔', text, 'bad');
    milestone(s, `${who}과(와) 작별`);
    changeStats(s, {행복: r.role === '자녀' ? -15 : -8});
    if (r.role === '자녀') s.relations.forEach(p => { if (p.role === '배우자' && p.alive) p.closeness = clamp(p.closeness + 3); });
  }
}

// The player's own risk, rolled once a year. Poor health and poverty raise every risk.
function fateYear(s) {
  if (s.dead) return;
  const age = ageOf(s), h = s.stats.건강, job = s.job || '';
  // Poverty raises every risk and wealth lowers it a little; hunger years make poverty worse.
  const w = s.stats.재산, wealthRisk = w < 15 ? 1.4 : w < 30 ? 1.15 : w >= 70 ? .85 : 1;
  const frail = (h < 25 ? 3 : h < 45 ? 1.8 : 1) * wealthRisk * crisisFactor(s);
  const risks = [];
  if (age < 5) risks.push([.006, '어린 시절 열병을 이겨 내지 못했습니다.']);
  else if (age < 15) risks.push(smallpoxImmune(s) ? [.0017, '이질에 걸려 끝내 회복하지 못했습니다.'] : [.002, '천연두에 걸려 끝내 회복하지 못했습니다.']);
  else risks.push([.003 + Math.max(0, age - 40)*.0005, '갑작스러운 병으로 세상을 떠났습니다.']);
  if (age >= 14 && /노동|농|직물|인쇄|제화|도제|장인|보조/.test(job)) risks.push([.0015, '작업 중 사고를 당해 목숨을 잃었습니다.']);
  const war = (s.year >= 1792 && s.year <= 1815) || (s.year >= 1756 && s.year <= 1763);
  if (war && /군/.test(job) && age >= 16 && age <= 50) risks.push([.035, '전장에서 돌아오지 못했습니다.']);
  if (s.year === 1832 && s.place.includes('파리')) risks.push([.012, '1832년 콜레라에 걸려 세상을 떠났습니다.']);
  if (s.year === 1849 && s.place.includes('파리')) risks.push([.006, '콜레라에 걸려 세상을 떠났습니다.']);
  for (const [p, reason] of risks) if (random(s) < p * frail) { endLife(s, reason); return; }
}

// Childbirth was dangerous for the mother: roughly one birth in a hundred.
function childbirthRisk(s) {
  if (s.sex === '여성') { if (random(s) < .012) endLife(s, '출산 뒤 회복하지 못했습니다.'); return; }
  const wife = s.relations.find(r => r.role === '배우자' && r.alive);
  if (wife && random(s) < .012) {
    wife.alive = false; wife.deathYear = s.year;
    addLog(s, '가족의 슬픔', `배우자 ${wife.name}이(가) 출산 뒤 회복하지 못하고 세상을 떠났습니다.`, 'bad');
    milestone(s, `배우자 ${wife.name}과 작별`); changeStats(s, {행복:-18});
  }
}

// Some families had already lost a child before the player was born.
function earlierLoss(s) {
  if (random(s) >= .35) return;
  const sex = pick(s, ['남성','여성']), birthYear = s.born - rand(s, 1, 4), months = rand(s, 1, 11);
  const r = {name:freshName(s, sex === '남성' ? male : female, s.name.split(' ').at(-1)), role:'형제자매', sex, birthYear, birthMonth:rand(s, 1, 12),
    alive:false, closeness:50, job:'없음'};
  r.deathYear = Math.min(s.born, birthYear + (r.birthMonth + months > 12 ? 1 : 0));
  s.relations.push(r);
  addLog(s, '가족의 기억', `당신이 태어나기 전, ${siblingWord(s, r)} ${r.name}은(는) 첫돌을 넘기지 못하고 세상을 떠났습니다.`, 'normal');
}

// Softer bad luck: bad everyday events and the original decisions cost less health.
// Runs before the era decisions are added, so only the original data is rescaled.
for (const e of [...dailyEvents, ...childhoodEvents]) {
  const h = e.effects?.stats?.건강;
  if (e.kind === 'bad' && h < 0) e.effects.stats.건강 = Math.trunc(h * 0.4) || -1;
}
for (const d of decisions) for (const c of d.choices) {
  const h = c.effects?.stats?.건강;
  if (h < -1) c.effects.stats.건강 = Math.trunc(h / 2);
}
// The yearly focus replaced these two filler decisions; the rest of the repeatable ones are rationed.
const RETIRED_DECISIONS = new Set(['childcare','livelihood']);
function decisionAllowed(s, d) {
  if (!enDecision(d)) return false;
  if (typeof realBlocks === 'function' && realBlocks(s, d)) return false;
  if (typeof lifeFixBlocks === 'function' && lifeFixBlocks(s, d)) return false;
  // Abroad, home-town decisions and the ordinary career ladder wait.
  if (typeof isAbroad === 'function' && isAbroad(s) && !d.historic && (d.domain === 'career' || d.domain === 'housing' || d.when.places || d.when.placeIncludes || d.when.notPlaces || d.when.notPlaceIncludes)) return false;
  if (RETIRED_DECISIONS.has(d.id)) return false;
  // One-off decisions gated on a shared flag (e.g. 'marriage') also close on their own id.
  if (d.when.unsetFlag && d.when.unsetFlag !== d.id && s.flags[d.id]) return false;
  if (d.when.unsetFlag) return true;
  const n = s.familyEvents['dc-' + d.id] || 0, y = s.familyEvents['dy-' + d.id];
  return n < 2 && (y === undefined || s.year - y >= 7);
}
function noteDecision(s, d) {
  s.familyEvents['t-' + d.id] = s.year;  // when it was decided, for decisions that follow up years later
  if (d.when.unsetFlag) return;
  s.familyEvents['dc-' + d.id] = (s.familyEvents['dc-' + d.id] || 0) + 1;
  s.familyEvents['dy-' + d.id] = s.year;
}

// Inoculation (variolation) and vaccination both gave lasting protection; a child who had either cannot
// die of smallpox later. Read from the decision log, so saves made before this rule are covered too.
function smallpoxImmune(s) {
  return s.log.some(x => (x.eventId === 'inoculation' && x.desc.includes('선택: 부모가 접종을 받게 한다'))
    || (x.eventId === 'vaccine' && x.desc.includes('선택: 접종을 받는다')));
}
