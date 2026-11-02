// src/data/facets.js — who you are changes what the day offers, and choices stay made
// 1. Choices can carry their own `when`: a soldier, a noble or a priest sees options at the Bastille,
//    the Federation, the King's execution or the Hundred Days that others do not.
// 2. Emigration is a state, not a sentence. An émigré is abroad: home-town scenes and ordinary career
//    steps stop, a French officer becomes an officer of the émigré army, and the way home opens only
//    with the amnesty of 1802 or the return of the king in 1814.
// 3. Royalist officers who stay can be purged, arrested, tried and guillotined; émigré officers can
//    die at Quiberon.
const isAbroad = s => !!s?.familyEvents?.emigre && !s.dead;
const SOLDIER_RE = /^(군인|육군)/;
function applyFacetEffects(s, e) {
  if (e.emigrate && !s.familyEvents.emigre) {
    s.familyEvents.emigre = s.year;
    s.familyEvents.preEmigreJob = s.job;
    const officer = SOLDIER_RE.test(s.job) || s.career?.id === 'officer';
    s.job = officer ? '망명군 장교' : '망명자'; s.career = null;
    s.paths.politics = 'royalist';
    milestone(s, officer ? '국경을 넘어 망명군에 합류' : '국경을 넘어 망명');
  }
  if (e.returnHome && s.familyEvents.emigre) {
    const years = s.year - s.familyEvents.emigre;
    delete s.familyEvents.emigre;
    s.job = e.returnHome === true ? '없음' : e.returnHome;
    milestone(s, `${years}년 만에 망명에서 귀국`);
  }
}

