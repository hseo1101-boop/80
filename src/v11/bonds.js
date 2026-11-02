// src/data/bonds.js — 인연: choices that come back decades later
// Some ordinary choices before the Revolution tie you to a named person: someone you helped (favor),
// someone you wronged or reported (grudge), or a patron whose name later stains you (stain). Each bond
// carries the person's future (village mayor, section committee member, deputy, general, priest,
// official). When that future arrives the person changes job and you hear of it; in the Terror, at the
// Restoration and under the July Monarchy the bond can save you or ruin you.
//
// A bond lives in familyEvents as "bd_<key>" = "kind|fate|year|name|memo" (saves keep it), and the
// person joins your relations as 지인.
DECISION_DOMAINS.push({id:'bond', label:'인연', target:0});
// Each future: its title, when it arrives, whether it is local (a village mayor is only seen at home;
// from elsewhere the news comes by letter), how the news reads, the quiet payoff for each kind of bond,
// and sometimes a next future (the Convention deputy who becomes Napoleon's prefect, the émigré who
// returns in 1815, the proscrit of 1851 who comes back a deputy in 1870).
const FATES = {
  mayor:{title:'면장', rise:1790, local:true, news:b => `${b.name}이(가) 새로 생긴 마을 면장으로 뽑혔습니다.`,
    favor:['면장의 귀띔', '{n} 면장이 국유재산(옛 교회 땅) 경매 날짜를 먼저 알려 주었습니다. 밭 한 뙈기를 싸게 샀습니다.', {재산:5}],
    grudge:['면장의 앙갚음', '{n} 면장이 공유지를 나누면서 당신 몫을 가장 척박한 곳으로 정했습니다. {y}년 전 일을 잊지 않은 것입니다.', {재산:-4, 행복:-2}]},
  committee:{title:'감시위원', rise:1793, local:true, news:b => `${b.name}이(가) 감시위원회에 들어갔습니다. 이제 누가 ‘혐의자’인지 가리는 자리입니다.`},
  deputy:{title:'국민공회 의원', rise:1792, news:b => `${b.name}이(가) 국민공회 의원으로 뽑혔다는 소식이 들려왔습니다.`, next:['prefect', .6],
    special:(s, b) => { if (random(s) < .25) { b.rel.alive = false; b.rel.deathYear = Math.max(s.year, 1793); addLog(s, '단두대 소식', `국민공회 의원 ${b.name}이(가) 단두대에 올랐다는 소식이 들려왔습니다. 당신이 ${b.memo} 그 사람입니다.`, 'bad'); } }},
  prefect:{title:'도지사', rise:1800, news:b => `옛 국민공회 의원 ${b.name}이(가) 제1통령의 도지사로 임명되었습니다. 혁명가들이 이제 나폴레옹의 관리가 됩니다.`,
    favor:['도지사의 호의', '{n} 도지사가 당신 집안에 담배 판매 허가를 내주었습니다. 국가가 독점한 담배를 팔 수 있는 자리입니다.', {재산:6, 행복:2}],
    grudge:['도지사의 감시', '{n} 도지사가 당신을 ‘불온한 자’ 명단에 올려 경찰이 드나들기 시작했습니다.', {행복:-4}], next:['regicide', .5]},
  regicide:{title:'추방된 국왕 시해자', rise:1816, news:b => `왕정복고 정부가 국왕 처형에 찬성했던 옛 의원들을 추방했습니다. ${b.name}도 브뤼셀로 떠났습니다.`},
  officer:{title:'공화국 장군', rise:1796, news:b => `${b.name}이(가) 공화국 군대에서 장군이 되었다는 소식을 들었습니다.`,
    special:(s, b) => { if (b.kind !== 'favor') return;
      const son = s.relations.find(r => r.role === '자녀' && r.alive && personSex(r) === '남성' && ageOf(s, r) >= 16 && ageOf(s, r) <= 30);
      changeStats(s, son ? {행복:4} : {행복:4, 재산:5});
      addLog(s, '장군의 편지', son ? `${b.name} 장군이 편지를 보내 ${son.name}을(를) 자기 사령부의 서기로 데려가겠다고 했습니다. 최전선 대신입니다.` : `${b.name} 장군이 옛 은혜를 잊지 않았다며 넉넉한 돈을 보내왔습니다.`, 'good'); }},
  priest:{title:'신부', rise:1802, local:true, news:b => `정교 협약 뒤 ${b.name} 신부가 본당 신부로 돌아왔습니다.`,
    favor:['신부의 축복', '{n} 신부가 미사 뒤 당신을 따로 불러 축복해 주었습니다. 당신이 {m} 일을 기억하고 있었습니다.', {행복:3}]},
  patron:{title:'망명 귀족', rise:1790, news:b => `${b.name}이(가) 국경 너머로 망명했다는 소식이 들립니다. 그 이름과 얽힌 사람은 이제 의심을 받습니다.`, next:['returned', .7]},
  returned:{title:'돌아온 귀족', rise:1815, news:b => `왕정복고와 함께 ${b.name} 후작이 망명에서 돌아왔습니다. 1793년에는 위험한 이름이었지만, 이제는 힘 있는 이름입니다.`,
    stain:['후작의 기억', '{n} 후작이 옛 후원 관계를 잊지 않았습니다. 궁정에 납품하는 주문을 주선해 주었습니다.', {재산:7, 행복:3}]},
  notable:{title:'시장', rise:1808, local:true, news:b => `${b.name}이(가) 황제가 임명한 시장이 되었습니다. 징집 명단을 만드는 사람입니다.`},
  official:{title:'도지사', rise:1831, local:true, news:b => `7월 왕정이 들어서고 ${b.name}이(가) 도지사가 되었습니다.`,
    favor:['도지사의 추천장', '{n} 도지사가 당신 집안 사람을 관청 자리에 추천해 주었습니다.', {재산:5, 행복:3}],
    grudge:['도지사의 눈', '{n} 도지사가 당신의 영업 허가를 다시 심사하라고 지시했습니다.', {재산:-4}]},
  commissaire:{title:'공화국 위원', rise:1848, news:b => `2월 혁명 뒤 ${b.name}이(가) 임시 정부의 ‘공화국 위원’으로 임명되었습니다. 7월 왕정 때 쫓기던 공화파가 이제 도를 다스립니다.`,
    favor:['공화국 위원의 추천', '{n} 위원이 당신을 새 시 의회 명단에 올리고, 집안 젊은이에게 관청 일자리를 주었습니다.', {재산:4, 행복:4}],
    grudge:['공화국 위원의 숙청', '{n} 위원이 7월 왕정에 협력한 사람들을 정리하면서 당신 이름도 올렸습니다.', {재산:-4, 행복:-3}], next:['proscrit', .55]},
  proscrit:{title:'추방된 공화파', rise:1852, news:b => `12월 쿠데타 뒤 혼합 위원회가 공화파를 잡아들이고 있습니다. ${b.name}도 쫓기는 몸이 되었습니다.`},
  imperial:{title:'제정의 도지사', rise:1853, local:true, news:b => `제2제정이 서고 ${b.name}이(가) 황제의 도지사가 되었습니다. 옛 보나파르트파 음모가가 이제 도를 다스립니다.`,
    favor:['도지사의 철도 소식', '{n} 도지사가 새 철도 노선이 지날 땅을 귀띔해 주었습니다. 그 땅값이 세 배가 되었습니다.', {재산:8}],
    grudge:['제정 경찰의 감시', '{n} 도지사의 경찰이 당신의 편지를 뜯어보고, 집에 드나드는 사람을 적어 갑니다.', {행복:-4}]},
  republican:{title:'공화파 의원', rise:1871, news:b => `제3공화국 첫 선거에서 ${b.name}이(가) 의원으로 뽑혔습니다. 제정 시절의 망명과 감옥을 견딘 사람입니다.`, next:['senator', .4],
    favor:['의원의 추천장', '{n} 의원이 추천장을 써 주어, 집안 사람이 담배 가게 허가와 우체국 자리를 얻었습니다. 공화국은 친구를 잊지 않습니다.', {재산:6, 행복:4}],
    grudge:['의원의 앙갚음', '{n} 의원이 도청에 말을 넣었습니다. 당신 집안 사람이 관청 자리에서 밀려났습니다.', {재산:-5, 행복:-3}]},
  senator:{title:'상원 의원', rise:1885, news:b => `${b.name}이(가) 상원 의원이 되었습니다. 레지옹 도뇌르 훈장 명단을 들여다보는 자리입니다.`,
    favor:['상원 의원의 편지', '{n} 의원의 추천으로 당신(혹은 집안 어른)의 이름이 레지옹 도뇌르 명단에 올랐습니다.', {행복:5}]},
  communard:{title:'코뮌 위원', rise:1871, local:true, news:b => `파리 코뮌이 선포되고 ${b.name}이(가) 구역의 코뮌 위원이 되었습니다.`, next:['amnesty', .6],
    favor:['코뮌 위원의 보호', '{n} 위원이 당신 가게를 징발 명단에서 빼 주었습니다.', {행복:2}],
    grudge:['코뮌의 징발', '{n} 위원이 당신 창고를 ‘인민의 이름으로’ 징발했습니다.', {재산:-6, 행복:-3}],
    special:(s, b) => { if (random(s) < .3) { b.rel.alive = false; b.rel.deathYear = 1871; addLog(s, '피의 일주일', `5월 마지막 주, ${b.name}이(가) 베르사유군에게 붙잡혀 벽 앞에서 총살되었다는 소식을 들었습니다.`, 'bad'); } }},
  amnesty:{title:'파리 시의원', rise:1880, local:true, news:b => `1880년 대사면으로 누벨칼레도니에서 돌아온 ${b.name}이(가) 파리 시의원에 뽑혔습니다.`,
    favor:['시의원의 도움', '{n} 시의원이 당신 아이를 새 공립 학교의 교사 자리에 추천했습니다.', {재산:4, 행복:4}],
    grudge:['시의원의 눈총', '{n} 시의원이 동네 사람들 앞에서 당신이 1871년에 한 일을 꺼냈습니다.', {행복:-4}]}
};
// How often a bond's future comes true, and how often it is then acted on.
const BOND_RISE_CHANCE = .65, BOND_PAY_CHANCE = .55;
function bondTitle(s, fate) { return FATES[fate]?.title || '관리'; }
const placeShort = p => (p || '').replace(' 농촌', ' 시골');
function bondsOf(s) {
  return Object.entries(s.familyEvents || {}).filter(([k, v]) => k.startsWith('bd_') && typeof v === 'string').map(([k, v]) => {
    const [kind, fate, year, name, memo, done, place] = v.split('|');
    return {key:k.slice(3), kind, fate, year:+year, name, memo, done:done || '', place:place || '', rel:s.relations.find(r => r.name === name && r.role === '지인')};
  });
}
function bondSet(s, b) { s.familyEvents['bd_' + b.key] = [b.kind, b.fate, b.year, b.name, b.memo, b.done, b.place].join('|').slice(0, 300); }
const bondHere = (s, b) => !FATES[b.fate]?.local || !b.place || b.place === s.place;
// The oldest living bond that fits {kind:[…], fate:[…], minYears, here}.
function bondPick(s, spec = {}) {
  return bondsOf(s).filter(b => b.rel?.alive && (!spec.kind || spec.kind.includes(b.kind)) && (!spec.fate || spec.fate.includes(b.fate))
    && s.year - b.year >= (spec.minYears || 0) && (!spec.here || bondHere(s, b)) && (!spec.risen || b.done.includes('r'))).sort((a, b) => a.year - b.year)[0] || null;
}
function bondFill(s, d, text) {
  if (!d?.when?.bond || typeof text !== 'string' || !text.includes('{')) return text;
  const b = bondPick(s, d.when.bond);
  return text.replaceAll('{옛사람}', b?.name || '옛 지인').replaceAll('{몇년}', b ? String(s.year - b.year) : '여러')
    .replaceAll('{직함}', b ? bondTitle(s, b.fate) : '관리').replaceAll('{그일}', b?.memo || '그 일');
}
function makeBond(s, spec) {
  const key = spec.key + (bondsOf(s).some(b => b.key === spec.key) ? s.year : '');
  let fate = spec.fate === 'auto' ? (s.place.includes('농촌') ? 'mayor' : random(s) < .4 ? 'deputy' : 'committee') : spec.fate;
  if (fate === 'auto2') fate = s.place === '파리' ? 'communard' : 'republican';
  // One village has one mayor; a second rural bond sits on the village committee instead.
  if (fate === 'mayor' && bondsOf(s).some(b => b.fate === 'mayor')) fate = 'committee';
  const sex = spec.sex || (['priest', 'officer', 'deputy', 'mayor', 'notable', 'republican', 'commissaire', 'imperial', 'proscrit'].includes(fate) ? '남성' : pick(s, ['남성', '여성']));
  const name = freshName(s, sex === '남성' ? male : female, spec.surname || pick(s, surnames));
  s.relations.push({name, role:'지인', sex, birthYear:s.year - Math.max(16, ageOf(s) + rand(s, -8, 6)), birthMonth:s.month,
    alive:true, closeness:spec.kind === 'favor' ? rand(s, 60, 80) : spec.kind === 'grudge' ? rand(s, 5, 20) : 50, job:spec.job || '없음'});
  bondSet(s, {key, kind:spec.kind, fate, year:s.year, name, memo:spec.memo || '', done:'', place:s.place});
}
// A decision can move an existing bond to a new kind or future (a proscrit hidden in 1851 becomes a friend in 1871).
function shiftBond(s, spec) {
  const b = bondPick(s, spec.from); if (!b) return;
  if (spec.kind) b.kind = spec.kind;
  if (spec.fate) { b.fate = spec.fate; b.done = b.done.replace(/r/g, ''); }
  if (spec.memo) b.memo = spec.memo;
  bondSet(s, b);
}
function applyBondEffects(s, e) {
  if (e.bond) makeBond(s, e.bond);
  if (e.bondShift) shiftBond(s, e.bondShift);
  if (e.moveTo && s.place !== e.moveTo) { s.place = e.moveTo; milestone(s, `${e.moveTo}(으)로 이주`); }
}

