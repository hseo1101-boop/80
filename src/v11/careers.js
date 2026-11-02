// src/careers.js
// Careers with ranks, modelled on real career paths of the period. A career is entered through a
// "door" decision, pays a little every year, builds reputation (명성), and promotes when years in rank,
// reputation, knowledge or wealth allow. The Revolution speeds up some ladders (fast).
const CAREERS = {
  law:{label:'법률가·정치가', ranks:[
    {label:'법률 서기', pay:1, rep:1},
    {label:'변호사', years:3, need:25, pay:2, rep:1},
    {label:'지방 행정관', years:2, need:40, pay:2, rep:2, fromYear:1790},
    {label:'국민 대표 의원', years:2, need:60, pay:3, rep:2, fromYear:1789},
    {label:'도지사', years:4, need:85, pay:4, rep:1, fromYear:1800}]},
  press:{label:'언론인', ranks:[
    {label:'인쇄소 교정원', pay:1, rep:1},
    {label:'팸플릿 작가', years:2, need:18, pay:1, rep:2},
    {label:'신문 기자', years:2, need:32, pay:2, rep:2, fromYear:1789},
    {label:'신문 발행인', years:4, need:68, pay:3, rep:2}]},
  officer:{label:'장교', ranks:[
    {label:'육군 소위', pay:2, rep:1},
    {label:'육군 중위', years:2, need:20, pay:2, rep:1, fast:[1792, 1799]},
    {label:'육군 대위', years:3, need:35, pay:3, rep:1, fast:[1792, 1799], nobleBefore:1789},
    {label:'육군 대령', years:4, need:55, pay:4, rep:1, fast:[1792, 1799], nobleBefore:1789},
    {label:'육군 장군', years:4, need:72, pay:5, rep:1, fast:[1792, 1799], nobleBefore:1789}]},
  science:{label:'과학자', ranks:[
    {label:'수학 교사', pay:1, rep:1},
    {label:'아카데미 통신회원', years:3, need:28, knowledge:68, pay:2, rep:2},
    {label:'이공대학 교수', years:3, need:45, knowledge:75, pay:3, rep:2, fromYear:1795},
    {label:'학사원 회원', years:4, need:65, knowledge:80, pay:3, rep:2, fromYear:1796}]},
  art:{label:'화가', ranks:[
    {label:'화가의 제자', pay:0, rep:1},
    {label:'무명 화가', years:3, need:12, pay:1, rep:1},
    {label:'살롱 입선 화가', years:2, need:30, pay:2, rep:2},
    {label:'이름난 화가', years:4, need:68, pay:4, rep:2}]},
  trade:{label:'상인·은행가', ranks:[
    {label:'상점 점원', pay:1, rep:1},
    {label:'상인', years:3, need:18, wealth:30, pay:2, rep:1},
    {label:'도매상', years:4, need:35, wealth:50, pay:3, rep:1},
    {label:'은행가', years:5, need:65, wealth:78, pay:4, rep:1}]}
};
const WAR_YEARS = y => (y >= 1792 && y <= 1815) || (y >= 1756 && y <= 1763);
function careerRank(s) { const c = s.career && CAREERS[s.career.id]; return c ? c.ranks[s.career.rank] : null; }
function startCareer(s, id, rank = 0) {
  const c = CAREERS[id]; if (!c) return;
  s.career = {id, rank, since:s.year};
  s.flags.career = true;
  s.job = c.ranks[rank].label;
  s.familyEvents.career_top = s.job;
  milestone(s, `진로: ${c.label} · ${s.job}`);
}
function promote(s, text) {
  const c = CAREERS[s.career.id];
  s.career.rank++; s.career.since = s.year; s.job = c.ranks[s.career.rank].label;
  s.familyEvents.career_top = s.job;
  addLog(s, '🌿 좋은 일 · 승진', text || `${s.job}(으)로 올라섰습니다. ${c.label}의 길에서 한 걸음 더 나아갔습니다.`, 'good');
  milestone(s, `${s.job}`);
  changeStats(s, {행복:4});
}
function applyCareerEffects(s, e) {
  if (e.career) startCareer(s, e.career, e.rank || 0);
  if (e.rep) s.reputation = clamp(s.reputation + e.rep);
  if (e.figure) addFigure(s, e.figure);
  if (e.promote && s.career && CAREERS[s.career.id].ranks[s.career.rank + 1]) promote(s);
  if (e.careerEnd) s.career = null;
}
function careerYear(s) {
  if (s.dead || (typeof isAbroad === 'function' && isAbroad(s))) return;
  // A common soldier who can read may be commissioned in wartime; the Revolution opened this door.
  if (!s.career && s.job === '군인' && WAR_YEARS(s.year) && (literacyOf(s) !== 'illiterate' || s.reputation >= 40)
      && (s.year >= 1792 || s.class === '귀족') && random(s) < .12) {
    startCareer(s, 'officer');
    addLog(s, '🌿 좋은 일 · 임관', '전장에서 공을 세워 사병에서 소위로 임관했습니다. 혁명 이전이라면 평민에게는 닫혀 있던 길입니다.', 'good');
    s.reputation = clamp(s.reputation + 8);
    return;
  }
  const rank = careerRank(s);
  if (!rank) return;
  if (s.job !== rank.label) { s.career = null; return; }
  changeStats(s, {재산: rank.pay});
  const career = CAREERS[s.career.id];
  if (career.risk && WAR_YEARS(s.year) && random(s) < career.risk.p) { endLife(s, career.risk.text); return; }
  const war = s.career.id === 'officer' && WAR_YEARS(s.year) ? 2 : 0;
  s.reputation = clamp(s.reputation + rank.rep + war + (currentFocus(s)?.id === 'work' ? 1 : 0));
  const next = CAREERS[s.career.id].ranks[s.career.rank + 1];
  if (!next) return;
  const fast = next.fast && s.year >= next.fast[0] && s.year <= next.fast[1];
  if (s.year - s.career.since < (fast ? Math.ceil(next.years / 2) : next.years)) return;
  if ((next.fromYear && s.year < next.fromYear) || s.reputation < next.need) return;
  if ((next.knowledge && s.stats.지식 < next.knowledge) || (next.wealth && s.stats.재산 < next.wealth)) return;
  // Before 1789 some ranks (field officers, bishops) went to nobles; the Revolution removed that bar.
  if (next.nobleBefore && s.year < next.nobleBefore && s.class !== '귀족') return;
  // A royalist or noble officer is not promoted by the Republic.
  if (s.career.id === 'officer' && s.year >= 1792 && s.year <= 1799 && (s.class === '귀족' || s.paths.politics === 'royalist')) return;
  if (random(s) < (fast ? .6 : .3)) promote(s);
}

