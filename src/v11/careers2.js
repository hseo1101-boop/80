// src/careers-more.js
// Stage 2: fourteen more careers, including paths open to women, with doors, period events and figures.
Object.assign(CAREERS, {
  clergy:{label:'성직자', ranks:[
    {label:'신학생', pay:0, rep:1}, {label:'보좌 신부', years:3, need:12, pay:1, rep:1},
    {label:'본당 신부', years:4, need:28, pay:1, rep:2}, {label:'대성당 참사회원', years:6, need:50, pay:2, rep:1},
    {label:'주교', years:10, need:88, pay:3, rep:2, nobleBefore:1790}]},
  convent:{label:'수녀', ranks:[
    {label:'수련 수녀', pay:0, rep:1}, {label:'수녀', years:2, need:10, pay:0, rep:1}, {label:'원장 수녀', years:12, need:55, pay:1, rep:2}]},
  medicine:{label:'의사', ranks:[
    {label:'외과 견습생', pay:0, rep:1}, {label:'외과의', years:3, need:18, pay:2, rep:1},
    {label:'의사', years:3, need:32, knowledge:62, pay:3, rep:2}, {label:'병원 수석 의사', years:6, need:60, knowledge:70, pay:4, rep:2}]},
  industry:{label:'공장주', ranks:[
    {label:'작업장 감독', pay:1, rep:1}, {label:'작업장 주인', years:3, need:20, wealth:45, pay:2, rep:1},
    {label:'공장주', years:4, need:35, wealth:60, pay:4, rep:1, fromYear:1800}, {label:'산업가', years:6, need:60, wealth:80, pay:5, rep:2, fromYear:1820}]},
  bureau:{label:'관료', ranks:[
    {label:'관청 서기', pay:1, rep:1}, {label:'사무관', years:4, need:22, pay:2, rep:1},
    {label:'국장', years:6, need:45, pay:3, rep:1}, {label:'국무원 참사관', years:6, need:72, knowledge:70, pay:4, rep:2, fromYear:1800}]},
  teaching:{label:'교사', ranks:[
    {label:'보조 교사', pay:0, rep:1}, {label:'마을 학교 교사', years:2, need:10, pay:1, rep:1},
    {label:'도시 학교 교사', years:4, need:28, pay:1, rep:1}, {label:'리세 교사', years:5, need:45, knowledge:65, pay:2, rep:2, fromYear:1802}]},
  theatre:{label:'배우', ranks:[
    {label:'유랑 극단 배우', pay:0, rep:2}, {label:'지방 극장 배우', years:3, need:18, pay:1, rep:2},
    {label:'파리 극장 배우', years:3, need:38, pay:2, rep:2}, {label:'명배우', years:5, need:70, pay:4, rep:2}]},
  salon:{label:'살롱 운영자', ranks:[
    {label:'살롱 손님', pay:0, rep:2}, {label:'살롱 안주인', years:2, need:25, pay:0, rep:2}, {label:'이름난 살롱의 안주인', years:5, need:60, pay:0, rep:2}]},
  letters:{label:'작가', ranks:[
    {label:'무명 작가', pay:0, rep:1}, {label:'출간 작가', years:3, need:22, pay:1, rep:2}, {label:'이름난 작가', years:5, need:62, pay:3, rep:2}]},
  midwife:{label:'산파', ranks:[
    {label:'견습 산파', pay:1, rep:1}, {label:'산파', years:2, need:12, pay:1, rep:1}, {label:'교구 공인 산파', years:8, need:45, pay:2, rep:1}]},
  modes:{label:'의상·장신구 상인', ranks:[
    {label:'견습 재봉사', pay:0, rep:1}, {label:'재봉사', years:2, need:10, pay:1, rep:1},
    {label:'장신구 상인', years:4, need:28, wealth:35, pay:2, rep:1}, {label:'유명 의상실 주인', years:5, need:58, wealth:55, pay:4, rep:2}]},
  sea:{label:'선원', risk:{p:.025, text:'바다에서 돌아오지 못했습니다.'}, ranks:[
    {label:'견습 선원', pay:1, rep:1}, {label:'선원', years:2, need:8, pay:1, rep:1},
    {label:'항해사', years:4, need:25, knowledge:45, pay:2, rep:1}, {label:'선장', years:5, need:45, knowledge:50, pay:4, rep:2}]},
  engineering:{label:'토목 기사', ranks:[
    {label:'견습 측량사', pay:1, rep:1}, {label:'토목 기사', years:3, need:22, knowledge:65, pay:2, rep:1},
    {label:'수석 기사', years:6, need:50, knowledge:72, pay:3, rep:2}]},
  police:{label:'경찰', ranks:[
    {label:'순경', pay:1, rep:1}, {label:'경찰서장', years:5, need:30, pay:2, rep:1}, {label:'경찰 국장', years:6, need:60, pay:3, rep:1}]}
});
Object.assign(FIGURES, {
  gregoire:{name:'앙리 그레구아르', sex:'남성', born:[1750,12], job:'신부·의원', death:[1831,5], fate:'그레구아르 신부가 세상을 떠났습니다. 대주교는 종부성사를 거부했지만, 수많은 노동자가 그의 운구를 따랐습니다.'},
  pinel:{name:'필리프 피넬', sex:'남성', born:[1745,4], job:'정신과 의사', death:[1826,10], fate:'피넬이 세상을 떠났습니다. 정신병자를 쇠사슬에서 풀어 준 의사로 기억됩니다.'},
  larrey:{name:'도미니크장 라레', sex:'남성', born:[1766,7], job:'군의관', death:[1842,7], fate:'라레가 세상을 떠났습니다. 나폴레옹은 유언에 그를 “내가 아는 가장 덕 있는 사람”이라고 남겼습니다.'},
  jacquard:{name:'조제프마리 자카르', sex:'남성', born:[1752,7], job:'직기 발명가', death:[1834,8], fate:'자카르가 세상을 떠났습니다. 그의 천공 카드 직기는 리옹의 모든 작업장을 바꾸었습니다.'},
  fouche:{name:'조제프 푸셰', sex:'남성', born:[1759,5], job:'경찰 장관', death:[1820,12], fate:'푸셰가 망명지 트리에스테에서 세상을 떠났습니다. 혁명과 제국과 왕정을 모두 섬긴 사람이었습니다.'},
  talma:{name:'프랑수아조제프 탈마', sex:'남성', born:[1763,1], job:'배우', death:[1826,10], fate:'명배우 탈마가 세상을 떠났습니다. 극장마다 검은 천이 걸렸습니다.'},
  hugo:{name:'빅토르 위고', sex:'남성', born:[1802,2], job:'시인·극작가', death:[1885,5], fate:'빅토르 위고가 세상을 떠났습니다.'},
  stael:{name:'제르멘 드 스탈', sex:'여성', born:[1766,4], job:'작가·살롱 운영자', death:[1817,7], fate:'스탈 부인이 세상을 떠났습니다. 나폴레옹이 가장 두려워한 여인이라는 말이 있었습니다.'},
  gouges:{name:'올랭프 드 구주', sex:'여성', born:[1748,5], job:'극작가', death:[1793,11], fate:'올랭프 드 구주가 단두대에서 처형되었습니다. “여성이 단두대에 오를 권리가 있다면, 연단에 오를 권리도 있다.”'},
  coudray:{name:'앙젤리크 뒤 쿠드레', sex:'여성', born:[1712,1], job:'왕실 산파 교사', death:[1794,4], fate:'뒤 쿠드레 부인이 세상을 떠났습니다. 그녀에게 배운 산파 수천 명이 전국의 마을에 있습니다.'},
  bertin:{name:'로즈 베르탱', sex:'여성', born:[1747,7], job:'왕비의 의상 상인', death:[1813,9], fate:'로즈 베르탱이 세상을 떠났습니다. ‘유행의 장관’이라 불리던 사람이었습니다.'},
  surcouf:{name:'로베르 쉬르쿠프', sex:'남성', born:[1773,12], job:'사략선 선장', death:[1827,7], fate:'생말로의 쉬르쿠프가 세상을 떠났습니다.'},
  monge:{name:'가스파르 몽주', sex:'남성', born:[1746,5], job:'수학자', death:[1818,7], fate:'몽주가 세상을 떠났습니다. 왕정복고 정부는 이공대학 학생들이 장례식에 가는 것을 막았습니다.'}
});
FIGURE_BY_NAME = Object.fromEntries(Object.entries(FIGURES).map(([id, f]) => [f.name, id]));

