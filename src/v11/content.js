// src/data/male.js
// Korean display names. FR_NAMES (pixel.js) maps each to its French original for the passport.
const male = ['장','피에르','루이','자크','앙투안','프랑수아','니콜라','미셸','에티엔','클로드','조제프','샤를','앙드레','질','기욤',
  '르네','마티외','쥘리앵','필리프','위베르','장바티스트','폴','오귀스탱','이브','코랑탱','시몽','알렉시','뱅상','오노레','아드리앵','가브리엘','레옹'];

// src/data/female.js
const female = ['마리','잔','안','마들렌','엘리자베트','루이즈','카트린','마르그리트','프랑수아즈','마리안','쥐스틴','쥘리','빅투아르','테레즈',
  '주느비에브','아델라이드','앙젤리크','소피','클레르','마르트','로즈','셀레스트','외제니','조제핀','앙투아네트','니콜','쉬잔','아니에스','펠리시테','바르브'];

// src/data/surnames.js
const surnames = ['뒤퐁','마르탱','르페브르','베르나르','모로','로랑','프티','뒤랑','르루아','루','베르트랑','모렐','푸르니에','지라르','메르시에',
  '블랑','게랭','부아예','가르니에','슈발리에','르그랑','고티에','페랭','로베르','클레망','모랭','루셀','르메르','뒤부아','포르','르클레르',
  '브뤼네','르브룅','르고프','르갈','뒤마','바이','콜랭','아르노','부셰','마송','샤르팡티에','파브르','롤랑','카라덱','바레','라퐁','르블랑'];

