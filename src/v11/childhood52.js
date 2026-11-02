// src/data/childhood-1840-1872.js — 1840–1860년생의 어린 시절
// Children of the railway, the 1848 barricades, Haussmann's demolitions, the Crimean and Italian wars,
// Épinal prints and the Comtesse de Ségur, the brothers' and the sisters' schools, the 1870 war and the
// siege, the Commune seen at child height. Grouped by place, class and sex like the earlier childhoods.
(() => {
  const E = (id, kind, when, title, text, effects = {}) => (when.maxAge !== undefined && when.maxAge <= 11 ? childhoodEvents : dailyEvents).push({
    id, kind, category:'historical', when, title, text,
    effects:{stats:effects.stats || {}, experience:effects.experience || {}, ...(effects.relationCloseness ? {relationCloseness:effects.relationCloseness} : {})},
    tags:['daily', when.maxAge <= 11 ? 'childhood' : 'life'], repeatable:false});
  const C = '농촌', K = {minAge:3, maxAge:11};

  // ───── 1840년대: 기차, 사진, 흉년, 1848 ─────
  E('k-train-sight', 'good', {...K, fromYear:1842, toYear:1860}, '철길 옆에서', '새로 놓인 철길 둑에 올라가 기차를 기다렸습니다. 검은 연기를 뿜으며 기관차가 지나가자 모두 귀를 막고 소리를 질렀습니다.', {stats:{행복:2}, experience:{curiosity:2}});
  E('k-navvies', 'normal', {...K, placeIncludes:C, fromYear:1844, toYear:1865}, '철도 공사판 사람들', '마을 근처에 철도 공사판이 들어섰습니다. 수백 명의 인부가 오두막에 살며 흙을 나릅니다. 어른들은 아이들에게 공사판 근처에 가지 말라고 했습니다.', {experience:{curiosity:1}});
  E('k-daguerre', 'normal', {...K, minWealth:45, notPlaceIncludes:C, fromYear:1843, toYear:1858}, '움직이면 안 돼', '사진관에서 은판 사진을 찍었습니다. 머리 뒤에 쇠 받침대를 대고 한참을 꼼짝 않고 있어야 했습니다. 사진 속 당신은 조금 흐릿합니다.', {stats:{행복:1}, experience:{curiosity:2}});
  E('k-1847-bread', 'bad', {...K, years:[1846, 1847], maxWealth:45}, '검은 빵', '흉년이라 빵이 귀합니다. 어머니가 밀기울과 감자를 섞어 구운 검은 빵을 아껴 잘라 주었습니다.', {stats:{건강:-1, 행복:-1}});
  E('k-1848-barricade', 'normal', {...K, places:['파리'], years:[1848]}, '바리케이드 놀이', '거리의 바리케이드가 치워진 뒤에도, 아이들은 포석을 쌓아 바리케이드 놀이를 했습니다. 누군가 빗자루에 붉은 천을 달았습니다.', {stats:{행복:1}, experience:{curiosity:2}});
  E('k-1848-tree', 'good', {...K, years:[1848]}, '1848년 자유의 나무', '마을 광장에 다시 자유의 나무를 심었습니다. 신부님이 축복하고, 어른들이 “공화국 만세!”를 외쳤습니다. 할아버지는 1792년에도 이랬다고 했습니다.', {stats:{행복:2}, experience:{social:1}});
  E('k-1848-vote', 'normal', {...K, years:[1848], livingRoles:['아버지']}, '아버지의 첫 투표', '아버지가 일요일 나들이옷을 입고 군청 소재지로 투표하러 갔습니다. 마을 남자들이 줄지어 함께 걸어갔습니다.', {experience:{curiosity:1}, relationCloseness:{roles:['아버지'], amount:1}});
  E('k-cholera-1849', 'bad', {...K, years:[1849, 1854]}, '콜레라의 여름', '콜레라가 돌아 골목에 석회를 뿌렸습니다. 같이 놀던 아이 하나가 하루 만에 세상을 떠났습니다.', {stats:{행복:-3}});

  // ───── 1850년대: 제정의 아이들 ─────
  E('k-saint-napoleon', 'good', {...K, fromYear:1852, toYear:1869, months:[7]}, '성 나폴레옹 축일', '다가오는 8월 15일 성 나폴레옹 축일을 준비합니다. 시청에 등불이 걸리고, 아이들에게 사탕을 나눠 준다고 합니다. 저녁에는 불꽃놀이가 있습니다.', {stats:{행복:2}});
  E('k-prince-1856', 'good', {...K, years:[1856]}, '황태자 탄생', '황후가 아들을 낳았다고 온 나라 성당의 종이 울렸습니다. 그해 태어난 아이들의 대부모가 황제 부부라는 소문이 돌았습니다.', {stats:{행복:1}});
  E('k-haussmann-gone', 'bad', {...K, places:['파리'], fromYear:1854, toYear:1869}, '사라진 골목', '어제까지 놀던 골목이 오늘 헐렸습니다. 곡괭이 소리와 석회 먼지 사이로 반쯤 남은 벽에 누군가의 벽지가 보였습니다.', {stats:{행복:-1}, experience:{curiosity:1}});
  E('k-boulevard', 'good', {...K, places:['파리'], fromYear:1858, toYear:1870, minWealth:35}, '새 대로의 산책', '일요일, 새로 뚫린 대로를 따라 가족과 산책했습니다. 가로수와 가스등, 그리고 끝없이 이어지는 똑같은 건물들.', {stats:{행복:2}});
  E('k-crimea-father', 'bad', {...K, years:[1854, 1855], livingRoles:['아버지'], parentAgeMin:20}, '크림에서 온 편지', '군에 간 친척이 크림반도에서 편지를 보냈습니다. 세바스토폴 앞의 겨울은 지독히 춥고, 병으로 죽는 사람이 총에 맞는 사람보다 많다고 합니다.', {stats:{행복:-1}});
  E('k-flood-1856', 'bad', {...K, places:['리옹', '투르'], years:[1856]}, '1856년 대홍수', '강물이 둑을 넘어 아래층까지 들어왔습니다. 배를 타고 집 앞을 지나는 군인들이 빵을 던져 주었습니다.', {stats:{건강:-1, 행복:-2}});
  E('k-epinal', 'good', {...K, fromYear:1840, toYear:1875}, '에피날 판화', '행상에게서 에피날 판화 한 장을 샀습니다. 나폴레옹의 전투와 ‘영원히 떠도는 유대인’ 그림을 오려 벽에 붙였습니다.', {stats:{행복:2}, experience:{curiosity:1}});
  E('k-colporteur', 'normal', {...K, placeIncludes:C, fromYear:1840, toYear:1870}, '책 행상', '등에 상자를 진 책 행상이 마을에 왔습니다. 달력과 노래책, 성인전, 꿈 풀이 책. 글을 아는 이웃이 저녁에 소리 내어 읽어 주었습니다.', {experience:{curiosity:1, educationInterest:1}});
  E('k-magic-lantern', 'good', {...K, fromYear:1845, toYear:1885}, '환등기', '장날 광장에서 환등기 쇼를 보았습니다. 깜깜한 천막 안 하얀 천에 해골과 유령, 먼 나라의 코끼리가 나타났습니다.', {stats:{행복:3}, experience:{curiosity:2}});
  E('k-circus', 'good', {...K, notPlaceIncludes:C, fromYear:1852, toYear:1885}, '서커스', '겨울 서커스에서 말 위에 선 곡예사와 어릿광대를 보았습니다. 집에 와서 의자 위에 서 보다가 떨어졌습니다.', {stats:{행복:3}});
  E('k-segur', 'good', {...K, classes:['부르주아', '귀족'], sexes:['여성'], fromYear:1858, literacy:['basic', 'learning']}, '『소피의 불행』', '세귀르 백작 부인의 『소피의 불행』을 선물로 받았습니다. 말썽꾸러기 소피가 꼭 당신 같다고 어머니가 웃었습니다.', {stats:{행복:2, 지식:1}, experience:{educationInterest:1}});
  E('k-verne', 'good', {minAge:9, maxAge:15, literacy:['basic'], fromYear:1863, notPlaceIncludes:C}, '쥘 베른', '『기구를 타고 5주간』을 밤새 읽었습니다. 언젠가 아프리카 위를 날아 보겠다고 다짐했습니다.', {stats:{행복:2, 지식:1}, experience:{curiosity:2}});
  E('k-soldier-toys', 'good', {...K, sexes:['남성'], minWealth:40, fromYear:1852, toYear:1870}, '납 병정', '성탄절에 납으로 만든 근위대 병정 한 상자를 받았습니다. 크림과 이탈리아의 전투를 거실 바닥에서 몇 번이고 다시 치렀습니다.', {stats:{행복:3}});
  E('k-italy-1859', 'good', {...K, years:[1859]}, '마젠타와 솔페리노', '이탈리아에서 이겼다는 소식에 마을에 삼색기가 걸렸습니다. 그해 새로 나온 자줏빛 물감 이름이 ‘마젠타’라고 합니다.', {stats:{행복:1}, experience:{curiosity:1}});
  E('k-velocipede', 'good', {minAge:8, maxAge:15, sexes:['남성'], minWealth:45, notPlaceIncludes:C, fromYear:1867, toYear:1875}, '벨로시페드', '앞바퀴에 페달이 달린 나무 자전거 벨로시페드를 빌려 탔습니다. 포석 위에서 이가 덜덜거렸지만 내리고 싶지 않았습니다.', {stats:{행복:3}, experience:{curiosity:1}});
  E('k-expo-1867', 'good', {...K, places:['파리'], years:[1867]}, '박람회의 일본관', '만국 박람회에서 일본 사람들의 찻집과 이집트 신전, 커다란 크루프 대포를 보았습니다.', {stats:{행복:3}, experience:{curiosity:3}});

  // ───── 학교: 수사와 수녀, 공립 교사 ─────
  E('k-freres', 'normal', {minAge:6, maxAge:11, sexes:['남성'], notPlaceIncludes:C, fromYear:1840, toYear:1880, religions:['catholic']}, '그리스도교 학교 수사들', '검은 수단에 하얀 깃을 단 수사들의 학교에 다닙니다. 석판 위에 글씨를 쓰고, 수업 시작과 끝에 기도를 합니다. 딱따기 소리 하나로 반 전체가 일어섭니다.', {stats:{지식:1}, experience:{religious:1}});
  E('k-soeurs', 'normal', {minAge:6, maxAge:11, sexes:['여성'], fromYear:1850, toYear:1885, religions:['catholic']}, '수녀님의 학교', '팔루 법 뒤 마을에 수녀회 학교가 생겼습니다. 읽기와 교리, 그리고 바느질을 배웁니다. 수녀님은 손톱이 깨끗한지 매일 검사합니다.', {stats:{지식:1}, experience:{religious:1}});
  E('k-instituteur', 'normal', {minAge:6, maxAge:11, sexes:['남성'], placeIncludes:C, fromYear:1840, toYear:1880}, '마을 학교 선생님', '마을 교사는 성당 성가대 지휘와 시청 서기 일도 겸합니다. 겨울에만 학교에 나오는 아이가 절반입니다. 봄이 오면 다들 밭으로 돌아갑니다.', {stats:{지식:1}});
  E('k-breton-school', 'bad', {minAge:6, maxAge:11, places:['브르타뉴 농촌'], fromYear:1845}, '프랑스어 시간', '선생님은 브르타뉴 말을 쓰면 혼을 냅니다. 집에서는 아무도 프랑스어를 쓰지 않는데 말입니다.', {stats:{행복:-1, 지식:1}, experience:{inequality:1}});
  E('k-first-communion-dress', 'good', {minAge:10, maxAge:12, religions:['catholic'], fromYear:1840}, '첫 영성체 사진', '첫 영성체 날, 하얀 옷(혹은 팔에 흰 완장)을 하고 사진관에서 사진을 찍었습니다. 그 사진은 평생 거실 벽에 걸려 있습니다.', {stats:{행복:2}, experience:{religious:1}});
  E('k-lycee-drum', 'normal', {minAge:10, maxAge:15, sexes:['남성'], classes:['부르주아', '귀족'], fromYear:1852, toYear:1870}, '제정 리세의 북', '제국 리세에서는 종 대신 북소리로 일어나고, 군복 같은 교복을 입고 줄을 맞춰 식당에 갑니다. 라틴어 작문이 가장 중요합니다.', {stats:{지식:2, 행복:-1}});

  // ───── 일하는 아이들 ─────
  E('k-mill-1841', 'bad', {minAge:8, maxAge:11, places:['루앙', '리옹'], classes:['도시 평민'], fromYear:1841, toYear:1870, maxWealth:40}, '여덟 살의 공장', '1841년 법으로 여덟 살부터 공장에서 일할 수 있습니다. 하루 여덟 시간이라지만 감독관은 거의 오지 않습니다. 방적기 아래로 기어 들어가 끊어진 실을 잇습니다.', {stats:{건강:-2, 재산:1}, experience:{inequality:2}});
  E('k-cotton-famine', 'bad', {...K, places:['루앙'], years:[1862, 1863]}, '멈춘 공장', '공장이 멈춰 아버지와 어머니가 둘 다 집에 있습니다. 시청에서 나눠 주는 수프 냄새가 골목에 퍼집니다.', {stats:{건강:-1, 행복:-2}});
  E('k-silk-nursery', 'normal', {...K, places:['리옹'], fromYear:1853, toYear:1868}, '누에 방', '할머니가 누에 방의 누에를 살폈습니다. 올해도 검은 반점이 생긴 누에가 많습니다. 생사 값이 오를 거라고 어른들이 수군댔습니다.', {experience:{familyTrade:1}});
  E('k-auvergne-father', 'normal', {...K, places:['오베르뉴 농촌'], fromYear:1840, toYear:1880, livingRoles:['아버지']}, '봄에 돌아오는 아버지', '아버지가 겨울 내내 파리에서 물장수와 숯장수로 일하고 봄에 돌아왔습니다. 처음 보는 파리 사탕과 이야기 보따리를 풀어놓았습니다.', {stats:{행복:3}, relationCloseness:{roles:['아버지'], amount:2}});
  E('k-sardine', 'normal', {minAge:9, maxAge:15, places:['브르타뉴 농촌'], sexes:['여성'], fromYear:1860}, '통조림 공장의 소녀', '정어리 배가 들어오면 열 살 남짓한 여자아이들도 통조림 공장에 불려 갑니다. 손가락이 소금물에 부르텄습니다.', {stats:{재산:1, 건강:-1}});
  E('k-vine-children', 'normal', {...K, places:['부르고뉴 농촌'], months:[11], fromYear:1840}, '포도 수확 방학', '포도 수확철에는 학교도 쉽니다. 아이들도 바구니를 들고 포도밭에 나갑니다.', {experience:{familyTrade:1}});
  E('k-bordeaux-1855', 'good', {...K, places:['보르도'], years:[1855]}, '1등급 포도주', '박람회에서 메도크 포도원의 등급이 정해졌다는 소식에 샤르트롱의 어른들이 샴페인을 터뜨렸습니다. 당신에게도 한 모금이 돌아왔습니다.', {stats:{행복:2}});
  E('k-steamboat', 'good', {...K, places:['보르도', '루앙', '투르'], fromYear:1840, toYear:1870}, '증기선', '바퀴를 돌리며 강을 거슬러 오르는 증기선을 구경했습니다. 굴뚝에서 불똥이 튀었습니다.', {stats:{행복:2}, experience:{curiosity:1}});

  // ───── 1870–1871: 아이의 눈으로 ─────
  E('k-1870-departure', 'bad', {...K, years:[1870]}, '“베를린으로!”', '여름, 역 앞에서 군인들이 “베를린으로!”를 외치며 떠났습니다. 가을이 되자 아무도 그 노래를 부르지 않았습니다.', {stats:{행복:-1}});
  E('k-smallpox-1870', 'bad', {...K, years:[1870, 1871]}, '천연두가 돈다', '전쟁과 함께 천연두가 퍼졌습니다. 어머니가 팔에 종두 자국이 있는지 확인하고 또 확인했습니다.', {stats:{행복:-1}});
  E('k-siege-balloon', 'good', {...K, places:['파리'], years:[1870]}, '기구 우편', '포위된 파리에서 편지를 실은 기구가 떠오르는 것을 보았습니다. 기구는 바람을 타고 프로이센군 머리 위로 사라졌습니다.', {stats:{행복:1}, experience:{curiosity:2}});
  E('k-siege-rat', 'bad', {...K, places:['파리'], years:[1870, 1871]}, '이상한 고기', '저녁 수프에 든 고기가 이상했습니다. 어머니는 아무 말 하지 않았습니다. 시장에서 쥐 한 마리가 1프랑에 팔린다는 이야기를 나중에 들었습니다.', {stats:{건강:-2, 행복:-2}});
  E('k-prussians', 'bad', {...K, places:['부르고뉴 농촌', '투르', '루앙'], years:[1870, 1871]}, '뾰족 투구', '뾰족한 투구를 쓴 프로이센 병사들이 마을에 들어와 집집마다 묵었습니다. 당신 집 부엌에도 둘이 앉아 감자를 먹었습니다. 한 명은 고향의 딸 사진을 보여 주었습니다.', {stats:{행복:-2}, experience:{curiosity:1}});
  E('k-commune-gamin', 'normal', {minAge:8, maxAge:15, places:['파리'], years:[1871]}, '바리케이드의 아이들', '코뮌의 바리케이드에서 또래 아이들이 포석을 나르고 탄약을 날랐습니다. 5월이 끝나자 그 아이들 가운데 몇은 보이지 않았습니다.', {stats:{행복:-2}, experience:{inequality:2}});
  E('k-alsace', 'normal', {...K, fromYear:1871, toYear:1875}, '알자스에서 온 아이', '알자스에서 프랑스 국적을 택해 떠나온 가족이 이웃으로 이사 왔습니다. 그 집 아이는 독일어 섞인 사투리를 썼고, 지도의 검은 리본 이야기를 했습니다.', {experience:{curiosity:1, social:1}});
})();