// Yearly: futures arrive. At home you see it and feel it; from elsewhere a letter brings only the news.
function bondYear(s) {
  for (const b of bondsOf(s)) {
    const F = FATES[b.fate];
    if (!F || !b.rel?.alive || b.done.includes('r') || b.done.includes('x') || s.year < F.rise || ageOf(s, b.rel) < 25) continue;
    // Not everyone rises: some stay ordinary people, and the bond stays a memory.
    if (random(s) >= BOND_RISE_CHANCE) { b.done += 'x'; bondSet(s, b); continue; }
    b.rel.job = F.title; b.done += 'r';
    const back = `${s.year - b.year}년 전 당신이 ${b.memo} 그 사람입니다.`;
    if (!bondHere(s, b)) addLog(s, '고향에서 온 편지', `고향 ${placeShort(b.place)}에서 편지가 왔습니다. ${F.news(b)} ${back}`, 'normal');
    else {
      addLog(s, '돌아온 이름', `${F.news(b)} ${back}`, b.kind === 'favor' ? 'good' : b.kind === 'grudge' ? 'bad' : 'normal');
      const pay = F[b.kind];
      // A favour may be repaid, a grudge may be acted on; neither is certain.
      if (pay && random(s) < BOND_PAY_CHANCE) { changeStats(s, pay[2]); addLog(s, pay[0], pay[1].replaceAll('{n}', b.name).replaceAll('{y}', String(s.year - b.year)).replaceAll('{m}', b.memo), Object.values(pay[2]).some(v => v < 0) ? 'bad' : 'good'); }
      else if (pay) addLog(s, '조용한 이름', b.kind === 'favor' ? `${b.name}에게서는 아무 연락도 없었습니다. 옛일을 잊었는지, 자리가 자리인지라 몸을 사리는지 알 수 없습니다.` : `${b.name}은(는) 옛일을 들추지 않았습니다. 잊은 것인지, 기다리는 것인지는 모르겠습니다.`, 'normal');
      if (random(s) < BOND_PAY_CHANCE) F.special?.(s, b);
    }
    if (F.next && b.rel.alive && random(s) < F.next[1]) { b.fate = F.next[0]; b.done = b.done.replace(/r/g, ''); }
    bondSet(s, b);
  }
  // An old friend in old age.
  const old = bondPick(s, {kind:['favor'], minYears:30});
  if (old && ageOf(s) >= 55 && !old.done.includes('o') && random(s) < .07) {
    old.done += 'o'; bondSet(s, old); changeStats(s, {행복:4});
    addLog(s, '오래된 인연', `늙은 ${old.name}이(가) 찾아와 ${s.year - old.year}년 전 당신이 ${old.memo} 날 이야기를 꺼냈습니다. “그때 당신이 아니었으면 나는 없었소.”`, 'good');
  }
}
// Who the Terror looks at: nobles and the well-off, the stained, the refractory, the Girondin.
function terrorRisk(s) {
  return ['귀족', '부르주아'].includes(s.class) || !!bondPick(s, {kind:['stain']}) || ['refractory', 'gironde', 'royalist'].includes(s.paths?.politics) || s.stats.재산 >= 60;
}

