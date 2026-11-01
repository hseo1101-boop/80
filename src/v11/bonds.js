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
const BOND_TITLES = {mayor:'면장', committee:'구역 감시위원', deputy:'국민공회 의원', officer:'공화국 장군', priest:'신부', patron:'망명 귀족', official:'도지사'};
const BOND_RISE = {mayor:[1790, 1], committee:[1793, 4], deputy:[1792, 9], officer:[1796, 3], priest:[1802, 4], patron:[1790, 6], official:[1831, 2]};

function bondTitle(s, fate) { return fate === 'committee' && s.place.includes('농촌') ? '마을 감시위원' : BOND_TITLES[fate] || '관리'; }
function bondsOf(s) {
  return Object.entries(s.familyEvents || {}).filter(([k, v]) => k.startsWith('bd_') && typeof v === 'string').map(([k, v]) => {
    const [kind, fate, year, name, memo, done] = v.split('|');
    return {key:k.slice(3), kind, fate, year:+year, name, memo, done:done || '', rel:s.relations.find(r => r.name === name && r.role === '지인')};
  });
}
function bondSet(s, b) { s.familyEvents['bd_' + b.key] = [b.kind, b.fate, b.year, b.name, b.memo, b.done].join('|').slice(0, 300); }
// The oldest living bond that fits {kind:[…], fate:[…], minYears}.
function bondPick(s, spec = {}) {
  return bondsOf(s).filter(b => b.rel?.alive && (!spec.kind || spec.kind.includes(b.kind)) && (!spec.fate || spec.fate.includes(b.fate))
    && s.year - b.year >= (spec.minYears || 0)).sort((a, b) => a.year - b.year)[0] || null;
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
  // One village has one mayor; a second rural bond sits on the village committee instead.
  if (fate === 'mayor' && bondsOf(s).some(b => b.fate === 'mayor')) fate = 'committee';
  const sex = spec.sex || (fate === 'priest' || fate === 'officer' || fate === 'deputy' || fate === 'mayor' ? '남성' : pick(s, ['남성', '여성']));
  const name = freshName(s, sex === '남성' ? male : female, spec.surname || pick(s, surnames));
  s.relations.push({name, role:'지인', sex, birthYear:s.year - Math.max(16, ageOf(s) + rand(s, -8, 6)), birthMonth:s.month,
    alive:true, closeness:spec.kind === 'favor' ? rand(s, 60, 80) : spec.kind === 'grudge' ? rand(s, 5, 20) : 50, job:spec.job || '없음'});
  bondSet(s, {key, kind:spec.kind, fate, year:s.year, name, memo:spec.memo || '', done:''});
}
function applyBondEffects(s, e) { if (e.bond) makeBond(s, e.bond); }

