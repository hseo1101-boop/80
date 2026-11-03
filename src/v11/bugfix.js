// src/bugfix.js — data corrections found by the audit (tools: scratch audit scripts)
// Texts that assumed family members the player may not have, and similar small mismatches.
(() => {
  const ev = id => [...dailyEvents, ...childhoodEvents].find(e => e.id === id);
  const dc = id => decisions.find(d => d.id === id);
  const need = (e, role) => { if (e) e.when.livingRoles = [...new Set([...(e.when.livingRoles || []), role])]; };
  need(ev('daily-child-bad-1'), '어머니');
  need(ev('daily-child-bad-3'), '아버지');
  const t = (e, from, to) => { if (e && e.text.includes(from)) e.text = e.text.replace(from, to); };
  t(ev('daily-adult-good-4'), '아이들 몫으로 사탕 몇 알을 샀습니다', '식구들 몫으로 사탕 몇 알을 샀습니다');
  t(ev('m-spouse-evening'), '아이들이 잠든 뒤 배우자와', '하루 일을 마치고 배우자와');
  t(ev('e-old-age'), '손주들이 믿지 않습니다', '젊은 사람들이 믿지 않습니다');
  t(dc('memoir'), '손주들이 옛날이야기를 조릅니다.', '젊은 사람들이 옛날이야기를 청합니다.');
  t(dc('mobilization-women'), '남편과 형제들이 군인 수첩을 들고', '마을 남자들이 군인 수첩을 들고');
  t(dc('move-paris'), '아이들은 좁은 셋방에서 기침을 하고', '식구들은 좁은 셋방에서 기침을 하고');
  t(dc('inheritance-only'), '다만 배우자의 노후와,', '다만 남은 식구의 노후와,');
})();

// Women do not enlist. The National Guard, town militias, volunteer battalions and the army took men only;
// women stay open to crowds, barricades and the help behind the lines. Each listed choice becomes men-only,
// and two scenes get a women's choice so they are not left with staying at home alone.
(() => {
  const dc = id => decisions.find(d => d.id === id);
  const MEN_ONLY = {
    'champ-de-mars':['제복을 입고 대대와 함께 나간다'],
    'tuileries':['구역 대대와 함께 진격한다', '주인의 총을 들고 대대와 함께 간다', '대대에 합류해 뒤쪽에 선다'],
    'siege-lyon':['성벽 방어에 나선다'],
    'thermidor':['국민공회 편 대대에 이름을 올린다'],
    'vendemiaire':['구역 대대와 함께 행진한다', '(왕당파) 왕당파 구역의 봉기에 가담한다'],
    'february-1848':['국민방위대 제복을 입고 개혁을 외친다'],
    'june-days':['국민방위대로 진압에 나선다', '대대와 함께 진압에 나선다'],
    'june-1832':['국민방위대로 진압에 나선다'],
    'invasion-1814':['숲의 농민 의용대에 들어간다', '숲의 의용대에 합류한다'],
    'town-guard':['국민방위대에 가입한다'],
    'bordeaux-federalism':['보르도 의용군에 이름을 올린다'],
    'bastille-bourgeois':['민병대에 들어가 거리 순찰을 맡는다'],
    'july-lyon-bourgeois':['민병대에 들어간다'],
    'july-bordeaux':['애국군에 이름을 올린다'],
  };
  for (const [id, labels] of Object.entries(MEN_ONLY)) {
    const d = dc(id); if (!d) continue;
    for (const c of d.choices) if (labels.includes(c.label)) c.when = {...(c.when || {}), sexes:['남성']};
  }
  // Whole scenes that are a battalion's orders or an officer's posting.
  for (const id of ['tuileries-bourgeois', 'mid-officer']) { const d = dc(id); if (d) d.when.sexes = ['남성']; }
  const W = {sexes:['여성']};
  const O = (id, title, weight, result, effects = {}) => ({id, title, weight, result, effects});
  const tu = dc('tuileries');
  if (tu) tu.choices.splice(1, 0, {label:'연맹병과 구역 대대에 빵과 물을 나른다', preview:'왕정의 몰락 / 부상', when:{...W, sceneRoleNot:['apprentice', 'shop']}, effects:{flags:['tuileries']}, outcomes:[
    O('fall', '왕정이 무너졌습니다', 80, '빵 바구니와 물통을 들고 카루젤 광장까지 따라갔습니다. 저녁에 국왕 일가가 의회로 피신하고 왕정이 무너졌다는 소식을 들었습니다.', {stats:{행복:3, 지식:2}, path:{politics:'engaged'}, milestone:'튈르리 궁 공격 날 연맹병을 도움'}),
    O('wounded', '총격 속에 다쳤습니다', 20, '궁 앞에서 일제 사격이 울릴 때 도망치다 넘어져 크게 다쳤습니다.', {stats:{건강:-10}})]});
  const ly = dc('siege-lyon');
  if (ly) ly.choices.splice(1, 0, {label:'성벽의 수비대에 빵과 탄약을 나른다', preview:'버팀 / 함락 후 처벌 / 포격', when:W, effects:{flags:['siege-lyon']}, outcomes:[
    O('survived', '두 달을 버텼습니다', 60, '포탄이 떨어지는 골목을 지나 성벽까지 빵과 화약 자루를 날랐습니다. 10월에 도시가 함락되었지만 당신 이름은 명부에 오르지 않았습니다.', {stats:{건강:-5, 재산:-8, 행복:-6}, milestone:'리옹 포위전'}),
    O('jailed', '함락 뒤 끌려갔습니다', 30, '수비대를 도왔다는 고발로 몇 주를 갇혀 있다 풀려났습니다. 이웃 남자들 여럿이 브로토 평원에서 총살되었습니다.', {stats:{건강:-8, 행복:-10, 재산:-8}}),
    O('hurt', '포탄 파편에 다쳤습니다', 10, '푸르비에르 언덕 아래에서 포탄 파편에 맞았습니다.', {stats:{건강:-14}})]});
})();
