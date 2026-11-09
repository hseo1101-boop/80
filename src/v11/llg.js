// src/llg.js — Louis-le-Grand (루이르그랑)
// The great Paris boarding school on the rue Saint-Jacques. Bourgeois and noble boys are offered a place at ten;
// a commoner's son who can read may sit for a scholarship (bourse) if his knowledge is high enough, as the
// Arras orphan Maximilien de Robespierre and the Guise lawyer's son Camille Desmoulins did. Boys born before
// 1790 enter the 콜레주 루이르그랑; boys born in 1790 or later, the 리세 루이르그랑.
// A boy born 1756–1764 who is there in the 1770s meets Robespierre (there 1769–1781) and Desmoulins (from
// 1771). The friendship then runs on: the king's visit of 1775, the leaving of 1781, Robespierre a deputy in
// 1789, Camille on the Palais-Royal table, Camille's wedding in 1790, the quarrel over Le Vieux Cordelier,
// Camille's arrest in March 1794, Horace afterwards, and the memory in old age. Friends also get their own
// choices in the Bastille, the Jacobin Club and Camille's newspaper.
// English sits beside the Korean and goes straight into the translation table.
const LLG_FRIENDS = ['robespierre', 'desmoulins'];
const llgName = s => s.born >= 1790 ? '리세 루이르그랑' : '콜레주 루이르그랑';
const llgFriend = (s, id) => !!s.flags?.['llg-' + id];
const llgAlive = (s, id) => { const f = FIGURES[id]; return llgFriend(s, id) && s.relations.some(r => r.name === f.name && r.alive); };
function applyLlgEffects(s, e) {
  if (!e) return;
  if (e.llgEnter) {
    const name = llgName(s);
    s.familyEvents.llg = s.year; s.familyEvents.eliteSchool = s.year;
    if (e.llgEnter === 'bourse') s.familyEvents.llgBourse = true;
    s.education = name; s.literacy = 'basic'; s.paths.learning = 'study';
    changeStats(s, {지식:8});
    milestone(s, `${name} 입학`);
    if (s.year >= 1793 && s.year <= 1799) addLog(s, '학교', '혁명 정부는 이 학교를 ‘평등 콜레주(콜레주 에갈리테)’라고 부릅니다. 파리의 옛 콜레주 가운데 문을 닫지 않은 거의 유일한 학교입니다.', 'normal');
  }
  for (const id of e.llgFriend || []) {
    addFigure(s, id);
    const r = s.relations.find(x => x.name === FIGURES[id].name); if (r) r.closeness = 80;
    s.flags['llg-' + id] = true;
    s.familyEvents.llgFriendYear = s.year;
  }
}

