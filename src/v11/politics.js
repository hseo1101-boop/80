// src/politics.js — 정치 성향과 역사의 기분, 그리고 유언의 갈래
// 1. From eighteen, about every ten years the times ask where you stand: each regime offers the camps
//    of its day (Ancien Régime reformers, Feuillants and Jacobins, Bonapartists, Ultras and liberals,
//    Orléanists and Legitimists, the démoc-soc of 1848, the republicans of the 1870s). The answer is
//    kept in paths.politics, which older scenes already read.
// 2. Great news then lands differently: the King's execution crushes a royalist and heartens a
//    Montagnard; Waterloo is mourning for a Bonapartist and relief for a royalist.
// 3. A will is written for the family one actually has: several children, an only child, or none.
const POLITICS_LABEL = {royalist:'왕당파', refractory:'왕당파(선서 거부 가톨릭)', constitutional:'입헌·자유주의파', gironde:'지롱드파', plain:'온건 공화파',
  thermidorian:'테르미도르파', engaged:'공화파', mountain:'산악파(자코뱅)', bonapartist:'보나파르트파', socialist:'사회주의자', private:'정치에 거리를 둠'};
// Camps for mood: royalist, liberal (constitutional monarchists, Orléanists, moderates), republican, bonapartist, socialist.
function politicalCamp(s) {
  const p = s.paths?.politics;
  if (p === 'royalist' || p === 'refractory') return 'royalist';
  if (p === 'constitutional' || p === 'thermidorian') return 'liberal';
  if (p === 'engaged' || p === 'mountain' || p === 'gironde' || p === 'plain') return 'republican';
  if (p === 'bonapartist') return 'bonapartist';
  if (p === 'socialist') return 'socialist';
  return null;
}
const CAMP_NAME = {royalist:'왕당파', liberal:'입헌·자유주의파', republican:'공화파', bonapartist:'보나파르트파', socialist:'사회주의자'};
// Happiness change by camp for historical news. Socialists count as republicans unless listed.
const POLITICAL_MOOD = {
  'bastille':{royalist:-4, liberal:3, republican:5, socialist:5},
  'august-decrees':{royalist:-4, liberal:3, republican:4},
  'varennes':{royalist:-3, liberal:-3, republican:3},
  'republic':{royalist:-7, liberal:-3, republican:7},
  'louis-execution':{royalist:-12, liberal:-6, republican:3, bonapartist:-2},
  'thermidor':{royalist:4, liberal:5, republican:-2},
  'brumaire':{royalist:-1, liberal:1, republican:-4, bonapartist:7},
  'coronation':{royalist:-5, liberal:-1, republican:-4, bonapartist:7},
  'first-restoration':{royalist:9, liberal:2, republican:-4, bonapartist:-7},
  'hundred-days':{royalist:-7, liberal:-2, republican:1, bonapartist:9},
  'waterloo':{royalist:5, liberal:1, republican:-2, bonapartist:-9},
  'second-restoration':{royalist:6, republican:-3, bonapartist:-5},
  'berry':{royalist:-6, liberal:-1},
  'napoleon-death':{royalist:1, bonapartist:-7},
  'reims':{royalist:5, liberal:-2, republican:-3},
  'july-revolution':{royalist:-8, liberal:7, republican:5, bonapartist:2},
  'louis-philippe':{royalist:-4, liberal:5, republican:-2},
  'june-1832':{liberal:1, republican:-4},
  'ashes':{liberal:1, bonapartist:7},
  'february-1848':{royalist:-1, liberal:-6, republican:8, socialist:9, bonapartist:2},
  'june-days':{royalist:2, liberal:3, republican:-4, socialist:-10},
  'president-1848':{royalist:1, republican:-3, socialist:-4, bonapartist:8},
  'coup-1851':{royalist:-2, liberal:-5, republican:-8, socialist:-8, bonapartist:7},
  'empire-1852':{royalist:-3, liberal:-3, republican:-6, socialist:-6, bonapartist:8},
  'sedan-1870':{royalist:1, liberal:1, republican:5, socialist:4, bonapartist:-10},
  'commune-1871':{royalist:-6, liberal:-6, republican:1, socialist:7, bonapartist:-3},
  'bloody-week':{royalist:2, liberal:2, republican:-5, socialist:-12},
  'mac-mahon':{royalist:5, liberal:1, republican:-4},
  'constitution-1875':{royalist:-5, republican:6, socialist:2},
  'quatorze-1880':{royalist:-4, republican:6, socialist:4},
  'ferry-1882':{royalist:-4, republican:4},
  'jaccuse-1898':{royalist:-2, republican:3, socialist:3},
  'separation-1905':{royalist:-5, republican:4, socialist:4}
};
const kidCount = s => s.relations.filter(r => r.role === '자녀' && r.alive).length;
function applyPoliticsEffects(s, e) { if (e.polAsked) s.familyEvents.polAsked = s.year; }
function politicalMood(s, event) {
  const camp = politicalCamp(s), table = POLITICAL_MOOD[event.id];
  if (!camp || !table) return;
  const v = table[camp] ?? (camp === 'socialist' ? table.republican : undefined);
  if (!v) return;
  changeStats(s, {행복:v});
  const name = POLITICS_LABEL[s.paths.politics] || CAMP_NAME[camp];
  const text = v >= 6 ? `${name}인 당신에게는 오래 기다려 온 소식입니다. 거리로 뛰어나가고 싶은 마음입니다.`
    : v > 0 ? `${name}인 당신에게는 반가운 소식입니다.`
    : v <= -8 ? `${name}인 당신에게는 견디기 힘든 소식입니다. 며칠 동안 잠을 이루지 못했습니다.`
    : `${name}인 당신에게는 씁쓸한 소식입니다.`;
  addLog(s, '정치적 감정', text, v > 0 ? 'good' : 'bad', `mood-${event.id}`);
}