(() => {
  // Yearly odds that a door opens while its conditions hold; tuned with tools/simulate.mjs so that
  // about a third of lives enter some career and each one stays plausibly rare.
  const CHANCE = {'door-convent':.03, 'door-medicine':.1, 'door-industry':.08, 'door-bureau':.07, 'door-teaching':.03, 'door-theatre':.04,
    'door-salon':.15, 'door-letters':.06, 'door-midwife':.015, 'door-modes':.1, 'door-sea':.12, 'door-engineering':.5, 'door-police':.04};
  const D = (id, priority, when, title, text, choices, extra = {}) => decisions.push({id, domain:'career', priority, title, text, ...extra,
    ...(CHANCE[id] ? {chance:CHANCE[id]} : {}),
    when:{...when, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{...(c.effects || {}), flags:[id]}}))});
  const H = (id, date, when, title, text, choices) => D(id, 30, {...when, fromDate:date, toDate:date}, title, text, choices, {historic:true, domain:'history'});
  const O = (id, title, weight, result, effects = {}, modifiers) => ({id, title, weight, result, effects, ...(modifiers ? {modifiers} : {})});
  const no = (label, result) => ({label, result, effects:{stats:{}}});
  const TOWN = '농촌';

  // The seminary decision now leads into the clergy career.
  const seminary = decisions.find(d => d.id === 'seminary');
  if (seminary) { seminary.when.noCareer = true; seminary.chance = .06; seminary.choices[0].effects.career = 'clergy'; }

  // ---- Doors ----
  D('door-convent', 6, {minAge:15, maxAge:25, sexes:['여성'], religions:['catholic'], excludeYears:[1790, 1801], noCareer:true, unsetFlag:'marriage'},
    '수녀원에 들어갈까?',
    '수녀원 원장이 당신을 눈여겨보았습니다. 수녀원은 기도뿐 아니라 학교와 병원을 꾸리는 곳이기도 합니다. 지참금이 적어도 받아 준다고 합니다.',
    [{label:'수련 수녀가 된다', result:'머리를 가리고 수련복을 입었습니다. 새벽 기도와 아이들 수업으로 하루가 채워집니다.', effects:{career:'convent', flags:['marriage'], literacy:'learning', experience:{religious:3}}},
     no('세속에 남는다', '수녀원 문을 나서며 원장에게 인사했습니다.')]);

  D('door-medicine', 6, {minAge:16, maxAge:24, sexes:['남성'], literacy:['basic'], minKnowledge:52, noCareer:true},
    '외과의의 길',
    '외과의는 오랫동안 이발사와 한 동업조합에 묶여 천대받았지만, 군대와 병원에서는 늘 사람이 모자랍니다. 1794년부터는 국립 보건 학교에서도 의술을 가르칩니다.',
    [{label:'외과 견습생이 된다', result:'해부실과 병원 병동을 오가며 붕대 감는 법부터 배웁니다. 피 냄새에 익숙해지는 데 몇 달이 걸렸습니다.', requires:{minWealth:20}, effects:{career:'medicine', stats:{지식:3}}},
     no('다른 일을 한다', '의술은 다음 생에.')]);

  D('door-industry', 6, {minAge:25, maxAge:50, fromYear:1795, classes:['도시 평민','부르주아'], notPlaceIncludes:TOWN, noCareer:true},
    '작업장을 차릴까?',
    '영국식 방적기와 직기를 들여와 사람을 고용해 돌리는 작업장이 늘고 있습니다. 밑천이 필요하지만 잘되면 큰돈이 됩니다.',
    [{label:'기계를 들여 작업장을 연다', result:'중고 방적기 몇 대와 직공 열 명으로 시작했습니다. 기계가 멈출 때마다 가슴이 철렁합니다.', requires:{minWealth:45}, effects:{career:'industry', stats:{재산:-10}, experience:{commerce:2, craft:1}}},
     no('남의 일을 한다', '위험은 다른 사람에게 맡기기로 했습니다.')]);

  D('door-bureau', 6, {minAge:18, maxAge:35, sexes:['남성'], literacy:['basic'], fromYear:1790, notPlaceIncludes:TOWN, noCareer:true},
    '관청 서기 자리',
    '새로 생긴 데파르트망과 부처마다 서류를 쓸 사람이 필요합니다. 글씨가 반듯하면 일단 들어갈 수 있다고 합니다.',
    [{label:'관청에 들어간다', result:'소매 토시를 끼고 하루 종일 공문을 베껴 씁니다. 월급은 적지만 꼬박꼬박 나옵니다.', effects:{career:'bureau'}},
     no('지금 일을 한다', '서류 더미는 사양했습니다.')]);

  D('door-teaching', 6, {minAge:18, maxAge:35, literacy:['basic'], minKnowledge:48, noCareer:true},
    '학교에서 가르칠까?',
    '마을 학교에 교사가 없습니다. 읽기와 쓰기, 교리 문답과 셈을 가르치면 집안마다 조금씩 수업료를 받습니다. 1833년 이후라면 코뮌이 월급도 줍니다.',
    [{label:'교사가 된다', result:'나무 의자와 석판 몇 개뿐인 교실에서 아이들을 만났습니다. 겨울에는 아이들이 땔감을 한 개씩 들고 옵니다.', effects:{career:'teaching', experience:{educationInterest:2}}},
     no('다른 일을 한다', '아이들 가르치는 일은 맞지 않는다고 생각했습니다.')]);

  D('door-theatre', 6, {minAge:16, maxAge:28, minAptitude:50, notPlaceIncludes:TOWN, noCareer:true},
    '무대에 설까?',
    '마을에 들른 유랑 극단이 단원을 구합니다. 배우는 교회에서 파문당하는 직업이라 부모는 펄쩍 뛰겠지만, 박수 소리는 달콤합니다.',
    [{label:'극단을 따라간다', result:'수레를 타고 이 도시 저 도시를 떠돕니다. 첫 무대에서 대사를 잊었지만 관객은 웃어 주었습니다.', effects:{career:'theatre', closeness:-4, stats:{행복:4}}},
     no('부모 말을 듣는다', '극단 수레가 떠나는 것을 지켜보았습니다.')]);

  D('door-salon', 6, {minAge:22, maxAge:45, sexes:['여성'], classes:['부르주아','귀족'], literacy:['basic'], noCareer:true},
    '살롱을 열까?',
    '일주일에 한 번 집을 열어 작가와 정치가, 학자를 맞는 ‘살롱’은 이 시대 여성이 공적인 세계에 닿는 몇 안 되는 길입니다.',
    [{label:'매주 화요일에 문을 연다', result:'첫 모임에는 손님이 넷뿐이었습니다. 대화가 무르익자 자정이 넘어서야 끝났습니다.', effects:{career:'salon', experience:{social:3}, stats:{재산:-3}}},
     no('조용히 지낸다', '집은 가족만의 공간으로 남겨 두었습니다.')]);

  D('door-letters', 6, {minAge:20, maxAge:50, literacy:['basic'], minKnowledge:62, minAptitude:58, noCareer:true},
    '책을 써 볼까?',
    '서랍에 쌓인 원고를 출판업자에게 보여 줄 수도 있습니다. 대부분은 돌아오지만, 가끔은 세상을 흔드는 책이 나옵니다.',
    [{label:'원고를 보낸다', result:'출판업자는 “나쁘지 않다”고 말했습니다. 자비로 300부를 찍기로 했습니다.', effects:{career:'letters', stats:{재산:-3, 지식:2}}},
     no('원고를 서랍에 둔다', '아직은 때가 아니라고 생각했습니다.')]);

  D('door-midwife', 6, {minAge:18, maxAge:35, sexes:['여성'], noCareer:true},
    '산파가 될까?',
    '마을의 늙은 산파가 뒤를 이을 사람을 찾습니다. 출산은 여자들 사이의 일이고, 산파는 마을에서 가장 신뢰받는 사람 가운데 하나입니다.',
    [{label:'산파를 따라다니며 배운다', result:'한밤중에 불려 나가 물을 끓이고 아기를 받았습니다. 첫 울음소리에 눈물이 났습니다.', effects:{career:'midwife', experience:{responsibility:2, social:2}}},
     no('사양한다', '그 무게를 질 자신이 없었습니다.')]);

  D('door-modes', 6, {minAge:14, maxAge:22, sexes:['여성'], classes:['도시 평민'], notPlaceIncludes:TOWN, noCareer:true},
    '의상실 견습',
    '리본과 레이스, 모자를 파는 의상실에서 견습 재봉사를 구합니다. 손이 빠르고 눈썰미가 좋으면 언젠가 내 가게를 열 수 있습니다.',
    [{label:'견습으로 들어간다', result:'바늘에 손가락을 여러 번 찔렸습니다. 주인은 당신의 리본 매듭이 예쁘다고 했습니다.', effects:{career:'modes', experience:{craft:2}}},
     no('다른 일을 찾는다', '바느질은 집에서만 하기로 했습니다.')]);

  D('door-sea', 6, {minAge:14, maxAge:22, sexes:['남성'], places:['브르타뉴 농촌','보르도','루앙'], noCareer:true},
    '바다로 나갈까?',
    '항구에 상선과 어선이 드나듭니다. 견습 선원으로 올라타면 세상의 끝까지 갈 수 있지만, 돌아오지 못하는 사람도 많습니다.',
    [{label:'배에 오른다', result:'첫 항해에서 내내 뱃멀미를 했습니다. 갑판장이 웃으며 밧줄 매는 법을 가르쳐 주었습니다.', effects:{career:'sea', stats:{건강:-1}, experience:{curiosity:3}}},
     no('육지에 남는다', '파도 소리만 들으며 살기로 했습니다.')]);

  D('door-engineering', 7, {minAge:17, maxAge:21, sexes:['남성'], fromYear:1795, minAptitude:70, minKnowledge:65, literacy:['basic'], noCareer:true},
    '이공대학 입학시험',
    '몽주가 세운 이공대학이 시험만으로 학생을 뽑습니다. 출신은 묻지 않고, 합격하면 학비도 나라가 냅니다. 졸업생은 토목, 광산, 포병으로 갑니다.',
    [{label:'시험을 본다', preview:'합격 / 낙방', outcomes:[
        O('pass', '합격했습니다', 55, '군복 같은 교복을 입고 몽주의 화법기하학 강의를 들었습니다. 졸업 뒤 토목국에 배치되었습니다.', {career:'engineering', figure:'monge', education:'이공대학', rep:6}, [{when:{minAptitude:85}, amount:25}]),
        O('fail', '낙방했습니다', 45, '이듬해 다시 보기로 했습니다. 수학책을 다시 펼쳤습니다.', {stats:{행복:-3}})]},
     no('시험을 보지 않는다', '다른 길을 가기로 했습니다.')]);

  D('door-police', 6, {minAge:22, maxAge:40, sexes:['남성'], fromYear:1800, literacy:['basic','learning'], notPlaceIncludes:TOWN, noCareer:true},
    '경찰 순경 자리',
    '제1통령 아래 새로 짜인 경찰이 사람을 뽑습니다. 정보원을 부리고 술집과 하숙집을 살피는 일입니다.',
    [{label:'순경이 된다', result:'파란 제복을 받았습니다. 동네 사람들은 이제 당신 앞에서 말을 아낍니다.', effects:{career:'police', closeness:-3}},
     no('사양한다', '이웃을 감시하는 일은 내키지 않았습니다.')]);

  // ---- Clergy ----
  const CLERGY = '신학생|신부|참사회원|주교';
  H('clergy-oath', [1791,1], {jobMatch:CLERGY},
    '성직자 시민 헌장 선서',
    '모든 본당 신부는 국가와 헌법에 충성을 맹세해야 합니다. 교황은 아직 침묵하고 있지만, 맹세하면 로마와 갈라선다는 말이 돕니다.',
    [{label:'선서한다(입헌 신부)', result:'제단 앞에서 선서했습니다. 그레구아르 신부처럼 혁명과 신앙이 함께 갈 수 있다고 믿습니다. 신자 절반은 미사에 오지 않게 되었습니다.', effects:{figure:'gregoire', path:{politics:'constitutional'}, closeness:-3}},
     {label:'거부한다(선서 거부 신부)', result:'선서를 거부했습니다. 본당에서 쫓겨났지만 많은 신자가 몰래 당신을 찾아옵니다.', effects:{path:{politics:'refractory'}, experience:{religious:3}, rep:4}}]);
  H('september-1792', [1792,9], {jobMatch:CLERGY, pathIs:{politics:'refractory'}},
    '추방령과 9월',
    '선서 거부 신부에게 국외 추방령이 내렸습니다. 파리에서는 감옥의 신부들이 학살되었다는 소식이 들립니다.',
    [{label:'영국으로 망명한다', result:'르아브르에서 배를 타고 영국으로 건너갔습니다. 정교 협약이 맺어지기 전까지는 돌아갈 수 없습니다.', effects:{stats:{행복:-8, 재산:-5}, rep:2, emigrate:'런던'}},
     {label:'남아서 숨어 지내며 미사를 드린다', preview:'숨어 지냄 / 붙잡힘', outcomes:[
        O('hidden', '신자들이 숨겨 주었습니다', 70, '헛간과 다락을 옮겨 다니며 몰래 세례와 장례를 집전했습니다.', {rep:8, experience:{religious:3}, stats:{건강:-4}}),
        O('caught', '붙잡혔습니다', 30, '로슈포르 앞바다의 감옥선에 갇혔습니다. 살아 돌아온 사람은 절반도 되지 않았습니다.', {doom:'선서 거부 신부로 붙잡혀 감옥선에서 숨을 거두었습니다.'})]}]);
  H('concordat-priest', [1802,4], {jobMatch:CLERGY},
    '정교 협약',
    '나폴레옹과 교황의 협약으로 성당이 다시 문을 엽니다. 입헌 신부와 선서 거부 신부가 한 교구에서 다시 만납니다.',
    [{label:'본당으로 돌아간다', result:'부활절 미사에서 종이 다시 울렸습니다. 오래 기다린 신자들이 성당을 가득 채웠습니다.', effects:{rep:6, stats:{행복:6}}}]);
  H('convents-closed', [1792,8], {jobMatch:'수녀'},
    '수녀원 폐쇄',
    '의회가 남은 수도원과 수녀원을 모두 닫았습니다. 수녀들은 집으로 돌아가거나 평신도 옷을 입어야 합니다.',
    [{label:'가족에게 돌아간다', result:'수녀복을 벗고 고향으로 돌아갔습니다. 아이들에게 몰래 글과 교리를 가르칩니다.', effects:{careerEnd:true, job:'없음', stats:{행복:-6}}},
     {label:'자매들과 몰래 공동생활을 이어 간다', preview:'버팀 / 투옥', outcomes:[
        O('kept', '몇 해를 버텼습니다', 70, '평신도 옷을 입고 작은 집에서 함께 살며 병자를 돌봤습니다.', {rep:6, experience:{religious:3}}),
        O('jailed', '투옥되었습니다', 30, '혐의자로 몇 달을 갇혔다가 테르미도르 뒤 풀려났습니다.', {stats:{건강:-8, 행복:-6}})]}]);

  // ---- Medicine ----
  const MED = '외과|의사';
  H('larrey', [1797,3], {jobMatch:MED},
    '‘날아다니는 구급차’',
    '이탈리아 원정군의 군의관 라레가 전장 한복판까지 달려가 부상병을 실어 오는 가벼운 마차를 운영합니다. 외과의를 구합니다.',
    [{label:'군의관으로 지원한다', preview:'명성 / 전장의 위험', outcomes:[
        O('honor', '수백 명을 살렸습니다', 85, '계급을 가리지 않고 가장 위급한 부상병부터 수술했습니다. 라레가 당신의 손을 칭찬했습니다.', {figure:'larrey', rep:10, promote:true, stats:{건강:-3}}),
        O('hurt', '포탄 파편에 다쳤습니다', 15, '부상병을 옮기다 다쳤습니다.', {figure:'larrey', stats:{건강:-12}})]},
     no('도시 병원에 남는다', '병원 병동을 지켰습니다.')]);
  H('pinel', [1795,5], {jobMatch:MED, places:['파리']},
    '쇠사슬을 푼 의사',
    '살페트리에르 병원의 피넬이 정신병자들의 쇠사슬을 풀고 ‘도덕 치료’를 하겠다고 합니다. 동료들은 미친 짓이라고 합니다.',
    [{label:'피넬의 병동에서 일한다', result:'환자들과 대화하고 기록을 남기는 새로운 의술을 배웠습니다.', effects:{figure:'pinel', rep:6, stats:{지식:3}}},
     no('다른 병원에 남는다', '전통적인 방법을 지켰습니다.')]);
  H('cholera-doctor', [1832,4], {jobMatch:MED},
    '콜레라와 의사',
    '콜레라 환자가 병원에 넘쳐 납니다. 의사들도 쓰러지고 있습니다. 원인도, 치료법도 모릅니다.',
    [{label:'병원에 남아 환자를 돌본다', preview:'명성 / 감염', outcomes:[
        O('held', '끝까지 버텼습니다', 80, '몇 주 동안 거의 잠을 자지 못했습니다. 시청이 의사들에게 훈장을 주었습니다.', {rep:12, stats:{건강:-6}}),
        O('sick', '콜레라에 걸렸습니다', 20, '가까스로 살아났습니다.', {stats:{건강:-16}, rep:6})]},
     {label:'가족과 시골로 피한다', result:'살아남았지만 동료들의 눈길이 차가웠습니다.', effects:{rep:-10}}]);

  // ---- Industry, bureau, police ----
  H('jacquard-loom', [1805,4], {places:['리옹'], jobMatch:'작업장|공장|산업|직물|방적|견직'},
    '자카르 직기',
    '황제가 리옹을 방문해 자카르의 새 직기를 보았습니다. 구멍 뚫린 카드로 무늬를 짜는 기계라 직공 한 명이 하던 일을 혼자 해냅니다. 직공들은 기계를 부수겠다고 위협합니다.',
    [{label:'새 직기를 들여놓는다', result:'생산량이 두 배가 되었습니다. 일자리를 잃은 직공들이 작업장 앞을 서성입니다.', effects:{figure:'jacquard', stats:{재산:6}, rep:4, experience:{inequality:1}}},
     {label:'예전 방식을 지킨다', result:'직공들과의 의리를 지켰지만 경쟁에서 뒤처지기 시작했습니다.', effects:{stats:{재산:-3}, closeness:3}}]);
  H('prefecture-1800', [1800,3], {jobMatch:'관청|사무관|국장'},
    '도청의 탄생',
    '데파르트망마다 파리에서 임명한 도지사가 부임합니다. 지방 관청이 하나의 사다리로 묶였습니다.',
    [{label:'도청 사무국으로 옮긴다', result:'새 도지사 밑에서 징병, 세금, 통계 업무를 맡았습니다.', effects:{rep:5, promote:true}},
     no('지금 자리에 남는다', '조용한 자리를 지켰습니다.')]);
  H('infernal-machine', [1800,12], {jobMatch:'순경|경찰'},
    '‘지옥의 기계’',
    '12월 24일, 오페라로 가던 제1통령의 마차 뒤에서 화약통이 터졌습니다. 푸셰 장관은 범인이 왕당파라고 확신합니다.',
    [{label:'수사에 매달린다', result:'폭발한 수레의 말 편자를 단서로 대장장이를 찾아냈습니다. 푸셰가 당신의 이름을 물었습니다.', effects:{figure:'fouche', rep:10, promote:true}},
     no('윗선의 지시만 따른다', '자코뱅 혐의자 명단 작성을 도왔습니다.')]);

  // ---- Teaching, theatre, letters, salon ----
  H('guizot-teacher', [1833,6], {jobMatch:'교사'},
    '기조 법과 교사',
    '모든 코뮌에 학교를 두고 교사에게 최소 연봉을 주는 법이 통과되었습니다. 도마다 사범학교도 생깁니다.',
    [{label:'사범학교 과정을 밟는다', result:'몇 달 동안 새 교수법을 배우고 정식 교사 자격을 받았습니다.', effects:{rep:6, promote:true, stats:{지식:3}}},
     no('지금처럼 가르친다', '교실은 그대로입니다.')]);
  H('talma', [1791,4], {jobMatch:'배우', places:['파리']},
    '코메디프랑세즈의 분열',
    '혁명극 「샤를 9세」를 두고 국립 극장 배우들이 갈라섰습니다. 젊은 탈마가 동료들과 리슐리외 거리의 새 극장으로 옮깁니다.',
    [{label:'탈마를 따라간다', result:'토가를 입고 무대에 서는 탈마의 연기는 진짜 로마인 같았습니다.', effects:{figure:'talma', rep:8, promote:true}},
     no('옛 극단에 남는다', '전통을 지켰습니다.')]);
  H('gouges', [1791,9], {places:['파리'], jobMatch:'작가|살롱|기자|팸플릿|배우'},
    '「여성과 여성 시민의 권리 선언」',
    '극작가 올랭프 드 구주가 인권 선언을 고쳐 쓴 팸플릿을 냈습니다. “여성은 자유롭게 태어나며 권리에서 남성과 평등하다.”',
    [{label:'그녀를 찾아가 함께한다', result:'구주는 왕비에게 바친 그 선언문을 거리에서도 팔자고 했습니다. 당신은 원고 정리를 도왔습니다.', effects:{figure:'gouges', rep:6, experience:{inequality:3}}},
     no('읽기만 한다', '대담한 글이라고 생각했습니다.')]);
  H('hernani', [1830,2], {places:['파리'], jobMatch:'작가|배우|화가|기자|발행인'},
    '「에르나니」 전투',
    '코메디프랑세즈에서 빅토르 위고의 「에르나니」가 초연됩니다. 붉은 조끼를 입은 젊은 낭만파들과 고전파 관객이 객석에서 맞붙습니다.',
    [{label:'낭만파 쪽에 앉아 박수를 친다', result:'첫 대사부터 야유와 환호가 뒤섞였습니다. 공연이 끝나자 위고와 악수를 나눴습니다.', effects:{figure:'hugo', rep:6, stats:{행복:5}}},
     no('고전파 편에 선다', '운율을 깨는 대사가 거슬렸습니다.')]);
  H('stael-salon', [1797,1], {places:['파리'], jobMatch:'살롱|작가|의원|행정관|기자|발행인'},
    '스탈 부인의 살롱',
    '바크 거리의 스웨덴 대사관에서 스탈 부인이 정치가와 작가를 맞습니다. 그녀는 대화로 정부를 움직인다는 말을 듣습니다.',
    [{label:'살롱에 드나든다', result:'스탈 부인은 쉬지 않고 말했고, 모두가 귀를 기울였습니다. 젊은 장군 보나파르트를 두고 날 선 농담도 오갔습니다.', effects:{figure:'stael', rep:6, experience:{social:2}}},
     no('사양한다', '정치에 휘말리고 싶지 않았습니다.')]);

  // ---- Midwife, fashion, sea, engineering ----
  H('coudray', [1778,5], {jobMatch:'산파'},
    '왕실 산파 교사',
    '왕의 명을 받은 뒤 쿠드레 부인이 근처 도시에서 두 달 동안 강습을 엽니다. 천과 가죽으로 만든 실물 크기 출산 모형으로 가르친다고 합니다.',
    [{label:'강습에 참가한다', result:'모형으로 거꾸로 선 아기를 돌리는 법을 배웠습니다. 마을에 돌아와 처음 그 방법으로 아기를 살렸습니다.', effects:{figure:'coudray', rep:8, promote:true, stats:{지식:3}}},
     no('경험으로 충분하다', '어머니에게 배운 대로 하기로 했습니다.')]);
  H('bertin', [1785,3], {places:['파리'], jobMatch:'재봉사|장신구|의상실'},
    '유행의 장관',
    '왕비의 의상 상인 로즈 베르탱의 가게 ‘르 그랑 모골’이 솜씨 좋은 재봉사를 찾습니다.',
    [{label:'베르탱의 가게로 옮긴다', result:'왕비의 드레스에 다는 리본을 꿰맸습니다. 베르탱은 까다롭지만 실력은 알아봅니다.', effects:{figure:'bertin', rep:8, stats:{재산:2}}},
     no('지금 가게에 남는다', '의리를 지켰습니다.')]);
  H('trafalgar', [1805,10], {jobMatch:'선원|항해사|선장'},
    '트라팔가르',
    '카디스 앞바다에서 프랑스·스페인 연합 함대가 넬슨의 영국 함대와 맞섭니다. 해군에 징발된 당신의 배도 전열에 섰습니다.',
    [{label:'끝까지 포를 쏜다', preview:'생환 / 포로 / 전사', outcomes:[
        O('home', '살아 돌아왔습니다', 45, '함대 절반 이상을 잃었습니다. 부서진 배를 끌고 카디스로 돌아왔습니다.', {stats:{건강:-6, 행복:-8}, milestone:'트라팔가르 해전'}),
        O('prisoner', '영국군의 포로가 되었습니다', 40, '잉글랜드의 감옥선에서 몇 해를 보냈습니다.', {stats:{건강:-10, 행복:-10, 재산:-5}}),
        O('killed', '바다에 잠겼습니다', 15, '폭풍과 포화 속에 배가 가라앉았습니다.', {doom:'1805년 트라팔가르 해전에서 전사했습니다.'})]}]);
  H('surcouf', [1800,10], {jobMatch:'선원|항해사|선장', places:['브르타뉴 농촌']},
    '생말로의 사략선',
    '생말로의 젊은 선장 쉬르쿠프가 인도양에서 영국 동인도회사 배 ‘켄트’호를 나포했다는 소식이 들립니다. 다음 항해에 사람을 모읍니다.',
    [{label:'사략선에 오른다', preview:'큰 몫 / 나포됨', outcomes:[
        O('prize', '큰 몫을 받았습니다', 65, '나포한 배의 화물을 나눈 몫으로 집 한 채 값을 벌었습니다.', {figure:'surcouf', stats:{재산:12}, rep:6}),
        O('caught', '영국 군함에 잡혔습니다', 35, '포로가 되었다가 교환되어 돌아왔습니다.', {figure:'surcouf', stats:{건강:-8, 행복:-6}})]},
     no('상선에 남는다', '안전한 항로를 택했습니다.')]);
  H('railway-engineer', [1842,6], {jobMatch:'측량사|토목 기사|수석 기사'},
    '철도법',
    '파리를 중심으로 일곱 갈래 철도를 놓는 법이 통과되었습니다. 토목국 기사들이 노선 측량에 나섭니다.',
    [{label:'노선 설계를 맡는다', result:'터널과 고가교를 설계했습니다. 몇 해 뒤 첫 기차가 당신이 그린 다리를 건넜습니다.', effects:{rep:10, promote:true, stats:{재산:3}}},
     no('도로와 운하를 맡는다', '익숙한 일을 이어 갑니다.')]);
})();