(() => {
  const T = (ko, en) => { if (en) { EN[ko] = en; EN[ko.trim()] = en.trim(); } return ko; };
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});
  const NEVER = {minAge:200}; // opened by llgYear / llgMonth, never drawn at random
  const D = (id, domain, title, text, choices) => decisions.push({id, domain, priority:0, title, text, when:{...NEVER}, choices});
  const ELITE = {classes:['부르주아', '귀족']}, COMMON = {classes:['농민', '도시 평민']};

  // ───── 입학 ─────
  for (const [id, name, enName, text, enText] of [
    ['llg-entry', '콜레주 루이르그랑', 'the Collège Louis-le-Grand',
      '생자크 거리의 콜레주 루이르그랑은 파리에서 가장 이름난 학교입니다. 기숙생 수백 명이 새벽 다섯 시 종에 일어나 라틴어와 수사학을 배우고, 집안은 가난하지만 성적이 뛰어난 장학생들도 함께 공부합니다. 그곳의 기숙생이 될 수 있을지 집안에서 이야기가 오갑니다.',
      'The Collège Louis-le-Grand on the rue Saint-Jacques is the most famous school in Paris. Hundreds of boarders rise at the five o’clock bell to study Latin and rhetoric, and scholarship boys from poor families study beside them. At home there is talk of whether you might become a boarder there.'],
    ['llg-entry-lycee', '리세 루이르그랑', 'the Lycée Louis-le-Grand',
      '생자크 거리의 리세 루이르그랑은 파리에서 가장 이름난 학교입니다. 기숙생들은 북소리에 일어나 제복을 입고, 라틴어 작문과 수학으로 하루를 보냅니다. 나라가 주는 장학생 자리도 있습니다. 그곳의 기숙생이 될 수 있을지 집안에서 이야기가 오갑니다.',
      'The Lycée Louis-le-Grand on the rue Saint-Jacques is the most famous school in Paris. Its boarders rise to the drum, put on uniform, and spend the day on Latin composition and mathematics. There are state scholarships too. At home there is talk of whether you might become a boarder there.']]) {
    T(name, enName.replace(/^the /, '')); T(`${name} 입학`, `Entered ${enName}`);
    D(id, 'education', T(`${name}에 갈까?`, `Go to ${enName}?`), T(text, enText), [
      {label:T(`${name}의 기숙생이 된다`, `Become a boarder at ${enName}`), preview:T('파리의 명문 / 학비', 'The great Paris school / the fees'), when:ELITE,
        result:T(`부모님이 학비와 기숙비를 치르고 당신을 ${name}에 보냈습니다. 낡은 예배당 옆 기숙사에서 첫 밤을 보냈습니다.`, `Your parents paid the fees and board and sent you to ${enName}. You spent your first night in the dormitory beside the old chapel.`),
        effects:{stats:{재산:-6, 행복:1}, llgEnter:true}},
      {label:T('본당 신부의 추천장으로 장학생 시험을 본다', 'Sit the scholarship examination with the parish priest’s letter'), preview:T('장학생 합격 / 낙방', 'A scholarship / not this time'),
        when:COMMON, requires:{minKnowledge:65, literacy:true}, outcomes:[
          O('pass', T('장학생으로 뽑혔습니다', 'You won a scholarship'), 60, T(`라틴어 번역 시험을 치르고 ${name}의 장학생 자리를 얻었습니다. 학비도 기숙비도 내지 않습니다. 짐 보따리 하나를 들고 생자크 거리로 갔습니다.`, `You sat the Latin translation paper and won a scholarship place at ${enName}. No fees, no board to pay. You went to the rue Saint-Jacques with a single bundle.`), {llgEnter:'bourse', stats:{행복:4}}),
          O('fail', T('이번에는 자리가 없었습니다', 'There was no place this time'), 40, T('시험은 잘 봤지만 장학생 자리는 더 힘 있는 집안의 추천을 받은 아이에게 돌아갔습니다.', 'You did well in the examination, but the scholarship went to a boy recommended by a more powerful family.'), {stats:{행복:-3}})]},
      {label:T('집 가까운 학교에 다닌다', 'Go to a school nearer home'), when:ELITE, result:T('먼 파리 대신 가까운 콜레주에 다니기로 했습니다.', 'You decided on a collège nearer home rather than distant Paris.'), effects:{}},
      {label:T('지금처럼 지낸다', 'Carry on as you are'), when:COMMON, result:T('파리의 학교는 먼 이야기로 남았습니다.', 'The Paris school remained a distant story.'), effects:{}}]);
  }

  // ───── 동창 ─────
  D('llg-friends', 'education', T('같은 기숙사의 두 소년', 'Two boys in the same dormitory'),
    T('같은 기숙사에 아라스에서 온 장학생 막시밀리앵이 있습니다. 옷은 낡았지만 늘 단정하고, 라틴어 작문으로 상을 놓치지 않습니다. 그보다 두 살 아래인 피카르디 기즈 출신의 카미유는 말을 더듬지만, 입을 열면 교실이 웃음바다가 됩니다. 성격이 정반대인 둘이 늘 붙어 다닙니다.',
      'In your dormitory there is a scholarship boy from Arras called Maximilien. His clothes are worn but always neat, and he never misses a prize for Latin composition. Two years younger, Camille, from Guise in Picardy, stammers, but when he speaks the classroom roars with laughter. The two could not be more different, yet they are always together.'), [
    {label:T('두 사람과 어울린다', 'Fall in with both of them'), result:T('저녁 자습 시간마다 셋이 키케로와 루소를 두고 속삭였습니다. 사감에게 들켜 함께 벌을 섰습니다.', 'Every evening at prep the three of you whispered about Cicero and Rousseau. The master caught you, and you were punished together.'),
      effects:{stats:{행복:3, 지식:2}, llgFriend:['robespierre', 'desmoulins'], milestone:'루이르그랑에서 로베스피에르, 데물랭과 친구가 됨'}},
    {label:T('막시밀리앵과 함께 공부한다', 'Study with Maximilien'), result:T('그는 말수가 적지만, 당신의 라틴어 작문을 한 줄씩 고쳐 주었습니다. “글은 생각보다 정직해야 하네.”', 'He says little, but he went through your Latin composition line by line. “Writing must be more honest than thought.”'),
      effects:{stats:{지식:3}, llgFriend:['robespierre']}},
    {label:T('카미유와 어울려 다닌다', 'Go about with Camille'), result:T('카미유와 뤽상부르 정원을 쏘다니고, 몰래 연극을 보러 갔습니다. 그는 언젠가 세상을 뒤흔들 글을 쓰겠다고 했습니다.', 'You roamed the Luxembourg gardens with Camille and slipped off to the theatre. One day, he said, he would write something that shook the world.'),
      effects:{stats:{행복:3}, llgFriend:['desmoulins']}},
    {label:T('공부에만 매달린다', 'Keep to your books'), result:T('둘과는 인사만 나누는 사이로 지냈습니다.', 'With those two you only ever exchanged greetings.'), effects:{stats:{지식:2}}}]);
  T('루이르그랑에서 로베스피에르, 데물랭과 친구가 됨', 'Became friends with Robespierre and Desmoulins at Louis-le-Grand');

  // ───── 1793–94: 「늙은 코르들리에」와 체포 ─────
  D('llg-vieux', 'politics', T('갈라지는 옛 동창', 'Old schoolfellows falling apart'),
    T('카미유의 새 신문 「늙은 코르들리에」가 공포정치를 멈추고 관용 위원회를 만들자고 합니다. 자코뱅 클럽에서 막시밀리앵은 “이 신문은 불태워야 한다”고 말했고, 카미유는 “불태우는 것은 대답이 아니다”라고 받아쳤습니다. 루이르그랑의 두 친구 사이에 금이 가고 있습니다.',
      'Camille’s new paper, Le Vieux Cordelier, calls for an end to the Terror and a committee of clemency. At the Jacobin Club Maximilien said the paper should be burned, and Camille shot back, “Burning is not answering.” A crack is opening between your two friends from Louis-le-Grand.'), [
    {label:T('막시밀리앵을 찾아가 카미유를 감싼다', 'Go to Maximilien and speak up for Camille'), when:{flagSet:'llg-robespierre'}, preview:T('들어 줌 / 의심받음', 'He listens / you are suspected'), outcomes:[
      O('heard', T('그는 끝까지 들었습니다', 'He heard you out'), 70, T('생토노레 거리 목수 뒤플레의 집, 막시밀리앵의 작은 방. 그는 끝까지 듣고 나서 말했습니다. “카미유는 아이 같네. 하지만 지금은 아이 장난을 할 때가 아니야.”', 'In Maximilien’s small room in the carpenter Duplay’s house on the rue Saint-Honoré, he heard you out and then said, “Camille is like a child. But this is no time for a child’s games.”'), {stats:{행복:-1}}),
      O('noted', T('구역 위원회가 당신 이름을 적었습니다', 'The section committee took down your name'), 30, T('며칠 뒤 구역 감시위원회 사람이 찾아와 당신이 누구와 어울리는지 물었습니다.', 'A few days later a man from the section’s watch committee came asking whom you associated with.'), {stats:{행복:-4, 건강:-1}})]},
    {label:T('카미유에게 몸을 사리라고 당부한다', 'Beg Camille to be careful'), when:{flagSet:'llg-desmoulins'},
      result:T('카미유는 웃으며 말했습니다. “나는 너무 오래 침묵했네. 이제 와서 입을 다물 수는 없어.”', 'Camille laughed. “I kept silent too long. I cannot hold my tongue now.”'), effects:{stats:{행복:-2}}},
    {label:T('둘 사이에 끼지 않는다', 'Stay out of it'), result:T('두 사람 모두에게서 조용히 멀어졌습니다.', 'You quietly drifted away from both of them.'), effects:{}}]);
  D('llg-plea', 'politics', T('카미유가 체포되었다', 'Camille has been arrested'),
    T('3월 31일 새벽, 카미유가 당통과 함께 체포되었습니다. 혁명 재판소는 며칠이면 판결을 내립니다. 뤼실은 남편을 살려 달라는 편지를 쓰고 있습니다. 생토노레 거리에는 막시밀리앵이 있습니다.',
      'At dawn on 31 March Camille was arrested with Danton. The Revolutionary Tribunal will give its verdict within days. Lucile is writing letters begging for her husband’s life. On the rue Saint-Honoré is Maximilien.'), [
    {label:T('뒤플레의 집으로 막시밀리앵을 찾아간다', 'Go to Duplay’s house to see Maximilien'), when:{flagSet:'llg-robespierre'}, preview:T('문전박대 / 침묵 / 의심', 'Turned away / silence / suspicion'), outcomes:[
      O('door', T('문은 열리지 않았습니다', 'The door did not open'), 60, T('목수 뒤플레가 문간에서 고개를 저었습니다. “시민 로베스피에르는 아무도 만나지 않소.”', 'The carpenter Duplay shook his head in the doorway. “Citizen Robespierre is seeing no one.”'), {stats:{행복:-4}}),
      O('silent', T('그는 창밖만 보았습니다', 'He only looked out of the window'), 30, T('그는 당신을 들였지만 창밖만 보았습니다. 한참 뒤에 한마디만 했습니다. “공화국이 먼저일세.”', 'He let you in but only looked out of the window. After a long time he said one thing. “The Republic comes first.”'), {stats:{행복:-5}}),
      O('suspect', T('당신도 혐의를 받았습니다', 'You came under suspicion yourself'), 10, T('이튿날 구역 감시위원회가 당신을 불러 데물랭과의 관계를 캐물었습니다. 몇 주 동안 집에 갇혀 지냈습니다.', 'The next day the section’s watch committee summoned you and questioned you about Desmoulins. For weeks you were confined to your house.'), {stats:{행복:-6, 건강:-3}})]},
    {label:T('뤼실의 곁을 지킨다', 'Stay by Lucile’s side'), result:T('뤼실은 막시밀리앵에게 보낼 편지를 쓰다 말고 울었습니다. 며칠 뒤 그녀도 체포되었습니다.', 'Lucile wept as she broke off a letter to Maximilien. A few days later she too was arrested.'), effects:{stats:{행복:-4}}},
    {label:T('덧문을 닫고 집에 머문다', 'Close the shutters and stay home'), result:T('아무 데도 가지 않았습니다. 그 며칠을 평생 잊지 못했습니다.', 'You went nowhere. You never forgot those days.'), effects:{stats:{행복:-3}}}]);

  // ───── 기존 장면에 동창의 선택지 ─────
  const dc = id => decisions.find(d => d.id === id);
  const friendChoice = (id, generic, flag, choice) => {
    const d = dc(id); if (!d) return;
    const g = d.choices.find(c => c.label === generic); if (g) g.when = {...(g.when || {}), unsetFlag:flag};
    d.choices.splice(g ? d.choices.indexOf(g) + 1 : 0, 0, {...choice, when:{...(choice.when || {}), flagSet:flag}});
  };
  for (const id of ['bastille', 'bastille-bourgeois']) {
    const d = dc(id), go = d?.choices.find(c => /바스티유로 간다|요새로 간다/.test(c.label) && !c.when?.sceneRole);
    if (!go) continue;
    d.choices.splice(d.choices.indexOf(go) + 1, 0, {label:T('카미유를 찾아 군중 속으로 간다', 'Go into the crowd to find Camille'), preview:go.preview,
      when:{...(go.when || {}), flagSet:'llg-desmoulins'}, effects:go.effects,
      outcomes:go.outcomes.map(o => o.id === 'killed' || /쓰러|돌아오지/.test(o.title) ? o : {...o, result:o.result + T(' 군중 속에서 모자에 초록 잎을 꽂은 카미유와 눈이 마주쳤습니다.', ' In the crowd you caught the eye of Camille, a green leaf in his hat.')})});
  }
  friendChoice('jacobins', '회원으로 가입한다', 'llg-robespierre', {label:T('옛 동창을 따라 회원으로 가입한다', 'Join, following your old schoolfellow'),
    result:T('연단에서 내려온 막시밀리앵이 당신을 알아보았습니다. “루이르그랑의 자네로군.” 그는 여전히 분을 바른 가발에 단정한 조끼 차림이었습니다.', 'Coming down from the rostrum, Maximilien recognised you. “You — from Louis-le-Grand.” He still wore a powdered wig and a neat waistcoat.'),
    effects:{figure:'robespierre', rep:6, path:{politics:'engaged'}}});
  friendChoice('desmoulins-paper', '글을 보낸다', 'llg-desmoulins', {label:T('옛 동창의 신문에 글을 보낸다', 'Write for your old schoolfellow’s paper'),
    result:T('카미유가 원고를 받자마자 껴안았습니다. “기숙사에서 한 약속을 기억하나? 세상을 뒤흔들 글 말일세.” 당신의 글이 그의 신문에 실렸습니다.', 'Camille hugged you the moment he had the manuscript. “Remember what we promised in the dormitory? Writing that shakes the world.” Your piece appeared in his paper.'),
    effects:{figure:'desmoulins', rep:9, promote:true}});

  // ───── 날짜가 정해진 소식(기록) ─────
  // [year, month, need, title, text(Paris), text(elsewhere), type]
  globalThis.LLG_NEWS = [
    [1775, 6, s => llgFriend(s, 'robespierre') && s.year - s.familyEvents.llg <= 9, T('빗속의 축사', 'An address in the rain'),
      T('대관식을 마치고 돌아오는 루이 16세가 학교 앞을 지났습니다. 장학생 대표로 뽑힌 막시밀리앵이 빗속에 무릎을 꿇고 라틴어 축사를 읽었습니다. 왕의 마차는 서지 않았습니다. 그날 밤 그는 아무 말도 하지 않았습니다.',
        'Louis XVI, returning from his coronation, passed in front of the school. Maximilien, chosen to speak for the scholarship boys, knelt in the rain and read a Latin address. The royal carriage did not stop. That night he said nothing at all.'), null, 'normal'],
    [1781, 7, s => llgAlive(s, 'robespierre'), T('아라스로 돌아가는 친구', 'A friend goes home to Arras'),
      T('막시밀리앵이 법학 공부를 마치고 아라스로 돌아갑니다. 학교는 모범 장학생인 그에게 상금 600리브르를 내렸습니다. 떠나는 날 그는 편지하겠다고 약속했습니다.',
        'Maximilien has finished his law studies and is going home to Arras. The school gave him a prize of 600 livres as a model scholar. On the day he left he promised to write.'), null, 'normal'],
    [1785, 6, s => llgAlive(s, 'desmoulins'), T('말을 더듬는 변호사', 'A lawyer who stammers'),
      T('카미유가 파리 고등법원의 변호사가 되었습니다. 그러나 말을 더듬는 그에게 의뢰인은 거의 없습니다. 팔레루아얄의 카페에서 시를 쓰며 시간을 보냅니다.',
        'Camille has become an advocate at the Parlement of Paris. But few clients come to a stammering lawyer. He spends his time writing verse in the cafés of the Palais-Royal.'), null, 'normal'],
    [1789, 5, s => llgAlive(s, 'robespierre'), T('삼부회의 옛 동창', 'An old schoolfellow at the Estates-General'),
      T('아르투아의 제3신분 대표로 뽑힌 막시밀리앵이 베르사유에 왔습니다. 하숙방을 찾아가니 그는 연설문을 몇 번이고 고쳐 쓰고 있었습니다. “이번에는 왕이 마차를 세워야 할 걸세.”',
        'Maximilien, elected for the Third Estate of Artois, has come to Versailles. When you visited his lodgings he was rewriting his speech yet again. “This time the king will have to stop his carriage.”'),
      T('아라스에서 편지가 왔습니다. 막시밀리앵이 아르투아의 제3신분 대표로 뽑혀 삼부회에 간다고 합니다.', 'A letter came from Arras. Maximilien has been elected for the Third Estate of Artois and is going to the Estates-General.'), 'good'],
    [1789, 7, s => llgAlive(s, 'desmoulins'), T('팔레루아얄의 탁자 위', 'On a table at the Palais-Royal'),
      T('12일 오후, 팔레루아얄의 카페 드 푸아 앞 탁자 위에서 카미유가 권총을 흔들며 외쳤습니다. “무기를 들라!” 늘 더듬던 그가 그날은 한 번도 더듬지 않았습니다. 군중은 나뭇잎을 따서 모자에 꽂았습니다.',
        'On the afternoon of the 12th, standing on a table outside the Café de Foy at the Palais-Royal, Camille waved a pistol and cried, “To arms!” He always stammered; that day he did not stammer once. The crowd plucked leaves and stuck them in their hats.'),
      T('파리에서 소식이 왔습니다. 팔레루아얄에서 군중에게 무기를 들라고 외친 젊은 변호사가 카미유라고 합니다.', 'News came from Paris: the young lawyer who cried “To arms!” to the crowd at the Palais-Royal was Camille.'), 'good'],
    [1790, 12, s => llgAlive(s, 'desmoulins'), T('카미유의 혼례', 'Camille’s wedding'),
      T('29일, 생쉴피스 성당에서 카미유가 뤼실 뒤플레시와 혼인했습니다. 증인석에는 막시밀리앵도 서 있었습니다. 카미유는 미사 내내 울었습니다.',
        'On the 29th, at Saint-Sulpice, Camille married Lucile Duplessis. Maximilien stood among the witnesses. Camille wept all through the Mass.'),
      T('카미유가 생쉴피스 성당에서 뤼실과 혼인했다는 편지가 왔습니다. 증인 가운데 막시밀리앵의 이름도 있었습니다.', 'A letter came: Camille has married Lucile at Saint-Sulpice. Maximilien’s name was among the witnesses.'), 'good'],
    [1794, 4, s => llgFriend(s, 'desmoulins'), T('수레 위의 카미유', 'Camille on the cart'),
      T('단두대로 가는 수레 위에서 카미유는 뤼실의 머리카락을 쥐고 몸부림치며 군중에게 외쳤다고 합니다. 기숙사에서 세상을 뒤흔들 글을 쓰겠다던 그 소년이었습니다.',
        'On the cart to the scaffold, they say, Camille struggled and cried out to the crowd, clutching a lock of Lucile’s hair. He was the boy in the dormitory who would write something to shake the world.'), null, 'bad'],
    [1794, 7, s => llgFriend(s, 'robespierre'), T('빗속의 소년', 'The boy in the rain'),
      T('혁명 광장에 모인 군중이 환호하는 동안, 당신은 열아홉 해 전 빗속에 무릎을 꿇고 왕에게 라틴어 축사를 읽던 장학생을 떠올렸습니다.',
        'While the crowd in the Place de la Révolution cheered, you thought of the scholarship boy who knelt in the rain nineteen years ago to read a Latin address to the king.'), null, 'bad'],
    [1796, 5, s => llgFriend(s, 'desmoulins'), T('카미유의 아들', 'Camille’s son'),
      T('부르라렌의 뒤플레시 부인 댁에서 카미유와 뤼실의 아들 오라스를 만났습니다. 아버지를 꼭 닮은 눈으로 당신을 올려다보았습니다. 외할머니가 홀로 그 아이를 키웁니다.',
        'At Madame Duplessis’s house in Bourg-la-Reine you met Horace, Camille and Lucile’s son. He looked up at you with his father’s eyes. His grandmother is raising him alone.'),
      T('카미유와 뤼실의 아들 오라스가 부르라렌의 외할머니 손에서 자란다는 소식을 들었습니다. 작은 돈을 부쳤습니다.', 'You heard that Horace, Camille and Lucile’s son, is being raised by his grandmother at Bourg-la-Reine. You sent a little money.'), 'normal']];
})();

