// src/ui.js
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ym = (y, m) => y*12 + m;
function eraText(s) {
  const t = ym(s.year, s.month);
  if (t < ym(1763,2)) return '구체제(앙시앵 레짐)의 프랑스 왕국입니다. 7년 전쟁이 이어지고 있습니다.';
  if (t < ym(1789,5)) return '구체제(앙시앵 레짐)의 프랑스 왕국입니다. 지역과 신분에 따라 삶의 조건이 다릅니다.';
  if (t < ym(1792,9)) return '혁명이 진행되고 있습니다. 정치와 제도가 빠르게 변화합니다.';
  if (t < ym(1795,11)) return '공화국 초기입니다. 전쟁과 정치적 갈등이 사회에 영향을 미칩니다.';
  if (t < ym(1799,11)) return '총재정부 시대입니다.';
  if (t < ym(1804,5)) return '통령정부 시대입니다.';
  if (t < ym(1814,4)) return '나폴레옹 제1제정 시대입니다.';
  if (t >= ym(1815,3) && t < ym(1815,7)) return '나폴레옹의 백일천하입니다.';
  if (t < ym(1830,8)) return '왕정복고 시대입니다. 부르봉 왕가가 돌아왔지만 혁명 이전으로 완전히 되돌아가지는 않았습니다.';
  if (t < ym(1848,2)) return '7월 왕정 시대입니다. 철도와 공장이 늘고 부르주아의 시대가 열립니다.';
  return '제2공화국 이후의 프랑스입니다. 성인 남성 모두가 투표하는 시대가 시작되었습니다.';
}
const ERAS = [
  {from:1740, to:ym(1789,5), label:'구체제', color:'#b9a77a', regime:'ROYAUME DE FRANCE'},
  {to:ym(1792,9), label:'혁명기', color:'#c0564e', regime:'ROYAUME DE FRANCE'},
  {to:ym(1799,11), label:'공화국', color:'#b3443f', regime:'RÉPUBLIQUE FRANÇAISE'},
  {to:ym(1804,5), label:'통령정부', color:'#5a6f9a', regime:'RÉPUBLIQUE FRANÇAISE'},
  {to:ym(1814,4), label:'제1제정', color:'#3c5a8a', regime:'EMPIRE FRANÇAIS'},
  {to:ym(1815,3), label:'왕정복고', color:'#d6ccb2', regime:'ROYAUME DE FRANCE'},
  {to:ym(1815,7), label:'백일천하', color:'#3c5a8a', regime:'EMPIRE FRANÇAIS'},
  {to:ym(1830,8), label:'왕정복고', color:'#d6ccb2', regime:'ROYAUME DE FRANCE'},
  {to:ym(1848,2), label:'7월 왕정', color:'#7a9a7a', regime:'ROYAUME DES FRANÇAIS'},
  {to:ym(1900,1), label:'제2공화국 이후', color:'#b3443f', regime:'RÉPUBLIQUE FRANÇAISE'}
];
function eraAt(year, month) { const t = ym(year, month); return ERAS.find(e => t < e.to) || ERAS.at(-1); }
const POPULATION = [[1740,24.6],[1770,26.6],[1790,28.1],[1801,29.4],[1821,30.5],[1831,32.6],[1846,35.4],[1851,35.8],[1880,37.7]];
function populationOf(year) {
  const p = POPULATION;
  if (year <= p[0][0]) return p[0][1];
  for (let i = 1; i < p.length; i++) if (year <= p[i][0]) {
    const [y0,v0] = p[i-1], [y1,v1] = p[i]; return v0 + (v1-v0)*(year-y0)/(y1-y0);
  }
  return p.at(-1)[1];
}
const PLACE_NOTES = {'파리':'왕국 최대의 도시 파리에는 18세기 말 약 60만 명이 삽니다','리옹':'견직물의 도시 리옹에는 약 14만 명이 삽니다',
  '보르도':'대서양 무역항 보르도에는 약 11만 명이 삽니다','루앙':'노르망디의 직물 도시 루앙에는 약 7만 명이 삽니다','투르':'루아르강 변의 투르에는 약 2만 명이 삽니다'};
