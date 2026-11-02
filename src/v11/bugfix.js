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