(() => {
  // ───── 시대마다 묻는 정치 성향 ─────
  const P = (id, from, to, title, text, choices) => decisions.push({id, domain:'politics', priority:21, title, text, chance:.55,
    when:{minAge:18, fromYear:from, toYear:to, politicsDue:true, unsetFlag:id},
    choices:choices.map(([label, politics, result, stats = {}]) => ({label, result, effects:{stats, path:{politics}, polAsked:true, flags:[id]}}))});
  const APART = ['정치에는 거리를 둔다', 'private', '누가 위에 앉든 빵값과 세금이 문제입니다. 정치 이야기가 나오면 자리를 피했습니다.'];
  P('pol-ancien', 1760, 1788, '계몽의 시대',
    '카페와 살롱에서 볼테르와 루소의 이야기가 오갑니다. 왕의 권위는 하늘이 내린 것이라는 사람도, 세금과 특권을 고쳐야 한다는 사람도 있습니다. 당신은 어느 쪽에 마음이 기웁니까?',
    [['왕과 교회의 질서를 믿는다', 'royalist', '전하께서 백성을 굽어살피신다고 믿습니다. 개혁가들의 떠들썩함이 못마땅합니다.'],
     ['세금과 특권을 고쳐야 한다고 생각한다', 'constitutional', '영국처럼 의회가 왕을 견제해야 한다는 팸플릿을 돌려 읽었습니다.'],
     ['신분제 자체가 잘못되었다고 생각한다', 'engaged', '루소의 『사회 계약론』 한 구절을 외우고 다닙니다. “인간은 자유롭게 태어났으나 어디서나 쇠사슬에 묶여 있다.”'], APART]);
  P('pol-revolution', 1789, 1799, '혁명 속에서 어디에 서는가',
    '구역 회의와 클럽, 신문과 팸플릿이 저마다 편을 가르라고 합니다. 입헌 군주정을 지키자는 사람, 공화국을 세우자는 사람, 옛 왕정으로 돌아가자는 사람.',
    [['왕과 옛 질서를 지지한다', 'royalist', '삼색 휘장 대신 주머니 속에 흰 휘장을 넣고 다닙니다. 입 밖에 내기는 위험한 생각입니다.'],
     ['입헌 군주정에서 멈춰야 한다 (푀양파)', 'constitutional', '헌법과 왕이 함께 가야 한다고 믿습니다. 라파예트의 국민방위대가 믿음직합니다.'],
     ['온건한 공화국 (지롱드파)', 'gironde', '브리소와 롤랑 부인의 신문을 읽습니다. 공화국은 좋지만 파리 민중의 폭력은 두렵습니다.'],
     ['자코뱅의 공화국 (산악파)', 'mountain', '“조국이 위험에 처했다!” 자코뱅 클럽의 연설에 가슴이 뜁니다.'], APART]);
  // The Consulate (1800–1804) is its own question; the Emperor's comes after the coronation and Austerlitz.
  P('pol-consulate', 1800, 1804, '제1통령의 시대',
    '브뤼메르의 쿠데타로 보나파르트 장군이 제1통령이 되었습니다. 혁명을 끝내고 질서를 세웠다는 사람도, 공화국을 군인에게 넘겼다는 사람도, 그가 왕을 다시 모셔 올 거라는 사람도 있습니다.',
    [['제1통령을 지지한다', 'bonapartist', '이탈리아에서 승전보가 들려오고 거리의 소란이 잦아들었습니다. 십 년 만에 처음으로 나라가 굴러간다고 느낍니다.'],
     ['정통 왕가의 귀환을 바란다', 'royalist', '보나파르트가 몽크 장군처럼 왕을 다시 모셔 오리라 기대했지만, 그럴 사람이 아니라는 것이 점점 분명해집니다.'],
     ['공화국을 지키려 한다', 'engaged', '헌법을 몇 번이나 고친 끝에 결국 장군 한 사람이 권력을 쥐었을 뿐이라고 생각합니다.'], APART]);
  P('pol-empire', 1806, 1814, '황제의 시대',
    '제1통령이 황제가 되었습니다. 질서와 영광을 가져왔다는 사람도, 공화국을 훔쳤다는 사람도, 정통 왕가가 돌아와야 한다는 사람도 있습니다.',
    [['황제를 따른다 (보나파르트파)', 'bonapartist', '아우스터리츠의 승전보에 모자를 던졌습니다. 혁명의 성과를 지키는 것은 황제입니다.'],
     ['정통 왕가의 귀환을 바란다', 'royalist', '망명지의 루이 18세를 위해 몰래 기도합니다.'],
     ['마음속으로는 공화파로 남는다', 'engaged', '공화력 달력이 사라진 날, 아무 말 없이 잔을 비웠습니다.'], APART]);
  P('pol-restoration', 1815, 1829, '왕정복고의 프랑스',
    '부르봉 왕가가 돌아왔습니다. 혁명 이전으로 되돌리자는 극왕당파, 헌장을 지키자는 자유주의자, 황제를 그리워하는 보나파르트파, 그리고 숨죽인 공화파.',
    [['극왕당파: 왕좌와 제단', 'royalist', '「라 코티디엔」을 구독합니다. 혁명이 남긴 것은 모두 지워야 한다고 믿습니다.'],
     ['자유주의자: 헌장을 지켜라', 'constitutional', '「르 콩스티튀시오넬」을 읽고, 선거 때마다 자유주의 후보에게 마음이 갑니다.'],
     ['보나파르트파: 세인트헬레나를 그리며', 'bonapartist', '집 안 어딘가에 황제의 작은 흉상을 숨겨 두었습니다.'],
     ['비밀 결사의 공화파 (카르보나리)', 'engaged', '등잔불 아래에서 카르보나리 맹세를 했습니다.'], APART]);
  P('pol-july', 1830, 1847, '7월 왕정의 프랑스',
    '시민 왕 루이필리프의 시대입니다. 정부는 “부자가 되시오”라고 합니다. 부르봉의 정통 왕가를 그리는 사람, 공화국을 꿈꾸는 사람, 노동자의 조합을 꿈꾸는 사람도 있습니다.',
    [['오를레앙파: 질서와 번영', 'constitutional', '선거권(납세액 200프랑)이 있다면 정부 후보에게 표를 줍니다.'],
     ['정통 왕당파 (레지티미스트)', 'royalist', '샤를 10세의 손자 샹보르 백작을 진짜 왕으로 여깁니다.'],
     ['공화파', 'engaged', '「르 나시오날」을 읽고, 선거권 확대 연회에 마음이 갑니다.'],
     ['사회주의자: 노동의 조직', 'socialist', '루이 블랑의 『노동의 조직』과 생시몽파의 책을 돌려 읽습니다.'], APART]);
  P('pol-1848', 1848, 1851, '제2공화국의 선택',
    '모든 남자가 투표합니다. 질서를 앞세우는 보수파, 민주적·사회적 공화국을 외치는 ‘민주사회파’, 나폴레옹의 조카에게 기대를 거는 사람들.',
    [['질서당: 재산과 가족과 종교', 'constitutional', '6월의 바리케이드를 보고 질서가 먼저라고 생각하게 되었습니다.'],
     ['민주사회파 공화국', 'socialist', '“민주적이고 사회적인 공화국 만세!” 붉은 넥타이를 맸습니다.'],
     ['루이 나폴레옹에게 건다', 'bonapartist', '그 이름만으로 표를 줄 이유가 충분합니다.'],
     ['정통 왕정으로 돌아가야 한다', 'royalist', '공화국은 결국 혼란일 뿐이라고 믿습니다.'], APART]);
  P('pol-second-empire', 1852, 1869, '제2제정의 프랑스',
    '나폴레옹 3세의 제정입니다. 철도와 박람회와 번영이 있지만, 신문은 검열받고 반대파는 망명지에 있습니다.',
    [['황제를 지지한다', 'bonapartist', '대로와 철도와 박람회를 보며 황제 덕분이라고 생각합니다.'],
     ['조용한 공화파', 'engaged', '저지섬의 위고가 쓴 『징벌 시집』을 몰래 돌려 읽습니다.'],
     ['정통 왕당파', 'royalist', '사교계에서는 아직도 ‘샹보르 백작 전하’라고 부릅니다.'],
     ['노동자의 국제 연합에 마음이 간다', 'socialist', '국제노동자협회 파리 지부의 모임에 나갔습니다.'], APART]);
  P('pol-third-republic', 1870, 1914, '제3공화국의 프랑스',
    '공화국이 뿌리를 내립니다. 그러나 왕정 복고를 꿈꾸는 사람, 황제가 다시 오기를 바라는 사람, 더 나아가 사회주의를 외치는 사람도 있습니다.',
    [['공화파: 학교와 7월 14일', 'engaged', '시청의 마리안 흉상 앞을 지날 때마다 모자를 살짝 들어 올립니다.'],
     ['왕당파: 왕과 교회', 'royalist', '「르 피가로」와 교회 신문을 읽고, 공립 학교의 세속 교육이 못마땅합니다.'],
     ['보나파르트파', 'bonapartist', '황태자가 줄루 전쟁에서 전사했다는 소식에 상복을 입었습니다.'],
     ['사회주의자', 'socialist', '노동절에 붉은 장미를 달았습니다. 조레스의 연설을 들으러 갑니다.'], APART]);

  // ───── 유언: 자녀 수에 맞게 ─────
  const inh = decisions.find(d => d.id === 'inheritance');
  if (inh) inh.when.kids = [2, 99];
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});
  decisions.push({id:'inheritance-only', domain:'old-age', priority:20, title:'외동에게 남길 것',
    text:'공증인을 불러 유언장을 쓸 때가 되었습니다. 자식은 하나뿐이니 나눌 다툼은 없습니다. 다만 배우자의 노후와, 자식의 배우자 집안이 재산에 손을 대지 않을지가 마음에 걸립니다.',
    when:{minAge:58, minWealth:20, kids:[1, 1], unsetFlag:'inheritance'},
    choices:[
      {label:'모두 외동에게 물려준다', result:'유언장은 한 장으로 끝났습니다. 자식이 말없이 손을 잡았습니다.', effects:{stats:{행복:3}, relationCloseness:{roles:['자녀'], amount:5}, flags:['inheritance', 'inheritance-only']}},
      {label:'배우자에게 평생 사용권(용익권)을 남기고, 소유는 자식에게', when:{livingRoles:['배우자']}, result:'공증인이 “용익권”이라는 낯선 말을 설명했습니다. 배우자는 죽을 때까지 이 집에 살고, 그 뒤에 자식에게 넘어갑니다.', effects:{stats:{행복:4}, relationCloseness:{roles:['배우자'], amount:5}, flags:['inheritance', 'inheritance-only']}},
      {label:'일부를 교구와 가난한 이웃에게 남긴다', result:'재산의 십분의 일을 구빈원과 교구 학교에 남겼습니다. 자식은 조금 서운한 눈치였습니다.', effects:{stats:{행복:3, 재산:-3}, experience:{religious:1}, relationCloseness:{roles:['자녀'], amount:-2}, flags:['inheritance', 'inheritance-only']}}]});
  decisions.push({id:'inheritance-none', domain:'old-age', priority:20, title:'자식 없는 유언',
    text:'공증인을 불러 유언장을 쓸 때가 되었습니다. 물려받을 자식이 없습니다. 이대로 두면 법이 정한 순서대로 형제자매와 조카들이 나눠 갖게 됩니다.',
    when:{minAge:58, minWealth:20, kids:[0, 0], unsetFlag:'inheritance'},
    choices:[
      {label:'조카들에게 나눠 준다', when:{hadRoles:['형제자매']}, result:'조카들이 공증인 사무실에 모였습니다. 얼굴을 처음 보는 조카도 있었습니다.', effects:{stats:{행복:2}, flags:['inheritance', 'inheritance-none']}},
      {label:'평생 곁에 있어 준 사람에게 남긴다', result:'오래 돌봐 준 이웃(하녀)에게 집과 살림을 남겼습니다. 친척들이 소송을 걸겠다고 수군댔습니다.', effects:{stats:{행복:4}, flags:['inheritance', 'inheritance-none']}},
      {label:'구빈원과 교구 학교에 기부한다', result:'유언장에 따라 구빈원에 침대 둘이 생기고, 교구 학교에 당신 이름의 장학금이 생겼습니다.', effects:{stats:{행복:4}, experience:{religious:1}, flags:['inheritance', 'inheritance-none']}},
      {label:'종신 연금으로 바꿔 남은 생을 편하게 산다', result:'집을 종신 연금(비아제)으로 팔았습니다. 매달 연금이 들어옵니다. 산 사람은 당신이 오래 살지 않기를 바랄 것입니다.', effects:{stats:{재산:6, 행복:2}, flags:['inheritance', 'inheritance-none']}}]});
})();
