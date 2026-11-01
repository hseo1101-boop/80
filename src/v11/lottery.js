// src/lottery.js
// 1) The birth lottery: families are drawn with weights close to France's real social make-up around 1789
//    (about 80% peasants, 11% urban working people, 8% bourgeois, under 1% nobility), and the odds are shown.
// 2) Hunger years hit the poor hardest. 3) Some choices need money, knowledge, literacy or friends.
const FAMILY_WEIGHTS = {
  '파리|도시 평민': 4, '리옹|도시 평민': 4, '루앙|도시 평민': 3,
  '오베르뉴 농촌|농민': 26, '부르고뉴 농촌|농민': 27, '브르타뉴 농촌|농민': 27,
  '보르도|부르주아': 5, '파리|부르주아': 3, '투르|귀족': 1
};
function pickFamily(s) {
  const weighted = families.map(f => ({f, w: FAMILY_WEIGHTS[f.place + '|' + f.class] || 1}));
  let roll = random(s) * weighted.reduce((n, x) => n + x.w, 0);
  return (weighted.find(x => (roll -= x.w) < 0) || weighted.at(-1)).f;
}
// Shares are rounded estimates for France around 1789 (population ≈ 28 million).
const CLASS_SHARE = {'농민':80, '도시 평민':11, '부르주아':8, '귀족':1};
const PLACE_SHARE = {'파리':2.2, '리옹':0.5, '보르도':0.4, '루앙':0.3, '투르':0.08};
function birthOdds(s) {
  const lines = [];
  const share = CLASS_SHARE[s.class];
  if (s.class === '귀족') lines.push('이 시대 프랑스 아기 100명 중 1명도 채 되지 않는 귀족 가정에서 태어났습니다.');
  else if (share) lines.push(`이 시대 프랑스 아기 100명 중 약 ${share}명이 ${s.class === '도시 평민' ? '도시의 장인·노동자' : s.class} 가정에서 태어났습니다.`);
  const town = Object.keys(PLACE_SHARE).find(k => s.place.includes(k));
  if (town) {
    const p = PLACE_SHARE[town];
    lines.push(p >= 1 ? `${town}에서 태어나는 아기는 100명 중 ${Math.round(p)}명 남짓입니다.`
      : p >= 0.25 ? `${town}에서 태어나는 아기는 1,000명 중 ${Math.round(p*10)}명꼴입니다.` : `${town}에서 태어나는 아기는 1,000명 중 1명이 채 되지 않습니다.`);
  } else lines.push('열에 여덟은 당신처럼 시골에서 태어납니다.');
  if (s.religion === 'protestant') lines.push('개신교 가정은 100명 중 2~3명뿐입니다.');
  lines.push(s.born < 1800 ? '그리고 넷 중 한 명은 첫돌을 넘기지 못합니다.' : '그리고 다섯 중 한 명은 첫돌을 넘기지 못합니다.');
  return lines;
}
function birthLottery(s) {
  s.familyEvents.w0 = s.stats.재산;
  addLog(s, '탄생의 확률', birthOdds(s).slice(0, 2).join(' '), 'fact');
}

