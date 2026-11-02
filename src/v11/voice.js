// src/voice.js — the same decision, told for where you live
// Many older decisions were written for one kind of place ("the village", "the town"). Here each gets a
// Parisian, a provincial-city and a village telling, plus {고향}·{도시}·{직업} tokens, and moving to
// Paris becomes three different decisions: leaving the village, leaving a provincial city, and — for
// those already in Paris — leaving the faubourg or going back to the family's countryside.
const voiceKind = s => s.place === '파리' ? 'paris' : s.place.includes('농촌') ? 'rural' : 'city';
const REGION_CITY = {'브르타뉴 농촌':'렌', '오베르뉴 농촌':'클레르몽', '부르고뉴 농촌':'디종'};
const VOICE = {
  move:{rural:'{고향}의 땅은 형제끼리 나누면 손바닥만 합니다. 먼저 파리로 간 마을 사람이 “일손이 모자라 품삯이 두 배”라는 편지를 보내왔습니다. 떠나면 기회가 있겠지만, 가족과 익숙한 들판을 뒤로해야 합니다.',
    city:'{고향}의 일거리가 줄었습니다. 파리에서는 작업장마다 일손을 구한다는 소문이 돕니다. {직업}(으)로 자리를 잡을 수 있을지, 아는 사람 하나 없는 큰 도시에서 버틸 수 있을지 망설여집니다.'},
  inoculation:{paris:'옆 골목에서 천연두가 돌고 있습니다. 시립 병원의 의사는 천연두 환자의 고름을 조금 옮겨 가볍게 앓게 하는 ‘접종’을 권합니다. 대개는 가볍게 지나가지만, 드물게 크게 앓는 아이도 있다고 합니다.',
    city:'{고향}의 아랫동네에서 천연두가 돌고 있습니다. 의사는 천연두 환자의 고름을 조금 옮겨 가볍게 앓게 하는 ‘접종’을 권합니다. 대개는 가볍게 지나가지만, 드물게 크게 앓는 아이도 있다고 합니다.'},
  vaccine:{paris:'영국에서 들어온 ‘우두’ 접종을 시청에서 무료로 놓아 준다고 합니다. 소의 고름을 쓰는 방식이라 꺼림칙해하는 이웃도 있습니다.',
    city:'영국에서 들어온 ‘우두’ 접종을 {고향} 시립 병원에서 놓아 준다고 합니다. 소의 고름을 쓰는 방식이라 꺼림칙해하는 이웃도 있습니다.'},
  'guizot-school':{paris:'기조 법에 따라 구마다 초등학교가 세워졌습니다. 그리스도교 학교 수사들의 무료 학교도 있습니다. 가난한 집 아이는 수업료를 면제받을 수 있다고 합니다.',
    city:'기조 법에 따라 {고향}에도 시립 초등학교가 생겼습니다. 가난한 집 아이는 수업료를 면제받을 수 있다고 합니다.'},
  'domestic-service':{paris:'같은 골목 아주머니가 생제르맹 포부르의 부잣집 하녀 자리를 알아봐 주겠다고 합니다. 숙식이 해결되고 지참금을 모을 수 있지만, 주인을 잘 만나야 한다는 말도 있습니다.',
    city:'{고향}의 상인 집안에서 하녀를 구한다고 사촌이 알려 왔습니다. 숙식이 해결되고 지참금을 모을 수 있지만, 주인을 잘 만나야 한다는 말도 있습니다.',
    rural:'먼저 {도시}(으)로 간 사촌이 부잣집 하녀 자리를 알아봐 주겠다고 합니다. 숙식이 해결되고 지참금을 모을 수 있지만, 주인을 잘 만나야 한다는 말도 있습니다.'},
  levee:{paris:'“모든 프랑스인은 군대에 복무할 의무가 있다.” 미혼 청년부터 차례로 징집됩니다. 구 사무소 앞에 명단이 붙고, 골목의 젊은이들이 하나둘 떠나고 있습니다.',
    city:'“모든 프랑스인은 군대에 복무할 의무가 있다.” 미혼 청년부터 차례로 징집됩니다. {고향} 시청 앞에 명단이 붙고, 작업장의 젊은 직인들이 하나둘 떠나고 있습니다.'},
  cahier:{paris:'삼부회를 앞두고 파리의 60개 선거구마다 진정서를 모읍니다. 당신 구역의 회의는 성당 안에서 열립니다.',
    city:'삼부회를 앞두고 {고향}의 동업 조합과 교구마다 진정서를 모읍니다. 조합 회관에 장인들이 모였습니다.'},
  'vote-1848':{paris:'스물한 살 이상 남자라면 누구나 투표할 수 있게 되었습니다. 구청 앞 투표소에 작업복 차림의 노동자들이 줄을 섰습니다.',
    city:'스물한 살 이상 남자라면 누구나 투표할 수 있게 되었습니다. {고향} 시청의 투표소에 작업장 동료들과 함께 갔습니다.'},
  'door-teaching':{paris:'구의 학교에 보조 교사 자리가 났습니다. 읽기와 쓰기, 교리 문답과 셈을 가르치면 시에서 적으나마 급료가 나옵니다.',
    city:'{고향}의 학교에 보조 교사 자리가 났습니다. 읽기와 쓰기, 교리 문답과 셈을 가르치면 적으나마 급료가 나옵니다.'},
  'door-midwife':{paris:'구의 늙은 산파가 뒤를 이을 사람을 찾습니다. 시립 산과 학교에서 자격을 받으면 정식 산파가 될 수 있습니다.',
    city:'{고향}의 늙은 산파가 뒤를 이을 사람을 찾습니다. 출산은 여자들 사이의 일이고, 산파는 동네에서 가장 신뢰받는 사람 가운데 하나입니다.'},
  'inheritance-siblings':{paris:'두 분 모두 떠나시고, 형제자매가 공증인 사무실에 모였습니다. 셋방의 가구 몇 점과 작업장 연장, 그리고 빚 문서가 탁자 위에 놓였습니다.',
    city:'두 분 모두 떠나시고, 형제자매가 공증인 사무실에 모였습니다. {고향}의 집 한 채와 가게 집기, 그리고 빚 문서가 탁자 위에 놓였습니다.'},
  usurer:{paris:'월세 낼 돈조차 없습니다. 몽드피에테(공영 전당포)에 맡길 물건도 바닥났습니다. 골목의 대금업자가 높은 이자로 돈을 빌려주겠다고 합니다.',
    city:'월세와 재료값을 낼 돈이 없습니다. {고향}의 대금업자가 높은 이자로 돈을 빌려주겠다고 합니다.'},
  'childbirth-help':{paris:'아이가 곧 태어납니다. 구의 산파를 부를지, 오텔디외 병원의 산과에 갈지, 어머니와 이웃 여자들에게 맡길지 정해야 합니다.',
    city:'아이가 곧 태어납니다. 동네 산파를 부를지, {고향}의 외과의(산과의)를 부를지, 어머니와 이웃 여자들에게 맡길지 정해야 합니다.'},
  'emigrate-americas':{paris:'르아브르로 가는 이민 열차 광고가 벽마다 붙었습니다. 1849년에는 캘리포니아 금광, 이제는 부에노스아이레스의 일자리라고 합니다. 일거리가 없는 파리를 떠나는 사람이 늘고 있습니다.',
    city:'이민선 소개업자가 {고향}의 카페마다 전단을 돌립니다. 1849년에는 캘리포니아 금광, 이제는 부에노스아이레스의 일자리라고 합니다.'},
  'girls-convent-or-lay':{paris:'골목 끝에 수녀회 학교가, 구청 옆에 공립 여학교가 있습니다. 집에서는 일손이 아쉽다고 합니다.',
    city:'{고향}에는 수녀회 학교와, 뒤뤼이 법 뒤 새로 생긴 공립 여학교가 있습니다. 집에서는 일손이 아쉽다고 합니다.',
    rural:'마을에 수녀회 학교와, 뒤뤼이 법 뒤 새로 온 공립 여학교 선생님이 있습니다. 집에서는 일손이 아쉽다고 합니다.'},
  'bond-dodger':{paris:'이웃집 아들이 징집 제비뽑기에서 나쁜 번호를 뽑고 달아났습니다. 경찰이 골목을 뒤지며, 숨겨 주는 집은 벌금을 문다고 합니다. 오늘 밤 그가 당신 다락방 문을 두드립니다.',
    city:'이웃집 아들이 징집 제비뽑기에서 나쁜 번호를 뽑고 달아났습니다. 헌병이 {고향}의 골목을 뒤지며, 숨겨 주는 집은 벌금을 문다고 합니다. 오늘 밤 그가 당신 작업장 뒷문을 두드립니다.'}
};
function voiceText(s, d) { return VOICE[d.id]?.[voiceKind(s)] || d.text; }
// Tokens that any decision text, label or result may use.
function placeTokens(s, text) {
  if (typeof text !== 'string' || !text.includes('{')) return text;
  const home = s.place.replace(' 농촌', ' 시골');
  return text.replaceAll('{고향}', home).replaceAll('{도시}', REGION_CITY[s.place] || s.place).replaceAll('{직업}', ['없음', '은퇴'].includes(s.job) ? '일꾼' : s.job);
}

