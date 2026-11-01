// src/data/decisions-era.js
// Thirty one-off decisions tied to life stage, class and period. Each fires at most once (unsetFlag = id).
// Outcome weights are game design values, not historical probabilities.
(() => {
  const D = (id, domain, priority, when, title, text, choices) => decisions.push({id, domain, priority, title, text,
    when:{...when, unsetFlag:when.unsetFlag || id},
    // Schooling decisions share the 'learn' gate with the original learning decision, so any answer closes it.
    choices:choices.map(c => ({...c, effects:{...(c.effects || {}), flags:[id, ...(when.unsetFlag === 'learn' ? ['learn'] : []), ...((c.effects || {}).flags || [])]}}))});
  const O = (id, title, weight, result, effects = {}, modifiers) => ({id, title, weight, result, effects, ...(modifiers ? {modifiers} : {})});

  // ---------------- 유년기 (2–13) ----------------
  D('inoculation', 'childhood', 9, {minAge:2, maxAge:8, toYear:1800},
    '천연두 접종을 할까?',
    '이웃 마을에서 천연두가 돌고 있습니다. 의사는 천연두 환자의 고름을 조금 옮겨 가볍게 앓게 하는 ‘접종’을 권합니다. 대개는 가볍게 지나가지만, 드물게 크게 앓는 아이도 있다고 합니다.',
    [{label:'부모가 접종을 받게 한다', preview:'평생 면역 / 며칠 앓음 / 크게 앓음', outcomes:[
        O('immune', '가볍게 앓고 지나갔습니다', 70, '열이 며칠 오르다 내렸습니다. 이제 천연두를 두려워하지 않아도 됩니다.', {stats:{건강:3}, milestone:'천연두 접종'}),
        O('sick', '열흘 가까이 앓았습니다', 25, '생각보다 오래 앓아 가족이 애를 태웠지만 결국 회복했습니다.', {stats:{건강:-2, 행복:-2}, milestone:'천연두 접종'}),
        O('severe', '크게 앓고 흉터가 남았습니다', 5, '고열로 한동안 일어나지 못했습니다. 얼굴에 옅은 흉터가 남았습니다.', {stats:{건강:-8, 행복:-4}})]},
     {label:'하느님의 뜻에 맡기고 기다린다', result:'접종하지 않기로 했습니다. 다행히 이번 유행은 마을을 비켜 갔습니다.', effects:{experience:{religious:1}}},
     {label:'유행이 지나갈 때까지 아이를 친척 집에 보낸다', result:'한동안 친척 집에서 지냈습니다. 낯선 곳이었지만 무사히 돌아왔습니다.', effects:{stats:{행복:-2, 재산:-2}, experience:{curiosity:1}}}]);

  D('vaccine', 'childhood', 9, {minAge:2, maxAge:8, fromYear:1801},
    '새로운 우두 접종',
    '영국에서 들어온 ‘우두’ 접종이 마을에서도 시행된다고 합니다. 소의 고름을 쓰는 방식이라 꺼림칙해하는 어른들도 있습니다.',
    [{label:'접종을 받는다', result:'팔에 작은 상처가 생겼다가 아물었습니다. 천연두 걱정을 덜었습니다.', effects:{stats:{건강:3}, milestone:'우두 접종'}},
     {label:'소문이 미덥지 않아 미룬다', result:'부모는 조금 더 지켜보기로 했습니다.', effects:{stats:{}}}]);

  D('first-communion', 'religion', 8, {minAge:11, maxAge:13, religions:['catholic'], excludeYears:[1793, 1801]},
    '첫영성체 준비',
    '본당 신부가 올해 첫영성체를 받을 아이들을 모읍니다. 몇 달 동안 교리 문답을 외워야 하고, 새 옷도 마련해야 합니다.',
    [{label:'교리 공부에 열심히 다닌다', result:'교리 문답을 외워 신부의 칭찬을 받았습니다. 흰 옷을 입고 첫영성체를 받았습니다.', effects:{stats:{지식:2, 행복:3, 재산:-2}, experience:{religious:2}, milestone:'첫영성체'}},
     {label:'일을 도우며 틈틈이 다닌다', result:'공부는 더뎠지만 무사히 첫영성체를 받았습니다.', effects:{stats:{재산:1, 행복:1}, experience:{religious:1, responsibility:1}, milestone:'첫영성체'}},
     {label:'내년으로 미룬다', result:'올해는 준비하지 못했습니다. 이웃들이 수군거렸습니다.', effects:{stats:{행복:-2}}}]);

  D('village-school', 'education', 8, {minAge:6, maxAge:10, classes:['농민'], toYear:1833, unsetFlag:'learn'},
    '겨울 학기 마을 학교',
    '농사일이 한가한 겨울 몇 달 동안 마을 학교가 열립니다. 교사는 성당지기를 겸하는 사람이고, 한 달에 몇 수씩 수업료를 내야 합니다.',
    [{label:'겨울 학교에 보내 달라고 조른다', preview:'입학 / 형편상 거절', outcomes:[
        O('yes', '겨울 동안 학교에 다녔습니다', 55, '난롯가에 둘러앉아 글자와 셈을 배웠습니다. 봄이 되면 다시 들일을 돕습니다.', {education:'마을 학교(겨울 학기)', literacy:'learning', stats:{지식:4, 재산:-2}, path:{learning:'study'}, milestone:'마을 학교 입학'}, [{when:{minWealth:25}, amount:15}]),
        O('no', '수업료를 낼 형편이 안 됩니다', 45, '아버지는 올겨울 땔감값부터 걱정했습니다. 학교는 다음 기회로 미뤘습니다.', {stats:{행복:-2}, path:{learning:'wait'}}, [{when:{maxWealth:18}, amount:20}])]},
     {label:'집에서 가축을 돌본다', result:'겨울 동안 가축을 돌보며 집안일을 도왔습니다.', effects:{stats:{재산:2}, experience:{familyTrade:2, responsibility:1}, path:{learning:'family'}}}]);

  D('guizot-school', 'education', 8, {minAge:6, maxAge:11, fromYear:1834, unsetFlag:'learn'},
    '코뮌에 새 학교가 생겼습니다',
    '기조 법에 따라 마을마다 초등학교가 세워졌습니다. 가난한 집 아이는 수업료를 면제받을 수 있다고 합니다.',
    [{label:'학교에 다닌다', result:'정식 교사에게 읽기·쓰기·셈과 도량형을 배웁니다.', effects:{education:'코뮌 초등학교', literacy:'learning', stats:{지식:6, 행복:2}, path:{learning:'study'}, milestone:'초등학교 입학'}},
     {label:'일손이 필요해 가끔만 나간다', result:'바쁜 철에는 빠졌지만 글자는 조금씩 익혔습니다.', effects:{education:'코뮌 초등학교(간간이)', literacy:'learning', stats:{지식:3, 재산:1}, path:{learning:'study-work'}}}]);

  D('noble-tutor', 'education', 9, {minAge:7, maxAge:12, classes:['귀족'], unsetFlag:'learn'},
    '가문의 아이를 어떻게 가르칠까',
    '가문의 체면에 맞는 교육을 정할 때입니다. 집에 가정교사를 들일 수도, 기숙 학교에 보낼 수도, 군인이 될 준비를 시킬 수도 있습니다.',
    [{label:'집에 가정교사를 들인다', result:'라틴어와 프랑스어 문장, 춤과 예법을 집에서 배웁니다.', effects:{education:'가정교사', literacy:'basic', stats:{지식:8, 재산:-5}, closeness:2}},
     {label:'수도회 기숙 학교에 보낸다', result:'엄격한 규율 속에서 고전과 신앙을 배웁니다. 집이 그립습니다.', effects:{education:'기숙 학교', literacy:'basic', stats:{지식:10, 행복:-4, 재산:-6}, experience:{religious:2}}},
     {label:'사관학교 입학을 준비한다', result:'수학과 승마, 펜싱을 익히기 시작했습니다.', effects:{education:'사관학교 준비', literacy:'basic', stats:{지식:6, 건강:3, 재산:-6}, experience:{responsibility:2}}}]);

  D('college', 'education', 8, {minAge:10, maxAge:13, classes:['부르주아']},
    '콜레주에 보낼까, 가게에 둘까',
    '부모는 당신을 라틴어를 가르치는 학교에 보낼지, 일찍 장부 쓰는 법을 가르칠지 고민합니다. 학교는 출세의 문이지만 돈이 듭니다.',
    [{label:'학교에서 고전 교육을 받는다', preview:'우등 / 평범', outcomes:[
        O('honors', '우등상을 받았습니다', 40, '라틴어 작문으로 상을 받아 집안의 자랑이 되었습니다.', {education:'콜레주(리세)', literacy:'basic', stats:{지식:12, 행복:4, 재산:-6}, milestone:'콜레주 입학'}, [{when:{experienceMin:{educationInterest:3}}, amount:20}]),
        O('plain', '무난하게 다닙니다', 60, '성적은 중간이지만 친구를 많이 사귀었습니다.', {education:'콜레주(리세)', literacy:'basic', stats:{지식:8, 재산:-6}, experience:{social:2}, milestone:'콜레주 입학'})]},
     {label:'가게에서 장부와 셈을 배운다', result:'계산대 뒤에서 손님을 대하고 장부 쓰는 법을 익힙니다.', effects:{literacy:'basic', stats:{지식:4, 재산:4}, experience:{commerce:3}}}]);

  D('shepherd', 'career', 7, {minAge:8, maxAge:12, classes:['농민']},
    '이웃 농가의 양치기',
    '이웃의 큰 농가에서 여름 내내 양을 칠 아이를 구합니다. 먹여 주고 가을에 품삯도 준다고 합니다.',
    [{label:'여름 동안 양치기로 간다', result:'들판에서 혼자 양 떼를 지키며 여름을 보냈습니다. 가을에 받은 품삯을 어머니께 드렸습니다.', effects:{stats:{재산:4, 건강:1, 행복:-1}, experience:{responsibility:2}, relationCloseness:{roles:['어머니'], amount:3}}},
     {label:'집에 남는다', result:'집안일을 거들며 여름을 보냈습니다.', effects:{stats:{행복:2}}}]);

  D('chimney-sweep', 'housing', 9, {minAge:8, maxAge:12, places:['오베르뉴 농촌']},
    '파리로 굴뚝 청소하러 갈까?',
    '겨울마다 오베르뉴의 아이들이 파리로 내려가 굴뚝을 청소하고 봄에 돌아옵니다. 마을 어른 한 명이 올해 데려갈 아이를 찾고 있습니다.',
    [{label:'파리로 따라간다', preview:'돈을 벌어 옴 / 병을 얻음', outcomes:[
        O('earned', '봄에 돈을 벌어 돌아왔습니다', 70, '좁은 굴뚝을 오르내리며 겨울을 났습니다. 그을음투성이였지만 모은 돈을 들고 돌아왔습니다.', {stats:{재산:6, 지식:2, 건강:-1}, experience:{curiosity:2, responsibility:2}, milestone:'파리에서 굴뚝 청소부로 겨울을 남'}),
        O('ill', '기침병을 얻어 돌아왔습니다', 30, '그을음과 추위에 기침이 떨어지지 않았습니다. 돈은 조금밖에 못 모았습니다.', {stats:{건강:-5, 재산:2}, experience:{inequality:2}})]},
     {label:'고향에 남는다', result:'올겨울은 가족과 함께 지냈습니다.', effects:{stats:{행복:2}}}]);

  D('mill-child', 'career', 8, {minAge:8, maxAge:13, places:['루앙','리옹'], fromYear:1815, classes:['도시 평민']},
    '방적 공장에서 일할까?',
    '새로 들어선 방적 공장이 아이들을 고용합니다. 하루 열두 시간 넘게 일하지만, 집에는 꼬박꼬박 돈이 들어옵니다.',
    [{label:'공장에 나간다', result:'실 끊어진 곳을 잇는 일을 맡았습니다. 손은 빨라졌지만 늘 피곤합니다.', effects:{job:'방적공', stats:{재산:5, 건강:-3, 지식:-1}, experience:{craft:1, inequality:2}}},
     {label:'부모가 조금 더 버텨 보기로 한다', result:'집안 형편은 빠듯하지만 당분간은 집에 남았습니다.', effects:{stats:{행복:2, 재산:-2}}}]);

  // ---------------- 청년기 (14–25) ----------------
  D('domestic-service', 'career', 7, {minAge:14, maxAge:20, sexes:['여성'], classes:['농민','도시 평민']},
    '도시의 하녀 자리',
    '먼저 도시로 간 사촌이 부잣집 하녀 자리를 알아봐 주겠다고 합니다. 숙식이 해결되고 지참금을 모을 수 있지만, 주인을 잘 만나야 한다는 말도 있습니다.',
    [{label:'하녀로 들어간다', preview:'좋은 주인 / 고된 집', outcomes:[
        O('kind', '좋은 주인을 만났습니다', 60, '마님은 엄격하지만 공정했습니다. 품삯을 차곡차곡 모으고 글자도 조금 배웠습니다.', {job:'하녀', stats:{재산:6, 지식:2}, experience:{social:1}, milestone:'하녀로 일하기 시작'}),
        O('harsh', '고된 집이었습니다', 40, '새벽부터 밤까지 일했고 꾸중이 잦았습니다. 그래도 품삯은 받았습니다.', {job:'하녀', stats:{재산:4, 행복:-5, 건강:-2}, experience:{inequality:2}, milestone:'하녀로 일하기 시작'})]},
     {label:'고향에서 실을 자아 판다', result:'집에서 물레를 돌려 실을 자아 상인에게 팝니다.', effects:{stats:{재산:2}, experience:{craft:2}}},
     {label:'가족 곁에 남는다', result:'가족과 함께 지내기로 했습니다.', effects:{stats:{행복:3}, closeness:2}}]);

  D('compagnonnage', 'career', 8, {minAge:16, maxAge:23, sexes:['남성'], classes:['도시 평민'], hasJob:true},
    '직인 순례(투르 드 프랑스)',
    '동업 직인 조합의 선배들이 프랑스를 한 바퀴 돌며 여러 도시의 작업장에서 일해 보라고 권합니다. 몇 해가 걸리지만 솜씨는 확실히 늘어납니다.',
    [{label:'순례를 떠난다', preview:'숙련공 / 중도 귀향', outcomes:[
        O('master', '솜씨 좋은 직인이 되어 돌아왔습니다', 65, '리옹, 마르세유, 보르도의 작업장을 거쳤습니다. 조합의 별명도 얻었습니다.', {job:'직인', stats:{지식:6, 재산:3}, experience:{craft:4, social:2, curiosity:2}, milestone:'직인 순례를 마침'}),
        O('back', '몇 달 만에 돌아왔습니다', 35, '조합 사이의 싸움에 휘말려 일찍 돌아왔습니다. 그래도 배운 것은 있습니다.', {stats:{지식:2, 건강:-2}, experience:{craft:1}})]},
     {label:'지금 작업장에 남는다', result:'익숙한 작업장에서 꾸준히 일합니다.', effects:{stats:{재산:3}, experience:{familyTrade:1}}}]);

  D('seminary', 'religion', 7, {minAge:15, maxAge:20, sexes:['남성'], religions:['catholic'], excludeYears:[1790, 1801], unsetFlag:'marriage'},
    '신학교에 들어갈까?',
    '본당 신부가 당신의 총명함을 눈여겨보고 신학교를 권합니다. 성직자가 되면 공부할 수 있지만 결혼은 할 수 없습니다.',
    [{label:'신학교에 들어간다', result:'라틴어와 신학을 공부하기 시작했습니다. 몇 해 뒤 사제품을 받습니다.', effects:{job:'사제', education:'신학교', literacy:'basic', stats:{지식:10, 행복:2}, experience:{religious:4}, flags:['marriage'], milestone:'신학교 입학'}},
     {label:'정중히 사양한다', result:'신부는 아쉬워했지만 당신의 뜻을 존중했습니다.', effects:{stats:{}}}]);

  D('dowry', 'marriage', 7, {minAge:17, maxAge:24, sexes:['여성'], unsetFlag:'marriage'},
    '지참금 이야기',
    '혼인을 하려면 지참금이 필요하다는 이야기가 오갑니다. 부모의 형편은 넉넉하지 않습니다.',
    [{label:'몇 해 일해 스스로 모은다', result:'혼인을 미루고 일해서 지참금을 모으기로 했습니다.', effects:{stats:{재산:5, 행복:-1}, experience:{responsibility:2}}},
     {label:'부모가 땅 한 뙈기를 떼어 준다', result:'부모가 작은 밭을 지참금으로 약속했습니다. 형제들은 조금 서운해합니다.', effects:{stats:{재산:3, 행복:2}, relationCloseness:{roles:['형제자매'], amount:-4}}},
     {label:'지참금 없이 맞아 줄 사람을 찾는다', result:'사랑을 믿어 보기로 했습니다.', effects:{stats:{행복:2}}}]);

  D('veillee', 'marriage', 7, {minAge:16, maxAge:26, classes:['농민'], unsetFlag:'marriage'},
    '겨울밤 마실에서 만난 사람',
    '겨울밤 이웃집 외양간에 모여 실을 잣고 이야기를 나누는 마실에서, 자꾸 눈이 마주치는 사람이 생겼습니다.',
    [{label:'춤 축제에서 마음을 고백한다', preview:'혼인 / 거절', outcomes:[
        O('wed', '이듬해 봄에 혼인했습니다', 60, '두 집안이 합의하고 성당에서 혼인했습니다. 마을 사람들이 사흘 동안 잔치를 벌였습니다.', {spouse:true, flags:['marriage'], stats:{행복:8, 재산:-3}, milestone:'마을에서 혼인'}),
        O('no', '상대 집안이 반대했습니다', 40, '상대의 부모는 더 넉넉한 혼처를 원했습니다. 한동안 마음이 아팠습니다.', {stats:{행복:-5}})]},
     {label:'마음을 접는다', result:'아무 말도 하지 않았습니다. 겨울이 지나갔습니다.', effects:{stats:{행복:-1}}}]);

  D('arranged-match', 'marriage', 8, {minAge:18, maxAge:30, classes:['부르주아','귀족'], unsetFlag:'marriage'},
    '집안이 정한 혼처',
    '양가 공증인이 혼인 계약서를 준비하고 있습니다. 상대는 집안끼리 잘 맞는 사람이지만, 당신은 몇 번 본 적이 없습니다.',
    [{label:'계약에 서명한다', result:'혼인 계약에 서명하고 혼례를 올렸습니다. 두 집안의 재산이 하나로 묶였습니다.', effects:{spouse:true, flags:['marriage'], stats:{재산:12, 행복:-1}, milestone:'혼인 계약'}},
     {label:'마음에 둔 사람을 고집한다', preview:'허락 / 의절', outcomes:[
        O('blessed', '결국 허락을 받았습니다', 45, '부모는 한숨을 쉬었지만 허락했습니다. 지참금은 줄었습니다.', {spouse:true, flags:['marriage'], stats:{행복:10, 재산:-4}, milestone:'사랑으로 혼인'}),
        O('cut', '부모와 사이가 멀어졌습니다', 55, '혼인은 미뤄졌고 집안과 서먹해졌습니다.', {stats:{행복:-4}, relationCloseness:{roles:['아버지','어머니'], amount:-12}})]},
     {label:'혼인을 미루고 공부·일에 전념한다', result:'혼처 이야기를 정중히 미뤘습니다.', effects:{stats:{지식:4}}}]);

  D('levee', 'politics', 10, {minAge:18, maxAge:25, sexes:['남성'], fromYear:1793, toYear:1798},
    '국민 총동원령',
    '“모든 프랑스인은 군대에 복무할 의무가 있다.” 미혼 청년부터 차례로 징집됩니다. 마을의 젊은이들이 하나둘 떠나고 있습니다.',
    [{label:'소집에 응한다', preview:'무사 귀환 / 부상', outcomes:[
        O('served', '전선에서 살아 돌아왔습니다', 70, '라인강 전선에서 두 해를 보냈습니다. 많은 것을 보았고, 많은 사람을 잃었습니다.', {stats:{건강:-3, 지식:3, 행복:-3}, experience:{responsibility:2}, milestone:'공화국 군대 복무'}),
        O('wounded', '부상을 입고 돌아왔습니다', 30, '다리를 다쳐 전역했습니다. 지금도 비가 오면 쑤십니다.', {stats:{건강:-10, 행복:-5}, milestone:'전투에서 부상'})]},
     {label:'군 관련 일자리로 남는다', result:'군수품 수송 일을 맡아 전선에는 나가지 않았습니다.', effects:{stats:{재산:3, 건강:-1}}},
     {label:'숲에 숨는다(징집 기피)', preview:'무사 / 체포', outcomes:[
        O('hidden', '들키지 않았습니다', 55, '몇 달을 숨어 지냈습니다. 이웃들이 모른 척해 주었습니다.', {stats:{행복:-4, 건강:-2}, experience:{inequality:1}}),
        O('caught', '헌병에게 붙잡혔습니다', 45, '벌금을 물고 결국 군대로 보내졌습니다.', {stats:{재산:-6, 건강:-4, 행복:-5}})]}]);

  D('conscription', 'politics', 9, {minAge:20, maxAge:21, sexes:['남성'], fromYear:1799, excludeYears:[1814, 1817]},
    '징병 추첨',
    '스무 살이 된 청년들이 면사무소에 모여 번호를 뽑습니다. 나쁜 번호를 뽑으면 몇 해 동안 군대에 가야 합니다. 돈이 있으면 대리인을 살 수도 있습니다.',
    [{label:'번호를 뽑는다', preview:'좋은 번호 / 나쁜 번호', outcomes:[
        O('lucky', '좋은 번호를 뽑았습니다', 60, '군대에 가지 않아도 됩니다. 가족이 성당에 초를 켰습니다.', {stats:{행복:5}}),
        O('drafted', '나쁜 번호를 뽑았습니다', 40, '군복을 입고 연대로 떠납니다.', {job:'군인', stats:{행복:-6, 건강:-1}, milestone:'징집되어 입대'})]},
     {label:'대리인을 산다', result:'큰돈을 주고 다른 청년이 대신 입대하게 했습니다.', effects:{stats:{재산:-15, 행복:2}, experience:{inequality:1}}},
     {label:'자원 입대한다', result:'스스로 군대에 들어갔습니다. 동료들과 함께 행진합니다.', effects:{job:'군인', stats:{건강:-1, 행복:2}, experience:{responsibility:2}, milestone:'자원 입대'}}]);

  D('section-club', 'politics', 10, {minAge:16, maxAge:50, fromYear:1790, toYear:1794, classes:['도시 평민','부르주아']},
    '구역 회의와 정치 클럽',
    '저녁마다 구역 회의와 클럽에서 신문을 읽고 연설을 합니다. 이웃들이 당신도 나오라고 합니다.',
    [{label:'회의에 나가 발언한다', result:'처음으로 사람들 앞에서 말했습니다. 이름이 조금 알려졌습니다.', effects:{stats:{지식:4, 행복:2}, experience:{social:3}, path:{politics:'engaged'}}},
     {label:'신문만 사서 읽는다', result:'집에서 조용히 신문을 읽으며 세상 돌아가는 것을 살핍니다.', effects:{stats:{지식:3, 재산:-1}, path:{politics:'private'}}},
     {label:'거리를 둔다', result:'정치 이야기는 피하기로 했습니다. 요즘은 말 한마디도 조심해야 합니다.', effects:{stats:{행복:-1}, path:{politics:'private'}}}]);

  D('emigration', 'politics', 10, {minAge:16, maxAge:70, classes:['귀족'], fromYear:1790, toYear:1793},
    '망명할 것인가',
    '많은 귀족 가문이 국경 너머 코블렌츠로 떠났습니다. 남으면 의심을 받고, 떠나면 재산이 몰수될 수 있습니다.',
    [{label:'국경을 넘어 망명한다', result:'밤에 짐을 꾸려 국경을 넘었습니다. 남겨 둔 땅과 집은 국가에 몰수되었습니다.', effects:{stats:{재산:-25, 행복:-6, 지식:3}, milestone:'망명'}},
     {label:'남아서 공화국에 충성을 맹세한다', preview:'무사 / 체포', outcomes:[
        O('safe', '무사히 시절을 넘겼습니다', 60, '작위를 내려놓고 ‘시민’으로 살았습니다. 땅의 일부는 지켰습니다.', {stats:{재산:-8, 행복:-3}}),
        O('arrested', '혐의자로 체포되었습니다', 40, '몇 달을 감옥에서 보냈습니다. 테르미도르 이후에야 풀려났습니다.', {stats:{건강:-8, 행복:-8, 재산:-10}, milestone:'혐의자로 투옥'})]},
     {label:'시골 영지에 조용히 숨는다', result:'사람들 눈에 띄지 않게 지냈습니다.', effects:{stats:{행복:-4, 재산:-4}}}]);

  // ---------------- 장년기 (26–59) ----------------
  D('cahier', 'politics', 10, {minAge:21, fromDate:[1789,1], toDate:[1789,4]},
    '진정서를 함께 쓸까?',
    '삼부회를 앞두고 교구마다 백성의 불만과 바람을 적은 진정서를 모읍니다. 마을 광장에 사람들이 모였습니다.',
    [{label:'불만을 적어 넣자고 나선다', result:'세금과 부역, 빵값에 대한 이야기를 진정서에 적었습니다.', effects:{stats:{지식:3, 행복:3}, experience:{inequality:2, social:1}, path:{politics:'engaged'}}},
     {label:'글을 아는 사람에게 맡긴다', result:'공증인이 대신 적는 것을 지켜보았습니다.', effects:{stats:{지식:1}}},
     {label:'괜히 나섰다가 화를 입을까 빠진다', result:'집에 머물렀습니다.', effects:{stats:{}}}]);

  D('seigneur-dues', 'economy', 7, {minAge:20, maxAge:60, classes:['농민'], toYear:1788},
    '영주의 부과조',
    '영주의 관리인이 밀린 부과조와 방앗간 사용료를 내라고 합니다. 올해 수확으로는 빠듯합니다.',
    [{label:'빚을 내서라도 낸다', result:'돈을 빌려 부과조를 냈습니다.', effects:{stats:{재산:-6}}},
     {label:'마을 사람들과 함께 영주 법정에 호소한다', preview:'감면 / 기각', outcomes:[
        O('reduced', '일부를 감면받았습니다', 40, '오래된 장부의 오류가 드러나 일부를 덜어 냈습니다.', {stats:{재산:-1, 행복:4}, experience:{social:2}}),
        O('denied', '기각되었습니다', 60, '소송 비용만 들었습니다.', {stats:{재산:-8, 행복:-3}, experience:{inequality:3}})]},
     {label:'곡물 일부를 숨긴다', result:'들키지 않았지만 마음이 편치 않습니다.', effects:{stats:{재산:-2, 행복:-2}}}]);

  D('biens-nationaux', 'economy', 10, {minAge:21, fromYear:1791, toYear:1796, minWealth:45},
    '국유지 경매',
    '교회와 망명 귀족에게서 몰수한 땅이 경매에 나왔습니다. 아시냐 지폐로 값을 치를 수 있습니다.',
    [{label:'땅을 사들인다', preview:'좋은 땅 / 분쟁', outcomes:[
        O('land', '좋은 땅을 얻었습니다', 65, '수도원 소유였던 밭과 포도밭을 샀습니다. 앞으로 소작료가 들어옵니다.', {stats:{재산:12}, experience:{commerce:2}, milestone:'국유지 매입'}),
        O('dispute', '소유권 다툼에 휘말렸습니다', 35, '옛 소작인들과 다툼이 벌어졌습니다. 이웃들의 시선도 곱지 않습니다.', {stats:{재산:4, 행복:-4}, closeness:-3})]},
     {label:'교회 땅은 사지 않는다', result:'양심에 걸려 경매에 나가지 않았습니다.', effects:{stats:{행복:2}, experience:{religious:1}}}]);

  D('bread-riot', 'politics', 10, {minAge:16, maxAge:65, classes:['도시 평민','농민'], years:[1775, 1789, 1795, 1817, 1847]},
    '빵값 폭동',
    '빵값이 하루가 다르게 오릅니다. 여자들이 앞장서서 곡물 창고로 몰려가며 ‘정당한 값’에 팔라고 외칩니다.',
    [{label:'함께 곡물 창고로 간다', preview:'싼 빵 / 체포', outcomes:[
        O('fair', '정당한 값에 곡물을 샀습니다', 60, '상인은 결국 군중이 정한 값에 밀을 내놓았습니다.', {stats:{재산:3, 행복:2}, experience:{social:2, inequality:2}}),
        O('jailed', '기마 경찰대에 붙잡혔습니다', 40, '며칠 동안 갇혀 있다 풀려났습니다.', {stats:{건강:-3, 행복:-5, 재산:-3}})]},
     {label:'끼니를 줄이며 버틴다', result:'수프에 빵을 덜 넣으며 버텼습니다.', effects:{stats:{건강:-2, 재산:-1}}}]);

  D('master-craft', 'career', 8, {minAge:22, maxAge:40, classes:['도시 평민'], toYear:1790, hasJob:true},
    '장인 자격 시험',
    '동업조합의 장인이 되려면 걸작을 만들어 심사를 받고 큰 가입금을 내야 합니다. 장인의 아들이나 사위라면 훨씬 수월합니다.',
    [{label:'걸작을 만들어 심사를 받는다', preview:'합격 / 낙방', outcomes:[
        O('pass', '장인 자격을 얻었습니다', 50, '심사관들이 고개를 끄덕였습니다. 이제 자기 작업장을 열 수 있습니다.', {job:'장인', stats:{재산:-8, 행복:6, 지식:3}, experience:{craft:3}, milestone:'동업조합 장인 승격'}, [{when:{experienceMin:{craft:4}}, amount:20}]),
        O('fail', '심사에서 떨어졌습니다', 50, '작은 흠을 트집 잡혔습니다. 가입금만 날렸습니다.', {stats:{재산:-6, 행복:-5}, experience:{inequality:2}})]},
     {label:'평생 직인으로 남는다', result:'남의 작업장에서 일하며 품삯을 받습니다.', effects:{stats:{재산:2}}}]);

  D('open-shop', 'career', 8, {minAge:22, maxAge:50, classes:['도시 평민'], fromYear:1792, hasJob:true},
    '내 작업장을 열까?',
    '동업조합이 폐지되어 영업세만 내면 누구나 가게를 열 수 있습니다. 경쟁자도 그만큼 늘었습니다.',
    [{label:'작업장을 연다', preview:'번창 / 고전', outcomes:[
        O('thrive', '단골이 생겼습니다', 55, '작은 간판을 걸었습니다. 도제도 한 명 들였습니다.', {job:'자영업자', stats:{재산:8, 행복:4}, experience:{commerce:2}, milestone:'작업장 개업'}, [{when:{minWealth:40}, amount:15}]),
        O('struggle', '빚만 늘었습니다', 45, '손님이 적어 이듬해 가게를 접었습니다.', {stats:{재산:-10, 행복:-4}})]},
     {label:'남의 작업장에서 계속 일한다', result:'안정된 품삯을 택했습니다.', effects:{stats:{재산:2}}}]);

  D('wet-nurse', 'parenting', 7, {minAge:20, maxAge:42, livingRoles:['자녀'], classes:['도시 평민','부르주아'], toYear:1840},
    '갓난아기를 시골 유모에게 보낼까?',
    '도시의 많은 집이 일하느라 갓난아기를 시골 유모에게 맡깁니다. 비용이 들고, 아이를 몇 해 동안 보지 못합니다.',
    [{label:'시골 유모에게 맡긴다', result:'아이를 마차에 태워 보냈습니다. 일은 계속할 수 있지만 마음이 무겁습니다.', effects:{stats:{재산:-3, 행복:-4}, relationCloseness:{roles:['자녀'], amount:-8}}},
     {label:'집에서 직접 키운다', result:'일을 줄이고 아이를 곁에서 키웁니다.', effects:{stats:{재산:-4, 행복:5}, relationCloseness:{roles:['자녀'], amount:8}}}]);

  D('blockade', 'economy', 10, {minAge:20, maxAge:65, fromYear:1807, toYear:1813, classes:['부르주아']},
    '대륙 봉쇄령',
    '나폴레옹이 영국과의 무역을 금지했습니다. 설탕과 커피값이 치솟고, 항구에는 밀수 이야기가 오갑니다.',
    [{label:'밀수품을 들여온다', preview:'큰돈 / 적발', outcomes:[
        O('rich', '큰돈을 벌었습니다', 55, '야음을 틈타 영국 상품을 들여왔습니다. 금고가 두둑해졌습니다.', {stats:{재산:12}, experience:{commerce:3}}),
        O('seized', '세관에 적발되었습니다', 45, '물건을 몰수당하고 벌금을 물었습니다.', {stats:{재산:-12, 행복:-4}})]},
     {label:'사탕무 설탕 같은 새 사업에 투자한다', result:'정부가 장려하는 사탕무 설탕 공장에 지분을 샀습니다.', effects:{stats:{재산:3, 지식:3}, experience:{commerce:2, curiosity:1}}},
     {label:'규정을 지키며 버틴다', result:'장사는 줄었지만 떳떳합니다.', effects:{stats:{재산:-3}}}]);

  D('savings-bank', 'economy', 6, {minAge:22, maxAge:60, fromYear:1818, classes:['도시 평민','농민']},
    '저축 금고에 돈을 맡길까?',
    '새로 생긴 저축 금고에서 노동자의 작은 돈도 맡아 이자를 준다고 합니다. 매트리스 밑보다 안전하다지만, 은행을 믿지 않는 사람도 많습니다.',
    [{label:'통장을 만든다', result:'매주 몇 수씩 맡기기 시작했습니다.', effects:{stats:{재산:4}, experience:{commerce:1}}},
     {label:'돈은 손에 쥐고 있어야 한다', result:'모은 돈을 집 안 깊숙이 숨겨 두었습니다.', effects:{stats:{}}}]);

  D('cholera-flight', 'family', 10, {minAge:16, fromYear:1832, toYear:1832, places:['파리']},
    '콜레라를 피해 떠날까?',
    '하루에도 수백 명이 쓰러집니다. 형편이 되는 사람들은 시골로 떠나고 있습니다.',
    [{label:'시골 친척 집으로 피신한다', result:'몇 달을 시골에서 보냈습니다. 돌아와 보니 이웃 몇이 보이지 않습니다.', effects:{stats:{재산:-5, 건강:2, 행복:-2}}},
     {label:'남아서 앓는 이웃을 돌본다', preview:'무사 / 감염', outcomes:[
        O('safe', '무사히 넘겼습니다', 75, '죽을 끓이고 물을 끓여 날랐습니다. 이웃들은 당신을 잊지 않을 것입니다.', {stats:{행복:3}, closeness:6, experience:{social:3, responsibility:2}}),
        O('infected', '병에 걸렸다가 겨우 살아났습니다', 25, '며칠 사경을 헤맸습니다.', {stats:{건강:-12, 행복:-3}, closeness:4})]},
     {label:'문을 닫고 집에 머문다', result:'창문을 닫고 식초로 집을 닦으며 버텼습니다.', effects:{stats:{행복:-2}}}]);

  D('vote-1848', 'politics', 10, {minAge:21, sexes:['남성'], fromDate:[1848,4], toDate:[1848,12]},
    '생애 첫 투표',
    '스물한 살 이상 남자라면 누구나 투표할 수 있게 되었습니다. 투표소는 읍내에 있고, 마을 사람들이 함께 줄지어 갑니다.',
    [{label:'공화파 후보에게 투표한다', result:'처음으로 투표함에 표를 넣었습니다.', effects:{stats:{행복:3, 지식:1}, path:{politics:'engaged'}, milestone:'첫 투표'}},
     {label:'질서와 안정을 말하는 후보에게 투표한다', result:'혼란은 이제 그만이라고 생각했습니다.', effects:{stats:{행복:2}, path:{politics:'private'}, milestone:'첫 투표'}},
     {label:'투표하러 가지 않는다', result:'밭일이 더 급했습니다.', effects:{stats:{재산:1}}}]);

  // ---------------- 노년기 (55+) ----------------
  D('inheritance', 'old-age', 8, {minAge:58, livingRolesAny:['자녀'], minWealth:20},
    '재산을 어떻게 물려줄까',
    '공증인을 불러 유언장을 쓸 때가 되었습니다. 민법전 이후로는 자녀들에게 몫을 고루 나눠야 하지만, 맏이에게 더 주는 방법도 있다고 합니다.',
    [{label:'자녀들에게 똑같이 나눈다', result:'모두에게 같은 몫을 남겼습니다. 땅은 잘게 나뉘겠지만 다툼은 없을 것입니다.', effects:{stats:{행복:4}, relationCloseness:{roles:['자녀'], amount:5}, milestone:'유언장 작성'}},
     {label:'집과 땅은 맏이에게, 나머지는 돈으로', result:'집안의 터전을 지키기로 했습니다. 동생들은 서운해합니다.', effects:{stats:{재산:2}, relationCloseness:{roles:['자녀'], amount:-3}, milestone:'유언장 작성'}},
     {label:'일부를 교구와 가난한 이웃에게 남긴다', result:'자녀 몫을 조금 줄여 기부를 약속했습니다.', effects:{stats:{행복:5, 재산:-4}, experience:{religious:2}, milestone:'유언장 작성'}}]);

  D('elder-home', 'old-age', 8, {minAge:62, livingRolesAny:['자녀']},
    '자녀 집으로 들어갈까?',
    '혼자 살림을 꾸리기가 버거워졌습니다. 자녀가 함께 살자고 합니다. 대신 땅과 집을 미리 넘겨 달라는 말도 오갑니다.',
    [{label:'재산을 넘기고 자녀 집에 들어간다', result:'부양 계약서를 쓰고 자녀 집에 들어갔습니다. 손주들이 늘 곁에 있습니다.', effects:{stats:{재산:-8, 행복:5, 건강:2}, relationCloseness:{roles:['자녀'], amount:6}}},
     {label:'내 집에서 혼자 지낸다', result:'익숙한 집에서 지내기로 했습니다. 이웃이 가끔 들여다봅니다.', effects:{stats:{행복:1, 건강:-1}}}]);

  D('remarriage', 'old-age', 7, {minAge:45, hadRoles:['배우자'], noLivingRoles:['배우자'], unsetFlag:'remarriage'},
    '다시 혼인할까?',
    '배우자를 떠나보낸 지 시간이 흘렀습니다. 이웃이 비슷한 처지의 사람을 소개하겠다고 합니다.',
    [{label:'만나 본다', result:'조용히 재혼했습니다. 마을 젊은이들이 밤에 냄비를 두드리며 놀려 댔습니다(샤리바리).', effects:{spouse:true, stats:{행복:6}, milestone:'재혼'}},
     {label:'혼자 지낸다', result:'추억을 품고 혼자 살기로 했습니다.', effects:{stats:{행복:-1}}}]);

  D('memoir', 'old-age', 6, {minAge:60, literacy:['basic']},
    '살아온 이야기를 적을까?',
    '손주들이 옛날이야기를 조릅니다. 당신이 겪은 시대를 기록으로 남길 수 있는 사람은 이제 많지 않습니다.',
    [{label:'가족 기록장(livre de raison)에 적는다', result:'저녁마다 촛불 아래에서 지나온 해들을 적었습니다.', effects:{stats:{행복:4, 지식:2}, closeness:3, milestone:'회고록을 씀'}},
     {label:'말로만 들려준다', result:'손주들을 무릎에 앉히고 옛이야기를 들려주었습니다.', effects:{stats:{행복:3}, closeness:4}}]);

  D('pilgrimage', 'religion', 6, {minAge:55, religions:['catholic'], excludeYears:[1793, 1801]},
    '순례를 떠날까?',
    '늙기 전에 이름난 성지에 다녀오고 싶다는 마음이 듭니다. 걸어서 몇 주가 걸리는 길입니다.',
    [{label:'순례를 떠난다', result:'지팡이를 짚고 성지에 다녀왔습니다. 몸은 지쳤지만 마음은 가볍습니다.', effects:{stats:{행복:6, 건강:-2, 재산:-3}, experience:{religious:3}, milestone:'순례'}},
     {label:'마을 성당에서 기도한다', result:'익숙한 자리에서 조용히 기도했습니다.', effects:{stats:{행복:2}, experience:{religious:1}}}]);
})();