// ---- Historical figures as people you meet ----------------------------------
const FIGURES = {
  robespierre:{name:'막시밀리앵 로베스피에르', sex:'남성', born:[1758,5], job:'아라스 출신 변호사·의원', death:[1794,7], fate:'테르미도르 10일, 로베스피에르가 혁명 광장의 단두대에서 처형되었습니다. 당신이 알던 그 깐깐한 변호사였습니다.'},
  desmoulins:{name:'카미유 데물랭', sex:'남성', born:[1760,3], job:'변호사·언론인', death:[1794,4], fate:'카미유 데물랭이 당통과 함께 처형되었습니다. 며칠 뒤 아내 뤼실도 같은 단두대에 올랐습니다.'},
  marat:{name:'장폴 마라', sex:'남성', born:[1743,5], job:'「인민의 벗」 발행인', death:[1793,7], fate:'마라가 욕조에서 샤를로트 코르데의 칼에 찔려 숨졌습니다. 파리 전체가 상복을 입은 듯했습니다.'},
  roland:{name:'마농 롤랑', sex:'여성', born:[1754,3], job:'살롱 운영자', death:[1793,11], fate:'롤랑 부인이 단두대에 오르며 자유의 여신상을 향해 “오 자유여, 너의 이름으로 얼마나 많은 죄가 저질러지는가!”라고 외쳤다고 합니다.'},
  bonaparte:{name:'나폴레옹 보나파르트', sex:'남성', born:[1769,8], job:'포병 장교', death:[1821,7], fate:'세인트헬레나섬에서 나폴레옹이 세상을 떠났다는 소식이 전해졌습니다. 툴롱의 그 젊은 대위가 황제가 되었다가 섬에서 생을 마쳤습니다.'},
  hoche:{name:'라자르 오슈', sex:'남성', born:[1768,6], job:'장군', death:[1797,9], fate:'오슈 장군이 스물아홉 살에 병으로 세상을 떠났습니다. 사병 출신으로 장군까지 오른 사람이었습니다.'},
  laplace:{name:'피에르시몽 라플라스', sex:'남성', born:[1749,3], job:'수학자', death:[1827,3], fate:'라플라스가 세상을 떠났습니다. 「천체역학」과 확률론은 남았습니다.'},
  lavoisier:{name:'앙투안 라부아지에', sex:'남성', born:[1743,8], job:'화학자·징세청부인', death:[1794,5], fate:'라부아지에가 징세청부인이었다는 이유로 처형되었습니다. 라그랑주가 말했습니다. “그 머리를 베는 데는 한순간이면 충분했지만, 그런 머리가 다시 나오려면 백 년도 모자랄 것이다.”'},
  lamarck:{name:'장바티스트 라마르크', sex:'남성', born:[1744,8], job:'박물학자', death:[1829,12], fate:'눈이 멀고 가난해진 라마르크가 세상을 떠났습니다. 생물이 변한다는 그의 생각을 믿는 사람은 아직 많지 않았습니다.'},
  david:{name:'자크루이 다비드', sex:'남성', born:[1748,8], job:'화가', death:[1825,12], fate:'망명지 브뤼셀에서 다비드가 세상을 떠났습니다. 왕정복고 정부는 그의 시신이 프랑스로 돌아오는 것을 허락하지 않았습니다.'}
};
let FIGURE_BY_NAME = Object.fromEntries(Object.entries(FIGURES).map(([id, f]) => [f.name, id]));
function addFigure(s, id) {
  const f = FIGURES[id];
  if (!f || s.relations.some(r => r.name === f.name)) return;
  const dead = s.year*12 + s.month >= f.death[0]*12 + f.death[1];
  s.relations.push({name:f.name, role:'인물', sex:f.sex, birthYear:f.born[0], birthMonth:f.born[1], alive:!dead, closeness:50, job:f.job});
  milestone(s, `${f.name}과(와) 알게 됨`);
}
function figureFates(s) {
  for (const r of s.relations) {
    if (r.role !== '인물' || !r.alive) continue;
    const f = FIGURES[FIGURE_BY_NAME[r.name]];
    if (!f || s.year*12 + s.month < f.death[0]*12 + f.death[1]) continue;
    r.alive = false; r.deathYear = s.year;
    addLog(s, '📜 아는 사람의 운명', f.fate, r.closeness >= 60 ? 'bad' : 'history');
    if (r.closeness >= 60) changeStats(s, {행복:-6});
  }
}