function placeNote(s) {
  for (const [k,v] of Object.entries(PLACE_NOTES)) if (s.place.includes(k)) return v;
  return s.place.includes('농촌') ? '프랑스 사람 열에 여덟은 당신처럼 농촌에 삽니다' : '';
}
function hasBatchim(word) {
  const c = word.trim().at(-1); if (!c) return false;
  const code = c.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0;
  return /[0-9]/.test(c) ? '013678'.includes(c) : false;
}
const withJosa = (word, a, b) => word + (hasBatchim(word) ? a : b);
const KOREAN_COUNT = ['','한','두','세','네','다섯','여섯','일곱','여덟','아홉'];
const countWord = n => n < 10 ? KOREAN_COUNT[n] + ' 명' : n + '명';
function companions(s) {
  const alive = s.relations.filter(r => r.alive), has = role => alive.filter(r => r.role === role);
  const parts = [], dad = has('아버지').length, mom = has('어머니').length;
  if (dad && mom) parts.push('부모님'); else if (dad) parts.push('아버지'); else if (mom) parts.push('어머니');
  if (has('할머니').length) parts.push('할머니');
  if (has('배우자').length) parts.push('배우자');
  if (has('형제자매').length) parts.push('형제자매 ' + countWord(has('형제자매').length));
  if (has('자녀').length) parts.push('자녀 ' + countWord(has('자녀').length));
  if (!parts.length) return '홀로 지냄';
  const text = parts.join('·');
  return withJosa(text, '과', '와') + ' 함께';
}
function homeLabel(s) {
  const k = placeKind(s);
  if (k === 'paris') return s.class === '부르주아' ? '시내의 아파르트망' : '다층 셋집';
  if (k === 'chateau') return '가문의 성관';
  if (k === 'town') return s.class === '부르주아' ? '상인의 집' : '도시의 셋집';
  if (s.place.includes('브르타뉴')) return '돌로 지은 농가';
  return '초가 농가';
}
function placeTitle(s) {
  if (s.place.includes('농촌')) return s.place.replace('농촌', '농촌 마을');
  return s.place.includes('파리') ? '파리 시내' : s.place + ' 시내';
}
function stageLabel(s) {
  const a = ageOf(s);
  if (s.dead) return '생애를 마침';
  if (a < 2) return '갓난아기';
  if (a < 7) return '어린아이';
  if (a < 14) return /학교/.test(s.education) ? '교구 학교 학생' : s.job !== '없음' ? s.job : '집안일을 거드는 아이';
  if (a < 20) return s.job !== '없음' ? s.job : '일을 찾는 청소년';
  if (s.job === '은퇴') return '생업에서 물러남';
  return s.job !== '없음' ? s.job : '생계를 꾸리는 중';
}
const DOTS_BY_CLASS = {'농민':2,'도시 평민':2,'부르주아':4,'귀족':5};
const TEMPERAMENT = {curiosity:'호기심이 많음',educationInterest:'배우기를 좋아함',craft:'손재주가 좋음',commerce:'셈이 밝음',social:'사람을 좋아함',
  responsibility:'책임감이 강함',familyTrade:'가업에 익숙함',religious:'신앙심이 깊음',inequality:'불공평에 예민함',selfStudy:'혼자 익히는 편'};
const RELIGION = {catholic:'가톨릭',protestant:'개신교',jewish:'유대교',other:'기타',unspecified:'기록 없음'};
const LITERACY = {illiterate:'글을 읽지 못함',learning:'글을 배우는 중',basic:'읽고 쓸 수 있음'};
const STAT_COLORS = {건강:'#2e8b57',행복:'#c08a1e',지식:'#1f7a7a',재산:'#8a6a2a',관계:'#8c1c3c',명성:'#5b4a8c'};
function sceneFamily(s) {
  const alive = s.relations.filter(r => r.alive);
  const order = ['할머니','아버지','어머니','배우자','형제자매','자녀'];
  const fam = alive.filter(r => order.includes(r.role));
  const prio = ageOf(s) < 18 ? ['아버지','어머니','형제자매','할머니','배우자','자녀'] : ['배우자','자녀','어머니','아버지','형제자매','할머니'];
  return [...fam].sort((a,b) => prio.indexOf(a.role) - prio.indexOf(b.role)).slice(0, 6)
    .sort((a,b) => order.indexOf(a.role) - order.indexOf(b.role));
}
function castOf(s) {
  if (atFront(s)) return [{look:characterLook(s, comrades(s)[0])}, {look:characterLook(s), me:true}, {look:characterLook(s, comrades(s)[1])}];
  const fam = sceneFamily(s), before = fam.filter(r => ['할머니','아버지','어머니'].includes(r.role)), after = fam.filter(r => !before.includes(r));
  return [...before.map(r => ({look:characterLook(s, r)})), {look:characterLook(s), me:true}, ...after.map(r => ({look:characterLook(s, r)}))];
}
function signalement(s) {
  const h = strHash(s.name + s.born), hairFr = ['châtains foncés','châtains','châtain clair','noirs','blond foncé','blonds','roux'];
  const look = characterLook(s), age = ageOf(s);
  const hair = age >= 60 ? 'gris' : hairFr[Math.max(0, PX.hairs.indexOf(look.hair))] || 'châtains';
  const eyes = ['bleus','bruns','gris','verts','noisette'][h % 5];
  const inches = 5*12 + (s.sex === '남성' ? 1 : -1) + (h >>> 5) % 5;
  const height = age >= 16 ? `${Math.floor(inches/12)} pi ${inches%12} po` : 'enfant';
  return `CHEVEUX ${hair.toUpperCase()} · YEUX ${eyes.toUpperCase()} · TAILLE ${height.toUpperCase()}`;
}
function logAge(s, x) { return Math.max(0, x.year - s.born - (x.month < s.birthMonth ? 1 : 0)); }
const EVENT_INDEX = new Map([...dailyEvents, ...childhoodEvents].map(ev => [ev.id, ev]));
const KICKER = {history:'📜 역사', fact:'📊 시대의 숫자'};
// Splits a log entry into a small kicker line, an optional bold title, the text and stat-change chips.
function logParts(x) {
  const daily = x.eventId && EVENT_INDEX.get(x.eventId);
  if (x.title.startsWith('중대 결정')) {
    const historic = x.title.includes('역사의 현장');
    return {kicker: historic ? '🏛 역사의 현장' : '⚖ 중대 결정', title: x.title.split(' · ').at(-1),
      text: x.desc.split('\n').slice(1).filter(line => line !== '결과: 선택의 결과').join('\n'), chips: []};
  }
  if (daily && x.title.includes(' · ')) {
    const [kicker, ...rest] = x.title.split(' · ');
    const chips = Object.entries(daily.effects?.stats || {}).filter(([,v]) => v).map(([k,v]) => [k, v]);
    return {kicker, title: rest.join(' · '), text: x.desc, chips};
  }
  if (KICKER[x.type]) return {kicker: KICKER[x.type], title: '', text: x.desc, chips: []};
  return {kicker: x.title, title: '', text: x.desc, chips: []};
}
function logLabel(x) { const p = logParts(x); return p.title ? `${p.kicker} · ${p.title}` : p.kicker; }

