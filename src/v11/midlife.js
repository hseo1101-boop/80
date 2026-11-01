// src/data/midlife.js
// The middle of a life (about 25–60): events tied to the work you actually do, to the household you
// keep and the body that ages, and to the region you live in. They join the adult daily pool as
// non-repeatable "personal" events, so a forty-year-old shopkeeper in Lyon stops living the same
// generic year as a farmhand in Brittany.
(() => {
  const E = (id, kind, when, title, text, effects = {}) => dailyEvents.push({id, kind, category:'personal', when, title, text,
    effects:{stats:effects.stats || {}, experience:effects.experience || {}, ...(effects.relationCloseness ? {relationCloseness:effects.relationCloseness} : {})},
    tags:['daily', 'life', 'midlife'], repeatable:false});
  const SHOP = '자영업자|상인|가게|도매상|장수', FARM = '농부|농민|소작', DAY = '임시 노동자|물장수|날품|국립 작업장', SERV = '하녀|하인|가정부|요리사',
    CRAFT = '작업장|장인|직물|제화|인쇄|도제|직인|견직|목수|대장', POLICE = '순경|경찰', CARE = '산파|의사|외과', TEACH = '교사', CLERGY = '수녀|사제|참사회원|신부';
  const M = {minAge:25, maxAge:62};

  // ───── 가게 ─────
  E('m-shop-ledger', 'bad', {...M, jobMatch:SHOP}, '외상 장부', '외상 장부를 넘겨 보니 석 달째 갚지 않은 이름이 열둘이었습니다. 그중 둘은 지난겨울에 세상을 떠났습니다.', {stats:{재산:-2}, experience:{commerce:1}});
  E('m-shop-thief', 'bad', {...M, jobMatch:SHOP}, '좀도둑', '장날 북새통에 진열대의 물건이 사라졌습니다. 뒤쫓아 갔지만 골목에서 놓쳤습니다.', {stats:{재산:-2, 행복:-1}});
  E('m-shop-patente', 'normal', {...M, jobMatch:SHOP, fromYear:1791}, '영업세', '구청에서 영업세(파탕트) 고지서가 왔습니다. 가게 크기와 창문 수에 따라 매긴다니, 창 하나를 판자로 막을까 진지하게 고민했습니다.', {stats:{재산:-1}, experience:{commerce:1}});
  E('m-shop-rival', 'bad', {...M, jobMatch:SHOP}, '건너편 새 가게', '길 건너에 같은 물건을 파는 가게가 문을 열었습니다. 값을 한 수 내려 붙였더니 단골 몇이 그쪽으로 건너갔습니다.', {stats:{재산:-2}, experience:{commerce:1}});
  E('m-shop-regular', 'good', {...M, jobMatch:SHOP}, '단골손님', '이십 년 단골인 노부인이 손녀를 데리고 와서 “이 집 물건이 제일이란다”라고 일러 주었습니다.', {stats:{행복:2}, experience:{social:1}});
  E('m-shop-window', 'good', {...M, jobMatch:SHOP, fromYear:1815, classes:['도시 평민','부르주아']}, '유리 진열창', '큰마음 먹고 가게 앞을 넓은 유리 진열창으로 바꾸었습니다. 지나가던 사람들이 걸음을 멈추고 들여다봅니다.', {stats:{재산:-2, 행복:2}, experience:{commerce:2}});
  E('m-shop-weights', 'normal', {...M, jobMatch:SHOP, fromYear:1840}, '미터법 저울', '올해부터 옛 단위인 리브르와 온스를 쓰면 벌금이라고 합니다. 새 킬로그램 추를 사 들이고, 손님들에게 몇 번이고 셈을 다시 해 주었습니다.', {stats:{재산:-1}, experience:{curiosity:1}});

  // ───── 농사 ─────
  E('m-farm-boundary', 'bad', {...M, classes:['농민'], placeIncludes:'농촌'}, '경계석 다툼', '이웃이 밤사이 밭 경계석을 한 뼘 옮겨 놓았습니다. 마을 원로들 앞에서 한바탕 언성을 높였지만 결론은 나지 않았습니다.', {stats:{행복:-2}, experience:{inequality:1}});
  E('m-farm-potato', 'normal', {...M, classes:['농민'], placeIncludes:'농촌', fromYear:1790, months:[3]}, '감자 심기', '돼지나 먹는 것이라던 감자를 밭 한 귀퉁이에 처음 심어 보았습니다. 흉년에 굶지 않으려면 뭐든 해 봐야 합니다.', {stats:{재산:1}, experience:{curiosity:1}});
  E('m-farm-well', 'good', {...M, classes:['농민'], placeIncludes:'농촌', months:[7]}, '새 우물', '이웃 셋과 품을 모아 마당에 우물을 팠습니다. 열두 자를 파 내려가자 찬물이 솟았습니다.', {stats:{건강:1, 행복:2}, experience:{social:1}});
  E('m-farm-heir', 'normal', {minAge:50, classes:['농민'], placeIncludes:'농촌', childAge:[18, 45]}, '땅을 나누다', '공증인 앞에서 얼마 안 되는 밭을 자식들 몫으로 나누었습니다. 똑같이 나누라는 새 법 때문에 한 사람 몫이 손바닥만 해졌습니다.', {experience:{responsibility:1}, relationCloseness:{roles:['자녀'], amount:1}});
  E('m-farm-scythe', 'bad', {minAge:42, classes:['농민'], placeIncludes:'농촌', months:[7]}, '예전 같지 않은 허리', '아들 또래 일꾼들과 나란히 낫질을 했는데, 해가 기울기도 전에 허리가 펴지지 않았습니다.', {stats:{건강:-1, 행복:-1}});
  E('m-farm-loan', 'bad', {...M, classes:['농민'], placeIncludes:'농촌', maxWealth:45}, '씨앗값 빚', '봄 씨앗값을 마을 부농에게 빌렸습니다. 가을에 곡식으로 갚되, 한 말에 반 말을 더 얹어 준다는 조건입니다.', {stats:{재산:-1}, experience:{inequality:1}});
  E('m-farm-plough', 'good', {...M, classes:['농민'], placeIncludes:'농촌', fromYear:1825, minWealth:40}, '쇠 쟁기', '나무 쟁기 대신 대장간에서 쇠 보습을 단 새 쟁기를 들였습니다. 흙이 깊게 뒤집히는 것이 눈에 보입니다.', {stats:{재산:1, 행복:1}, experience:{curiosity:1}});

  // ───── 날품 ─────
  E('m-day-greve', 'normal', {...M, jobMatch:DAY, places:['파리']}, '그레브 광장의 새벽', '새벽 다섯 시, 일감을 찾는 사내들 틈에 서서 십장의 손짓을 기다렸습니다. 오늘은 운 좋게 석재 나르는 일에 뽑혔습니다.', {stats:{재산:1}, experience:{social:1}});
  E('m-day-winter', 'bad', {...M, jobMatch:DAY, months:[11]}, '일 없는 겨울', '강이 얼고 공사가 멈추자 일감이 뚝 끊겼습니다. 외투를 전당포에 맡기고 빵을 샀습니다.', {stats:{재산:-2, 건강:-1}, experience:{inequality:1}});
  E('m-day-hand', 'bad', {...M, jobMatch:DAY}, '으스러진 손가락', '짐을 내리다 손가락이 돌 사이에 끼었습니다. 일주일 동안 품삯 없이 손을 싸매고 있었습니다.', {stats:{건강:-2, 재산:-1}});
  E('m-day-cheated', 'bad', {...M, jobMatch:DAY}, '떼인 품삯', '일주일 일한 품삯을 받으러 갔더니 주인이 공사가 끝나지 않았다며 절반만 주었습니다. 따질 곳이 없습니다.', {stats:{재산:-2, 행복:-2}, experience:{inequality:2}});
  E('m-day-works', 'good', {...M, jobMatch:DAY, places:['파리'], fromYear:1802, toYear:1813}, '황제의 공사판', '우르크 운하와 새 시장 공사장에 일손이 모자라 품삯이 올랐습니다. 몇 달은 고기 냄새를 맡으며 살았습니다.', {stats:{재산:2}});

  // ───── 하녀·하인 ─────
  E('m-serv-suspect', 'bad', {...M, jobMatch:SERV}, '은수저 한 벌', '주인집 은수저 한 벌이 없어지자 모두의 눈이 당신에게 쏠렸습니다. 사흘 뒤 찬장 뒤에서 나왔지만, 아무도 사과하지 않았습니다.', {stats:{행복:-3}, experience:{inequality:2}});
  E('m-serv-sunday', 'good', {...M, jobMatch:SERV}, '일요일 오후', '한 달에 한 번 얻는 일요일 오후, 같은 고향 출신 하녀들과 성곽 밖 선술집에서 춤을 추었습니다.', {stats:{행복:3}, experience:{social:1}});
  E('m-serv-home', 'normal', {...M, jobMatch:SERV}, '고향에 부치는 돈', '모은 품삯을 고향 가는 짐마차꾼 편에 부쳤습니다. 글을 아는 동료가 대신 편지를 써 주었습니다.', {stats:{재산:-1}, experience:{responsibility:1}});
  E('m-serv-mistress', 'normal', {...M, jobMatch:SERV}, '새 마님', '주인 나리가 재혼해 새 마님이 들어왔습니다. 첫날부터 은그릇 닦는 법이 틀렸다며 처음부터 다시 하게 했습니다.', {stats:{행복:-1}});

  // ───── 작업장 ─────
  E('m-craft-apprentice', 'normal', {...M, jobMatch:'작업장 주인|장인|작업장 감독'}, '도제를 들이다', '열세 살 아이를 도제로 받았습니다. 부모가 계약서에 서명 대신 십자를 그렸고, 아이는 그날 밤 다락에서 울었습니다.', {experience:{responsibility:2}});
  E('m-craft-compagnons', 'normal', {...M, jobMatch:CRAFT, sexes:['남성']}, '직인 조합', '프랑스 일주를 하는 직인들이 지팡이와 리본을 달고 작업장에 들렀습니다. 그들만 아는 인사말과 노래가 있습니다.', {experience:{social:1, craft:1}});
  E('m-craft-livret', 'normal', {...M, jobMatch:CRAFT, fromYear:1803}, '노동자 수첩', '새 작업장으로 옮기려면 노동자 수첩(리브레)에 옛 주인의 서명을 받아야 합니다. 빚이 남았다며 주인이 서명을 미뤘습니다.', {stats:{행복:-1}, experience:{inequality:1}});
  E('m-craft-order', 'good', {...M, jobMatch:CRAFT}, '큰 주문', '좋은 집안의 혼례를 앞두고 큰 주문이 들어왔습니다. 석 달 동안 밤늦게까지 등잔을 켰지만 주머니가 두둑해졌습니다.', {stats:{재산:3, 건강:-1}, experience:{craft:1}});
  E('m-craft-machine', 'bad', {...M, jobMatch:CRAFT, fromYear:1820, classes:['도시 평민']}, '기계가 들어온 작업장', '근처 공장에 새 기계가 들어와 같은 물건을 반값에 찍어 낸다고 합니다. 주문이 눈에 띄게 줄었습니다.', {stats:{재산:-2, 행복:-1}, experience:{inequality:1}});
  E('m-craft-lungs', 'bad', {minAge:40, jobMatch:CRAFT}, '작업장의 기침', '먼지와 기름 연기 속에서 이십 년을 일했더니 아침마다 기침이 멎지 않습니다.', {stats:{건강:-2}});
  E('m-silk-down', 'bad', {...M, places:['리옹'], jobMatch:'직물|견직|작업장|도제'}, '견직 불황', '파리의 유행이 바뀌어 비단 주문이 끊겼습니다. 언덕 위 크루아루스의 직기들이 하나둘 멈췄습니다.', {stats:{재산:-3}, experience:{inequality:1}});

  // ───── 순경·의료·교사·성직 ─────
  E('m-police-night', 'normal', {...M, jobMatch:POLICE}, '야간 순찰', '등불을 들고 밤거리를 돌았습니다. 술 취한 직인 둘을 떼어 놓고, 길 잃은 아이를 집에 데려다주었습니다.', {experience:{responsibility:1}});
  E('m-police-informer', 'normal', {...M, jobMatch:POLICE, fromYear:1800}, '밀고장', '이웃이 이웃을 고발하는 쪽지가 매주 책상에 쌓입니다. 대부분은 빚이나 질투에서 나온 것입니다.', {experience:{inequality:1}});
  E('m-care-night', 'normal', {...M, jobMatch:CARE}, '한밤의 문 두드림', '자정이 넘어 문을 두드리는 소리에 가방을 챙겨 나섰습니다. 진흙길을 한 시간 걸어 도착하니 동이 트기 전이었습니다.', {stats:{건강:-1}, experience:{responsibility:2}});
  E('m-care-hard', 'bad', {...M, jobMatch:'산파'}, '어려운 출산', '아기가 거꾸로 들어선 출산이었습니다. 아이는 살렸지만 어머니는 사흘 뒤 열병으로 떠났습니다.', {stats:{행복:-3}, experience:{responsibility:1}});
  E('m-care-vaccine', 'good', {...M, jobMatch:CARE, fromYear:1801}, '우두 접종', '마을 아이들에게 우두를 접종했습니다. 소의 고름을 넣는다는 말에 겁먹은 부모들을 한 집씩 찾아가 설득했습니다.', {stats:{행복:2}, experience:{curiosity:1, responsibility:1}});
  E('m-teach-inspect', 'normal', {...M, jobMatch:TEACH, fromYear:1834}, '장학관의 방문', '새 초등교육법에 따라 장학관이 교실을 둘러보았습니다. 아이들이 받아쓰기를 하는 동안 장부를 한 장 한 장 넘겼습니다.', {experience:{educationInterest:1}});
  E('m-teach-pupil', 'good', {...M, jobMatch:TEACH}, '글을 깨친 아이', '가을 내내 더듬거리던 대장장이 아들이 처음으로 한 쪽을 막힘없이 읽었습니다. 아이보다 당신이 더 기뻤습니다.', {stats:{행복:3}, experience:{educationInterest:1}});
  E('m-clergy-confession', 'normal', {...M, jobMatch:CLERGY}, '부활절 고해', '부활절을 앞두고 줄지은 고해를 들었습니다. 이웃의 비밀을 너무 많이 알게 되는 것도 짐입니다.', {experience:{religious:1}});

  // ───── 집안 ─────
  E('m-teen-quarrel', 'bad', {...M, childAge:[13, 17]}, '말대꾸', '열몇 살 아이가 처음으로 정면에서 말대꾸를 했습니다. 문을 쾅 닫고 나간 뒤 저녁 식탁이 조용했습니다.', {stats:{행복:-1}, relationCloseness:{roles:['자녀'], amount:-1}});
  E('m-child-apprentice', 'normal', {...M, childAge:[12, 15], classes:['도시 평민','농민']}, '아이를 도제로', '아이를 남의 작업장에 도제로 보냈습니다. 보따리 하나 들고 돌아보지 않으려 애쓰는 뒷모습을 오래 지켜봤습니다.', {stats:{행복:-1, 재산:1}, experience:{responsibility:1}});
  E('m-dowry-chest', 'normal', {...M, childAge:[14, 22], childSex:'여성'}, '혼수 궤짝', '딸의 혼수 궤짝에 홑이불과 수건을 한 장씩 모아 넣고 있습니다. 머리글자 수는 딸이 직접 놓았습니다.', {stats:{재산:-1}, relationCloseness:{roles:['자녀'], amount:2}});
  E('m-grandchild', 'good', {minAge:42, childAge:[20, 40]}, '첫 손주', '첫 손주가 태어났습니다. 세례식에서 대부모가 아기를 안는 동안, 당신은 맨 뒷줄에서 몰래 눈가를 훔쳤습니다.', {stats:{행복:4}, experience:{social:1}, relationCloseness:{roles:['자녀'], amount:2}});
  E('m-old-parent', 'normal', {...M, parentAgeMin:66}, '늙은 부모', '나이 드신 부모님이 계단을 오르내리기 힘들어하셔서 침대를 아래층 부엌 옆으로 옮겼습니다.', {stats:{행복:-1}, experience:{responsibility:2}});
  E('m-spouse-evening', 'good', {...M, livingRoles:['배우자']}, '난롯가의 저녁', '아이들이 잠든 뒤 배우자와 난롯가에 앉아 오랜만에 젊을 적 이야기를 했습니다. 둘 다 그때보다 많이 웃었습니다.', {stats:{행복:3}, relationCloseness:{roles:['배우자'], amount:3}});
  E('m-spouse-quarrel', 'bad', {...M, livingRoles:['배우자']}, '돈 문제로 다툼', '선술집 외상값 때문에 배우자와 크게 다투었습니다. 사흘 동안 서로 필요한 말만 했습니다.', {stats:{행복:-2}, relationCloseness:{roles:['배우자'], amount:-2}});
  E('m-friend-funeral', 'bad', {minAge:45}, '친구의 장례', '어릴 적부터 알던 친구의 장례 행렬을 따라 묘지까지 걸었습니다. 같은 해에 태어난 사람들이 하나둘 줄어 갑니다.', {stats:{행복:-3}});
  E('m-teeth', 'bad', {minAge:40}, '빠진 어금니', '어금니가 아파 장터 이 뽑는 사람에게 갔습니다. 북 치는 소리에 비명이 묻혔고, 한쪽으로만 씹게 되었습니다.', {stats:{건강:-1}});
  E('m-spectacles', 'normal', {minAge:44, literacy:['basic']}, '돋보기', '글씨가 흐려 보여 행상에게서 돋보기안경을 샀습니다. 코에 걸자 세상이 다시 또렷해졌습니다.', {stats:{재산:-1, 행복:1}});
  E('m-gray', 'normal', {minAge:38, maxAge:50}, '흰머리', '우물물에 비친 얼굴을 보다가 귀밑의 흰머리를 발견했습니다. 어머니가 꼭 이 나이에 그랬던 것 같습니다.', {});
  E('m-savings', 'good', {...M, minWealth:45}, '양말 속 금화', '침대 밑 양말 속에 모은 돈을 세어 보니 생각보다 많았습니다. 처음으로 늙어서 굶지는 않겠다는 생각이 들었습니다.', {stats:{행복:2}});
  E('m-caisse-epargne', 'good', {...M, fromYear:1818, minWealth:35, classes:['도시 평민','부르주아']}, '저축 금고', '새로 생긴 저축 금고(케스 데파르뉴)에 처음으로 몇 프랑을 맡겼습니다. 이름이 적힌 작은 통장을 받았습니다.', {stats:{재산:1, 행복:1}, experience:{commerce:1}});

  // ───── 지역 ─────
  E('m-bzh-pardon', 'good', {...M, places:['브르타뉴 농촌'], months:[7]}, '대파르동', '생탄 도레의 대파르동에 걸어서 다녀왔습니다. 수만 명이 촛불을 들고 밤새 브르타뉴 말로 노래했습니다.', {stats:{행복:3}, experience:{religious:2}});
  E('m-bzh-wreck', 'normal', {...M, places:['브르타뉴 농촌'], months:[11]}, '난파선', '폭풍이 지나간 아침, 해안에 배 한 척이 부서져 있었습니다. 마을 사람들이 앞다투어 통과 널빤지를 주워 갔습니다.', {stats:{재산:1}, experience:{inequality:1}});
  E('m-auv-migrant', 'normal', {...M, places:['오베르뉴 농촌'], sexes:['남성'], months:[11]}, '겨울 돈벌이', '추수가 끝나자 마을 사내들과 함께 파리로 겨울 돈벌이를 떠났습니다. 물을 나르고 숯을 팔아 봄에 돌아올 것입니다.', {stats:{재산:2, 건강:-1}, experience:{curiosity:1}});
  E('m-auv-cheese', 'good', {...M, places:['오베르뉴 농촌'], months:[7]}, '고원의 치즈', '여름 고원 목장에서 만든 커다란 치즈가 장에서 좋은 값을 받았습니다.', {stats:{재산:2}});
  E('m-bourg-frost', 'bad', {...M, places:['부르고뉴 농촌'], months:[3]}, '봄 서리', '새순이 돋은 포도밭에 늦서리가 내렸습니다. 밤새 밭고랑에 짚불을 피웠지만 절반은 까맣게 탔습니다.', {stats:{재산:-3, 행복:-2}});
  E('m-bourg-vintage', 'good', {...M, places:['부르고뉴 농촌'], months:[11]}, '좋은 해의 포도주', '올해 포도주는 빛깔이 깊고 맛이 부드럽습니다. 본의 중개상이 술통을 두드려 보더니 값을 후하게 불렀습니다.', {stats:{재산:3, 행복:2}});
  E('m-bdx-quay', 'normal', {...M, places:['보르도']}, '샤르트롱 부두', '샤르트롱 부두에서 포도주 통을 굴려 배에 싣는 소리가 종일 그치지 않습니다. 영어와 네덜란드어가 프랑스어만큼 들립니다.', {experience:{commerce:1, curiosity:1}});
  E('m-bdx-blockade', 'bad', {...M, places:['보르도'], fromYear:1806, toYear:1813}, '텅 빈 항구', '대륙 봉쇄로 영국 배가 끊기자 항구에 돛대가 사라졌습니다. 술통이 창고에서 먼지를 뒤집어쓰고 있습니다.', {stats:{재산:-3}, experience:{inequality:1}});
  E('m-rouen-cotton', 'normal', {...M, places:['루앙']}, '면직 공장의 종', '센강 계곡의 면직 공장에서 새벽 종이 울리면 아이들까지 줄지어 공장 문으로 들어갑니다.', {experience:{inequality:1}});
  E('m-tours-loire', 'bad', {...M, places:['투르'], months:[3]}, '루아르 범람', '눈 녹은 물로 루아르강이 둑을 넘었습니다. 강가 집들의 아래층이 무릎까지 잠겼습니다.', {stats:{재산:-2, 건강:-1}});
  E('m-paris-omnibus', 'good', {...M, places:['파리'], fromYear:1828}, '합승 마차', '새로 생긴 합승 마차(옴니버스)를 처음 타 보았습니다. 몇 수만 내면 파리 반대편까지 앉아서 갑니다.', {stats:{행복:2}, experience:{curiosity:1}});
  E('m-lyon-croix', 'normal', {...M, places:['리옹'], fromYear:1815}, '크루아루스 언덕', '직기 높이에 맞춰 천장이 높은 크루아루스의 새 건물들로 직조공들이 옮겨 가고 있습니다. 비 오는 날엔 트라불(골목 통로)로 비단을 나릅니다.', {experience:{curiosity:1}});

  // ───── 흔한 어려움, 사람과 시대에 맞춰 ─────
  E('m-taille', 'bad', {...M, classes:['농민'], toYear:1789}, '타유세 징수', '타유세 징수원이 마을 명부를 들고 왔습니다. 지붕을 새로 이은 집일수록 세금이 오른다는 소문에 모두 낡은 지붕을 그대로 둡니다.', {stats:{재산:-2}, experience:{inequality:2}});
  E('m-contrib', 'bad', {...M, classes:['농민','도시 평민'], fromYear:1798}, '문과 창문의 세금', '문과 창문 수에 매기는 세금 고지서가 왔습니다. 집 뒤 창 하나를 벽돌로 막아 버리는 집이 늘었습니다.', {stats:{재산:-2}, experience:{inequality:1}});
  E('m-rent', 'bad', {...M, classes:['도시 평민'], months:[3, 7]}, '집세 날', '분기 집세를 내는 날입니다. 집주인이 내년부터 집세를 올리겠다고 했습니다. 다락방으로 옮길까 셈해 보았습니다.', {stats:{재산:-2, 행복:-1}});
  E('m-dysentery', 'bad', {...M, months:[7]}, '여름 설사병', '무더위에 우물물이 상해 온 동네에 설사병이 돌았습니다. 당신도 열흘을 앓았고, 이웃집 아이 둘이 세상을 떠났습니다.', {stats:{건강:-3, 행복:-1}});
  E('m-hen-thief', 'bad', {...M, placeIncludes:'농촌'}, '사라진 닭', '밤사이 닭장의 암탉 세 마리가 사라졌습니다. 여우인지 떠돌이인지, 아침 들판엔 깃털만 흩어져 있었습니다.', {stats:{재산:-1, 행복:-1}});
  E('m-barn-fire', 'bad', {...M, placeIncludes:'농촌', months:[7]}, '헛간의 불', '마른 짚단에 불이 붙어 헛간 한쪽이 탔습니다. 온 마을이 양동이를 들고 달려와 집채로 번지는 것만은 막았습니다.', {stats:{재산:-3, 행복:-1}, experience:{social:1}});
  E('m-lavoir-row', 'bad', {...M, sexes:['여성'], classes:['농민','도시 평민']}, '빨래터 말다툼', '빨래터 자리를 두고 이웃 여자와 말다툼이 붙었습니다. 그 집 딸 혼삿말까지 들먹이고 말아, 한동안 눈을 피해 다녔습니다.', {stats:{행복:-2}, experience:{social:1}});
  E('m-mother-in-law', 'normal', {...M, sexes:['여성'], livingRoles:['배우자'], placeIncludes:'농촌'}, '시댁의 부엌', '시어머니는 아직도 수프에 소금을 얼마나 넣는지 지켜봅니다. 부엌의 주인은 여전히 그분입니다.', {stats:{행복:-1}});
  E('m-hunger-gap', 'bad', {...M, maxWealth:35, months:[3]}, '보릿고개', '지난가을 곡식이 바닥났는데 새 곡식은 아직 멀었습니다. 밤과 메밀죽으로 한 달을 버텼습니다.', {stats:{건강:-1, 행복:-1}, experience:{inequality:1}});
  E('m-lawsuit', 'bad', {...M, minWealth:30}, '송사', '물려받은 땅 한 뙈기를 두고 사촌과 송사가 붙었습니다. 공증인과 변호사에게 낸 돈이 땅값만큼 들었습니다.', {stats:{재산:-3, 행복:-2}});
  E('m-cholera-fear', 'bad', {...M, years:[1832, 1849]}, '콜레라 소문', '파란 얼굴로 하루 만에 죽는 병이 돈다는 소문에 식초로 손을 씻고, 우물물을 끓여 마셨습니다. 장례 행렬이 하루에도 몇 번씩 지나갔습니다.', {stats:{행복:-2}});
  E('m-fair-day', 'normal', {...M}, '성인 축일 장', '수호성인 축일 장이 섰습니다. 약장수와 줄타기꾼, 이 뽑는 사람이 한꺼번에 광장을 차지했습니다.', {stats:{행복:1}, experience:{social:1}});
  E('m-letter-writer', 'normal', {...M, literacy:['none']}, '대서인', '관청에 낼 청원서를 쓰려고 장터의 대서인에게 몇 수를 냈습니다. 그가 읽어 주는 문장이 내가 한 말 같지 않았습니다.', {stats:{재산:-1}, experience:{educationInterest:1}});
  E('m-reading-aloud', 'good', {...M, literacy:['basic'], fromYear:1789}, '읽어 주는 사람', '저녁마다 이웃들이 모여 당신이 신문을 소리 내어 읽는 것을 듣습니다. 글을 안다는 것이 이렇게 사람을 모읍니다.', {stats:{행복:2}, experience:{social:1}});
})();
