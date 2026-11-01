// src/summary.js
// End-of-life report: epitaph, comparisons with contemporaries, and the moments worth remembering.
// Survival tables are rounded approximations of French life tables (per 1,000 births), not game output.
const LIFE_TABLE = {
  early:[[0,1000],[1,730],[5,600],[10,560],[20,520],[30,470],[40,410],[50,340],[60,250],[70,140],[80,45],[90,4],[100,0]],
  late:[[0,1000],[1,800],[5,690],[10,650],[20,610],[30,560],[40,500],[50,430],[60,340],[70,210],[80,75],[90,8],[100,0]]
};
function survivors(born, age) {
  const t = LIFE_TABLE[born < 1800 ? 'early' : 'late'];
  for (let i = 1; i < t.length; i++) if (age <= t[i][0]) {
    const [a0,l0] = t[i-1], [a1,l1] = t[i]; return l0 + (l1 - l0) * (age - a0) / (a1 - a0);
  }
  return 0;
}
function outlivedPercent(s) { return Math.round(100 - survivors(s.born, ageOf(s)) / 10); }
function lifeReport(s) {
  const age = ageOf(s), woman = s.sex === '여성';
  const kids = s.relations.filter(r => r.role === '자녀'), aliveKids = kids.filter(r => r.alive);
  const spouse = s.relations.find(r => r.role === '배우자');
  const placeShort = s.place.replace(' 농촌', '');
  const job = ['없음','은퇴'].includes(s.job) ? (s.job === '은퇴' ? (s.lifeMilestones.map(m => m.match(/직업: (.+)/)?.[1]).filter(Boolean).at(-1) || '') : '') : s.job;
  const who = job ? `${placeShort}의 ${job.replace(/ 보조$/, '')}` : `${placeShort} 사람`;
  const NUM = ['','한','둘','셋','넷','다섯','여섯','일곱','여덟','아홉','열'];
  const parent = woman ? '어머니' : '아버지';
  const family = kids.length ? (kids.length === 1 ? `한 아이의 ${parent}` : `아이 ${NUM[kids.length] || kids.length}의 ${parent}`) : spouse ? `${spouse.name.split(' ')[0]}의 ${woman ? '아내' : '남편'}` : '';
  const epitaph = [who, family].filter(Boolean).join(' · ');
  const lines = [];
  const out = outlivedPercent(s);
  if (age < 1) lines.push('첫돌을 맞지 못했습니다. 이 시대에는 드문 일이 아니었습니다.');
  else lines.push(`${age}세까지 살았습니다. 같은 해에 태어난 사람의 약 ${out}%보다 오래 산 셈입니다.`);
  const lit = literacyOf(s), rate = s.sex === '남성' ? (s.born < 1790 ? 47 : 54) : (s.born < 1790 ? 27 : 34);
  if (age >= 12) lines.push(lit === 'basic' ? `글을 읽고 쓸 줄 알았습니다. 같은 세대 ${woman ? '여성' : '남성'} 가운데 약 ${rate}%만 할 수 있던 일입니다.`
    : `글을 끝내 익히지 못했습니다. 같은 세대 ${woman ? '여성' : '남성'}의 약 ${100 - rate}%가 그랬습니다.`);
  const w0 = s.familyEvents?.w0;
  if (typeof w0 === 'number' && age >= 16) {
    const d = s.stats.재산 - w0;
    lines.push(d >= 15 ? '태어난 집안보다 형편이 크게 나아졌습니다.' : d <= -15 ? '태어난 집안보다 형편이 어려워졌습니다.' : '태어난 집안과 비슷한 형편으로 살았습니다.');
  }
  if (kids.length) {
    const lost = kids.length - aliveKids.length;
    lines.push(`자녀 ${kids.length}명을 낳아 ${aliveKids.length}명이 곁에 남았습니다.${lost ? ` ${lost}명은 먼저 떠나보냈습니다.` : ''}`);
  }
  const lostSiblings = s.relations.filter(r => r.role === '형제자매' && !r.alive && r.deathYear !== undefined && r.deathYear - r.birthYear <= 9).length;
  if (lostSiblings) lines.push(`형제자매 ${lostSiblings}명이 어린 나이에 세상을 떠났습니다.`);
  const historic = s.log.filter(x => x.title.includes('역사의 현장')).map(x => ({year:x.year, title:x.title.split(' · ').at(-1),
    choice:(x.desc.split('\n').find(l => l.startsWith('선택: ')) || '').slice(4)})).reverse();
  const starred = s.log.filter(x => x.star).map(x => `${x.year} · ${x.title.split(' · ').at(-1)}`).reverse();
  const cause = (s.log.find(x => x.title === '생애의 끝')?.desc || '').split('생애를 마쳤습니다. ')[1] || '';
  return {name:s.name, french:frenchName(s.name), born:s.born, died:s.year, age, epitaph, lines, historic, starred, cause,
    places:[...new Set(s.lifeMilestones.filter(m => /이주|출생/.test(m)).map(m => m.split(' · ')[1]))]};
}
