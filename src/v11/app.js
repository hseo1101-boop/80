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
    else controller.choose(Math.floor(Math.random() * decisions.find(d => d.id === st.decision).choices.length));
  }, engine.state.decisionResult ? 2200 : 1400);
}
function render() { ui.render(); syncToggles(); autoDecide(); }
function syncToggles() {
  for (const id of ['autoButton','autoMenu']) { const b = document.getElementById(id); b.classList.toggle('on', !!prefs.auto); b.setAttribute('aria-pressed', String(!!prefs.auto)); }
  for (const id of ['musicButton','musicMenu']) { const b = document.getElementById(id); b.classList.toggle('on', music.on); b.setAttribute('aria-pressed', String(music.on)); }
}
const clock = new GameClock(engine, {onFrame:ui.renderProgress, onChange:() => {
  controller.changed(); if (engine.state?.dead) clock.stop();
}});
controller = createController({engine, clock, render, notify:ui.notify,
  storage:() => window.localStorage, confirm:message => window.confirm(message)});
function closeMenu() { document.getElementById('menu').hidden = true; document.getElementById('menuButton').setAttribute('aria-expanded', 'false'); }
const actions = {
  newLife:() => {
    const born = Number.isInteger(prefs.born) ? prefs.born : undefined;
    if (controller.newLife(null, {born})) ui.setChoosing(false);
  },
  schoolStory:() => { if (controller.newLife('school')) ui.setChoosing(false); },
  chooseLife:() => { clock.stop(); ui.setChoosing(true); window.scrollTo(0, 0); },
  backToLife:() => { ui.setChoosing(false); if (engine.state && !engine.state.dead) { clock.reset(); clock.start(); } },
  continueDecision:() => controller.continueDecision(), togglePause:() => controller.togglePause(),
  skipToDecision:() => controller.skipToDecision(),
  saveGame:() => controller.saveGame(), loadGame:() => controller.loadGame(),
  importGame:() => document.getElementById('importFile').click(),
  toggleMenu:() => { const m = document.getElementById('menu'); m.hidden = !m.hidden; document.getElementById('menuButton').setAttribute('aria-expanded', String(!m.hidden)); },
  toggleAuto:() => { prefs.auto = !prefs.auto; savePrefs(); ui.notify(prefs.auto ? '자동 결정: 중대 결정을 무작위로 고르고 결과를 확인합니다.' : '자동 결정을 껐습니다.'); syncToggles(); autoDecide(); },
  toggleMusic:() => { if (music.on) music.stop(); else music.start(); prefs.music = music.on; savePrefs(); syncToggles(); },
  openFocus:() => { const c = document.getElementById('focusCard'); c.classList.toggle('open'); if (c.classList.contains('open')) c.scrollIntoView({block:'nearest', behavior:'smooth'}); },
  exportGame:() => {
    const raw = controller.exportSave();
    if (!raw) return;
    const url = URL.createObjectURL(new Blob([raw], {type:'application/json'}));
    const link = document.createElement('a'); link.href = url;
    link.download = `french-life-${engine.state.year}-${engine.state.month}.json`;
    link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    ui.notify('저장 파일을 내보냈습니다. 다른 브라우저에서는 파일 가져오기를 사용하세요.');
  }
};
document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (button) { if (button.closest('#menu')) closeMenu(); actions[button.dataset.action]?.(); return; }
  if (!event.target.closest('#menu')) closeMenu();
});
document.querySelectorAll('[data-speed]').forEach(button => button.addEventListener('click', () => controller.setSpeed(Number(button.dataset.speed))));
document.addEventListener('keydown', event => {
  if (event.target.closest('input,textarea') || !engine.state || !document.getElementById('overlay').hidden) return;
  if (event.key === ' ' && !event.target.closest('button,[tabindex]')) { event.preventDefault(); controller.togglePause(); }
});
document.getElementById('importFile').addEventListener('change', async event => {
  const file = event.target.files[0];
  try {
    if (file && file.size > MAX_SAVE_BYTES) ui.notify('저장 파일이 너무 큽니다. 2 MiB 이하 파일을 선택해 주세요.');
    else if (file) controller.importSave(await file.text());
  } catch { ui.notify('파일을 읽지 못했습니다. 파일 권한을 확인해 주세요.'); }
  finally { event.target.value = ''; }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { controller.autosave(); clock.stop(); }
  else if (engine.state && !engine.state.dead && !ui.choosing) clock.start();
});
window.addEventListener('pagehide', () => { controller.autosave(); clock.stop(); });
window.addEventListener('pageshow', () => { if (engine.state && !engine.state.dead && !document.hidden && !ui.choosing) clock.start(); });
if (/[?&]debug\b/.test(location.search)) globalThis.__FL = {engine, createState, castOf, sceneSpec, createScene, characterLook, spriteURL, portraitURL, controller};
render();