// Childhood and youth decisions of the period.
(() => {
  const D = (id, domain, when, title, text, choices, chance) => decisions.push({id, domain, priority:24, title, text, ...(chance ? {chance} : {}),
    when:{unsetFlag:id, ...when}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id, ...((c.effects || {}).flags || [])]}}))});
  const H = (id, date, when, title, text, choices, until) => decisions.push({id, domain:'history', priority:30, historic:true, title, text,
    when:{...when, fromDate:date, toDate:until || date, unsetFlag:id}, choices:choices.map(c => ({...c, effects:{stats:{}, ...(c.effects || {}), flags:[id]}}))});
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});

  D('lycee-or-seminary', 'education', {minAge:10, maxAge:12, sexes:['남성'], classes:['부르주아', '귀족'], fromYear:1850, toYear:1875}, '리세냐, 소신학교냐',
    '아버지는 황제의 리세에 보내 법률가나 기술자가 되게 하려 합니다. 어머니와 신부님은 소신학교(작은 신학교)가 더 착실하다고 합니다. 소신학교라고 모두 신부가 되는 것은 아닙니다.',
    [{label:'제국 리세에 간다', result:'북소리와 라틴어, 수학의 학교. 바칼로레아를 향해 몇 해를 견뎌야 합니다.', effects:{stats:{지식:4, 행복:-1}, education:'리세'}},
     {label:'소신학교에 간다', result:'기도와 라틴어, 성가의 학교. 신부님들은 엄했지만 다정했습니다.', effects:{stats:{지식:3}, experience:{religious:2}, education:'소신학교'}},
     {label:'집안 가게(일)를 일찍 배운다', result:'학교 대신 장부와 손님을 배웠습니다.', effects:{stats:{재산:2}, experience:{familyTrade:2}}}]);
  // The 1836 girls' school decision belongs to the girls of the July Monarchy; from 1850 this one replaces it.
  const g36 = decisions.find(d => d.id === 'girls-school-1836'); if (g36) g36.when.toYear = 1849;
  D('girls-convent-or-lay', 'education', {minAge:6, maxAge:11, sexes:['여성'], fromYear:1850, toYear:1885, unsetFlag:'learn'}, '어느 학교로',
    '마을(동네)에 수녀회 학교와, 뒤뤼이 법 뒤 새로 생긴 공립 여학교 선생님이 있습니다. 집에서는 일손이 아쉽다고 합니다.',
    [{label:'수녀회 학교에 다닌다', result:'수녀님에게 읽기와 바느질, 교리를 배웠습니다.', effects:{stats:{지식:2}, experience:{religious:1}, education:'수녀회 학교', literacy:'learning', path:{learning:'study'}, flags:['learn']}},
     {label:'공립 여학교에 다닌다', result:'세속 여교사에게 읽기와 셈, 프랑스 지리를 배웠습니다.', effects:{stats:{지식:3}, education:'공립 여학교', literacy:'learning', path:{learning:'study'}, flags:['learn']}},
     {label:'집안일을 돕는다', result:'동생들을 돌보고 물을 길었습니다. 글은 나중으로 미뤘습니다.', effects:{stats:{재산:1}, experience:{responsibility:2}, flags:['learn']}}]);
  H('siege-evacuate', [1870,9], {minAge:3, maxAge:14, places:['파리']}, '포위 전에 떠날까',
    '프로이센군이 파리로 오고 있습니다. 며칠 뒤면 성문이 닫힙니다. 부모님은 당신을 시골 친척 집에 보낼지 의논합니다.',
    [{label:'시골 친척 집으로 간다', result:'마지막 기차를 타고 떠났습니다. 포위가 끝난 이듬해 봄에야 돌아왔습니다. 그사이 파리의 아이들은 많이 야위었습니다.', effects:{stats:{행복:-2}, experience:{curiosity:1}}},
     {label:'가족과 함께 남는다', result:'넉 달의 포위를 가족과 함께 견뎠습니다. 그 겨울의 배고픔을 평생 기억합니다.', effects:{stats:{건강:-3, 행복:-1}, relationCloseness:{roles:['어머니', '아버지'], amount:3}}}]);
  H('prussian-billet-child', [1870,12], {minAge:6, maxAge:14, places:['부르고뉴 농촌', '투르', '루앙']}, '부엌의 프로이센 병사',
    '당신 집에 묵는 프로이센 병사가 부엌에서 혼자 하모니카를 붑니다. 어른들은 말을 섞지 말라고 했습니다. 그가 손짓으로 당신을 부릅니다.',
    [{label:'다가가 본다', result:'그는 독일 노래를 가르쳐 주고, 고향의 딸 사진을 보여 주었습니다. 원수의 얼굴이 생각보다 평범했습니다.', effects:{stats:{행복:1}, experience:{curiosity:2}}},
     {label:'어머니 치마 뒤에 숨는다', result:'병사는 어깨를 으쓱하고 하모니카를 계속 불었습니다.', effects:{}}]);
  D('certificat-1866', 'education', {minAge:11, maxAge:13, literacy:['basic', 'learning'], fromYear:1866, toYear:1881}, '학력 증명서 시험',
    '도에서 새로 만든 초등 학력 증명서 시험이 있습니다. 붙으면 체신국이나 철도 회사 사환 자리를 얻기 쉽다고 합니다. 선생님이 당신을 추천했습니다.',
    [{label:'시험을 본다', preview:'합격 / 낙방', outcomes:[
       O('pass', '합격했습니다', 65, '받아쓰기와 셈, 프랑스 역사. 합격자 명단에 이름이 있었습니다. 온 집안이 자랑스러워했습니다.', {stats:{행복:4, 지식:2}, literacy:'basic', milestone:'초등 학력 증명서 취득'}),
       O('fail', '떨어졌습니다', 35, '받아쓰기에서 철자를 너무 많이 틀렸습니다.', {stats:{행복:-2}})]},
     {label:'일하러 간다', result:'시험 대신 일자리를 택했습니다.', effects:{stats:{재산:1}}}], .6);
})();
