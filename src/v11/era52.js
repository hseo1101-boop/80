// src/data/era-1848-1914.js — 제2공화국, 제2제정, 제3공화국
// History, "역사의 현장" scenes, major decisions and everyday events for 1848–1914, fitted to what
// each place lived through: Haussmann's Paris and the Commune, Lyon's silk and its 1869 ovalistes,
// Rouen's cotton famine, phylloxera in Burgundy and around Bordeaux, the railway reaching Brittany and
// Auvergne, Gambetta landing at Tours, the Breton mobiles in the mud of Conlie, the school war of the
// Ferry laws, the church inventories of 1906 and the mobilisation of August 1914.
historicalEvents.push(
  {id:'falloux-1850', year:1850, month:3, text:'팔루 법으로 교회의 교육 참여가 넓어집니다. 사제와 수녀가 교사 자격 없이도 가르칠 수 있습니다.'},
  {id:'suffrage-1850', year:1850, month:5, text:'새 선거법으로 거주 요건이 생겨 떠돌며 일하는 노동자 약 300만 명이 선거권을 잃습니다.', impacts:[{when:{classes:['도시 평민'], sexes:['남성'], minAge:21}, stats:{행복:-2}, text:'작업장 동료 절반이 투표 명부에서 빠졌습니다.'}]},
  {id:'empire-1852', year:1852, month:12, text:'국민투표를 거쳐 제2제정이 선포되고, 루이 나폴레옹이 황제 나폴레옹 3세가 됩니다.'},
  {id:'haussmann-1853', year:1853, month:6, text:'오스만이 센 도지사가 되어 파리 대개조를 시작합니다. 좁은 골목이 헐리고 넓은 대로가 뚫립니다.', impacts:[{when:{places:['파리']}, stats:{지식:1}, text:'동네 곳곳에 철거 표시가 붙었습니다.'}]},
  {id:'crimea-1854', year:1854, month:3, text:'프랑스가 영국과 함께 러시아에 선전포고하고 크림 전쟁에 뛰어듭니다.'},
  {id:'cholera-1854', year:1854, month:7, text:'콜레라가 다시 퍼져 전국에서 14만 명 넘게 목숨을 잃습니다.', impacts:[{stats:{건강:-2}, text:'장례 종소리가 잦습니다.'}]},
  {id:'expo-1855', year:1855, month:5, text:'파리에서 첫 만국 박람회가 열립니다. 보르도 포도주 등급이 이때 정해집니다.', impacts:[{when:{places:['보르도']}, stats:{재산:1}, text:'메도크 포도원의 등급 소식에 상인들이 들떴습니다.'}]},
  {id:'floods-1856', year:1856, month:6, text:'론강과 루아르강이 크게 넘쳐 리옹과 투르 일대가 물에 잠깁니다.', impacts:[{when:{places:['리옹', '투르']}, stats:{재산:-4, 건강:-1}, text:'아래층이 물에 잠겼습니다.'}]},
  {id:'lourdes-1858', year:1858, month:2, text:'피레네의 루르드에서 소녀 베르나데트가 성모 발현을 보았다고 증언합니다. 순례 열풍이 시작됩니다.'},
  {id:'solferino-1859', year:1859, month:6, text:'이탈리아 통일 전쟁에서 프랑스군이 솔페리노에서 오스트리아군을 이깁니다. 참상을 본 앙리 뒤낭이 훗날 적십자를 세웁니다.'},
  {id:'cobden-1860', year:1860, month:1, text:'영국과 자유무역 조약을 맺습니다. 값싼 영국 면직물이 들어옵니다.', impacts:[{when:{places:['루앙']}, stats:{재산:-2}, text:'면직 공장 주인들이 임금을 깎겠다고 합니다.'}]},
  {id:'cotton-famine', year:1862, month:10, text:'미국 남북 전쟁으로 면화가 끊겨 노르망디의 면직 공장들이 멈춥니다.', impacts:[{when:{places:['루앙']}, stats:{재산:-5, 행복:-3}, text:'루앙 일대에서 수만 명이 일자리를 잃었습니다.'}]},
  {id:'petit-journal', year:1863, month:2, text:'한 부에 1수짜리 신문 「르 프티 주르날」이 창간됩니다. 신문이 노동자의 식탁에 오르기 시작합니다.'},
  {id:'strike-law', year:1864, month:5, text:'파업이 더는 범죄가 아니게 됩니다(올리비에 법).'},
  {id:'expo-1867', year:1867, month:4, text:'두 번째 파리 만국 박람회. 일본 공예품이 처음 소개되고 알루미늄과 석유가 구경거리가 됩니다.'},
  {id:'duruy-1867', year:1867, month:4, text:'뒤뤼이 법으로 주민 500명 이상인 모든 코뮌에 여자 초등학교를 세우게 됩니다.', impacts:[{when:{sexes:['여성'], maxAge:12}, stats:{지식:1}, text:'마을에 여학교 이야기가 나왔습니다.'}]},
  {id:'phylloxera-bordeaux', year:1869, month:7, text:'포도나무 뿌리를 갉아 먹는 진딧물 필록세라가 보르도 포도원에서 발견됩니다.', impacts:[{when:{places:['보르도']}, stats:{행복:-2}, text:'포도원마다 잎이 누렇게 시들어 갑니다.'}]},
  {id:'plebiscite-1870', year:1870, month:5, text:'자유주의 제정 헌법이 국민투표에서 압도적으로 승인됩니다. 제정은 굳건해 보입니다.'},
  {id:'war-1870', year:1870, month:7, text:'엠스 전보 사건 끝에 프랑스가 프로이센에 선전포고합니다.'},
  {id:'sedan-1870', year:1870, month:9, text:'스당에서 황제가 10만 병사와 함께 항복합니다. 9월 4일 파리 시청에서 공화국이 선포됩니다.'},
  {id:'siege-1870', year:1870, month:9, text:'프로이센군이 파리를 에워쌉니다. 넉 달 넘는 포위가 시작됩니다.', impacts:[{when:{places:['파리']}, stats:{행복:-3}, text:'성문이 닫히고 우편은 기구로만 나갑니다.'}]},
  {id:'armistice-1871', year:1871, month:1, text:'파리가 항복하고 휴전이 맺어집니다. 독일 제국이 베르사유 궁 거울의 방에서 선포됩니다.'},
  {id:'frankfurt-1871', year:1871, month:5, text:'프랑크푸르트 조약으로 알자스와 로렌 일부를 잃고 50억 프랑을 배상하게 됩니다.'},
  {id:'commune-1871', year:1871, month:3, text:'3월 18일 파리 민중이 정부군의 대포 회수를 막고, 파리 코뮌이 선포됩니다.'},
  {id:'bloody-week', year:1871, month:5, text:'‘피의 일주일’. 베르사유 정부군이 파리에 들어와 코뮌을 짓밟고 수천 명을 처형합니다.', impacts:[{when:{places:['파리'], classes:['도시 평민']}, stats:{행복:-6}, text:'골목마다 총살 소리가 났습니다.'}]},
  {id:'mac-mahon', year:1873, month:5, text:'왕당파가 다수인 의회가 마크마옹 원수를 대통령으로 뽑습니다. 왕정 복고를 기다리는 ‘도덕 질서’의 시대입니다.'},
  {id:'constitution-1875', year:1875, month:1, text:'한 표 차이로 통과된 발롱 수정안으로 ‘공화국 대통령’이 헌법에 들어갑니다. 제3공화국이 굳어집니다.'},
  {id:'phylloxera-burgundy', year:1878, month:8, text:'필록세라가 부르고뉴의 포도원에 닿습니다.', impacts:[{when:{places:['부르고뉴 농촌']}, stats:{재산:-4, 행복:-3}, text:'코트도르의 포도나무가 말라 갑니다.'}]},
  {id:'quatorze-1880', year:1880, month:7, text:'7월 14일이 국경일로 정해져 처음으로 전국에서 축제가 열립니다. 같은 달 코뮌 가담자들에게 대사면이 내려집니다.'},
  {id:'ferry-1882', year:1882, month:3, text:'쥘 페리 법으로 6~13세 초등교육이 무상·의무·세속이 됩니다. 교실에서 십자가가 내려집니다.', impacts:[{when:{maxAge:13, minAge:6}, stats:{지식:2}, text:'학교에 가야 합니다. 이제 법입니다.'}]},
  {id:'unions-1884', year:1884, month:3, text:'발데크루소 법으로 노동조합이 합법이 됩니다. 같은 해 나케 법으로 이혼이 다시 허용됩니다.'},
  {id:'hugo-1885', year:1885, month:6, text:'빅토르 위고의 국장. 200만 명이 개선문에서 팡테옹까지 장례 행렬을 따릅니다.'},
  {id:'expo-1889', year:1889, month:5, text:'혁명 100주년 만국 박람회. 에펠탑이 세워집니다.'},
  {id:'boulanger-1889', year:1889, month:1, text:'불랑제 장군이 파리 보궐 선거에서 압승하지만 쿠데타를 망설이다 벨기에로 달아납니다.'},
  {id:'fourmies-1891', year:1891, month:5, text:'노동절 집회에 군대가 발포해 푸르미에서 아이와 젊은이 9명이 죽습니다.'},
  {id:'panama-1892', year:1892, month:11, text:'파나마 운하 회사의 파산과 의원 매수 추문이 터집니다. 작은 저축가 수십만 명이 돈을 잃습니다.', impacts:[{when:{minWealth:50}, stats:{재산:-3}, text:'파나마 주식이 휴지가 되었습니다.'}]},
  {id:'carnot-1894', year:1894, month:6, text:'리옹을 방문한 사디 카르노 대통령이 이탈리아인 무정부주의자의 칼에 찔려 숨집니다.'},
  {id:'dreyfus-1894', year:1894, month:12, text:'유대인 포병 대위 드레퓌스가 간첩 혐의로 종신 유형을 선고받습니다.'},
  {id:'cinema-1895', year:1895, month:12, text:'리옹 출신 뤼미에르 형제가 파리의 한 카페 지하에서 처음으로 돈을 받고 영화를 상영합니다.'},
  {id:'jaccuse-1898', year:1898, month:1, text:'에밀 졸라가 「나는 고발한다」를 발표합니다. 프랑스가 드레퓌스파와 반드레퓌스파로 갈라집니다.'},
  {id:'expo-1900', year:1900, month:4, text:'파리 만국 박람회와 함께 지하철 1호선이 개통됩니다.'},
  {id:'tour-1903', year:1903, month:7, text:'첫 투르 드 프랑스 자전거 경주가 열립니다.'},
  {id:'separation-1905', year:1905, month:12, text:'교회와 국가의 분리법이 통과됩니다. 국가는 더 이상 사제에게 봉급을 주지 않습니다.'},
  {id:'inventories-1906', year:1906, month:2, text:'교회 재산 목록 조사에 맞서 신자들이 성당 문을 걸어 잠급니다.'},
  {id:'jaures-1914', year:1914, month:7, text:'평화를 외치던 사회주의자 장 조레스가 파리의 카페에서 암살됩니다.'},
  {id:'mobilization-1914', year:1914, month:8, text:'총동원령. 독일과의 전쟁이 시작됩니다.'}
);

