// src/music.js
// A public-domain minuet (Petzold, Minuet in G, 1725) played as a soft harpsichord-like chiptune.
function createMusic() {
  const N = n => 440 * Math.pow(2, (n - 69) / 12);
  const [G3,A3,B3,C4,D4,E4,Fs4,G4,A4,B4,C5,D5,E5,Fs5,G5,D3,G2,Fs3] = [55,57,59,60,62,64,66,67,69,71,72,74,76,78,79,50,43,54];
  const A = [[D5,2],[G4,1],[A4,1],[B4,1],[C5,1],[D5,2],[G4,2],[G4,2],[E5,2],[C5,1],[D5,1],[E5,1],[Fs5,1],[G5,2],[G4,2],[G4,2],
    [C5,2],[D5,1],[C5,1],[B4,1],[A4,1],[B4,2],[C5,1],[B4,1],[A4,1],[G4,1],[Fs4,2],[G4,1],[A4,1],[B4,1],[G4,1],[A4,6]];
  const B = [...A.slice(0, 26), [A4,2],[B4,1],[A4,1],[G4,1],[Fs4,1],[G4,6]];
  const melody = [...A, ...B];
  const bassRoots = [G3,B3,C4,B3,A3,G3,D3,Fs3, G3,B3,C4,B3,A3,G3,D3,G2];
  const beat = 0.42;
  let ctx = null, timer = null, nextTime = 0, step = 0, bar = 0, master = null;
  function pluck(freq, when, dur, gain, type) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, when); g.gain.exponentialRampToValueAtTime(gain, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + Math.min(1.4, dur*1.3));
    o.connect(g).connect(master); o.start(when); o.stop(when + dur*1.4 + 0.05);
  }
  function schedule() {
    while (nextTime < ctx.currentTime + 0.4) {
      const [note, eighths] = melody[step], dur = eighths * beat / 2;
      pluck(N(note), nextTime, dur, 0.07, 'square');
      pluck(N(note + 12), nextTime, dur*0.6, 0.015, 'triangle');
      const pos = melody.slice(0, step).reduce((n, [,e]) => n + e, 0);
      if (pos % 6 === 0) { const r = bassRoots[(pos/6) % 16]; pluck(N(r), nextTime, beat*3, 0.09, 'triangle'); }
      nextTime += dur; step = (step + 1) % melody.length;
    }
  }
  return {
    get on() { return !!timer; },
    start() {
      ctx ??= new (globalThis.AudioContext || globalThis.webkitAudioContext)();
      ctx.resume();
      master = ctx.createGain(); master.gain.value = 0.6; master.connect(ctx.destination);
      nextTime = ctx.currentTime + 0.1; step = 0;
      timer = setInterval(schedule, 120); schedule();
    },
    stop() { clearInterval(timer); timer = null; if (master) { master.gain.setTargetAtTime(0, ctx.currentTime, 0.05); master = null; } }
  };
}

