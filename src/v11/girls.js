// src/education-girls.js
// Girls were taught, but apart from boys and less: by nuns, in sewing schools and convent boarding schools,
// not in collèges, lycées or military schools. Boys' schooling decisions are made male-only and girls get
// their own, with lower odds and more emphasis on catechism, reading and needlework than on writing.
(() => {
  for (const id of ['school', 'village-school', 'guizot-school', 'college', 'noble-tutor']) {
    const d = decisions.find(x => x.id === id);
    if (d) d.when.sexes = ['남성'];
  }
  const D = (id, when, title, text, choices) => decisions.push({id, domain:'education', priority:id === 'school-girls' ? 20 : 8, title, text,
    when:{...when, sexes:['여성'], unsetFlag:when.unsetFlag || id},
    choices:choices.map(c => ({...c, effects:{...(c.effects || {}), flags:[id, 'learn', ...((c.effects || {}).flags || [])]}}))});
  const O = (id, title, weight, result, effects = {}, modifiers) => ({id, title, weight, result, effects, ...(modifiers ? {modifiers} : {})});

  D('school-girls', {minAge:8, maxAge:11, fromYear:1770, toYear:1788, places:['파리'], classes:['도시 평민'], parentJobs:['인쇄공','직물공','제화공','장인'],
      religions:['catholic'], livingRoles:['아버지','어머니'], literacy:['illiterate','learning'], unsetFlag:'school'},
    '수녀들의 자선학교에 보내 달라고 할까?',
    '이웃집 여자아이가 애덕 수녀회가 여는 자선학교에 다니기 시작했습니다. 교리 문답과 읽기, 바느질을 가르친다고 합니다.\n아버지는 여자아이에게는 글보다 바느질과 집안일이 먼저라고 말합니다. 어머니는 당신의 부탁을 들어 보겠다고 했습니다.',
    [{label:'부모에게 자선학교에 보내 달라고 부탁한다', preview:'입학 허락 / 거절 / 바느질 학교만', effects:{flags:['school'], experience:{educationInterest:2}}, outcomes:[
        O('approved', '자선학교에 다니게 되었습니다', 25, '어머니가 아버지를 설득했습니다. 수녀들에게 교리 문답과 읽기를 배웁니다. 쓰기는 조금만 가르쳐 줍니다.', {education:'수녀회 자선학교', literacy:'learning', stats:{지식:4, 행복:4}, path:{learning:'study'}, milestone:'수녀회 자선학교 입학'}, [{when:{minWealth:45}, amount:10}]),
        O('refused', '허락받지 못했습니다', 50, '“여자아이가 글을 배워 무엇에 쓰겠느냐.” 아버지의 말에 더는 조르지 못했습니다.', {stats:{행복:-3}, path:{learning:'wait'}}),
        O('sewing', '바느질 학교만 허락받았습니다', 25, '읽기 대신 바느질 학교에 다니기로 했습니다. 수놓는 틈틈이 기도서의 글자를 조금 익혔습니다.', {education:'바느질 학교', stats:{지식:1, 재산:1}, experience:{craft:2}, path:{learning:'family'}, milestone:'바느질 학교에 다님'})]},
     {label:'어머니에게 기도서 읽는 법을 배운다', preview:'조금씩 읽기 / 시간이 없음', effects:{flags:['school']}, outcomes:[
        O('taught', '기도서를 더듬더듬 읽게 되었습니다', 55, '저녁마다 어머니와 기도서를 펼쳤습니다. 쓰는 법은 모르지만 읽을 수는 있게 되었습니다.', {literacy:'learning', stats:{지식:2}, relationCloseness:{roles:['어머니'], amount:4}}),
        O('busy', '어머니에게 그럴 여유가 없었습니다', 45, '어머니도 일이 많아 몇 번 하다 그만두었습니다.', {stats:{행복:-1}})]},
     {label:'집안일과 작업장 심부름을 돕는다', preview:'가업 경험 / 교육 기회 감소', effects:{flags:['school']}, outcomes:[
        O('family', '집안의 일손이 되었습니다', 1, '물을 긷고 동생을 돌보고 작업장 심부름을 합니다. 실 감는 손이 어른만큼 빨라졌습니다.', {stats:{재산:2}, path:{learning:'family'}, experience:{familyTrade:2, responsibility:2}})]}]);

  D('village-school-girls', {minAge:6, maxAge:10, classes:['농민'], toYear:1835, unsetFlag:'learn'},
    '여자아이 교리 학교',
    '겨울이 되면 성당지기의 아내가 마을 여자아이 몇을 모아 교리 문답과 기도서 읽기, 실 잣기를 가르칩니다. 남자아이 학교와는 따로 엽니다.',
    [{label:'보내 달라고 조른다', preview:'겨울 동안 배움 / 일손이 필요함', outcomes:[
        O('yes', '겨울 동안 다녔습니다', 35, '난롯가에 앉아 기도문을 외우고 글자를 짚어 가며 읽었습니다. 봄이 되자 다시 들일을 도왔습니다.', {education:'여자아이 교리 학교', literacy:'learning', stats:{지식:3}, path:{learning:'study'}}, [{when:{minWealth:25}, amount:10}]),
        O('no', '집에 일손이 필요하다고 했습니다', 65, '동생을 돌보고 물레를 돌려야 했습니다.', {stats:{행복:-2}, path:{learning:'family'}})]},
     {label:'어머니 곁에서 실 잣기를 배운다', result:'물레 돌리는 법을 익혔습니다. 겨울밤 마실에서 어른들이 솜씨를 칭찬했습니다.', effects:{experience:{craft:2, familyTrade:1}, path:{learning:'family'}}}]);

  D('girls-school-1836', {minAge:6, maxAge:11, fromYear:1836, unsetFlag:'learn'},
    '여자아이 학교',
    '1836년 법령으로 여자아이 학교를 세우는 코뮌이 늘고 있습니다. 대개 수녀들이 가르치고, 바느질과 읽기에 무게를 둡니다. 우리 코뮌에도 생길지 모릅니다.',
    [{label:'학교에 다니고 싶다고 말한다', preview:'입학 / 학교가 없음', outcomes:[
        O('yes', '여자아이 학교에 다니게 되었습니다', 50, '수녀 선생님에게 읽기와 쓰기, 셈과 바느질을 배웁니다.', {education:'여자아이 초등학교', literacy:'learning', stats:{지식:5, 행복:2}, path:{learning:'study'}, milestone:'초등학교 입학'}, [{when:{notPlaceIncludes:'농촌'}, amount:20}]),
        O('none', '코뮌에 아직 여자아이 학교가 없습니다', 50, '남자아이 학교에는 다닐 수 없었습니다. 집에서 어머니에게 배우기로 했습니다.', {stats:{행복:-2}})]},
     {label:'집안일을 돕는다', result:'학교 대신 집안일을 맡았습니다.', effects:{experience:{responsibility:1}, path:{learning:'family'}}}]);

  D('convent-pension', {minAge:8, maxAge:13, classes:['부르주아','귀족'], excludeYears:[1792, 1801], unsetFlag:'learn'},
    '수녀원 기숙학교',
    '부모는 당신을 우르술라회 수녀원 기숙학교에 보낼지 고민합니다. 교리와 예절, 읽기와 쓰기, 자수와 음악을 배웁니다. 콜레주처럼 라틴어를 가르치지는 않습니다.',
    [{label:'기숙학교에 간다', preview:'좋은 성적 / 향수병', outcomes:[
        O('good', '수녀들의 칭찬을 받았습니다', 55, '프랑스어 작문과 자수로 상을 받았습니다. 몇몇 친구와는 평생 편지를 주고받을 사이가 되었습니다.', {education:'수녀원 기숙학교', literacy:'basic', stats:{지식:8, 재산:-4}, experience:{religious:2, social:2}, milestone:'수녀원 기숙학교'}, [{when:{minAptitude:60}, amount:15}]),
        O('homesick', '집이 그리워 자주 울었습니다', 45, '규율이 엄격하고 겨울이 추웠습니다. 그래도 읽고 쓰는 법은 익혔습니다.', {education:'수녀원 기숙학교', literacy:'basic', stats:{지식:5, 행복:-4, 재산:-4}, milestone:'수녀원 기숙학교'})]},
     {label:'집에서 어머니와 가정교사에게 배운다', result:'어머니 곁에서 살림과 예절, 읽기와 쓰기를 배웠습니다.', effects:{literacy:'learning', stats:{지식:4}, relationCloseness:{roles:['어머니'], amount:4}}}]);

  D('noble-girl', {minAge:7, maxAge:12, classes:['귀족'], unsetFlag:'learn'},
    '가문의 딸을 어떻게 가르칠까',
    '가문의 딸에게 맞는 교육을 정할 때입니다. 1793년까지는 가난한 귀족 가문의 딸을 받아 주는 생시르의 왕립 여학교도 있습니다.',
    [{label:'가정교사를 들인다', result:'가정교사에게 프랑스어와 이탈리아어, 하프와 그림을 배웁니다.', effects:{education:'가정교사', literacy:'basic', stats:{지식:7, 재산:-5}}},
     {label:'생시르 왕립 여학교에 지원한다', preview:'입학 / 자리가 없음', requires:{maxYear:1792}, outcomes:[
        O('in', '생시르에 들어갔습니다', 40, '엄격한 규율 속에 역사와 지리, 음악을 배웁니다. 스무 살이 되면 지참금을 받고 나옵니다.', {education:'생시르 왕립 여학교', literacy:'basic', stats:{지식:9, 재산:4}, milestone:'생시르 왕립 여학교 입학'}),
        O('full', '자리가 없었습니다', 60, '추천서가 부족했습니다. 수녀원 기숙학교로 보내졌습니다.', {education:'수녀원 기숙학교', literacy:'basic', stats:{지식:5}})]},
     {label:'어머니 곁에서 예법을 배운다', result:'살롱의 예법과 편지 쓰는 법을 어머니에게 배웠습니다.', effects:{literacy:'learning', stats:{지식:3}, experience:{social:2}}}]);
})();
// Girls had fewer chances to learn outside school, too.
function girlsLearningFactor(s) { return s.sex === '여성' ? .6 : 1; }