(() => {
  const H = (id, date, when, title, text, choices, until) => decisions.push({id, domain:'history', priority:30, historic:true, title, text,
    when:{...when, fromDate:date, toDate:until || date, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id]}}))});
  const D = (id, domain, when, title, text, choices, chance) => decisions.push({id, domain, priority:22, title, text, ...(chance ? {chance} : {}),
    when:{...when, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id]}}))});
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});
  const stay = result => ({label:'집에 머문다', result, effects:{stats:{}}});
  const B = (key, kind, fate, memo, job) => ({key, kind, fate, memo, job});
  const MEN21 = {minAge:21, sexes:['남성']};

  // ───────── 제2공화국의 끝 ─────────
  H('plebiscite-1851', [1851,12], {...MEN21}, '쿠데타를 승인합니까?',
    '12월 20일, 루이 나폴레옹은 자신의 쿠데타를 국민투표에 부쳤습니다. 투표소 앞에는 헌병이 서 있고, ‘예’ 투표지가 미리 인쇄되어 있습니다.',
    [{label:'‘예’를 넣는다', result:'질서가 돌아온다는 말을 믿었습니다. 전국 92%가 ‘예’였습니다.', effects:{path:{politics:'private'}}},
     {label:'‘아니오’를 넣는다', result:'‘아니오’ 투표지를 직접 써서 넣었습니다. 시장이 당신 이름을 적어 두었다는 소문이 돌았습니다.', effects:{stats:{행복:1}, path:{politics:'engaged'}}},
     {label:'기권한다', result:'투표소에 가지 않았습니다.', effects:{}}], [1852,1]);
  H('mixed-commissions', [1852,2], {minAge:18, maxAge:70, politicsIn:['engaged', 'mountain']}, '혼합 위원회',
    '도지사와 장군, 검사로 이루어진 혼합 위원회가 쿠데타에 맞선 공화파를 재판 없이 처분하고 있습니다. 알제리 유형, 카옌 유형, 국외 추방. 당신 이름이 명부에 있다는 말이 들립니다.',
    [{label:'벨기에로 망명한다', result:'브뤼셀의 망명객들 틈에서 몇 해를 보냈습니다. 1859년 대사면 때 돌아왔습니다.', effects:{stats:{재산:-10, 행복:-6}, milestone:'1852년 망명'}},
     {label:'숨어 지낸다', preview:'무사함 / 알제리 유형', outcomes:[
       O('hid', '숨어서 버텼습니다', 65, '친척 집 다락에서 반년을 보냈습니다. 위원회는 다른 이름들로 바빴습니다.', {stats:{재산:-4, 행복:-4}}),
       O('algeria', '알제리로 보내졌습니다', 35, '체포되어 알제리의 유형지로 보내졌습니다. 2년 뒤 감형되어 돌아왔지만 몸이 상했습니다.', {stats:{건강:-12, 재산:-8, 행복:-8}, milestone:'알제리 유형'})]},
     {label:'출두해 충성 서약서에 서명한다', result:'다시는 정치에 나서지 않겠다는 서약서에 서명했습니다. 풀려났지만, 그날 밤 잠들지 못했습니다.', effects:{stats:{행복:-6}, path:{politics:'private'}}}]);

  // ───────── 제2제정 ─────────
  D('haussmann-demolition', 'housing', {minAge:20, places:['파리'], fromYear:1853, toYear:1869}, '철거 통지',
    '당신이 사는 골목에 오스만의 새 대로가 뚫린다는 통지가 붙었습니다. 집주인은 보상금을 받고, 세입자는 석 달 안에 나가야 합니다. 새 건물의 집세는 두 배가 넘는다고 합니다.',
    [{label:'성벽 밖 벨빌로 옮긴다', result:'언덕 위 벨빌의 싼 셋방으로 짐을 옮겼습니다. 일터까지 한 시간을 걸어 다닙니다. 동쪽 변두리에 노동자들이 모여 살기 시작했습니다.', effects:{stats:{재산:1, 행복:-3}, experience:{inequality:2}, milestone:'오스만 공사로 벨빌로 이주'}},
     {label:'새 건물 꼭대기 하녀 방에 든다', result:'대로변 새 건물 6층 하녀 방에 들었습니다. 아래층에는 부르주아가, 꼭대기에는 가난한 사람이 삽니다.', effects:{stats:{재산:-4, 행복:1}}},
     {label:'(집주인이라면) 보상금으로 새 건물에 투자한다', requires:{minWealth:55}, result:'수용 보상금으로 대로변 땅을 샀습니다. 몇 해 뒤 땅값이 세 배가 되었습니다.', effects:{stats:{재산:12}, experience:{commerce:2}}}], .5);
  D('haussmann-landlord', 'economy', {minAge:25, places:['파리'], fromYear:1855, toYear:1868, minWealth:50}, '오른 집세',
    '대로가 뚫리자 당신 건물의 집세를 두 배로 올려도 들어올 사람이 줄을 섰습니다. 오래된 세입자인 조각공 가족은 그 돈을 낼 수 없습니다.',
    [{label:'집세를 올리고 내보낸다', result:'새 세입자가 들어왔습니다. 쫓겨난 조각공은 벨빌로 갔다고 합니다.', effects:{stats:{재산:6}, bond:B('landlord', 'grudge', 'communard', '집세를 두 배로 올려 내쫓은', '조각공')}},
     {label:'옛 집세로 남게 한다', result:'손해를 보았지만 조각공 가족은 남았습니다. 아이들이 계단에서 당신에게 인사합니다.', effects:{stats:{재산:-2, 행복:2}, bond:B('landlord', 'favor', 'communard', '옛 집세로 남게 해 준', '조각공')}}], .35);
  H('expo-1855-visit', [1855,6], {minAge:8, places:['파리']}, '산업궁',
    '샹젤리제의 거대한 유리 건물 산업궁에서 만국 박람회가 열렸습니다. 증기 기관, 재봉틀, 알루미늄 그릇, 그리고 전 세계의 물건이 있습니다.',
    [{label:'구경 간다', result:'하루 종일 걸어도 다 볼 수 없었습니다. 재봉틀이 혼자 바느질하는 것을 한참 들여다보았습니다.', effects:{stats:{행복:4, 지식:2}, experience:{curiosity:3}}}, stay('입장료가 아까웠습니다.')]);
  H('sevastopol', [1855,9], {minAge:18, maxAge:45, jobMatch:'^(군인|육군)'}, '말라코프 보루',
    '세바스토폴 포위 열한 달째. 9월 8일 정오, 마크마옹의 병사들이 말라코프 보루로 돌격합니다. “나 여기 있다, 여기 머문다!”',
    [{label:'돌격 대열에 선다', preview:'함락 / 부상 / 전사', outcomes:[
       O('won', '보루를 점령했습니다', 70, '삼색기가 보루 위에 올랐습니다. 사흘 뒤 러시아군이 세바스토폴을 버렸습니다.', {stats:{행복:5, 건강:-4}, rep:4, milestone:'세바스토폴 말라코프 공격'}),
       O('hurt', '다쳤습니다', 22, '파편에 맞아 야전 병원으로 실려 갔습니다. 병원에는 총상보다 콜레라 환자가 더 많았습니다.', {stats:{건강:-15}}),
       O('died', '돌아오지 못했습니다', 8, '보루 앞 도랑에서 쓰러졌습니다.', {doom:'1855년 9월, 크림 전쟁 세바스토폴 공방전에서 전사했습니다.'})]}]);
  H('solferino', [1859,6], {minAge:18, maxAge:45, jobMatch:'^(군인|육군)'}, '솔페리노',
    '6월 24일, 이탈리아 북부의 솔페리노. 하루 동안 30만 명이 맞붙습니다. 무더위 속 열다섯 시간의 전투입니다.',
    [{label:'끝까지 싸운다', preview:'승리 / 부상', outcomes:[
       O('won', '이겼습니다', 75, '저녁 폭풍우 속에 오스트리아군이 물러났습니다. 들판에 부상자 수만 명이 남았습니다. 카스틸리오네 마을의 여자들이 적군 아군 가리지 않고 물을 먹였습니다.', {stats:{행복:3, 건강:-3}, milestone:'솔페리노 전투'}),
       O('hurt', '다쳤습니다', 25, '사흘 동안 성당 바닥에 누워 있었습니다. 스위스 사람 하나가 붕대를 감아 주었습니다. 앙리 뒤낭이라는 이름이었습니다.', {stats:{건강:-14}})]}]);
  const RAIL = (id, date, place, text) => H(id, date, {minAge:10, places:[place]}, '기차가 온다', text,
    [{label:'첫 기차를 보러 역에 간다', result:'검은 연기와 기적 소리. 아이들은 소리를 지르며 달아났다가 다시 몰려왔습니다. 파리까지 하루 만에 간다고 합니다.', effects:{stats:{행복:3}, experience:{curiosity:2}}},
     {label:'자식을 파리로 보낼 생각을 한다', result:'기차가 생기자 마을 젊은이들이 하나둘 도시로 떠나기 시작했습니다. 당신 집도 예외가 아닐 것입니다.', effects:{stats:{행복:-1}, experience:{curiosity:1}}},
     stay('밭일이 바빴습니다. 기차는 기다려 주지 않았습니다.')]);
  RAIL('railway-burgundy', [1851,6], '부르고뉴 농촌', '파리–디종 철도가 개통되었습니다. 부르고뉴 포도주가 이제 하루 만에 파리 술집에 닿습니다.');
  RAIL('railway-bordeaux', [1853,9], '보르도', '파리–보르도 철도가 완공되었습니다. 생장 역에 첫 기차가 들어옵니다.');
  RAIL('railway-lyon', [1854,8], '리옹', '파리–리옹 철도가 이어졌습니다. 페라슈 역에서 파리까지 열두 시간입니다.');
  RAIL('railway-auvergne', [1855,5], '오베르뉴 농촌', '클레르몽페랑까지 철도가 들어왔습니다. 겨울마다 파리로 걸어가던 사람들이 이제 기차를 탑니다.');
  RAIL('railway-brittany', [1865,4], '브르타뉴 농촌', '렌–브레스트 철도가 완공되었습니다. 브르타뉴의 끝까지 기차가 닿습니다. 파리의 몽파르나스 역 주변에 브르타뉴 사람들이 모여 살기 시작합니다.');
  H('rouen-cotton', [1862,11], {minAge:14, maxAge:65, places:['루앙'], classes:['도시 평민']}, '면화가 없다',
    '미국 남부의 항구가 봉쇄되어 면화가 들어오지 않습니다. 센강 계곡의 방적 공장들이 하나둘 문을 닫습니다. 시청 앞에서 무료 수프를 나눠 줍니다.',
    [{label:'수프 줄에 선다', result:'겨울을 수프와 시청 구호품으로 버텼습니다. 영국 랭커셔의 노동자들도 똑같이 굶고 있다고 합니다.', effects:{stats:{재산:-2, 행복:-3, 건강:-2}, experience:{inequality:2}}},
     {label:'르아브르 부두에서 일자리를 찾는다', result:'부두에서 짐을 졌습니다. 몸은 힘들었지만 굶지는 않았습니다.', effects:{stats:{재산:1, 건강:-3}}},
     {label:'아이들을 시골 친척에게 보낸다', result:'아이들을 노르망디 시골로 보냈습니다. 빈 방이 넓었습니다.', effects:{stats:{행복:-4, 재산:1}}}]);
  H('ovalistes', [1869,6], {minAge:14, maxAge:60, places:['리옹'], sexes:['여성'], classes:['도시 평민']}, '오발리스트 파업',
    '견사를 꼬는 여공(오발리스트) 2000명이 하루 열두 시간 노동과 형편없는 임금에 맞서 일손을 놓았습니다. 리옹 최초의 여성 파업입니다. 국제노동자협회가 연대를 보내옵니다.',
    [{label:'파업에 나선다', preview:'임금 인상 / 해고', outcomes:[
       O('won', '조금 얻어 냈습니다', 55, '한 달 넘는 파업 끝에 몇몇 공장이 노동 시간을 줄였습니다. 여공들이 처음으로 스스로 대표를 뽑았습니다.', {stats:{행복:5, 재산:1}, experience:{social:3, inequality:2}, path:{politics:'engaged'}, milestone:'1869년 오발리스트 파업'}),
       O('fired', '해고되었습니다', 45, '공장 주인이 파업 주동자 명단을 돌렸습니다. 다른 공장에서도 받아 주지 않았습니다.', {stats:{재산:-5, 행복:-3}, path:{politics:'engaged'}})]},
     {label:'일을 계속한다', result:'동료들의 눈총을 받으며 물레 앞에 앉았습니다.', effects:{stats:{행복:-2}}}]);
  H('plebiscite-1870-vote', [1870,5], {...MEN21}, '자유주의 제정을 승인합니까?',
    '황제가 의회에 권한을 넓혀 준 새 헌법을 국민투표에 부칩니다. 공화파는 ‘아니오’나 기권을 호소합니다.',
    [{label:'‘예’를 넣는다', result:'750만 명이 ‘예’를 넣었습니다. 넉 달 뒤 제정은 무너집니다.', effects:{}},
     {label:'‘아니오’를 넣는다', result:'‘아니오’는 150만 표였습니다. 도시에서는 ‘아니오’가 이겼습니다.', effects:{path:{politics:'engaged'}}},
     {label:'기권한다', result:'투표하지 않았습니다.', effects:{}}]);

  // ───────── 1870–1871 ─────────
  H('mobile-1870', [1870,8], {minAge:20, maxAge:40, sexes:['남성'], notPlaces:['파리']}, '국민 기동대',
    '프로이센과의 전쟁이 시작되었습니다. 군 복무를 면제받았던 젊은이들까지 국민 기동대로 불려 나갑니다. 소총도 군복도 모자랍니다.',
    [{label:'소집에 응한다', preview:'무사 귀향 / 부상 / 전사', outcomes:[
       O('home', '살아 돌아왔습니다', 72, '루아르 강변에서 겨울을 보냈습니다. 싸움보다 추위와 천연두가 더 무서웠습니다.', {stats:{건강:-6, 행복:-3}, milestone:'1870년 국민 기동대 복무'}),
       O('hurt', '다쳤습니다', 20, '쿨미에 근처에서 프로이센 포탄에 다쳤습니다.', {stats:{건강:-15}}),
       O('died', '돌아오지 못했습니다', 8, '눈 덮인 들판에서 쓰러졌습니다.', {doom:'1870년 겨울, 프로이센과의 전쟁에서 국민 기동대원으로 전사했습니다.'})]},
     {label:'집안의 유일한 일손이라며 면제를 청한다', preview:'면제 / 거절', outcomes:[
       O('ok', '면제되었습니다', 50, '늙은 부모를 모신다는 증명서가 받아들여졌습니다.', {stats:{행복:1}}),
       O('no', '거절되었습니다', 50, '결국 소집되어 겨울을 진창에서 보냈습니다.', {stats:{건강:-6, 행복:-4}})]}]);
  H('conlie', [1870,11], {minAge:20, maxAge:40, sexes:['남성'], places:['브르타뉴 농촌']}, '콩리의 진창',
    '브르타뉴 군단 6만 명이 르망 근처 콩리 캠프에 모였습니다. 파리의 정부는 ‘브르타뉴의 슈앙’을 믿지 못해 총을 주지 않습니다. 비가 그치지 않고, 천막 아래는 진창입니다.',
    [{label:'진창 속에서 버틴다', preview:'귀향 / 병', outcomes:[
       O('home', '살아 돌아왔습니다', 70, '석 달 뒤 녹슨 구식 총을 받고 르망 전투에 나갔다가 흩어졌습니다. 마을로 돌아온 사람들은 파리를 원망했습니다.', {stats:{건강:-6, 행복:-4}, milestone:'1870년 콩리 캠프'}),
       O('sick', '병에 걸렸습니다', 30, '천연두와 이질이 캠프를 휩쓸었습니다. 겨우 살아 돌아왔습니다.', {stats:{건강:-16}})]}]);
  H('sedan', [1870,9], {minAge:18, maxAge:50, jobMatch:'^(군인|육군)'}, '스당',
    '9월 1일, 뫼즈강 변 스당 분지가 프로이센 포병에 완전히 둘러싸였습니다. 황제가 백기를 올리라고 명령합니다.',
    [{label:'명령에 따라 무기를 내려놓는다', result:'10만 명이 포로가 되었습니다. 독일의 포로수용소에서 겨울을 났습니다.', effects:{stats:{건강:-8, 행복:-8}, milestone:'스당에서 포로가 됨'}},
     {label:'포위망을 뚫고 달아난다', preview:'탈출 / 붙잡힘', outcomes:[
       O('escaped', '빠져나갔습니다', 40, '밤에 벨기에 국경을 넘어 돌아와, 루아르 군에 다시 합류했습니다.', {stats:{건강:-4}, milestone:'스당 탈출'}),
       O('caught', '붙잡혔습니다', 60, '결국 붙잡혀 포로 행렬에 섞였습니다.', {stats:{건강:-10, 행복:-8}})]}]);
  H('september-4', [1870,9], {minAge:14, places:['파리']}, '9월 4일',
    '스당의 소식이 퍼진 일요일, 군중이 부르봉 궁의 의회로 밀려들었다가 시청으로 향합니다. 강베타가 창가에서 공화국을 선포합니다.',
    [{label:'시청 앞 광장에 간다', result:'모자를 던지며 “공화국 만세!”를 외쳤습니다. 피 한 방울 흘리지 않고 제정이 무너졌습니다.', effects:{stats:{행복:6}, path:{politics:'engaged'}, milestone:'1870년 9월 4일 공화국 선포를 목격'}},
     stay('창문으로 함성을 들었습니다. 프로이센군은 이미 파리로 오고 있었습니다.')]);
  H('lyon-red-flag', [1870,9], {minAge:14, places:['리옹']}, '리옹의 붉은 깃발',
    '9월 4일 아침, 파리보다 먼저 리옹 시청 발코니에 공화국이 선포되었습니다. 시청에 붉은 깃발이 걸렸습니다.',
    [{label:'테로 광장으로 간다', result:'크루아루스에서 내려온 직조공들 틈에서 붉은 깃발을 올려다보았습니다. 리옹은 몇 달 동안 스스로를 다스렸습니다.', effects:{stats:{행복:5}, path:{politics:'engaged'}}},
     stay('비단 창고 문을 걸어 잠갔습니다.')]);
  H('tours-gambetta', [1870,10], {minAge:10, places:['투르']}, '하늘에서 온 장관',
    '포위된 파리에서 기구를 타고 빠져나온 강베타가 투르에 도착했습니다. 정부 대표부가 투르 도청에 자리 잡고, 그가 지방에서 새 군대를 모읍니다. 루아르 강변이 갑자기 프랑스의 수도가 되었습니다.',
    [{label:'도청 앞에서 그의 연설을 듣는다', result:'“프랑스는 항복하지 않는다!” 쉰 목소리의 연설에 사람들이 울었습니다.', effects:{stats:{행복:4}, path:{politics:'engaged'}}},
     {label:'관청의 일손으로 나선다', result:'정부 대표부에서 공문을 베껴 쓰고 전보를 날랐습니다.', effects:{stats:{지식:2, 재산:1}, experience:{responsibility:2}}},
     stay('두 달 뒤 대표부는 프로이센군을 피해 보르도로 옮겨 갔습니다.')]);
  H('siege-paris-women', [1870,12], {minAge:10, places:['파리'], sexes:['여성']}, '포위된 파리의 성탄',
    '포위 석 달째. 말고기도 귀해졌고 시장에서는 고양이와 쥐가 팔립니다. 식물원의 코끼리 카스토르와 폴뤽스도 도축되었습니다. 빵 배급 줄은 새벽 네 시부터 섭니다.',
    [{label:'빵 배급 줄에 선다', result:'영하의 새벽, 몇 시간을 기다려 거무스름한 배급 빵을 받았습니다. 아이들에게는 말고기라고 하고 쥐고기를 끓였습니다.', effects:{stats:{건강:-4, 재산:-3, 행복:-3}}},
     {label:'구급 병원에서 부상병을 돌본다', result:'극장과 역에 차린 구급 병원에서 붕대를 감았습니다. 뷔장발에서 실려 온 젊은이들이었습니다.', effects:{stats:{건강:-3, 행복:-2}, experience:{responsibility:3}}},
     {label:'(여유가 있다면) 부자들의 코끼리 요리를 맛본다', requires:{minWealth:60}, result:'부아쟁 식당의 성탄 메뉴는 코끼리 수프와 낙타 구이였습니다. 창밖의 굶주림이 목에 걸렸습니다.', effects:{stats:{재산:-6, 행복:1}}}]);
  H('siege-paris', [1870,12], {minAge:16, places:['파리'], sexes:['남성']}, '포위된 파리의 성탄',
    '포위 석 달째. 말고기도 귀해졌고 시장에서는 고양이와 쥐가 팔립니다. 식물원의 코끼리 카스토르와 폴뤽스도 도축되었습니다. 국민방위대는 한 번 더 돌파 작전을 준비합니다.',
    [{label:'국민방위대 돌파 작전에 나간다', preview:'귀환 / 부상 / 전사', outcomes:[
       O('back', '돌아왔습니다', 70, '뷔장발의 진흙 속에서 하루를 싸우고 물러났습니다. 사흘 뒤 파리는 항복했습니다.', {stats:{건강:-6, 행복:-4}, milestone:'파리 포위전 참전'}),
       O('hurt', '다쳤습니다', 22, '프로이센 총탄에 다쳐 루브르에 차린 병원으로 실려 갔습니다.', {stats:{건강:-15}}),
       O('died', '돌아오지 못했습니다', 8, '뷔장발 공원 담장 앞에서 쓰러졌습니다.', {doom:'1871년 1월, 파리 포위전의 뷔장발 돌파 작전에서 전사했습니다.'})]},
     {label:'쥐고기 가게 앞에 줄을 선다', result:'쥐 한 마리에 1프랑. 아이들에게는 말고기라고 했습니다.', effects:{stats:{건강:-4, 재산:-3, 행복:-3}}},
     {label:'(여유가 있다면) 부자들의 코끼리 요리를 맛본다', requires:{minWealth:60}, result:'부아쟁 식당의 성탄 메뉴는 코끼리 수프와 낙타 구이였습니다. 창밖의 굶주림이 목에 걸렸습니다.', effects:{stats:{재산:-6, 행복:1}}}]);
  H('bordeaux-1871', [1871,2], {minAge:14, places:['보르도']}, '대극장의 의회',
    '휴전 뒤 새로 뽑힌 국민의회가 보르도 대극장에서 열립니다. 왕당파가 다수입니다. 알자스와 로렌의 의원들이 할양에 항의하며 퇴장합니다.',
    [{label:'극장 앞에서 회의를 지켜본다', result:'빅토르 위고가 연설하다 야유를 받고 의원직을 내려놓았다는 소식이 광장에 돌았습니다.', effects:{stats:{지식:2}, experience:{curiosity:2}}},
     stay('항구는 평소처럼 바빴습니다.')]);
  H('commune-cannons', [1871,3], {minAge:15, maxAge:70, places:['파리']}, '몽마르트르의 대포',
    '3월 18일 새벽, 정부군이 몽마르트르 언덕에 있던 국민방위대의 대포를 가져가려 합니다. 경종이 울리고 여자들이 먼저 언덕으로 달려갑니다.',
    [{label:'언덕으로 올라가 대포를 지킨다', result:'병사들이 총을 거꾸로 들고 군중과 섞였습니다. 그날 밤 정부는 베르사유로 달아났고, 파리 코뮌이 시작되었습니다.', effects:{stats:{행복:5}, path:{politics:'engaged'}, milestone:'1871년 3월 18일 몽마르트르'}},
     {label:'정부를 따라 베르사유로 떠난다', result:'가방 하나 들고 베르사유행 마차를 탔습니다. 두 달 동안 파리 소식을 신문으로만 들었습니다.', effects:{stats:{재산:-3, 행복:-2}, path:{politics:'royalist'}}},
     stay('문을 걸어 잠그고 사태를 지켜보았습니다.')]);
  H('bloody-week-door', [1871,5], {minAge:15, maxAge:75, places:['파리']}, '피의 일주일',
    '5월 마지막 주, 베르사유군이 파리 서쪽 성문으로 들어왔습니다. 시청과 튈르리가 불타고, 골목마다 총살 소리가 들립니다. 밤에 부상당한 코뮌 병사 하나가 당신 문을 두드립니다.',
    [{label:'문을 열고 숨겨 준다', preview:'무사함 / 함께 체포', outcomes:[
       O('safe', '무사히 넘겼습니다', 70, '석 달 동안 지하실에 숨겨 주었습니다. 그는 나중에 체포되어 누벨칼레도니로 유형을 갔지만, 당신 이름은 끝까지 대지 않았습니다.', {stats:{행복:2}, bond:B('bloody-week', 'favor', 'amnesty', '1871년 피의 일주일에 숨겨 준', '코뮌 병사')}),
       O('caught', '함께 붙잡혔습니다', 30, '이웃의 밀고로 둘 다 끌려갔습니다. 당신은 석 달 뒤 풀려났습니다.', {stats:{건강:-6, 행복:-6}, bond:B('bloody-week', 'favor', 'amnesty', '1871년 피의 일주일에 숨겨 준', '코뮌 병사')})]},
     {label:'군인들에게 알린다', result:'그는 끌려갔습니다. 그해 여름 4만 명이 체포되었습니다.', effects:{stats:{행복:-4}, bond:B('bloody-week', 'grudge', 'amnesty', '1871년 피의 일주일에 군인에게 넘긴', '코뮌 병사')}},
     {label:'문을 열지 않는다', result:'두드림이 멈췄습니다. 이튿날 아침 골목 끝에 시신이 있었습니다.', effects:{stats:{행복:-5}}}]);

  // ───────── 제3공화국 ─────────
  H('first-quatorze', [1880,7], {minAge:6}, '첫 번째 7월 14일',
    '처음으로 7월 14일이 국경일이 되었습니다. 시청에 삼색기가 걸리고 저녁에는 광장에서 무도회가 열립니다. 신부님은 성당 종을 울리지 않겠다고 합니다.',
    [{label:'무도회에 간다', result:'밤늦게까지 춤을 추었습니다. 아이들은 종이 등불을 들고 행진했습니다.', effects:{stats:{행복:5}, experience:{social:2}, path:{politics:'engaged'}}},
     {label:'신부님 편에서 창문을 닫는다', result:'폭죽 소리가 덧문을 두드렸습니다. 마을이 둘로 나뉘는 소리 같았습니다.', effects:{stats:{행복:-1}, experience:{religious:1}}}]);
  D('school-war', 'parenting', {minAge:24, childAge:[6, 11], fromYear:1882, toYear:1895}, '어느 학교에 보낼까',
    '페리 법으로 아이를 학교에 보내야 합니다. 시청 옆 공립 학교에는 십자가 대신 지도와 공화국의 흉상이 있고, ‘공화국의 검은 경기병’이라 불리는 젊은 교사가 있습니다. 성당 옆에는 수녀회와 수사회가 하는 학교가 남아 있습니다.',
    [{label:'공립 세속 학교에 보낸다', result:'아이는 집에 와서 “프랑스는 하나이고 나눌 수 없다”를 외웠습니다. 신부님은 성체 배령 교리 시간에 아이를 따로 불러 세웠습니다.', effects:{stats:{지식:1}, path:{politics:'engaged'}}},
     {label:'수녀회(수사회) 학교에 보낸다', result:'교리와 읽기, 바느질을 함께 배웠습니다. 공립 교사는 당신 집 앞을 지날 때마다 고개를 돌렸습니다.', effects:{experience:{religious:1}}}], .6);
  H('breton-symbol', [1885,10], {minAge:7, maxAge:12, places:['브르타뉴 농촌']}, '나막신 목걸이',
    '학교에서 브르타뉴 말을 쓰다 들킨 아이는 목에 나막신(‘상징’)을 걸고 다녀야 합니다. 다른 아이가 브르타뉴 말을 하는 것을 일러바치면 넘겨줄 수 있습니다.',
    [{label:'친구가 말하는 걸 일러바친다', result:'나막신은 친구 목으로 넘어갔습니다. 친구는 그날 하굣길에 말을 걸지 않았습니다.', effects:{stats:{행복:-2}}},
     {label:'하루 종일 목에 걸고 버틴다', result:'저녁에 할머니가 브르타뉴 말로 “부끄러워할 것 없다”고 했습니다.', effects:{stats:{행복:-2, 지식:1}, experience:{inequality:2}}}]);
  H('hugo-funeral', [1885,6], {minAge:8, places:['파리']}, '위고의 장례',
    '6월 1일, 빅토르 위고의 관이 개선문 아래에서 밤을 보낸 뒤 가난한 사람의 영구차에 실려 팡테옹으로 갑니다. 그의 유언입니다.',
    [{label:'행렬을 따라 걷는다', result:'200만 명이 함께 걸었습니다. 『레 미제라블』을 읽지 못한 사람들도 장발장의 이름은 알았습니다.', effects:{stats:{행복:3}, experience:{social:2}}}, stay('창가에서 끝없이 이어지는 행렬을 내려다보았습니다.')]);
  H('eiffel', [1889,6], {minAge:8, places:['파리']}, '300미터의 탑',
    '혁명 100주년 박람회의 에펠탑에 엘리베이터가 움직이기 시작했습니다. 예술가들은 ‘흉물’이라고 서명 운동을 했지만, 줄은 끝이 없습니다.',
    [{label:'꼭대기까지 올라간다', result:'파리가 장난감처럼 내려다보였습니다. 센강이 은실 같았습니다.', effects:{stats:{행복:5, 재산:-1}, experience:{curiosity:3}}}, stay('흉물이라는 말에 동의했습니다.')]);
  D('boulanger-vote', 'politics', {...MEN21, fromYear:1888, toYear:1889}, '용감한 장군',
    '‘복수 장군’ 불랑제가 의회 해산과 헌법 개정을 외칩니다. 왕당파 돈과 급진파 노동자가 한꺼번에 그를 밀고 있습니다. 공화파는 ‘쿠데타가 온다’고 경고합니다.',
    [{label:'불랑제에게 표를 준다', result:'파리가 그를 뽑았습니다. 그런데 장군은 엘리제궁으로 가는 대신 애인과 함께 벨기에로 가 버렸습니다.', effects:{path:{politics:'royalist'}}},
     {label:'공화파 후보에게 표를 준다', result:'공화국은 버텼습니다.', effects:{path:{politics:'engaged'}}}], .5);
  H('carnot-lyon', [1894,6], {minAge:14, places:['리옹']}, '카르노 대통령 암살 다음 날',
    '어젯밤 박람회장에서 대통령이 이탈리아인 청년에게 찔려 숨졌습니다. 오늘 성난 군중이 이탈리아인 가게의 유리창을 깨며 몰려다닙니다. 이웃 이탈리아인 가족이 문을 걸어 잠갔습니다.',
    [{label:'이웃 가족을 숨겨 준다', result:'밤새 군중의 고함이 골목을 지나갔습니다. 아침에 그 집 아이가 당신 손을 잡았습니다.', effects:{stats:{행복:3}, experience:{social:2}}},
     {label:'군중에 섞인다', result:'깨진 유리 소리 사이에서 당신도 소리를 질렀습니다. 그날 밤 잠이 오지 않았습니다.', effects:{stats:{행복:-3}, experience:{inequality:1}}},
     stay('덧문을 내렸습니다.')]);
  D('dreyfus-side', 'politics', {minAge:20, literacy:['basic'], fromYear:1898, toYear:1899}, '드레퓌스 사건',
    '졸라의 「나는 고발한다」 이후 식탁마다 싸움입니다. 군의 명예냐, 한 사람의 진실이냐. 오랜 친구와도 말을 끊는 집이 늘고 있습니다.',
    [{label:'드레퓌스파: 재심을 요구한다', result:'인권 연맹의 청원서에 서명했습니다. 단골 몇이 발길을 끊었습니다.', effects:{stats:{행복:-1}, path:{politics:'engaged'}, experience:{inequality:2}}},
     {label:'반드레퓌스파: 군의 명예를 지킨다', result:'「라 리브르 파롤」을 구독하기 시작했습니다. 그 신문의 증오가 낯설지 않게 되었습니다.', effects:{path:{politics:'royalist'}}},
     {label:'식탁에서 그 이야기를 금한다', result:'“드레퓌스 이야기는 하지 말 것.” 그래도 결국 이야기는 나왔습니다.', effects:{}}]);
  H('inventories', [1906,2], {minAge:14, religions:['catholic'], placeIncludes:'농촌'}, '성당 문 앞의 목록 조사',
    '정교 분리법에 따라 세무 관리가 헌병과 함께 성당 재산 목록을 만들러 왔습니다. 신자들이 성당 문을 걸어 잠그고 종을 칩니다. 문 앞에 고춧가루와 몽둥이가 놓여 있습니다.',
    [{label:'성당 문 앞을 막아선다', preview:'관리가 물러남 / 체포', outcomes:[
       O('held', '관리들이 물러났습니다', 55, '종소리 속에 관리들이 돌아갔습니다. 몇 주 뒤 정부는 목록 조사를 멈추었습니다.', {stats:{행복:4}, experience:{religious:2}}),
       O('arrested', '붙잡혔습니다', 45, '헌병이 도끼로 문을 부쉈습니다. 당신은 벌금과 며칠의 구류를 받았습니다.', {stats:{재산:-3, 행복:-2}})]},
     {label:'법은 법이라며 지켜만 본다', result:'이웃들이 당신을 ‘공화파’라고 불렀습니다.', effects:{stats:{행복:-1}}}]);
  H('mobilization', [1914,8], {minAge:20, maxAge:47, sexes:['남성']}, '총동원령',
    '8월 1일 오후 네 시, 마을 성당의 경종이 울리고 시청 벽에 총동원 포고문이 붙었습니다. 군인 수첩에 적힌 날짜에 연대로 가야 합니다. 모두 크리스마스 전에는 돌아올 거라고 합니다.',
    [{label:'연대로 간다', preview:'살아 돌아옴 / 부상 / 전사', outcomes:[
       O('back', '살아 돌아왔습니다', 62, '전쟁은 크리스마스에 끝나지 않았습니다. 4년 뒤, 다른 사람이 되어 돌아왔습니다.', {stats:{건강:-12, 행복:-10}, milestone:'1914년 동원'}),
       O('hurt', '다쳤습니다', 22, '마른강 전투에서 다쳐 후송되었습니다. 얼굴의 상처는 평생 남았습니다.', {stats:{건강:-20, 행복:-6}}),
       O('died', '돌아오지 못했습니다', 16, '전쟁이 시작된 지 한 달 만에, 붉은 바지의 프랑스 보병들은 기관총 앞에서 수만 명씩 쓰러졌습니다.', {doom:'1914년 가을, 제1차 세계대전 초기 전투에서 전사했습니다.'})]}]);
  H('mobilization-women', [1914,8], {minAge:16, maxAge:47, sexes:['여성']}, '남자들이 떠난 마을',
    '총동원령이 내려졌습니다. 남편과 형제들이 군인 수첩을 들고 역으로 떠났습니다. 8월, 밀은 아직 밭에 서 있습니다. 총리는 “여자들이여, 수확을 마쳐 달라”고 호소합니다.',
    [{label:'낫을 들고 밭으로 나간다', result:'여자와 노인과 아이들이 수확을 마쳤습니다. 그 가을부터 여자들이 공장과 전차와 들판을 맡았습니다.', effects:{stats:{건강:-3, 행복:-3}, experience:{responsibility:3}}},
     {label:'역에 나가 배웅한다', result:'기차가 떠날 때까지 손을 흔들었습니다.', effects:{stats:{행복:-5}}}]);
  H('mobilization-home', [1914,8], {minAge:48}, '떠나는 아들들',
    '총동원령이 내려졌습니다. 역에는 꽃을 꽂은 총을 든 젊은이들이 가득합니다. “베를린으로!” 기차 옆구리에 분필로 쓴 글씨가 보입니다.',
    [{label:'역에 나가 배웅한다', result:'손을 흔드는 얼굴들 가운데 아는 얼굴이 많았습니다. 그 가운데 몇이 돌아올지 아무도 몰랐습니다.', effects:{stats:{행복:-5}}},
     stay('라디오도 없던 시절, 신문 호외를 기다렸습니다.')]);

  // ───────── 시대의 중대 결정 ─────────
  D('phylloxera', 'economy', {minAge:25, places:['부르고뉴 농촌', '보르도'], fromYear:1878, toYear:1892}, '죽어 가는 포도원',
    '필록세라가 포도나무 뿌리를 갉아 먹었습니다. 남은 길은 셋입니다. 미국 포도나무 대목에 접을 붙여 새로 심거나, 포도원을 갈아엎고 다른 작물을 심거나, 알제리의 새 포도원으로 떠나는 것입니다.',
    [{label:'미국 대목에 접붙여 새로 심는다', requires:{minWealth:35}, preview:'몇 해의 빚 / 되살아난 포도원', result:'빚을 내서 새 나무를 심었습니다. 다섯 해 동안 포도주 한 통 팔지 못했지만, 포도원은 살아났습니다.', effects:{stats:{재산:-10, 행복:2}, experience:{commerce:2}}},
     {label:'포도원을 갈아엎고 밀과 소를 키운다', result:'할아버지 때부터의 포도원을 갈아엎었습니다. 언덕이 낯설어졌습니다.', effects:{stats:{재산:-4, 행복:-4}}},
     {label:'알제리로 떠난다', result:'미티자 평원의 새 포도원에서 일을 시작했습니다. 프랑스 포도주의 빈자리를 알제리 포도주가 채웠습니다.', effects:{stats:{재산:2, 행복:-3}, experience:{curiosity:2}, milestone:'알제리로 이주'}}], .7);
  D('rural-exodus', 'housing', {minAge:16, maxAge:28, placeIncludes:'농촌', fromYear:1855, toYear:1905, maxWealth:45}, '도시로 갈까',
    '마을의 젊은이들이 기차를 타고 떠납니다. 파리의 몽파르나스나 리옹의 공장, 혹은 큰 집의 하녀 자리. 남은 땅은 형제끼리 나누면 손바닥만 합니다.',
    [{label:'파리로 떠난다', result:'몽파르나스 역에 내렸습니다. 같은 고향 사람이 하는 카페에서 첫 일자리를 얻었습니다.', effects:{stats:{재산:1, 행복:-1}, experience:{curiosity:2}, milestone:'파리로 이주', moveTo:'파리'}},
     {label:'마을에 남는다', result:'형제들이 떠난 땅을 혼자 일구었습니다. 마을 학교의 아이 수가 해마다 줄었습니다.', effects:{stats:{행복:1}}}], .2);
  D('shares-1860', 'economy', {minAge:25, classes:['부르주아'], fromYear:1853, toYear:1866, minWealth:45}, '크레디 모빌리에 주식',
    '페레르 형제의 은행 크레디 모빌리에 주식이 몇 년 사이 몇 배로 뛰었습니다. 철도와 항만, 대로 공사에 투자한다고 합니다. 모두가 주식 이야기만 합니다.',
    [{label:'저축을 털어 주식을 산다', preview:'큰 이익 / 1867년 폭락', outcomes:[
       O('sold', '제때 팔았습니다', 40, '값이 꼭대기일 때 팔았습니다. 운이 좋았습니다.', {stats:{재산:12, 행복:3}}),
       O('crash', '폭락을 맞았습니다', 60, '1867년 크레디 모빌리에가 무너졌습니다. 주식은 종잇조각이 되었습니다.', {stats:{재산:-14, 행복:-5}})]},
     {label:'국채와 땅에 둔다', result:'연 3% 국채 이자를 받으며 남들의 주식 이야기를 들었습니다.', effects:{stats:{재산:2}}}], .5);
  D('grand-magasin', 'career', {minAge:16, maxAge:30, sexes:['여성'], places:['파리'], fromYear:1858, toYear:1900, noCareer:true}, '봉 마르셰의 판매원',
    '대형 백화점 ‘봉 마르셰’가 판매원을 뽑습니다. 기숙사가 있고 검은 비단 드레스를 입습니다. 대신 하루 열세 시간을 서 있어야 하고, 혼인하면 그만두어야 합니다.',
    [{label:'판매원이 된다', result:'유리 진열창과 가스등 아래에서 레이스와 장갑을 팔았습니다. 손님들은 당신을 ‘마드무아젤’이라고 불렀습니다.', effects:{stats:{재산:3, 건강:-2}, job:'백화점 판매원', milestone:'직업: 백화점 판매원'}},
     {label:'하던 일을 계속한다', result:'발길을 돌렸습니다.', effects:{}}], .4);
  D('sewing-machine', 'economy', {minAge:18, sexes:['여성'], fromYear:1860, toYear:1895}, '할부 재봉틀',
    '싱어 재봉틀을 매달 몇 프랑씩 나눠 갚는 조건으로 들일 수 있습니다. 집에서 백화점 납품용 셔츠를 박으면 품삯이 나옵니다.',
    [{label:'재봉틀을 들인다', result:'밤늦게까지 페달 소리가 났습니다. 할부금을 다 갚는 데 이 년이 걸렸습니다.', effects:{stats:{재산:3, 건강:-2}}},
     {label:'손바느질로 버틴다', result:'바늘 하나로 버텼습니다.', effects:{}}], .35);
  D('union-1884', 'politics', {minAge:18, maxAge:60, classes:['도시 평민'], notPlaceIncludes:'농촌', fromYear:1884, toYear:1906}, '노동조합',
    '노동조합이 합법이 되었습니다. 작업장 동료들이 조합을 만들자고 합니다. 주인은 조합원을 가장 먼저 내보낼 거라고 으름장을 놓습니다.',
    [{label:'조합에 가입한다', result:'노동회관에서 열린 첫 모임에 갔습니다. 노동절에는 하루 여덟 시간 노동을 요구하며 행진했습니다.', effects:{stats:{행복:2}, experience:{social:2, inequality:1}, path:{politics:'engaged'}}},
     {label:'가입하지 않는다', result:'주인의 눈치를 보았습니다.', effects:{}}], .4);
  D('divorce-1884', 'family', {minAge:22, livingRoles:['배우자'], fromYear:1884, toYear:1910}, '나케 법',
    '1816년 이후 금지되었던 이혼이 다시 허용되었습니다. 이웃 부부 하나가 법정을 찾았다는 소문이 돌자, 당신 부부 사이에도 그 말이 오갔습니다. 신부님은 죄라고 하고, 이웃들은 수군댈 것입니다.',
    [{label:'이혼 소송을 낸다', result:'법정에서 몇 달을 다툰 끝에 이혼이 받아들여졌습니다. 혼자가 되었지만 숨이 쉬어졌습니다.', effects:{stats:{행복:3, 재산:-4}, divorce:true}},
     {label:'참고 산다', result:'한 지붕 아래 남남처럼 살았습니다.', effects:{stats:{행복:-2}}}], .12);
  D('emigrate-americas', 'housing', {minAge:18, maxAge:35, fromYear:1850, toYear:1900, maxWealth:35}, '바다 건너',
    '아르헨티나와 미국으로 가는 이민선 소개업자가 마을에 왔습니다. 1849년에는 캘리포니아 금광, 이제는 부에노스아이레스의 일자리라고 합니다. 오베르뉴와 바스크 사람들이 많이 떠났습니다.',
    [{label:'르아브르에서 배를 탄다', result:'석 달의 항해 끝에 새 대륙에 내렸습니다. 고향에 편지를 보낼 때마다 돌아가겠다고 썼지만, 돌아가지 않았습니다.', effects:{stats:{재산:3, 행복:-4}, experience:{curiosity:4}, milestone:'아메리카로 이민'}},
     {label:'고향에 남는다', result:'소개업자의 전단을 아궁이에 넣었습니다.', effects:{}}], .2);
  D('bicycle', 'economy', {minAge:14, maxAge:45, fromYear:1891, toYear:1910, minWealth:30}, '자전거',
    '공기 타이어를 단 자전거가 거리에 나타났습니다. 한 대 값이 노동자 석 달 치 품삯입니다. 여자들은 치마 대신 바지를 입고 탄다고 신문이 떠들썩합니다.',
    [{label:'자전거를 산다', result:'일요일마다 성 밖 길을 달렸습니다. 바람이 얼굴을 때리는 게 좋았습니다.', effects:{stats:{재산:-4, 행복:5, 건강:2}}},
     {label:'걸어 다닌다', result:'신발이 더 싸게 먹혔습니다.', effects:{}}], .3);
  D('substitute-1855', 'parenting', {minAge:38, childAge:[19, 21], childSex:'남성', fromYear:1855, toYear:1872}, '제비뽑기',
    '아들이 징병 제비뽑기에서 ‘나쁜 번호’를 뽑았습니다. 7년 복무입니다. 국가에 면제금을 내면 대신 다른 사람이 갑니다.',
    [{label:'면제금을 낸다', requires:{minWealth:50}, result:'2,500프랑을 냈습니다. 대신 간 사람은 가난한 집 아들이었을 것입니다.', effects:{stats:{재산:-14}}},
     {label:'아들을 보낸다', result:'아들은 7년을 군에서 보냈습니다. 크림이나 이탈리아, 멕시코에 갔을지도 모릅니다.', effects:{stats:{행복:-6}, childJob:{age:[19, 22], sex:'남성', job:'군인'}}}], .5);
})();

