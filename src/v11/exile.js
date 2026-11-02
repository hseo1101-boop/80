// src/data/exile.js — 망명지의 삶
// Koblenz and the princes' court (1789–1792), London's Soho garrets and the émigré priests,
// Hamburg and Altona's merchants and booksellers, Lausanne and Fribourg until the French came in
// 1798, Russia under Catherine and Paul, Philadelphia's yellow fever. Exile moves on with the war,
// and a secret return before the amnesty can end before a firing squad.
(() => {
  const E = (id, kind, where, title, text, stats = {}, extra = {}) => dailyEvents.push({id, kind, category:'personal',
    when:{minAge:12, abroad:true, ...(where ? {exileIn:where} : {}), ...extra}, title, text, effects:{stats, experience:{}}, tags:['daily', 'life', 'exile'], repeatable:false});
  const KOB = ['코블렌츠'], LON = ['런던'], HAM = ['함부르크'], SUI = ['로잔'], RUS = ['상트페테르부르크'], USA = ['필라델피아'];

  // 코블렌츠: 왕자들의 궁정
  E('ex-kob-court', 'normal', KOB, '라인강의 베르사유', '아르투아 백작의 궁정은 베르사유를 그대로 옮겨 온 것 같습니다. 누가 먼저 망명했는지, 누가 더 오래된 귀족인지를 두고 다툼이 끊이지 않습니다.', {행복:-1}, {toYear:1792});
  E('ex-kob-latecomer', 'bad', KOB, '늦게 온 사람', '1791년에 넘어온 사람들은 1789년에 온 사람들에게 ‘늦게 온 자’라며 냉대를 받습니다. 충성에도 순서가 있다고 합니다.', {행복:-2}, {fromYear:1791, toYear:1792});
  E('ex-kob-money', 'bad', KOB, '바닥나는 돈', '가져온 금화와 패물을 하나씩 팔고 있습니다. 모두 “석 달 안에 돌아간다”고 믿으며 돈을 씁니다.', {재산:-3}, {toYear:1792});
  E('ex-kob-drill', 'normal', KOB, '왕자들의 군대', '귀족 장교들이 사병 계급장을 달고 총검술을 배웁니다. 공작이 이등병, 후작이 하사입니다.', {건강:-1}, {toYear:1792});
  E('ex-brunswick', 'normal', null, '브라운슈바이크 선언', '동맹군 사령관이 “왕 일가를 해치면 파리를 잿더미로 만들겠다”는 선언을 냈습니다. 망명자들은 환호했지만, 파리에서는 이 선언이 오히려 왕정을 무너뜨렸다고 합니다.', {행복:1}, {years:[1792]});

  // 런던
  E('ex-lon-garret', 'bad', LON, '소호의 다락방', '소호의 좁은 다락방에 망명자 넷이 함께 삽니다. 촛불 한 자루를 아껴 쓰고, 밤에는 외투를 이불 삼아 덮습니다.', {재산:-2, 건강:-1});
  E('ex-lon-lesson', 'normal', LON, '프랑스어 교습', '영국 상인 집 딸들에게 프랑스어와 춤을 가르칩니다. 한때 하인을 부리던 손이 이제 남의 집 초인종을 누릅니다.', {재산:2, 행복:-1});
  E('ex-lon-straw', 'normal', LON, '밀짚 모자', '망명 귀부인들이 밀짚 모자와 조화를 만들어 팝니다. 런던 숙녀들 사이에 ‘프랑스 백작 부인이 만든 모자’가 유행입니다.', {재산:1});
  E('ex-lon-priests', 'normal', LON, '윈체스터의 신부들', '영국 정부가 윈체스터의 빈 궁전을 망명 사제 수백 명에게 내주었습니다. 개신교 나라가 가톨릭 신부들을 먹여 살립니다.', {행복:1}, {jobMatch:'사제|신부'});
  E('ex-lon-fog', 'bad', LON, '런던의 안개', '석탄 연기 섞인 안개가 며칠째 걷히지 않습니다. 기침이 멎지 않습니다. 고향의 햇빛이 그립습니다.', {건강:-2});
  E('ex-lon-subsidy', 'good', LON, '구호금', '영국 정부의 망명자 구호금을 받았습니다. 한 달을 버틸 만한 돈입니다. 고맙지만 부끄럽습니다.', {재산:2, 행복:-1}, {fromYear:1794});
  E('ex-lon-english', 'normal', LON, '영어', '마침내 영어로 빵을 살 수 있게 되었습니다. 아이들은 벌써 영어로 꿈을 꾼다고 합니다.', {}, {});

  // 함부르크·알토나
  E('ex-ham-port', 'good', HAM, '중립 항구', '중립국 함부르크는 망명자와 첩자, 장사꾼이 뒤섞인 도시입니다. 프랑스 포도주를 몰래 들여와 팔아 쏠쏠한 이문을 남겼습니다.', {재산:3});
  E('ex-ham-books', 'normal', HAM, '알토나의 서점', '알토나의 프랑스어 서점에서 망명자 신문 「북방의 관객」을 읽었습니다. 파리 소식은 언제나 열흘 늦게 옵니다.', {}, {});
  E('ex-ham-theatre', 'good', HAM, '프랑스 극장', '망명 배우들이 함부르크에서 프랑스어 극장을 열었습니다. 몰리에르를 보며 모두 웃고, 또 울었습니다.', {행복:3});

  // 로잔·프리부르
  E('ex-sui-lake', 'good', SUI, '레만 호숫가', '로잔의 호숫가를 걸었습니다. 건너편 사부아 산 너머가 프랑스입니다. 날이 맑으면 고향 쪽 하늘이 보이는 것 같습니다.', {행복:2});
  E('ex-sui-coppet', 'normal', SUI, '코페의 살롱', '스탈 부인의 코페 성에 초대받았습니다. 망명 귀족과 공화파가 한 식탁에서 논쟁합니다. 자유주의자라는 이유로 망명자들 사이에서 그녀를 꺼리는 사람도 많습니다.', {지식:2}, {fromYear:1793, toYear:1797});
  E('ex-sui-convent', 'normal', SUI, '프리부르의 수도원', '프리부르의 수도원들이 망명 수녀와 사제를 받아 줍니다. 종소리가 고향과 똑같습니다.', {행복:1});

  // 러시아
  E('ex-rus-cold', 'bad', RUS, '네바강의 겨울', '네바강이 얼어붙고 해가 오후 세 시에 집니다. 러시아 귀족들은 프랑스어를 우리보다 더 우아하게 씁니다.', {건강:-2});
  E('ex-rus-tutor', 'good', RUS, '러시아 귀족 집 가정교사', '러시아 백작 집안의 아이들에게 프랑스어와 예법을 가르칩니다. 대우가 후합니다. 프랑스 사람이라는 것만으로 귀한 대접을 받습니다.', {재산:4, 행복:1});
  E('ex-rus-paul', 'bad', RUS, '변덕스러운 황제', '황제 파벨 1세가 프랑스식 둥근 모자와 조끼를 금지했습니다. 거리에서 경찰이 모자를 찢었습니다.', {행복:-2}, {fromYear:1797, toYear:1801});

  // 필라델피아
  E('ex-usa-fever', 'bad', USA, '황열병', '필라델피아에 황열병이 돌아 시민의 열에 하나가 죽었습니다. 망명자들도 시골로 달아났습니다.', {건강:-4, 행복:-3}, {years:[1793, 1797, 1798]});
  E('ex-usa-shop', 'good', USA, '모로 드 생메리의 서점', '망명자가 연 프랑스어 서점이 망명자들의 모임터입니다. 거기서 탈레랑을 보았다는 사람도 있습니다.', {지식:2});
  E('ex-usa-land', 'normal', USA, '오하이오의 땅', '오하이오 강가에 프랑스인 정착촌을 세운다는 땅 투기 이야기가 돕니다. 갈리폴리스로 간 사람들은 숲속에서 고생만 했다고 합니다.', {}, {});

  // 어디서나
  E('ex-king-dead', 'bad', null, '국왕의 죽음', '루이 16세가 단두대에서 처형되었다는 소식이 닿았습니다. 망명지의 성당에서 검은 휘장을 두르고 장엄 미사를 올렸습니다.', {행복:-6}, {years:[1793]});
  E('ex-queen-dead', 'bad', null, '왕비의 죽음', '마리 앙투아네트도 단두대에 올랐다고 합니다. 망명자 부인들이 모두 검은 옷을 입었습니다.', {행복:-4}, {years:[1793]});
  E('ex-list', 'bad', null, '망명자 명부', '고향의 망명자 명부에 당신 이름이 올랐다는 소식입니다. 명부에 오른 사람은 영원히 추방되고, 돌아오면 사형입니다. 재산은 국유재산으로 팔립니다.', {재산:-4, 행복:-3}, {fromYear:1792, toYear:1799});
  E('ex-letters', 'normal', null, '숨겨진 편지', '고향의 친척이 장사 편지인 척 쓴 편지를 보내왔습니다. 행간에 레몬즙으로 쓴 글씨가 있었습니다.', {행복:1});
  E('ex-child-abroad', 'normal', null, '외국말을 하는 아이', '망명지에서 자란 아이가 프랑스어보다 그 나라 말을 더 잘합니다. 아이에게 프랑스는 이야기 속 나라입니다.', {}, {hasChild:true});
  E('ex-mass-louis17', 'bad', null, '탕플의 소년', '탕플 감옥의 어린 왕 루이 17세가 죽었다는 소식입니다. 망명 궁정은 프로방스 백작을 루이 18세로 받들었습니다.', {행복:-3}, {years:[1795]});
})();