function createUI(doc, engine, handlers) {
  const $ = id => doc.getElementById(id), e = escapeHTML;
  const scene = createScene($('scene'), doc);
  let choosing = false, summaryKey = '';
  function renderSummary(s) {
    const r = lifeReport(s), look = characterLook(s), sp = sceneSpec(s, []);
    $('summaryPortrait').src = portraitURL(doc, look, sp);
    $('summaryName').textContent = r.name;
    $('summaryDates').textContent = `${r.french} · ${r.born}–${r.died} · ${r.age}세`;
    $('summaryEpitaph').textContent = r.epitaph;
    $('summaryCause').textContent = r.cause;
    $('summaryLines').innerHTML = r.lines.map(x => `<li>${e(x)}</li>`).join('');
    $('summaryHistoric').innerHTML = r.historic.length ? r.historic.map(h => `<li><b>${h.year}</b> ${e(h.title)}${h.choice ? ` <span>— ${e(h.choice)}</span>` : ''}</li>`).join('') : '<li class="muted">역사의 현장에 직접 서지는 않았습니다.</li>';
    $('summaryMissed').hidden = !r.missed.length;
    $('summaryMissedList').innerHTML = r.missed.map(m => `<li>${e(m.text)}</li>`).join('');
    $('summaryFigures').innerHTML = r.figures.length ? r.figures.map(f => `<li><b>${e(f.name)}</b> <span>${e(f.job)}</span></li>`).join('') : '<li class="muted">이름난 인물과 마주친 적은 없었습니다.</li>';
    $('summaryStarred').innerHTML = r.starred.slice(0, 8).map(x => `<li>${e(x)}</li>`).join('') || '<li class="muted">별표한 기록이 없습니다. 기록 줄을 누르면 ☆ 표시됩니다.</li>';
    drawShareCard(s, r);
  }
  // A 4:5 card for sharing, drawn on canvas from the same report.
  function drawShareCard(s, r) {
    const c = doc.createElement('canvas'); c.width = 1080; c.height = 1350;
    const x = c.getContext('2d'), sans = getComputedStyle(doc.body).fontFamily, serif = "'Bitter', Georgia, serif";
    x.fillStyle = '#f8f9f7'; x.fillRect(0, 0, 1080, 1350);
    x.fillStyle = '#8c1c3c'; x.fillRect(0, 0, 1080, 120);
    x.fillStyle = '#fbeef1'; x.font = `600 40px ${sans}`; x.fillText('어느 프랑스인의 삶', 64, 76);
    x.font = `500 30px 'IBM Plex Mono', monospace`; x.textAlign = 'right'; x.fillText(`${r.born}–${r.died}`, 1016, 76); x.textAlign = 'left';
    x.imageSmoothingEnabled = false;
    const portrait = new Image();
    portrait.onload = () => {
      x.drawImage(portrait, 64, 180, 280, 340);
      x.strokeStyle = '#c9cfc9'; x.lineWidth = 3; x.strokeRect(64, 180, 280, 340);
      x.fillStyle = '#1c272a'; x.font = `800 72px ${sans}`; x.fillText(r.name, 384, 290);
      x.font = `italic 600 40px ${serif}`; x.fillStyle = '#6d7672'; x.fillText(r.french, 384, 350);
      x.font = `500 36px ${sans}`; x.fillStyle = '#1c272a'; wrap(r.epitaph, 384, 420, 632, 50, 2);
      x.font = `400 32px ${sans}`; x.fillStyle = '#6d7672'; wrap(r.cause, 384, 520, 632, 44, 2);
      x.fillStyle = '#17695a'; x.font = `400 34px ${sans}`;
      let y = 640;
      for (const line of r.lines.slice(0, 4)) y = wrap(line, 64, y, 952, 50, 2) + 22;
      if (r.historic.length) {
        x.fillStyle = '#8c1c3c'; x.font = `700 32px ${sans}`; x.fillText('역사의 현장', 64, y + 20); y += 70;
        x.fillStyle = '#1c272a'; x.font = `400 32px ${sans}`;
        for (const h of r.historic.slice(0, 3)) { x.fillText(`${h.year}  ${h.title}`, 64, y); y += 48; }
      }
      x.fillStyle = '#9aa29e'; x.font = `400 26px ${sans}`; x.fillText('hseo1101-boop.github.io/80', 64, 1300);
      $('shareImage').src = c.toDataURL('image/png');
    };
    portrait.src = portraitURL(doc, characterLook(s), sceneSpec(s, []));
    function wrap(text, left, top, width, lh, max) {
      const words = String(text).split(' '); let line = '', n = 0;
      for (const word of words) {
        const next = line ? line + ' ' + word : word;
        if (x.measureText(next).width > width && line) {
          if (n === max - 1) { x.fillText(line + '…', left, top); return top + lh; }
          x.fillText(line, left, top); top += lh; n++; line = word;
        } else line = next;
      }
      if (line) { x.fillText(line, left, top); top += lh; }
      return top;
    }
  }
  function showBirth() {
    const s = engine.state; if (!s) return;
    $('birthSprite').src = spriteURL(doc, characterLook(s));
    $('birthTitle').textContent = `${s.born}년 ${s.birthMonth}월, ${s.place}`;
    $('birthLead').textContent = `${s.name}. ${s.place}의 ${s.class === '도시 평민' ? '장인·노동자' : s.class} 가정(${s.parentJob})에서 ${s.sex === '남성' ? '아들' : '딸'}로 태어났습니다.`;
    $('birthOddsList').innerHTML = birthOdds(s).map(x => `<li>${e(x)}</li>`).join('')
      + `<li>타고난 재능 ${s.aptitude} · ${e(aptitudeBand(s.aptitude).label)} (상위 약 ${Math.max(1, Math.round(aptitudeTopPercent(s.aptitude)))}%)</li>`;
    $('birthOverlay').hidden = false; $('birthStart').focus();
  }
  let spec = null, specKey = '', starOnly = false, lastLog = null, lastLen = -1, renderedState = null;
  let shownDecision = null, shownResult = null, previousFocus = null, noticeTimer = null, introScene = null, introSpec = null;

  function renderProgress(now = performance.now()) {
    const s = engine.state;
    if (s) {
      const value = birthdayProgress(s) * 100;
      $('yearProgressFill').style.width = value + '%';
      $('yearProgress').setAttribute('aria-valuenow', String(Math.round(value)));
      if (spec) { spec.moving = !s.dead && !s.decision && !s.runtime.paused; spec.speed = s.runtime.speed; if (spec.moving || !spec.drawn) { scene.draw(spec, now); spec.drawn = true; } }
    }
  }
  const BIRTH_MARKS = [[1789,'대혁명'],[1804,'나폴레옹 즉위'],[1815,'워털루'],[1830,'7월 혁명'],[1848,'2월 혁명']];
  function renderBirthPick() {
    const born = handlers.getBorn();
    $('birthYearOut').textContent = born ? born + '년' : '무작위';
    $('birthYear').value = String(born || 1775);
    $('birthYear').classList.toggle('random', !born);
    doc.querySelectorAll('[data-born]').forEach(b => { const on = String(born || 'random') === b.dataset.born; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    if (!born) { $('birthHint').textContent = `${BIRTH_CHOICE.min}년부터 1820년 사이에서 무작위로 태어납니다.`; return; }
    const era = eraAt(born, 6).label, ahead = BIRTH_MARKS.filter(([y]) => y >= born).slice(0, 3).map(([y,l]) => `${l} ${y - born}세`);
    $('birthHint').textContent = `${era} 시대에 태어납니다.` + (ahead.length ? ` 살아 있다면 ${ahead.join(' · ')}.` : '');
  }
  function renderIntro() {
    if (introScene) return;
    const demo = createState(17890714);
    demo.year = demo.born + 8; demo.month = 6;
    introScene = createScene($('introScene'), doc);
    introSpec = {...sceneSpec(demo, castOf(demo)), moving:true, speed:2};
    const loop = now => { if (!introScene) return; introScene.draw(introSpec, now); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  function idCard(s) {
    const look = characterLook(s), era = eraAt(s.born, s.birthMonth), now = eraAt(s.year, s.month);
    const sp = sceneSpec(s, []);
    const dots = Math.max(1, (DOTS_BY_CLASS[s.class] || 2) - (s.parentJob === '소작농' ? 1 : 0));
    const top = Object.entries(s.experience || {}).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1])[0];
    const fr = frenchName(s.name), [given, ...rest] = fr.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g,'').split(' ');
    const mrz = (`${rest.join('<')}<<${given}`).padEnd(30, '<').slice(0, 30);
    const place = s.place.replace(' 농촌', '');
    return `<div class="id-head"><span>통행증 · ${e(now.regime)}</span><span>${s.born}</span></div>
      <div class="id-body"><img class="id-photo" alt="" src="${portraitURL(doc, look, sp)}">
      <div class="id-name"><b>${e(s.name)}</b><i>${e(fr)}</i></div>
      <dl class="id-fields">
        <dt>성별</dt><dd>${e(s.sex)}</dd>
        <dt>출생</dt><dd>${e(place)} · ${s.born}년 ${s.birthMonth}월</dd>
        <dt>거주</dt><dd>${e(s.place)}</dd>
        <dt>신분</dt><dd>${e(s.class)} · ${s.class === '귀족' ? '제2신분' : '제3신분'}</dd>
        <dt>종교</dt><dd>${e(RELIGION[s.religion] || '기록 없음')}</dd>
        <dt>출신 가정</dt><dd class="dots" aria-label="5단계 중 ${dots}">${'●'.repeat(dots)}<span>${'○'.repeat(5-dots)}</span></dd>
        <dt>학력</dt><dd>${e(s.education === '미정' ? '정규 교육 없음' : s.education)} · ${e(LITERACY[literacyOf(s)])}</dd>
        <dt>직업</dt><dd>${e(s.job)}${s.career ? ` <span class="muted">(${e(CAREERS[s.career.id].label)} · 명성 ${Math.round(s.reputation)})</span>` : ''}</dd>
        <dt>타고난 재능</dt><dd>${s.aptitude} · ${e(aptitudeBand(s.aptitude).label)} <span class="muted">(상위 ${aptitudeTopPercent(s.aptitude) < 1 ? aptitudeTopPercent(s.aptitude).toFixed(1) : Math.round(aptitudeTopPercent(s.aptitude))}% · 학습 ×${aptitudeBand(s.aptitude).mult.toFixed(2)})</span></dd>
        <dt>기질</dt><dd>${e(top ? TEMPERAMENT[top[0]] : '아직 알 수 없음')}</dd>
      </dl></div>
      <div class="id-mrz"><span>${e(signalement(s))}</span><span>P&lt;FRA${e(mrz)}</span><span>FAIT À ${e(frenchPlace(s.place))} · L'AN ${s.year}${s.dead ? ' · DÉCÉDÉ' : ''}</span></div>
      <div class="id-seal" aria-hidden="true">${era.label === '구체제' ? '⚜' : '★'}</div>`;
  }
  function frenchPlace(place) {
    const map = {'파리':'PARIS','리옹':'LYON','루앙':'ROUEN','보르도':'BORDEAUX','투르':'TOURS','오베르뉴':'AUVERGNE','부르고뉴':'BOURGOGNE','브르타뉴':'BRETAGNE'};
    for (const [k,v] of Object.entries(map)) if (place.includes(k)) return v;
    return 'FRANCE';
  }
  function renderHistory(s, force) {
    if (!force && lastLog === s.log[0] && lastLen === s.log.length && renderedState === s) return;
    const list = $('history'), readingPast = list.scrollTop > 24 && renderedState === s;
    const oldHeight = list.scrollHeight, oldTop = list.scrollTop;
    const rows = [];
    s.log.forEach((x, i) => {
      if (starOnly && !x.star) return;
      const dead = x.title === '생애의 끝' || /세상을 떠났/.test(x.desc);
      rows.push(`<li class="row ${e(x.type)}${x.star ? ' starred' : ''}" data-i="${i}" tabindex="0" aria-label="${x.star ? '별표한 기록. ' : ''}${logAge(s,x)}세 ${e(logLabel(x))}">
        <span class="age">${logAge(s, x)}세${dead ? ' <b>†</b>' : ''}</span>
        <div class="txt">${(p => `<small>${x.year}년 ${x.month}월 · ${e(p.kicker)}</small>${p.title ? `<b class="ttl">${e(p.title)}</b>` : ''}<p>${e(p.text)}</p>${p.chips.length ? `<span class="fx">${p.chips.map(([k,v]) => `<i class="${v > 0 ? 'up' : 'down'}">${e(k)} ${v > 0 ? '+' : '−'}${Math.abs(v)}</i>`).join('')}</span>` : ''}`)(logParts(x))}</div>
        <span class="star" aria-hidden="true">${x.star ? '★' : '☆'}</span></li>`);
      if (rows.length >= 400) return;
    });
    list.innerHTML = rows.join('') || `<li class="empty">${starOnly ? '아직 별표한 기록이 없습니다. 기록 줄을 누르면 ☆ 표시됩니다.' : ''}</li>`;
    list.scrollTop = readingPast ? oldTop + list.scrollHeight - oldHeight : 0;
    lastLog = s.log[0]; lastLen = s.log.length;
  }
  function render() {
    const s = engine.state;
    const intro = !s || choosing;
    $('intro').hidden = !intro; $('app').hidden = intro; $('topbar').hidden = intro;
    $('backToLife').hidden = !s || !choosing;
    if (intro) { $('overlay').hidden = true; renderIntro(); renderBirthPick(); return; }
    if (introScene) { introScene = null; }
    const age = ageOf(s), era = eraAt(s.year, s.month);
    $('ageNumber').textContent = age;
    const secs = 48 / s.runtime.speed;
    $('ageLine').textContent = `${s.year}년 ${s.month}월 · ${era.label} · ${s.name} · 1년 ≈ ${secs >= 10 ? Math.round(secs) : secs.toFixed(1).replace('.0','')}초`;
    $('ageLine').title = eraText(s);
    // Scene
    const cast = s.dead ? [] : castOf(s);
    const nextSpec = sceneSpec(s, cast);
    const key = JSON.stringify([nextSpec.kind, nextSpec.place, nextSpec.season, nextSpec.month >= 7 && nextSpec.month <= 8, nextSpec.flag, nextSpec.dead, cast.map(c => c.look.key)]);
    if (key !== specKey) { spec = nextSpec; specKey = key; spec.drawn = false; }
    $('sceneCaption').firstChild.textContent = s.dead ? `${placeTitle(s)} · 마지막 안식처 `
      : atFront(s) ? `${frontLabel(s)} · 야영지 · 고향 ${s.place.replace(' 농촌', '')}의 가족과 떨어져 복무 중 ` : `${placeTitle(s)} · ${homeLabel(s)} · ${companions(s)} `;
    $('scene').setAttribute('aria-label', `${s.place}의 풍경. ${characterLook(s).label}. 함께 있는 가족 ${cast.length ? cast.length - 1 : 0}명.`);
    $('sceneDetail').innerHTML = `<p>${e(eraText(s))}</p><p>${e(placeNote(s))}${placeNote(s) ? '.' : ''}</p>`;
    // Stats
    const stats = {...s.stats, 관계:relationScore(s), ...(s.career || s.familyEvents.career_top ? {명성:s.reputation} : {})};
    $('stats').innerHTML = Object.entries(stats).map(([k,v]) => `<div class="stat"><span>${e(k)}</span><b>${Math.round(v)}</b><i role="meter" aria-label="${e(k)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(v)}"><u style="width:${v}%;background:${STAT_COLORS[k]}"></u></i></div>`).join('');
    const focus = currentFocus(s);
    $('focusButton').firstChild.textContent = focus ? focus.label + ' ' : '보살핌 받기 ';
    $('focusButton').disabled = !focus || s.dead;
    $('stageLabel').textContent = stageLabel(s);
    $('stagePlace').textContent = `${s.place} · ${s.class} 가정`;
    const options = focusOptions(s);
    $('focusChips').innerHTML = s.dead ? '' : options.length ? options.map(f => `<button class="chip${f.id === focus?.id ? ' on' : ''}" data-focus="${f.id}" aria-pressed="${f.id === focus?.id}">${e(f.label)}</button>`).join('')
      : '<span class="muted">아직은 품 안에서 자랍니다. 두 살부터 초점을 고를 수 있어요.</span>';
    $('focusText').textContent = s.dead ? lifeFocus(s).text : focus ? `${FOCUS_EFFECTS[focus.id].hint} ${lifeFocus(s).text}` : lifeFocus(s).text;
    // Log
    const pop = Math.round(populationOf(s.year)*100).toLocaleString('ko-KR');
    $('popLine').textContent = `${s.year}년 프랑스에는 약 ${pop}만 명이 살고 있어요${placeNote(s) ? ' · ' + placeNote(s) : ''}`;
    renderHistory(s, false);
    // Passport and people
    $('idcard').innerHTML = idCard(s);
    $('relations').innerHTML = s.relations.map(r => {
      const look = characterLook(s, r);
      return `<li class="${r.alive ? '' : 'dead'}"><img alt="" src="${spriteURL(doc, look)}"><div><b>${r.role === '인물' ? '역사 인물' : e(r.role)}</b> ${e(r.name)}<small>${r.alive ? ageOf(s, r) + '세' : (r.deathYear ? r.deathYear + '년 사망' : '사망')} · ${e(r.job)}</small></div><i title="친밀도 ${r.closeness}"><u style="width:${r.closeness}%"></u></i></li>`;
    }).join('') || '<li class="muted">아직 기록된 사람이 없습니다.</li>';
    $('relationExtra').textContent = `생존 ${s.relations.filter(r => r.alive).length}명 · 전체 ${s.relations.length}명`;
    // Right column
    const lifeEnd = s.year + s.month/12, span = [1740, 1860];
    const pct = y => ((Math.min(span[1], Math.max(span[0], y)) - span[0]) / (span[1] - span[0]) * 100).toFixed(2);
    let from = span[0];
    $('eraBar').innerHTML = ERAS.map(x => { const to = Math.min(span[1], x.to/12); const seg = `<span style="left:${pct(from)}%;width:${(pct(to)-pct(from)).toFixed(2)}%;background:${x.color}" title="${e(x.label)}"></span>`; from = to; return seg; }).join('')
      + `<em style="left:${pct(s.born + s.birthMonth/12)}%;width:${(pct(lifeEnd)-pct(s.born + s.birthMonth/12)).toFixed(2)}%"></em><b style="left:${pct(lifeEnd)}%"></b>`;
    $('eraLabels').innerHTML = '<span>1740</span><span>1789</span><span>1815</span><span>1860</span>';
    $('era').textContent = eraText(s);
    $('milestones').innerHTML = s.lifeMilestones.slice().reverse().map(x => `<li>${e(x)}</li>`).join('');
    const interests = Object.entries(s.experience || {}).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]);
    $('experienceSummary').innerHTML = interests.length ? interests.slice(0,6).map(([k,v]) => `<span class="tag">${e(EXPERIENCE_LABELS[k])} <b>${v}</b></span>`).join('') : '<span class="muted">작은 경험들이 쌓여 관심이 자라납니다.</span>';
    $('memoryList').innerHTML = (s.memories || []).slice(0, 8).map(m => `<li><small>${m.year}.${m.month}</small> ${e(m.title)}</li>`).join('');
    $('lifeSummary').innerHTML = `<dt>직업</dt><dd>${e(s.job)}</dd><dt>거주지</dt><dd>${e(s.place)}</dd><dt>교육</dt><dd>${e(s.education)}</dd><dt>문해력</dt><dd>${e(LITERACY[literacyOf(s)])}</dd><dt>자녀</dt><dd>${s.relations.filter(r => r.role === '자녀').length}명</dd><dt>사건</dt><dd>좋은 일 ${s.eventTally.good} · 보통 ${s.eventTally.normal} · 나쁜 일 ${s.eventTally.bad}</dd>`;
    // Controls
    $('pauseButton').innerHTML = s.runtime.paused || s.dead ? '▸<span class="wide"> 계속</span>' : '❚❚<span class="wide"> 멈춤</span>';
    $('pauseButton').setAttribute('aria-label', s.runtime.paused ? '계속 진행' : '일시정지');
    $('pauseButton').disabled = s.dead || !!s.decision;
    $('skipButton').disabled = s.dead || !!s.decision;
    doc.querySelectorAll('[data-speed]').forEach(b => {
      const on = Number(b.dataset.speed) === s.runtime.speed;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); b.disabled = s.dead;
    });
    $('summaryCard').hidden = !s.dead;
    if (s.dead && summaryKey !== s.name + s.year + s.log.length) { summaryKey = s.name + s.year + s.log.length; renderSummary(s); }
    // Decision
    $('overlay').hidden = !s.decision || s.dead;
    $('app').inert = !!s.decision && !s.dead; $('topbar').inert = !!s.decision && !s.dead;
    if (s.decision && !s.dead && (s.decision !== shownDecision || s.decisionResult !== shownResult || renderedState !== s)) {
      const d = decisions.find(x => x.id === s.decision), result = s.decisionResult;
      if (!shownDecision) previousFocus = doc.activeElement;
      $('decisionSprite').src = spriteURL(doc, characterLook(s));
      $('decisionPill').textContent = d.historic ? `역사의 현장 · ${s.year}년 ${s.month}월` : `중대 결정 · ${decisionDomain(d)}`;
      $('decisionPill').classList.toggle('historic', !!d.historic);
      $('decisionMeta').textContent = decisionContext(s);
      $('decisionTitle').textContent = d.title;
      $('decisionText').textContent = decisionText(s, d);
      $('decisionSituation').hidden = !!result; $('decisionChoices').hidden = !!result; $('decisionResult').hidden = !result;
      $('choiceStep').classList.toggle('on', !result); $('resultStep').classList.toggle('on', !!result);
      $('choiceStep').setAttribute('aria-current', result ? 'false' : 'step'); $('resultStep').setAttribute('aria-current', result ? 'step' : 'false');
      $('decisionChoices').replaceChildren();
      if (result) {
        const choice = d.choices[result.choiceIndex], outcome = outcomeFor(choice, result.outcomeId);
        $('resultChoice').textContent = `나의 선택 · ${choice.label}`;
        $('resultTitle').textContent = outcome.title; $('resultText').textContent = outcome.result;
        $('resultChanges').replaceChildren();
        for (const k of STAT_KEYS) {
          const delta = s.stats[k] - result.statsBefore[k]; if (!delta) continue;
          const li = doc.createElement('li'); li.className = delta > 0 ? 'up' : 'down';
          li.textContent = `${k} ${delta > 0 ? '+' : ''}${Number(delta.toFixed(2))}`; $('resultChanges').appendChild(li);
        }
        $('resultLearning').hidden = d.id !== 'school';
        $('resultLearning').textContent = `교육: ${s.education === '미정' ? '아직 정규 교육을 시작하지 않음' : s.education} · 가업 친숙도: ${s.experience.familyTrade}`;
        $('decisionHint').textContent = s.runtime.paused ? '결과를 확인한 뒤에도 일시정지를 유지합니다.' : `결과를 확인하면 ${s.runtime.speed}배속으로 삶이 이어집니다.`;
        $('resultTitle').focus({preventScroll:true});
      } else {
        $('decisionHint').textContent = '선택한 뒤 결과를 확인할 때까지 시간이 멈춥니다.';
        d.choices.forEach((choice, i) => {
          const b = doc.createElement('button'); b.className = 'choice';
          const gaps = requirementGaps(s, choice), need = requirementLabel(choice);
          b.disabled = gaps.length > 0;
          b.innerHTML = `<span class="n">${gaps.length ? '🔒' : i+1}</span><span><span class="choice-label">${e(choice.label)}</span>${choice.preview ? `<span class="choice-preview">가능한 결과 · ${e(choice.preview)}</span>` : ''}${need ? `<span class="choice-req ${gaps.length ? 'no' : 'ok'}">${gaps.length ? '필요: ' + e(gaps.join(' · ')) : '✓ 조건 충족 · ' + e(need)}</span>` : ''}</span>`;
          b.addEventListener('click', () => { if (!b.disabled && engine.state?.decision === d.id && !engine.state.decisionResult) handlers.choose(i); });
          $('decisionChoices').appendChild(b);
        });
        $('decisionTitle').focus({preventScroll:true});
      }
      $('overlay').querySelector('.modal').scrollTop = 0;
    } else if (!s.decision && shownDecision) {
      if (previousFocus?.isConnected && !previousFocus.disabled && !previousFocus.closest('[hidden]')) previousFocus.focus({preventScroll:true});
    }
    shownDecision = s.decision; shownResult = s.decisionResult; renderedState = s;
    renderProgress();
  }
  function trapFocus(event) {
    if (event.key === 'Escape') { $('menu').hidden = true; $('menuButton').setAttribute('aria-expanded','false'); }
    if (event.key !== 'Tab' || $('overlay').hidden) return;
    const buttons = engine.state?.decisionResult ? [$('continueDecision')] : [...$('decisionChoices').querySelectorAll('button')];
    const first = buttons[0], last = buttons.at(-1);
    if (!buttons.includes(doc.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
    else if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  doc.addEventListener('keydown', trapFocus);
  $('history').addEventListener('click', ev => { const row = ev.target.closest('.row'); if (row) handlers.toggleStar(Number(row.dataset.i)); });
  $('history').addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList.contains('row')) { ev.preventDefault(); handlers.toggleStar(Number(ev.target.dataset.i)); } });
  $('starFilter').addEventListener('click', () => {
    starOnly = !starOnly; $('starFilter').setAttribute('aria-pressed', String(starOnly));
    $('starFilter').textContent = starOnly ? '★ 별표만 보는 중 · 전체 보기' : '최근 순 · 줄을 누르면 ☆';
    if (engine.state) renderHistory(engine.state, true);
  });
  $('focusChips').addEventListener('click', ev => { const b = ev.target.closest('[data-focus]'); if (b) handlers.setFocus(b.dataset.focus); });
  $('sceneCaption').addEventListener('click', () => {
    const open = $('sceneDetail').hidden; $('sceneDetail').hidden = !open; $('sceneCaption').setAttribute('aria-expanded', String(open));
  });
  const onResize = () => { scene.resize(); if (spec) spec.drawn = false; if (introScene) introScene.resize(); renderProgress(); };
  globalThis.addEventListener('resize', onResize);
  $('birthYear').addEventListener('input', () => { handlers.setBorn(Number($('birthYear').value)); renderBirthPick(); });
  doc.querySelectorAll('[data-born]').forEach(b => b.addEventListener('click', () => { handlers.setBorn(b.dataset.born === 'random' ? null : Number(b.dataset.born)); renderBirthPick(); }));
  return {render, renderProgress, showBirth, setChoosing(v) { choosing = v; render(); }, get choosing() { return choosing; }, notify(message) {
    $('notice').textContent = message; $('notice').hidden = false;
    clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { $('notice').hidden = true; }, 6000);
  }, dispose() { clearTimeout(noticeTimer); doc.removeEventListener('keydown', trapFocus); globalThis.removeEventListener('resize', onResize); }};
}
