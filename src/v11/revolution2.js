// src/data/revolution-faces.js — the same day, different revolutions
// 1789 and its sequels arrive differently depending on who and where you are: the Paris artisan goes to
// the Bastille, the Paris bourgeois joins the militia that keeps order, the noble watches the first
// émigrés leave, the Lyon worker burns the toll barriers, the Bordeaux merchant arms the patriot army,
// the peasant stops paying dues. Political leaning (paths.politics) decides who is hunted in 1795.
(() => {
  const H = (id, date, when, title, text, choices) => decisions.push({id, domain:'history', priority:30, historic:true, title, text,
    when:{...when, fromDate:date, toDate:date, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id]}}))});
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});
  const stay = result => ({label:'집에 머문다', result, effects:{stats:{}}});
  const B = (key, kind, fate, memo, job) => ({key, kind, fate, memo, job});

  // The Bastille itself is the Paris artisan's and labourer's day.
  const bastille = decisions.find(d => d.id === 'bastille');
  if (bastille) bastille.when.classes = ['도시 평민'];

  H('bastille-bourgeois', [1789,7], {minAge:16, maxAge:70, places:['파리'], classes:['부르주아']}, '시청의 선거인들',
    '7월 13일, 시청에 모인 선거인들이 부르주아 민병대를 조직합니다. 무기 상점이 털리고 성문 세관이 불탔습니다. 질서를 지킬 사람이 필요하다고 합니다. 창밖으로는 바스티유로 향하는 군중이 지나갑니다.',
    [{label:'민병대에 들어가 거리 순찰을 맡는다', result:'청색과 붉은색 휘장을 달고 상점가를 지켰습니다. 며칠 뒤 민병대는 라파예트가 이끄는 국민방위대가 되었습니다.', effects:{stats:{행복:3}, experience:{responsibility:2}, path:{politics:'constitutional'}, milestone:'국민방위대에 들어감'}},
     {label:'군중을 따라 바스티유로 간다', preview:'함락의 현장 / 부상', outcomes:[
       O('victor', '바스티유가 함락되었습니다', 85, '양복 차림으로 군중 사이에 섞였습니다. 요새 안마당에서 노동자들과 어깨를 겯고 함성을 질렀습니다.', {stats:{행복:7, 지식:2}, path:{politics:'engaged'}, milestone:'바스티유 함락에 참여'}),
       O('hurt', '다쳤습니다', 15, '밀려드는 군중 속에서 넘어져 다쳤습니다.', {stats:{건강:-8}})]},
     {label:'가게 문을 걸어 잠근다', result:'덧문을 내리고 장부와 금고를 지하실로 옮겼습니다. 밤새 경종이 울렸습니다.', effects:{stats:{행복:-1}, path:{politics:'private'}}}]);
  H('bastille-noble', [1789,7], {minAge:16, maxAge:75, classes:['귀족']}, '첫 번째 망명',
    '바스티유가 무너진 지 사흘, 국왕의 동생 아르투아 백작이 밤사이 국경으로 떠났습니다. 귀족 저택 앞을 지나는 사람들의 눈빛이 달라졌습니다. 친척들이 함께 떠나자고 합니다.',
    [{label:'친척들과 국경을 넘는다', preview:'코블렌츠의 망명 궁정 / 몰수된 재산', result:'코블렌츠에서 왕자들의 궁정에 합류했습니다. 몇 해 뒤 돌아왔을 때 집은 국유재산으로 팔려 있었습니다.', effects:{stats:{재산:-15, 행복:-6}, path:{politics:'royalist'}, milestone:'망명'}},
     {label:'남아서 새 질서를 받아들인다', result:'휘장을 달고 지역 선거에 나섰습니다. 자유주의 귀족이라는 말을 들었습니다.', effects:{stats:{행복:1}, path:{politics:'constitutional'}}},
     {label:'시골 영지로 내려가 상황을 지켜본다', result:'파리를 떠났습니다. 그러나 시골에서는 대공포가 시작되고 있었습니다.', effects:{stats:{행복:-2}}}]);
  H('july-lyon-workers', [1789,7], {minAge:16, maxAge:65, places:['리옹'], classes:['도시 평민']}, '불타는 관문',
    '파리의 소식보다 먼저, 리옹 사람들이 포도주와 고기에 매기는 입시세 관문에 불을 질렀습니다. 견직공들이 몰려나와 세관 장부를 강에 던집니다.',
    [{label:'관문 방화에 가담한다', preview:'값싼 포도주 / 체포', outcomes:[
       O('burned', '관문이 불탔습니다', 75, '며칠 동안 포도주가 세금 없이 들어왔습니다. 크루아루스 언덕이 잔치 분위기였습니다.', {stats:{행복:5}, path:{politics:'engaged'}, experience:{inequality:2}}),
       O('caught', '붙잡혔습니다', 25, '부르주아 민병대에 붙잡혀 며칠 갇혔습니다. 몇 명은 교수형을 당했습니다.', {stats:{건강:-4, 행복:-6}})]},
     stay('직기 앞에 앉아 있었습니다. 밤하늘이 붉었습니다.')]);
  H('july-lyon-bourgeois', [1789,7], {minAge:16, maxAge:70, places:['리옹'], classes:['부르주아', '귀족']}, '관문을 지켜라',
    '견직공들이 입시세 관문을 불태우고 있습니다. 상인들이 부르주아 민병대를 꾸려 질서를 되찾자고 합니다.',
    [{label:'민병대에 들어간다', result:'총을 메고 관문을 지켰습니다. 붙잡힌 방화범 몇이 본보기로 처형되었습니다. 언덕 위 직공들은 그 일을 잊지 않았습니다.', effects:{stats:{행복:-1}, path:{politics:'constitutional'}, bond:B('lyon89', 'grudge', 'committee', '1789년 관문 방화 때 붙잡은', '견직공')}},
     {label:'창고를 지키는 데만 신경 쓴다', result:'비단 창고 문을 걸어 잠갔습니다.', effects:{stats:{}}}]);
  H('july-bordeaux', [1789,7], {minAge:16, maxAge:70, places:['보르도']}, '보르도 애국군',
    '파리의 소식이 역마차로 도착했습니다. 상인과 선주들이 증권 거래소에 모여 ‘애국군’을 조직하고, 파리를 돕겠다며 자원병을 모읍니다.',
    [{label:'애국군에 이름을 올린다', result:'샤르트롱 부두의 젊은 상인들과 함께 훈련을 받았습니다. 지롱드의 이름이 처음으로 하나의 정치가 되었습니다.', effects:{stats:{행복:4}, path:{politics:'gironde'}, milestone:'보르도 애국군 가담'}},
     {label:'배와 장부를 걱정한다', result:'서인도 항로의 화물이 무사하기만을 빌었습니다.', effects:{stats:{}, path:{politics:'private'}}}]);
  H('july-tours-noble', [1789,8], {minAge:16, maxAge:75, places:['투르'], classes:['귀족']}, '성의 문서고',
    '투렌의 시골 영지에서 편지가 왔습니다. 농민들이 몰려와 부과조 장부를 내놓으라 한다고 합니다. 관리인은 군대를 부를지 묻습니다.',
    [{label:'장부를 마을 사람들 앞에서 스스로 불태우게 한다', result:'관리인이 장부를 마당에서 태웠습니다. 성은 무사했고, 마을 사람들은 당신을 다르게 보기 시작했습니다.', effects:{stats:{재산:-6, 행복:2}, path:{politics:'constitutional'}, bond:B('archives', 'favor', 'mayor', '1789년 성의 장부를 스스로 태우게 한', '농부')}},
     {label:'기마 경찰대를 부른다', result:'경찰대가 와서 몇 사람을 붙잡아 갔습니다. 장부는 지켰지만, 마을의 눈빛은 얼어붙었습니다.', effects:{stats:{행복:-2}, path:{politics:'royalist'}, bond:B('archives', 'grudge', 'mayor', '1789년 기마 경찰대를 불러 붙잡게 한', '농부')}}]);
  H('aug4-peasant', [1789,8], {minAge:16, maxAge:70, placeIncludes:'농촌', classes:['농민']}, '8월 4일 밤의 소식',
    '베르사유의 국민의회가 하룻밤 사이에 ‘봉건제를 완전히 폐지한다’고 선언했다는 소식이 마을에 닿았습니다. 그런데 부과조는 값을 치르고 되사야 한다는 말도 있습니다.',
    [{label:'이제부터 부과조를 한 푼도 내지 않는다', preview:'해방 / 영주의 소송', outcomes:[
       O('free', '아무도 받으러 오지 않았습니다', 70, '영주의 징수인은 다시 오지 않았습니다. 1793년, 남은 부과조는 보상 없이 모두 폐지됩니다.', {stats:{재산:4, 행복:5}, path:{politics:'engaged'}}),
       O('sued', '영주가 소송을 걸었습니다', 30, '법원은 영주 편을 들었습니다. 그래도 몇 해 뒤 그 빚은 법과 함께 사라졌습니다.', {stats:{재산:-2, 행복:-2}})]},
     {label:'법이 정해질 때까지 기다린다', result:'관례대로 볏단을 냈습니다. 이웃들은 바보라고 했습니다.', effects:{stats:{재산:-1}, path:{politics:'private'}}}]);
  H('aug4-noble', [1789,8], {minAge:16, maxAge:75, classes:['귀족']}, '특권을 내려놓는 밤',
    '노아유 자작과 에기용 공작이 의회 연단에서 귀족의 특권을 스스로 내려놓자고 했습니다. 사냥권, 영주 재판권, 세금 면제… 당신 집안의 권리도 하룻밤에 사라집니다.',
    [{label:'시대의 흐름으로 받아들인다', result:'집안 어른들은 분개했지만, 당신은 새 헌법에 기대를 걸어 보기로 했습니다.', effects:{stats:{재산:-6, 행복:1}, path:{politics:'constitutional'}}},
     {label:'끝까지 권리를 주장한다', result:'영지의 농민들에게 예전처럼 부과조를 요구했습니다. 아무도 오지 않았습니다.', effects:{stats:{재산:-4, 행복:-3}, path:{politics:'royalist'}}}]);
  H('tuileries-bourgeois', [1792,8], {minAge:18, maxAge:60, places:['파리'], classes:['부르주아', '귀족']}, '궁을 지킬 것인가',
    '8월 10일 새벽, 당신 구역의 국민방위대 대대는 왕을 지키러 튈르리로 가라는 명령을 받았습니다. 다른 구역의 대대는 궁을 치러 간다고 합니다.',
    [{label:'명령대로 궁을 지키러 간다', preview:'후퇴 / 학살', outcomes:[
       O('retreat', '총성이 울리기 전에 물러났습니다', 70, '왕이 의회로 피신하자 대대는 흩어졌습니다. 그날 스위스 근위대 수백 명이 죽었습니다.', {stats:{행복:-6}, path:{politics:'royalist'}}),
       O('killed', '돌아오지 못했습니다', 30, '궁 계단에서 군중에게 휩쓸렸습니다.', {doom:'1792년 8월 10일, 튈르리 궁을 지키다 목숨을 잃었습니다.'})]},
     {label:'아프다고 하고 집에 남는다', result:'창문 너머로 연기가 올랐습니다. 저녁에 왕정이 끝났다는 소식을 들었습니다.', effects:{stats:{}, path:{politics:'private'}}},
     {label:'반대편 대대에 합류한다', preview:'공화국의 탄생 / 부상', outcomes:[
       O('won', '궁이 함락되었습니다', 80, '부르주아 출신이라는 의심 어린 눈길 속에서도 끝까지 함께 진격했습니다.', {stats:{행복:5}, path:{politics:'engaged'}}),
       O('hurt', '다쳤습니다', 20, '궁 앞마당에서 총탄에 다쳤습니다.', {stats:{건강:-12}, path:{politics:'engaged'}})]}]);
  H('section-committee', [1793,10], {minAge:20, maxAge:65, classes:['도시 평민'], notPlaceIncludes:'농촌', politicsIn:['engaged', 'mountain']}, '구역 감시위원회',
    '구역 회의가 당신을 감시위원으로 뽑았습니다. 오늘 책상에 놓인 고발장에는 같은 골목의 늙은 가게 주인 이름이 있습니다. 미사에 몰래 다니고, 아시냐 지폐를 받지 않으려 했다는 것입니다.',
    [{label:'명단에 올린다', result:'가게 주인은 끌려갔습니다. 위원회에서는 당신을 믿을 만한 애국자라고 했습니다.', effects:{stats:{행복:-3}, path:{politics:'mountain'}, bond:B('section', 'grudge', 'official', '1793년 혐의자 명단에 올린', '가게 주인')}},
     {label:'증거가 없다며 고발장을 묻어 둔다', preview:'무사함 / 나도 의심받음', outcomes:[
       O('ok', '아무도 눈치채지 못했습니다', 70, '고발장은 서류 더미 아래로 사라졌습니다. 가게 주인은 끝내 그 일을 몰랐지만, 그의 아들은 알게 됩니다.', {stats:{행복:2}, bond:B('section', 'favor', 'official', '1793년 고발장을 묻어 준', '가게 주인 아들')}),
       O('suspect', '당신도 의심을 받았습니다', 30, '‘온건파’라는 말이 돌기 시작했습니다. 위원 자리에서 물러났습니다.', {stats:{행복:-4}, bond:B('section', 'favor', 'official', '1793년 고발장을 묻어 준', '가게 주인 아들')})]}]);
  H('white-terror', [1795,5], {minAge:18, maxAge:70, places:['리옹', '보르도', '투르'], politicsIn:['engaged', 'mountain']}, '백색 공포',
    '테르미도르 뒤, 바람이 거꾸로 붑니다. ‘예후의 무리’라 불리는 청년들이 옛 자코뱅을 찾아다닙니다. 리옹에서는 감옥에 갇힌 자코뱅들이 학살당했다는 소식입니다. 당신의 이름도 그들의 명단에 있을지 모릅니다.',
    [{label:'시골로 몸을 피한다', result:'몇 달을 숨어 지냈습니다. 돌아왔을 때 옛 동지 몇은 보이지 않았습니다.', effects:{stats:{재산:-5, 행복:-5}, milestone:'백색 공포를 피해 숨음'}},
     {label:'버틴다', preview:'무사함 / 습격', outcomes:[
       O('ok', '무사히 넘겼습니다', 65, '창문 아래로 노랫소리가 지나갔지만, 문을 두드리지는 않았습니다.', {stats:{행복:-2}}),
       O('beaten', '습격당했습니다', 30, '밤길에 몽둥이를 든 청년들에게 붙잡혀 크게 다쳤습니다.', {stats:{건강:-15, 행복:-6}}),
       O('killed', '돌아오지 못했습니다', 5, '론강에 시신이 떠올랐습니다.', {doom:'1795년, 백색 공포 속에서 옛 자코뱅이라는 이유로 살해되었습니다.'})]}]);
})();