DECISION_DOMAINS.push({id:'career', label:'진로', target:0});
// Generic job decisions would silently overwrite a career; they only apply to people without one.
for (const d of decisions) if (['apprentice','trade'].includes(d.id)) d.when.noCareer = true;
// ---- Doors into careers, and dated career events ------------------------------
(() => {
  // How often a door actually opens when its conditions are met, so careers stay plausibly rare.
  const CHANCE = {'door-law':.5, 'door-press':.12, 'door-art':.25, 'door-trade':.35, 'door-saint-cyr':.5, 'door-science':.9};
  const D = (id, priority, when, title, text, choices, extra = {}) => decisions.push({id, domain:'career', priority, title, text, ...extra,
    ...(CHANCE[id] ? {chance:CHANCE[id]} : {}),
    when:{...when, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{...(c.effects || {}), flags:[id]}}))});
  const H = (id, date, when, title, text, choices) => D(id, 30, {...when, fromDate:date, toDate:date}, title, text, choices, {historic:true, domain:'history'});
  const O = (id, title, weight, result, effects = {}, modifiers) => ({id, title, weight, result, effects, ...(modifiers ? {modifiers} : {})});
  const no = (label, result) => ({label, result, effects:{stats:{}}});
  const LAW = '서기|변호사|행정관|의원|도지사', PRESS = '교정원|팸플릿|기자|발행인', ARMY = '군', SCI = '수학 교사|아카데미|교수|학사원', ART = '화가', TRADE = '점원|상인|도매상|은행가';

  // Doors
  D('door-law', 7, {minAge:16, maxAge:26, sexes:['남성'], literacy:['basic'], minAptitude:40, noCareer:true},
    '법학을 공부할까?',
    '법학부에서 몇 해 공부하고 학위를 사면 변호사가 될 수 있습니다. 돈이 들고 인맥도 필요하지만, 법률가는 이 시대 출세의 지름길입니다.',
    [{label:'법학부에 등록한다', preview:'법률 서기로 시작 / 학비에 막힘', requires:{minWealth:25}, outcomes:[
        O('in', '법률 사무소에 들어갔습니다', 75, '랭스에서 학위를 받고 공증인 사무소의 서기로 일을 시작했습니다. 첫 소송 서류를 베껴 쓰며 밤을 새웁니다.', {career:'law', rep:5, education:'법학 학위', stats:{재산:-6, 지식:4}}, [{when:{minAptitude:70}, amount:15}]),
        O('out', '학비를 감당하지 못했습니다', 25, '두 해 만에 학업을 그만두었습니다. 그래도 법전 읽는 법은 배웠습니다.', {stats:{재산:-6, 지식:3}})]},
     no('집안 일을 잇는다', '법률가의 꿈은 접었습니다.')]);

  D('door-press', 6, {minAge:18, maxAge:35, literacy:['basic'], minKnowledge:58, notPlaceIncludes:'농촌', noCareer:true, fromYear:1780},
    '글로 먹고살 수 있을까?',
    '인쇄소에서 교정 볼 사람을 구합니다. 팸플릿과 신문이 쏟아지는 도시에서는 글 쓰는 사람에게 길이 열리고 있습니다.',
    [{label:'인쇄소 교정원으로 들어간다', result:'잉크 냄새 나는 인쇄소에서 활자를 고르고 남의 글을 고칩니다. 언젠가 내 글을 찍을 날을 기다립니다.', effects:{career:'press', rep:3, stats:{지식:2}}},
     no('지금 일을 계속한다', '안정된 생업을 택했습니다.')]);

  for (const [id, from, to, extra, figure] of [['door-officer', 1740, 1783, '', null], ['door-officer-1784', 1784, 1788, ' 포병 학교 시험에서는 아카데미의 젊은 수학자 라플라스가 시험관으로 나왔습니다.', 'laplace']])
    D(id, 9, {minAge:15, maxAge:19, sexes:['남성'], classes:['귀족'], fromYear:from, toYear:to, noCareer:true},
      '임관',
      '가문의 아들로서 국왕의 군대에 소위로 들어갈 수 있습니다. 1781년 법령 이후 장교가 되려면 귀족 가문 4대를 증명해야 합니다.',
      [{label:'연대에 소위로 들어간다', result:'흰 군복을 입고 연대에 배치되었습니다.' + extra, effects:{career:'officer', rep:5, ...(figure ? {figure} : {})}},
       no('가문의 영지를 돌본다', '군인의 길은 다른 형제에게 넘겼습니다.')]);

  D('door-saint-cyr', 9, {minAge:17, maxAge:21, sexes:['남성'], fromYear:1803, minKnowledge:55, literacy:['basic'], noCareer:true},
    '생시르 사관학교',
    '황제가 세운 생시르 특별 군사학교가 입학생을 받습니다. 학비를 내야 하지만, 졸업하면 바로 소위로 임관합니다.',
    [{label:'입학시험을 본다', preview:'합격 / 낙방', requires:{minWealth:35}, outcomes:[
        O('pass', '합격했습니다', 60, '두 해 동안 행군과 포술, 수학을 배우고 소위로 임관했습니다.', {career:'officer', rep:6, education:'생시르 사관학교', stats:{재산:-8}}, [{when:{minAptitude:65}, amount:20}]),
        O('fail', '낙방했습니다', 40, '수학 시험에서 떨어졌습니다.', {stats:{행복:-3}})]},
     no('다른 길을 간다', '군복은 입지 않기로 했습니다.')]);

  D('door-science', 9, {minAge:15, maxAge:25, literacy:['basic'], minAptitude:70, minKnowledge:62, noCareer:true, sexes:['남성']},
    '수학의 재능',
    '선생님이 당신의 수학 실력이 범상치 않다며, 학자의 길을 권합니다. 1794년 이후라면 새로 생긴 이공대학 입학시험을 볼 수 있습니다.',
    [{label:'학자의 길을 간다', preview:'수학 교사로 시작 / 기회 없음', outcomes:[
        O('in', '수학 교사가 되었습니다', 70, '사관학교 예비반에서 수학을 가르치며 아카데미에 보낼 논문을 쓰기 시작했습니다.', {career:'science', rep:5, stats:{지식:4}}, [{when:{minAptitude:85}, amount:20}, {when:{fromYear:1794}, amount:10}]),
        O('none', '후원자를 찾지 못했습니다', 30, '자리를 얻지 못했습니다. 밤마다 혼자 수학책을 읽습니다.', {stats:{지식:3}, experience:{selfStudy:2}})]},
     no('생업에 전념한다', '재능은 가슴에 묻었습니다.')]);

  D('door-art', 6, {minAge:13, maxAge:20, minAptitude:55, notPlaceIncludes:'농촌', noCareer:true},
    '화가의 작업실',
    '이름난 화가의 작업실에서 제자를 받는다고 합니다. 몇 해 동안 물감을 개고 석고상을 그려야 하지만, 언젠가 살롱에 그림을 걸 수 있을지도 모릅니다.',
    [{label:'제자로 들어간다', result:'작업실 구석에서 석고상을 그리며 하루를 보냅니다. 스승은 좀처럼 칭찬하지 않습니다.', requires:{minWealth:20}, effects:{career:'art', rep:3, stats:{행복:3, 재산:-3}}},
     no('현실적인 일을 찾는다', '스케치북은 서랍에 넣었습니다.')]);

  D('door-trade', 6, {minAge:14, maxAge:24, notPlaceIncludes:'농촌', noCareer:true},
    '상점 점원 자리',
    '도매상 한 곳에서 계산이 빠른 점원을 구합니다. 장부와 편지를 쓸 줄 알면 더 좋다고 합니다.',
    [{label:'점원으로 들어간다', result:'계산대 뒤에서 손님을 맞고 장부를 씁니다. 언젠가 내 가게를 열 날을 꿈꿉니다.', requires:{literacy:true}, effects:{career:'trade', rep:2, experience:{commerce:2}}},
     no('지금 일을 계속한다', '익숙한 일을 택했습니다.')]);

  // Law and politics
  H('jacobins', [1790,2], {minAge:20, places:['파리'], jobMatch:LAW + '|' + PRESS},
    '자코뱅 클럽',
    '생토노레 거리의 옛 자코뱅 수도원에서 ‘헌법의 벗 협회’가 모입니다. 아라스에서 올라온 깐깐한 변호사가 연단에 서 있습니다.',
    [{label:'회원으로 가입한다', result:'로베스피에르라는 그 변호사와 몇 마디를 나눴습니다. 말은 서툴지만 원칙에는 한 치의 양보도 없는 사람입니다.', effects:{figure:'robespierre', rep:5, path:{politics:'engaged'}}},
     no('방청석에서 지켜본다', '연설을 들으며 메모를 했습니다.')]);

  H('roland-salon', [1791,3], {minAge:20, places:['파리'], jobMatch:LAW + '|' + PRESS + '|' + TRADE + '|살롱|작가'},
    '롤랑 부인의 살롱',
    '게네고 거리의 롤랑 부부 집에 지롱드의 의원과 언론인들이 모입니다. 집주인 마농 롤랑은 누구보다 날카로운 논객입니다.',
    [{label:'살롱에 드나든다', result:'롤랑 부인은 당신의 이름을 기억해 주었습니다. 이곳에서 지롱드파의 계획이 오갑니다.', effects:{figure:'roland', rep:4, path:{politics:'gironde-friend'}}},
     no('정중히 사양한다', '파벌에 휘말리고 싶지 않았습니다.')]);

  H('king-trial', [1793,1], {jobMatch:'의원'},
    '국왕의 운명에 투표하다',
    '국민공회가 루이 카페의 형량을 두고 한 명씩 연단에 올라 공개 투표를 합니다. 당신의 차례가 다가옵니다.',
    [{label:'“사형.”', result:'산악파 의원들이 고개를 끄덕였습니다. 당신은 산악파 쪽에 앉게 되었습니다.', effects:{rep:6, path:{politics:'mountain'}}},
     {label:'“국민 투표에 부치자.”', result:'지롱드파와 함께 국민에게 묻자고 했습니다. 산악파 쪽에서 야유가 쏟아졌습니다.', effects:{rep:3, path:{politics:'gironde'}}},
     {label:'“전쟁이 끝날 때까지 구금.”', result:'중간 의석 ‘평원파’의 조용한 다수와 같은 표를 던졌습니다.', effects:{rep:1, path:{politics:'plain'}}}]);

  H('gironde-fall', [1793,6], {jobMatch:'의원', pathIs:{politics:'gironde'}},
    '국민공회 포위',
    '무장한 구역민들이 국민공회를 둘러싸고 지롱드파 의원들의 체포를 요구합니다. 동료들이 하나둘 끌려가거나 달아납니다.',
    [{label:'지방으로 달아나 봉기를 호소한다', preview:'숨어 지냄 / 붙잡힘', outcomes:[
        O('hid', '숨어 지냈습니다', 55, '노르망디와 보르도를 떠돌며 숨어 지냈습니다. 테르미도르 뒤에야 의석에 돌아왔습니다.', {stats:{건강:-6, 행복:-8, 재산:-8}, rep:-5}),
        O('caught', '붙잡혀 처형되었습니다', 45, '10월, 동료 지롱드파 의원들과 함께 단두대에 올랐습니다.', {doom:'1793년 10월, 지롱드파 의원으로 처형되었습니다.'})]},
     {label:'남아서 침묵한다', preview:'명단에서 빠짐 / 투옥', outcomes:[
        O('spared', '명단에서 빠졌습니다', 50, '73명의 항의 서명에 이름을 넣지 않았습니다. 감옥은 피했지만 의석에서 고개를 들 수 없었습니다.', {stats:{행복:-6}, rep:-6}),
        O('jailed', '투옥되었습니다', 50, '열 달을 감옥에서 보내고 테르미도르 뒤 풀려났습니다.', {stats:{건강:-10, 행복:-10}})]}]);

  H('thermidor-deputy', [1794,7], {jobMatch:'의원', pathIs:{politics:'mountain'}},
    '테르미도르 9일, 국민공회',
    '생쥐스트의 연설이 중단되고 고함이 터집니다. “폭군을 타도하라!” 로베스피에르를 체포하자는 발의가 올라옵니다.',
    [{label:'체포에 찬성한다', result:'로베스피에르와 그 동지들이 끌려 나갔습니다. 공포정치가 끝났습니다.', effects:{rep:4, path:{politics:'thermidorian'}}},
     {label:'로베스피에르를 변호한다', preview:'체포 / 겨우 모면', outcomes:[
        O('fell', '함께 쓰러졌습니다', 70, '그날 밤 시청에서 함께 붙잡혔고, 이튿날 단두대에 올랐습니다.', {doom:'1794년 테르미도르, 로베스피에르와 함께 처형되었습니다.'}),
        O('escaped', '간신히 화를 피했습니다', 30, '마지막 순간 입을 다물었습니다. 몇 해 동안 의심의 눈길을 받았습니다.', {rep:-10, stats:{행복:-8}})]}]);

  // Press
  H('desmoulins-paper', [1789,11], {places:['파리'], jobMatch:PRESS},
    '데물랭의 신문',
    '팔레루아얄에서 군중을 일으켜 세웠던 젊은 변호사 카미유 데물랭이 신문 「프랑스와 브라방의 혁명」을 창간하며 글 쓸 사람을 찾습니다.',
    [{label:'글을 보낸다', result:'말을 더듬는 데물랭이지만 펜은 칼처럼 날카롭습니다. 당신의 글이 그의 신문에 실렸습니다.', effects:{figure:'desmoulins', rep:8, promote:true}},
     no('남의 신문에는 쓰지 않는다', '혼자 힘으로 가 보기로 했습니다.')]);

  H('marat', [1790,9], {places:['파리'], jobMatch:PRESS},
    '「인민의 벗」',
    '코르들리에 구역 지하 인쇄소에서 장폴 마라가 「인민의 벗」을 찍습니다. 체포를 피해 숨어 다니면서도 매일 신문을 냅니다.',
    [{label:'인쇄를 돕는다', result:'피부병으로 식초 수건을 두른 마라가 밤새 원고를 고쳤습니다. 그의 글은 분노로 가득합니다.', effects:{figure:'marat', rep:5, experience:{inequality:2}}},
     no('거리를 둔다', '마라의 과격함이 두려웠습니다.')]);

  H('vieux-cordelier', [1793,12], {jobMatch:PRESS, knows:['desmoulins']},
    '「늙은 코르들리에」',
    '데물랭이 새 신문에서 공포정치를 멈추고 ‘관용 위원회’를 만들자고 씁니다. 함께 쓰자고 합니다.',
    [{label:'함께 관용을 외친다', preview:'역사에 남음 / 처형', outcomes:[
        O('spared', '살아남았습니다', 60, '데물랭이 체포된 뒤 몸을 숨겼습니다. 그의 글은 사람들 가슴에 남았습니다.', {rep:10, stats:{행복:-6}}),
        O('executed', '데물랭과 함께 처형되었습니다', 40, '4월, 같은 수레를 타고 혁명 광장으로 갔습니다.', {doom:'1794년 4월, 관용파로 몰려 데물랭과 함께 처형되었습니다.'})]},
     no('이번에는 빠진다', '친구를 말리지 못했습니다. 오래 후회했습니다.')]);

  H('press-1800', [1800,1], {jobMatch:PRESS},
    '신문 폐간령',
    '제1통령의 명령으로 파리 정치 신문 73개 가운데 60개가 문을 닫았습니다. 남은 신문은 경찰의 검열을 받습니다.',
    [{label:'정부 기관지로 옮긴다', result:'「모니퇴르」에서 공보를 다듬는 일을 합니다. 월급은 안정적이지만 쓰고 싶은 글은 쓸 수 없습니다.', effects:{rep:-4, stats:{재산:4}}},
     {label:'문학 잡지로 돌아선다', result:'정치 대신 연극 평을 씁니다.', effects:{stats:{행복:-2}}}]);

  // Officers
  H('toulon', [1793,12], {jobMatch:ARMY},
    '툴롱 포위전',
    '영국 함대가 지키는 툴롱 항구를 되찾기 위한 포위전. 코르시카 출신의 젊은 포병 대위가 대담한 포대 배치를 밀어붙입니다.',
    [{label:'그의 포대에서 싸운다', preview:'승리와 진급 / 부상', outcomes:[
        O('won', '툴롱을 되찾았습니다', 80, '보나파르트 대위는 장군으로 진급했고, 당신의 이름도 보고서에 올랐습니다.', {figure:'bonaparte', rep:12, promote:true, milestone:'툴롱 포위전 참전'}),
        O('hurt', '포탄에 다쳤습니다', 20, '보나파르트도 같은 날 허벅지에 총검을 맞았습니다.', {figure:'bonaparte', rep:6, stats:{건강:-12}})]},
     no('다른 진지를 지킨다', '먼발치에서 포성을 들었습니다.')]);

  H('hoche-ireland', [1796,12], {jobMatch:ARMY},
    '아일랜드 원정',
    '사병 출신 젊은 장군 오슈가 아일랜드 상륙 작전을 이끕니다. 겨울 바다는 거칠고, 함대는 이미 흩어지기 시작했습니다.',
    [{label:'원정에 오른다', preview:'회항 / 난파', outcomes:[
        O('back', '상륙하지 못하고 돌아왔습니다', 80, '밴트리만 앞에서 폭풍에 막혀 회항했습니다. 오슈 장군의 배는 끝내 만에 닿지도 못했습니다.', {figure:'hoche', rep:4, stats:{건강:-4}}),
        O('wreck', '배가 난파했습니다', 20, '차가운 바다에서 겨우 구조되었습니다.', {figure:'hoche', stats:{건강:-14}})]},
     no('라인군에 남는다', '육지 전선에 남았습니다.')]);

  H('demi-solde', [1815,9], {jobMatch:'육군'},
    '반급 장교',
    '왕정이 돌아오자 나폴레옹 군대의 장교 수천 명이 봉급의 절반만 받고 집으로 보내졌습니다. 카페에는 옛 제국 장교들이 모여 수군거립니다.',
    [{label:'반급을 받으며 버틴다', result:'낡은 군복을 입고 카페에서 옛 전우들과 시간을 보냅니다.', effects:{stats:{재산:-6, 행복:-6}, careerEnd:true, job:'반급 장교'}},
     {label:'국왕의 군대에 충성을 맹세한다', result:'흰 휘장을 달고 군에 남았습니다. 옛 전우들은 등을 돌렸습니다.', effects:{rep:-6, closeness:-4}}]);

  // Science
  H('meridian', [1792,6], {jobMatch:SCI},
    '자오선을 재는 원정',
    '새 길이 단위 ‘미터’를 정하려고 들랑브르와 메솅이 됭케르크에서 바르셀로나까지 자오선을 잽니다. 조수를 구합니다.',
    [{label:'측량대에 합류한다', result:'성당 종탑에 올라 각도를 재고, 혁명기 관청에 첩자로 의심받으며 몇 해를 길에서 보냈습니다.', effects:{rep:8, stats:{건강:-3, 지식:4}, milestone:'미터법 자오선 측량 참가'}},
     no('파리에 남아 계산을 맡는다', '측량대가 보내오는 숫자를 정리했습니다.')]);

  H('lavoisier-lab', [1788,4], {jobMatch:SCI, places:['파리']},
    '아르스날 실험실',
    '아르스날에 있는 라부아지에의 실험실에서 계산을 도울 사람을 찾습니다. 마리안 라부아지에 부인이 실험을 기록하고 그림을 그립니다.',
    [{label:'조수로 들어간다', result:'정밀한 저울로 기체의 무게를 재는 법을 배웠습니다. ‘아무것도 사라지지 않는다’는 말을 몸으로 이해했습니다.', effects:{figure:'lavoisier', rep:6, stats:{지식:4}}},
     no('사양한다', '자기 연구를 이어 갑니다.')]);

  H('academy-closed', [1793,8], {jobMatch:SCI},
    '아카데미 폐지',
    '국민공회가 왕립 아카데미를 모두 폐지했습니다. 학자들은 이제 위원회와 새 학교를 통해 일해야 합니다.',
    [{label:'도량형 위원회에서 일한다', result:'아카데미는 사라졌지만 미터법 작업은 계속됩니다.', effects:{rep:3}},
     {label:'잠시 시골로 물러난다', result:'공포정치가 끝날 때까지 시골에서 조용히 연구했습니다.', effects:{stats:{행복:-2}, rep:-3}}]);

  H('lamarck-museum', [1793,6], {jobMatch:SCI, places:['파리']},
    '자연사 박물관',
    '왕의 정원이 국립 자연사 박물관으로 바뀌었습니다. 곤충과 벌레를 맡은 라마르크가 표본 정리를 도울 사람을 찾습니다.',
    [{label:'표본실에서 일한다', result:'라마르크는 생물이 오랜 시간에 걸쳐 변한다고 말합니다. 대담한 생각입니다.', effects:{figure:'lamarck', rep:4, stats:{지식:3}}},
     no('수학에 집중한다', '자기 분야를 지키기로 했습니다.')]);

  // Art
  H('horatii', [1785,8], {jobMatch:ART},
    '「호라티우스 형제의 맹세」',
    '로마에서 돌아온 다비드가 살롱에 내건 그림 앞에 사람들이 몰려듭니다. 그의 작업실에서 새 제자를 받는다고 합니다.',
    [{label:'다비드의 작업실에 들어간다', result:'“고대를 보라.” 다비드는 엄격했지만 당신의 데생을 한참 들여다보았습니다.', effects:{figure:'david', rep:6, stats:{지식:2}}},
     no('지금 스승 곁에 남는다', '의리를 지켰습니다.')]);

  H('salon-1791', [1791,9], {jobMatch:ART},
    '모두에게 열린 살롱',
    '처음으로 아카데미 회원이 아닌 화가도 살롱에 그림을 낼 수 있게 되었습니다.',
    [{label:'그림을 출품한다', preview:'입선 / 혹평', outcomes:[
        O('hung', '그림이 걸렸습니다', 60, '루브르 살롱 높은 벽에 당신의 그림이 걸렸습니다. 비평가 한 명이 짧게 언급했습니다.', {rep:10, promote:true}, [{when:{minAptitude:70}, amount:20}]),
        O('panned', '혹평을 받았습니다', 40, '“색이 탁하다.” 신문 한 줄이 마음에 박혔습니다.', {rep:2, stats:{행복:-4}})]},
     no('아직 때가 아니다', '다음 살롱을 기다립니다.')]);

  H('sacre', [1806,3], {jobMatch:ART, knows:['david']},
    '「나폴레옹의 대관식」',
    '다비드가 가로 10미터에 가까운 대관식 그림을 그리고 있습니다. 배경 인물을 채울 손이 필요하다고 합니다.',
    [{label:'작업에 참여한다', result:'군중 속 몇 사람의 얼굴을 당신이 그렸습니다. 아무도 모르겠지만 당신은 압니다.', effects:{rep:8, stats:{재산:4, 행복:4}, milestone:'다비드의 대관식 그림 작업'}},
     no('내 그림을 그린다', '스승의 그늘을 벗어나기로 했습니다.')]);

  // Trade
  H('army-supplier', [1794,3], {jobMatch:TRADE},
    '군납업자',
    '열네 개 군대에 보낼 군화와 빵, 말먹이를 구할 업자를 찾습니다. 큰돈이 오가지만 부패 혐의로 단두대에 오른 업자도 있습니다.',
    [{label:'군납 계약을 따낸다', preview:'큰돈 / 고발', outcomes:[
        O('rich', '큰돈을 벌었습니다', 65, '마차 수백 대 분량의 군화를 납품했습니다.', {stats:{재산:12}, rep:4}),
        O('accused', '부정 납품으로 고발되었습니다', 35, '벌금으로 번 돈을 거의 토해 냈습니다.', {stats:{재산:-6, 행복:-6}, rep:-8})]},
     no('위험한 돈은 사양한다', '평소 거래를 이어 갑니다.')]);

  H('banque-de-france', [1800,2], {jobMatch:TRADE, minWealth:50},
    '프랑스 은행 설립',
    '제1통령이 지원하는 프랑스 은행이 주주를 모집합니다.',
    [{label:'주식을 산다', result:'주주 명부에 이름을 올렸습니다. 해마다 배당이 들어옵니다.', effects:{stats:{재산:6}, rep:4, milestone:'프랑스 은행 주주'}},
     no('땅이 더 안전하다', '은행은 믿지 않기로 했습니다.')]);
})();
