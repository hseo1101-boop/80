// src/groups.js — 사건 분류: 공통 · 신분별 · 직업별 · 관계
// Every everyday event and decision falls into one of four groups, read from its conditions:
//   관계   — about family, spouse, children, parents, friends (relationship roles, family domains)
//   직업별 — tied to the work you do (job or career conditions, the career domain)
//   신분별 — tied to your estate or class (class conditions)
//   공통   — anyone of the time and place may meet it
// Historic scenes keep their own label (역사의 현장) but are grouped the same way underneath.
const EVENT_GROUPS = {common:'공통', class:'신분별', job:'직업별', relation:'관계'};
function eventGroup(e) {
  const w = e.when || {};
  if (w.livingRoles || w.livingRolesAny || w.childAge || w.parentAgeMin || w.hasChild || w.hadRoles || w.noLivingRoles || w.bond
    || ['marriage', 'family', 'parenting', 'relationships', 'bond'].includes(e.domain) || e.effects?.relationCloseness) return 'relation';
  if (w.jobMatch || w.hasJob || w.careerIs || w.minRank !== undefined || w.noCareer || e.domain === 'career') return 'job';
  if (w.classes || w.royalOfficer) return 'class';
  return 'common';
}
let EVENT_GROUP_INDEX = null;
function eventGroupOf(id) {
  if (!EVENT_GROUP_INDEX) {
    EVENT_GROUP_INDEX = new Map();
    for (const e of [...childhoodEvents, ...dailyEvents, ...decisions]) if (!EVENT_GROUP_INDEX.has(e.id)) EVENT_GROUP_INDEX.set(e.id, eventGroup(e));
  }
  return EVENT_GROUP_INDEX.get(id) || null;
}