(() => {
  const D = (id, priority, when, title, text, choices, chance) => decisions.push({id, domain:'bond', priority, title, text, ...(chance ? {chance} : {}),
    when:{...when, maxBonds:3, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id]}}))});
  const B = (key, kind, fate, memo, job) => ({key, kind, fate, memo, job});
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});

  // ───── 씨앗: 혁명 전의 작은 선택들 ─────
  D('bond-loan', 32, {minAge:18, maxAge:55, fromYear:1760, toYear:1787}, '집세를 빌려 달라는 친구',
    '어릴 적부터 알던 친구가 서기 자리를 잃고 찾아왔습니다. 이번 분기 집세를 못 내면 식구가 길에 나앉는다며, 석 달 치를 빌려 달라고 합니다. 갚을 날은 기약이 없습니다.',
    [{label:'빌려준다', preview:'돈은 줄지만 사람이 남는다', result:'돈주머니를 건넸습니다. 친구는 말없이 손을 오래 잡았습니다.', effects:{stats:{재산:-6, 행복:2}, bond:B('loan', 'favor', 'auto', '집세를 빌려준', '서기')}},
     {label:'거절한다', result:'형편이 안 된다고 했습니다. 친구는 고개를 끄덕이고 돌아갔지만, 문을 나서는 얼굴이 굳어 있었습니다.', effects:{stats:{}, bond:B('loan', 'grudge', 'auto', '빌려 달라는 부탁을 거절한', '서기')}}], .2);
  D('bond-pamphlet', 32, {minAge:18, maxAge:60, fromYear:1770, toYear:1788, notPlaceIncludes:'농촌'}, '숨겨 달라는 금서',
    '이웃의 젊은 서기가 밤늦게 문을 두드렸습니다. 왕비를 조롱하는 금서 꾸러미입니다. 경찰이 인쇄소를 뒤지고 있으니 며칠만 맡아 달라고 합니다. 신고하면 포상금이 나옵니다.',
    [{label:'다락에 숨겨 준다', preview:'들키면 바스티유', outcomes:[
       O('safe', '무사히 넘겼습니다', 85, '사흘 뒤 그가 꾸러미를 가져갔습니다. “이 은혜는 잊지 않겠소.”', {stats:{행복:2}, bond:B('pamphlet', 'favor', 'deputy', '금서를 숨겨 준', '팸플릿 작가')}),
       O('caught', '경찰이 찾아왔습니다', 15, '다락을 뒤진 경찰에게 벌금을 물었습니다. 그는 끝까지 당신 이름을 대지 않았습니다.', {stats:{재산:-8, 행복:-3}, bond:B('pamphlet', 'favor', 'deputy', '금서를 숨겨 준', '팸플릿 작가')})]},
     {label:'경찰에 알린다', result:'포상금을 받았습니다. 그는 몇 달 동안 감옥에 있었다고 합니다.', effects:{stats:{재산:3, 행복:-2}, bond:B('pamphlet', 'grudge', 'deputy', '경찰에 넘긴', '팸플릿 작가')}},
     {label:'모른 척 문을 닫는다', result:'아무것도 못 본 것으로 했습니다.', effects:{stats:{}}}], .18);
  D('bond-apprentice', 32, {minAge:25, maxAge:60, fromYear:1765, toYear:1788, classes:['도시 평민', '부르주아']}, '돈을 훔친 도제',
    '작업장 돈궤에서 돈이 빈 것을 알았습니다. 열여섯 살 도제가 울면서 털어놓았습니다. 병든 어머니 약값이었다고 합니다.',
    [{label:'용서하고 일을 계속 시킨다', result:'아이는 그 뒤로 누구보다 일찍 나와 늦게까지 일했습니다.', effects:{stats:{재산:-2, 행복:2}, bond:B('apprentice', 'favor', 'committee', '돈을 훔친 도제 시절 용서해 준', '직인')}},
     {label:'내쫓는다', result:'짐을 싸서 내보냈습니다. 노동자 수첩에 ‘도둑’이라고 적었습니다.', effects:{stats:{}, bond:B('apprentice', 'grudge', 'committee', '도제 시절 도둑으로 적어 내쫓은', '날품팔이')}}], .2);
  D('bond-grain', 32, {minAge:20, maxAge:65, years:[1768, 1770, 1771, 1775, 1784, 1785, 1788, 1789], minWealth:35}, '곳간의 곡식',
    '흉년입니다. 당신 곳간에는 곡식이 넉넉합니다. 밀가루 값은 날마다 오르고, 굶주린 이웃이 외상을 부탁합니다. 기다리면 값이 더 오를 것입니다.',
    [{label:'이웃에게 외상으로 나눈다', result:'반은 끝내 돌려받지 못했습니다. 그해 겨울 골목에 굶어 죽은 집은 없었습니다.', effects:{stats:{재산:-5, 행복:3}, experience:{social:2}, bond:B('grain', 'favor', 'auto', '흉년에 곡식을 외상으로 나눠 준', '날품팔이')}},
     {label:'값이 오를 때까지 기다렸다 판다', result:'곡식을 비싸게 팔았습니다. 이웃들은 당신을 ‘매점꾼’이라고 수군댔습니다.', effects:{stats:{재산:8, 행복:-1}, bond:B('grain', 'grudge', 'committee', '흉년에 곡식을 비싸게 판', '날품팔이')}}], .24);
  D('bond-poacher', 32, {minAge:16, maxAge:65, toYear:1788, placeIncludes:'농촌'}, '밀렵하는 이웃',
    '새벽에 영주의 숲에서 토끼를 메고 나오는 이웃을 보았습니다. 영주의 사냥터지기가 밀렵꾼을 찾고 있고, 알려 주면 사례하겠다고 합니다. 걸리면 갤리선 노역입니다.',
    [{label:'못 본 걸로 한다', result:'입을 다물었습니다. 며칠 뒤 이웃이 토끼 다리 하나를 문간에 놓고 갔습니다.', effects:{stats:{행복:1}, bond:B('poacher', 'favor', 'mayor', '밀렵을 눈감아 준', '농부')}},
     {label:'사냥터지기에게 알린다', result:'사례금을 받았습니다. 이웃은 벌금을 내느라 소를 팔았습니다.', effects:{stats:{재산:3, 행복:-2}, bond:B('poacher', 'grudge', 'mayor', '밀렵을 영주에게 고발한', '농부')}}], .2);
  D('bond-patron', 32, {minAge:18, maxAge:55, fromYear:1765, toYear:1788, classes:['도시 평민', '부르주아']}, '귀족 후원자',
    '어느 후작이 당신 솜씨(혹은 장사 수완)를 마음에 들어 합니다. 정기적으로 주문을 주고, 집안 일에 뒤를 봐주겠다고 합니다. 저택 출입도 허락했습니다.',
    [{label:'후원을 받는다', result:'주문이 끊이지 않았습니다. 후작의 문장이 찍힌 편지가 서랍에 쌓였습니다.', effects:{stats:{재산:8, 행복:2}, bond:B('patron', 'stain', 'patron', '후원을 받으며 편지를 주고받던', '후작')}},
     {label:'정중히 사양한다', result:'남의 문장 아래 서고 싶지 않았습니다.', effects:{stats:{}}}], .18);
  D('bond-deserter', 32, {minAge:18, maxAge:65, fromYear:1757, toYear:1783, excludeYears:[1764, 1777]}, '헛간의 탈영병',
    '헛간에서 군복을 벗어 던진 젊은 병사를 발견했습니다. 맞아 죽을 것 같아 도망쳤다고 합니다. 탈영병을 숨기면 벌을 받습니다.',
    [{label:'숨겨 주고 먹을 것을 준다', result:'사흘 뒤 그는 당신이 준 헌 옷을 입고 떠났습니다. 이름을 묻자 웃기만 했습니다.', effects:{stats:{재산:-1, 행복:2}, bond:B('deserter', 'favor', 'officer', '탈영병 시절 헛간에 숨겨 준', '병사')}},
     {label:'헌병에게 알린다', result:'헌병들이 그를 끌고 갔습니다.', effects:{stats:{행복:-2}, bond:B('deserter', 'grudge', 'officer', '탈영병 시절 헌병에게 넘긴', '병사')}}], .14);
  D('bond-vicar', 32, {minAge:16, maxAge:65, toYear:1789, religions:['catholic']}, '가난한 보좌신부',
    '본당의 젊은 보좌신부는 주임 신부가 십일조를 다 가져가는 바람에 끼니도 거른다고 합니다. 겨울 땔감이 없다는 이야기를 들었습니다.',
    [{label:'땔감과 빵을 가져다준다', result:'신부는 부끄러워하며 받았습니다. “하느님이 갚으실 겁니다.”', effects:{stats:{재산:-2, 행복:2}, experience:{religious:1}, bond:B('vicar', 'favor', 'priest', '땔감과 빵을 가져다준', '보좌신부')}},
     {label:'남의 일이라 생각한다', result:'겨울이 지나갔습니다.', effects:{stats:{}}}], .18);
  D('bond-maid', 32, {minAge:22, maxAge:70, fromYear:1760, toYear:1788, classes:['부르주아', '귀족']}, '은잔을 깨뜨린 하녀',
    '하녀가 손님용 은잔을 떨어뜨려 찌그러뜨렸습니다. 품삯 몇 년 치 값입니다. 집안 어른들은 당장 내쫓고 경찰에 넘기라고 합니다.',
    [{label:'품삯에서 조금씩 갚게 하고 용서한다', result:'하녀는 몇 년을 더 일했습니다. 떠나는 날 당신 아이들을 안고 울었습니다.', effects:{stats:{재산:-3, 행복:1}, bond:B('maid', 'favor', 'committee', '은잔을 깨뜨렸을 때 용서해 준', '하녀')}},
     {label:'내쫓는다', result:'추천장도 없이 내보냈습니다. 그녀는 다른 집에 들어가지 못했다고 합니다.', effects:{stats:{}, bond:B('maid', 'grudge', 'committee', '추천장도 없이 내쫓은', '하녀')}}], .2);
  D('bond-witness', 32, {minAge:20, maxAge:65, fromYear:1760, toYear:1788}, '법정의 증언',
    '집주인(혹은 영주의 관리)과 가난한 소작인 사이의 송사에 증인으로 불려 갔습니다. 당신은 소작인 편이 옳다는 걸 압니다. 하지만 집주인은 당신에게도 힘을 쓸 수 있습니다.',
    [{label:'본 대로 말한다', result:'소작인이 이겼습니다. 집주인은 그 뒤로 당신을 차갑게 대했습니다.', effects:{stats:{재산:-3, 행복:2}, bond:B('witness', 'favor', 'auto', '법정에서 편들어 준', '소작인')}},
     {label:'집주인 편에 선다', result:'소작인은 땅을 잃었습니다. 법정을 나서며 그가 당신을 오래 쳐다보았습니다.', effects:{stats:{재산:2, 행복:-2}, bond:B('witness', 'grudge', 'auto', '법정에서 등을 돌린', '소작인')}}], .18);
  // 혁명 뒤의 씨앗: 1830년에 돌아온다.
  D('bond-halfpay', 32, {minAge:20, maxAge:70, fromYear:1815, toYear:1825}, '반급 장교의 부탁',
    '황제의 옛 장교가 반급으로 쫓겨나 경찰의 감시를 받고 있습니다. 보나파르트파 모임에 쓸 방을 빌려 달라고 합니다.',
    [{label:'방을 내준다', result:'몇 달 동안 밤마다 낮은 목소리가 들렸습니다. 경찰은 끝내 오지 않았습니다.', effects:{stats:{행복:1}, bond:B('halfpay', 'favor', 'official', '반급 시절 방을 내준', '반급 장교')}},
     {label:'경찰에 알린다', result:'그는 체포되었고, 당신은 경찰서장에게서 감사 편지를 받았습니다.', effects:{stats:{재산:2}, bond:B('halfpay', 'grudge', 'official', '반급 시절 경찰에 넘긴', '반급 장교')}}], .18);

  // ───── 돌아오는 날: 공포 정치 ─────
  const T = (id, date, until, when, title, text, choices, chance) => decisions.push({id, domain:'history', priority:30, historic:true, title, text, chance,
    when:{...when, fromDate:date, toDate:until, unsetFlag:'terror-bond'}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:['terror-bond', id]}}))});
  const GUILLOTINE = '혁명 재판소에서 사형 판결을 받고 단두대에 올랐습니다.';
  T('terror-grudge', [1793,9], [1794,7], {minAge:16, bond:{kind:['grudge'], fate:['committee', 'deputy', 'mayor'], here:true, risen:true}}, '고발장에 적힌 이름',
    '혐의자 법이 공포되었습니다. 구역 감시위원회에서 출두하라는 쪽지가 왔습니다. 고발한 사람은 {옛사람}. 이제 {직함}입니다. {몇년}년 전 당신이 {그일} 일을, 그는 잊지 않았습니다.',
    [{label:'출두해 해명한다', preview:'풀려남 / 투옥 / 단두대', outcomes:[
       O('freed', '풀려났습니다', 55, '이웃들이 증언해 주었습니다. 위원회는 당신을 돌려보냈지만 {옛사람}은(는) 끝까지 당신을 노려보았습니다.', {stats:{행복:-4}}),
       O('jailed', '감옥에 갇혔습니다', 35, '넉 달을 감옥에서 보냈습니다. 테르미도르가 지나고 나서야 풀려났습니다.', {stats:{건강:-10, 재산:-6, 행복:-8}, milestone:'공포 정치 때 투옥'}),
       O('died', '돌아오지 못했습니다', 10, '혁명 재판소는 반나절 만에 판결을 내렸습니다.', {doom:`1794년, ${GUILLOTINE}`})]},
     {label:'밤에 도망쳐 숨는다', preview:'숨어 지냄 / 붙잡힘', outcomes:[
       O('hid', '숨어서 버텼습니다', 75, '먼 친척 집 다락에서 몇 달을 숨어 지냈습니다. 그동안 집과 가게는 봉인되었습니다.', {stats:{재산:-10, 행복:-6}, milestone:'공포 정치 때 피신'}),
       O('caught', '붙잡혔습니다', 25, '성문에서 붙잡혀 감옥으로 끌려갔습니다.', {stats:{건강:-10, 재산:-8, 행복:-8}, milestone:'공포 정치 때 투옥'})]},
     {label:'다른 옛 인연에게 도움을 청한다', requires:{bondFavor:true}, preview:'구명 / 소용없음', outcomes:[
       O('saved', '도움을 받았습니다', 55, '당신이 예전에 도와준 사람이 위원회에 나와 당신 편을 들었습니다. 고발은 거둬졌습니다.', {stats:{행복:3}, milestone:'옛 인연 덕에 공포 정치를 넘김'}),
       O('vain', '소용없었습니다', 45, '그도 자기 몸을 사리느라 나서지 못했습니다. 넉 달을 감옥에서 보냈습니다.', {stats:{건강:-8, 재산:-6, 행복:-8}})]}], .14);
  T('terror-favor', [1793,9], [1794,7], {minAge:16, terrorRisk:true, bond:{kind:['favor'], fate:['committee', 'deputy', 'mayor'], here:true, risen:true}}, '명단에서 지워진 이름',
    '혐의자 명단이 돌고 있습니다. 당신 이름도 올라 있다는 소문입니다. 그날 밤 {옛사람}이(가) 조용히 찾아왔습니다. 이제 {직함}입니다. “{몇년}년 전 당신이 {그일} 일을 나는 잊지 않았소.”',
    [{label:'그의 도움을 받는다', preview:'명단에서 지워짐 / 그도 어쩔 수 없음', outcomes:[
       O('saved', '명단에서 이름이 사라졌습니다', 65, '이튿날 명단에서 당신 이름이 사라졌습니다. 공포 정치가 끝날 때까지 아무도 당신을 부르지 않았습니다.', {stats:{행복:6}, milestone:'옛 인연 덕에 공포 정치를 넘김'}),
       O('failed', '그도 막지 못했습니다', 35, '그는 애썼지만 위원회의 다른 사람들이 고집을 꺾지 않았습니다. 석 달을 감옥에서 보냈습니다. 그래도 그가 아니었다면 더 나빴을 것입니다.', {stats:{건강:-8, 재산:-4, 행복:-5}, milestone:'공포 정치 때 투옥'})]},
     {label:'그를 위험에 빠뜨릴 수 없어 사양한다', preview:'무사함 / 투옥', outcomes:[
       O('ok', '무사히 넘겼습니다', 60, '운이 좋았습니다. 위원회는 당신을 부르지 않았습니다.', {stats:{행복:2}}),
       O('jailed', '감옥에 갇혔습니다', 40, '석 달을 감옥에서 보냈습니다. 풀려나던 날 {옛사람}이(가) 성문 앞에 서 있었습니다.', {stats:{건강:-8, 재산:-5, 행복:-6}, milestone:'공포 정치 때 투옥'})]}], .14);
  T('terror-stain', [1793,9], [1794,7], {minAge:16, bond:{kind:['stain']}}, '서랍 속의 문장',
    '망명한 {옛사람} 후작과 주고받은 편지가 문제 되었습니다. 감시위원회가 집을 수색하러 온다는 소식입니다. 서랍에는 아직 그의 문장이 찍힌 편지가 있습니다.',
    [{label:'편지를 모두 태운다', preview:'증거 없음 / 이미 늦음', outcomes:[
       O('burned', '증거가 사라졌습니다', 70, '아궁이 앞에서 밤새 편지를 태웠습니다. 이튿날 위원들은 빈손으로 돌아갔습니다.', {stats:{행복:-2}}),
       O('late', '이미 늦었습니다', 30, '위원들이 들이닥쳤을 때 재가 아직 따뜻했습니다. 넉 달을 감옥에서 보냈습니다.', {stats:{건강:-10, 재산:-8, 행복:-8}, milestone:'공포 정치 때 투옥'})]},
     {label:'애국 헌금을 크게 내고 시민 증명서를 받는다', requires:{minWealth:40}, result:'재산의 상당 부분을 ‘조국의 제단’에 바쳤습니다. 시민 증명서를 받았습니다.', effects:{stats:{재산:-14, 행복:-2}}},
     {label:'당당히 해명한다', preview:'석방 / 투옥 / 단두대', outcomes:[
       O('freed', '풀려났습니다', 50, '장사 편지일 뿐이라는 해명이 받아들여졌습니다.', {}),
       O('jailed', '감옥에 갇혔습니다', 38, '테르미도르까지 감옥에 있었습니다.', {stats:{건강:-10, 재산:-8, 행복:-8}, milestone:'공포 정치 때 투옥'}),
       O('died', '돌아오지 못했습니다', 12, '혁명 재판소는 망명자와의 내통을 용서하지 않았습니다.', {doom:`1794년, 망명 귀족과의 내통 혐의로 ${GUILLOTINE}`})]}], .14);
})();