// Yearly: futures arrive, and the quieter payoffs land.
function bondYear(s) {
  for (const b of bondsOf(s)) {
    if (!b.rel?.alive || b.done.includes('r')) continue;
    const [y, m] = BOND_RISE[b.fate] || [9999, 1];
    if (s.year < y || ageOf(s, b.rel) < 25) continue;
    b.rel.job = bondTitle(s, b.fate);
    b.done += 'r'; bondSet(s, b);
    const back = `${s.year - b.year}년 전 당신이 ${b.memo} 그 사람입니다.`;
    const rise = {mayor:`${b.name}이(가) 새로 생긴 마을 면장으로 뽑혔습니다.`, committee:`${b.name}이(가) ${s.place.includes('농촌') ? '마을' : '구역'} 감시위원회에 들어갔습니다. 이제 누가 ‘혐의자’인지 가리는 자리입니다.`,
      deputy:`${b.name}이(가) 국민공회 의원으로 뽑혔다는 소식이 들려왔습니다.`, officer:`${b.name}이(가) 공화국 군대에서 장군이 되었다는 소식을 들었습니다.`,
      priest:`정교 협약 뒤 ${b.name} 신부가 본당 신부로 돌아왔습니다.`, patron:`${b.name}이(가) 국경 너머로 망명했다는 소식이 들립니다. 그 이름과 얽힌 사람은 이제 의심을 받습니다.`,
      official:`7월 왕정이 들어서고 ${b.name}이(가) 도지사가 되었습니다.`}[b.fate];
    addLog(s, '돌아온 이름', `${rise} ${back}`, b.kind === 'favor' ? 'good' : b.kind === 'grudge' || b.kind === 'stain' ? 'bad' : 'normal');
    // Quiet payoffs that need no decision.
    if (b.fate === 'mayor') {
      if (b.kind === 'favor') { changeStats(s, {재산:5}); addLog(s, '면장의 귀띔', `${b.name} 면장이 국유재산(옛 교회 땅) 경매 날짜를 먼저 알려 주었습니다. 밭 한 뙈기를 싸게 샀습니다.`, 'good'); }
      if (b.kind === 'grudge') { changeStats(s, {재산:-4, 행복:-2}); addLog(s, '면장의 앙갚음', `${b.name} 면장이 공유지를 나누면서 당신 몫을 가장 척박한 곳으로 정했습니다. ${s.year - b.year}년 전 일을 잊지 않은 것입니다.`, 'bad'); }
    }
    if (b.fate === 'officer' && b.kind === 'favor') {
      const son = s.relations.find(r => r.role === '자녀' && r.alive && personSex(r) === '남성' && ageOf(s, r) >= 16 && ageOf(s, r) <= 30);
      changeStats(s, {행복:4});
      addLog(s, '장군의 편지', son ? `${b.name} 장군이 편지를 보내 ${son.name}을(를) 자기 사령부의 서기로 데려가겠다고 했습니다. 최전선 대신입니다.` : `${b.name} 장군이 옛 은혜를 잊지 않았다며 넉넉한 돈을 보내왔습니다.`, 'good');
      if (!son) changeStats(s, {재산:5});
    }
    if (b.fate === 'priest' && b.kind === 'favor') { changeStats(s, {행복:3}); addLog(s, '신부의 축복', `${b.name} 신부가 미사 뒤 당신을 따로 불러 축복해 주었습니다. 숨어 지내던 시절 당신이 ${b.memo} 일을 기억하고 있었습니다.`, 'good'); }
    if (b.fate === 'official') {
      if (b.kind === 'favor') { changeStats(s, {재산:5, 행복:3}); addLog(s, '도지사의 추천장', `${b.name} 도지사가 당신 집안 사람을 관청 자리에 추천해 주었습니다.`, 'good'); }
      if (b.kind === 'grudge') { changeStats(s, {재산:-4}); addLog(s, '도지사의 눈', `${b.name} 도지사가 당신의 영업 허가를 다시 심사하라고 지시했습니다.`, 'bad'); }
    }
    // Deputies of the Convention often did not survive it.
    if (b.fate === 'deputy' && random(s) < .25) { b.rel.alive = false; b.rel.deathYear = Math.max(s.year, 1793); addLog(s, '단두대 소식', `국민공회 의원 ${b.name}이(가) 단두대에 올랐다는 소식이 들려왔습니다. 당신이 ${b.memo} 그 사람입니다.`, 'bad'); }
  }
  // An old friend in old age.
  const old = bondPick(s, {kind:['favor'], minYears:30});
  if (old && ageOf(s) >= 55 && !old.done.includes('o') && random(s) < .3) {
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
  T('terror-grudge', [1793,9], [1794,7], {minAge:16, bond:{kind:['grudge'], fate:['committee', 'deputy', 'mayor']}}, '고발장에 적힌 이름',
    '혐의자 법이 공포되었습니다. 구역 감시위원회에서 출두하라는 쪽지가 왔습니다. 고발한 사람은 {옛사람}. 이제 {직함}입니다. {몇년}년 전 당신이 {그일} 일을, 그는 잊지 않았습니다.',
    [{label:'출두해 해명한다', preview:'풀려남 / 투옥 / 단두대', outcomes:[
       O('freed', '풀려났습니다', 55, '이웃들이 증언해 주었습니다. 위원회는 당신을 돌려보냈지만 {옛사람}은(는) 끝까지 당신을 노려보았습니다.', {stats:{행복:-4}}),
       O('jailed', '감옥에 갇혔습니다', 35, '넉 달을 감옥에서 보냈습니다. 테르미도르가 지나고 나서야 풀려났습니다.', {stats:{건강:-10, 재산:-6, 행복:-8}, milestone:'공포 정치 때 투옥'}),
       O('died', '돌아오지 못했습니다', 10, '혁명 재판소는 반나절 만에 판결을 내렸습니다.', {doom:`1794년, ${GUILLOTINE}`})]},
     {label:'밤에 도망쳐 숨는다', preview:'숨어 지냄 / 붙잡힘', outcomes:[
       O('hid', '숨어서 버텼습니다', 75, '먼 친척 집 다락에서 몇 달을 숨어 지냈습니다. 그동안 집과 가게는 봉인되었습니다.', {stats:{재산:-10, 행복:-6}, milestone:'공포 정치 때 피신'}),
       O('caught', '붙잡혔습니다', 25, '성문에서 붙잡혀 감옥으로 끌려갔습니다.', {stats:{건강:-10, 재산:-8, 행복:-8}, milestone:'공포 정치 때 투옥'})]},
     {label:'다른 옛 인연에게 도움을 청한다', requires:{bondFavor:true}, preview:'구명 / 소용없음', outcomes:[
       O('saved', '도움을 받았습니다', 80, '당신이 예전에 도와준 사람이 위원회에 나와 당신 편을 들었습니다. 고발은 거둬졌습니다.', {stats:{행복:3}, milestone:'옛 인연 덕에 공포 정치를 넘김'}),
       O('vain', '소용없었습니다', 20, '그도 자기 몸을 사리느라 나서지 못했습니다. 넉 달을 감옥에서 보냈습니다.', {stats:{건강:-8, 재산:-6, 행복:-8}})]}], .14);
  T('terror-favor', [1793,9], [1794,7], {minAge:16, terrorRisk:true, bond:{kind:['favor'], fate:['committee', 'deputy', 'mayor']}}, '명단에서 지워진 이름',
    '혐의자 명단이 돌고 있습니다. 당신 이름도 올라 있다는 소문입니다. 그날 밤 {옛사람}이(가) 조용히 찾아왔습니다. 이제 {직함}입니다. “{몇년}년 전 당신이 {그일} 일을 나는 잊지 않았소.”',
    [{label:'그의 도움을 받는다', result:'이튿날 명단에서 당신 이름이 사라졌습니다. 공포 정치가 끝날 때까지 아무도 당신을 부르지 않았습니다.', effects:{stats:{행복:6}, milestone:'옛 인연 덕에 공포 정치를 넘김'}},
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
