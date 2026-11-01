// src/data/decisions-july-monarchy.js
// Everyday decisions for ordinary people in 1830–1848: factories and the 1841 child-labour law, railway
// building, the serial-novel craze, census suffrage and the 1847 banquets, workers' associations, new
// farming, the potato blight, the Curé d'Ars, Auvergnats in Paris, Icarians, and more.
(() => {
  // The original "news of the revolution" decision had no end year and could open in the 1840s.
  const revolution = decisions.find(d => d.id === 'revolution');
  if (revolution) revolution.when.toYear = 1799;
  const D = (id, domain, when, title, text, choices, chance = .35) => decisions.push({id, domain, priority:7, chance, title, text,
    when:{fromYear:1830, toYear:1848, ...when, unsetFlag:id},
    choices:choices.map(c => ({...c, effects:{...(c.effects || {}), flags:[id, ...((c.effects || {}).flags || [])]}}))});
  const O = (id, title, weight, result, effects = {}, modifiers) => ({id, title, weight, result, effects, ...(modifiers ? {modifiers} : {})});
  const TOWN = '농촌';

  D('child-factory', 'parenting', {minAge:26, childAge:[8, 12], notPlaceIncludes:TOWN, maxWealth:45},
    '아이를 공장에 보낼까?',
    '방적 공장이 여덟 살 넘은 아이들을 씁니다. 1841년 법이 생겨 열두 살까지는 하루 여덟 시간만 일하게 되어 있지만, 지키는 공장은 많지 않습니다. 아이의 품삯이면 빵값의 절반이 됩니다.',
    [{label:'공장에 보낸다', preview:'살림에 보탬 / 아이가 상함', outcomes:[
        O('default', '아이가 공장에 다닙니다', 55, '새벽 다섯 시에 아이를 깨워 보냅니다. 주말에 받아 오는 동전이 살림에 보탬이 됩니다.', {childJob:{age:[8, 12], job:'방적 공장 아이'}, stats:{재산:3, 행복:-3}}),
        O('sick', '아이가 기침을 달고 삽니다', 45, '솜먼지 때문인지 아이가 밤마다 기침을 합니다. 키도 잘 크지 않습니다.', {childJob:{age:[8, 12], job:'방적 공장 아이'}, stats:{재산:2, 행복:-6}, relationCloseness:{roles:['자녀'], amount:-4}})]},
     {label:'학교에 보낸다', preview:'아이가 글을 깨침 / 살림이 빠듯함', outcomes:[
        O('default', '아이가 학교에 다닙니다', 60, '아이가 집에 와서 신문 제목을 읽어 줍니다.', {stats:{행복:3, 재산:-2}, relationCloseness:{roles:['자녀'], amount:4}}),
        O('tight', '살림이 빠듯해졌습니다', 40, '아이 몫의 수입이 없어 겨울이 길었습니다.', {stats:{재산:-4}})]}]);

  D('railway-navvy', 'career', {minAge:18, maxAge:40, sexes:['남성'], fromYear:1840, placeIncludes:TOWN, maxWealth:45},
    '철도 공사판',
    '철도 노선이 근처를 지나갑니다. 흙을 파고 둑을 쌓는 인부를 구하는데, 품삯이 농사일의 두 배라고 합니다. 영국에서 온 인부들도 섞여 있습니다.',
    [{label:'공사판에 간다', preview:'목돈 / 사고', outcomes:[
        O('default', '두 해 동안 목돈을 모았습니다', 65, '삽과 수레로 산을 깎았습니다. 손은 갈라졌지만 집에 송아지 두 마리 값을 부쳤습니다.', {stats:{재산:7, 건강:-3}, experience:{curiosity:2}}),
        O('accident', '흙더미가 무너졌습니다', 35, '절개지가 무너져 동료 둘이 깔렸고, 당신은 다리를 다쳤습니다.', {stats:{재산:2, 건강:-10}})]},
     {label:'농사일에 남는다', result:'기적 소리를 멀리서 들으며 밭을 갑니다.', effects:{stats:{}}}]);

  D('feuilleton', 'relationships', {minAge:14, literacy:['basic'], notPlaceIncludes:TOWN, fromYear:1836},
    '연재소설',
    '신문마다 아래 칸에 연재소설을 싣습니다. 외젠 쉬의 「파리의 비밀」이 연재될 때는 다음 호를 기다리는 사람들이 신문 가게 앞에 줄을 섰습니다. 독서실에서 한 시간에 몇 상팀이면 빌려 읽을 수 있습니다.',
    [{label:'신문을 구독한다', preview:'즐거움 / 밤샘', outcomes:[
        O('default', '다음 호를 기다리는 즐거움이 생겼습니다', 70, '저녁마다 식구들에게 연재소설을 소리 내어 읽어 줍니다. 글을 모르는 이웃들까지 모여듭니다.', {stats:{행복:4, 재산:-2, 지식:2}, closeness:2}),
        O('late', '밤을 새우는 날이 늘었습니다', 30, '촛불 아래에서 읽다가 아침마다 졸았습니다.', {stats:{행복:3, 건강:-1, 재산:-2}})]},
     {label:'돈을 아낀다', result:'옆집에서 다 읽은 신문을 얻어 봅니다.', effects:{stats:{}}}], .3);

  D('banquet-1847', 'politics', {minAge:25, fromYear:1847, toYear:1848, classes:['부르주아'], sexes:['남성']},
    '개혁 연회',
    '정치 집회가 금지되자 반대파가 ‘연회’를 열어 선거권 확대를 외칩니다. 세금을 200프랑 넘게 내는 사람만 투표할 수 있어서, 프랑스 전체에서 유권자는 25만 명도 안 됩니다.',
    [{label:'연회 표를 산다', preview:'개혁의 열기 / 경찰의 주목', outcomes:[
        O('default', '연회장에서 건배했습니다', 65, '“선거 개혁을 위하여!” 수백 명이 잔을 들었습니다. 몇 달 뒤 금지된 파리 연회가 2월 혁명의 불씨가 됩니다.', {path:{politics:'engaged'}, rep:3, stats:{재산:-2}}),
        O('watched', '경찰 명단에 올랐습니다', 35, '연회 참석자 명단이 도청에 넘어갔습니다.', {path:{politics:'engaged'}, stats:{행복:-2, 재산:-2}})]},
     {label:'질서를 지킨다', result:'기조 총리의 말대로 “부자가 되시오”라는 길을 택했습니다. 장사에 집중합니다.', effects:{stats:{재산:2}}}], .6);

  D('workers-association', 'relationships', {minAge:18, maxAge:55, classes:['도시 평민'], notPlaceIncludes:TOWN, hasJob:true},
    '노동자의 모임',
    '같은 직종 사람들이 모여 임금표를 지키자고 합니다. 노동자의 단합은 형법으로 금지되어 있고, 1834년 법으로 결사는 더 엄격히 막혔습니다. 겉으로는 상호부조회 간판을 답니다.',
    [{label:'모임에 들어간다', preview:'임금 인상 / 단합죄', outcomes:[
        O('default', '임금이 조금 올랐습니다', 50, '작업장 주인들이 한발 물러섰습니다. 아플 때 서로 돕는 기금도 생겼습니다.', {stats:{재산:3}, closeness:4, experience:{social:2}}),
        O('coalition', '단합죄로 기소되었습니다', 50, '주동자로 몰려 몇 주 동안 감옥에 있었습니다.', {stats:{건강:-4, 행복:-5, 재산:-3}, experience:{inequality:2}})]},
     {label:'혼자 일한다', result:'모임과 거리를 두었습니다.', effects:{stats:{}}}], .3);

  D('sibling-emigrates', 'family', {minAge:18, livingRolesAny:['형제자매'], fromYear:1830, toYear:1850},
    '바다 건너로 떠나는 형제',
    '형제자매 한 사람이 르아브르에서 배를 타고 아메리카로, 혹은 마르세유에서 알제리로 떠나겠다고 합니다. 뱃삯이 모자란다고 합니다.',
    [{label:'뱃삯을 보태 준다', preview:'편지가 옴 / 소식이 끊김', outcomes:[
        O('default', '몇 해 뒤 편지가 왔습니다', 55, '“뉴올리언스에서 작은 가게를 열었다.” 편지에는 낯선 지명과 함께 사진 대신 그림 한 장이 들어 있었습니다.', {stats:{재산:-4, 행복:3}, relationCloseness:{roles:['형제자매'], amount:6}}),
        O('silent', '소식이 끊겼습니다', 45, '배가 떠난 뒤로 편지 한 장 오지 않았습니다.', {stats:{재산:-4, 행복:-4}})]},
     {label:'말린다', preview:'남음 / 원망', outcomes:[
        O('default', '형제가 고향에 남았습니다', 50, '형제는 남았지만 한동안 말을 하지 않았습니다.', {relationCloseness:{roles:['형제자매'], amount:-4}}),
        O('left', '형제는 결국 떠났습니다', 50, '혼자 돈을 마련해 떠났습니다. 작별 인사도 제대로 하지 못했습니다.', {stats:{행복:-4}, relationCloseness:{roles:['형제자매'], amount:-8}})]}], .04);

  D('new-farming', 'economy', {minAge:20, classes:['농민'], fromYear:1830},
    '새 농법',
    '농업 품평회에서 철제 쟁기와 인공 목초지, 바다 건너온 비료 구아노를 소개합니다. 휴경지에 클로버를 심으면 소를 더 키울 수 있다고 합니다. 노인들은 고개를 젓습니다.',
    [{label:'새 쟁기와 비료를 들인다', requires:{minWealth:30}, preview:'수확 증가 / 빚', outcomes:[
        O('default', '수확이 늘었습니다', 55, '이웃들이 담장 너머로 당신 밭을 기웃거립니다.', {stats:{재산:8}, rep:2}, [{when:{minKnowledge:55}, amount:15}]),
        O('debt', '본전을 뽑지 못했습니다', 45, '흉년이 겹쳐 비료값만 빚으로 남았습니다.', {stats:{재산:-6}})]},
     {label:'하던 대로 한다', result:'아버지에게 배운 대로 삼포식으로 농사를 짓습니다.', effects:{stats:{}}}], .1);

  D('potato-blight', 'economy', {minAge:16, placeIncludes:TOWN, fromYear:1845, toYear:1846},
    '감자가 썩는다',
    '감자 잎에 검은 반점이 생기더니 땅속의 감자까지 썩어 들어갑니다. 아일랜드에서는 사람들이 굶어 죽고 있다고 합니다.',
    [{label:'남은 감자를 서둘러 캔다', preview:'일부 건짐 / 저장고까지 썩음', outcomes:[
        O('default', '절반은 건졌습니다', 55, '서둘러 캔 감자를 말려 저장했습니다.', {stats:{재산:-2}}),
        O('rot', '저장고에서도 썩었습니다', 45, '겨울이 오기 전에 저장고의 감자가 모두 물러졌습니다.', {stats:{재산:-5, 건강:-2}})]},
     {label:'밀과 메밀을 더 심는다', result:'내년에는 감자를 줄이고 곡물을 늘리기로 했습니다.', effects:{stats:{재산:-1}}}], .6);

  D('cure-ars', 'religion', {minAge:16, religions:['catholic'], places:['리옹','부르고뉴 농촌'], fromYear:1830, toYear:1850},
    '아르스의 본당 신부',
    '리옹 근처 아르스 마을의 비안네 신부에게 고해하려고 전국에서 순례자가 몰려듭니다. 신부는 하루 열여섯 시간씩 고해소에 앉아 있고, 사람들은 며칠씩 줄을 선다고 합니다.',
    [{label:'아르스로 순례를 간다', preview:'위로 / 헛걸음', outcomes:[
        O('default', '신부님께 고해했습니다', 60, '사흘을 기다려 고해소에 들어갔습니다. 신부님은 당신이 말하지 않은 것까지 아는 듯했습니다.', {stats:{행복:7, 재산:-2}, experience:{religious:3}}),
        O('crowd', '끝내 차례가 오지 않았습니다', 40, '인파가 너무 많았습니다. 성당 앞에서 기도만 하고 돌아왔습니다.', {stats:{행복:1, 재산:-2}, experience:{religious:1}})]},
     {label:'본당에서 고해한다', result:'익숙한 신부님에게 고해했습니다.', effects:{experience:{religious:1}}}], .1);

  D('rambuteau', 'housing', {minAge:20, places:['파리'], classes:['도시 평민'], fromYear:1833},
    '골목이 헐린다',
    '람뷔토 지사가 비좁은 골목을 헐고 넓은 길을 냅니다. 당신이 사는 건물도 철거 대상이라며 시청에서 보상금을 제시합니다.',
    [{label:'보상금을 받고 교외로 이사한다', preview:'넓은 집 / 먼 일터', outcomes:[
        O('default', '성벽 밖으로 이사했습니다', 55, '벨빌 언덕의 집은 볕이 잘 들고 집세도 쌉니다.', {stats:{재산:3, 건강:2}}),
        O('far', '일터가 너무 멀어졌습니다', 45, '새벽마다 한 시간을 걸어 시내로 들어갑니다.', {stats:{재산:2, 건강:-2, 행복:-2}})]},
     {label:'보상금을 올려 달라고 버틴다', preview:'더 받음 / 강제 철거', outcomes:[
        O('default', '보상금을 더 받았습니다', 45, '이웃들과 함께 버텼더니 시청이 조금 더 주었습니다.', {stats:{재산:5}, closeness:3}),
        O('evicted', '강제로 쫓겨났습니다', 55, '헌병이 와서 살림을 길에 내놓았습니다.', {stats:{재산:-3, 행복:-6}})]}], .3);

  D('bienfaisance', 'economy', {minAge:20, maxWealth:15, notPlaceIncludes:TOWN},
    '구호 사무소',
    '일감이 끊긴 지 여러 주입니다. 구청 구호 사무소에 이름을 올리면 빵 배급표와 땔감을 받을 수 있지만, 이웃들은 누가 명단에 있는지 다 압니다.',
    [{label:'명단에 이름을 올린다', preview:'겨울을 넘김 / 수치심', outcomes:[
        O('default', '겨울을 넘겼습니다', 65, '빵 배급표 덕분에 아이들이 굶지 않았습니다.', {stats:{건강:3, 행복:-2}}),
        O('shame', '수군거림을 들었습니다', 35, '배급 줄에서 아는 얼굴을 마주쳤습니다.', {stats:{건강:2, 행복:-5}})]},
     {label:'버틴다', result:'자존심을 지켰지만 몸이 상했습니다.', effects:{stats:{건강:-4}}}], .3);

  D('daguerre-portrait', 'family', {minAge:20, minWealth:50, fromYear:1842, notPlaceIncludes:TOWN},
    '가족 사진',
    '사진관에서 은판 사진을 찍어 준다고 합니다. 머리를 받침대에 고정하고 몇십 초 동안 움직이지 말아야 합니다. 값은 노동자 한 달 품삯만큼입니다.',
    [{label:'온 가족이 사진을 찍는다', preview:'잘 나옴 / 흐릿함', outcomes:[
        O('default', '선명하게 나왔습니다', 60, '은판 속에서 온 가족이 굳은 얼굴로 당신을 바라봅니다. 벽난로 위에 두었습니다.', {stats:{행복:5, 재산:-4}}),
        O('blur', '아이가 움직였습니다', 40, '막내 얼굴만 흐릿한 유령처럼 나왔습니다. 그래도 모두 웃었습니다.', {stats:{행복:3, 재산:-4}})]},
     {label:'화가에게 작은 초상을 맡긴다', result:'오래된 방식이 더 마음에 들었습니다.', effects:{stats:{재산:-2, 행복:2}}}], .3);

  D('icarians', 'housing', {minAge:20, maxAge:50, fromYear:1847, toYear:1848, classes:['도시 평민'], literacy:['basic','learning'], notPlaceIncludes:TOWN},
    '이카리아로',
    '카베의 소설 「이카리아 여행」을 읽은 노동자들이 재산을 함께 나누는 공동체를 세우러 아메리카 텍사스로 떠난다고 합니다. 첫 배가 1848년 2월 르아브르에서 출발합니다.',
    [{label:'떠나는 무리에 합류한다', preview:'돌아옴 / 열병', outcomes:[
        O('default', '실패하고 돌아왔습니다', 60, '약속받은 땅은 늪과 초원이었습니다. 열병으로 동료 여럿을 잃고 이듬해 돌아왔습니다.', {stats:{재산:-8, 건강:-6, 행복:-6}, experience:{curiosity:3}, milestone:'이카리아 공동체에 다녀옴'}),
        O('fever', '텍사스에서 돌아오지 못했습니다', 25, '말라리아에 쓰러졌습니다.', {doom:'1848년 이카리아 공동체를 찾아 떠난 텍사스에서 열병으로 세상을 떠났습니다.'}),
        O('nauvoo', '일리노이의 공동체에 남았습니다', 15, '몇 해를 공동체에서 살았지만 결국 고향이 그리워 돌아왔습니다.', {stats:{재산:-4, 행복:2}, experience:{social:3}})]},
     {label:'책만 읽는다', result:'공동체의 꿈은 책 속에 남겨 두었습니다.', effects:{stats:{지식:1}}}], .4);

  D('octroi', 'economy', {minAge:16, places:['파리'], classes:['도시 평민'], maxWealth:40},
    '성문 밖 포도주',
    '파리 성문에서는 들어오는 포도주마다 입시세를 매깁니다. 성문 밖에서 사서 몰래 들여오면 값이 절반입니다. 돼지 방광에 담아 치마 속에 숨기는 사람도 있습니다.',
    [{label:'몰래 들여온다', preview:'이득 / 적발', outcomes:[
        O('default', '무사히 들여왔습니다', 60, '세관원이 다른 사람을 붙잡는 사이 성문을 지났습니다.', {stats:{재산:2}}),
        O('caught', '세관원에게 걸렸습니다', 40, '벌금을 물고 포도주도 빼앗겼습니다.', {stats:{재산:-4, 행복:-2}})]},
     {label:'성문 밖 선술집에서 마신다', result:'일요일마다 성문 밖에서 싼 포도주를 마시고 들어옵니다.', effects:{stats:{행복:2, 재산:-1}}}], .25);

  D('auvergnat-paris', 'housing', {minAge:16, maxAge:30, sexes:['남성'], places:['오베르뉴 농촌'], fromYear:1830},
    '파리의 오베르뉴 사람들',
    '마을 남자들 상당수가 파리에서 물장수, 숯 장수, 포도주 장수로 일합니다. 사촌이 바스티유 근처 숯 가게에 자리를 마련해 주겠다고 합니다.',
    [{label:'파리로 올라간다', preview:'자리를 잡음 / 고된 일', outcomes:[
        O('default', '숯과 포도주를 파는 가게를 맡았습니다', 60, '얼굴은 늘 숯검정이지만, 같은 고향 사람들이 모이는 가게는 활기가 넘칩니다.', {place:'파리', job:'숯·포도주 장수', stats:{재산:4}, milestone:'파리로 이주'}),
        O('hard', '물지게가 무거웠습니다', 40, '새벽부터 물지게를 지고 오 층 계단을 오르내립니다.', {place:'파리', job:'물장수', stats:{재산:2, 건강:-3}, milestone:'파리로 이주'})]},
     {label:'고향에 남는다', result:'산과 목장을 지키기로 했습니다.', effects:{stats:{}}}], .4);

  D('femme-libre', 'politics', {minAge:18, maxAge:45, sexes:['여성'], places:['파리'], literacy:['basic'], fromYear:1832, toYear:1834},
    '「자유로운 여성」',
    '생시몽주의 여성 노동자들이 여성만 쓰고 여성만 펴내는 신문 「자유로운 여성」을 만들고 있습니다. 재봉사와 세탁부들이 글을 보냅니다. 기고자는 성 없이 이름만 씁니다.',
    [{label:'글을 보낸다', preview:'목소리를 냄 / 조롱', outcomes:[
        O('default', '글이 실렸습니다', 60, '“우리도 자유롭게 태어났다.” 당신의 글이 실린 호를 몇 장 사서 친구들에게 나눠 주었습니다.', {rep:4, experience:{inequality:3}, stats:{행복:4}}),
        O('mocked', '주변의 비웃음을 샀습니다', 40, '신문을 본 집주인이 혀를 찼고, 동네 남자들이 놀려 댔습니다.', {experience:{inequality:3}, stats:{행복:-3}})]},
     {label:'읽기만 한다', result:'몰래 신문을 사서 읽고 잘 접어 두었습니다.', effects:{experience:{inequality:1}}}], .5);

  D('school-parent', 'parenting', {minAge:24, childAge:[6, 12], fromYear:1834},
    '아이를 학교에 보낼까?',
    '기조 법 이후 코뮌마다 학교가 생겼고, 가난한 집은 수업료를 면제받을 수 있습니다. 그래도 아이가 학교에 가면 집안일과 들일을 도울 손이 줄어듭니다.',
    [{label:'학교에 보낸다', preview:'글을 깨침 / 자주 빠짐', outcomes:[
        O('default', '아이가 글을 깨쳤습니다', 60, '아이가 저녁마다 석판에 쓴 글자를 보여 줍니다.', {stats:{행복:3}, relationCloseness:{roles:['자녀'], amount:4}}),
        O('absent', '바쁜 철에는 자주 빠졌습니다', 40, '추수와 포도 수확 때마다 학교를 빠졌습니다.', {stats:{재산:1}})]},
     {label:'집안일을 돕게 한다', result:'아이는 집에서 일을 배웁니다.', effects:{stats:{재산:2}, relationCloseness:{roles:['자녀'], amount:-2}}}], .35);
})();