// Yearly: the entrance and the meeting.
function llgYear(s) {
  if (s.dead || s.decision || s.sex !== '남성' || s.familyEvents.real) return;
  const age = ageOf(s), fe = s.familyEvents;
  if (!fe.llgOffered && age >= 10 && age <= 12) {
    const elite = ['부르주아', '귀족'].includes(s.class);
    if (elite || (literacyOf(s) === 'basic' && random(s) < .6)) {
      fe.llgOffered = s.year;
      if (elite || ['농민', '도시 평민'].includes(s.class)) { s.decision = s.born >= 1790 ? 'llg-entry-lycee' : 'llg-entry'; s.lastDecision = s.year; return; }
    } else if (age === 12) fe.llgOffered = s.year;
  }
  if (fe.llg && !fe.llgFriendsOffered && s.born >= 1756 && s.born <= 1764 && s.year >= 1771 && s.year <= 1780 && age <= 19) {
    fe.llgFriendsOffered = s.year; s.decision = 'llg-friends'; s.lastDecision = s.year; return;
  }
  // Old age: the memory of the two boys.
  if (age >= 60 && s.year >= 1820 && !fe.llgMemory && (llgFriend(s, 'robespierre') || llgFriend(s, 'desmoulins'))) {
    fe.llgMemory = s.year;
    addLog(s, '루이르그랑의 기억', llgFriend(s, 'robespierre')
      ? '젊은이들이 로베스피에르를 ‘피에 굶주린 괴물’이라 부를 때, 당신은 기숙사에서 당신의 라틴어 작문을 한 줄씩 고쳐 주던 단정한 소년을 떠올립니다. 아무에게도 그 이야기를 하지 않았습니다.'
      : '서랍 속의 「늙은 코르들리에」를 다시 펼쳐 보았습니다. 관용 위원회를 만들자는 한 줄 때문에 카미유는 서른넷에 죽었습니다.', 'normal');
  }
}
// Monthly: dated news and the two decisions of 1794.
function llgMonth(s) {
  if (s.dead || s.sex !== '남성' || !(s.flags['llg-robespierre'] || s.flags['llg-desmoulins'])) return;
  const fe = s.familyEvents;
  for (const [y, m, need, title, paris, away, type] of LLG_NEWS) {
    const key = `llgn-${y}-${m}`;
    if (s.year !== y || s.month !== m || fe[key] || !need(s)) continue;
    fe[key] = 1;
    const text = s.place === '파리' || !away ? paris : away;
    addLog(s, title, text, type);
  }
  if (s.decision) return;
  const inParis = s.place === '파리';
  if (inParis && !fe.llgVieux && (s.year === 1794 && s.month <= 2 || s.year === 1793 && s.month === 12) && llgAlive(s, 'desmoulins') && llgFriend(s, 'robespierre')) {
    fe.llgVieux = 1; s.decision = 'llg-vieux'; s.lastDecision = s.year; return;
  }
  if (inParis && !fe.llgPlea && s.year === 1794 && s.month === 3 && llgAlive(s, 'desmoulins')) {
    fe.llgPlea = 1; s.decision = 'llg-plea'; s.lastDecision = s.year;
  }
}
EN['루이르그랑의 기억'] = 'Memories of Louis-le-Grand';
EN['젊은이들이 로베스피에르를 ‘피에 굶주린 괴물’이라 부를 때, 당신은 기숙사에서 당신의 라틴어 작문을 한 줄씩 고쳐 주던 단정한 소년을 떠올립니다. 아무에게도 그 이야기를 하지 않았습니다.'] = 'When young people call Robespierre a ‘bloodthirsty monster’, you think of the neat boy in the dormitory who went through your Latin composition line by line. You have never told anyone.';
EN['서랍 속의 「늙은 코르들리에」를 다시 펼쳐 보았습니다. 관용 위원회를 만들자는 한 줄 때문에 카미유는 서른넷에 죽었습니다.'] = 'You opened the copy of Le Vieux Cordelier in your drawer again. For one line calling for a committee of clemency, Camille died at thirty-four.';
EN['혁명 정부는 이 학교를 ‘평등 콜레주(콜레주 에갈리테)’라고 부릅니다. 파리의 옛 콜레주 가운데 문을 닫지 않은 거의 유일한 학교입니다.'] = 'The revolutionary government calls the school the ‘Collège Égalité’. Of the old collèges of Paris it is almost the only one that has not closed.';