(() => {
  const SOLDIER = {jobMatch:'^(군인|육군)'}, NOBLE = {classes:['귀족']}, CLERGY = {jobMatch:'신학생|신부|참사회원|주교|수녀'}, ROYALIST = {politicsIn:['royalist']};
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});
  const GUILLOTINE = '혁명 광장의 단두대에서 처형되었습니다.';
  // Add a choice that only some people see.
  const facet = (id, when, choice) => { const d = decisions.find(x => x.id === id); if (d) d.choices.push({...choice, when, effects:{stats:{}, ...(choice.effects || {}), flags:[id, ...((choice.effects || {}).flags || [])]}}); };
  const mark = (id, label, extra) => { const c = decisions.find(x => x.id === id)?.choices.find(x => x.label.includes(label)); if (!c) return;
    for (const t of [c, ...(c.outcomes || [])]) if (t.effects) Object.assign(t.effects, extra); };

  // Leaving the country is now a real departure.
  mark('emigration', '국경을 넘어', {emigrate:true});
  mark('bastille-noble', '국경을 넘는다', {emigrate:true});

  // ───── 신분·직업마다 다른 선택지 ─────
  facet('federation', SOLDIER, {label:'(군인) 연대 대표로 조국의 제단 앞에 선다', result:'연대의 깃발을 들고 샹 드 마르스의 제단 앞에서 맹세했습니다. 장교와 사병이 한 줄로 섰습니다.', effects:{stats:{행복:6}, rep:3, milestone:'연맹제에 연대 대표로 참가'}});
  facet('federation', NOBLE, {label:'(귀족) 칭호를 내려놓고 시민으로 맹세한다', result:'두 달 전 세습 귀족 칭호가 폐지되었습니다. 문장 없는 외투를 입고 시민들 사이에서 맹세했습니다.', effects:{stats:{행복:3}, path:{politics:'constitutional'}}});
  facet('federation', CLERGY, {label:'(성직자) 제단에서 미사를 함께 올린다', result:'탈레랑 주교가 집전하는 제단 미사에 사제들이 줄지어 섰습니다. 비가 쏟아졌지만 30만 명이 무릎을 꿇었습니다.', effects:{stats:{행복:4}, experience:{religious:2}}});
  facet('versailles-march', SOLDIER, {label:'(군인) 국민방위대로 행렬을 따라 베르사유로 간다', result:'라파예트를 따라 밤길을 걸었습니다. 새벽에 궁으로 몰려든 군중과 근위대 사이를 막아섰습니다.', effects:{stats:{건강:-2}, rep:2}});
  facet('champ-de-mars', SOLDIER, {label:'(군인·국민방위대) 광장 경비에 선다', preview:'발포 명령', outcomes:[
    O('fire', '발포 명령이 떨어졌습니다', 60, '계엄령의 붉은 깃발이 오르고, 총구가 군중을 향했습니다. 당신도 방아쇠를 당겼습니다. 그날 밤 잠들지 못했습니다.', {stats:{행복:-6}, path:{politics:'constitutional'}}),
    O('refuse', '하늘을 향해 쏘았습니다', 40, '총구를 하늘로 돌렸습니다. 아무도 보지 못했기를 바랐습니다.', {stats:{행복:-2}})]});
  facet('king-execution', SOLDIER, {label:'(군인) 처형대 둘레의 경비를 선다', result:'북소리가 왕의 마지막 말을 덮었습니다. 당신은 처형대를 등지고 서 있었습니다.', effects:{stats:{행복:-3}, milestone:'국왕 처형 때 경비'}});
  facet('king-execution', {...ROYALIST}, {label:'(왕당파) 몰래 상복을 입고 미사를 올린다', preview:'무사함 / 밀고', outcomes:[
    O('ok', '아무도 몰랐습니다', 75, '지하실에서 선서 거부 신부가 왕을 위한 미사를 올렸습니다.', {experience:{religious:2}}),
    O('denounced', '밀고되었습니다', 25, '이웃이 감시위원회에 알렸습니다. 며칠 뒤 체포되어 감옥으로 끌려갔습니다.', {stats:{행복:-4}, flags:['royalist-prisoner'], milestone:'왕당파 혐의로 체포'})]});
  facet('thermidor', SOLDIER, {label:'(군인·헌병) 의회 편 부대와 함께 시청에 들어간다', result:'새벽 두 시, 시청 계단을 뛰어올랐습니다. 총성이 울렸고, 로베스피에르가 턱에 총을 맞았습니다.', effects:{stats:{행복:2}, rep:4, path:{politics:'thermidorian'}, milestone:'테르미도르 9일 시청 진입'}});
  facet('vendemiaire', ROYALIST, {label:'(왕당파) 왕당파 구역의 봉기에 가담한다', preview:'후퇴 / 포도탄', outcomes:[
    O('fled', '흩어져 달아났습니다', 70, '생로슈 성당 앞에서 젊은 보나파르트 장군의 포도탄이 쏟아졌습니다. 골목으로 흩어졌습니다.', {stats:{행복:-5}}),
    O('killed', '돌아오지 못했습니다', 30, '성당 계단에서 쓰러졌습니다.', {doom:'1795년 방데미에르 13일, 왕당파 봉기 중 생로슈 성당 앞에서 목숨을 잃었습니다.'})]});
  facet('vendemiaire', SOLDIER, {label:'(군인) 보나파르트 장군의 포대에 선다', result:'사블롱에서 끌어온 대포로 생로슈 성당 앞을 쓸었습니다. 그날 밤 ‘포도탄 장군’이라는 별명이 생겼습니다.', effects:{rep:4, milestone:'방데미에르 13일 진압'}});
  facet('hundred-days', SOLDIER, {label:'(군인) 연대와 함께 황제 편으로 넘어간다', result:'라프레 들판에서 황제가 외투를 열어 보였습니다. “황제를 쏘고 싶은 병사가 있다면 쏘라!” 아무도 쏘지 않았습니다.', effects:{stats:{행복:5}, path:{politics:'bonapartist'}, milestone:'백일천하 때 황제 편으로'}});
  facet('hundred-days', {...SOLDIER, ...ROYALIST}, {label:'(왕당파 장교) 국왕을 따라 헨트로 간다', result:'루이 18세를 따라 벨기에 헨트로 떠났습니다. 석 달 뒤 워털루가 끝나고 왕과 함께 돌아왔습니다. 왕은 충신을 잊지 않았습니다.', effects:{stats:{재산:3}, rep:4, milestone:'백일천하 때 국왕을 따라 헨트로'}});
  facet('trois-glorieuses', SOLDIER, {label:'(군인) 명령대로 거리로 나간다', preview:'발포 / 이탈', outcomes:[
    O('fired', '바리케이드에 발포했습니다', 50, '사흘째 날, 부대가 무너졌습니다. 시민들에게 쫓겨 군복을 벗고 달아났습니다.', {stats:{행복:-6}}),
    O('joined', '총을 거꾸로 들었습니다', 50, '연대 하나가 통째로 시민 편으로 넘어갔습니다. 당신도 그 가운데 있었습니다.', {stats:{행복:4}, path:{politics:'engaged'}})]});
  facet('february-1848', SOLDIER, {label:'(군인) 명령을 기다리며 대열을 지킨다', result:'카퓌신 대로의 총성 하나가 모든 것을 바꿨습니다. 이튿날 왕이 떠났고, 부대는 병영으로 돌아갔습니다.', effects:{stats:{행복:-2}}});
  facet('coup-paris-1851', SOLDIER, {label:'(군인) 쿠데타 부대로 대로를 정리한다', result:'12월 4일, 대로의 군중에게 발포 명령이 내려왔습니다. 몽마르트르 대로에 시신이 남았습니다.', effects:{stats:{행복:-6}, path:{politics:'bonapartist'}}});
  facet('great-fear', NOBLE, {label:'(귀족) 성문을 열고 장부를 내준다', result:'장부를 마당에 쌓아 놓게 했습니다. 농민들은 장부만 태우고 돌아갔습니다. 성은 무사했습니다.', effects:{stats:{재산:-6}, path:{politics:'constitutional'}}});
  facet('great-fear', NOBLE, {label:'(귀족) 하인들을 무장시켜 성을 지킨다', preview:'버팀 / 성이 불탐', outcomes:[
    O('held', '버텼습니다', 50, '총성 몇 번에 무리가 흩어졌습니다. 마을과의 사이는 돌이킬 수 없게 되었습니다.', {stats:{행복:-3}, path:{politics:'royalist'}}),
    O('burned', '성이 불탔습니다', 50, '밤사이 성의 한쪽 날개가 불탔습니다. 가족과 함께 도시로 피신했습니다.', {stats:{재산:-18, 행복:-8}, path:{politics:'royalist'}})]});

  // 1789년 7월의 군인
  decisions.unshift({id:'bastille-soldier', domain:'history', priority:31, historic:true, title:'샹 드 마르스의 연대',
    text:'7월, 왕은 파리 주변에 2만 명의 군대를 모았습니다. 당신의 연대도 샹 드 마르스에 진을 쳤습니다. 프랑스 근위대 병사들은 이미 군중 편에 섰다고 합니다. 14일 아침, 바스티유 쪽에서 총성이 들립니다.',
    when:{minAge:16, maxAge:60, ...SOLDIER, fromDate:[1789,7], toDate:[1789,7], unsetFlag:'bastille-soldier'},
    choices:[
      {label:'프랑스 근위대 동료들과 대포를 끌고 바스티유로 간다', preview:'함락의 영웅 / 반역죄', outcomes:[
        O('hero', '바스티유가 함락되었습니다', 85, '위랭 하사와 엘리 중위를 따라 대포 다섯 문을 요새 앞에 세웠습니다. 그날 저녁 당신은 ‘바스티유 정복자’가 되었습니다.', {stats:{행복:8}, rep:6, path:{politics:'engaged'}, milestone:'바스티유 함락에 군인으로 참여', flags:['bastille-soldier', 'bastille']}),
        O('hurt', '다쳤습니다', 15, '요새 위에서 쏜 총탄에 맞았습니다.', {stats:{건강:-12}, path:{politics:'engaged'}, flags:['bastille-soldier', 'bastille']})]},
      {label:'명령대로 진영에 머문다', result:'명령은 끝내 오지 않았습니다. 베장발 남작은 군대를 물렸고, 왕은 파리로 와서 삼색 휘장을 받았습니다.', effects:{flags:['bastille-soldier']}},
      {label:'(귀족 장교) 병사들이 이탈하지 못하게 다잡는다', when:NOBLE, result:'병사들의 눈빛이 이미 달라져 있었습니다. 그날 밤 부대의 절반이 사라졌습니다. 귀족 장교의 명령이 통하지 않는 시대가 왔습니다.', effects:{stats:{행복:-4}, path:{politics:'royalist'}, flags:['bastille-soldier']}}]});

  // ───── 왕당파 장교의 길 ─────
  const H = (id, date, until, when, title, text, choices, chance) => decisions.push({id, domain:'history', priority:33, historic:true, title, text, ...(chance ? {chance} : {}),
    when:{...when, fromDate:date, toDate:until, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id, ...((c.effects || {}).flags || [])]}}))});
  const OFFICER_ROYAL = {minAge:18, ...SOLDIER, royalOfficer:true};
  H('officer-1792', [1792,8], [1792,9], OFFICER_ROYAL, '8월 10일 이후의 장교',
    '왕정이 무너졌습니다. 라파예트 장군은 부하들과 함께 국경을 넘어 오스트리아군에 붙잡혔습니다. 귀족 출신 장교의 3분의 2가 이미 떠났습니다. 의회의 파견 위원이 남은 장교들에게 공화국에 대한 충성 서약을 요구합니다.',
    [{label:'서약하고 공화국 군대에 남는다', result:'서약서에 서명했습니다. 동료들 몇은 당신을 배신자라 했고, 파견 위원은 여전히 당신을 의심의 눈으로 봅니다.', effects:{stats:{행복:-2}, path:{politics:'constitutional'}}},
     {label:'밤에 부대를 떠나 국경을 넘는다', preview:'망명군 합류 / 붙잡힘', outcomes:[
       O('crossed', '국경을 넘었습니다', 75, '코블렌츠의 왕자들의 군대에 합류했습니다. 이제 당신은 프랑스의 적입니다.', {emigrate:true}),
       O('caught', '국경에서 붙잡혔습니다', 25, '탈영 장교로 붙잡혀 감옥에 갇혔습니다. 9월, 감옥마다 학살 소문이 돕니다.', {stats:{건강:-6, 행복:-8}, flags:['royalist-prisoner'], milestone:'탈영 중 체포'})]},
     {label:'파리에 남아 왕을 구할 음모에 가담한다', preview:'무사함 / 발각', outcomes:[
       O('hidden', '아무도 눈치채지 못했습니다', 45, '탕플 탑에 갇힌 왕을 빼낼 계획은 끝내 실행되지 못했습니다. 당신 이름은 어디에도 남지 않았습니다.', {stats:{행복:-3}, path:{politics:'royalist'}}),
       O('found', '음모가 발각되었습니다', 55, '동료가 붙잡혀 이름을 불었습니다. 한밤에 국민방위대가 문을 두드렸습니다.', {stats:{행복:-8}, path:{politics:'royalist'}, flags:['royalist-prisoner'], milestone:'왕당파 음모로 체포'})]}]);
  H('royalist-trial', [1792,9], [1794,7], {minAge:18, flagSet:'royalist-prisoner'}, '혁명 재판소',
    '감옥 문이 열리고 이름이 불렸습니다. 혁명 재판소의 푸키에탱빌 검사가 기소장을 읽습니다. “공화국에 맞선 음모, 망명 기도, 폭군과의 내통.” 증인은 둘, 변호인은 없습니다.',
    [{label:'왕에 대한 충성을 당당히 밝힌다', preview:'단두대', outcomes:[
       O('death', '사형이 선고되었습니다', 85, '“국왕 만세!” 판결이 끝나자 그렇게 외쳤습니다.', {doom:`왕당파로 혁명 재판소에서 사형 판결을 받고, ${GUILLOTINE}`}),
       O('spared', '판결이 미뤄졌습니다', 15, '서류가 뒤섞여 이름이 다음 달 명단으로 밀렸습니다. 그사이 테르미도르가 왔습니다.', {stats:{건강:-10, 행복:-10}, milestone:'단두대를 피해 석방'})]},
     {label:'공화국에 충성해 왔다고 변론한다', preview:'석방 / 투옥 / 단두대', outcomes:[
       O('freed', '풀려났습니다', 25, '연대 병사들이 당신이 부하를 아꼈다고 증언했습니다. 기적처럼 풀려났습니다.', {stats:{행복:4}, milestone:'혁명 재판소에서 무죄 석방'}),
       O('jailed', '감옥으로 돌아갔습니다', 35, '판결이 미뤄진 채 감옥에서 테르미도르를 맞았습니다.', {stats:{건강:-10, 행복:-8}}),
       O('death', '사형이 선고되었습니다', 40, '변론은 몇 분 만에 끝났습니다.', {doom:`왕당파 음모 혐의로 혁명 재판소에서 사형 판결을 받고, ${GUILLOTINE}`})]}], .25);
  H('officer-suspect', [1793,4], [1794,6], {...OFFICER_ROYAL, unsetFlag:'officer-suspect'}, '귀족 장교 체포령',
    '퀴스틴 장군과 비롱 장군이 단두대에 올랐습니다. 파견 위원이 부대마다 ‘귀족 출신’과 ‘왕당파’ 장교를 가려내고 있습니다. 내일 당신 차례라는 귀띔이 왔습니다.',
    [{label:'남아서 심문을 받는다', preview:'석방 / 투옥 / 단두대', outcomes:[
       O('freed', '살아남았습니다', 35, '병사들의 청원 덕에 계급을 잃고 풀려났습니다. 평민 출신 상사가 당신 자리를 맡았습니다.', {stats:{행복:-4}, job:'없음', milestone:'귀족 장교 숙청으로 파면'}),
       O('jailed', '감옥에 갇혔습니다', 40, '파리의 감옥으로 이송되었습니다. 테르미도르 뒤에야 풀려났습니다.', {stats:{건강:-10, 행복:-10}, job:'없음', milestone:'공포 정치 때 투옥'}),
       O('death', '돌아오지 못했습니다', 25, '혁명 재판소는 반나절 만에 판결을 내렸습니다.', {doom:`귀족 출신 장교로 체포되어 혁명 재판소에 넘겨졌고, ${GUILLOTINE}`})]},
     {label:'부대를 버리고 적진으로 넘어간다', preview:'망명 / 붙잡힘', outcomes:[
       O('crossed', '넘어갔습니다', 60, '뒤무리에 장군처럼 적진으로 넘어갔습니다. 이제 돌아갈 곳이 없습니다.', {emigrate:true}),
       O('caught', '붙잡혔습니다', 40, '전초선에서 붙잡혀 탈영 장교로 군사 위원회에 넘겨졌습니다.', {doom:'1793년, 적진으로 넘어가려다 붙잡혀 군사 위원회의 판결로 총살되었습니다.'})]}], .18);

  // Soldiers meet the Hundred Days as soldiers, before any home-town scene of that month.
  H('hundred-days-officer', [1815,3], [1815,4], {minAge:18, ...SOLDIER}, '황제가 돌아왔다: 연대의 선택',
    '엘바섬을 떠난 황제가 그르노블로 다가옵니다. 국왕의 명령은 “찬탈자를 막아라”입니다. 그러나 병사들은 벌써 배낭 속의 옛 삼색 휘장을 꺼내고 있습니다.',
    [{label:'연대와 함께 황제 편으로 넘어간다', result:'“황제 만세!” 연대 전체가 독수리 깃발 아래로 넘어갔습니다. 석 달 뒤 워털루가 기다립니다.', effects:{stats:{행복:5}, path:{politics:'bonapartist'}, milestone:'백일천하 때 황제 편으로'}},
     {label:'(왕당파) 국왕을 따라 헨트로 간다', when:ROYALIST, result:'루이 18세를 따라 벨기에 헨트로 떠났습니다. 워털루 뒤 왕과 함께 돌아왔습니다. 왕은 충신을 잊지 않았습니다.', effects:{stats:{재산:3}, rep:5, milestone:'백일천하 때 국왕을 따라 헨트로'}},
     {label:'병영을 지키며 지켜본다', result:'명령도 충성도 흐려진 석 달이었습니다. 왕이 돌아오자 ‘기회주의자’라는 꼬리표가 붙었습니다.', effects:{stats:{행복:-2}}}]);
  decisions.unshift(decisions.pop());

  // ───── 망명 생활과 귀국 ─────
  H('conde-army', [1793,6], [1796,6], {minAge:18, jobMatch:'망명군 장교'}, '콩데 군',
    '콩데 공의 망명군은 오스트리아군 옆에서 라인강을 따라 싸웁니다. 맞은편 참호에는 프랑스 공화국 군대가 있습니다. 그 가운데 고향 사람이 있을지도 모릅니다.',
    [{label:'공격 대열에 선다', preview:'무사 / 부상 / 전사', outcomes:[
       O('ok', '살아남았습니다', 70, '하게나우 숲에서 프랑스인끼리 총검을 맞댔습니다. 이겼다는 기쁨은 오래가지 않았습니다.', {stats:{행복:-4, 건강:-4}}),
       O('hurt', '다쳤습니다', 22, '공화국군의 총탄이 다리를 꿰뚫었습니다.', {stats:{건강:-15}}),
       O('died', '돌아오지 못했습니다', 8, '라인강 변의 진흙 속에 쓰러졌습니다.', {doom:'망명군 장교로 라인강 전선에서 공화국 군대와 싸우다 전사했습니다.'})]},
     {label:'군을 떠나 함부르크에서 장사를 시작한다', result:'군복을 벗고 함부르크에서 프랑스어 교사와 포도주 중개 일을 했습니다.', effects:{stats:{재산:2}, job:'망명자'}}]);
  H('quiberon-emigre', [1795,6], [1795,7], {minAge:18, jobMatch:'망명군 장교'}, '키브롱 상륙',
    '영국 함대가 망명군 연대를 브르타뉴 키브롱반도에 내려 주기로 했습니다. 슈앙과 합류해 서부를 일으킨다는 계획입니다. 오슈 장군의 공화국군이 기다리고 있다는 소문도 있습니다.',
    [{label:'상륙 부대에 선다', preview:'탈출 / 포로·총살', outcomes:[
       O('escaped', '배로 빠져나왔습니다', 40, '반도 끝에서 바다로 뛰어들어 영국 배에 끌어올려졌습니다. 동료 수백 명이 해변에 남았습니다.', {stats:{건강:-6, 행복:-8}, milestone:'키브롱에서 탈출'}),
       O('shot', '붙잡혀 총살되었습니다', 60, '항복하면 살려 준다는 말을 믿었습니다. 군사 위원회는 망명자에게 자비를 베풀지 않았습니다.', {doom:'1795년 7월, 키브롱 상륙이 실패한 뒤 포로가 되어 오레 근처 들판에서 총살되었습니다.'})]},
     {label:'이번 원정에서는 빠진다', result:'영국에 남았습니다. 몇 주 뒤 키브롱의 소식이 런던에 닿았습니다. 700명 넘게 총살되었다고 합니다.', effects:{stats:{행복:-5}}}]);
  H('emigre-amnesty', [1802,4], [1803,12], {minAge:16, abroad:true}, '망명자 사면',
    '제1통령 보나파르트가 망명자 대부분을 사면했습니다. 충성 서약만 하면 돌아갈 수 있습니다. 몰수된 땅 가운데 팔리지 않은 것은 돌려준다고 합니다.',
    [{label:'서약하고 프랑스로 돌아간다', result:'열 몇 해 만에 고향 땅을 밟았습니다. 집은 남의 손에 넘어가 있었고, 알던 얼굴의 절반은 사라졌습니다.', effects:{stats:{행복:4, 재산:3}, returnHome:true, path:{politics:'private'}}},
     {label:'찬탈자 밑으로는 돌아가지 않는다', result:'왕이 돌아올 때까지 기다리기로 했습니다. 그 기다림은 열두 해가 걸립니다.', effects:{stats:{행복:-3}}}], .5);
  H('emigre-1814', [1814,4], [1814,12], {minAge:16, abroad:true}, '왕과 함께 돌아오다',
    '나폴레옹이 퇴위했습니다. 루이 18세가 영국에서 칼레로 건너옵니다. 망명자들이 줄지어 그 뒤를 따릅니다.',
    [{label:'왕의 행렬을 따라 파리로 들어간다', result:'스물몇 해 만의 귀국입니다. 왕실 근위대에 옛 망명군 장교들의 자리가 마련되었습니다. 사람들은 당신들을 ‘아무것도 배우지 못하고 아무것도 잊지 못한 자들’이라 불렀습니다.', effects:{stats:{행복:6, 재산:4}, returnHome:'왕실 근위대 장교', rep:4}},
     {label:'조용히 고향으로 돌아간다', result:'고향 성당에서 감사 미사를 올렸습니다.', effects:{stats:{행복:4}, returnHome:true}}]);
  // Émigré daily life.
  const E = (id, kind, title, text, stats = {}) => dailyEvents.push({id, kind, category:'personal', when:{minAge:16, abroad:true}, title, text, effects:{stats, experience:{}}, tags:['daily', 'life'], repeatable:false});
  E('emi-london', 'bad', '런던의 다락방', '런던 소호의 다락방에서 망명 귀족들이 함께 삽니다. 후작 부인이 모자를 짓고, 백작은 프랑스어를 가르칩니다.', {재산:-2, 행복:-1});
  E('emi-news', 'bad', '고향에서 온 소식', '고향 소식이 늦게 닿았습니다. 남은 친척 하나가 단두대에 올랐고, 집은 국유재산으로 팔렸다고 합니다.', {행복:-5});
  E('emi-koblenz', 'normal', '코블렌츠의 무도회', '망명 궁정에서는 아직도 베르사유처럼 무도회와 서열 다툼이 이어집니다. 돈은 날마다 줄어 갑니다.', {재산:-2});
  E('emi-tutor', 'normal', '프랑스어 교사', '독일 상인 집 아이들에게 프랑스어와 춤을 가르쳐 끼니를 잇습니다.', {재산:1});
  E('emi-mass', 'normal', '망명지의 미사', '선서를 거부하고 망명한 사제가 셋방에서 미사를 올렸습니다. 모두 프랑스를 위해 기도했습니다.', {행복:1});
})();
// A royalist (or noble) officer still in the French army after 1792 is a marked man.
function royalOfficer(s) { return SOLDIER_RE.test(s.job || '') && (s.class === '귀족' || s.paths?.politics === 'royalist'); }
