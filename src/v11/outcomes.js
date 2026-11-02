// src/outcomes.js
// Every major decision now resolves by chance, like the school decision: a choice is an intention, and
// what happens depends on luck and on the player's situation. The original decisions get hand-written
// outcomes; every other choice without outcomes gets three variants (as hoped / better / worse) derived
// from its own effects. The 'default' id is kept so saves made mid-decision still resolve.
(() => {
  const O = (id, title, weight, result, effects = {}, modifiers) => ({id, title, weight, result, effects, ...(modifiers ? {modifiers} : {})});
  const set = (decisionId, label, preview, outcomes) => {
    const c = decisions.find(d => d.id === decisionId)?.choices.find(x => x.label.includes(label));
    if (c) { c.outcomes = outcomes; c.preview = preview; }
  };

  set('learn', '글을 배우기로', '배움이 시작됨 / 더딤 / 빠르게 익힘', [
    O('default', '배움이 시작되었습니다', 55, '이웃 어른에게 저녁마다 글자를 배웁니다. 석판에 자기 이름을 처음 써 보았습니다.'),
    O('slow', '배움이 더뎠습니다', 25, '일이 바빠 자주 빠졌고, 글자가 머리에 잘 들어오지 않았습니다. 그래도 몇 글자는 읽을 수 있게 되었습니다.', {stats:{지식:-8}}, [{when:{maxAptitude:40}, amount:20}]),
    O('quick', '놀랄 만큼 빨리 익혔습니다', 20, '몇 달 만에 기도서를 혼자 읽게 되었습니다. 가르치던 어른이 혀를 내둘렀습니다.', {stats:{지식:5}, literacy:'basic'}, [{when:{minAptitude:65}, amount:25}])]);
  set('learn', '가족의 일을', '가족의 신뢰 / 고된 일', [
    O('default', '가족의 일손이 되었습니다', 70, '가족의 생계를 도왔습니다. 집안에서 당신을 든든하게 여기기 시작했습니다.', {relationCloseness:{roles:['아버지','어머니'], amount:3}}),
    O('hard', '일이 고되었습니다', 30, '어린 나이에 하기엔 벅찬 일이었습니다. 자주 앓았습니다.', {stats:{건강:-3}})]);

  set('apprentice', '가업을 배운다', '가업을 이음 / 아버지와 부딪침', [
    O('default', '가업을 배우기 시작했습니다', 65, '아버지 곁에서 도구 다루는 법부터 다시 배웁니다.'),
    O('clash', '아버지와 자주 부딪쳤습니다', 35, '일하는 방식을 두고 아버지와 언성을 높이는 날이 많아졌습니다.', {relationCloseness:{roles:['아버지'], amount:-8}, stats:{행복:-2}})]);
  set('apprentice', '도제 생활', '좋은 장인 / 고된 장인', [
    O('default', '장인 밑에서 일을 배웁니다', 50, '다른 장인의 작업장 다락에서 먹고 자며 일을 배웁니다.'),
    O('good', '좋은 장인을 만났습니다', 25, '장인은 엄했지만 비법을 아낌없이 가르쳐 주었습니다.', {stats:{지식:3}, experience:{craft:2}}),
    O('harsh', '고된 장인을 만났습니다', 25, '새벽부터 밤까지 심부름만 했고 매도 자주 맞았습니다.', {stats:{건강:-3, 행복:-4}})]);
  set('apprentice', '임시 노동', '일감이 있음 / 일감이 끊김', [
    O('default', '그날그날 일을 찾았습니다', 65, '부두와 장터를 돌며 그날 일거리를 찾습니다.'),
    O('idle', '일감이 자주 끊겼습니다', 35, '일이 없는 날이 많아 집에 손을 벌려야 했습니다.', {stats:{재산:-3, 행복:-2}}, [{when:{years:[1788,1789,1795,1812,1816,1817,1846,1847]}, amount:30}])]);

  set('move', '파리로', '자리를 잡음 / 혹독한 첫해 / 금방 일자리', [
    O('default', '파리에 자리를 잡았습니다', 50, '포부르의 셋방을 얻었습니다. 고향 사람들이 모여 사는 골목이라 말이 통합니다.'),
    O('rough', '첫해가 혹독했습니다', 30, '일자리를 구하지 못해 몇 달을 굶다시피 했습니다. 몇 번이나 돌아갈까 생각했습니다.', {stats:{재산:-5, 건강:-3, 행복:-3}}, [{when:{maxWealth:30}, amount:15}]),
    O('lucky', '금방 좋은 일자리를 구했습니다', 20, '고향 사람의 소개로 첫 주에 일자리를 얻었습니다.', {stats:{재산:4, 행복:2}}, [{when:{minRelation:60}, amount:15}])]);
  set('move', '고향에 남는다', '편안함 / 아쉬움', [
    O('default', '고향에 남았습니다', 70, '익숙한 사람들 곁에서 생활을 이어 갑니다.'),
    O('regret', '가끔 그 길을 떠올립니다', 30, '파리로 떠난 친구의 편지를 받을 때마다 마음이 흔들립니다.', {stats:{행복:-3}})]);
  set('move', '친척에게', '답장 / 무소식', [
    O('default', '친척에게서 답장이 왔습니다', 50, '그쪽 사정과 일자리 이야기가 빼곡히 적혀 있었습니다.', {stats:{지식:1}}),
    O('silent', '답장이 오지 않았습니다', 50, '편지가 중간에 사라졌는지 끝내 소식이 없었습니다.', {stats:{행복:-1}})]);

  // Marriage: a meeting is not yet a wedding. The spouse moves from the choice into its outcomes.
  const meet = decisions.find(d => d.id === 'marriage')?.choices.find(x => x.label.includes('소개받은'));
  if (meet) {
    delete meet.effects.spouse; delete meet.effects.flag;
    meet.preview = '혼인 / 서로 맞지 않음 / 집안의 반대';
    meet.outcomes = [
      O('default', '혼인했습니다', 55, '몇 번 만나 이야기를 나누고, 양가가 혼인 계약을 맺었습니다. 성당에서 혼례를 올렸습니다.', {spouse:true, flag:'marriage', milestone:'혼인'}),
      O('mismatch', '서로 맞지 않았습니다', 25, '좋은 사람이었지만 마음이 가지 않았습니다. 혼담은 조용히 없던 일이 되었습니다.', {stats:{행복:-2}}),
      O('family', '집안이 반대했습니다', 20, '지참금 문제로 상대 집안이 혼담을 거절했습니다.', {stats:{행복:-4}}, [{when:{maxWealth:25}, amount:20}])];
  }

  set('war', '군 관련 일자리', '품삯 / 부상', [
    O('default', '군수품 일을 맡았습니다', 65, '고향에서 군수품을 나르고 말을 돌봅니다. 전선에는 가지 않습니다.', {job:'군 관련 노동자'}),
    O('hurt', '짐을 나르다 다쳤습니다', 35, '포탄 상자를 옮기다 허리를 다쳤습니다.', {job:'군 관련 노동자', stats:{건강:-4}})]);
  set('hardship', '지출을 줄인다', '버팀 / 몸이 상함', [
    O('default', '허리띠를 졸라맸습니다', 65, '끼니와 땔감을 줄여 겨우 버텼습니다.'),
    O('weak', '몸이 축났습니다', 35, '너무 아끼다 겨울에 크게 앓았습니다.', {stats:{건강:-4}})]);
  set('hardship', '이웃과 서로', '함께 버팀 / 도움이 돌아옴', [
    O('default', '이웃과 함께 버텼습니다', 60, '빵과 땔감을 나누며 겨울을 났습니다.'),
    O('returned', '도움이 돌아왔습니다', 40, '몇 달 뒤 당신이 앓아누웠을 때 이웃들이 먹을 것을 날라 주었습니다.', {stats:{건강:2, 행복:2}, closeness:3})]);
  set('trade', '작은 사업', '번창 / 그럭저럭 / 실패', [
    O('thrive', '가게가 번창했습니다', 30, '단골이 늘어 첫해에 밑천을 되찾았습니다.', {stats:{재산:15, 행복:4}}, [{when:{minKnowledge:60}, amount:15}]),
    O('default', '그럭저럭 꾸려 갑니다', 40, '큰돈은 못 벌지만 내 가게라는 자부심이 있습니다.', {stats:{재산:4}}),
    O('fail', '문을 닫았습니다', 30, '빚을 갚느라 가게를 정리했습니다.', {stats:{재산:-6, 행복:-6}, job:'임시 노동자'}, [{when:{maxWealth:40}, amount:10}])]);
  set('familychoice', '교육을 돕는다', '아이가 잘 배움 / 형편이 버거움', [
    O('default', '아이가 학교에 다닙니다', 60, '학비와 책값을 마련하느라 빠듯하지만 아이가 글을 깨쳐 갑니다.'),
    O('strain', '학비가 버거웠습니다', 40, '두 해 만에 학교를 그만두게 했습니다. 아이가 많이 울었습니다.', {stats:{재산:-3, 행복:-3}}, [{when:{maxWealth:30}, amount:20}])]);

  // ---- Every other choice: as hoped / better / worse, derived from its own effects ----
  const FLAVOR = {
    family:['가족도 당신의 선택을 반겼습니다.', '그러나 가까운 사람과 사이가 조금 서먹해졌습니다.'],
    marriage:['양가 모두 기뻐했습니다.', '그러나 뒷말이 한동안 따라다녔습니다.'],
    parenting:['아이가 잘 따라 주었습니다.', '그러나 아이와 실랑이가 잦았습니다.'],
    economy:['때마침 운이 따라 생각보다 넉넉했습니다.', '그러나 뜻하지 않은 지출이 생겼습니다.'],
    career:['윗사람의 눈에 들었습니다.', '그러나 일이 생각만큼 풀리지 않았습니다.'],
    housing:['새 생활이 금방 몸에 익었습니다.', '그러나 적응하는 데 애를 먹었습니다.'],
    relationships:['이 일로 오히려 사이가 깊어졌습니다.', '그러나 작은 오해가 남았습니다.'],
    religion:['마음이 한결 편안해졌습니다.', '그러나 마음 한구석이 계속 불편했습니다.'],
    politics:['다행히 큰 탈 없이 지나갔고, 사람들 사이에서 이름이 좋게 오르내렸습니다.', '그러나 이 일로 곤란한 말을 들었습니다.'],
    history:['그날의 일은 오래도록 좋은 기억으로 남았습니다.', '그러나 그날의 일은 오래 마음을 무겁게 했습니다.'],
    education:['어른들이 칭찬해 주었습니다.', '그러나 생각만큼 잘되지는 않았습니다.'],
    childhood:['어른들이 웃으며 머리를 쓰다듬어 주었습니다.', '그러나 그날 밤 괜히 울적했습니다.'],
    'old-age':['몸도 마음도 생각보다 가벼웠습니다.', '그러나 몸이 따라 주지 않았습니다.']
  };
  const half = v => Math.max(1, Math.round(Math.abs(v) / 2));
  const shift = (stats, better) => {
    const out = {};
    // Better luck always helps and worse luck always hurts, whatever the sign of the base effect.
    for (const [k, v] of Object.entries(stats || {})) if (v) out[k] = better ? half(v) : -half(v);
    if (!Object.keys(out).length) out.행복 = better ? 2 : -2;
    return out;
  };
  for (const d of decisions) for (const c of d.choices) {
    if (c.outcomes || c.effects?.doom) continue;
    // Staying put or waiting gets its own wording rather than the domain's (no "your superior noticed you" for staying home).
    const quiet = /머문다|남는다|지켜본다|기다린다|미룬다|그만둔다|사양한다|거절한다|숨는다|문을 닫는다/.test(c.label);
    const [good, bad] = quiet ? ['조용히 지나간 것이 오히려 다행이었습니다.', '그러나 나중에 그 선택을 여러 번 곱씹었습니다.'] : FLAVOR[d.domain] || FLAVOR.family;
    const base = c.result || '선택한 대로 되었습니다.';
    c.outcomes = [
      O('default', '생각한 대로 되었습니다', 60, base),
      O('better', '생각보다 잘 풀렸습니다', 20, `${base} ${good}`, {stats:shift(c.effects?.stats, true)}, [{when:{minKnowledge:65}, amount:5}, {when:{minRelation:60}, amount:5}]),
      O('worse', '뜻대로 되지 않았습니다', 20, `${base} ${bad}`, {stats:shift(c.effects?.stats, false)}, [{when:{maxWealth:20}, amount:5}, {when:{maxHealth:35}, amount:5}])];
    if (!c.preview) c.preview = '대개 예상대로 · 때로 더 좋거나 나쁘게';
  }
})();
