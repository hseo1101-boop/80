// src/lifefix.js — a life that moves: class follows work, careers survive interruptions, letters can be
// learned late, the well-born go to school, faculties are chosen, and the Convention can be entered.
//
// 1. Station follows work. The birth class is kept (familyEvents.birthClass) but the class that ordinary
//    events read now follows the adult's work and place: a peasant's son who becomes a Paris journeyman is
//    도시 평민; a clerk who becomes a lawyer is 부르주아. Family-trade events for a parent's craft stop
//    once a grown child works at something else.
// 2. A career interrupted (conscription, a failed shop, a lost post) waits; when the person is free again
//    within twelve years, they go back to it at the same rank.
// 3. Adults who cannot read can still learn: winter classes, the brothers' Sunday school, a regiment's
//    school, a literate spouse.
// 4. Sons (and daughters) of nobles and well-off bourgeois skip the "help at home / choose a trade" path:
//    at ten they go to the collège (later the école centrale or the lycée; girls to a convent boarding
//    school), and at seventeen the sons choose a faculty.
// 6. In 1791 and 1792 a lettered, known man can stand for the Assembly and the Convention, take a seat
//    with the Gironde, the Mountain or the Plain, and face the trials of 1793–94 as a deputy.
const ELITE_SKIP = new Set(['learn', 'school', 'apprentice', 'guizot-school', 'village-school', 'lycee-or-seminary', 'shepherd', 'chimney-sweep', 'mill-child',
  'girls-school-1836', 'girls-convent-or-lay', 'village-school-girls', 'domestic-service']);
function isEliteChild(s) {
  const born = s.familyEvents?.birthClass || s.class, w0 = s.familyEvents?.w0 ?? s.stats.재산;
  return born === '귀족' || (born === '부르주아' && w0 >= 45) || !!s.familyEvents?.llg;
}
function lifeFixBlocks(s, d) {
  if (ageOf(s) >= 21 || !isEliteChild(s)) return false;
  if (ELITE_SKIP.has(d.id) || d.id === 'college') return true;
  // Sons of the well-born choose their path at seventeen, at the faculty decision, not earlier at a trade door.
  return s.sex === '남성' && ageOf(s) < 17 && (/^door-/.test(d.id) || d.id === 'seminary');
}