// src/data/history-extended.js
// Calendar months, Gregorian. Outcomes are fixed; `impacts` describe only the player's local experience.
historicalEvents.push(
  {id:'seven-years-war', year:1756, month:5, text:'프랑스가 영국에 선전포고하며 7년 전쟁이 시작됩니다.', impacts:[{when:{minAge:16,maxAge:45},stats:{재산:-1},text:'전쟁 소식과 함께 세금 부담이 늘어난다는 말이 돕니다.'}]},
  {id:'damiens', year:1757, month:1, text:'다미앵이 베르사유에서 국왕 루이 15세를 칼로 찌르는 사건이 일어납니다.'},
  {id:'quebec', year:1759, month:9, text:'북아메리카의 퀘벡이 영국군에게 함락됩니다.'},
  {id:'calas', year:1762, month:3, text:'툴루즈에서 개신교도 장 칼라스가 처형됩니다. 볼테르가 그의 무죄를 주장하며 관용을 호소합니다.', impacts:[{when:{religions:['protestant']},stats:{행복:-3},text:'개신교 가정에는 남의 일 같지 않은 소식입니다.'}]},
  {id:'paris-1763', year:1763, month:2, text:'파리 조약으로 7년 전쟁이 끝납니다. 프랑스는 캐나다를 비롯한 식민지 대부분을 잃습니다.'},
  {id:'jesuits', year:1764, month:11, text:'왕령으로 프랑스에서 예수회가 해산됩니다. 예수회가 운영하던 학교들도 주인이 바뀝니다.'},
  {id:'lorraine', year:1766, month:2, text:'로렌 공 스타니스와프가 세상을 떠나 로렌이 프랑스 왕국에 편입됩니다.'},
  {id:'corsica', year:1768, month:5, text:'제노바가 코르시카섬을 프랑스에 넘깁니다.'},
  {id:'royal-wedding', year:1770, month:5, text:'왕세자 루이와 오스트리아의 마리 앙투아네트가 혼인합니다.', impacts:[{when:{places:['파리']},stats:{행복:1},text:'축하 불꽃놀이 소식으로 거리가 들썩입니다.'}]},
  {id:'maupeou', year:1771, month:1, text:'대법관 모푸가 고등법원을 해산하고 법원 개혁을 단행합니다.', impacts:[{when:{parentJobs:['법률가']},stats:{재산:-2},text:'법률가 집안에 근심이 드리웁니다.'}]},
  {id:'louis-xv-death', year:1774, month:5, text:'루이 15세가 천연두로 세상을 떠나고 루이 16세가 즉위합니다.'},
  {id:'flour-war', year:1775, month:4, text:'곡물 거래 자유화 뒤 빵값이 치솟아 곳곳에서 밀가루 폭동(밀가루 전쟁)이 일어납니다.', impacts:[{when:{classes:['도시 평민','농민']},stats:{재산:-3,행복:-2},text:'빵을 사기가 어려워져 끼니를 줄입니다.'}]},
  {id:'turgot', year:1776, month:5, text:'개혁을 추진하던 재무총감 튀르고가 해임됩니다.'},
  {id:'american-alliance', year:1778, month:2, text:'프랑스가 미국과 동맹을 맺고 독립전쟁에 뛰어듭니다.', impacts:[{when:{placeIncludes:'보르도'},stats:{재산:1},text:'대서양 항구에 군수품과 상선이 바삐 오갑니다.'}]},
  {id:'balloon', year:1783, month:11, text:'몽골피에 형제의 열기구가 사람을 태우고 파리 하늘을 납니다.', impacts:[{when:{places:['파리']},stats:{행복:2,지식:1},text:'하늘을 나는 풍선을 보러 사람들이 몰려듭니다.'}]},
  {id:'versailles-1783', year:1783, month:9, text:'베르사유 조약으로 미국 독립전쟁이 끝납니다. 승리했지만 왕국의 빚은 크게 불어났습니다.'},
  {id:'figaro', year:1784, month:4, text:'보마르셰의 희극 「피가로의 결혼」이 초연되어 귀족을 풍자했다는 평판을 얻습니다.'},
  {id:'necklace', year:1785, month:8, text:'목걸이 사건으로 로앙 추기경이 체포되고, 왕비에 대한 소문이 퍼집니다.'},
  {id:'notables', year:1787, month:2, text:'재정 위기를 풀기 위해 명사회가 소집됩니다.'},
  {id:'hailstorm', year:1788, month:7, text:'거대한 우박 폭풍이 북부와 중부의 들판을 휩씁니다.', impacts:[{when:{classes:['농민']},stats:{재산:-5,행복:-3},text:'한 해 농사가 하룻밤 사이에 망가졌습니다.'},{when:{classes:['도시 평민']},stats:{재산:-2},text:'곡물값이 오를 거라는 걱정이 돕니다.'}]},
  {id:'estates-convoked', year:1788, month:8, text:'국왕이 이듬해 5월에 삼부회를 소집하겠다고 발표합니다.'},
  {id:'winter-1788', year:1788, month:12, text:'유난히 혹독한 겨울이 찾아와 센강이 얼어붙고 빵값이 치솟습니다.', impacts:[{stats:{건강:-2},text:'땔감과 빵을 구하기 어려운 겨울입니다.'}]},

  {id:'year-without-summer', year:1816, month:7, text:'‘여름 없는 해’. 차갑고 비가 잦은 여름이 이어져 수확이 크게 줄어듭니다.', impacts:[{when:{classes:['농민']},stats:{재산:-5,행복:-2},text:'밀이 제대로 여물지 않았습니다.'},{when:{classes:['도시 평민']},stats:{재산:-3},text:'빵값이 크게 올랐습니다.'}]},
  {id:'occupation-ends', year:1818, month:11, text:'동맹군이 프랑스에서 철수하며 점령이 끝납니다.'},
  {id:'berry', year:1820, month:2, text:'왕위 계승자 베리 공작이 오페라 극장 앞에서 암살됩니다.'},
  {id:'napoleon-death', year:1821, month:7, text:'나폴레옹이 5월 세인트헬레나섬에서 세상을 떠났다는 소식이 프랑스에 전해집니다.'},
  {id:'spanish-expedition', year:1823, month:4, text:'프랑스군이 스페인 국왕을 복위시키기 위해 피레네산맥을 넘습니다.'},
  {id:'charles-x', year:1824, month:9, text:'루이 18세가 세상을 떠나고 샤를 10세가 즉위합니다.'},
  {id:'reims', year:1825, month:5, text:'샤를 10세가 랭스 대성당에서 옛 방식 그대로 대관식을 올립니다.'},
  {id:'july-revolution', year:1830, month:7, text:'7월 혁명. 파리에서 사흘 동안 바리케이드 전투가 벌어지고 샤를 10세가 물러납니다. 같은 달 프랑스군이 알제를 점령합니다.', impacts:[{when:{places:['파리']},stats:{행복:-2,지식:2},text:'거리마다 바리케이드가 세워졌습니다.'}]},
  {id:'louis-philippe', year:1830, month:8, text:'루이필리프가 ‘프랑스인의 왕’으로 즉위하고 삼색기가 돌아옵니다.'},
  {id:'canuts-1831', year:1831, month:11, text:'리옹의 견직공(카뉘)들이 임금 문제로 봉기합니다.', impacts:[{when:{placeIncludes:'리옹'},stats:{재산:-3,행복:-3},text:'작업장이 멈추고 거리에 총성이 울립니다.'}]},
  {id:'cholera-1832', year:1832, month:4, text:'콜레라가 파리를 휩쓸어 몇 달 사이 1만 8천 명 넘게 목숨을 잃습니다.', impacts:[{when:{places:['파리']},stats:{건강:-6,행복:-4},text:'이웃의 장례 행렬이 날마다 지나갑니다.'},{stats:{건강:-1},text:'역병 소식에 모두가 손을 씻고 물을 끓입니다.'}]},
  {id:'june-1832', year:1832, month:6, text:'파리에서 공화파의 6월 봉기가 일어났다가 이틀 만에 진압됩니다.'},
  {id:'guizot-law', year:1833, month:6, text:'기조 법으로 모든 코뮌에 남자 초등학교를 세우도록 정해집니다.', impacts:[{when:{maxAge:12},stats:{지식:2},text:'마을에 학교가 생긴다는 소식이 들립니다.'}]},
  {id:'canuts-1834', year:1834, month:4, text:'리옹에서 두 번째 견직공 봉기가 일어나고 파리 트랑스노냉 거리에서도 학살이 벌어집니다.', impacts:[{when:{placeIncludes:'리옹'},stats:{행복:-4},text:'다시 한번 리옹이 피로 물듭니다.'}]},
  {id:'first-railway', year:1837, month:8, text:'파리와 생제르맹앙레를 잇는 첫 여객 철도가 개통됩니다.', impacts:[{when:{places:['파리']},stats:{지식:1,행복:1},text:'증기 기관차를 구경하러 사람들이 몰려듭니다.'}]},
  {id:'ashes', year:1840, month:12, text:'나폴레옹의 유해가 파리로 돌아와 앵발리드에 안치됩니다.'},
  {id:'railway-law', year:1842, month:6, text:'철도법이 제정되어 파리를 중심으로 한 철도망 건설이 시작됩니다.'},
  {id:'bad-harvest-1846', year:1846, month:9, text:'감자 역병과 흉작이 겹쳐 빵값이 오르고 이듬해까지 경제 위기가 이어집니다.', impacts:[{when:{classes:['농민','도시 평민']},stats:{재산:-4,건강:-1},text:'식탁이 눈에 띄게 가벼워졌습니다.'}]},
  {id:'february-1848', year:1848, month:2, text:'2월 혁명. 루이필리프가 물러나고 제2공화국이 선포됩니다.', impacts:[{when:{places:['파리']},stats:{지식:2},text:'파리 거리에 다시 바리케이드가 섭니다.'}]},
  {id:'suffrage-1848', year:1848, month:4, text:'21세 이상 모든 남성이 투표하는 첫 총선거가 치러집니다.', impacts:[{when:{minAge:21},stats:{지식:1},text:'처음으로 투표권이 주어졌다는 이야기로 마을이 떠들썩합니다.'}]},
  {id:'june-days', year:1848, month:6, text:'국립 작업장 폐쇄에 반발한 파리 노동자들의 6월 봉기가 유혈 진압됩니다.', impacts:[{when:{places:['파리'],classes:['도시 평민']},stats:{행복:-4,재산:-2},text:'일자리를 잃은 이웃이 많습니다.'}]},
  {id:'president-1848', year:1848, month:12, text:'루이 나폴레옹 보나파르트가 대통령으로 선출됩니다.'},
  {id:'cholera-1849', year:1849, month:5, text:'콜레라가 다시 유행합니다.', impacts:[{when:{places:['파리']},stats:{건강:-4},text:'1832년의 악몽이 되살아납니다.'}]},
  {id:'coup-1851', year:1851, month:12, text:'루이 나폴레옹이 쿠데타를 일으켜 의회를 해산합니다.'}
);

// src/data/birth.js
const BIRTH_CHOICE = {min:1750, max:1825};