// src/app.js
const engine = new GameEngine();
let controller;
const prefs = (() => { try { return JSON.parse(localStorage.getItem('franceLife.prefs')) || {}; } catch { return {}; } })();
// Light is the default; dark is chosen from the menu and remembered per browser.
const applyTheme = () => { if (prefs.theme === 'dark') document.documentElement.dataset.theme = 'dark'; else delete document.documentElement.dataset.theme; };
applyTheme();
const savePrefs = () => { try { localStorage.setItem('franceLife.prefs', JSON.stringify(prefs)); } catch { /* optional */ } };
const ui = createUI(document, engine, {
  choose:index => controller.choose(index), setFocus:id => controller.setFocus(id), toggleStar:i => controller.toggleStar(i),
  getBorn:() => Number.isInteger(prefs.born) ? prefs.born : null,
  setBorn:year => { prefs.born = Number.isInteger(year) ? year : null; savePrefs(); }
});
const music = createMusic();
let autoTimer = null;
function autoDecide() {
  clearTimeout(autoTimer);
  const s = engine.state;
  if (!prefs.auto || !s || s.dead || !s.decision || ui.choosing) return;
  autoTimer = setTimeout(() => {
    const st = engine.state;
    if (!prefs.auto || !st?.decision) return;
    if (st.decisionResult) controller.continueDecision();
    else {
      const open = decisions.find(d => d.id === st.decision).choices.map((c, i) => [c, i]).filter(([c]) => choiceAvailable(st, c));
      controller.choose(open[Math.floor(Math.random() * open.length)][1]);
    }
  }, engine.state.decisionResult ? 2200 : 1400);
}
function render() { ui.render(); syncToggles(); autoDecide(); syncIntro(); syncLinks(); const r = document.getElementById('resumeButton'); if (r) r.hidden = !!engine.state || !hasSave(); }
function syncToggles() {
  for (const id of ['autoButton','autoMenu']) { const b = document.getElementById(id); b.classList.toggle('on', !!prefs.auto); b.setAttribute('aria-pressed', String(!!prefs.auto)); }
  for (const id of ['musicButton','musicMenu']) { const b = document.getElementById(id); b.classList.toggle('on', music.on); b.setAttribute('aria-pressed', String(music.on)); }
  const t = document.getElementById('themeMenu'); t.textContent = prefs.theme === 'dark' ? '☀ 화이트 모드' : '🌙 다크 모드'; t.setAttribute('aria-pressed', String(prefs.theme === 'dark'));
}
// In-page confirmation. Browsers inside embedded viewers block window.confirm, so every replacing
// action asks here first and then runs with the controller's confirm answering yes.
let confirmed = false;
const $id = id => document.getElementById(id);
function ask(message, yesLabel, run) {
  $id('askText').textContent = message; $id('askYes').textContent = yesLabel;
  $id('askOverlay').hidden = false; $id('askYes').focus();
  $id('askYes').onclick = () => { $id('askOverlay').hidden = true; confirmed = true; try { run(); } finally { confirmed = false; } };
  $id('askNo').onclick = () => { $id('askOverlay').hidden = true; };
}
function guarded(message, yesLabel, run) {
  if (!engine.state || engine.state.dead) { confirmed = true; try { run(); } finally { confirmed = false; } }
  else ask(message, yesLabel, run);
}
function hasSave() {
  try { return !!(localStorage.getItem(AUTO_KEY) || localStorage.getItem(SAVE_KEY)); } catch { return false; }
}
function openSaveSheet(mode) {
  const exporting = mode === 'export';
  $id('saveTitle').textContent = exporting ? '저장 코드 내보내기' : '저장 코드 가져오기';
  $id('saveHelp').textContent = exporting
    ? '아래 코드를 복사해 두면 다른 기기나 브라우저에서 ‘저장 코드 가져오기’로 이어 할 수 있습니다.'
    : '복사해 둔 저장 코드를 붙여 넣거나, 내보낸 저장 파일(.json)을 고르세요.';
  $id('saveCode').value = exporting ? controller.exportSave() || '' : '';
  $id('saveCode').readOnly = exporting;
  for (const id of ['saveCopy','saveFile']) $id(id).hidden = !exporting || $id(id).dataset.off === '1';
  for (const id of ['savePick','saveLoad']) $id(id).hidden = exporting;
  $id('saveStatus').textContent = '';
  $id('saveOverlay').hidden = false;
  (exporting ? $id('saveCopy') : $id('saveCode')).focus();
}
function importText(raw) {
  guarded('저장 코드의 기록으로 지금의 인생을 바꿀까요? 지금 인생은 자동 저장되어 있지만 덮어쓰게 됩니다.', '불러오기', () => {
    if (controller.importSave(raw)) { $id('saveOverlay').hidden = true; ui.setChoosing(false); }
  });
}
// The birth card pauses time until the player starts the life.
function startWithBirth() {
  if (!engine.state || prefs.auto) return;
  engine.state.runtime.paused = true; ui.render(); ui.showBirth();
  const real = REAL_LIVES[engine.state.familyEvents.real];
  if (real) $id('birthLead').textContent = `✦ 실존 인물로 태어났습니다. ${real.intro} 기록된 갈림길마다 역사대로 걸을지, 다른 길로 갈지 고르게 됩니다.`;
}
// Community links: updates, feedback (GitHub issue forms) and player stories (GitHub Discussions).
const GAME_VERSION = 'v0.26';
const REPO = 'https://github.com/hseo1101-boop/80';
const COMMUNITY = 'https://hseo1101-boop.github.io/80/community.html';
const FEEDBACK_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeyCERoyi6MDFP7AsavCBa0jtS6gw_L-xLUGlUm-UKf91nadQ/viewform?usp=header';
function lifeLabel(s) { return s ? `${s.name}, ${s.born} ${s.place} · ${s.job}, ${ageOf(s)}세` : ''; }
function syncLinks() {
  $id('linkFeedback').href = FEEDBACK_FORM;
  const s = engine.state;
  $id('linkUpdates').href = `${COMMUNITY}#updates`;
  $id('linkStories').href = `${COMMUNITY}#stories`;
  const fresh = prefs.seenVersion !== GAME_VERSION;
  $id('newsDot').hidden = !fresh; $id('menuDot').hidden = !fresh;
  $id('gameVersion').textContent = GAME_VERSION;
  gbSyncShare(s);
  syncArchive(s);
}
// 남겨진 묘비명: the start-screen list, the "모두 보기" sheet and the end-of-life share box.
const SITE_LINK = () => { const a = document.createElement('a'); a.href = GUESTBOOK_SITE; a.target = '_blank'; a.rel = 'noopener'; a.textContent = '웹사이트에서 보기 →'; return a; };
function gbStatus(el, text, link) { el.replaceChildren(text); if (link) el.append(' ', SITE_LINK()); el.hidden = !text && !link; }
const gbReportAsk = run => ask('이 글을 신고할까요? 신고가 쌓이면 모두에게서 가려지고, 이 브라우저에서는 바로 사라집니다.', '신고하기', run);
let gbPosts = [];
function gbShowPreview() {
  const status = $id('gbStatus'), list = $id('gbList'), all = $id('gbAll');
  if (GUESTBOOK_EMBEDDED) { gbStatus(status, '다른 사람들이 세운 비석은 게임 웹사이트에서 볼 수 있어요.', true); return; }
  if (!gbReady()) { gbStatus(status, '곧 열립니다. 생애를 마치면 그 삶의 묘비에 한 줄을 새길 수 있게 됩니다.'); return; }
  gbStatus(status, '불러오는 중…');
  gbLoad().then(posts => {
    if (posts === 'error' || !posts) { gbStatus(status, '지금은 불러오지 못했어요. 잠시 뒤에 다시 열어 주세요.'); return; }
    gbPosts = posts;
    gbStatus(status, posts.length ? '' : '아직 세워진 비석이 없어요. 생애를 마치고 첫 비석을 세워 주세요.');
    gbRenderList(list, posts, {limit:3, onReport:gbReportAsk});
    all.hidden = posts.length <= 3; all.textContent = `모두 보기 (${posts.length}) →`;
  });
}
function gbOpenAll() {
  $id('gbOverlay').hidden = false; $id('gbClose').focus();
  gbStatus($id('gbAllStatus'), gbPosts.length ? '' : '아직 세워진 비석이 없어요.');
  gbRenderList($id('gbAllList'), gbPosts, {limit:200, onReport:gbReportAsk});
}
function gbCloseAll() { $id('gbOverlay').hidden = true; gbRenderList($id('gbList'), gbPosts, {limit:3, onReport:gbReportAsk}); }
const gbLifeKey = s => `${s.name}|${s.born}|${s.year}|${s.month}`;
const gbMeta = s => `${s.born}–${s.year} · 프랑스 ${s.place.replace(' 농촌', '')} · ${s.sex === '여성' ? '여자' : '남자'} · ${ageOf(s)}세`;
let gbShownFor = '';
function gbSyncShare(s) {
  const box = $id('gbShare');
  if (!s?.dead || (!gbReady() && !GUESTBOOK_EMBEDDED)) { box.hidden = true; gbShownFor = ''; return; }
  const key = gbLifeKey(s);
  if (gbShownFor === key) return;
  gbShownFor = key; box.hidden = false;
  const who = $id('gbWho'); who.replaceChildren();
  who.textContent = gbMeta(s).replace(/^\S+ · /, '');
  $id('gbStoneName').textContent = s.name; $id('gbStoneYears').textContent = `${s.born} – ${s.year}`; $id('gbStoneText').textContent = '';
  const shared = gbStore.get('shared', []).includes(key);
  $id('gbForm').hidden = shared || GUESTBOOK_EMBEDDED;
  $id('gbQuote').value = ''; $id('gbCount').textContent = `0/${GB_QUOTE_MAX}`; $id('gbErr').hidden = true; $id('gbSend').disabled = false;
  const done = $id('gbDone');
  if (GUESTBOOK_EMBEDDED) gbStatus(done, '비석은 게임 웹사이트에서 세울 수 있어요.', true);
  else gbStatus(done, shared ? '이 삶의 비석은 이미 세웠어요. 시작 화면의 ‘남겨진 묘비명’에서 볼 수 있어요.' : '');
}
function gbSubmit() {
  const s = engine.state; if (!s?.dead) return;
  const quote = $id('gbQuote').value.trim(), problem = gbCheckQuote(quote), err = $id('gbErr');
  err.textContent = problem; err.hidden = !problem;
  if (problem) { $id('gbQuote').focus(); return; }
  $id('gbSend').disabled = true;
  const key = gbLifeKey(s);
  gbShare({name:s.name, meta:gbMeta(s), life:gbLifeText(s, lifeReport(s)), quote})
    .then(() => {
      const shared = gbStore.get('shared', []); shared.push(key); gbStore.set('shared', shared.slice(-100));
      $id('gbForm').hidden = true;
      gbStatus($id('gbDone'), '비석을 세웠습니다. 시작 화면의 ‘남겨진 묘비명’에 놓였어요.');
      gbShowPreview();
    })
    .catch(() => { err.textContent = '보내지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.'; err.hidden = false; $id('gbSend').disabled = false; });
}
$id('gbQuote').addEventListener('input', e => { $id('gbStoneText').textContent = e.target.value; $id('gbCount').textContent = `${e.target.value.length}/${GB_QUOTE_MAX}`; $id('gbErr').hidden = true; });
$id('gbSend').addEventListener('click', gbSubmit);
$id('gbAll').addEventListener('click', gbOpenAll);
$id('gbClose').addEventListener('click', gbCloseAll);
$id('gbOverlay').addEventListener('click', e => { if (e.target.id === 'gbOverlay') gbCloseAll(); });
// 나의 연대기: progress across lives, one scene to aim for, the codex, and what this life added.
let chronTarget = null, archiveShownFor = '';
function renderChronicle() {
  const a = archiveLoad();
  const realsMet = Object.keys(a.reals).length;
  $id('chronSub').textContent = a.lives ? `지금까지 ${a.lives}번의 삶을 살았습니다. 가장 오래 산 삶은 ${a.longest}세였습니다.${realsMet ? ` 실존 인물로 ${realsMet}번 태어났습니다.` : ''}`
    : '삶을 마칠 때마다 만난 역사의 현장과 인물, 오른 직업이 여기에 쌓입니다.';
  $id('chronGrid').innerHTML = archiveCounts(a).map(([label, n, total]) =>
    `<div class="chron-stat"><small>${label}</small><b>${n}<i> / ${total}</i></b><div class="chron-bar"><span style="width:${Math.round(n / total * 100)}%"></span></div></div>`).join('');
  if (!chronTarget || a.scenes[chronTarget.id]) chronTarget = archiveTarget(a);
  $id('chronTarget').hidden = !chronTarget;
  if (chronTarget) {
    const d = chronTarget, b = sceneBirth(d), who = sceneWho(d);
    const p = $id('chronTargetText'); p.replaceChildren();
    const t = document.createElement('b'); t.textContent = `${d.when.fromDate[0]}년 ${d.when.fromDate[1]}월 · ${scenePlace(d)}`;
    const sm = document.createElement('small'); sm.textContent = `아직 보지 못한 장면이 기다립니다${who ? ` (${who})` : ''}. ${b.born}년${b.family ? ` ${b.family.place.replace(' 농촌', ' 시골')}의 ${b.family.class} 집안` : ''}에 태어나면 닿을 수 있을지도 모릅니다.`;
    p.append(t, sm);
  }
}
function openCodex(tab = 'scenes') {
  const a = archiveLoad(), list = $id('codexList'); list.replaceChildren();
  document.querySelectorAll('[data-codex]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.codex === tab)));
  const row = (seen, when, title, sub, reveal = false) => {
    const li = document.createElement('li'); li.className = seen ? '' : 'unseen';
    const w = document.createElement('span'); w.className = 'when'; w.textContent = when;
    const body = document.createElement('div'); const b = document.createElement('b'); b.textContent = seen || reveal ? title : '???';
    const small = document.createElement('small'); small.textContent = sub; body.append(b, small);
    li.append(w, body); list.append(li);
  };
  let n = 0, total = 0;
  if (tab === 'scenes') for (const d of HISTORIC) { const seen = !!a.scenes[d.id]; n += seen; total++;
    row(seen, `${d.when.fromDate[0]}.${String(d.when.fromDate[1]).padStart(2, '0')}`, d.title, [scenePlace(d), sceneWho(d)].filter(Boolean).join(' · ')); }
  if (tab === 'figures') for (const [id, f] of Object.entries(FIGURES)) { const seen = !!a.figures[id]; n += seen; total++;
    row(seen, `${f.born[0]}`, f.name, seen ? f.job : '이 시대의 이름난 인물'); }
  if (tab === 'careers') for (const [id, c] of Object.entries(CAREERS)) { const seen = !!a.careers[id]; n += seen; total++;
    row(seen, '', c.label, seen ? c.ranks.map(r => r.label).join(' → ') : `${c.ranks.length}단계의 길`); }
  if (tab === 'births') for (const k of BIRTHPLACES) { const [place, cls] = k.split('|'); const seen = !!a.births[k]; n += seen; total++;
    row(seen, seen ? '✓' : '', `${place} · ${cls}`, seen ? '이곳에서 태어나 보았습니다' : '아직 이곳에서 태어난 적이 없습니다', true); }
  if (tab === 'reals') for (const [id, p] of Object.entries(REAL_LIVES).sort((x, y) => x[1].born[0] - y[1].born[0])) { const got = a.reals[id]; n += !!got; total++;
    row(!!got, `${p.born[0]}`, p.name, got ? (got === 'kept' ? '기록된 그대로 살아 냈습니다' : '태어났지만 다른 길을 걸었습니다') : `${p.place.replace(' 농촌', ' 시골')} · ${p.sex === '여성' ? '여성' : '남성'} · 아주 드물게, 무작위 출생으로만 만날 수 있습니다`); }
  $id('codexNote').textContent = `${total}개 가운데 ${n}개를 찾았습니다.${tab === 'scenes' ? ' 보지 못한 장면은 때와 곳만 보입니다.' : tab === 'reals' ? ' 무작위로 태어날 때 약 200번에 한 번, 역사에 이름을 남긴 사람으로 태어납니다.' : ''}`;
  $id('codexOverlay').hidden = false; $id('codexClose').focus();
}
function syncArchive(s) {
  $id('decisionNew').hidden = !(s?.decision && !s.decisionResult && (d => d?.historic && !d.realLife)(decisions.find(d => d.id === s.decision)) && sceneIsNew(s.decision));
  const box = $id('summaryArchive');
  if (!s?.dead) { box.hidden = true; archiveShownFor = ''; return; }
  const key = lifeKey(s); if (archiveShownFor === key) return;
  archiveShownFor = key;
  const fresh = archiveRecord(s);
  const items = [...fresh.scenes.map(id => `역사의 현장 · ${HISTORIC.find(d => d.id === id)?.title}`),
    ...fresh.figures.map(id => `인물 · ${FIGURES[id].name}`), ...fresh.careers.map(id => `직업 · ${CAREERS[id].label}`),
    ...(fresh.birth ? [`태어난 곳 · ${lifeTouches(s).birthPlace} ${s.class}`] : []), ...(fresh.real ? [`실존 인물 · ${REAL_LIVES[fresh.real].name}`] : [])];
  box.hidden = false;
  $id('summaryArchiveText').textContent = items.length ? `이번 삶으로 연대기에 ${items.length}개가 새로 남았습니다.` : '이번 삶에서는 새로 남은 기록이 없습니다. 다른 때, 다른 곳에서 태어나 보세요.';
  $id('summaryArchiveList').innerHTML = items.map(x => `<li>${x.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</li>`).join('');
}
$id('codexOpen').addEventListener('click', () => openCodex('scenes'));
$id('codexClose').addEventListener('click', () => { $id('codexOverlay').hidden = true; });
$id('codexOverlay').addEventListener('click', e => { if (e.target.id === 'codexOverlay') $id('codexOverlay').hidden = true; const t = e.target.closest('[data-codex]'); if (t) openCodex(t.dataset.codex); });
$id('chronTargetGo').addEventListener('click', () => {
  if (!chronTarget) return;
  const b = sceneBirth(chronTarget);
  guarded(`${b.born}년에 새로 태어나면 지금 진행 중인 인생 기록이 바뀝니다. 계속할까요?`, '태어나기', () => {
    if (controller.newLife(null, {born:b.born, ...(b.family ? {family:b.family} : {})})) { prefs.played = true; savePrefs(); ui.setChoosing(false); startWithBirth(); }
  });
});
// Curated starts for a first life: a random birth is usually a peasant's life far from the great events.
const PRESETS = {
  paris1768:{label:'1768년 파리 이야기', born:1768, family:{place:'파리', class:'도시 평민'}},
  bordeaux1765:{label:'1765년 보르도 이야기', born:1765, family:{place:'보르도', class:'부르주아'}},
  lyon1805:{label:'1805년 리옹 이야기', born:1805, family:{place:'리옹', class:'도시 평민'}}
};
// First-time players see the curated starts first.
function syncIntro() {
  const first = !prefs.played && !hasSave();
  document.getElementById('intro').classList.toggle('first', first);
  document.getElementById('startsHint').hidden = !first;
  if (!engine.state || ui.choosing) renderChronicle();
  const starts = document.getElementById('starts'), pick = document.querySelector('.birth-pick');
  if (first && starts.nextElementSibling !== pick) pick.before(starts);
  if (!first && starts.previousElementSibling?.classList?.contains('btns') === false) document.querySelector('.intro-body').appendChild(starts);
}
const clock = new GameClock(engine, {onFrame:ui.renderProgress, onChange:() => {
  controller.changed(); if (engine.state?.dead) clock.stop();
}});
controller = createController({engine, clock, render, notify:ui.notify,
  storage:() => window.localStorage, confirm:() => confirmed});
function closeMenu() { document.getElementById('menu').hidden = true; document.getElementById('menuButton').setAttribute('aria-expanded', 'false'); }
const actions = {
  newLife:() => {
    const born = Number.isInteger(prefs.born) ? prefs.born : undefined;
    guarded('새 인생을 시작하면 지금 진행 중인 인생 기록이 새 인생으로 바뀝니다. 계속할까요?', '새 인생 시작', () => { if (controller.newLife(null, {born})) { prefs.played = true; savePrefs(); ui.setChoosing(false); startWithBirth(); } });
  },
  startPreset:button => {
    const preset = PRESETS[button?.dataset.preset]; if (!preset) return;
    guarded(`${preset.label}(으)로 시작하면 지금 진행 중인 인생 기록이 바뀝니다. 계속할까요?`, '이야기 시작', () => {
      if (controller.newLife(null, {born:preset.born, family:preset.family})) { prefs.played = true; savePrefs(); ui.setChoosing(false); startWithBirth(); }
    });
  },
  schoolStory:() => guarded('1778년 파리 이야기를 시작하면 지금 진행 중인 인생 기록이 바뀝니다. 계속할까요?', '이야기 시작', () => { if (controller.newLife('school')) { prefs.played = true; savePrefs(); ui.setChoosing(false); } }),
  chooseLife:() => { clock.stop(); ui.setChoosing(true); renderChronicle(); window.scrollTo(0, 0); },
  backToLife:() => { ui.setChoosing(false); if (engine.state && !engine.state.dead) { clock.reset(); clock.start(); } },
  continueDecision:() => controller.continueDecision(), togglePause:() => controller.togglePause(),
  skipToDecision:() => controller.skipToDecision(),
  saveGame:() => controller.saveGame(),
  loadGame:() => guarded('저장해 둔 기록을 불러오면 지금 진행 중인 인생이 그 기록으로 바뀝니다. 계속할까요?', '불러오기', () => { if (controller.loadGame()) ui.setChoosing(false); }),
  importGame:() => openSaveSheet('import'),
  toggleMenu:() => { const m = document.getElementById('menu'); m.hidden = !m.hidden; document.getElementById('menuButton').setAttribute('aria-expanded', String(!m.hidden)); },
  toggleAuto:() => { prefs.auto = !prefs.auto; savePrefs(); ui.notify(prefs.auto ? '자동 결정: 중대 결정을 무작위로 고르고 결과를 확인합니다.' : '자동 결정을 껐습니다.'); syncToggles(); autoDecide(); },
  toggleTheme:() => { prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark'; savePrefs(); applyTheme(); syncToggles(); },
  toggleMusic:() => { if (music.on) music.stop(); else music.start(); prefs.music = music.on; savePrefs(); syncToggles(); },
  openFocus:() => { const c = document.getElementById('focusCard'); c.classList.toggle('open'); if (c.classList.contains('open')) c.scrollIntoView({block:'nearest', behavior:'smooth'}); },
  exportGame:() => { if (engine.state) openSaveSheet('export'); }
};
document.addEventListener('click', event => {
  if (event.target.closest('#linkUpdates')) { prefs.seenVersion = GAME_VERSION; savePrefs(); syncLinks(); }
  const button = event.target.closest('[data-action]');
  if (button) { if (button.closest('#menu')) closeMenu(); actions[button.dataset.action]?.(button); return; }
  if (!event.target.closest('#menu')) closeMenu();
});
document.querySelectorAll('[data-speed]').forEach(button => button.addEventListener('click', () => controller.setSpeed(Number(button.dataset.speed))));
document.addEventListener('keydown', event => {
  if (event.target.closest('input,textarea') || !engine.state || !document.getElementById('overlay').hidden || !$id('askOverlay').hidden || !$id('saveOverlay').hidden || !$id('birthOverlay').hidden) return;
  if (event.key === ' ' && !event.target.closest('button,[tabindex]')) { event.preventDefault(); controller.togglePause(); }
});
document.getElementById('importFile').addEventListener('change', async event => {
  const file = event.target.files[0];
  try {
    if (file && file.size > MAX_SAVE_BYTES) ui.notify('저장 파일이 너무 큽니다. 2 MiB 이하 파일을 선택해 주세요.');
    else if (file) importText(await file.text());
  } catch { ui.notify('파일을 읽지 못했습니다. 파일 권한을 확인해 주세요.'); }
  finally { event.target.value = ''; }
});
$id('birthStart').addEventListener('click', () => { $id('birthOverlay').hidden = true; if (engine.state?.runtime.paused) controller.togglePause(); });
$id('shareSave')?.addEventListener('click', () => {
  const link = document.createElement('a'); link.href = $id('shareImage').src;
  link.download = `french-life-${engine.state?.name || 'life'}.png`; link.click();
});
$id('saveClose').addEventListener('click', () => { $id('saveOverlay').hidden = true; });
$id('savePick').addEventListener('click', () => $id('importFile').click());
$id('saveLoad').addEventListener('click', () => { const raw = $id('saveCode').value.trim(); if (raw) importText(raw); else $id('saveStatus').textContent = '붙여 넣은 저장 코드가 없습니다.'; });
$id('saveCopy').addEventListener('click', () => {
  const box = $id('saveCode');
  navigator.clipboard?.writeText(box.value).then(() => { $id('saveStatus').textContent = '복사했습니다.'; },
    () => { box.select(); $id('saveStatus').textContent = '복사가 막혀 있습니다. 선택된 코드를 직접 복사하세요.'; })
    ?? (box.select(), $id('saveStatus').textContent = '선택된 코드를 직접 복사하세요.');
});
$id('saveFile').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([$id('saveCode').value], {type:'application/json'}));
  const link = document.createElement('a'); link.href = url;
  link.download = `french-life-${engine.state?.year || ''}-${engine.state?.month || ''}.json`;
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  $id('saveStatus').textContent = '파일이 받아지지 않으면 코드를 복사해 두세요.';
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!$id('askOverlay').hidden) { $id('askOverlay').hidden = true; return; }
  if (!$id('gbOverlay').hidden) gbCloseAll();
  $id('codexOverlay').hidden = true;
  $id('saveOverlay').hidden = true;
  if (!$id('birthOverlay').hidden) $id('birthStart').click();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { controller.autosave(); clock.stop(); }
  else if (engine.state && !engine.state.dead && !ui.choosing) clock.start();
});
window.addEventListener('pagehide', () => { controller.autosave(); clock.stop(); });
window.addEventListener('pageshow', () => { if (engine.state && !engine.state.dead && !document.hidden && !ui.choosing) clock.start(); });
if (/[?&]debug\b/.test(location.search)) globalThis.__FL = {engine, createState, castOf, sceneSpec, createScene, characterLook, spriteURL, portraitURL, controller, render};
gbShowPreview();
render();
