// src/focus.js
// The player's standing focus for the year ("올해의 초점"). Applied once a year, deterministic: no RNG.
const FOCUS_OPTIONS = {
  child:[{id:'play',label:'뛰어놀기'},{id:'family',label:'가족 곁에서'},{id:'explore',label:'동네 구경'}],
  school:[{id:'chores',label:'집안 돕기'},{id:'study',label:'글 배우기'},{id:'play',label:'친구와 놀기'},{id:'faith',label:'교리 공부'}],
  youth:[{id:'craft',label:'기술 익히기'},{id:'work',label:'돈 벌기'},{id:'study',label:'공부'},{id:'social',label:'친구·연애'},{id:'rest',label:'쉬기'}],
  adult:[{id:'work',label:'생업에 전념'},{id:'family',label:'가족 돌보기'},{id:'save',label:'아껴 모으기'},{id:'social',label:'이웃과 교류'},{id:'study',label:'배움·독서'},{id:'rest',label:'몸 돌보기'}],
  elder:[{id:'rest',label:'몸 돌보기'},{id:'family',label:'가족 곁에서'},{id:'faith',label:'신앙생활'},{id:'social',label:'옛 친구 만나기'}]
};
const FOCUS_EFFECTS = {
  play:{stats:{행복:2,건강:1},experience:{social:1},hint:'행복과 건강이 조금씩 오릅니다.'},
  family:{stats:{행복:1},closeness:1,experience:{responsibility:1},hint:'가족과의 친밀도가 오릅니다.'},
  explore:{stats:{행복:1},experience:{curiosity:1},hint:'호기심이 자랍니다.'},
  chores:{stats:{재산:1},closenessRoles:['아버지','어머니'],experience:{familyTrade:1,responsibility:1},hint:'가업에 익숙해지고 부모와 가까워집니다.'},
  study:{stats:{지식:2,행복:-1},experience:{educationInterest:1,selfStudy:1},hint:'지식이 오르지만 놀 시간이 줄어듭니다.'},
  faith:{stats:{행복:1},experience:{religious:1},hint:'교구 공동체와 가까워집니다.'},
  craft:{stats:{지식:1,재산:1},experience:{craft:1},hint:'손기술과 수입이 조금씩 늘어납니다.'},
  work:{stats:{재산:2,행복:-1},experience:{responsibility:1},hint:'벌이는 늘지만 여유가 줄어듭니다.'},
  social:{stats:{행복:1},friends:2,experience:{social:1},hint:'친구·이웃과 가까워집니다.'},
  rest:{stats:{건강:2,재산:-1},hint:'건강을 회복하지만 벌이가 줄어듭니다.'},
  save:{stats:{재산:1,행복:-1},experience:{commerce:1},hint:'조금씩 모으지만 생활이 빠듯합니다.'}
};
const FOCUS_IDS = new Set(Object.values(FOCUS_OPTIONS).flat().map(f => f.id));
function focusStage(s) { const a = ageOf(s); return a < 2 ? null : a < 7 ? 'child' : a < 14 ? 'school' : a < 20 ? 'youth' : a < 60 ? 'adult' : 'elder'; }
function focusOptions(s) { const st = focusStage(s); return st ? FOCUS_OPTIONS[st] : []; }
function currentFocus(s) { const opts = focusOptions(s); return opts.find(f => f.id === s.focus) || opts[0] || null; }
function applyFocus(s) {
  const f = currentFocus(s); if (!f) return;
  const e = FOCUS_EFFECTS[f.id];
  changeStats(s, e.stats);
  s.experience ??= emptyExperience();
  for (const [k,v] of Object.entries(e.experience || {})) s.experience[k] = clamp((s.experience[k] || 0) + v);
  for (const r of s.relations) {
    if (!r.alive) continue;
    if (e.closeness) r.closeness = clamp(r.closeness + e.closeness);
    if (e.closenessRoles?.includes(r.role)) r.closeness = clamp(r.closeness + 2);
    if (e.friends && r.role === '친구') r.closeness = clamp(r.closeness + e.friends);
  }
  if (f.id === 'study' && s.literacy === 'learning' && s.stats.지식 >= 20) s.literacy = 'basic';
}
// Shown as the fifth stat. Derived, never saved.
function relationScore(s) {
  const alive = s.relations.filter(r => r.alive);
  return alive.length ? Math.round(alive.reduce((n,r) => n + r.closeness, 0) / alive.length) : 0;
}

// src/facts.js
// Birthday notes about the era, in the manner of "N명 중 1명은...". These are rounded, commonly cited
// demographic approximations for France, not outputs of this game's simplified mortality model.
function eraFact(s, age) {
  const early = s.born < 1790, man = s.sex === '남성';
  if (age === 1) return early
    ? '이 시대 프랑스에서는 아기 넷 중 한 명꼴로 첫돌을 넘기지 못했습니다. 당신은 첫돌을 맞이했습니다.'
    : '19세기 초 프랑스에서도 아기 다섯 중 한 명꼴로 첫돌을 넘기지 못했습니다. 당신은 첫돌을 맞이했습니다.';
  if (age === 10) return early
    ? '같은 해에 태어난 프랑스 아이의 절반 가까이가 열 살이 되기 전에 세상을 떠났습니다. 당신은 열 번째 생일을 맞았습니다.'
    : '같은 해에 태어난 아이 셋 중 한 명꼴이 열 살이 되기 전에 세상을 떠났습니다. 당신은 열 번째 생일을 맞았습니다.';
  if (age === 16) {
    const late = s.year >= 1810, rate = man ? (late ? 54 : 47) : (late ? 34 : 27);
    const you = literacyOf(s) === 'basic' ? '당신은 글을 읽고 쓸 수 있습니다.' : literacyOf(s) === 'learning' ? '당신은 아직 글을 배우는 중입니다.' : '당신은 아직 글을 읽지 못합니다.';
    return `이 무렵 프랑스 ${man ? '남성' : '여성'} 가운데 혼인 서약서에 자기 이름을 서명할 수 있는 사람은 약 ${rate}%였습니다. ${you}`;
  }
  if (age === 26) {
    const married = s.relations.some(r => r.role === '배우자');
    return `이 시대 프랑스인의 첫 결혼은 늦은 편이어서, 평균 남성 약 28세·여성 약 26세에 혼인했습니다. ${married ? '당신은 이미 가정을 꾸렸습니다.' : '당신은 아직 혼인하지 않았습니다.'}`;
  }
  if (age === 40) return '이 시대 프랑스인의 출생 시 기대수명은 30년 안팎이었습니다. 어린 시절의 높은 사망률이 평균을 끌어내린 결과로, 어른이 된 사람은 대개 그보다 오래 살았습니다.';
  if (age === 60) return '같은 해에 태어난 사람 가운데 예순 살 생일을 맞는 사람은 넷 중 한 명 남짓이었습니다.';
  if (age === 75) return '일흔다섯 살. 같은 해에 태어난 사람 대부분은 이미 세상을 떠났습니다.';
  return null;
}
function birthdayFacts(s) {
  if (s.dead || s.month !== s.birthMonth) return;
  const age = ageOf(s), key = 'fact-' + age;
  if (s.familyEvents[key]) return;
  const text = eraFact(s, age);
  if (!text) return;
  s.familyEvents[key] = true;
  if (!enHas(text)) return;
  addLog(s, '시대의 숫자', text, 'fact');
}
