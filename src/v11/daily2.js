// src/data/daily-extended.js
// Concrete everyday events by place, class, period, sex and life stage, in the manner of the Paris
// childhood set. Events with maxAge ≤ 11 join the childhood pool; the rest join the adult pool.
// Daily events fall in March, July and November, so `months` gives them a season.
(() => {
  const E = (id, kind, when, title, text, effects = {}, opts = {}) => {
    const child = when.maxAge !== undefined && when.maxAge <= 11;
    const specific = when.places || when.placeIncludes || when.classes || when.parentJobs || when.sexes;
    const category = opts.category || (when.fromYear || when.toYear || when.years ? 'historical' : specific ? 'personal' : 'universal');
    (child ? childhoodEvents : dailyEvents).push({id, kind, category, when, title, text,
      effects:{stats:effects.stats || {}, experience:effects.experience || {}, ...(effects.relationCloseness ? {relationCloseness:effects.relationCloseness} : {})},
      tags:['daily', child ? 'childhood' : 'life'], repeatable:opts.repeatable === true});
  };
  const C = '농촌';

  // ================= 유년기 (0–11) =================
  // 농촌
  E('c-geese', 'normal', {minAge:4, maxAge:8, placeIncludes:C}, '거위 지키기', '마을 공터에서 거위 떼를 지키는 일을 처음 맡았습니다. 대장 거위가 목을 길게 빼고 쫓아오자 혼비백산 달아났습니다.', {experience:{responsibility:1}});
  E('c-sabots', 'good', {minAge:3, maxAge:6, placeIncludes:C, livingRoles:['아버지']}, '새 나막신', '아버지가 겨울밤 난롯가에서 호두나무를 깎아 만든 나막신을 처음 신었습니다. 딸깍딸깍 소리가 좋아 온 마당을 뛰어다녔습니다.', {stats:{행복:2}, relationCloseness:{roles:['아버지'], amount:2}});
  E('c-veillee', 'good', {minAge:4, maxAge:11, placeIncludes:C, months:[11]}, '겨울밤 마실', '이웃집 외양간에 모여 실을 잣는 어른들 곁에서 늑대인간과 숲속 요정 이야기를 들었습니다. 소들의 입김 덕분에 외양간은 따뜻했습니다.', {stats:{행복:1}, experience:{curiosity:1, social:1}});
  E('c-gleaning', 'normal', {minAge:5, maxAge:11, placeIncludes:C, months:[7]}, '이삭줍기', '추수가 끝난 밭에서 다른 아이들과 이삭을 주웠습니다. 앞치마 가득 모은 이삭을 어머니께 드리자 머리를 쓰다듬어 주셨습니다.', {stats:{재산:1}, experience:{responsibility:1}});
  E('c-wolf', 'bad', {minAge:3, maxAge:9, placeIncludes:C}, '늑대 소문', '숲 가장자리에서 양을 물어 간 늑대가 나타났다는 소문이 돌았습니다. 한동안 해가 지기 전에 꼭 집에 들어와야 했습니다.', {stats:{행복:-1}});
  E('c-fever', 'bad', {minAge:2, maxAge:9, placeIncludes:C, months:[7]}, '여름 열병', '물웅덩이 근처에서 놀다가 열병에 걸려 며칠을 앓아누웠습니다. 어머니가 버드나무 껍질 달인 물을 먹였습니다.', {stats:{건강:-2}});
  E('c-pig', 'normal', {minAge:6, maxAge:11, placeIncludes:C, months:[11]}, '돼지 잡는 날', '집에서 돼지를 잡는 날입니다. 어른들이 순대와 소시지를 만드는 동안 당신은 피를 받는 그릇을 들고 서 있었습니다. 겨울 내내 먹을 고기입니다.', {experience:{familyTrade:1}});
  E('c-angelus', 'normal', {minAge:2, maxAge:6, placeIncludes:C}, '삼종 기도 종소리', '저녁 종이 울리자 밭에서 일하던 어른들이 모두 일손을 멈추고 모자를 벗은 채 기도했습니다. 당신도 따라서 손을 모았습니다.', {experience:{religious:1}});
  E('c-crayfish', 'good', {minAge:5, maxAge:11, placeIncludes:C, months:[7]}, '개울의 가재', '친구들과 바짓단을 걷고 개울에 들어가 돌 밑의 가재를 잡았습니다. 저녁 수프에 넣었더니 온 식구가 좋아했습니다.', {stats:{행복:2}, experience:{social:1}});
  E('c-hail', 'bad', {minAge:3, maxAge:11, placeIncludes:C, months:[7]}, '우박', '하늘이 갑자기 어두워지더니 우박이 쏟아졌습니다. 다 익어 가던 밀이 쓰러졌고, 그날 저녁 어른들은 말이 없었습니다.', {stats:{행복:-1, 재산:-1}});
  E('c-st-john', 'good', {minAge:3, maxAge:11, placeIncludes:C, months:[7]}, '성 요한 축일 모닥불', '한여름 성 요한 축일 밤, 마을 광장에 커다란 모닥불이 피었습니다. 형들이 불 위를 뛰어넘는 것을 손뼉 치며 구경했습니다.', {stats:{행복:2}, experience:{social:1}});
  E('c-breton', 'normal', {minAge:6, maxAge:11, places:['브르타뉴 농촌']}, '브르타뉴 말', '읍내에서 온 관리가 하는 프랑스어를 거의 알아듣지 못했습니다. 집에서도, 성당에서도 모두 브르타뉴 말을 씁니다.', {experience:{curiosity:1}});
  E('c-pardon', 'good', {minAge:4, maxAge:11, places:['브르타뉴 농촌'], months:[7]}, '파르동 순례', '마을 수호성인의 축일 순례(파르동) 행렬을 따라 걸었습니다. 깃발과 촛불, 하얀 레이스 머리쓰개를 쓴 여인들, 그리고 행렬 끝의 잔치.', {stats:{행복:2}, experience:{religious:1}});
  E('c-occitan', 'normal', {minAge:6, maxAge:11, places:['오베르뉴 농촌']}, '산골 말', '집에서는 오베르뉴 사투리(오크어)를 씁니다. 신부님만 미사 때 라틴어와 프랑스어를 섞어 말합니다.', {experience:{curiosity:1}});
  E('c-buron', 'normal', {minAge:6, maxAge:11, places:['오베르뉴 농촌'], months:[7]}, '산 위의 치즈 오두막', '여름 고원 목장의 돌 오두막(뷔롱)에 있는 아버지께 빵을 날라다 드렸습니다. 커다란 치즈를 누르는 모습을 오래 구경했습니다.', {experience:{familyTrade:1, curiosity:1}});
  E('c-vintage', 'good', {minAge:6, maxAge:11, places:['부르고뉴 농촌'], months:[11]}, '포도밭의 아이', '포도 수확 막바지, 아이들도 작은 바구니를 들고 포도밭에 나갔습니다. 손가락과 입가가 보랏빛으로 물들었습니다.', {stats:{행복:2}, experience:{familyTrade:1}});
  // 도시
  E('c-water-seller', 'normal', {minAge:3, maxAge:8, classes:['도시 평민']}, '물장수의 외침', '“물 사세요!” 물장수의 외침에 양동이를 들고 계단을 뛰어 내려갔습니다. 물 두 동이를 받아 오는 것이 아침 심부름입니다.', {experience:{responsibility:1}});
  E('c-street-song', 'good', {minAge:4, maxAge:10, classes:['도시 평민','부르주아']}, '광장의 노래꾼', '광장에서 새로 나온 노래를 부르며 가사지를 파는 노래꾼을 구경했습니다. 집에 와서 하루 종일 그 노래를 흥얼거렸습니다.', {stats:{행복:1}, experience:{curiosity:1}});
  E('c-workshop', 'normal', {minAge:6, maxAge:11, classes:['도시 평민'], livingRoles:['아버지']}, '작업장 심부름', '아버지의 작업장 바닥을 쓸고 직인들의 심부름을 했습니다. 어른들이 일하며 부르는 노래를 따라 불렀습니다.', {experience:{familyTrade:1}});
  E('c-gutter', 'bad', {minAge:3, maxAge:7, classes:['도시 평민','부르주아']}, '도랑에 빠지다', '비 오는 날 골목 한가운데로 흐르는 시궁창 도랑에 빠져 온몸이 더러워졌습니다. 마차가 튀긴 흙탕물까지 뒤집어썼습니다.', {stats:{건강:-1, 행복:-1}});
  E('c-puppets', 'good', {minAge:4, maxAge:10, places:['리옹'], fromYear:1810}, '기뇰 인형극', '광장 한쪽의 작은 무대에서 리옹 사투리로 떠드는 인형 기뇰이 경찰을 몽둥이로 때렸습니다. 아이들이 배를 잡고 웃었습니다.', {stats:{행복:2}});
  E('c-bread-line', 'bad', {minAge:5, maxAge:11, classes:['도시 평민'], maxWealth:40}, '빵집 앞 줄', '새벽부터 빵집 앞에 줄을 섰지만 차례가 오기 전에 빵이 떨어졌습니다. 빈손으로 돌아가는 길이 멀었습니다.', {stats:{행복:-1}});
  E('c-fire', 'bad', {minAge:3, maxAge:11, classes:['도시 평민','부르주아']}, '이웃집 화재', '건너편 건물에 불이 났습니다. 사람들이 줄을 서서 양동이를 날랐고, 당신은 어머니 치마폭을 잡고 떨었습니다.', {stats:{행복:-1}});
  E('c-cathedral', 'normal', {minAge:4, maxAge:10, classes:['도시 평민','부르주아','귀족']}, '대성당의 빛', '대성당의 높은 천장과 스테인드글라스로 들어오는 빛을 한참 올려다보았습니다. 목이 아플 때까지요.', {experience:{curiosity:1, religious:1}});
  E('c-port', 'good', {minAge:4, maxAge:11, places:['보르도']}, '항구의 큰 배', '가론강 부두에서 돛대가 숲처럼 늘어선 배들을 구경했습니다. 서인도에서 왔다는 선원이 앵무새를 보여 주었습니다.', {stats:{행복:2}, experience:{curiosity:2}});
  E('c-silk', 'normal', {minAge:6, maxAge:11, places:['리옹'], classes:['도시 평민']}, '직기 아래의 아이', '어머니가 견직기를 돌리는 동안 바닥에 떨어진 실 끝을 줍고 북에 실을 감는 일을 거들었습니다. 철컥철컥 소리가 자장가 같습니다.', {experience:{craft:1, familyTrade:1}});
  E('c-loire', 'good', {minAge:5, maxAge:11, places:['투르'], months:[7]}, '루아르 강가', '루아르강 모래톱에서 친구들과 물수제비를 떴습니다. 짐배가 바람을 받고 천천히 거슬러 올라갔습니다.', {stats:{행복:2}});
  // 부르주아·귀족
  E('c-harpsichord', 'normal', {minAge:6, maxAge:11, classes:['부르주아','귀족']}, '건반 교습', '음악 선생님이 일주일에 두 번 와서 건반 연주를 가르칩니다. 손가락이 마음대로 움직이지 않아 속상했습니다.', {stats:{지식:1}, experience:{educationInterest:1}});
  E('c-nurse', 'normal', {minAge:2, maxAge:6, classes:['귀족']}, '유모와 가정교사', '하루의 대부분을 유모 곁에서 보냅니다. 부모님께는 저녁마다 정해진 시간에 인사를 드리러 갑니다.', {experience:{responsibility:1}});
  E('c-fables', 'good', {minAge:6, maxAge:11, classes:['부르주아','귀족']}, '라 퐁텐 우화', '「까마귀와 여우」를 외워 손님들 앞에서 낭송했습니다. 어른들이 박수를 쳐 주었습니다.', {stats:{행복:1, 지식:1}, experience:{educationInterest:1}});
  E('c-hunt', 'normal', {minAge:8, maxAge:11, classes:['귀족'], sexes:['남성'], months:[11]}, '첫 사냥', '처음으로 아버지의 사냥에 따라나섰습니다. 사냥개들이 짖는 소리와 뿔나팔 소리에 가슴이 뛰었습니다.', {experience:{curiosity:1}});
  // 어디서나
  E('c-tooth', 'normal', {minAge:6, maxAge:7}, '빠진 이', '앞니가 흔들리더니 사과를 베어 물다 쑥 빠졌습니다. 빠진 이를 베개 밑에 넣어 두었습니다.', {});
  E('c-mardi-gras', 'good', {minAge:3, maxAge:10, months:[3]}, '사육제', '사순절이 시작되기 전 사육제 날, 얼굴에 검댕을 칠하고 친구들과 동네를 돌며 도넛 과자를 얻어먹었습니다.', {stats:{행복:2}, experience:{social:1}});
  E('c-lent', 'normal', {minAge:5, maxAge:11, months:[3], religions:['catholic']}, '사순절', '사순절이라 고기 대신 말린 대구와 콩만 먹습니다. 부활절이 오기만을 손꼽아 기다립니다.', {experience:{religious:1}});
  E('c-sibling-care', 'normal', {minAge:5, maxAge:11, livingRoles:['형제자매']}, '동생 업기', '어머니가 일하는 동안 어린 동생을 업고 돌보았습니다. 동생이 울음을 그칠 때까지 노래를 불러 주었습니다.', {experience:{responsibility:1}, relationCloseness:{roles:['형제자매'], amount:2}});
  E('c-grandma-frost', 'good', {minAge:3, maxAge:9, livingRoles:['할머니'], toYear:1785}, '할머니의 옛이야기', '할머니가 어릴 적 들었다는 1709년의 대혹한 이야기를 들려주었습니다. 포도주가 술통 안에서 얼고 새들이 날다가 떨어졌다고 합니다.', {stats:{행복:1}, experience:{curiosity:1}, relationCloseness:{roles:['할머니'], amount:2}});
  E('c-snow', 'good', {minAge:3, maxAge:11, months:[11]}, '첫눈', '아침에 일어나 보니 세상이 하얗게 덮여 있었습니다. 손이 빨개지도록 눈싸움을 했습니다.', {stats:{행복:2}});
  // 시대
  E('c-cockade', 'normal', {minAge:4, maxAge:11, fromYear:1789, toYear:1794}, '삼색 휘장', '어른들처럼 모자에 파랑·하양·빨강 휘장을 달고 다녔습니다. 휘장을 달지 않은 사람은 거리에서 핀잔을 들었습니다.', {experience:{curiosity:1}});
  E('c-ca-ira', 'good', {minAge:4, maxAge:11, fromYear:1790, toYear:1794}, '“사 이라!”', '아이들 사이에서 “사 이라, 사 이라!” 노래가 유행했습니다. 무슨 뜻인지도 모른 채 목청껏 따라 불렀습니다.', {stats:{행복:1}, experience:{social:1}});
  E('c-citizen', 'normal', {minAge:5, maxAge:11, fromYear:1792, toYear:1795}, '시민 아저씨', '어른들이 이제 서로 ‘무슈’ 대신 ‘시투아앵(시민)’이라고 부릅니다. 선생님도, 빵집 주인도 모두 시민입니다.', {experience:{curiosity:1}});
  E('c-decadi', 'normal', {minAge:6, maxAge:11, fromYear:1794, toYear:1801}, '열흘마다 쉬는 날', '새 달력에서는 일요일 대신 열흘째 날(데카디)에 쉽니다. 이번 달 이름은 ‘꽃의 달(플로레알)’이랍니다.', {experience:{curiosity:1}});
  E('c-victory-bells', 'good', {minAge:4, maxAge:11, fromYear:1805, toYear:1812}, '승전의 종', '먼 나라에서 이겼다는 소식에 성당 종이 울리고, 저녁에는 창마다 등불이 켜졌습니다.', {stats:{행복:1}});
  E('c-drummer', 'normal', {minAge:3, maxAge:11, fromYear:1800, toYear:1814}, '행군하는 군대', '군대가 마을을 지나갔습니다. 당신보다 조금 큰 소년 고수가 맨 앞에서 북을 치고 있었습니다.', {experience:{curiosity:1}});
  E('c-mission-cross', 'normal', {minAge:5, maxAge:11, fromYear:1816, toYear:1829, religions:['catholic']}, '선교회의 십자가', '선교 사제들이 몇 주 동안 머물며 설교한 뒤, 마을 어귀에 커다란 십자가를 세웠습니다. 온 마을이 행렬을 지어 따라갔습니다.', {experience:{religious:1}});
  E('c-gaslight', 'good', {minAge:4, maxAge:11, places:['파리'], fromYear:1829}, '가스등', '해가 지자 거리의 가스등이 하나둘 켜졌습니다. 기름 등잔과는 비교가 안 되게 밝습니다.', {stats:{행복:1}, experience:{curiosity:2}});

  // ================= 청년·장년기 (12+) =================
  // 농민
  E('p-harvest', 'good', {minAge:14, placeIncludes:C, months:[7]}, '밀 수확', '해 뜰 때부터 낫을 휘둘렀습니다. 한낮에는 밭둑 그늘에서 빵과 양파, 물 탄 포도주로 들밥을 먹었습니다. 올해는 곡식이 넉넉합니다.', {stats:{재산:2}}, {repeatable:true});
  E('p-rust', 'bad', {minAge:14, placeIncludes:C, months:[7]}, '깜부기병', '밀 이삭이 까맣게 병들어 속이 비었습니다. 올겨울 빵을 무엇으로 구울지 걱정입니다.', {stats:{재산:-2, 행복:-1}});
  E('p-tithe', 'bad', {minAge:14, placeIncludes:C, months:[7], toYear:1789}, '십일조', '십일조 징수인이 밭에 와서 볏단 열 개 중 하나를 골라 수레에 실었습니다. 가장 실한 단이었습니다.', {stats:{재산:-1}, experience:{inequality:1}});
  E('p-corvee', 'bad', {minAge:16, maxAge:55, placeIncludes:C, toYear:1786, sexes:['남성']}, '도로 부역', '국왕의 도로를 닦는 부역에 불려 나가 일주일 동안 돌을 날랐습니다. 그동안 내 밭은 손을 놓았습니다.', {stats:{건강:-1, 재산:-1}, experience:{inequality:1}});
  E('p-market', 'normal', {minAge:14, placeIncludes:C}, '읍내 장날', '달걀과 버터를 바구니에 담아 읍내 장에 나갔습니다. 소금값과 곡물값을 묻고 다니다 해 질 녘에 돌아왔습니다.', {stats:{재산:1}, experience:{commerce:1}}, {repeatable:true});
  E('p-sowing', 'normal', {minAge:14, placeIncludes:C, months:[3]}, '봄갈이', '얼었던 땅이 풀리자 소에 쟁기를 매어 밭을 갈고 귀리를 뿌렸습니다. 종일 소 엉덩이만 보고 걸었습니다.', {experience:{familyTrade:1}}, {repeatable:true});
  E('p-cow-sick', 'bad', {minAge:16, placeIncludes:C}, '병든 소', '집안의 가장 큰 재산인 소가 병들었습니다. 수의사 대신 동네 노인이 약초를 먹였지만 결국 쓰러졌습니다.', {stats:{재산:-3, 행복:-2}});
  E('p-calf', 'good', {minAge:14, placeIncludes:C, months:[3]}, '송아지', '새벽에 외양간에서 송아지가 태어났습니다. 밤새 어미 소 곁을 지킨 보람이 있습니다.', {stats:{재산:2, 행복:1}});
  E('p-wedding', 'good', {minAge:14, placeIncludes:C}, '이웃 혼례', '이웃 혼례 잔치에서 바이올린과 백파이프 소리에 맞춰 밤새 춤을 췄습니다. 이튿날까지 다리가 후들거렸습니다.', {stats:{행복:2}, experience:{social:1}});
  E('p-drought', 'bad', {minAge:16, placeIncludes:C, months:[7]}, '가뭄', '두 달째 비가 오지 않아 우물 바닥이 드러났습니다. 사제가 비를 비는 행렬을 이끌었습니다.', {stats:{건강:-1, 재산:-1}});
  E('p-commons', 'bad', {minAge:16, placeIncludes:C}, '공유지 다툼', '마을 공유지에 영주(혹은 부유한 농부)가 울타리를 쳤습니다. 가난한 집들은 소를 풀어 먹일 곳을 잃었습니다.', {stats:{재산:-1}, experience:{inequality:2}});
  E('p-vintage', 'good', {minAge:14, places:['부르고뉴 농촌'], months:[11]}, '포도 수확', '포도 따기 일꾼으로 나가 품삯을 받았습니다. 마지막 날에는 포도주 통 앞에서 수확 잔치가 벌어졌습니다.', {stats:{재산:2, 행복:1}}, {repeatable:true});
  E('p-new-wine', 'normal', {minAge:16, places:['부르고뉴 농촌'], months:[3]}, '새 포도주 맛보기', '겨울을 난 새 포도주를 처음 따라 보았습니다. 술 중개상이 고개를 갸웃하며 값을 매겼습니다.', {experience:{commerce:1}});
  E('p-transhumance', 'normal', {minAge:14, places:['오베르뉴 농촌'], months:[7]}, '여름 목장으로', '소 떼를 몰고 산 위 고원 목장으로 올라갔습니다. 석 달 동안 산에서 치즈를 만들며 지냅니다.', {stats:{건강:1}, experience:{familyTrade:1}}, {repeatable:true});
  E('p-tinker', 'normal', {minAge:16, maxAge:45, places:['오베르뉴 농촌'], months:[11], sexes:['남성']}, '떠나는 땜장이들', '겨울이 오자 마을 남자들이 냄비 땜장이와 물지게꾼이 되어 스페인과 파리로 떠났습니다. 봄에 돈을 벌어 돌아올 것입니다.', {experience:{curiosity:1}});
  E('p-seaweed', 'normal', {minAge:14, places:['브르타뉴 농촌'], months:[3]}, '해초 거두기', '바닷가에서 폭풍에 밀려온 해초를 수레 가득 걷어 밭 거름으로 썼습니다. 손이 소금에 터 갈라졌습니다.', {experience:{familyTrade:1}});
  E('p-cider', 'good', {minAge:14, places:['브르타뉴 농촌'], months:[11]}, '사과즙 짜기', '사과를 짓이겨 짜서 커다란 통에 시드르를 담갔습니다. 첫 잔을 이웃과 나눠 마셨습니다.', {stats:{행복:2}, experience:{social:1}});
  E('w-spinning', 'normal', {minAge:14, placeIncludes:C, sexes:['여성'], months:[11]}, '겨울밤 물레', '긴 겨울밤, 등잔 하나를 켜 놓고 이웃 여자들과 물레를 돌렸습니다. 실타래는 봄에 상인에게 팝니다.', {stats:{재산:1}, experience:{craft:1, social:1}}, {repeatable:true});
  E('w-lavoir', 'normal', {minAge:14, sexes:['여성'], classes:['농민','도시 평민']}, '빨래터', '빨래터에서 무릎을 꿇고 방망이질을 했습니다. 빨래보다 이웃 소문이 더 빨리 돌았습니다.', {experience:{social:1}}, {repeatable:true});
  // 도시 장인·노동자
  E('a-saint-monday', 'good', {minAge:16, classes:['도시 평민'], sexes:['남성']}, '‘성 월요일’', '일요일 다음 날인데도 동료 직인들이 “성 월요일”이라며 일손을 놓고 선술집으로 향했습니다. 당신도 따라가 포도주 한 병을 나눴습니다.', {stats:{행복:2, 재산:-1}, experience:{social:1}}, {repeatable:true});
  E('a-st-crispin', 'good', {minAge:14, parentJobs:['제화공'], months:[11]}, '성 크레팽 축일', '구두장이들의 수호성인 성 크레팽의 날. 작업장을 닫고 미사에 간 뒤 동업자들과 잔치를 벌였습니다.', {stats:{행복:2}, experience:{social:1, familyTrade:1}});
  E('a-pamphlet', 'normal', {minAge:14, parentJobs:['인쇄공'], toYear:1788}, '몰래 찍는 소책자', '밤늦게 인쇄소에서 검열을 거치지 않은 소책자를 찍는 일을 거들었습니다. 장관과 왕비를 비꼬는 내용이었습니다.', {stats:{지식:1}, experience:{curiosity:1, inequality:1}});
  E('a-silk-slump', 'bad', {minAge:14, places:['리옹'], classes:['도시 평민']}, '멈춘 직기', '견직물 주문이 끊겨 직기가 몇 주째 멈췄습니다. 상인은 공임을 깎자고 합니다.', {stats:{재산:-3, 행복:-1}, experience:{inequality:1}});
  E('a-rent', 'bad', {minAge:18, classes:['도시 평민'], maxWealth:50, months:[7]}, '집세 내는 날', '성 요한 축일 분기 집세를 내는 날입니다. 집주인이 계단 아래에서 기다리고 있었습니다.', {stats:{재산:-2}}, {repeatable:true});
  E('a-guinguette', 'good', {minAge:16, places:['파리'], fromYear:1785, months:[7]}, '성문 밖 선술집', '입시세 장벽 밖 선술집(갱게트)에서는 포도주가 시내보다 훨씬 쌉니다. 일요일 오후, 나무 그늘 아래서 춤을 췄습니다.', {stats:{행복:2, 재산:-1}, experience:{social:1}});
  E('a-cut', 'bad', {minAge:14, classes:['도시 평민'], hasJob:true}, '작업 중 부상', '서두르다 도구에 손을 깊이 베였습니다. 며칠 동안 일을 못 했습니다.', {stats:{건강:-1, 재산:-1}});
  E('a-livret', 'normal', {minAge:16, classes:['도시 평민'], fromYear:1803, hasJob:true}, '노동자 수첩', '새 법에 따라 노동자 수첩(리브레)을 만들어야 합니다. 일터를 옮길 때마다 주인의 서명을 받아 경찰에 보여야 합니다.', {experience:{inequality:1}});
  E('a-bread-price', 'bad', {minAge:16, years:[1788, 1789, 1795, 1812, 1816, 1817, 1846, 1847]}, '빵값', '빵 한 덩이 값이 하루 품삯의 절반을 넘었습니다. 수프에 빵을 덜 넣고 물을 더 부었습니다.', {stats:{재산:-2, 건강:-1}});
  E('a-reading-aloud', 'normal', {minAge:14, fromYear:1789, toYear:1799, classes:['도시 평민']}, '큰 소리로 읽는 신문', '선술집에서 글을 아는 사람이 신문을 큰 소리로 읽어 주었습니다. 모두 숨을 죽이고 의회 소식을 들었습니다.', {stats:{지식:1}, experience:{social:1}});
  E('a-indienne', 'normal', {minAge:14, places:['루앙']}, '옥양목 공장', '강가의 날염 공장에서 쏟아낸 염료 때문에 로베크 강물이 날마다 다른 색으로 흐릅니다. 루앙은 면직물로 먹고사는 도시입니다.', {experience:{curiosity:1}});
  E('a-port-work', 'good', {minAge:14, places:['보르도'], toYear:1806}, '부두의 하역 일', '서인도에서 들어온 설탕과 커피 자루를 날랐습니다. 하루 품삯이 좋았습니다.', {stats:{재산:2, 건강:-1}}, {repeatable:true});
  E('a-empty-port', 'bad', {minAge:14, places:['보르도'], fromYear:1807, toYear:1813}, '텅 빈 항구', '영국 해군의 봉쇄로 배가 들어오지 않습니다. 부두에는 일감을 찾는 사람만 가득합니다.', {stats:{재산:-3}});
  E('a-mutual', 'good', {minAge:18, classes:['도시 평민'], fromYear:1815}, '상호부조회', '같은 직종 사람들이 매달 조금씩 돈을 모아 아플 때 서로 돕는 상호부조회에 들었습니다.', {stats:{행복:1}, experience:{social:1, responsibility:1}});
  E('w-market', 'good', {minAge:16, sexes:['여성'], classes:['도시 평민']}, '시장 좌판', '새벽 시장에서 채소를 팔아 번 동전을 앞치마 주머니에 넣었습니다. 단골 손님이 하나 늘었습니다.', {stats:{재산:1}, experience:{commerce:1}}, {repeatable:true});
  E('w-midwife', 'normal', {minAge:20, sexes:['여성']}, '이웃의 출산', '한밤중에 이웃의 출산을 도우러 갔습니다. 산파와 함께 물을 끓이고 아기를 받았습니다.', {experience:{social:1, responsibility:1}});
  // 부르주아
  E('g-cafe', 'normal', {minAge:18, classes:['부르주아']}, '카페의 신문', '카페에서 커피 한 잔을 시켜 놓고 신문을 돌려 읽었습니다. 옆자리에서 정치 논쟁이 벌어졌습니다.', {stats:{지식:1}, experience:{social:1}}, {repeatable:true});
  E('g-rousseau', 'good', {minAge:16, classes:['부르주아','귀족'], literacy:['basic'], toYear:1800}, '루소의 소설', '루소의 「신엘로이즈」를 읽다가 밤을 꼬박 새웠습니다. 책장을 넘기며 몇 번이나 눈물을 훔쳤습니다.', {stats:{행복:1, 지식:1}, experience:{educationInterest:1}});
  E('g-theatre', 'good', {minAge:16, classes:['부르주아','귀족']}, '극장', '극장 일층 입석에서 몰리에르 희극을 보았습니다. 관객들이 배우에게 야유와 환호를 번갈아 보냈습니다.', {stats:{행복:2}, experience:{curiosity:1}});
  E('g-debtor', 'bad', {minAge:22, classes:['부르주아'], hasJob:true}, '파산한 거래처', '돈을 빌려준 거래처가 파산했다는 소식이 왔습니다. 공증인은 절반이라도 받으면 다행이라고 합니다.', {stats:{재산:-4}});
  E('g-assignat', 'bad', {minAge:18, fromYear:1793, toYear:1796, minWealth:30}, '휴지가 된 지폐', '아시냐 지폐의 값이 몇 달 사이에 몇 분의 일로 떨어졌습니다. 상인들은 지폐 대신 은화를 달라고 합니다.', {stats:{재산:-4, 행복:-1}});
  E('g-franc', 'normal', {minAge:16, fromYear:1803, toYear:1806}, '새 프랑 은화', '제1통령의 얼굴이 새겨진 새 프랑 은화를 처음 손에 쥐었습니다. 돈값이 안정될 것 같다는 말이 돕니다.', {experience:{commerce:1}});
  E('g-civil-code', 'normal', {minAge:22, fromYear:1804, toYear:1810, literacy:['basic']}, '민법전', '새로 나온 민법전을 사서 상속과 혼인에 관한 조항을 읽어 보았습니다. 이제 프랑스 어디서나 같은 법을 따릅니다.', {stats:{지식:1}});
  E('g-portrait', 'good', {minAge:25, minWealth:55}, '초상화', '화가에게 초상화를 맡겼습니다. 거실에 걸린 그림 속 자신이 조금 낯설었습니다.', {stats:{행복:2, 재산:-2}});
  E('g-daguerre', 'good', {minAge:16, fromYear:1840}, '은판 사진', '은판에 사람 얼굴을 그대로 옮긴다는 ‘다게레오타이프’를 처음 보았습니다. 사진사 앞에서 몇 분 동안 꼼짝 않고 앉아 있어야 했습니다.', {stats:{행복:1}, experience:{curiosity:2}});
  // 귀족
  E('n-court', 'good', {minAge:16, maxAge:25, classes:['귀족'], toYear:1788}, '베르사유 알현', '가문의 족보 심사를 통과해 베르사유 궁정에 나아가 국왕께 인사를 올렸습니다. 거울의 방은 숨 막히게 화려했습니다.', {stats:{행복:3, 재산:-3}, experience:{social:1}});
  E('n-debts', 'bad', {minAge:25, classes:['귀족']}, '가문의 빚', '체면을 유지하느라 쌓인 빚 때문에 숲 일부를 팔아야 했습니다.', {stats:{재산:-4}});
  E('n-struck-off', 'good', {minAge:16, classes:['귀족'], fromYear:1800, toYear:1803}, '망명자 명단에서 지워지다', '사면령으로 집안 이름이 망명자 명단에서 지워졌습니다. 팔리지 않은 땅 일부를 돌려받을 수 있다고 합니다.', {stats:{재산:4, 행복:3}});
  // 가족·노년
  E('f-first-words', 'good', {minAge:18, livingRoles:['자녀']}, '아이의 첫말', '아이가 처음으로 “엄마”, “아빠” 비슷한 소리를 냈습니다. 온 가족이 아이 주위에 모여들었습니다.', {stats:{행복:3}, relationCloseness:{roles:['자녀'], amount:3}});
  E('f-child-sick', 'bad', {minAge:18, livingRoles:['자녀']}, '아이의 열', '아이가 밤새 열이 올라 한숨도 자지 못했습니다. 다행히 사흘 만에 열이 내렸습니다.', {stats:{행복:-2, 건강:-1}});
  E('f-child-help', 'good', {minAge:30, livingRoles:['자녀']}, '다 큰 아이', '어느새 자란 아이가 일을 거들겠다며 나섰습니다. 손놀림이 제법입니다.', {stats:{행복:2}, relationCloseness:{roles:['자녀'], amount:2}});
  E('o-grandchild', 'good', {minAge:50, livingRoles:['자녀']}, '손주', '손주가 무릎에 올라와 옛날이야기를 졸랐습니다. 당신이 어릴 적 들은 이야기를 그대로 들려주었습니다.', {stats:{행복:3}});
  E('o-aches', 'bad', {minAge:58}, '쑤시는 무릎', '비가 오려는지 무릎과 허리가 쑤셨습니다. 예전처럼 하루 종일 일하기가 어렵습니다.', {stats:{건강:-1}}, {repeatable:true});
  E('o-bench', 'normal', {minAge:60}, '광장의 긴 의자', '오후 햇볕 아래 광장 의자에 앉아 지나가는 사람들을 구경했습니다. 옛 친구들이 하나둘 줄어듭니다.', {experience:{social:1}}, {repeatable:true});
  E('o-glasses', 'normal', {minAge:50, literacy:['basic']}, '안경', '글씨가 흐릿하게 보여 장터에서 안경을 샀습니다. 다시 책을 읽을 수 있게 되었습니다.', {stats:{재산:-1}});
  // 계절마다 돌아오는 일상 (반복 가능)
  E('p-haymaking', 'normal', {minAge:14, placeIncludes:C, months:[7]}, '건초 말리기', '온 식구가 나가 풀을 베고 뒤집어 말렸습니다. 소나기가 오기 전에 건초를 헛간에 들이느라 해 질 녘까지 뛰어다녔습니다.', {experience:{familyTrade:1}}, {repeatable:true});
  E('p-firewood', 'normal', {minAge:14, placeIncludes:C, months:[11]}, '땔감 모으기', '겨울을 나려고 공유림에서 마른 가지를 주워 지게에 졌습니다. 산림 감시인의 눈을 피해야 합니다.', {stats:{건강:-1, 재산:1}}, {repeatable:true});
  E('p-mass-square', 'normal', {minAge:14, placeIncludes:C, religions:['catholic']}, '미사 뒤 광장', '일요일 미사가 끝나자 사람들이 성당 앞 광장에 모여 날씨와 곡물값, 혼사 이야기를 나눴습니다.', {experience:{social:1}}, {repeatable:true});
  E('p-cattle-fair', 'good', {minAge:16, placeIncludes:C}, '가축 시장', '읍내 가축 시장에서 송아지를 제값에 팔았습니다. 거래가 끝나면 손바닥을 마주치고 술 한 잔을 삽니다.', {stats:{재산:2}, experience:{commerce:1}}, {repeatable:true});
  E('p-chestnuts', 'normal', {minAge:14, places:['오베르뉴 농촌','브르타뉴 농촌'], months:[11]}, '밤 줍기', '숲에서 밤을 자루 가득 주워 왔습니다. 겨울 내내 빵 대신 밤죽을 먹을 날도 있을 것입니다.', {stats:{재산:1}}, {repeatable:true});
  E('a-long-day', 'normal', {minAge:14, classes:['도시 평민'], hasJob:true}, '열네 시간', '해 뜨기 전에 작업장에 나가 등잔불 아래에서 일을 마쳤습니다. 오늘도 열네 시간을 일했습니다.', {stats:{재산:1, 건강:-1}}, {repeatable:true});
  E('a-cabaret', 'good', {minAge:16, classes:['도시 평민']}, '선술집의 노래', '일을 마치고 단골 선술집에서 동료들과 노래를 불렀습니다. 주인이 외상을 장부에 적었습니다.', {stats:{행복:2, 재산:-1}, experience:{social:1}}, {repeatable:true});
  E('a-pawn', 'bad', {minAge:18, classes:['도시 평민'], maxWealth:35}, '전당포', '월말이 되자 겨울 외투를 전당포에 맡기고 돈을 빌렸습니다. 날이 추워지기 전에 찾아와야 합니다.', {stats:{재산:-1, 행복:-1}}, {repeatable:true});
  E('a-sunday-walk', 'good', {minAge:14, classes:['도시 평민','부르주아'], months:[3,7]}, '일요일 산책', '일요일 오후, 가장 좋은 옷을 입고 성벽 산책로를 걸었습니다. 모두가 서로의 옷차림을 구경합니다.', {stats:{행복:2}}, {repeatable:true});
  E('g-ledger', 'normal', {minAge:18, classes:['부르주아'], hasJob:true}, '장부 정리', '밤늦게까지 촛불 아래에서 장부를 맞췄습니다. 몇 수가 맞지 않아 처음부터 다시 더했습니다.', {experience:{commerce:1}}, {repeatable:true});
  E('g-dinner', 'good', {minAge:20, classes:['부르주아','귀족']}, '저녁 초대', '이웃 집안의 저녁 식사에 초대받았습니다. 코스 요리 사이사이 혼처와 땅값 이야기가 오갔습니다.', {stats:{행복:2}, experience:{social:1}}, {repeatable:true});
  E('n-steward', 'normal', {minAge:20, classes:['귀족']}, '영지 관리인의 보고', '영지 관리인이 소작료와 숲 판매 장부를 들고 왔습니다. 올해 수입은 작년보다 조금 줄었습니다.', {experience:{commerce:1}}, {repeatable:true});
  // 시대 (청년·장년)
  E('x-guard-drill', 'normal', {minAge:16, maxAge:50, fromYear:1789, toYear:1791, sexes:['남성']}, '국민방위대 훈련', '일요일마다 광장에서 국민방위대 훈련을 받습니다. 총을 메고 줄을 맞추는 일이 생각보다 어렵습니다.', {experience:{responsibility:1, social:1}});
  E('x-maximum', 'bad', {minAge:16, fromYear:1793, toYear:1794}, '가격 상한령', '곡물과 생필품에 가격 상한이 매겨지자 가게 진열대가 텅 비었습니다. 물건은 뒷문으로만 오갑니다.', {stats:{재산:-1, 행복:-1}});
  E('x-suspects', 'bad', {minAge:18, fromYear:1793, toYear:1794}, '혐의자법', '이웃이 혐의자로 끌려갔습니다. 말 한마디, 편지 한 장도 조심해야 하는 나날입니다.', {stats:{행복:-2}, experience:{inequality:1}});
  E('x-amiens', 'good', {minAge:14, fromYear:1802, toYear:1802}, '아미앵 평화', '영국과 평화 조약이 맺어졌습니다. 10년 만의 평화에 사람들이 거리에서 축배를 들었습니다.', {stats:{행복:3}});
  E('x-concordat', 'good', {minAge:12, fromYear:1802, toYear:1803, religions:['catholic']}, '다시 울리는 종', '정교 협약으로 성당이 다시 문을 열고 부활절 종이 울렸습니다. 노인들이 울면서 미사에 들어갔습니다.', {stats:{행복:3}, experience:{religious:2}});
  E('x-bulletin', 'normal', {minAge:14, fromYear:1805, toYear:1812}, '대육군 공보', '일요일 미사 뒤 면장이 대육군 공보를 큰 소리로 읽었습니다. 먼 나라 이름의 승전이 이어집니다.', {experience:{curiosity:1}});
  E('x-sugar', 'bad', {minAge:14, fromYear:1810, toYear:1813}, '설탕이 없다', '대륙 봉쇄 탓에 설탕과 커피값이 하늘로 치솟았습니다. 치커리 뿌리를 볶아 커피 대신 마십니다.', {stats:{행복:-1, 재산:-1}});
  E('x-marie-louises', 'bad', {minAge:30, fromYear:1813, toYear:1814}, '어린 징집병들', '열여덟 살도 안 된 이웃 소년들까지 군대로 끌려갔습니다. 사람들은 그들을 ‘마리 루이즈’라 부릅니다.', {stats:{행복:-2}});
  E('x-billeting', 'bad', {minAge:16, fromYear:1815, toYear:1818}, '점령군 숙영', '동맹군 병사 두 명이 집에 묵게 되었습니다. 먹을 것과 땔감을 내줘야 합니다.', {stats:{재산:-2, 행복:-1}});
  E('x-penny-press', 'normal', {minAge:16, fromYear:1836, literacy:['basic','learning']}, '싼 신문', '광고를 실어 값을 반으로 낮춘 새 신문이 나왔습니다. 연재소설을 읽으려고 다음 호를 기다립니다.', {stats:{지식:1}, experience:{curiosity:1}});
  E('x-railway-works', 'normal', {minAge:16, fromYear:1841, toYear:1848}, '철도 공사판', '마을 근처로 철도가 지나간다며 측량사들이 말뚝을 박았습니다. 공사판 일꾼들이 몰려들었습니다.', {experience:{curiosity:1}});
})();
// The original generic events keep their effects but read like the rest of the set.
const GENERIC_REWRITE = {
  'daily-child-good-1':'골목 끝 집 아이와 구슬치기를 하다 금세 친해졌습니다. 해가 질 때까지 함께 놀다 둘 다 꾸중을 들었습니다.',
  'daily-child-good-2':'빵집 심부름을 한 푼도 틀리지 않고 해냈다며 어른에게 칭찬을 받았습니다. 거스름돈을 손에 꼭 쥐고 뛰어왔습니다.',
  'daily-child-good-3':'신부님(혹은 이웃 어른)에게서 처음 들어 보는 낱말과 먼 나라 이야기를 배웠습니다. 밤에 누워서도 그 이야기를 곱씹었습니다.',
  'daily-child-good-4':'온 가족이 제일 좋은 옷을 입고 장터 축제에 다녀왔습니다. 생강빵 한 조각을 얻어먹었습니다.',
  'daily-child-normal-1':'물을 길어 오고, 닭 모이를 주고, 바닥을 쓸었습니다. 해야 할 일은 매일 조금씩 늘어납니다.',
  'daily-child-normal-2':'창밖 나무의 잎 색이 바뀌고, 어른들은 다가올 계절 준비로 분주합니다. 장날 물건도 달라졌습니다.',
  'daily-child-normal-3':'가족을 따라 이웃집에 인사를 갔습니다. 어른들이 이야기하는 동안 얌전히 앉아 있느라 몸이 근질거렸습니다.',
  'daily-child-normal-4':'동네 아이들과 굴렁쇠를 굴리고 숨바꼭질을 했습니다. 늘 같은 놀이인데도 질리지 않습니다.',
  'daily-child-bad-1':'기침과 열로 사흘을 누워 지냈습니다. 어머니가 끓여 준 묽은 수프만 겨우 넘겼습니다.',
  'daily-child-bad-2':'제일 친한 친구와 놀이 규칙으로 다투었습니다. 며칠 동안 골목에서 마주쳐도 모른 척했습니다.',
  'daily-child-bad-3':'아버지의 일감이 줄어 저녁 식탁의 빵이 얇아졌습니다. 어른들이 밤늦게 낮은 목소리로 이야기했습니다.',
  'daily-child-bad-4':'아끼던 나무 팽이를 어디선가 잃어버렸습니다. 온 골목을 뒤졌지만 찾지 못했습니다.',
  'daily-adult-good-1':'맡은 일을 기한보다 일찍, 흠 없이 끝냈습니다. 주인이 다음 일감도 당신에게 맡기겠다고 했습니다.',
  'daily-adult-good-2':'멀리 떠난 옛 친구에게서 편지가 왔습니다. 글을 아는 이웃에게 읽어 달라고 해서 몇 번이고 다시 들었습니다.',
  'daily-adult-good-3':'장터 선술집에서 우연히 만난 행상에게 다른 고장의 일자리와 물가 소식을 들었습니다.',
  'daily-adult-good-4':'장날에 물건을 생각보다 좋은 값에 팔았습니다. 돌아오는 길에 아이들 몫으로 사탕 몇 알을 샀습니다.',
  'daily-adult-good-5':'친척 집안에 아기가 태어났다는 기쁜 소식에 온 가족이 모여 축배를 들었습니다.',
  'daily-adult-normal-1':'새벽 종소리에 일어나 일하고, 수프와 빵으로 저녁을 먹고, 등잔 기름을 아끼려 일찍 잠자리에 들었습니다.',
  'daily-adult-normal-2':'장터를 한 바퀴 돌며 밀값과 소금값을 물어보았습니다. 다들 값이 또 올랐다고 투덜댔습니다.',
  'daily-adult-normal-3':'우물가에서 이웃과 한참 이야기를 나눴습니다. 누구네 혼사와 누구네 송사, 읍내의 새 소식까지.',
  'daily-adult-normal-4':'겨울을 앞두고 지붕 새는 곳을 막고, 저장한 곡식과 기름, 땔감을 하나하나 셈했습니다.',
  'daily-adult-normal-5':'일터는 종일 정신없이 바빴습니다. 점심은 서서 빵 한 조각으로 때웠습니다.',
  'daily-adult-bad-1':'구두 밑창이 떨어지고 냄비에 구멍이 났습니다. 한꺼번에 고치느라 모아 둔 돈이 줄었습니다.',
  'daily-adult-bad-2':'몇 주째 쉬지 못하고 일했더니 몸이 무겁고 잠을 자도 피곤이 풀리지 않습니다.',
  'daily-adult-bad-3':'단골 주문이 끊기고 일감이 줄었습니다. 다른 일을 알아보러 다녀야 할 것 같습니다.',
  'daily-adult-bad-4':'별것 아닌 말 한마디가 와전되어 가까운 이와 서먹해졌습니다. 성당 앞에서 마주쳐도 인사만 하고 지나쳤습니다.',
  'daily-adult-bad-5':'오한과 몸살로 사흘 동안 일어나지 못했습니다. 그동안 일은 고스란히 밀렸습니다.',
  'farm-life':'계절에 맞춰 김을 매고, 울타리를 고치고, 가축을 돌봤습니다. 농사일에는 끝이 없습니다.'
};
for (const e of dailyEvents) if (GENERIC_REWRITE[e.id]) e.text = GENERIC_REWRITE[e.id];
// Prefer one-off, concrete events over repeatable generic ones when both are available.
// Order of preference: unseen one-off events, then specific repeatable ones, then the original generic set.
function preferFresh(s, events) {
  const fresh = events.filter(e => e.repeatable === false && !s.seenEvents?.includes(e.id));
  if (fresh.length && random(s) < .8) return fresh;
  const specific = events.filter(e => !/^daily-/.test(e.id));
  return specific.length && random(s) < .7 ? specific : events;
}
