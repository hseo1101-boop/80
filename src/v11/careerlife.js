// src/careerlife.js — everyday events for each career (직업별 일상)
// Each career path gets its own small moments, so a law clerk, a midwife and a ship's mate do not live the same
// year. Events key on the career (careerIs), with the rank, sex and years where the text needs them. The English
// text sits beside the Korean and goes straight into the translation table.
(() => {
  const C = (id, career, kind, when, title, text, effects, en) => {
    dailyEvents.push({id:'cl-' + id, kind, category:'personal', when:{minAge:16, ...when, careerIs:[career]}, title, text,
      effects:{stats:effects.stats || {}, experience:effects.experience || {}}, tags:['daily', 'life', 'career'], repeatable:false});
    if (en) { EN[title] = en[0]; EN[text] = en[1]; }
  };
  const MEN = {sexes:['남성']}, WOMEN = {sexes:['여성']};

  // ───── 법률가 ─────
  C('law-copy', 'law', 'normal', {}, '밤새 베낀 소장', '내일 아침 법정에 낼 소장 세 통을 촛불 아래에서 베꼈습니다. 글자 하나 틀리면 처음부터 다시입니다.', {stats:{건강:-1, 지식:1}},
    ['A brief copied overnight', 'By candlelight you copied out three briefs due in court tomorrow morning. One wrong letter and you start again.']);
  C('law-fee', 'law', 'good', {minRank:1}, '넉넉한 수임료', '상속 다툼을 맡았던 집안이 판결이 나자 약속보다 많은 수임료를 보내왔습니다. 편지에는 “다음에도 부탁드립니다”라고 적혀 있었습니다.', {stats:{재산:3, 행복:1}},
    ['A generous fee', 'The family whose inheritance dispute you handled sent more than the agreed fee when the judgment came. The letter said, “We shall call on you again.”']);
  C('law-lost', 'law', 'bad', {minRank:1}, '진 소송', '이길 줄 알았던 소송에서 졌습니다. 의뢰인은 법원 계단에서 당신을 돌아보지도 않고 떠났습니다.', {stats:{행복:-2}},
    ['A case lost', 'You lost a case you thought you would win. Your client left on the court steps without a backward glance.']);
  C('law-code', 'law', 'normal', {fromYear:1804, toYear:1830}, '새 법전', '민법전이 나온 뒤로 옛 관습법 주석서들이 서가에서 쓸모를 잃었습니다. 2,281개 조문을 다시 외우고 있습니다.', {stats:{지식:2}},
    ['The new code', 'Since the Civil Code came out, the old commentaries on customary law are useless on the shelf. You are learning its 2,281 articles all over again.']);
  C('law-women', 'law', 'normal', WOMEN, '이름 없는 서류', '당신이 정리한 서류가 법정에서 결정적이었다고 합니다. 법정에 선 것도, 이름이 남은 것도 변호사입니다.', {stats:{지식:1}, experience:{inequality:1}},
    ['Papers without a name', 'The papers you put in order were decisive in court, they say. It was the advocate who stood up in court, and the advocate whose name was remembered.']);

  // ───── 언론인 ─────
  C('press-deadline', 'press', 'normal', {}, '마감', '인쇄기가 돌기 한 시간 전까지 원고를 고쳤습니다. 식자공이 문간에서 발을 굴렀습니다.', {stats:{지식:1, 건강:-1}},
    ['Deadline', 'You were still correcting the copy an hour before the press ran. The compositor stamped his feet in the doorway.']);
  C('press-readers', 'press', 'good', {minRank:1}, '독자의 편지', '지난주 글을 읽었다는 독자가 편지를 보냈습니다. 지방 소도시의 카페에서 그 글을 소리 내어 읽었다고 합니다.', {stats:{행복:2}},
    ["A reader's letter", 'A reader wrote to say they had read your piece last week. It was read aloud, they said, in a café in a small provincial town.']);
  C('press-stamp', 'press', 'bad', {fromYear:1797}, '인지세', '신문 한 부마다 붙이는 인지세가 또 올랐습니다. 구독료를 올리면 독자가 떨어지고, 안 올리면 적자입니다.', {stats:{재산:-2}},
    ['The stamp duty', 'The stamp duty on every copy of a newspaper has gone up again. Raise the subscription and readers leave; keep it and you run at a loss.']);
  C('press-libel', 'press', 'bad', {minRank:2}, '명예 훼손 소송', '기사에 이름이 나온 상인이 명예 훼손으로 소송을 걸었습니다. 변호사 비용만 몇 달 치 수입입니다.', {stats:{재산:-3, 행복:-1}},
    ['A libel suit', 'A merchant named in one of your articles has sued for libel. The lawyer alone will cost several months of income.']);

  // ───── 장교·종군 상인 ─────
  C('off-duel', 'officer', 'bad', MEN, '결투 신청', '카페에서 다른 연대 장교와 언쟁이 붙었고, 이튿날 새벽 입회인들이 찾아왔습니다. 칼끝이 팔을 스쳤고, 명예는 지켰다고들 합니다.', {stats:{건강:-3}},
    ['A challenge', 'You quarrelled with an officer of another regiment in a café, and at dawn the seconds came. A sword point grazed your arm; honour, they say, was satisfied.']);
  C('off-garrison', 'officer', 'normal', MEN, '수비대 생활', '전쟁 없는 해, 지방 수비대 도시에서 사열과 카드놀이와 무도회로 하루하루가 흘러갑니다.', {stats:{행복:1}, experience:{social:1}},
    ['Garrison life', 'A year without war: in a provincial garrison town the days slip by in parades, cards and balls.']);
  C('off-pay', 'officer', 'bad', MEN, '밀린 봉급과 말값', '장교는 자기 말과 군복을 제 돈으로 마련해야 합니다. 봉급이 석 달째 밀렸는데 말이 다리를 절기 시작했습니다.', {stats:{재산:-3}},
    ["Late pay and a horse's keep", 'An officer must buy his own horse and uniform. Your pay is three months late, and your horse has begun to go lame.']);
  C('off-men', 'officer', 'good', {...MEN, minRank:1}, '중대원들', '행군 중 쓰러진 병사를 당신 말에 태워 숙영지까지 데려갔습니다. 그 뒤로 중대원들이 당신을 대하는 눈빛이 달라졌습니다.', {stats:{행복:2}, experience:{social:1}},
    ['Your company', 'When a soldier collapsed on the march you put him on your own horse as far as camp. After that your men looked at you differently.']);
  C('cant-barrel', 'officer', 'normal', WOMEN, '브랜디 통', '행군 대열 뒤에서 수레를 끌며 브랜디와 담배, 실과 바늘을 팝니다. 외상 장부에는 병사들 이름이 빼곡합니다.', {stats:{재산:1}, experience:{commerce:1}},
    ['The brandy cask', 'Behind the marching column you pull your cart, selling brandy and tobacco, thread and needles. Your credit book is crowded with soldiers’ names.']);
  C('cant-fire', 'officer', 'bad', WOMEN, '포화 아래', '전투가 벌어지자 물통을 들고 대열 사이를 오가며 부상병에게 물을 먹였습니다. 바로 옆에서 포탄이 떨어졌습니다.', {stats:{건강:-3, 행복:-2}},
    ['Under fire', 'When the battle began you went between the ranks with a water can, giving water to the wounded. A shell landed right beside you.']);

  // ───── 과학자 ─────
  C('sci-paper', 'science', 'good', {minRank:1}, '아카데미 낭독', '당신의 논문이 아카데미 정기 회의에서 낭독되었습니다. 끝나고 노학자 한 사람이 다가와 질문을 세 개 했습니다.', {stats:{행복:3, 지식:2}},
    ['Read at the Academy', 'Your paper was read at a regular session of the Academy. Afterwards an old scholar came up and asked you three questions.']);
  C('sci-error', 'science', 'bad', {}, '계산의 오류', '석 달 매달린 계산에서 첫 장의 부호 하나가 틀린 것을 발견했습니다. 모두 다시 해야 합니다.', {stats:{행복:-2, 지식:1}},
    ['An error in the calculation', 'You found a wrong sign on the first page of a calculation you had worked at for three months. It all has to be done again.']);
  C('sci-instrument', 'science', 'normal', {}, '빌린 기구', '천문대에서 망원경과 진자시계를 빌려 왔습니다. 밤마다 옥상에서 별의 자오선 통과 시각을 적습니다.', {stats:{지식:2, 건강:-1}},
    ['Borrowed instruments', 'You borrowed a telescope and a pendulum clock from the Observatory. Every night on the roof you note the times stars cross the meridian.']);
  C('sci-women', 'science', 'normal', WOMEN, '남의 이름으로', '당신이 한 계산과 번역이 학자의 이름으로 학술지에 실렸습니다. 서문 끝에 “조수의 도움에 감사한다”는 한 줄이 있었습니다.', {stats:{지식:2}, experience:{inequality:1}},
    ["Under another's name", "Your calculations and translations appeared in a journal under the scholar's name. At the end of the preface was one line: “with thanks for an assistant's help”."]);

  // ───── 화가 ─────
  C('art-model', 'art', 'normal', {}, '모델료', '모델을 세울 돈이 없어 거울 앞에서 자기 손과 발을 그렸습니다. 작업실 동료들끼리 번갈아 서 주기로 했습니다.', {stats:{지식:1}},
    ["A model's fee", "With no money for a model you drew your own hands and feet in front of the mirror. The others in the studio agreed to take turns posing."]);
  C('art-sold', 'art', 'good', {}, '팔린 그림', '화상 가게에 맡겨 둔 작은 풍경화가 팔렸습니다. 큰돈은 아니지만 물감과 집세를 치렀습니다.', {stats:{재산:2, 행복:2}},
    ['A picture sold', "The small landscape you left at a dealer's shop has sold. Not much money, but it paid for paint and the rent."]);
  C('art-rejected', 'art', 'bad', {}, '살롱 낙선', '심사위원회가 그림을 돌려보냈습니다. 캔버스 뒤에 낙선을 뜻하는 붉은 R자가 찍혀 있었습니다.', {stats:{행복:-3}},
    ['Rejected by the Salon', 'The jury sent your picture back. On the back of the canvas was stamped the red R that means rejected.']);
  C('art-louvre', 'art', 'normal', {fromYear:1793}, '루브르의 모사', '모사 허가증을 받아 루브르에서 옛 거장의 그림을 베꼈습니다. 구경꾼들이 어깨 너머로 들여다봅니다.', {stats:{지식:2}},
    ['Copying at the Louvre', 'With a copyist’s permit you copied an old master at the Louvre. Onlookers peered over your shoulder.']);

  // ───── 상인·은행가 ─────
  C('trade-bill', 'trade', 'bad', {minRank:1}, '부도난 어음', '받아 둔 어음이 만기일에 부도났습니다. 발행한 상인은 이미 리옹으로 떠났다고 합니다.', {stats:{재산:-3, 행복:-1}},
    ['A dishonoured bill', 'A bill of exchange you held was dishonoured on its due date. The merchant who drew it, they say, has already left for Lyon.']);
  C('trade-fair', 'trade', 'good', {minRank:1}, '보케르 장', '보케르의 큰 장에 가서 남쪽 상인들과 거래를 텄습니다. 돌아오는 짐마차에 올리브유 통이 가득합니다.', {stats:{재산:3}, experience:{commerce:2}},
    ['The Beaucaire fair', 'You went to the great fair at Beaucaire and opened dealings with merchants from the south. The wagon coming home is full of casks of olive oil.']);
  C('trade-clerk', 'trade', 'normal', {}, '계산대 뒤', '하루 종일 계산대 뒤에서 천을 재고 값을 셈했습니다. 주인은 저녁마다 장부의 숫자를 한 줄씩 짚어 봅니다.', {stats:{지식:1}, experience:{commerce:1}},
    ['Behind the counter', "All day behind the counter you measured cloth and reckoned prices. Every evening the master runs his finger down the figures in the ledger, line by line."]);
  C('trade-rail', 'trade', 'good', {fromYear:1846, minRank:2}, '철도 주식', '철도 회사 주식이 한 해 사이에 크게 올랐습니다. 주변에서 너도나도 주식을 사겠다고 합니다.', {stats:{재산:3}},
    ['Railway shares', 'Railway company shares have risen sharply in a year. Everyone around you wants to buy.']);

  // ───── 성직자 ─────
  C('cler-sickcall', 'clergy', 'normal', {}, '종부성사', '한밤중에 불려 가 죽어 가는 노인에게 종부성사를 주었습니다. 진흙길을 등불 하나로 걸었습니다.', {stats:{건강:-1, 행복:1}},
    ['The last rites', 'Called out in the middle of the night, you gave the last rites to a dying old man. You walked the muddy road by the light of one lantern.']);
  C('cler-register', 'clergy', 'normal', {toYear:1792}, '교구 명부', '세례와 혼인과 장례를 교구 명부에 적었습니다. 이 마을 사람들의 일생이 당신 손글씨 속에 있습니다.', {stats:{지식:1}},
    ['The parish register', "You entered baptisms, marriages and burials in the parish register. This village's lives are all in your handwriting."]);
  C('cler-quarrel', 'clergy', 'bad', {minRank:2}, '성당 재산 위원회', '성당 재산 위원들과 종탑 수리비를 두고 다투었습니다. 면장까지 끼어들어 주일 강론이 어색해졌습니다.', {stats:{행복:-2}},
    ['The church council', "You quarrelled with the church council over the cost of mending the bell tower. The mayor joined in, and Sunday's sermon was awkward."]);
  C('cler-feast', 'clergy', 'good', {}, '첫영성체 날', '흰 옷 입은 아이들이 줄지어 제단 앞에 섰습니다. 당신이 세례를 준 아이들입니다.', {stats:{행복:3}},
    ['First Communion day', 'The children in white stood in a line before the altar. You baptised every one of them.']);

  // ───── 수녀 ─────
  C('conv-bell', 'convent', 'normal', {}, '새벽 종', '새벽 다섯 시 종에 일어나 성무일도를 바치고, 낮에는 아이들에게 글을, 저녁에는 병자에게 수프를 날랐습니다.', {stats:{건강:-1, 행복:1}},
    ['The dawn bell', 'You rose at the five o’clock bell for the office, taught children their letters by day, and carried soup to the sick in the evening.']);
  C('conv-girl', 'convent', 'good', {}, '글을 깨친 아이', '고아원에 온 지 한 해 된 여자아이가 처음으로 기도서 한 쪽을 혼자 읽었습니다.', {stats:{행복:3}},
    ['A child who learned to read', 'A girl who came to the orphanage a year ago read a whole page of the prayer book on her own for the first time.']);
  C('conv-epidemic', 'convent', 'bad', {}, '병실의 열병', '병실에 열병이 돌아 자매 둘이 앓아누웠습니다. 당신도 열흘을 버티다 쓰러졌습니다.', {stats:{건강:-4}},
    ['Fever on the ward', 'Fever went round the ward and two sisters fell ill. You held out ten days and then collapsed too.']);

  // ───── 의사·간호 ─────
  C('med-fees', 'medicine', 'bad', MEN, '받지 못한 진료비', '가난한 집 왕진을 다녀왔지만 진료비 대신 달걀 여섯 개를 받았습니다. 이번 달 그런 집이 열 집입니다.', {stats:{재산:-1, 행복:1}},
    ['Fees unpaid', 'You visited a poor household but were paid with six eggs instead of a fee. Ten houses like that this month.']);
  C('med-cure', 'medicine', 'good', {}, '살아난 아이', '크루프로 숨을 몰아쉬던 아이가 사흘 밤을 넘기고 살아났습니다. 아이 어머니가 손에 입을 맞췄습니다.', {stats:{행복:3}},
    ['A child who lived', "A child gasping with croup lived through three nights. The mother kissed your hand."]);
  C('med-dissect', 'medicine', 'normal', MEN, '해부 강의', '병원 해부실에서 새 학생들 앞에서 시범을 보였습니다. 두 명이 쓰러졌고, 한 명은 질문을 멈추지 않았습니다.', {stats:{지식:2}},
    ['The anatomy lesson', 'In the hospital dissecting room you gave a demonstration for the new students. Two fainted, and one would not stop asking questions.']);
  C('med-cholera', 'medicine', 'bad', {fromYear:1832, toYear:1832}, '콜레라', '콜레라가 파리를 덮쳤습니다. 하루에 수백 명이 숨지고, 병원 복도까지 침상이 들어찼습니다. 쉬지 못한 지 열흘째입니다.', {stats:{건강:-4, 지식:2}},
    ['Cholera', 'Cholera has struck Paris. Hundreds die a day, and beds fill even the hospital corridors. You have not rested in ten days.']);
  C('med-nurse', 'medicine', 'normal', WOMEN, '밤 병동', '밤 병동을 돌며 붕대를 갈고 열을 쟀습니다. 젊은 의사는 아침에야 와서 당신이 적은 기록을 읽었습니다.', {stats:{건강:-1, 지식:1}},
    ['The night ward', 'You went round the night ward changing dressings and taking temperatures. The young doctor came only in the morning, and read the notes you had made.']);

  // ───── 공장주 ─────
  C('ind-boiler', 'industry', 'bad', {fromYear:1820}, '멈춘 증기 기관', '증기 기관의 보일러가 새서 공장이 일주일 동안 멈췄습니다. 영국에서 부품이 올 때까지 기다려야 합니다.', {stats:{재산:-3}},
    ['The steam engine stops', 'The boiler of the steam engine sprang a leak and the works stood still for a week. You must wait for parts from England.']);
  C('ind-order', 'industry', 'good', {}, '군납 주문', '군대에서 큰 주문이 들어왔습니다. 석 달 동안 기계를 밤낮으로 돌려야 합니다.', {stats:{재산:3}},
    ['An army order', 'A large order came in from the army. The machines will have to run day and night for three months.']);
  C('ind-children', 'industry', 'normal', {fromYear:1841}, '아동 노동법', '새 법에 따라 여덟 살 미만은 공장에 둘 수 없고, 열두 살까지는 하루 여덟 시간만 일을 시킬 수 있습니다. 감독관이 출석부를 보자고 합니다.', {stats:{재산:-1}, experience:{inequality:1}},
    ['The child labour law', 'Under the new law no child under eight may work in a factory, and none under twelve more than eight hours a day. The inspector asks to see the register.']);
  C('ind-fore', 'industry', 'normal', WOMEN, '여공들의 반장', '여공 하나가 기계에 머리카락이 감겼습니다. 당신이 재빨리 기계를 세웠습니다. 그날부터 모두 머릿수건을 단단히 묶습니다.', {stats:{행복:1}, experience:{social:1}},
    ["The forewoman", "A girl's hair caught in a machine. You stopped it just in time. From that day everyone ties her headscarf tight."]);

  // ───── 관료·우체국 ─────
  C('bur-circular', 'bureau', 'normal', {}, '회람', '장관이 바뀌자 지난달 회람을 뒤집는 새 회람이 내려왔습니다. 서류 백여 장을 다시 써야 합니다.', {stats:{행복:-1}},
    ['A circular', "With a new minister came a new circular reversing last month's. A hundred-odd documents must be written again."]);
  C('bur-promo', 'bureau', 'good', {minRank:1}, '연말 상여금', '국장이 당신의 보고서를 장관실에 그대로 올렸습니다. 연말 상여금이 두둑했습니다.', {stats:{재산:2, 행복:1}},
    ['A year-end bonus', "The head of department sent your report to the minister's office unchanged. The year-end bonus was generous."]);
  C('bur-purge', 'bureau', 'bad', {}, '정권이 바뀌면', '정권이 바뀔 때마다 관청에서 사람이 바뀝니다. 옆자리 동료가 ‘정치적 이유’로 해임되었습니다. 다음은 누구일지 모두 말을 아낍니다.', {stats:{행복:-2}},
    ['When the regime changes', 'Every change of regime means a change of staff. The colleague at the next desk has been dismissed for ‘political reasons’. Everyone is careful of what they say about who will be next.']);
  C('bur-post', 'bureau', 'normal', {...WOMEN, fromYear:1831}, '우체국 창구', '편지를 부치러 온 노인이 주소를 써 달라고 했습니다. 아들은 알제리에 있다고 합니다.', {stats:{행복:1}},
    ['The post office counter', 'An old man who came to post a letter asked you to write the address. His son is in Algeria, he said.']);

  // ───── 교사 ─────
  C('teach-inspector', 'teaching', 'normal', {fromYear:1835}, '장학관', '장학관이 예고 없이 들이닥쳐 아이들에게 받아쓰기와 셈을 시켰습니다. 맨 뒷줄 아이가 정답을 말했습니다.', {stats:{행복:1}},
    ['The inspector', 'The schools inspector arrived unannounced and set the children dictation and sums. The child in the back row gave the right answer.']);
  C('teach-firewood', 'teaching', 'bad', {}, '땔감 없는 교실', '코뮌이 약속한 땔감이 오지 않아 아이들이 외투를 입고 장갑을 낀 채 글씨를 씁니다. 잉크가 얼었습니다.', {stats:{건강:-1, 행복:-1}},
    ['A classroom without firewood', "The firewood the commune promised has not come, so the children write in coats and mittens. The ink has frozen."]);
  C('teach-harvest', 'teaching', 'normal', {}, '빈 의자', '수확 철이 되자 교실의 절반이 비었습니다. 아이들은 들에서 이삭을 줍습니다.', {},
    ['Empty benches', 'At harvest time half the classroom is empty. The children are out in the fields gleaning.']);
  C('teach-pupil', 'teaching', 'good', {}, '옛 제자', '옛 제자가 교사 자격시험에 합격했다며 인사를 왔습니다.', {stats:{행복:3}},
    ['A former pupil', 'A former pupil came to tell you they had passed the teachers’ examination.']);

  // ───── 배우 ─────
  C('thea-whistle', 'theatre', 'bad', {}, '휘파람', '첫날 공연에서 일층 입석 관객들이 휘파람을 불었습니다. 극장주는 사흘 만에 공연을 내렸습니다.', {stats:{행복:-3}},
    ['Whistled off', 'On the first night the pit whistled. The manager took the play off after three days.']);
  C('thea-tour', 'theatre', 'normal', {}, '순회 공연', '짐마차에 무대 장치를 싣고 열흘 동안 소도시 다섯 곳을 돌았습니다. 무대는 대개 여관 마당입니다.', {stats:{건강:-1}, experience:{social:1}},
    ['On tour', 'With the scenery loaded on a wagon you played five small towns in ten days. The stage is usually an inn yard.']);
  C('thea-burial', 'theatre', 'bad', {toYear:1849}, '배우의 무덤', '동료 배우가 세상을 떠났지만 본당 신부는 교회 묘지에 묻을 수 없다고 했습니다. 배우는 파문된 직업이라는 것입니다.', {stats:{행복:-3}, experience:{inequality:1}},
    ["An actor's grave", 'A fellow actor has died, but the parish priest said he could not be buried in the churchyard. Actors are an excommunicated trade.']);
  C('thea-applause', 'theatre', 'good', {minRank:1}, '커튼콜', '막이 내리자 관객이 일어서서 당신 이름을 불렀습니다. 분장실 문 앞에 꽃다발이 쌓였습니다.', {stats:{행복:4}},
    ['A curtain call', 'When the curtain fell the audience rose and called your name. Bouquets piled up outside your dressing-room door.']);

  // ───── 살롱 ─────
  C('salon-guest', 'salon', 'good', {}, '귀한 손님', '오래 초대하고 싶던 작가가 처음으로 응접실에 왔습니다. 자정이 넘도록 대화가 이어졌습니다.', {stats:{행복:3, 지식:1}},
    ['A prized guest', 'A writer you had long wished to invite came to your drawing room for the first time. The talk went on past midnight.']);
  C('salon-gossip', 'salon', 'bad', {}, '소문', '지난주 살롱에서 오간 말이 신문 가십난에 실렸습니다. 누가 옮겼는지 모두를 의심하게 됩니다.', {stats:{행복:-2}},
    ['Gossip', "What was said in your salon last week appeared in a newspaper's gossip column. You find yourself suspecting everyone."]);
  C('salon-bill', 'salon', 'bad', {}, '촛불과 얼음 값', '손님 마흔 명에게 낼 촛불과 얼음, 과자 값 청구서가 왔습니다. 살롱은 돈이 드는 일입니다.', {stats:{재산:-3}},
    ['Candles and ice', 'The bill came for the candles, ice and pastries for forty guests. A salon is an expensive business.']);

  // ───── 작가 ─────
  C('let-review', 'letters', 'bad', {}, '혹평', '신문 비평가가 당신 책을 두 문단으로 깎아내렸습니다. 서점 주인은 남은 부수를 돌려보내겠다고 합니다.', {stats:{행복:-3}},
    ['A savage review', 'A newspaper critic demolished your book in two paragraphs. The bookseller says he will send back the unsold copies.']);
  C('let-serial', 'letters', 'good', {fromYear:1836}, '연재소설', '신문사가 당신 소설을 아래쪽 연재란에 싣자고 합니다. 한 회 원고료로 한 달 집세를 냅니다.', {stats:{재산:3, 행복:2}},
    ['A serial', "A newspaper wants to run your novel in the serial column at the foot of the page. One instalment's fee pays a month's rent."]);
  C('let-blank', 'letters', 'normal', {}, '빈 종이', '석 달째 한 쪽도 나아가지 못했습니다. 책상 위 종이는 하얗고, 잉크병은 말라 갑니다.', {stats:{행복:-1}},
    ['The blank page', 'For three months you have not got one page further. The paper on the desk is white and the inkwell is drying.']);

  // ───── 산파 ─────
  C('mid-twins', 'midwife', 'good', {}, '쌍둥이', '한 밤에 쌍둥이를 받았습니다. 둘 다 울음소리가 우렁찹니다. 아버지는 이름을 하나밖에 준비하지 않았습니다.', {stats:{행복:3}},
    ['Twins', 'In one night you delivered twins. Both have a lusty cry. The father had only one name ready.']);
  C('mid-lost', 'midwife', 'bad', {}, '잃은 산모', '긴 난산 끝에 아이는 살렸지만 산모는 피를 멈추지 못했습니다. 돌아오는 길에 한참을 길가에 앉아 있었습니다.', {stats:{행복:-4}},
    ['A mother lost', 'After a long, hard labour you saved the child, but the bleeding would not stop for the mother. On the way home you sat at the roadside for a long time.']);
  C('mid-baptism', 'midwife', 'normal', {}, '긴급 세례', '아이가 숨을 쉬지 않아 신부를 기다릴 새도 없이 당신이 긴급 세례를 주었습니다. 산파에게 허락된 일입니다. 아이는 그 뒤에 울었습니다.', {stats:{행복:1}},
    ['An emergency baptism', 'The baby was not breathing, and with no time to wait for the priest you baptised it yourself, as a midwife may. Then the baby cried.']);

  // ───── 의상실 ─────
  C('modes-ball', 'modes', 'good', {}, '무도회 철', '무도회 철이라 주문이 밀려듭니다. 밤새 바늘을 놀린 드레스가 오늘 밤 시청 무도회에 나갑니다.', {stats:{재산:2}},
    ['Ball season', 'It is the ball season and orders pour in. The gown you sewed all night goes to the ball at the town hall tonight.']);
  C('modes-eyes', 'modes', 'bad', {minAge:35}, '흐려지는 눈', '등잔 밑에서 바느질한 세월에 눈이 흐려졌습니다. 바늘귀에 실을 꿰는 데 한참 걸립니다.', {stats:{건강:-2}},
    ['Failing eyes', 'Years of sewing by lamplight have dimmed your eyes. Threading a needle takes a long time now.']);
  C('modes-fashion', 'modes', 'normal', {}, '새 유행', '파리에서 온 패션 판화를 보고 소매 모양을 다 바꿨습니다. 지난 계절 옷은 아무도 입지 않습니다.', {experience:{craft:1}},
    ['A new fashion', 'Seeing the fashion plates from Paris, you changed the cut of every sleeve. No one will wear last season’s clothes.']);

  // ───── 선원·어시장 ─────
  C('sea-storm', 'sea', 'bad', MEN, '비스케이만의 폭풍', '비스케이만에서 폭풍을 만나 돛대 하나가 부러졌습니다. 사흘 밤을 펌프에 매달려 물을 퍼냈습니다.', {stats:{건강:-3}},
    ['A storm in the Bay of Biscay', 'A storm in the Bay of Biscay snapped a mast. For three nights you worked the pumps.']);
  C('sea-port', 'sea', 'good', MEN, '먼 항구', '처음 보는 항구에 닻을 내렸습니다. 시장에서 앵무새와 향신료를 보았고, 고향에 가져갈 조개 껍데기를 샀습니다.', {stats:{행복:3}, experience:{curiosity:1}},
    ['A distant port', 'You dropped anchor in a port you had never seen. In the market you saw parrots and spices, and bought shells to take home.']);
  C('sea-scurvy', 'sea', 'bad', MEN, '괴혈병', '긴 항해에 잇몸이 붓고 이가 흔들렸습니다. 항구에서 레몬을 사 먹고서야 나았습니다.', {stats:{건강:-3}},
    ['Scurvy', 'On the long voyage your gums swelled and your teeth loosened. Only lemons bought in port cured it.']);
  C('sea-nets', 'sea', 'normal', WOMEN, '그물 수선', '부두에 앉아 찢어진 그물을 기웠습니다. 남편들의 배가 돌아오는 시각이면 모두 고개를 들어 바다를 봅니다.', {stats:{행복:1}},
    ['Mending nets', 'You sat on the quay mending torn nets. At the hour the boats come home, everyone looks up at the sea.']);
  C('sea-widow', 'sea', 'bad', WOMEN, '돌아오지 않은 배', '폭풍 뒤에 배 한 척이 돌아오지 않았습니다. 어시장 여자들이 그 집 과부를 위해 돈을 걷었습니다.', {stats:{행복:-3}},
    ['A boat that did not come back', "After the storm one boat did not come back. The women of the fish market took up a collection for the widow."]);

  // ───── 토목 기사 ─────
  C('eng-bridge', 'engineering', 'good', {minRank:1}, '다리 개통', '당신이 설계를 맡은 다리가 개통했습니다. 면장이 테이프를 끊고, 마차가 처음으로 강을 건넜습니다.', {stats:{행복:4}},
    ['A bridge opens', 'The bridge you designed has opened. The mayor cut the ribbon and the first carriage crossed the river.']);
  C('eng-survey', 'engineering', 'normal', {}, '측량', '삼각대와 사슬을 메고 일주일 동안 계곡을 걸으며 높이를 쟀습니다. 밭주인들이 말뚝을 뽑지 말라고 소리쳤습니다.', {stats:{건강:-1, 지식:1}},
    ['Surveying', 'With tripod and chain you walked the valley for a week taking levels. Farmers shouted at you not to pull up their stakes.']);
  C('eng-flood', 'engineering', 'bad', {}, '무너진 둑', '봄 홍수에 공사 중이던 둑이 무너졌습니다. 조사 위원회가 당신의 계산을 다시 들여다봅니다.', {stats:{행복:-3}},
    ['The embankment gives way', 'The spring flood washed away the embankment under construction. A commission of inquiry is going over your calculations.']);

  // ───── 경찰·간수 ─────
  C('pol-report', 'police', 'normal', MEN, '보고서', '밤새 순찰한 내용을 아침에 보고서로 썼습니다. 술주정 둘, 길 잃은 아이 하나, 수상한 집회 없음.', {stats:{지식:1}},
    ['The report', 'In the morning you wrote up the night patrol: two drunks, one lost child, no suspicious gatherings.']);
  C('pol-thanks', 'police', 'good', MEN, '돌려준 지갑', '도둑맞은 지갑을 찾아 주인에게 돌려주었습니다. 노부인이 경찰서까지 과자를 들고 찾아왔습니다.', {stats:{행복:2}},
    ['A purse returned', 'You found a stolen purse and returned it to its owner. The old lady came to the station with a box of pastries.']);
  C('pol-hated', 'police', 'bad', {}, '눈총', '시장 골목을 지나가면 사람들이 말을 멈춥니다. 아이들이 등 뒤에서 ‘끄나풀’이라고 외쳤습니다.', {stats:{행복:-2}},
    ['Hostile looks', 'When you walk through the market lanes, people stop talking. Children shouted ‘nark’ behind your back.']);
  C('pol-prison', 'police', 'normal', WOMEN, '감옥의 아이', '수감된 여자가 감옥에서 아이를 낳았습니다. 담요와 우유를 구하느라 하루를 다 썼습니다.', {stats:{행복:1}},
    ['A child in prison', 'A woman prisoner gave birth in the prison. You spent the whole day finding blankets and milk.']);
})();
