// src/data/decisions-family.js
// Family, health, follow-up chains, heavy subjects of the period, and mid-career decisions.
// Heavy subjects are drawn from documented practice (foundling hospitals, declarations of pregnancy,
// the slave trade from Atlantic ports, debt imprisonment, the galleys for theft, denunciation under the
// Terror) and written plainly, without dwelling on suffering.

// ---- Effects these decisions need -------------------------------------------
function familyTarget(s, spec = {}) {
  return s.relations.filter(r => r.role === '자녀' && r.alive && (!spec.age || (ageOf(s, r) >= spec.age[0] && ageOf(s, r) <= spec.age[1]))
    && (!spec.sex || personSex(r) === spec.sex)).sort((a, b) => b.birthYear*12 + b.birthMonth - a.birthYear*12 - a.birthMonth)[0];
}
function applyFamilyEffects(s, e) {
  if (e.childJob) { const r = familyTarget(s, e.childJob); if (r) r.job = e.childJob.job; }
  if (e.childDies) { const r = familyTarget(s, e.childDies); if (r) { r.alive = false; r.deathYear = s.year; changeStats(s, {행복:-12}); milestone(s, `${r.name}과(와) 작별`); } }
  if (e.foundling) { const r = familyTarget(s, {age:[0, 1]}); if (r) { r.role = '맡긴 아이'; r.job = '기아 보호소'; r.closeness = 0; } }
  if (e.divorce) { const r = s.relations.find(x => x.role === '배우자' && x.alive); if (r) { r.role = '전 배우자'; r.closeness = Math.min(r.closeness, 30); milestone(s, '이혼'); } }
  if (e.addRelation) {
    const a = e.addRelation, sex = a.sex || pick(s, ['남성','여성']);
    const surname = a.ownSurname ? s.name.split(' ').at(-1) : pick(s, surnames);
    s.relations.push({name:freshName(s, sex === '남성' ? male : female, surname), role:a.role, sex, birthYear:s.year - (a.age || 0),
      birthMonth:a.age ? 1 : s.month, alive:true, closeness:a.closeness ?? 60, job:a.job || '없음'});
  }
}