function lifeFixYear(s) {
  if (s.dead) return;
  if (!s.familyEvents.birthClass) s.familyEvents.birthClass = s.class;
  const age = ageOf(s);
  // ── 4. 엘리트 교육 ──
  // A boy who may be offered Louis-le-Grand (llg.js) waits for that answer; declining it sends him here a year later.
  const llgWait = /^llg-entry/.test(s.decision || '') || (s.sex === '남성' && ['부르주아', '귀족'].includes(s.class) && !s.familyEvents.llgOffered && age < 12 && !s.familyEvents.real);
  if (age >= 10 && age <= 12 && isEliteChild(s) && !s.familyEvents.eliteSchool && !llgWait) {
    s.familyEvents.eliteSchool = s.year;
    const y = s.year, boy = s.sex === '남성';
    const place = boy ? (y < 1762 ? '예수회 콜레주' : y < 1793 ? '오라토리오회 콜레주' : y < 1802 ? '중앙학교(에콜 상트랄)' : '리세') : (y >= 1792 && y < 1802 ? '가정교사' : '수녀원 기숙학교');
    const text = boy ? {예수회:'예수회 콜레주의 기숙사에 들어갔습니다. 라틴어 문법과 수사학, 그리고 매일 아침 미사입니다.', 오라토리오회:'오라토리오회 콜레주의 기숙생이 되었습니다. 라틴어와 함께 수학과 프랑스어 작문도 배웁니다.',
        중앙학교:'혁명이 옛 콜레주를 없애고 세운 중앙학교에 들어갔습니다. 라틴어 대신 화학과 도안, 박물학을 배웁니다.', 리세:'제국(왕국)의 리세에 기숙생으로 들어갔습니다. 북소리에 일어나고, 라틴어 작문과 수학으로 하루를 보냅니다.'}[place.split(/[ (]/)[0]]
      : place === '가정교사' ? '수녀원이 문을 닫은 시절이라, 집에 가정교사가 와서 읽기와 쓰기, 음악과 바느질을 가르칩니다.'
      : '수녀원 기숙학교에 들어갔습니다. 읽기와 쓰기, 교리, 음악과 자수, 그리고 좋은 혼처를 위한 예법을 배웁니다.';
    s.education = place; s.literacy = 'basic'; changeStats(s, {지식:6});
    addLog(s, `학교 · ${place}`, text, 'normal');
    milestone(s, `${place} 입학`);
  }
  // ── 1. 계층이 일을 따라간다 ──
  if (age >= 18 && !['없음', '은퇴'].includes(s.job) && s.class !== '귀족' && !s.familyEvents.real) {
    const j = s.job, rural = s.place.includes('농촌');
    const high = /변호사|의사|공증|은행|도매상|공장주|산업가|국장|도지사|의원|행정관|교수|학사원|참사관|수석|대령|장군|대위|발행인|이름난|명배우|유명|선장|주교|참사회원|토목 기사|리세 교사|상인$/.test(j);
    const low = /노동자|날품|물장수|하녀|하인|도제|직인|직물|방적|제화|인쇄|재봉|공 보조|판매원|순경|자영업자|작업장/.test(j);
    const fallen = /노동자|날품|물장수|하녀|하인/.test(j);   // only these pull a bourgeois down
    const farm = /농부|소작|목동/.test(j);
    const next = high ? '부르주아' : farm && rural ? '농민' : low && !rural && (s.class !== '부르주아' || fallen) ? '도시 평민' : null;
    if (next && next !== s.class) {
      const before = s.class; s.class = next;
      milestone(s, `계층: ${before} → ${next}`);
      addLog(s, '삶의 자리', next === '부르주아' ? `${j}(으)로 살아가는 당신을 이제 사람들은 ‘무슈(마담)’라고 부릅니다. ${before} 집안에서 태어난 사람이 부르주아의 자리에 섰습니다.`
        : next === '도시 평민' ? `${s.place}의 ${j}. ${before} 집안에서 태어났지만, 이제 당신의 하루는 도시 작업장과 골목의 하루입니다.`
        : `${before === '부르주아' ? '도시의 삶을 접고' : ''} 이제 당신은 밭에서 살아가는 사람입니다.`, 'normal');
    }
  }
  // ── 2. 끊긴 경력으로 돌아가기 ──
  const paused = s.familyEvents.pausedCareer;
  if (paused && !s.career && ['없음', '임시 노동자'].includes(s.job) && age < 62 && !(typeof isAbroad === 'function' && isAbroad(s)) && !atFront(s)) {
    const [id, rank, since] = String(paused).split(':');
    if (CAREERS[id] && s.year - Number(since) <= 12) {
      delete s.familyEvents.pausedCareer;
      s.career = {id, rank:Number(rank), since:s.year}; s.flags.career = true;
      const r = ranksOf(s, id)[Number(rank)];
      if (r?.npcJob) employerFor(s, r);
      s.job = rankLabel(s, r);
      addLog(s, '🌿 좋은 일 · 옛 일로', `${s.job}(으)로 다시 일을 시작했습니다. 옛 동료들이 자리를 비워 두었습니다.`, 'good');
      milestone(s, `${s.job}(으)로 복귀`);
    } else if (s.year - Number(since) > 12) delete s.familyEvents.pausedCareer;
  }
}
// Called where a career is cleared because the job changed.
function pauseCareer(s) { if (s.career && !['은퇴'].includes(s.job)) s.familyEvents.pausedCareer = `${s.career.id}:${s.career.rank}:${s.year}`; }

(() => {
  const O = (id, title, weight, result, effects = {}, modifiers) => ({id, title, weight, result, effects, ...(modifiers ? {modifiers} : {})});
  const D = (id, domain, priority, when, title, text, choices, chance) => decisions.push({id, domain, priority, title, text, ...(chance ? {chance} : {}),
    when:{...when, unsetFlag:when.unsetFlag || id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[when.unsetFlag || id, id, ...((c.effects || {}).flags || [])]}}))});

  // ── 3. 늦게 배우는 글 ──
  for (const [id, when, title, text, way] of [
    ['adult-letters-winter', {minAge:16, maxAge:50, placeIncludes:'농촌', fromYear:1836}, '겨울밤 성인 강좌', '마을 교사가 겨울 저녁마다 어른들을 위한 강좌를 엽니다. 기조 장관이 권한 ‘성인 강좌’입니다. 등잔 기름값만 내면 됩니다.', '겨울밤 강좌'],
    ['adult-letters-city', {minAge:16, maxAge:50, notPlaceIncludes:'농촌', fromYear:1820}, '일요일 학교', '그리스도교 학교 수사들(혹은 노동자 협회)이 일요일 저녁 일하는 어른들에게 글을 가르칩니다. 무료입니다.', '일요일 학교'],
    ['adult-letters-spouse', {minAge:18, maxAge:55, livingRoles:['배우자']}, '배우자에게 배우는 글', '배우자는 글을 압니다. 저녁마다 한 줄씩 가르쳐 주겠다고 합니다. 부끄럽지만, 편지를 남에게 읽어 달라고 하는 것도 지쳤습니다.', '배우자에게서'],
    ['adult-letters-army', {minAge:18, maxAge:45, jobMatch:'^(군인|육군)'}, '연대 학교', '하사가 되려면 글을 알아야 합니다. 연대에 저녁 학교가 있고, 글을 아는 동료가 가르쳐 주겠다고 합니다.', '연대 학교']]) {
    // One offer per life (whichever comes first); learning stops the rest anyway.
    D(id, 'education', 18, {...when, literacy:['illiterate', 'learning'], unsetFlag:'adult-letters'}, title, text,
      [{label:'배워 본다', preview:'글을 깨침 / 더딤 / 포기', outcomes:[
         O('read', '글을 깨쳤습니다', 20, `${way} 몇 달 만에 기도서와 신문을 더듬더듬 읽게 되었습니다. 처음으로 자기 이름을 서명했습니다.`, {literacy:'basic', stats:{지식:4, 행복:4}, milestone:'어른이 되어 글을 깨침'}, [{when:{minAptitude:60}, amount:8}]),
         O('slow', '더디지만 배우는 중입니다', 30, '글자는 알아보지만 읽는 데 한참 걸립니다. 서명은 할 수 있게 되었지만, 책 한 쪽을 읽기는 아직 버겁습니다.', {literacy:'learning', stats:{지식:2}}),
         O('quit', '그만두었습니다', 42, '일이 고되어 저녁마다 졸았습니다. 몇 주 만에 그만두었습니다.', {stats:{행복:-1}}, [{when:{maxAptitude:40}, amount:15}])]},
       {label:'이 나이에 무슨 글이냐며 사양한다', result:'지금까지 글 없이 살았습니다.', effects:{}}], .15);
  }

  // ── 5. 대학 학부 고르기 ──
  D('faculty', 'education', 40, {minAge:17, maxAge:19, sexes:['남성'], eliteChild:true, noCareer:true}, '어느 학부로 갈까',
    '콜레주(리세)를 마쳤습니다. 아버지는 집안에 어울리는 길을 고르라고 합니다. 법학부를 나오면 변호사, 의학부를 나오면 의사가 됩니다. 신학교, 군사학교, 1794년 이후라면 이공대학도 있습니다. 집안 일을 바로 이어받을 수도 있습니다.',
    [{label:'법학부에 간다', result:'로마법과 관습법, 법원의 변론을 배웠습니다. 학위를 받고 변호사 명부에 이름을 올렸습니다.', effects:{career:'law', rank:1, education:'법학 학위', stats:{지식:5, 재산:-4}}},
     {label:'의학부(의학교)에 간다', result:'해부실과 병원 회진의 몇 해였습니다. 학위 논문을 내고 의사가 되었습니다.', effects:{career:'medicine', rank:2, education:'의학 학위', stats:{지식:6, 재산:-5}}},
     {label:'신학교에 들어간다', result:'생쉴피스 신학교의 검은 수단을 입었습니다.', effects:{career:'clergy', education:'신학교', stats:{지식:4}, experience:{religious:2}}},
     {label:'군사학교에 들어간다', result:'군사학교를 마치고 소위로 임관했습니다.', effects:{career:'officer', education:'군사학교', stats:{지식:3, 건강:2}}},
     {label:'이공대학 시험을 본다', when:{fromYear:1794}, requires:{minKnowledge:55}, preview:'합격 / 낙방', outcomes:[
       O('in', '합격했습니다', 60, '몽주가 세운 이공대학의 제복을 입었습니다. 졸업하고 토목 기사가 되었습니다.', {career:'engineering', rank:1, education:'이공대학', stats:{지식:7}}, [{when:{minAptitude:70}, amount:20}]),
       O('out', '떨어졌습니다', 40, '수학 시험관 앞에서 손이 떨렸습니다. 이듬해 법학부로 갔습니다.', {career:'law', rank:1, education:'법학 학위', stats:{지식:3}})]},
     {label:'문학부(고등사범)에 가서 교수가 된다', when:{fromYear:1810}, result:'고등사범학교를 거쳐 리세의 교단에 섰습니다.', effects:{career:'teaching', rank:3, education:'고등사범학교', stats:{지식:6}}},
     {label:'학교를 마치고 집안 일을 잇는다', result:'아버지의 상회(영지)를 배우며 장부를 넘겨받았습니다.', effects:{career:'trade', rank:1, stats:{재산:3}}}]);

  // ── 6. 혁명의 의회로 ──
  D('election-1792', 'politics', 45, {minAge:25, sexes:['남성'], literacy:['basic'], fromYear:1791, toYear:1792, jobMatch:'서기|변호사|행정관|교정원|팸플릿|기자|발행인|의사|외과|공증|상인|도매상|교사|교수', unsetFlag:'election-1792'}, '의원 후보',
    '선거인 집회가 열립니다. 클럽과 구역에서 이름이 알려진 당신을 의원 후보로 내자는 말이 나왔습니다. 도(데파르트망)마다 의원은 열 명 남짓, 후보는 수십 명입니다. 입법의회(1791)든 국민공회(1792)든, 뽑히면 파리의 의사당에서 프랑스의 운명을 정하게 됩니다.',
    [{label:'후보로 나선다', preview:'당선 / 낙선', outcomes:[
       // About 750 deputies for a nation of 28 million: even a known local man rarely won. Lawyers and officials, the
       // well-read and Parisians did better.
       O('elected', '당선되었습니다', 5, '선거인 집회에서 세 번의 투표 끝에 이름이 불렸습니다. 국민 대표 의원으로 파리에 갑니다.', {career:'law', rank:3, rep:10, stats:{행복:6}, milestone:'국민 대표 의원 당선'}, [{when:{jobMatch:'변호사|행정관|공증'}, amount:5}, {when:{minKnowledge:70}, amount:4}, {when:{places:['파리']}, amount:3}]),
       O('lost', '낙선했습니다', 95, '선거인 수백 명 가운데 당신 이름을 아는 사람은 몇 되지 않았습니다. 첫 투표에서 떨어졌습니다. 구역의 일로 돌아갔습니다.', {stats:{행복:-2}, rep:3})]},
     {label:'나서지 않는다', result:'지금 의원이 된다는 것이 무엇을 뜻하는지 알기에, 이름을 거두어 달라고 했습니다.', effects:{}}], .6);
  D('convention-seat', 'politics', 46, {jobMatch:'의원', fromYear:1792, toYear:1793, unsetFlag:'convention-seat'}, '의석은 어디에',
    '국민공회의 의사당은 계단식입니다. 왼쪽 높은 자리의 ‘산’에는 로베스피에르와 당통, 마라가, 오른쪽에는 브리소와 베르니오의 지롱드파가, 가운데 낮은 자리에는 ‘평원’이라 불리는 조용한 다수가 앉습니다. 어디에 앉느냐가 곧 당신의 운명입니다.',
    [{label:'산(산악파) 쪽에 앉는다', result:'자코뱅 클럽과 파리의 구역들이 당신의 편입니다.', effects:{path:{politics:'mountain'}}},
     {label:'지롱드파 쪽에 앉는다', result:'지방과 법과 질서의 편입니다. 파리의 민중은 당신을 미워합니다.', effects:{path:{politics:'gironde'}}},
     {label:'평원에 앉는다', result:'투표 때마다 바람의 방향을 봅니다. 살아남는 사람들의 자리입니다.', effects:{path:{politics:'plain'}}}]);
  D('danton-arrest', 'politics', 46, {jobMatch:'의원', politicsIn:['mountain', 'plain'], fromDate:[1794,3], toDate:[1794,4], unsetFlag:'danton-arrest'}, '당통의 체포',
    '1794년 3월 31일 밤, 당통과 카미유 데물랭이 체포되었습니다. 공안위원회는 ‘관용파’를 쓸어 내고 있습니다. 내일 의회에서 르장드르 의원이 그들을 변호하려 합니다. 일어서서 함께 목소리를 낼 것입니까?',
    [{label:'일어서서 당통을 변호한다', preview:'살아남음 / 단두대', outcomes:[
       O('survived', '살아남았습니다', 35, '생쥐스트의 차가운 눈길을 받으며 앉았습니다. 넉 달 뒤 테르미도르가 왔습니다.', {stats:{행복:-4}}),
       O('guillotined', '단두대에 올랐습니다', 65, '“당통과 한패”라는 고발장이 이틀 만에 나왔습니다. 혁명 재판소는 반나절 만에 판결했습니다.', {doom:'1794년 4월, 당통파와 한패로 몰려 혁명 재판소에서 사형 판결을 받고 혁명 광장의 단두대에서 처형되었습니다.'})]},
     {label:'침묵한다', result:'4월 5일, 당통이 단두대에서 외쳤다고 합니다. “내 머리를 민중에게 보여 주게. 그럴 만한 가치가 있으니.” 당신은 의석에서 고개를 숙이고 있었습니다.', effects:{stats:{행복:-5}}}]);
})();

{ const d = decisions.find(x => x.id === 'danton-arrest'); if (d) d.historic = true; }
