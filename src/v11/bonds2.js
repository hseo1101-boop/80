// src/data/bonds-1800-1914.js — 인연, 나폴레옹부터 제3공화국까지
// Seeds and returns for the later regimes: the conscript you hid under the Empire is the mayor who
// draws up the 1813 list; the republican student you sheltered under Louis-Philippe governs the
// department in 1848, is hunted in 1851 and comes back a deputy in 1871; the neighbour you reported
// to the imperial police sits in the Republic's chamber; the communard you hid in 1871 returns with
// the amnesty of 1880.
(() => {
  const D = (id, when, title, text, choices, chance) => decisions.push({id, domain:'bond', priority:32, title, text, chance,
    when:{...when, maxBonds:3, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id]}}))});
  const H = (id, date, until, when, title, text, choices, chance) => decisions.push({id, domain:'history', priority:30, historic:true, title, text, chance,
    when:{...when, fromDate:date, toDate:until, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id]}}))});
  const B = (key, kind, fate, memo, job) => ({key, kind, fate, memo, job});
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});

  // ───── 나폴레옹 시대: 징집 ─────
  D('bond-dodger', {minAge:20, maxAge:70, fromYear:1799, toYear:1809}, '징집을 피한 이웃 아들',
    '이웃집 아들이 징집 제비뽑기에서 나쁜 번호를 뽑고 숲으로 달아났습니다. 헌병이 마을을 뒤지며, 숨겨 주는 집은 벌금을 문다고 합니다. 오늘 밤 그가 당신 헛간 문을 두드립니다.',
    [{label:'헛간에 숨겨 준다', preview:'무사함 / 벌금', outcomes:[
       O('safe', '무사히 넘겼습니다', 80, '헌병은 헛간을 그냥 지나쳤습니다. 이듬해 그는 대리인을 사서 돌아왔고, 마을에서 자리를 잡았습니다.', {stats:{행복:2}, bond:B('dodger', 'favor', 'notable', '징집을 피해 달아났을 때 숨겨 준', '농부')}),
       O('fined', '벌금을 물었습니다', 20, '헌병이 짚더미에서 그를 끌어냈고, 당신은 벌금을 물었습니다. 그래도 그는 그 밤을 잊지 않았습니다.', {stats:{재산:-6}, bond:B('dodger', 'favor', 'notable', '징집을 피해 달아났을 때 숨겨 준', '농부')})]},
     {label:'헌병에게 알린다', result:'그는 끌려가 연대로 보내졌습니다. 몇 해 뒤 다리 하나를 절며 돌아왔습니다.', effects:{bond:B('dodger', 'grudge', 'notable', '징집을 피했을 때 헌병에게 넘긴', '상이군인')}}], .2);
  H('conscription-1813-favor', [1812,12], [1813,10], {minAge:38, childAge:[18, 24], childSex:'남성', bond:{kind:['favor'], fate:['notable'], here:true, risen:true}}, '시장의 징집 명단',
    '러시아에서 대군이 사라졌습니다. 황제는 1813년에만 수십만 명을 더 부릅니다. 징집 명단을 만드는 {옛사람} 시장이 밤에 찾아왔습니다. “{몇년}년 전 당신이 {그일} 일을 잊지 않았소. 당신 아들을 ‘가족 부양자’로 적어 두겠소.”',
    [{label:'그의 호의를 받는다', preview:'면제 / 도청이 거부함', outcomes:[
       O('exempt', '아들이 면제되었습니다', 65, '아들의 이름이 면제 명단에 올랐습니다. 그해 마을에서 떠난 젊은이 열둘 가운데 돌아온 사람은 다섯이었습니다.', {stats:{행복:6}, milestone:'옛 인연 덕에 아들이 징집을 면함'}),
       O('refused', '도청이 받아들이지 않았습니다', 35, '도청의 징병 위원회가 면제 사유를 받아들이지 않았습니다. 시장은 고개를 숙였고, 아들은 연대로 떠났습니다.', {stats:{행복:-6}, childJob:{age:[18, 24], sex:'남성', job:'군인'}})]},
     {label:'남의 아들이 대신 끌려간다며 사양한다', preview:'무사 귀환 / 전사', outcomes:[
       O('back', '아들이 살아 돌아왔습니다', 60, '라이프치히와 프랑스 원정을 거쳐 이듬해 봄 아들이 돌아왔습니다.', {stats:{행복:2}}),
       O('lost', '아들이 돌아오지 못했습니다', 40, '라이프치히 전투 뒤의 사망자 명단에 아들의 이름이 있었습니다.', {childDies:{age:[18, 26], sex:'남성'}})]}], .25);
  H('conscription-1813-grudge', [1812,12], [1813,10], {minAge:38, childAge:[18, 24], childSex:'남성', bond:{kind:['grudge'], fate:['notable'], here:true, risen:true}}, '명단의 맨 위',
    '1813년 징집 명단이 시청 문에 붙었습니다. 맨 위에 당신 아들의 이름이 있습니다. 명단을 만든 사람은 {옛사람} 시장. {몇년}년 전 당신이 {그일} 그 사람입니다.',
    [{label:'대리인을 산다', requires:{minWealth:45}, result:'대리인 값이 4,000프랑까지 올라 있었습니다. 재산의 큰 몫을 털었습니다.', effects:{stats:{재산:-16, 행복:-2}}},
     {label:'아들을 보낸다', preview:'무사 귀환 / 전사', outcomes:[
       O('back', '아들이 살아 돌아왔습니다', 55, '이듬해 봄, 수척해진 아들이 돌아왔습니다.', {stats:{행복:-2}}),
       O('lost', '아들이 돌아오지 못했습니다', 45, '1813년 겨울, 아들의 이름이 사망자 명단에 있었습니다. 시장은 장례식에 오지 않았습니다.', {childDies:{age:[18, 26], sex:'남성'}})]},
     {label:'아들을 숲으로 숨긴다', preview:'숨어 지냄 / 붙잡힘', outcomes:[
       O('hid', '숨어서 버텼습니다', 60, '1814년 봄 제정이 무너질 때까지 아들은 숲에서 지냈습니다.', {stats:{재산:-4, 행복:-3}}),
       O('caught', '붙잡혔습니다', 40, '헌병이 아들을 끌고 갔고, 당신은 벌금을 물었습니다.', {stats:{재산:-8, 행복:-6}})]}], .25);

  // ───── 7월 왕정: 1848년에 돌아온다 ─────
  D('bond-student', {minAge:20, maxAge:70, fromYear:1825, toYear:1846, notPlaceIncludes:'농촌'}, '쫓기는 공화파 학생',
    '인권 협회 회원이라는 젊은 법학도가 경찰에 쫓기고 있습니다. 1834년 이후 공화파 결사는 불법입니다. 그가 하룻밤만 재워 달라고 합니다.',
    [{label:'재워 준다', result:'새벽에 그는 감사 인사와 함께 떠났습니다. 「르 나시오날」 신문사에서 일한다고 했습니다.', effects:{stats:{행복:1}, bond:B('student', 'favor', 'commissaire', '쫓기던 학생 시절 재워 준', '법학도')}},
     {label:'경찰에 알린다', result:'그는 생트펠라지 감옥으로 갔습니다.', effects:{stats:{재산:1}, bond:B('student', 'grudge', 'commissaire', '쫓기던 학생 시절 경찰에 넘긴', '법학도')}},
     {label:'모른 척 문을 닫는다', result:'계단을 내려가는 발소리가 멀어졌습니다.', effects:{}}], .18);
  D('bond-bonapartist', {minAge:22, maxAge:70, fromYear:1836, toYear:1847}, '보나파르트파의 부탁',
    '루이 나폴레옹의 사람이라는 사내가 찾아와 서류 꾸러미를 맡아 달라고 합니다. 스트라스부르(1836)와 불로뉴(1840)의 실패한 봉기 이야기는 웃음거리지만, 황제의 이름은 아직 힘이 있습니다.',
    [{label:'꾸러미를 맡아 준다', result:'몇 달 뒤 그가 꾸러미를 찾아갔습니다. “황제 폐하께서 기억하실 겁니다.”', effects:{bond:B('bonapartist', 'favor', 'imperial', '음모가 시절 서류를 맡아 준', '보나파르트파 음모가')}},
     {label:'헌병대에 넘긴다', result:'꾸러미는 경찰서로 갔고, 그는 함 요새에 갇혔습니다.', effects:{bond:B('bonapartist', 'grudge', 'imperial', '음모가 시절 헌병대에 넘긴', '보나파르트파 음모가')}}], .15);

  // ───── 제2공화국: 1851년 쿠데타 뒤 ─────
  H('coup-proscrit', [1852,1], [1852,6], {minAge:20, bond:{kind:['favor'], fate:['proscrit'], risen:true}}, '쫓기는 옛 친구',
    '쿠데타 뒤 혼합 위원회가 공화파를 잡아들이고 있습니다. 1848년에 공화국 위원이던 {옛사람}이(가) 밤에 찾아왔습니다. 알제리 유형 명단에 이름이 있다며, 국경까지 갈 동안 숨겨 달라고 합니다.',
    [{label:'숨겨 주고 국경까지 길을 안내한다', preview:'무사히 망명 / 함께 붙잡힘', outcomes:[
       O('escaped', '그는 무사히 국경을 넘었습니다', 75, '그는 저지섬의 위고 곁으로 갔습니다. 몇 해 뒤 런던에서 짧은 편지가 왔습니다. “이 빚은 공화국이 갚을 것이오.”', {stats:{행복:3}, bondShift:{from:{fate:['proscrit']}, fate:'republican', memo:'1852년 망명길을 숨겨 준'}}),
       O('caught', '함께 붙잡혔습니다', 25, '국경 근처 여인숙에서 헌병에게 붙잡혔습니다. 그는 알제리로, 당신은 석 달 감옥으로 갔습니다.', {stats:{건강:-6, 재산:-5, 행복:-6}, bondShift:{from:{fate:['proscrit']}, fate:'republican', memo:'1852년 함께 감옥에 간'}})]},
     {label:'가족이 걱정되어 거절한다', result:'그는 말없이 돌아섰습니다. 사흘 뒤 붙잡혀 알제리로 보내졌다는 소식을 들었습니다.', effects:{stats:{행복:-4}, bondShift:{from:{fate:['proscrit']}, kind:'grudge', fate:'republican', memo:'1852년 쫓기던 밤 문을 닫은'}}}], .4);
  D('bond-june-1848', {minAge:18, maxAge:70, places:['파리'], fromYear:1848, toYear:1849}, '6월의 패잔병',
    '6월 봉기가 진압된 뒤 군인들이 집집마다 반란자를 찾고 있습니다. 화약 냄새가 밴 젊은 노동자 하나가 당신 가게 뒷문으로 숨어들었습니다.',
    [{label:'옷을 바꿔 입혀 내보낸다', result:'그는 앞치마를 두르고 군인들 사이로 걸어 나갔습니다.', effects:{stats:{행복:2}, bond:B('june48', 'favor', 'republican', '1848년 6월 봉기 뒤 숨겨 준', '기계공')}},
     {label:'군인들을 부른다', result:'그는 알제리 유형을 갔다고 합니다.', effects:{stats:{행복:-3}, bond:B('june48', 'grudge', 'republican', '1848년 6월 봉기 뒤 군인에게 넘긴', '기계공')}}], .3);

  // ───── 제2제정 ─────
  D('bond-informer', {minAge:20, maxAge:75, fromYear:1853, toYear:1866}, '경찰서장의 부탁',
    '제정의 경찰서장이 조용히 부릅니다. 당신 이웃이 카페에서 황제를 욕하고 금지된 위고의 『징벌 시집』을 돌린다고 합니다. 보고만 해 주면 영업 허가 갱신은 걱정 말라고 합니다.',
    [{label:'보고한다', result:'이웃은 몇 달 뒤 마자스 감옥에 갇혔습니다. 당신의 영업 허가는 아무 문제 없이 갱신되었습니다.', effects:{stats:{재산:3, 행복:-3}, bond:B('informer', 'grudge', 'republican', '제정 시절 경찰에 밀고한', '공화파 교사')}},
     {label:'아무것도 모른다고 한다', result:'경찰서장은 당신 이름을 장부에 적었습니다. 이웃은 무슨 일이 있었는지 나중에 알았습니다.', effects:{stats:{행복:1}, bond:B('informer', 'favor', 'republican', '제정 시절 밀고를 거절한', '공화파 교사')}}], .18);
  D('bond-strike', {minAge:18, maxAge:65, classes:['도시 평민', '부르주아'], notPlaceIncludes:'농촌', fromYear:1864, toYear:1870}, '파업 기금',
    '파업이 합법이 되자 직공들이 임금 인상을 요구하며 일손을 놓았습니다. 파업 대표가 기금을 걷으러 왔습니다. 공장 주인들은 기부한 사람의 이름을 알고 싶어 합니다.',
    [{label:'기금을 낸다', result:'얼마 안 되는 돈이었지만 대표가 두 손으로 받았습니다.', effects:{stats:{재산:-2, 행복:2}, bond:B('strike', 'favor', 'auto2', '파업 때 기금을 낸', '직공 대표')}},
     {label:'주인 편에 서서 거절한다', result:'대표는 장부에 아무것도 적지 않고 돌아갔습니다.', effects:{bond:B('strike', 'grudge', 'auto2', '파업 때 등을 돌린', '직공 대표')}}], .2);

  // ───── 코뮌: 1871년 봄 ─────
  H('commune-favor', [1871,4], [1871,5], {minAge:16, places:['파리'], bond:{kind:['favor'], fate:['communard'], here:true, risen:true}}, '코뮌 위원의 방문',
    '코뮌 위원이 된 {옛사람}이(가) 당신 가게에 들렀습니다. “{몇년}년 전 당신이 {그일} 일을 기억하오.” 그는 징발 명단에서 당신 이름을 지웠습니다. 그런데 베르사유군이 곧 들어온다는 소문이 돕니다.',
    [{label:'만약을 위해 그에게 피신처를 약속한다', preview:'그를 살림 / 함께 위험', outcomes:[
       O('saved', '그를 살렸습니다', 65, '피의 일주일, 그는 약속대로 당신 지하실로 숨어들었습니다. 몇 달 뒤 몰래 스위스로 넘어갔습니다.', {stats:{행복:3}, bondShift:{from:{fate:['communard']}, fate:'amnesty', memo:'1871년 피의 일주일에 숨겨 준'}}),
       O('danger', '함께 위험에 빠졌습니다', 35, '그는 붙잡혀 누벨칼레도니로 보내졌고, 당신은 몇 주 동안 조사를 받았습니다.', {stats:{건강:-4, 행복:-5}, bondShift:{from:{fate:['communard']}, fate:'amnesty', memo:'1871년 지하실을 내준'}})]},
     {label:'고맙다고만 하고 거리를 둔다', result:'그는 고개를 끄덕이고 떠났습니다. 5월 마지막 주 이후 그의 소식은 끊겼습니다.', effects:{}}], .5);
  H('commune-grudge', [1871,4], [1871,5], {minAge:16, places:['파리'], bond:{kind:['grudge'], fate:['communard'], here:true, risen:true}}, '인민의 이름으로',
    '코뮌 위원이 된 {옛사람}이(가) 국민방위대원 몇을 데리고 왔습니다. {몇년}년 전 당신이 {그일} 그 사람입니다. 당신을 ‘베르사유의 첩자’로 의심한다고 합니다.',
    [{label:'베르사유로 몸을 피한다', result:'밤에 성벽을 넘어 베르사유로 갔습니다. 돌아왔을 때 집은 무사했지만 창고는 비어 있었습니다.', effects:{stats:{재산:-6, 행복:-4}}},
     {label:'버틴다', preview:'무사함 / 인질', outcomes:[
       O('ok', '무사히 넘겼습니다', 65, '그는 창고만 징발해 갔습니다.', {stats:{재산:-5}}),
       O('hostage', '인질로 잡혔습니다', 35, '마자스 감옥에 인질로 갇혔다가 피의 일주일의 혼란 속에 빠져나왔습니다.', {stats:{건강:-8, 행복:-8}})]}], .5);
})();
