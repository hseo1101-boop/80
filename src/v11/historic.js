// src/data/decisions-historic.js
// "역사의 현장": decisions that open in the very month a historical event happened, when the player is
// there and fits (place, age, sex, job). `doom` outcomes end the life after the result is acknowledged.
DECISION_DOMAINS.push({id:'history', label:'역사의 현장', target:0});
(() => {
  const H = (id, date, when, title, text, choices) => decisions.push({id, domain:'history', priority:30, historic:true, title, text,
    when:{...when, fromDate:date, toDate:date, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{...(c.effects || {}), flags:[id]}}))});
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});
  const stay = (result = '문을 걸어 잠그고 집에 머물렀습니다. 바깥의 함성은 밤늦게까지 이어졌습니다.') => ({label:'집에 머문다', result, effects:{stats:{}}});
  const SOLDIER = '군';

  H('balloon-1783', [1783,11], {minAge:5, places:['파리']},
    '하늘을 나는 사람',
    '오늘 라 뮈에트 성 정원에서 몽골피에 형제의 열기구가 사람을 태우고 떠오른다고 합니다. 온 파리가 구경하러 몰려갑니다.',
    [{label:'구경하러 간다', result:'커다란 풍선이 천천히 떠올라 센강 너머로 사라졌습니다. 사람들이 모자를 던지며 환호했습니다. 평생 잊지 못할 장면입니다.', effects:{stats:{행복:5, 지식:2}, experience:{curiosity:3}, milestone:'최초의 유인 열기구 비행을 목격'}},
     stay('일 때문에 가지 못했습니다. 저녁에 이웃들이 하늘을 나는 사람 이야기로 떠들썩했습니다.')]);

  H('bastille', [1789,7], {minAge:15, maxAge:65, places:['파리']},
    '바스티유로!',
    '7월 14일 아침. 앵발리드에서 총을 손에 넣은 군중이 화약을 찾아 생앙투안 문 쪽의 바스티유 요새로 몰려갑니다. 거리마다 경종이 울립니다.',
    [{label:'군중과 함께 요새로 간다', preview:'함락의 현장 / 부상 / 전사', outcomes:[
        O('victor', '바스티유가 함락되었습니다', 80, '오후 다섯 시, 도개교가 내려왔습니다. 당신은 함성 속에서 요새 안마당에 들어섰습니다. 훗날 ‘바스티유 정복자’ 명단에 이름이 오릅니다.', {stats:{행복:8, 지식:3}, experience:{social:3, inequality:2}, path:{politics:'engaged'}, milestone:'바스티유 함락에 참여'}),
        O('wounded', '총탄에 다쳤습니다', 16, '요새 위에서 쏜 총알이 팔을 스쳤습니다. 피를 흘리며 끌려 나왔지만, 저녁에 요새가 함락되었다는 소식을 들었습니다.', {stats:{건강:-12, 행복:2}, milestone:'바스티유 공격 중 부상'}),
        O('killed', '돌아오지 못했습니다', 4, '안마당 앞에서 쓰러졌습니다. 이날 공격자 가운데 약 백 명이 목숨을 잃었습니다.', {doom:'1789년 7월 14일, 바스티유 공격 중 목숨을 잃었습니다.'})]},
     {label:'바리케이드용 돌과 음식을 나른다', result:'멀리서 총성을 들으며 사람들에게 빵과 물을 날랐습니다.', effects:{stats:{행복:3}, closeness:3, experience:{social:2}}},
     stay()]);

  H('versailles-march', [1789,10], {minAge:15, maxAge:60, places:['파리'], classes:['도시 평민']},
    '빵을 달라, 베르사유로',
    '10월 5일, 빵을 구하지 못한 시장 아낙들이 시청 앞에 모여 베르사유로 걸어가자고 외칩니다. 비가 내리는데도 행렬은 수천 명으로 불어납니다.',
    [{label:'행렬에 합류한다', preview:'국왕 일가를 파리로 / 혼란 속 부상', outcomes:[
        O('baker', '“빵집 주인과 안주인, 꼬마 견습생”을 데려왔습니다', 85, '밤새 궁 앞에서 버텼습니다. 이튿날 국왕 일가가 파리로 옮겨 가는 마차 행렬을 따라 걸어왔습니다.', {stats:{행복:6, 건강:-3}, experience:{social:3}, path:{politics:'engaged'}, milestone:'베르사유 행진에 참여'}),
        O('hurt', '궁 안의 소동 속에 다쳤습니다', 15, '새벽에 궁에 몰려든 무리 속에서 넘어져 다쳤습니다.', {stats:{건강:-9}})]},
     stay('행렬이 지나가는 것을 창가에서 지켜보았습니다.')]);

  H('federation', [1790,7], {minAge:16, maxAge:55},
    '연맹제',
    '바스티유 함락 1주년, 파리 샹 드 마르스에서 전국의 국민방위대 대표가 모여 국민과 법과 국왕에게 충성을 맹세합니다. 마을마다 같은 날 축제가 열립니다.',
    [{label:'축제에 참여해 맹세한다', result:'제단 앞에서 사람들과 함께 손을 들어 맹세했습니다. 신분이 다른 사람들이 한 식탁에 앉았습니다.', effects:{stats:{행복:7}, closeness:3, experience:{social:2}, milestone:'1790년 연맹제 참가'}},
     {label:'조용히 지켜본다', result:'멀리서 북소리와 함성을 들었습니다.', effects:{stats:{행복:2}}}]);

  H('champ-de-mars', [1791,7], {minAge:16, maxAge:60, places:['파리']},
    '샹 드 마르스의 청원',
    '국왕이 도주하다 붙잡힌 뒤, 코르들리에 클럽이 국왕 폐위 청원서에 서명하자며 샹 드 마르스로 사람들을 부릅니다. 계엄령이 내렸다는 소문도 돕니다.',
    [{label:'청원서에 서명하러 간다', preview:'무사 / 발포', outcomes:[
        O('signed', '이름을 남기고 돌아왔습니다', 70, '조국의 제단 위 청원서에 이름을 적었습니다. 저녁 무렵 그곳에서 총성이 울렸다는 소식을 듣고 몸서리쳤습니다.', {stats:{지식:2}, path:{politics:'engaged'}}),
        O('fired', '국민방위대가 발포했습니다', 27, '붉은 깃발이 오르고 총성이 울렸습니다. 사람들 틈에 넘어져 다쳤습니다.', {stats:{건강:-8, 행복:-6}, experience:{inequality:2}}),
        O('killed', '총탄을 피하지 못했습니다', 3, '그날 샹 드 마르스에서 수십 명이 목숨을 잃었습니다.', {doom:'1791년 샹 드 마르스 학살 때 목숨을 잃었습니다.'})]},
     stay()]);

  H('volunteers-1792', [1792,7], {minAge:18, maxAge:30, sexes:['남성']},
    '조국이 위험에 처했다',
    '의회가 “조국이 위험에 처했다”고 선언했습니다. 광장에 천막이 세워지고 의용병 명부가 펼쳐졌습니다.',
    [{label:'의용병으로 지원한다', result:'명부에 이름을 적고 삼색 휘장을 받았습니다. 며칠 뒤 대대와 함께 동부 전선으로 떠납니다.', effects:{job:'군인', stats:{행복:3, 건강:-1}, experience:{responsibility:2}, milestone:'1792년 의용병 지원'}},
     {label:'가족을 위해 남는다', result:'떠나는 친구들을 배웅했습니다.', effects:{stats:{}}}]);

  H('tuileries', [1792,8], {minAge:16, maxAge:55, places:['파리'], classes:['도시 평민']},
    '8월 10일, 튈르리 궁',
    '경종이 밤새 울렸습니다. 구역의 상퀼로트와 마르세유 연맹병이 튈르리 궁으로 진격합니다. 궁은 스위스 근위대가 지키고 있습니다.',
    [{label:'구역 대대와 함께 진격한다', preview:'왕정의 몰락 / 부상 / 전사', outcomes:[
        O('fall', '왕정이 무너졌습니다', 75, '궁이 함락되고 국왕 일가는 의회로 피신했습니다. 왕정의 마지막 날을 눈앞에서 보았습니다.', {stats:{행복:4, 지식:2}, path:{politics:'engaged'}, milestone:'튈르리 궁 공격에 참여'}),
        O('wounded', '계단에서 총상을 입었습니다', 18, '근위대의 일제 사격에 쓰러졌다가 동료들에게 업혀 나왔습니다.', {stats:{건강:-14}, milestone:'튈르리 궁 공격 중 부상'}),
        O('killed', '궁 앞마당에서 쓰러졌습니다', 7, '이날 공격자 가운데 수백 명이 죽거나 다쳤습니다.', {doom:'1792년 8월 10일 튈르리 궁 공격 중 목숨을 잃었습니다.'})]},
     stay()]);

  H('valmy', [1792,9], {minAge:16, maxAge:50, jobMatch:SOLDIER},
    '발미의 포성',
    '9월 20일, 발미 언덕. 프로이센군이 안개 속에서 다가옵니다. 켈레르만 장군이 모자를 칼끝에 걸고 “국민 만세!”를 외칩니다.',
    [{label:'대열을 지키며 함께 외친다', preview:'승리 / 포탄에 부상', outcomes:[
        O('held', '프로이센군이 물러났습니다', 85, '포격전 끝에 적이 물러났습니다. 이튿날 공화국이 선포되었다는 소식이 전해졌습니다.', {stats:{행복:6}, experience:{responsibility:2}, milestone:'발미 전투 참전'}),
        O('hit', '포탄 파편에 맞았습니다', 15, '야전 병원에서 몇 주를 보냈습니다.', {stats:{건강:-12}, milestone:'발미 전투에서 부상'})]},
     {label:'두려움에 대열 뒤로 물러난다', result:'부끄러웠지만 살아남았습니다.', effects:{stats:{행복:-4}}}]);

  H('king-execution', [1793,1], {minAge:14, places:['파리']},
    '혁명 광장의 아침',
    '1월 21일. 시민 루이 카페가 혁명 광장의 단두대에 오릅니다. 새벽부터 북소리가 울리고 군대가 길을 막고 있습니다.',
    [{label:'광장으로 간다', result:'군중 사이로 북소리가 그치는 순간을 보았습니다. 누군가는 환호했고, 누군가는 고개를 돌렸습니다.', effects:{stats:{행복:-3, 지식:2}, experience:{inequality:1}, milestone:'루이 16세의 처형을 목격'}},
     {label:'집에서 조용히 기도한다', result:'창을 닫고 기도했습니다. 성당 종은 울리지 않았습니다.', effects:{stats:{행복:-1}, experience:{religious:2}}},
     stay('일터에 나갔습니다. 거리는 이상하리만치 조용했습니다.')]);

  H('chouans', [1793,3], {minAge:16, maxAge:50, sexes:['남성'], places:['브르타뉴 농촌']},
    '30만 명 징집령과 서부의 봉기',
    '공화국이 30만 명을 징집한다는 소식에 서부의 마을들이 들고일어났습니다. 숲에서 올빼미 울음을 신호로 쓰는 ‘슈앙’들이 사람을 모읍니다.',
    [{label:'슈앙에 가담한다', preview:'숲속의 전쟁 / 체포 / 전사', outcomes:[
        O('woods', '숲에서 몇 해를 버텼습니다', 60, '낮에는 밭을 갈고 밤에는 숲에서 공화국군 호송대를 습격했습니다. 마을 사람들이 몰래 먹을 것을 날라 주었습니다.', {stats:{건강:-5, 행복:-2}, experience:{religious:2, social:2}, milestone:'슈앙 봉기 가담'}),
        O('caught', '공화국군에게 붙잡혔습니다', 30, '감옥에서 몇 달을 보내고 사면으로 풀려났습니다.', {stats:{건강:-10, 재산:-6, 행복:-6}}),
        O('killed', '숲에서 돌아오지 못했습니다', 10, '매복전 끝에 쓰러졌습니다.', {doom:'1793년 서부 봉기에 가담했다가 전사했습니다.'})]},
     {label:'징집에 응한다', result:'공화국군에 입대했습니다. 고향 사람들은 등을 돌렸습니다.', effects:{job:'군인', closeness:-5, stats:{행복:-3}}},
     {label:'아무 편도 들지 않고 숨어 지낸다', result:'양쪽의 눈을 피해 숨죽이며 지냈습니다.', effects:{stats:{행복:-4, 재산:-3}}}]);

  H('siege-lyon', [1793,8], {minAge:14, maxAge:65, places:['리옹']},
    '리옹 포위전',
    '리옹이 국민공회에 맞서 봉기하자 공화국군이 도시를 포위했습니다. 포탄이 떨어지고 빵이 바닥나고 있습니다.',
    [{label:'성벽 방어에 나선다', preview:'버팀 / 함락 후 처벌 / 전사', outcomes:[
        O('survived', '두 달을 버텼습니다', 50, '10월에 도시가 함락되었습니다. 당신은 이름이 명부에 오르지 않아 살아남았습니다.', {stats:{건강:-6, 재산:-8, 행복:-6}, milestone:'리옹 포위전'}),
        O('jailed', '함락 뒤 투옥되었습니다', 35, '혁명 재판소에 끌려갔다가 겨우 풀려났습니다. 많은 이웃이 브로토 평원에서 총살되었습니다.', {stats:{건강:-10, 행복:-10, 재산:-10}, experience:{inequality:3}}),
        O('killed', '포탄에 쓰러졌습니다', 15, '푸르비에르 언덕 아래에서 쓰러졌습니다.', {doom:'1793년 리옹 포위전에서 목숨을 잃었습니다.'})]},
     {label:'시골로 몰래 빠져나간다', result:'밤에 론강을 건너 친척 집으로 피신했습니다. 집과 작업장은 남겨 두었습니다.', effects:{stats:{재산:-10, 행복:-4}}},
     stay('지하실에 숨어 포격을 견뎠습니다.')]);

  H('supreme-being', [1794,6], {minAge:6, places:['파리']},
    '최고 존재의 제전',
    '로베스피에르가 주관하는 ‘최고 존재의 제전’이 열립니다. 꽃과 이삭을 든 시민들이 샹 드 마르스의 인공 산까지 행진합니다.',
    [{label:'꽃을 들고 행진한다', result:'화가 다비드가 꾸민 거대한 무대를 보았습니다. 사람들은 즐거워했지만, 뒤에서는 수군거림도 들렸습니다.', effects:{stats:{행복:4}, experience:{social:1}, milestone:'최고 존재의 제전 참가'}},
     stay('행렬을 피해 골목길로 다녔습니다.')]);

  H('thermidor', [1794,7], {minAge:16, maxAge:65, places:['파리'], classes:['도시 평민','부르주아']},
    '테르미도르 9일 밤',
    '국민공회가 로베스피에르를 체포했습니다. 파리 코뮌은 그를 구하자고 구역들에 경종을 울립니다. 어느 쪽에 설지 정해야 합니다.',
    [{label:'시청 앞 코뮌 편으로 간다', preview:'해산 / 체포', outcomes:[
        O('dispersed', '비가 내리고 사람들이 흩어졌습니다', 70, '자정이 넘자 광장의 사람들이 하나둘 돌아갔습니다. 당신도 집으로 돌아왔습니다.', {stats:{행복:-3}}),
        O('arrested', '체포 명단에 올랐습니다', 30, '몇 주를 감옥에서 보냈습니다.', {stats:{건강:-6, 행복:-6, 재산:-4}})]},
     {label:'국민공회 편에 선다', result:'국민공회 군대와 함께 시청으로 갔습니다. 공포정치가 끝났습니다.', effects:{stats:{행복:4}, milestone:'테르미도르 9일'}},
     stay('창밖으로 빗소리와 경종 소리를 들었습니다.')]);

  H('vendemiaire', [1795,10], {minAge:16, maxAge:60, places:['파리'], classes:['부르주아']},
    '방데미에르 13일',
    '왕당파에 가까운 구역들이 국민공회에 맞서 무장했습니다. 국민공회는 젊은 포병 장교 보나파르트에게 방어를 맡겼다고 합니다.',
    [{label:'구역 대대와 함께 행진한다', preview:'후퇴 / 포도탄', outcomes:[
        O('retreat', '포격에 밀려 후퇴했습니다', 75, '생로크 성당 앞에서 대포가 불을 뿜었습니다. 겨우 몸을 피했습니다.', {stats:{행복:-4, 건강:-3}}),
        O('killed', '포도탄을 피하지 못했습니다', 25, '성당 계단 위에서 쓰러졌습니다.', {doom:'1795년 방데미에르 13일 봉기 때 목숨을 잃었습니다.'})]},
     stay('대포 소리가 멎을 때까지 가게 문을 닫아 두었습니다.')]);

  H('coronation', [1804,12], {minAge:6, places:['파리']},
    '노트르담의 대관식',
    '12월 2일, 나폴레옹이 노트르담 대성당에서 황제로 즉위합니다. 몹시 추운 날인데도 거리는 구경꾼으로 가득합니다.',
    [{label:'행렬을 보러 나간다', result:'금빛 마차가 지나갈 때 사람들이 “황제 만세!”를 외쳤습니다. 손이 꽁꽁 얼었습니다.', effects:{stats:{행복:4, 건강:-1}, milestone:'나폴레옹 대관식 행렬을 봄'}},
     {label:'장식 일을 맡아 품삯을 번다', result:'개선 장식과 등불을 다는 일을 했습니다.', effects:{stats:{재산:4}}},
     stay('따뜻한 집에서 이웃이 전해 주는 이야기를 들었습니다.')]);

  H('austerlitz', [1805,12], {minAge:16, maxAge:50, jobMatch:SOLDIER},
    '아우스터리츠의 태양',
    '12월 2일 새벽, 프라첸 고지의 안개가 걷히고 해가 떠오릅니다. 대열 앞으로 공격 명령이 내려옵니다.',
    [{label:'고지로 돌격한다', preview:'대승 / 부상', outcomes:[
        O('glory', '대승을 거두었습니다', 85, '저녁에 황제가 병사들 앞을 지나갔습니다. “아우스터리츠에 있었다고만 말하라. 그러면 사람들이 ‘용사로군!’ 할 것이다.”', {stats:{행복:8}, milestone:'아우스터리츠 전투 참전'}),
        O('wounded', '총상을 입었습니다', 15, '얼어붙은 들판에서 들것에 실려 나왔습니다.', {stats:{건강:-14}, milestone:'아우스터리츠에서 부상'})]},
     {label:'예비대에 남기를 청한다', result:'후방에서 포성을 들었습니다.', effects:{stats:{}}}]);

  H('russia', [1812,6], {minAge:16, maxAge:50, jobMatch:SOLDIER},
    '네만강을 건너',
    '대육군 60만이 네만강을 건너 러시아로 들어갑니다. 끝없는 평원과 먼지, 그리고 아직은 여름입니다.',
    [{label:'본대와 함께 모스크바로 행군한다', preview:'귀환 / 포로 / 전사', outcomes:[
        O('returned', '살아서 돌아왔습니다', 30, '모스크바가 불타는 것을 보았고, 베레지나강을 건넜습니다. 얼어붙은 발가락 둘을 잃고 돌아왔습니다.', {stats:{건강:-18, 행복:-10}, milestone:'러시아 원정에서 생환'}),
        O('captured', '러시아군의 포로가 되었습니다', 25, '시베리아 근처 수용소에서 2년을 보내고 귀국했습니다.', {stats:{건강:-14, 행복:-8, 재산:-6}, milestone:'러시아 포로 생활'}),
        O('killed', '눈밭에서 돌아오지 못했습니다', 45, '퇴각길의 추위와 굶주림 속에서 쓰러졌습니다. 이 원정에서 수십만 명이 돌아오지 못했습니다.', {doom:'1812년 러시아 원정에서 돌아오지 못했습니다.'})]},
     {label:'보급 부대 전출을 청한다', preview:'후방 근무 / 그래도 퇴각길', outcomes:[
        O('rear', '폴란드의 보급 기지에 남았습니다', 70, '전선의 참상을 소문으로만 들었습니다.', {stats:{건강:-4}}),
        O('retreat', '결국 퇴각길에 휩쓸렸습니다', 30, '굶주림과 추위 속에서 겨우 살아 돌아왔습니다.', {stats:{건강:-14, 행복:-8}})]}]);

  H('hundred-days', [1815,3], {minAge:16, maxAge:65, places:['리옹','파리']},
    '황제가 돌아왔다',
    '엘바섬을 탈출한 나폴레옹이 군대를 이끌고 북쪽으로 올라오고 있습니다. 보내진 군대마다 오히려 황제 편으로 넘어간다고 합니다.',
    [{label:'거리로 나가 황제를 맞는다', result:'“황제 만세!” 함성 속에 삼색 휘장을 다시 달았습니다.', effects:{stats:{행복:5}, path:{politics:'engaged'}, milestone:'백일천하 때 황제를 맞이함'}},
     {label:'국왕에 대한 충성을 지킨다', result:'흰 휘장을 서랍 깊이 넣어 두었습니다. 조용히 때를 기다립니다.', effects:{stats:{행복:-2}}},
     stay('이번에도 세상이 바뀌는 것을 창밖으로 지켜보았습니다.')]);

  H('waterloo', [1815,6], {minAge:16, maxAge:55, jobMatch:SOLDIER},
    '몽생장의 들판',
    '6월 18일, 비에 젖은 벨기에의 들판. 정오에 포격이 시작되고, 저녁에는 근위대가 마지막 돌격에 나섭니다.',
    [{label:'끝까지 대열을 지킨다', preview:'패주 / 부상 / 전사', outcomes:[
        O('rout', '패주 속에 살아남았습니다', 60, '프로이센군이 나타나자 대열이 무너졌습니다. 밤새 남쪽으로 걸었습니다.', {stats:{행복:-8, 건강:-4}, milestone:'워털루 전투 참전'}),
        O('wounded', '다리에 총상을 입었습니다', 25, '들판에서 하루를 꼬박 누워 있다가 구조되었습니다.', {stats:{건강:-16, 행복:-6}, milestone:'워털루에서 부상'}),
        O('killed', '들판에서 쓰러졌습니다', 15, '이날 하루에만 수만 명이 죽거나 다쳤습니다.', {doom:'1815년 워털루 전투에서 전사했습니다.'})]},
     {label:'짐마차 호송을 자원한다', result:'후방에서 패전 소식을 들었습니다.', effects:{stats:{행복:-4}}}]);

  H('trois-glorieuses', [1830,7], {minAge:15, maxAge:65, places:['파리'], classes:['도시 평민','부르주아']},
    '영광의 사흘',
    '국왕이 언론을 묶는 칙령을 내렸습니다. 인쇄공들이 먼저 거리로 나왔고, 골목마다 포석을 뜯어 바리케이드를 쌓습니다.',
    [{label:'바리케이드에 선다', preview:'승리 / 부상 / 전사', outcomes:[
        O('won', '사흘 만에 이겼습니다', 80, '시청 꼭대기에 삼색기가 올랐습니다. 훗날 ‘7월 훈장’ 명단에 이름이 오릅니다.', {stats:{행복:8}, path:{politics:'engaged'}, milestone:'7월 혁명 바리케이드'}),
        O('wounded', '스위스 근위대의 총에 맞았습니다', 16, '루브르 근처에서 다쳤습니다.', {stats:{건강:-12, 행복:2}, milestone:'7월 혁명 중 부상'}),
        O('killed', '바리케이드에서 쓰러졌습니다', 4, '사흘 동안 수백 명의 시민이 목숨을 잃었습니다. 훗날 바스티유 광장 7월 기념탑 아래 묻힙니다.', {doom:'1830년 7월 혁명의 바리케이드에서 목숨을 잃었습니다.'})]},
     {label:'다친 사람을 돌본다', result:'집을 임시 구호소로 내주고 붕대를 감았습니다.', effects:{stats:{행복:4}, closeness:4, experience:{social:2}}},
     stay()]);

  H('canuts', [1831,11], {minAge:15, maxAge:60, places:['리옹'], classes:['도시 평민']},
    '“일하며 살거나, 싸우다 죽거나”',
    '견직물 공임표가 무시되자 크루아루스 언덕의 견직공들이 검은 깃발을 들고 내려옵니다.',
    [{label:'검은 깃발을 따라간다', preview:'도시 장악 / 부상 / 전사', outcomes:[
        O('held', '며칠 동안 도시를 장악했습니다', 75, '군대가 물러났다가 다시 돌아왔습니다. 공임표는 끝내 지켜지지 않았습니다.', {stats:{행복:-2, 재산:-3}, experience:{inequality:3, social:2}, milestone:'1831년 리옹 견직공 봉기'}),
        O('wounded', '총상을 입었습니다', 18, '다리를 다쳐 한동안 직기에 앉지 못했습니다.', {stats:{건강:-12, 재산:-6}}),
        O('killed', '크루아루스 언덕에서 쓰러졌습니다', 7, '봉기와 진압 속에 수백 명이 죽거나 다쳤습니다.', {doom:'1831년 리옹 견직공 봉기에서 목숨을 잃었습니다.'})]},
     stay('직기를 멈추고 문을 걸어 잠갔습니다.')]);

  H('railway-1837', [1837,8], {minAge:8, places:['파리']},
    '첫 기차',
    '파리에서 생제르맹앙레 아래 르페크까지 가는 여객 열차가 처음 운행합니다. 30분이 채 걸리지 않는다고 합니다!',
    [{label:'표를 사서 타 본다', result:'기적 소리와 함께 풍경이 날아가듯 지나갔습니다. 무섭기도 했지만 짜릿했습니다.', effects:{stats:{행복:5, 재산:-1}, experience:{curiosity:3}, milestone:'첫 여객 열차에 탐'}},
     {label:'구경만 한다', result:'연기를 뿜으며 달리는 쇠마차를 멀리서 보았습니다.', effects:{stats:{행복:2}, experience:{curiosity:1}}}]);

  H('ashes', [1840,12], {minAge:8, places:['파리']},
    '황제의 귀환',
    '12월 15일, 세인트헬레나에서 돌아온 나폴레옹의 유해가 개선문을 지나 앵발리드로 향합니다. 영하의 추위 속에 수십만 명이 거리를 메웠습니다.',
    [{label:'샹젤리제에 나가 운구 행렬을 본다', result:'늙은 근위병들이 울며 행렬을 따랐습니다. 당신도 모자를 벗었습니다.', effects:{stats:{행복:3, 건강:-2}, milestone:'나폴레옹 유해 귀환을 지켜봄'}},
     stay('추위를 피해 집에 있었습니다.')]);

  H('february-1848', [1848,2], {minAge:15, maxAge:65, places:['파리']},
    '2월의 바리케이드',
    '금지된 개혁 연회가 취소되자 학생과 노동자들이 거리로 나왔습니다. 카퓌신 거리에서 군대가 발포했다는 소식에 밤새 바리케이드가 올라갑니다.',
    [{label:'바리케이드에 선다', preview:'공화국 선포 / 부상', outcomes:[
        O('republic', '공화국이 선포되었습니다', 88, '이틀 만에 국왕이 퇴위했습니다. 시청 앞에서 시인 라마르틴의 연설을 들었습니다.', {stats:{행복:7}, path:{politics:'engaged'}, milestone:'1848년 2월 혁명 바리케이드'}),
        O('wounded', '총상을 입었습니다', 12, '카퓌신 거리의 총성 속에 다쳤습니다.', {stats:{건강:-12}})]},
     stay()]);

  H('june-days', [1848,6], {minAge:16, maxAge:65, places:['파리'], classes:['도시 평민']},
    '6월의 나날',
    '국립 작업장이 문을 닫는다는 발표에 동쪽 구역 노동자들이 다시 바리케이드를 쌓습니다. 이번에는 공화국 군대가 진압에 나섭니다.',
    [{label:'노동자들과 함께 싸운다', preview:'패배 후 유배 / 전사 / 무사', outcomes:[
        O('escaped', '패했지만 체포를 피했습니다', 45, '나흘 만에 바리케이드가 모두 무너졌습니다. 이름을 바꾸고 한동안 숨어 지냈습니다.', {stats:{행복:-8, 재산:-6}, experience:{inequality:3}}),
        O('deported', '체포되어 알제리로 유배되었습니다', 40, '재판 없이 유배 판결을 받았습니다. 몇 해 뒤에야 돌아왔습니다.', {stats:{건강:-10, 행복:-10, 재산:-12}, milestone:'6월 봉기 후 유배'}),
        O('killed', '바리케이드에서 쓰러졌습니다', 15, '진압 과정에서 수천 명이 죽었습니다.', {doom:'1848년 6월 봉기 때 목숨을 잃었습니다.'})]},
     {label:'국민방위대로 진압에 나선다', result:'같은 동네 사람들을 향해 총을 들어야 했습니다. 오래도록 마음이 무거웠습니다.', effects:{stats:{행복:-6}, closeness:-4}},
     stay()]);
})();
// A historic decision opens in its month regardless of the usual decision cadence.
function historicDecision(s) {
  if (s.dead || s.decision) return;
  // Someone serving at the front is not in the home-town crowd; battles open only for some units.
  const away = typeof atFront === 'function' && atFront(s);
  const d = decisions.find(d => d.historic && decisionAllowed(s, d) && matches(s, d.when)
    && !(away && (d.when.places || d.when.placeIncludes || d.when.notPlaces) && !d.when.jobMatch)
    && (d.chance === undefined || random(s) < d.chance));
  if (d) s.decision = d.id;
}