DECISION_DOMAINS.push({id:'exile', label:'망명', target:0});
(() => {
  const H = (id, date, until, when, title, text, choices, chance) => decisions.push({id, domain:'history', priority:33, historic:true, title, text, ...(chance ? {chance} : {}),
    when:{abroad:true, ...when, fromDate:date, toDate:until, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id, ...((c.effects || {}).flags || [])]}}))});
  const D = (id, when, title, text, choices, chance) => decisions.push({id, domain:'exile', priority:28, title, text, ...(chance ? {chance} : {}),
    when:{abroad:true, ...when, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id]}}))});
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});

  H('princes-army-ends', [1792,11], [1793,3], {minAge:16, exileIn:['코블렌츠']}, '흩어지는 왕자들의 군대',
    '발미에서 동맹군이 물러났습니다. 왕자들의 군대는 해산되고, 코블렌츠의 궁정도 문을 닫습니다. 망명자들은 저마다 다음 피난처를 찾아 떠납니다. 돈이 거의 남지 않았습니다.',
    [{label:'영국으로 건너간다', result:'오스텐더에서 배를 타고 런던에 닿았습니다. 안개와 석탄 연기의 도시입니다.', effects:{stats:{재산:-3}, exileMove:'런던'}},
     {label:'중립 항구 함부르크로 간다', result:'장사꾼과 첩자의 도시 함부르크로 갔습니다. 여기서는 적어도 일거리가 있습니다.', effects:{stats:{재산:-2}, exileMove:'함부르크'}},
     {label:'스위스 로잔으로 간다', result:'레만 호숫가의 로잔에 셋방을 얻었습니다. 국경 너머가 바로 프랑스입니다.', effects:{stats:{재산:-2}, exileMove:'로잔'}},
     {label:'(장교) 콩데 공의 군대에 남는다', when:{jobMatch:'망명군 장교'}, result:'오스트리아군 옆에서 싸우는 콩데 군에 남았습니다. 진영을 따라 라인강을 오르내립니다.', effects:{stats:{행복:-2}, exileMove:'콩데 군 진영'}},
     {label:'러시아 여제의 초청을 따른다', requires:{minWealth:30}, result:'예카테리나 2세가 프랑스 귀족을 환대한다는 말을 듣고 긴 여행 끝에 상트페테르부르크에 닿았습니다.', effects:{stats:{재산:-6}, exileMove:'상트페테르부르크'}}]);
  H('exile-america', [1793,6], [1795,12], {minAge:18, exileIn:['런던', '함부르크']}, '대서양 너머',
    '유럽의 전쟁이 끝날 기미가 없습니다. 미국으로 건너가는 망명자들이 늘고 있습니다. 필라델피아에는 이미 프랑스인 거리가 생겼다고 합니다.',
    [{label:'필라델피아행 배를 탄다', result:'두 달의 항해 끝에 델라웨어강에 닿았습니다. 공화국의 나라에서 왕당파 망명자로 살게 되었습니다.', effects:{stats:{재산:-4, 행복:-1}, exileMove:'필라델피아'}},
     {label:'유럽에 남는다', result:'바다를 건너면 영영 돌아가지 못할 것 같았습니다.', effects:{}}], .3);
  H('conde-russia', [1797,10], [1798,3], {minAge:18, exileIn:['콩데 군 진영']}, '러시아로 가는 콩데 군',
    '오스트리아가 프랑스와 강화를 맺었습니다. 갈 곳 없는 콩데 군을 러시아 황제 파벨 1세가 통째로 받아들였습니다. 부대는 볼히니아로 행군합니다.',
    [{label:'부대를 따라 러시아로 간다', result:'눈 덮인 볼히니아의 병영에서 러시아 군복을 입었습니다. 프랑스는 점점 멀어집니다.', effects:{stats:{건강:-4, 행복:-3}, exileMove:'상트페테르부르크'}},
     {label:'군을 떠나 함부르크로 간다', result:'군복을 벗고 북쪽 항구로 갔습니다.', effects:{exileMove:'함부르크', job:'망명자'}}]);
  H('switzerland-1798', [1798,3], [1798,5], {minAge:12, exileIn:['로잔']}, '스위스에 들어온 프랑스군',
    '프랑스 공화국 군대가 스위스로 들어왔습니다. 베른의 금고가 털리고, 망명자들은 다시 짐을 쌉니다. 붙잡히면 프랑스로 넘겨진다고 합니다.',
    [{label:'독일로 피신한다', preview:'무사 / 붙잡힘', outcomes:[
       O('fled', '빠져나갔습니다', 80, '산길을 넘어 독일 쪽으로 건너갔습니다. 함부르크까지 몇 주를 걸었습니다.', {stats:{건강:-4, 재산:-4}, exileMove:'함부르크'}),
       O('caught', '붙잡혔습니다', 20, '국경에서 프랑스군에게 붙잡혀 망명자로 군사 위원회에 넘겨졌습니다.', {doom:'1798년, 스위스를 점령한 프랑스군에게 붙잡혀 귀국한 망명자로 총살되었습니다.'})]},
     {label:'프리부르의 수도원에 숨는다', result:'수도원의 다락에서 몇 달을 지냈습니다. 수녀들이 음식을 날라 주었습니다.', effects:{stats:{행복:-3}}}]);
  D('exile-work', {minAge:16, maxAge:60, fromYear:1790, toYear:1813, jobMatch:'^(망명자|망명 사제)$'}, '망명지의 생계',
    '가져온 것은 다 팔았습니다. 살아남으려면 일을 해야 합니다. 귀족에게도, 부르주아에게도 낯선 결정입니다.',
    [{label:'프랑스어와 춤을 가르친다', result:'명문가 자녀들의 가정교사가 되었습니다. 굶지는 않습니다.', effects:{stats:{재산:3}, job:'망명지 가정교사'}},
     {label:'수공예품을 만들어 판다', result:'조화와 자수, 밀짚 모자를 만들어 팔았습니다. 손끝이 거칠어졌습니다.', effects:{stats:{재산:2, 건강:-1}, job:'수공예인'}},
     {label:'포도주와 비단 중개를 한다', requires:{minKnowledge:35}, preview:'이문 / 손해', outcomes:[
       O('gain', '장사가 됐습니다', 55, '프랑스 물건을 찾는 사람은 어디에나 있었습니다.', {stats:{재산:6}, job:'중개상'}),
       O('loss', '손해를 봤습니다', 45, '전쟁으로 배가 묶여 물건이 썩었습니다.', {stats:{재산:-4}})]},
     {label:'자존심을 지키며 구호금으로 버틴다', result:'구호 단체의 명단에 이름을 올렸습니다.', effects:{stats:{재산:-1, 행복:-2}}}], .5);
  D('exile-marriage', {minAge:20, maxAge:40, noLivingRoles:['배우자'], fromYear:1791, toYear:1813}, '망명지의 혼담',
    '망명지에서 알게 된 그 나라 사람(혹은 같은 처지의 망명자)과 정이 들었습니다. 그 나라 사람과 혼인하면 돌아갈 날이 더 멀어질지도 모릅니다.',
    [{label:'그 나라 사람과 혼인한다', result:'개신교 목사와 가톨릭 신부가 각각 한 번씩 혼인을 축복했습니다. 아이는 두 나라 말을 할 것입니다.', effects:{stats:{행복:6}, addRelation:{role:'배우자', age:26, closeness:70, job:'상인'}, milestone:'망명지에서 혼인', flags:['marriage']}},
     {label:'같은 망명자와 혼인한다', result:'두 사람 다 가진 것이 없었지만, 같은 고향 말로 웃을 수 있었습니다.', effects:{stats:{행복:5, 재산:-1}, addRelation:{role:'배우자', age:28, closeness:75, job:'망명자'}, milestone:'망명지에서 혼인', flags:['marriage']}},
     {label:'귀국할 때까지 기다린다', result:'고향에 돌아가서 하겠다고 미뤘습니다.', effects:{}}], .3);
  D('secret-return', {minAge:18, maxAge:65, fromYear:1795, toYear:1799}, '몰래 돌아갈까',
    '테르미도르 뒤 공포 정치가 끝났습니다. 위조 여권으로 몰래 돌아가는 망명자들이 있습니다. 붙잡히면 ‘귀국 망명자’로 24시간 안에 총살입니다. 그래도 남은 가족과 팔리지 않은 땅이 있습니다.',
    [{label:'위조 여권으로 돌아간다', preview:'귀향 / 총살', outcomes:[
       O('home', '무사히 돌아왔습니다', 65, '다른 이름으로 고향에 숨어들었습니다. 1802년 사면 때까지 이웃들은 아무도 당신을 알아보지 못한 척했습니다.', {stats:{행복:5}, returnHome:true, milestone:'위조 여권으로 몰래 귀국'}),
       O('shot', '붙잡혔습니다', 35, '국경 검문소에서 서류가 의심받았습니다. 군사 위원회는 이튿날 아침에 판결했습니다.', {doom:'몰래 귀국하다 붙잡혀, 귀국 망명자 처벌법에 따라 총살되었습니다.'})]},
     {label:'사면을 기다린다', result:'1797년 9월 프뤽티도르 정변 뒤, 몰래 돌아갔던 사람들이 다시 쫓겨 나왔습니다. 기다린 것이 옳았습니다.', effects:{stats:{행복:-1}}}], .35);
})();