// Everyday life 1852–1914.
(() => {
  const E = (id, kind, when, title, text, effects = {}) => dailyEvents.push({id, kind, category:'historical', when, title, text,
    effects:{stats:effects.stats || {}, experience:effects.experience || {}}, tags:['daily', 'life'], repeatable:false});
  E('e-boulevard-dust', 'normal', {minAge:14, places:['파리'], fromYear:1854, toYear:1869}, '공사판 먼지', '오스만의 공사로 파리 절반이 공사판입니다. 석회 먼지가 빨래에 내려앉고, 어제 있던 골목이 오늘은 없습니다.', {experience:{curiosity:1}});
  E('e-carte-visite', 'good', {minAge:14, fromYear:1859, toYear:1880, minWealth:35, notPlaceIncludes:'농촌'}, '명함판 사진', '사진관에서 명함만 한 사진을 열두 장 찍었습니다. 고향 식구들에게 한 장씩 보냈습니다.', {stats:{행복:2, 재산:-1}});
  E('e-petit-journal', 'normal', {minAge:12, literacy:['basic'], fromYear:1863}, '1수짜리 신문', '「르 프티 주르날」을 1수에 샀습니다. 연재소설과 살인 사건 기사를 소리 내어 읽자 이웃들이 모여들었습니다.', {experience:{curiosity:1, social:1}});
  E('e-cafe-concert', 'good', {minAge:16, notPlaceIncludes:'농촌', fromYear:1860}, '카페콩세르', '맥주 한 잔 값으로 가수의 노래와 코미디를 보는 카페콩세르에 갔습니다. 후렴을 다 함께 따라 불렀습니다.', {stats:{행복:3, 재산:-1}, experience:{social:1}});
  E('e-pebrine', 'bad', {minAge:16, places:['리옹'], fromYear:1853, toYear:1868}, '누에 병', '누에가 검은 반점이 생겨 죽어 가는 병(미립자병)이 돈다고 합니다. 생사 값이 뛰고 견직 주문이 흔들립니다.', {stats:{재산:-2}});
  E('e-gas-kitchen', 'good', {minAge:20, fromYear:1880, places:['파리'], minWealth:40}, '가스 화덕', '부엌에 가스 화덕을 들였습니다. 아침마다 숯불을 피우던 일이 사라졌습니다.', {stats:{행복:2, 재산:-1}});
  E('e-hussard', 'normal', {minAge:6, maxAge:13, fromYear:1882}, '검은 경기병', '검은 프록코트를 입은 젊은 공립 교사가 칠판에 ‘조국’과 ‘의무’를 썼습니다. 받아쓰기를 틀리면 손바닥을 맞았습니다.', {stats:{지식:1}});
  E('e-certificat', 'good', {minAge:11, maxAge:13, fromYear:1882, literacy:['basic']}, '초등 학력 증명서', '군청 소재지까지 가서 초등 학력 증명서 시험을 보았습니다. 합격자 명단에 이름이 있었습니다. 온 집안의 자랑입니다.', {stats:{행복:4, 지식:2}});
  E('e-electric', 'good', {minAge:8, places:['파리', '리옹'], fromYear:1881}, '전등', '오페라 극장 앞 대로에 전등이 켜졌습니다. 가스등보다 하얗고 차가운 빛입니다.', {stats:{행복:1}, experience:{curiosity:2}});
  E('e-telephone', 'normal', {minAge:16, fromYear:1885, notPlaceIncludes:'농촌', minWealth:50}, '전화', '우체국에서 처음으로 전화를 걸어 보았습니다. 수화기 너머 목소리가 이상하게 가까웠습니다.', {experience:{curiosity:2}});
  E('e-cinema', 'good', {minAge:6, places:['리옹', '파리'], fromYear:1896}, '움직이는 사진', '뤼미에르 형제의 활동사진을 보았습니다. 기차가 화면 속에서 달려오자 앞줄 사람들이 몸을 피했습니다.', {stats:{행복:4}, experience:{curiosity:3}});
  E('e-absinthe', 'bad', {minAge:20, notPlaceIncludes:'농촌', fromYear:1870}, '초록 요정', '저녁 다섯 시, 압생트의 ‘초록 시간’. 이웃 하나가 압생트에 빠져 일자리를 잃었습니다.', {stats:{행복:-1}});
  E('e-tour-france', 'good', {minAge:8, fromYear:1903}, '투르 드 프랑스', '자전거 선수들이 먼지를 일으키며 마을을 지나갔습니다. 아이들이 물병을 들고 길가에 줄을 섰습니다.', {stats:{행복:3}});
  E('e-pilgrimage', 'normal', {minAge:16, religions:['catholic'], fromYear:1873}, '루르드 순례', '본당이 마련한 순례 열차를 타고 루르드에 다녀왔습니다. 동굴 앞에서 촛불을 켜고 아픈 식구를 위해 기도했습니다.', {experience:{religious:2}});
  E('e-bougnat', 'normal', {minAge:16, places:['오베르뉴 농촌'], fromYear:1860}, '파리의 오베르뉴 사람들', '파리에서 숯과 포도주를 파는 가게(부냐)를 하는 사촌이 돌아와, 마을 젊은이를 데려가겠다고 했습니다.', {experience:{curiosity:1}});
  E('e-sardines', 'normal', {minAge:14, places:['브르타뉴 농촌'], fromYear:1860}, '정어리 통조림 공장', '해안의 정어리 통조림 공장에 정어리 배가 들어오면 밤이고 낮이고 여자들이 불려 갑니다.', {stats:{재산:1, 건강:-1}});
  E('e-mutual', 'good', {minAge:20, fromYear:1852, toYear:1900, classes:['도시 평민']}, '공제 조합', '한 달에 몇 수씩 공제 조합에 넣으면 아플 때 의사를 부르고, 죽으면 장례를 치러 줍니다.', {stats:{재산:-1, 행복:2}, experience:{social:1}});
  E('e-old-age', 'normal', {minAge:65, fromYear:1880}, '세상이 변했다', '기차, 전신, 사진, 그리고 이제는 전등. 어릴 적 이야기를 하면 손주들이 믿지 않습니다.', {experience:{curiosity:1}});
})();