(() => {
  // Moving to Paris is not offered to Parisians.
  const move = decisions.find(d => d.id === 'move');
  if (move) move.when.notPlaces = ['파리'];
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});
  decisions.push({id:'move-paris', domain:'housing', priority:20, title:'파리 살이',
    text:'파리의 집세가 또 올랐습니다. 아이들은 좁은 셋방에서 기침을 하고, 일감은 들쭉날쭉합니다. 성벽 바깥 포부르로 옮기면 집세가 반이고, 부모님 고향의 시골 친척은 내려와 함께 농사를 짓자고 합니다.',
    when:{minAge:22, maxAge:50, places:['파리'], unsetFlag:'move'},
    choices:[
      {label:'성벽 밖 포부르로 옮긴다', preview:'집세를 아낌 / 먼 출퇴근', outcomes:[
        O('ok', '집세를 아꼈습니다', 65, '생앙투안 포부르 끝의 셋방으로 옮겼습니다. 같은 돈으로 방이 하나 더 생겼습니다.', {stats:{재산:3, 행복:1}, flags:['move', 'move-paris']}),
        O('far', '일터가 멀어졌습니다', 35, '새벽 다섯 시에 나가 밤에 돌아옵니다. 아이들 얼굴을 보기 어렵습니다.', {stats:{재산:2, 건강:-2, 행복:-2}, flags:['move', 'move-paris']})], effects:{flags:['move']}},
      {label:'가족을 데리고 시골 친척에게 내려간다', preview:'땅과 공기 / 낯선 시골', outcomes:[
        O('settled', '시골에 자리를 잡았습니다', 55, '친척의 밭 한쪽을 빌려 감자와 밀을 심었습니다. 아이들의 뺨에 다시 혈색이 돌았습니다.', {stats:{건강:3, 행복:2, 재산:-2}, moveTo:'rural-home', milestone:'파리를 떠나 시골로', flags:['move', 'move-paris']}),
        O('stranger', '마을 사람들이 낯설어했습니다', 45, '‘파리 사람’이라는 꼬리표가 몇 해 동안 붙어 다녔습니다. 농사일도 손에 익지 않았습니다.', {stats:{행복:-3, 재산:-3}, moveTo:'rural-home', milestone:'파리를 떠나 시골로', flags:['move', 'move-paris']})], effects:{flags:['move']}},
      {label:'파리에 남는다', result:'파리를 떠나서는 살 수 없을 것 같았습니다.', effects:{stats:{}, flags:['move', 'move-paris']}}]});
})();