DECISION_DOMAINS.push({id:'health', label:'건강', target:0});
(() => {
  const D = (id, domain, priority, when, title, text, choices, chance) => decisions.push({id, domain, priority, title, text,
    ...(chance ? {chance} : {}), when:{...when, unsetFlag:when.unsetFlag || id},
    choices:choices.map(c => ({...c, effects:{...(c.effects || {}), flags:[id, ...((c.effects || {}).flags || [])]}}))});
  const O = (id, title, weight, result, effects = {}, modifiers) => ({id, title, weight, result, effects, ...(modifiers ? {modifiers} : {})});

  // ================= 가족 =================
  D('inheritance-siblings', 'family', 8, {minAge:22, hadRoles:['아버지','어머니'], noLivingRoles:['아버지','어머니'], livingRolesAny:['형제자매']},
    '부모님이 남긴 것',
    '두 분 모두 떠나시고, 형제자매가 공증인 사무실에 모였습니다. 집과 밭, 가구 몇 점과 빚 문서가 탁자 위에 놓였습니다.',
    [{label:'똑같이 나눈다', preview:'고르게 나눔 / 땅이 너무 잘게 쪼개짐', outcomes:[
        O('default', '고르게 나눴습니다', 65, '제비뽑기로 몫을 정했습니다. 다툼 없이 서명했습니다.', {stats:{재산:3}, relationCloseness:{roles:['형제자매'], amount:4}}),
        O('split', '땅이 너무 잘게 쪼개졌습니다', 35, '각자 받은 밭이 너무 작아 농사를 지어도 먹고살기 어렵습니다. 결국 몇몇은 땅을 팔고 도시로 떠났습니다.', {stats:{재산:1, 행복:-2}}, [{when:{classes:['농민']}, amount:20}])]},
     {label:'내가 집을 맡고 형제들 몫은 돈으로 갚는다', preview:'집을 지킴 / 빚이 무거움', requires:{minWealth:30}, outcomes:[
        O('default', '집을 지켰습니다', 60, '형제들에게 몇 해에 걸쳐 갚기로 약속하고 집을 맡았습니다.', {stats:{재산:4, 행복:3}}),
        O('debt', '갚을 돈이 무거웠습니다', 40, '흉년이 들자 약속한 돈을 제때 갚지 못해 형제와 얼굴을 붉혔습니다.', {stats:{재산:-4}, relationCloseness:{roles:['형제자매'], amount:-8}})]},
     {label:'형제들에게 양보한다', preview:'형제의 고마움 / 빈손', outcomes:[
        O('default', '형제들이 고마워했습니다', 60, '내 몫을 어려운 형제에게 넘겼습니다.', {relationCloseness:{roles:['형제자매'], amount:10}, stats:{행복:3}}),
        O('nothing', '손에 남은 것이 없습니다', 40, '나중에 형편이 어려워졌을 때 그 결정을 조금 후회했습니다.', {stats:{행복:-2}})]}]);

  D('parent-care', 'family', 7, {minAge:28, maxAge:62, livingRolesAny:['아버지','어머니'], parentAgeMin:68},
    '늙으신 부모님',
    '혼자서는 살림을 꾸리기 어려워진 부모님이 함께 살 수 있겠느냐고 조심스럽게 물으십니다.',
    [{label:'집으로 모신다', preview:'함께한 마지막 몇 해 / 살림이 빠듯함', outcomes:[
        O('default', '함께 살게 되었습니다', 60, '손주들이 할아버지 할머니 곁에 모여 옛이야기를 듣습니다.', {relationCloseness:{roles:['아버지','어머니'], amount:10}, stats:{행복:3, 재산:-2}}),
        O('strain', '살림이 빠듯해졌습니다', 40, '밤마다 간병하느라 지쳤고 배우자와 다투는 일도 잦아졌습니다.', {relationCloseness:{roles:['아버지','어머니'], amount:6, }, stats:{건강:-3, 행복:-3, 재산:-3}})]},
     {label:'구빈원(병원)에 맡긴다', preview:'짐을 덜음 / 죄책감', outcomes:[
        O('default', '구빈원에 들어가셨습니다', 55, '수녀들이 돌보는 구빈원에 자리를 얻었습니다. 일요일마다 찾아갑니다.', {relationCloseness:{roles:['아버지','어머니'], amount:-6}}),
        O('guilt', '찾아갈 때마다 마음이 무겁습니다', 45, '좁은 침대에 여럿이 함께 눕는 병실이었습니다. 오래 마음에 걸렸습니다.', {stats:{행복:-5}, relationCloseness:{roles:['아버지','어머니'], amount:-10}})]},
     {label:'이웃에게 돈을 주고 돌봐 달라고 한다', requires:{minWealth:35}, result:'옆집 과부에게 매달 돈을 주고 부모님을 돌봐 달라고 했습니다.', effects:{stats:{재산:-4}}}], .25);

  D('child-marriage', 'parenting', 7, {minAge:38, childAge:[18, 26]},
    '자녀의 혼사',
    '다 자란 자녀에게 혼담이 들어왔습니다. 상대 집안은 지참금 이야기부터 꺼냅니다.',
    [{label:'지참금을 마련해 혼인시킨다', preview:'좋은 혼처 / 빚을 짐', requires:{minWealth:25}, outcomes:[
        O('default', '혼인을 시켰습니다', 65, '혼인 계약서에 서명하고 잔치를 열었습니다. 자녀가 새 집으로 떠났습니다.', {stats:{재산:-6, 행복:5}}),
        O('debt', '지참금 때문에 빚을 졌습니다', 35, '체면을 지키느라 무리했습니다. 몇 해 동안 빚을 갚았습니다.', {stats:{재산:-10, 행복:2}})]},
     {label:'자녀가 원하는 사람과 하게 둔다', preview:'행복한 혼인 / 집안의 체면', outcomes:[
        O('default', '자녀가 원하는 사람과 혼인했습니다', 60, '가진 것은 없지만 서로 아끼는 짝입니다.', {relationCloseness:{roles:['자녀'], amount:8}, stats:{행복:4}}),
        O('talk', '친척들이 수군거렸습니다', 40, '“그런 집안과 사돈을 맺다니.” 한동안 뒷말을 들었습니다.', {stats:{행복:-2}, relationCloseness:{roles:['자녀'], amount:6}})]},
     {label:'아직은 집에 둔다', result:'혼담을 미뤘습니다. 자녀는 섭섭한 눈치입니다.', effects:{relationCloseness:{roles:['자녀'], amount:-6}, stats:{재산:1}}}]);

  D('son-conscription', 'parenting', 9, {minAge:38, childAge:[20, 21], childSex:'남성', fromYear:1799, excludeYears:[1814, 1817]},
    '아들의 징병 추첨',
    '아들이 스무 살이 되어 징병 추첨에 나갑니다. 돈이 있는 집은 대리인을 사서 아들 대신 군대에 보냅니다.',
    [{label:'대리인을 산다', requires:{minWealth:55}, result:'저축을 털어 가난한 집 청년에게 돈을 주고 아들 대신 입대하게 했습니다. 그 청년의 얼굴이 오래 잊히지 않습니다.', effects:{stats:{재산:-15}, experience:{inequality:2}}},
     {label:'운에 맡긴다', preview:'좋은 번호 / 입대', outcomes:[
        O('default', '좋은 번호를 뽑았습니다', 60, '아들이 웃으며 돌아왔습니다. 그날 저녁 온 가족이 성당에 초를 켰습니다.', {stats:{행복:5}}),
        O('drafted', '아들이 입대했습니다', 40, '아들은 군복을 입고 연대로 떠났습니다. 문간에서 오래 손을 흔들었습니다.', {childJob:{age:[20, 21], sex:'남성', job:'군인'}, flags:['son-drafted'], stats:{행복:-8}})]}]);

  D('son-war-news', 'parenting', 30, {flagSet:'son-drafted', after:{id:'son-conscription', years:2}, fromYear:1801, toYear:1816},
    '전선에서 온 소식',
    '면장이 편지 한 통을 들고 찾아왔습니다. 아들의 연대에서 온 것입니다.',
    [{label:'편지를 연다', preview:'무사 / 부상 / 전사', outcomes:[
        O('default', '아들은 무사합니다', 50, '“어머니, 아버지, 저는 잘 지냅니다.” 서툰 글씨였지만 분명 아들의 글씨였습니다.', {stats:{행복:5}}),
        O('wounded', '아들이 다쳤습니다', 25, '아들이 다리를 다쳐 귀향한다는 소식입니다. 살아 돌아온다는 것만으로 감사했습니다.', {childJob:{age:[20, 40], sex:'남성', job:'상이군인'}, stats:{행복:-2}}),
        O('killed', '아들이 전사했습니다', 25, '“용감하게 싸우다…” 그 뒤로는 글자가 눈에 들어오지 않았습니다.', {childDies:{age:[20, 40], sex:'남성'}}, [{when:{years:[1812, 1813]}, amount:20}])]}]);

  D('divorce', 'marriage', 6, {minAge:22, fromYear:1793, toYear:1815, livingRoles:['배우자']},
    '이혼법',
    '1792년부터 법이 이혼을 허락합니다. 몇 해째 남남처럼 지내는 배우자와 이대로 살아야 할지 고민입니다.',
    [{label:'이혼을 청한다', preview:'새 출발 / 집안의 비난', outcomes:[
        O('default', '이혼했습니다', 55, '시청에서 이혼이 공시되었습니다. 이웃들은 수군거렸지만 숨이 트였습니다.', {divorce:true, stats:{행복:4, 재산:-4}}),
        O('scorn', '친척들이 등을 돌렸습니다', 45, '사제와 친척들이 이혼을 죄라고 했습니다. 몇 해 동안 외로웠습니다.', {divorce:true, stats:{행복:-3, 재산:-4}, closeness:-4})]},
     {label:'다시 노력해 본다', preview:'화해 / 그대로', outcomes:[
        O('default', '조금씩 다시 가까워졌습니다', 45, '함께 장에 가고 저녁을 먹으며 말을 트기 시작했습니다.', {relationCloseness:{roles:['배우자'], amount:12}, stats:{행복:3}}),
        O('cold', '달라지지 않았습니다', 55, '한 지붕 아래 다른 방에서 지냅니다.', {stats:{행복:-3}})]}], .08);

  D('orphan-nephew', 'family', 6, {minAge:28, maxAge:60, livingRolesAny:['형제자매']},
    '고아가 된 조카',
    '형제자매 한 사람이 병으로 세상을 떠나고 어린 조카만 남았습니다. 누군가 맡아야 합니다.',
    [{label:'집으로 데려온다', preview:'새 식구 / 먹일 입 하나 더', outcomes:[
        O('default', '조카가 새 식구가 되었습니다', 60, '처음엔 말이 없던 조카가 몇 달 뒤 웃기 시작했습니다.', {addRelation:{role:'조카', age:6, ownSurname:true, closeness:60}, stats:{행복:3, 재산:-3}}),
        O('hard', '살림이 더 빠듯해졌습니다', 40, '조카와 내 아이들 사이에 다툼이 잦았습니다.', {addRelation:{role:'조카', age:6, ownSurname:true, closeness:40}, stats:{재산:-5, 행복:-2}})]},
     {label:'수도회 고아원에 맡긴다', result:'고아원 수녀들에게 조카를 맡겼습니다. 친척들의 눈길이 따가웠습니다.', effects:{stats:{행복:-4}, relationCloseness:{roles:['형제자매'], amount:-6}}},
     {label:'장인에게 도제로 맡긴다', result:'조카를 아는 장인의 도제로 보냈습니다. 먹고 자는 것은 해결되었습니다.', effects:{stats:{행복:-1}}}], .03);

  // ================= 무거운 주제 =================
  D('foundling', 'parenting', 9, {minAge:16, childAge:[0, 1], maxWealth:28, notPlaceIncludes:'농촌', fromYear:1760, toYear:1850},
    '기아 보호소의 회전함',
    '갓난아기를 먹일 것이 없습니다. 도시의 가난한 집들 가운데는 아이를 기아 보호소 문의 회전함에 넣고 가는 집이 적지 않습니다. 18세기 말 파리에서는 태어난 아이의 약 3분의 1이 그렇게 맡겨졌습니다.',
    [{label:'어떻게든 직접 키운다', preview:'버텨 냄 / 몸이 상함', outcomes:[
        O('default', '아이를 품에 두었습니다', 60, '이웃 여자들이 젖을 나눠 주고 헌 옷을 가져다주었습니다.', {stats:{재산:-3, 행복:2}, closeness:2}),
        O('weak', '모두가 굶주렸습니다', 40, '한겨울 내내 온 식구가 굶주렸습니다.', {stats:{건강:-5, 재산:-3}})]},
     {label:'아이를 보호소에 맡긴다', preview:'표식을 남김 / 표식 없이', outcomes:[
        O('default', '아이를 맡겼습니다', 70, '밤에 회전함에 아이를 넣고 종을 울렸습니다. 아이의 이름을 적은 쪽지와 반쪽짜리 메달을 함께 넣었습니다. 언젠가 찾을 수 있기를 바랍니다.', {foundling:true, flags:['foundling-left'], stats:{행복:-14}}),
        O('nonote', '아무 표식도 남기지 못했습니다', 30, '서두르다 쪽지도 메달도 넣지 못했습니다.', {foundling:true, flags:['foundling-left'], stats:{행복:-16}})]},
     {label:'시골 유모에게 보낸다', requires:{minWealth:12}, result:'빚을 내 시골 유모에게 아이를 보냈습니다. 몇 달에 한 번 소식을 듣습니다.', effects:{stats:{재산:-5, 행복:-4}}}]);

  D('foundling-search', 'parenting', 30, {flagSet:'foundling-left', after:{id:['foundling','pregnancy'], years:8}},
    '맡긴 아이를 찾아서',
    '형편이 조금 나아졌습니다. 보호소에 맡긴 아이를 찾아갈 수 있을지, 그 생각이 떠나지 않습니다.',
    [{label:'보호소 기록을 찾아간다', preview:'다시 만남 / 이미 세상을 떠남 / 기록이 없음', outcomes:[
        O('found', '아이를 찾았습니다', 25, '시골 위탁 가정에서 자란 아이를 만났습니다. 아이는 당신을 알아보지 못했지만, 반쪽 메달이 꼭 맞았습니다.', {stats:{행복:8}, addRelation:{role:'자녀', age:8, ownSurname:true, closeness:20}}),
        O('default', '아이는 오래전에 세상을 떠났습니다', 65, '장부에는 맡긴 지 몇 달 만에 위탁 가정에서 숨졌다고 적혀 있었습니다. 보호소에 맡겨진 아이의 대부분이 그렇게 첫돌을 넘기지 못했습니다.', {stats:{행복:-10}}),
        O('lost', '기록을 찾을 수 없었습니다', 10, '같은 날 맡겨진 아이가 너무 많았습니다.', {stats:{행복:-6}})]},
     {label:'찾지 않기로 한다', result:'아이의 삶을 흔들고 싶지 않았습니다. 해마다 그날이 오면 성당에 초를 켭니다.', effects:{stats:{행복:-2}, experience:{religious:1}}}]);

  D('pregnancy', 'family', 9, {minAge:17, maxAge:28, sexes:['여성'], noLivingRoles:['배우자'], unsetFlag:'marriage', toYear:1850},
    '혼인 전의 임신',
    '아이를 가졌습니다. 아이 아버지는 혼인을 약속했지만 요즘 들어 얼굴을 보기 어렵습니다. 혁명 전에는 법에 따라 임신 신고서를 내야 했고, 혼인하지 않은 어머니에게 세상은 가혹합니다.',
    [{label:'아이 아버지에게 혼인을 요구한다', preview:'혼인 / 거절', outcomes:[
        O('default', '서둘러 혼인했습니다', 45, '두 집안이 서둘러 혼인 날짜를 잡았습니다. 몇 달 뒤 아이가 태어났습니다.', {spouse:true, flags:['marriage'], addRelation:{role:'자녀', age:0, ownSurname:true, closeness:80}, stats:{행복:2}}),
        O('refused', '그는 마을을 떠났습니다', 55, '그는 다른 도시로 떠났습니다. 혼자 아이를 낳아 키웁니다. 성당에서도 시장에서도 등 뒤에서 수군거립니다.', {addRelation:{role:'자녀', age:0, ownSurname:true, closeness:85}, stats:{행복:-8, 재산:-4}, closeness:-6})]},
     {label:'도시로 가서 몰래 아이를 낳는다', preview:'숨김 / 보호소', outcomes:[
        O('default', '아이를 낳고 돌아왔습니다', 50, '도시의 산과 병원에서 아이를 낳았습니다. 아이는 시골 유모에게 맡기고 매달 돈을 보냅니다.', {addRelation:{role:'자녀', age:0, ownSurname:true, closeness:40}, stats:{재산:-6, 행복:-6}}),
        O('hospital', '아이를 보호소에 남겼습니다', 50, '돌아올 때는 혼자였습니다. 아무에게도 말하지 않았습니다.', {stats:{행복:-14}, flags:['foundling-left']})]},
     {label:'아이를 낳아 혼자 키운다', result:'고개를 들고 아이를 낳았습니다. 어머니만은 당신 편이었습니다.', effects:{addRelation:{role:'자녀', age:0, ownSurname:true, closeness:90}, relationCloseness:{roles:['어머니'], amount:6}, stats:{행복:-4, 재산:-4}, closeness:-5}}], .03);

  D('slave-ship', 'economy', 8, {minAge:22, places:['보르도','루앙','파리'], classes:['부르주아'], toYear:1830, minWealth:45},
    '노예선 투자',
    '상인 동료가 아프리카 해안을 거쳐 생도맹그로 가는 배의 지분을 사라고 권합니다. 배는 사람을 사서 싣고 대서양을 건넙니다. 보르도와 낭트의 많은 집안이 이렇게 부를 쌓았습니다.' ,
    [{label:'지분을 산다', preview:'큰 이익 / 배를 잃음', outcomes:[
        O('default', '배가 돌아왔고 이익이 났습니다', 55, '항해가 끝나고 배당금이 들어왔습니다. 장부에는 ‘화물’이라고만 적혀 있습니다. 배에 실린 사람 여럿이 항해 중 죽었다는 보고서는 읽지 않았습니다.', {stats:{재산:12}, experience:{inequality:2}}, [{when:{fromYear:1816}, amount:-25}]),
        O('lost', '배를 잃었습니다', 45, '배가 영국 군함에 나포되었거나 반란이 일어났다고 합니다. 투자금은 돌아오지 않았습니다.', {stats:{재산:-12}})]},
     {label:'거절한다', preview:'양심 / 따돌림', outcomes:[
        O('default', '거절했습니다', 60, '“사람을 사고파는 일에는 손대지 않겠습니다.” 동료는 어깨를 으쓱했습니다.', {experience:{inequality:2}}),
        O('isolated', '상인들 사이에서 따돌림을 받았습니다', 40, '항구의 거래가 하나둘 끊겼습니다.', {stats:{재산:-4}, experience:{inequality:3}})]}]);

  D('bread-theft', 'economy', 9, {minAge:12, maxAge:60, maxWealth:18, years:[1770, 1775, 1784, 1789, 1795, 1812, 1817, 1829, 1847]},
    '빵 한 덩이',
    '사흘째 식구들이 제대로 먹지 못했습니다. 빵집 진열대의 빵이 눈앞에 있습니다. 붙잡히면 감옥이나 갤리선(나중에는 도형장)에 보내질 수 있습니다.',
    [{label:'빵을 훔친다', preview:'굶주림을 면함 / 붙잡힘', outcomes:[
        O('default', '아무도 보지 못했습니다', 55, '빵을 품에 숨기고 뛰었습니다. 아이들은 배불리 먹었고, 당신은 그날 밤 잠을 이루지 못했습니다.', {stats:{건강:3, 행복:-3}}),
        O('caught', '붙잡혔습니다', 45, '빵집 주인이 소리를 질렀고 경찰에게 끌려갔습니다. 몇 달을 감옥에서 보냈습니다. 그동안 가족이 어떻게 버텼는지 묻지 못했습니다.', {stats:{건강:-6, 행복:-10, 재산:-4}, closeness:-4})]},
     {label:'교구 구호소에 간다', result:'구호소 앞 줄에 섰습니다. 수프 한 그릇과 빵 반 덩이를 받았습니다.', effects:{stats:{건강:1, 행복:-2}}},
     {label:'아끼던 물건을 판다', result:'혼수로 받은 은 숟가락을 팔았습니다.', effects:{stats:{재산:-3, 행복:-3}}}]);

  D('denounce', 'politics', 10, {minAge:18, fromYear:1793, toYear:1794, notPlaceIncludes:'농촌'},
    '혐의자 명단',
    '구역 감시 위원회 사람이 찾아왔습니다. 이웃 하나가 왕당파라는 진술서에 서명해 달라고 합니다. 서명하지 않으면 당신도 의심받을 수 있습니다.',
    [{label:'서명한다', preview:'안전 / 양심의 가책', outcomes:[
        O('default', '서명했습니다', 100, '며칠 뒤 그 이웃이 끌려갔습니다. 그 집 아이들의 얼굴을 볼 수 없었습니다.', {flags:['denounced'], stats:{행복:-10}, closeness:-6})]},
     {label:'아는 것이 없다고 말한다', preview:'무사 / 나도 의심받음', outcomes:[
        O('default', '위원회 사람은 그냥 돌아갔습니다', 60, '이웃은 당신이 무엇을 했는지 몰랐지만, 당신은 압니다.', {flags:['protected'], experience:{responsibility:2}}),
        O('suspect', '당신 이름도 명단에 올랐습니다', 40, '몇 주 동안 감시를 받았고, 한동안 가택 연금을 당했습니다.', {flags:['protected'], stats:{행복:-6, 재산:-3}})]}]);

  D('reckoning-1795', 'politics', 30, {fromYear:1795, toYear:1796, seen:['denounce']},
    '테르미도르 이후',
    '공포정치가 끝나고, 감옥에서 풀려난 사람들이 돌아왔습니다. 거리에서 그때 일을 기억하는 눈과 마주칩니다.',
    [{label:'그 이웃을 찾아간다', preview:'사과 / 외면', outcomes:[
        O('default', '말을 꺼내기도 전에 문이 닫혔습니다', 60, '지난 일을 이야기하려 했지만, 그 집 문은 열리지 않았습니다.', {stats:{행복:-3}}, [{when:{flagSet:'protected'}, amount:-50}]),
        O('thanks', '이웃이 고맙다고 했습니다', 40, '“그때 당신이 서명하지 않았다는 걸 들었습니다.” 이웃이 손을 꼭 잡았습니다.', {stats:{행복:6}, closeness:5}, [{when:{flagSet:'protected'}, amount:50}])]},
     {label:'지난 일은 묻어 둔다', result:'아무 일도 없었던 것처럼 지냈습니다.', effects:{stats:{행복:-1}}}]);

  D('usurer', 'economy', 8, {minAge:20, maxAge:60, maxWealth:25, years:[1770, 1775, 1784, 1788, 1789, 1795, 1812, 1816, 1817, 1846, 1847]},
    '고리대금업자',
    '씨앗 살 돈조차 없습니다. 읍내의 대금업자가 높은 이자로 돈을 빌려주겠다고 합니다.',
    [{label:'돈을 빌린다', result:'차용증에 서명하고 돈을 받았습니다. 이자가 무섭게 불어날 것입니다.', effects:{flags:['borrowed'], stats:{재산:8}}},
     {label:'빌리지 않고 버틴다', result:'씨앗을 반만 뿌렸습니다. 수확이 줄 것입니다.', effects:{stats:{재산:-3}}}], .5);

  D('debt-collector', 'economy', 30, {flagSet:'borrowed', after:{id:'usurer', years:2}},
    '빚을 갚을 날',
    '대금업자가 집달관을 데리고 왔습니다. 원금에 이자가 두 배로 불어 있습니다.',
    [{label:'갚는다', preview:'갚음 / 땅을 잃음', outcomes:[
        O('default', '겨우 갚았습니다', 50, '가진 것을 다 긁어모아 갚았습니다.', {stats:{재산:-12}}),
        O('land', '밭 한 뙈기를 넘겼습니다', 50, '돈이 모자라 밭을 넘겨야 했습니다.', {stats:{재산:-16, 행복:-6}})]},
     {label:'갚을 수 없다고 버틴다', preview:'유예 / 채무 감옥', outcomes:[
        O('default', '몇 달 유예를 받았습니다', 50, '대금업자가 마지못해 기다려 주었습니다.', {stats:{행복:-3}}),
        O('prison', '채무 감옥에 갇혔습니다', 50, '빚을 갚을 때까지 감옥에 갇혔습니다. 가족이 물건을 팔아 꺼내 주었습니다.', {stats:{재산:-10, 건강:-5, 행복:-8}})]},
     {label:'가족을 데리고 몰래 떠난다', result:'밤에 짐을 꾸려 다른 고장으로 떠났습니다. 다시는 돌아갈 수 없습니다.', effects:{place:'파리', stats:{행복:-6}, closeness:-8, milestone:'빚을 피해 파리로'}}]);

  D('lend-friend', 'relationships', 6, {minAge:22, maxAge:60, minWealth:35, livingRolesAny:['친구','형제자매']},
    '돈을 빌려 달라는 부탁',
    '오랜 친구가 찾아와 사정을 털어놓습니다. 몇 해 안에 꼭 갚겠다며 돈을 빌려 달라고 합니다.',
    [{label:'빌려준다', result:'차용증 없이 돈을 건넸습니다. 친구가 몇 번이고 고개를 숙였습니다.', effects:{flags:['lent'], stats:{재산:-8}, closeness:3}},
     {label:'정중히 거절한다', result:'친구는 이해한다고 했지만, 그 뒤로 발길이 뜸해졌습니다.', effects:{closeness:-4}}], .04);

  D('loan-return', 'relationships', 30, {flagSet:'lent', after:{id:'lend-friend', years:3}},
    '빌려준 돈',
    '돈을 빌려 간 친구 소식이 들려옵니다.',
    [{label:'찾아가 이야기한다', preview:'이자까지 갚음 / 일부만 / 못 갚음', outcomes:[
        O('default', '이자까지 쳐서 갚았습니다', 40, '친구는 그 돈으로 일어섰다며 이자까지 얹어 갚았습니다. 둘 사이는 더 깊어졌습니다.', {stats:{재산:10, 행복:4}, closeness:4}),
        O('partial', '절반만 돌려받았습니다', 35, '친구도 형편이 어렵다고 했습니다. 나머지는 묻어 두기로 했습니다.', {stats:{재산:4}}),
        O('never', '돌려받지 못했습니다', 25, '친구는 이미 다른 고장으로 떠난 뒤였습니다.', {stats:{행복:-5}, closeness:-4})]}]);

  // ================= 건강 =================
  D('illness-treatment', 'health', 6, {minAge:12, maxHealth:65},
    '앓아누운 몸',
    '열이 내리지 않고 기침이 멎지 않습니다. 의사를 부를지, 동네 접골사나 약초 할머니를 찾을지, 성인에게 기도하러 갈지 정해야 합니다.',
    [{label:'의사를 부른다', requires:{minWealth:25}, preview:'회복 / 사혈로 더 쇠약해짐', outcomes:[
        O('default', '회복했습니다', 55, '의사가 처방한 약과 식이요법으로 몇 주 만에 일어났습니다.', {stats:{건강:6, 재산:-5}}),
        O('bled', '사혈 뒤 더 쇠약해졌습니다', 45, '의사가 세 번이나 피를 뽑았습니다. 열은 내렸지만 한동안 일어서기도 어려웠습니다.', {stats:{건강:-3, 재산:-5}}, [{when:{fromYear:1830}, amount:-15}])]},
     {label:'약초 할머니를 찾는다', preview:'회복 / 효과 없음', outcomes:[
        O('default', '나아졌습니다', 50, '쓴 약초 달인 물을 마시고 땀을 흘렸더니 열이 내렸습니다.', {stats:{건강:4, 재산:-1}}),
        O('none', '효과가 없었습니다', 50, '몇 주를 더 앓았습니다.', {stats:{건강:-2}})]},
     {label:'성인의 샘에 기도하러 간다', preview:'마음의 위안 / 길에서 지침', outcomes:[
        O('default', '마음이 편해졌습니다', 55, '샘물을 마시고 초를 켰습니다. 신기하게도 조금씩 기운이 돌아왔습니다.', {stats:{건강:2, 행복:3}, experience:{religious:2}}),
        O('tired', '길에서 더 지쳤습니다', 45, '아픈 몸으로 먼 길을 걸었더니 더 쇠약해졌습니다.', {stats:{건강:-3}, experience:{religious:1}})]}], .12);

  D('childbirth-help', 'health', 7, {minAge:20, maxAge:42, sexes:['여성'], livingRoles:['배우자']},
    '해산을 앞두고',
    '아이가 곧 태어납니다. 마을 산파를 부를지, 도시의 외과의(산과의)를 부를지, 어머니와 이웃 여자들에게 맡길지 정해야 합니다.',
    [{label:'산파를 부른다', preview:'순산 / 난산', outcomes:[
        O('default', '순산했습니다', 75, '산파의 손에 건강한 아이가 태어났습니다.', {addRelation:{role:'자녀', age:0, ownSurname:true, closeness:80}, stats:{행복:6, 건강:-2}}),
        O('hard', '난산이었습니다', 25, '긴 밤이었습니다. 아이는 살았고, 당신은 한동안 일어나지 못했습니다.', {addRelation:{role:'자녀', age:0, ownSurname:true, closeness:80}, stats:{건강:-8, 행복:2}})]},
     {label:'산과의를 부른다', requires:{minWealth:40}, preview:'순산 / 집게 사용', outcomes:[
        O('default', '무사히 낳았습니다', 80, '산과의가 아이를 받았습니다. 비싼 값을 치렀지만 안심이 되었습니다.', {addRelation:{role:'자녀', age:0, ownSurname:true, closeness:80}, stats:{행복:6, 재산:-5}}),
        O('forceps', '집게를 써야 했습니다', 20, '아이가 거꾸로 서 있어 산과의가 집게를 썼습니다. 둘 다 살았지만 몸이 오래 아팠습니다.', {addRelation:{role:'자녀', age:0, ownSurname:true, closeness:80}, stats:{건강:-7, 재산:-5}})]},
     {label:'어머니와 이웃 여자들에게 맡긴다', preview:'순산 / 위험', outcomes:[
        O('default', '여자들이 아이를 받았습니다', 70, '부엌에 물을 끓이고 이웃 여자들이 밤새 곁을 지켰습니다.', {addRelation:{role:'자녀', age:0, ownSurname:true, closeness:80}, stats:{행복:5, 건강:-3}}),
        O('danger', '위험한 고비가 있었습니다', 30, '피를 많이 흘렸습니다. 아이는 살았지만 당신은 몇 주를 누워 지냈습니다.', {addRelation:{role:'자녀', age:0, ownSurname:true, closeness:80}, stats:{건강:-10}})]}], .25);

  D('drink', 'health', 6, {minAge:25, maxAge:60},
    '선술집의 술',
    '일이 끝나면 선술집에 들르는 날이 늘었습니다. 요즘은 아침에도 손이 떨립니다.',
    [{label:'술을 끊는다', preview:'끊음 / 다시 손이 감', outcomes:[
        O('default', '술을 끊었습니다', 50, '몇 주는 힘들었지만 이제 저녁을 가족과 먹습니다.', {stats:{건강:4, 재산:2, 행복:-1}}),
        O('relapse', '다시 손이 갔습니다', 50, '몇 달 버티다 친구들 손에 이끌려 다시 선술집에 앉았습니다.', {stats:{건강:-2, 재산:-2}})]},
     {label:'지금처럼 지낸다', result:'선술집에서의 시간이 유일한 낙입니다.', effects:{stats:{건강:-4, 재산:-3, 행복:2}, closeness:-3}}], .02);

  D('work-injury', 'health', 6, {minAge:16, maxAge:60, hasJob:true},
    '일하다 다친 몸',
    '일하다 크게 다쳤습니다. 쉬면 품삯이 끊기고, 계속 일하면 몸이 더 상할지 모릅니다.',
    [{label:'몇 주 쉰다', result:'몸은 나았지만 그동안 빚이 늘었습니다.', effects:{stats:{건강:4, 재산:-4}}},
     {label:'접골사를 찾는다', preview:'제자리에 맞춤 / 평생 절뚝임', outcomes:[
        O('default', '뼈를 제자리에 맞췄습니다', 60, '접골사가 단번에 뼈를 맞췄습니다. 소리를 지를 만큼 아팠지만 나았습니다.', {stats:{건강:3, 재산:-2}}),
        O('limp', '평생 절뚝이게 되었습니다', 40, '뼈가 비뚤게 붙었습니다.', {stats:{건강:-5}})]},
     {label:'참고 일을 계속한다', result:'이를 악물고 일했습니다. 그 상처는 늙어서까지 쑤셨습니다.', effects:{stats:{건강:-6, 재산:1}}}], .03);
})();
