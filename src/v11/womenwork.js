// src/data/women-work.js — 여성의 일, 고증대로
// Before 1914 a woman could not be a banker, an army officer, a priest, a deputy or prefect, a police
// commissioner, a lawyer or a doctor (the first Frenchwoman took a medical degree in 1875). She could be a
// marchande, a forewoman or workshop mistress, a schoolmistress, a midwife, a nun, a painter, an actress,
// a writer, a salonnière, and — often — the one who kept the books and did the work of the man whose name
// was on the door. Each career below gets a women's ladder in which the closed posts become assistant
// posts to a named employer (○○ is filled with his name).
(() => {
  const W = (id, ranks, extra = {}) => { const c = CAREERS[id]; if (!c) return;
    c.women = ranks.map((r, i) => ({...c.ranks[Math.min(i, c.ranks.length - 1)], fast:undefined, nobleBefore:undefined, fromYear:undefined, ...r}));
    Object.assign(c, extra); };
  W('trade', [{label:'상점 점원'}, {label:'상인'}, {label:'도매상 ○○의 장부 담당', npcJob:'도매상'}, {label:'은행가 ○○의 회계 보조', npcJob:'은행가'}]);
  W('industry', [{label:'여공 반장'}, {label:'작업장 여주인'}, {label:'공장주 ○○의 경영 보조', npcJob:'공장주'}]);
  W('press', [{label:'인쇄소 교정 보조'}, {label:'팸플릿 작가'}, {label:'신문 기고자'}, {label:'신문 발행인 ○○의 편집 보조', npcJob:'신문 발행인'}]);
  W('teaching', [{label:'보조 교사'}, {label:'마을 여학교 교사'}, {label:'도시 여학교 교사'}, {label:'여자 리세 교사', fromYear:1881}]);
  W('law', [{label:'법률 사무소 필경 보조'}, {label:'변호사 ○○의 서류 담당', npcJob:'변호사'}]);
  W('science', [{label:'천문대 계산 보조'}, {label:'학자 ○○의 조수·번역가', npcJob:'학사원 회원'}]);
  W('medicine', [{label:'병원 간호 보조'}, {label:'외과의 ○○의 조수', npcJob:'외과의'}, {label:'병원 간호 책임자'}]);
  W('bureau', [{label:'관청 필경 보조'}, {label:'우체국 사무원', fromYear:1850}, {label:'시골 우체국장', fromYear:1850}]);
  W('officer', [{label:'종군 상인(캉티니에르)'}, {label:'연대의 종군 상인'}]);
  W('police', [{label:'여자 감옥 간수'}, {label:'여자 감옥 간수장'}]);
  W('sea', [{label:'그물 수선공'}, {label:'어시장 상인'}]);
  W('engineering', [{label:'측량 사무소 제도 보조'}, {label:'토목 기사 ○○의 제도 담당', npcJob:'토목 기사'}]);
  // The priesthood is closed; a woman called to the Church goes to the convent.
  if (CAREERS.clergy) CAREERS.clergy.womenGo = 'convent';
})();
