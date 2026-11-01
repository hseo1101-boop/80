// src/army.js
// Serving soldiers and officers are away from home in wartime: their scene becomes a camp, home-town
// events and crowds no longer reach them, battles open only for some units, and peace sends conscripts home.
const SERVING = /^(군인|육군)/;
function atFront(s) { return !s.dead && SERVING.test(s.job || '') && WAR_YEARS(s.year); }
function frontLabel(s) {
  const y = s.year;
  if (y <= 1763) return '7년 전쟁의 독일 전선';
  if (y <= 1795) return '국경의 공화국 군대';
  if (y <= 1797) return '이탈리아·라인 전선';
  if (y <= 1801) return '라인·알프스 전선';
  if (y <= 1805 && !(y === 1805 && s.month >= 9)) return '불로뉴 해안 야영지';
  if (y <= 1807) return '대육군 · 독일과 폴란드';
  if (y <= 1811) return '스페인 또는 독일 전선';
  if (y === 1812) return '러시아 원정군';
  if (y <= 1814) return '독일과 프랑스 동부 전선';
  return '벨기에 국경의 북부군';
}
// Conscripts and volunteers go home when the wars end; career officers stay in the army.
function armyYear(s) {
  if (s.dead || s.job !== '군인' || WAR_YEARS(s.year)) return;
  s.job = '없음';
  addLog(s, '☕ 일상 · 제대', `전쟁이 끝나 군복을 벗고 고향 ${s.place}(으)로 돌아왔습니다. 집은 그대로인데 모든 것이 조금 낯섭니다.`, 'normal');
  milestone(s, '제대하고 귀향');
}
// Units, not whole armies, fought each battle: only some soldiers are there.
const BATTLE_CHANCE = {valmy:.6, austerlitz:.6, russia:.6, waterloo:.5, toulon:.3, 'hoche-ireland':.25, trafalgar:.4};
for (const [id, chance] of Object.entries(BATTLE_CHANCE)) {
  const d = decisions.find(x => x.id === id);
  if (d) { d.chance = chance; if (d.when.jobMatch === '군') d.when.jobMatch = '^(군인|육군)'; }
}
// Life in the ranks, for the months away from home.
(() => {
  const E = (id, kind, title, text, stats = {}, experience = {}, repeatable = true) => dailyEvents.push({id, kind, category:'personal',
    when:{minAge:16, jobMatch:'^(군인|육군)', fromYear:1756}, title, text, effects:{stats, experience}, tags:['daily','army'], repeatable});
  E('army-march', 'normal', '행군', '하루 종일 진흙길을 행군했습니다. 배낭 무게에 어깨가 끊어질 것 같습니다. 저녁에는 길가 밭에 그대로 쓰러져 잤습니다.', {건강:-1});
  E('army-bread', 'bad', '배급 지연', '보급 마차가 오지 않아 사흘 동안 딱딱한 비스킷 반쪽으로 버텼습니다. 동료들은 근처 농가를 기웃거립니다.', {건강:-1, 행복:-1});
  E('army-letter', 'good', '고향에서 온 편지', '고향에서 편지가 왔습니다. 글을 아는 동료가 읽어 주었습니다. 가족은 모두 무사하다고 합니다.', {행복:3}, {}, true);
  E('army-campfire', 'good', '야영지의 밤', '모닥불 가에서 동료들과 고향 노래를 불렀습니다. 노르망디, 프로방스, 브르타뉴 사투리가 뒤섞였습니다.', {행복:2}, {social:1});
  E('army-lice', 'bad', '이와 열병', '야영지에 이가 들끓고 열병이 돌았습니다. 며칠 동안 야전 병원에 누워 있었습니다.', {건강:-2});
  E('army-drill', 'normal', '훈련', '하사의 구령에 맞춰 장전과 사격을 수십 번 반복했습니다. 손이 저절로 움직일 때까지.', {}, {responsibility:1});
  E('army-pay', 'good', '밀린 봉급', '몇 달 밀린 봉급이 한꺼번에 나왔습니다. 일부를 고향에 부쳤습니다.', {재산:2});
  E('army-foreign', 'normal', '낯선 나라', '처음 보는 강과 마을을 지났습니다. 사람들 말을 한마디도 알아들을 수 없습니다.', {}, {curiosity:2});
})();
// Comrades shown beside the player in the camp scene. Derived from the player's name, so no game RNG.
function comrades(s) {
  const h = strHash(s.name + s.year);
  return [0, 1].map(i => ({name:`${male[(h >>> (i*5)) % male.length]} 전우`, role:'전우', sex:'남성', job:'군인', birthYear:s.born + i*2 - 1, birthMonth:1}));
}