// ---- Hunger years ----------------------------------------------------------
const CRISIS_YEARS = {
  1770: [2, '흉작이 두 해째 이어져'], 1775: [1, '곡물 거래 자유화 뒤 값이 뛰어'], 1784: [2, '1783년 겨울의 혹한과 홍수로'],
  1789: [3, '지난여름 우박과 혹독한 겨울 끝에'], 1795: [3, '공화력 3년의 혹한과 아시냐 폭락으로'], 1812: [2, '흉작과 전쟁 징발이 겹쳐'],
  1817: [3, '‘여름 없는 해’의 흉작 끝에'], 1829: [1, '긴 겨울과 비싼 곡물값으로'], 1847: [2, '감자 역병과 밀 흉작으로']
};
function wealthTier(s) { const w = s.stats.재산; return w < 20 ? 0 : w < 35 ? 1 : w < 55 ? 2 : 3; }
function crisisFactor(s) { return CRISIS_YEARS[s.year] && wealthTier(s) <= 1 ? 1.5 : 1; }
function crisisYear(s) {
  const c = CRISIS_YEARS[s.year];
  if (!c || s.dead || ageOf(s) < 1) return;
  const [sev, cause] = c, tier = wealthTier(s);
  let loss = [sev*2 + 1, Math.round(sev*1.5), Math.floor(sev/2), 0][tier];
  const helped = loss > 0 && relationScore(s) >= 60;
  if (helped) loss -= 1;
  const text = [
    `${cause} 빵값이 하루 품삯을 넘었습니다. 겨우내 밀기울을 섞은 빵과 묽은 수프로 버텼습니다.`,
    `${cause} 빵값이 크게 올랐습니다. 끼니를 줄이고 아끼던 물건을 팔아야 했습니다.`,
    `${cause} 빵값이 올랐지만, 모아 둔 것으로 큰 어려움 없이 넘겼습니다.`,
    `${cause} 거리에 굶주린 사람이 늘었습니다. 집안 곳간은 넉넉했습니다.`][tier]
    + (helped ? ' 가까운 이웃과 친척이 먹을 것을 나눠 준 덕분에 조금 덜 힘들었습니다.' : '')
    + ` (빵 2kg 한 덩이 약 ${pricesOf(s).bread}수, 날품 하루 약 ${pricesOf(s).wage}수${pricesOf(s).assignat ? ' — 아시냐 지폐로 치르면 그 몇십 배' : ''})`;
  changeStats(s, {건강:-loss, 행복: tier === 3 ? 0 : -sev, 재산: tier <= 1 ? -sev : 0});
  if (tier === 3) { s.experience.inequality = clamp((s.experience.inequality || 0) + 1); }
  addLog(s, tier <= 1 ? '🌧️ 나쁜 일 · 흉년' : '☕ 일상 · 흉년', text, tier <= 1 ? 'bad' : 'normal');
  checkHealth(s);
}

// ---- Choices that need something -------------------------------------------
const CHOICE_REQUIREMENTS = [
  ['move', '파리로', {minWealth:15}], ['marriage', '소개받은', {minRelation:30}], ['trade', '작은 사업', {minWealth:35}],
  ['future', '새로운 기술', {minKnowledge:35}], ['conscription', '대리인', {minWealth:60}],
  ['section-club', '회의에 나가', {minKnowledge:45}], ['section-club', '신문만', {literacy:true}],
  ['seminary', '신학교에', {minKnowledge:50}], ['college', '학교에서', {minWealth:40}], ['master-craft', '걸작', {minWealth:30}],
  ['open-shop', '작업장을 연다', {minWealth:30}], ['savings-bank', '통장', {minWealth:20}], ['cholera-flight', '시골 친척', {minWealth:25}],
  ['dowry', '부모가 땅', {minWealth:40}], ['levee', '숲에 숨는다', {minRelation:50}], ['refractory-priest', '곳간에', {minRelation:40}],
  ['emigration', '국경을 넘어', {minWealth:30}], ['blockade', '밀수품', {minRelation:45}], ['tours-railway', '파리행', {minWealth:20}],
  ['memoir', '가족 기록장', {literacy:true}], ['biens-nationaux', '땅을 사들인다', {minWealth:55}]
];
for (const [id, label, req] of CHOICE_REQUIREMENTS) {
  const choice = decisions.find(d => d.id === id)?.choices.find(c => c.label.includes(label));
  if (choice) choice.requires = req;
}
function requirementGaps(s, choice) {
  const r = choice.requires, gaps = [];
  if (!r) return gaps;
  if (r.minWealth !== undefined && s.stats.재산 < r.minWealth) gaps.push(`재산 ${r.minWealth} 이상 (지금 ${Math.round(s.stats.재산)})`);
  if (r.minKnowledge !== undefined && s.stats.지식 < r.minKnowledge) gaps.push(`지식 ${r.minKnowledge} 이상 (지금 ${Math.round(s.stats.지식)})`);
  if (r.minRelation !== undefined && relationScore(s) < r.minRelation) gaps.push(`관계 ${r.minRelation} 이상 (지금 ${relationScore(s)})`);
  if (r.literacy && literacyOf(s) !== 'basic') gaps.push('글을 읽고 쓸 수 있어야 함');
  if (r.maxYear !== undefined && s.year > r.maxYear) gaps.push(`${r.maxYear}년까지만 가능`);
  return gaps;
}
function requirementLabel(choice) {
  const r = choice.requires; if (!r) return '';
  return [r.minWealth !== undefined && `재산 ${r.minWealth}+`, r.minKnowledge !== undefined && `지식 ${r.minKnowledge}+`,
    r.minRelation !== undefined && `관계 ${r.minRelation}+`, r.literacy && '글 읽기', r.maxYear !== undefined && `${r.maxYear}년까지`].filter(Boolean).join(' · ');
}
function choiceAvailable(s, choice) { return requirementGaps(s, choice).length === 0; }
