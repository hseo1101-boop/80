// src/guestbook.js — 플레이어 이야기 방명록
// Stories are submitted through a Google Form (no login) and read back from the form's response sheet,
// published to the web as CSV. Shared by the game's start screen and community.html.
//
// ───────── 설정 (구글 설문/시트를 만든 뒤 채우세요) ─────────
// csv:     응답 시트 → 파일 → 공유 → 웹에 게시 → 'CSV'로 게시한 주소 (…/pub?output=csv)
// form:    이야기를 남기는 구글 설문 주소 (…/viewform)
// prefill: 설문의 '미리 채워진 링크 가져오기'로 만든 주소. 닉네임 칸에 NAME, 인물 칸에 LIFE,
//          이야기 칸에 STORY 라고 적고 링크를 만들면, 게임이 그 자리에 생애 요약을 채워 넣습니다.
// 시트 맨 오른쪽에 '숨김' 열을 추가하고 아무 글자나 적으면 그 줄은 방명록에 나오지 않습니다.
const GUESTBOOK = {
  csv: '',
  form: '',
  prefill: ''
};

function guestbookParseCSV(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}
// Columns are found by their header words, so the form's questions can be worded freely.
function guestbookEntries(text) {
  const [head = [], ...rows] = guestbookParseCSV(text);
  const col = re => head.findIndex(h => re.test(h));
  const iTime = col(/타임스탬프|timestamp/i), iName = col(/닉네임|이름|name/i), iLife = col(/인물|삶|life/i),
    iStory = col(/이야기|story|내용/i), iHide = col(/숨김|hide/i);
  return rows.filter(r => iHide < 0 || !(r[iHide] || '').trim()).map(r => ({
    time:(r[iTime] || '').trim(), name:(r[iName] || '').trim() || '이름 없는 여행자',
    life:(r[iLife] || '').trim(), story:(r[iStory] || '').trim()
  })).filter(x => x.story || x.life).reverse();
}
function guestbookDate(t) {
  const m = t.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  return m ? `${m[1]}.${m[2].padStart(2, '0')}.${m[3].padStart(2, '0')}` : '';
}
// Renders into `box` (a list element). Text is set with textContent: entries are untrusted.
// The claude.ai copy of the game cannot reach Google (its page policy blocks it); it links to the website instead.
const GUESTBOOK_EMBEDDED = false;
const GUESTBOOK_SITE = 'https://hseo1101-boop.github.io/80/';
function guestbookMount({box, status, more, write}, limit = 6) {
  if (write) { write.hidden = !GUESTBOOK.form; if (GUESTBOOK.form) write.href = GUESTBOOK.form; }
  if (GUESTBOOK_EMBEDDED) {
    status.textContent = '방명록은 게임 웹사이트에서 볼 수 있습니다. ';
    const a = document.createElement('a'); a.href = GUESTBOOK_SITE; a.target = '_blank'; a.rel = 'noopener'; a.textContent = '웹사이트에서 보기 →';
    status.append(a); return;
  }
  // Until the sheet is set up, the start screen hides the guestbook rather than showing an empty box.
  if (!GUESTBOOK.csv) { const sec = box.closest('#guestbook'); if (sec) sec.hidden = true; else status.textContent = '방명록을 준비하고 있습니다.'; return; }
  status.textContent = '이야기를 불러오는 중…';
  const timer = setTimeout(() => { status.textContent = '방명록을 불러오지 못했습니다. 잠시 뒤 다시 열어 주세요.'; }, 10000);
  fetch(GUESTBOOK.csv, {cache:'no-cache'}).then(r => r.ok ? r.text() : Promise.reject(r.status)).then(text => {
    clearTimeout(timer);
    const all = guestbookEntries(text);
    box.replaceChildren();
    let shown = 0;
    const draw = () => {
      for (const x of all.slice(shown, shown + limit)) {
        const li = document.createElement('li'); li.className = 'gb-entry';
        const top = document.createElement('div'); top.className = 'gb-top';
        const who = document.createElement('b'); who.textContent = x.name;
        const when = document.createElement('time'); when.textContent = guestbookDate(x.time);
        top.append(who, when); li.append(top);
        if (x.life) { const life = document.createElement('p'); life.className = 'gb-life'; life.textContent = x.life; li.append(life); }
        if (x.story) { const st = document.createElement('p'); st.className = 'gb-story'; st.textContent = x.story; li.append(st); }
        box.append(li);
      }
      shown += limit;
      if (more) more.hidden = shown >= all.length;
    };
    status.textContent = all.length ? `${all.length}개의 삶이 이곳에 남아 있습니다.` : '아직 남겨진 이야기가 없습니다. 첫 이야기를 남겨 주세요.';
    if (more) more.onclick = draw;
    draw();
  }).catch(() => { clearTimeout(timer); status.textContent = '방명록을 불러오지 못했습니다. 잠시 뒤 다시 열어 주세요.'; });
}
// A form link with this life filled in, when a prefill template is set.
function guestbookShareURL(name, life, story) {
  if (!GUESTBOOK.prefill) return GUESTBOOK.form || '';
  return GUESTBOOK.prefill.replace('NAME', encodeURIComponent(name)).replace('LIFE', encodeURIComponent(life)).replace('STORY', encodeURIComponent(story));
}
