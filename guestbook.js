// src/guestbook.js — 함께 나눈 삶
// Players share a finished life with one line of their own. No accounts and no server: posts, "기억해요"
// and reports are sent quietly to one Google Form, and everyone reads them back from the form's response
// sheet published to the web as CSV. Shared by the game (start screen, life summary) and community.html.
//
// ───────── 설정 ─────────
// csv:    응답 시트를 '링크가 있는 모든 사용자 · 뷰어'로 공유하고 …/d/<시트ID>/gviz/tq?tqx=out:csv (또는 웹에 게시한 CSV 주소)
// form:   설문 주소 (…/viewform). 게임이 …/formResponse로 바꿔 보냅니다.
// fields: 설문 질문 6개의 entry 번호. '미리 채워진 링크'에서 entry.123456789 꼴로 보입니다.
// 시트 맨 오른쪽에 '숨김' 열을 만들어 글자를 적으면 그 글은 내려갑니다. 신고가 3건 쌓여도 내려갑니다.
const GUESTBOOK = {
  csv: 'https://docs.google.com/spreadsheets/d/1wwfUjwVjdjkvY-czP8nHYAo6NWQkXX3RlSk10pSzb0A/gviz/tq?tqx=out:csv',
  form: 'https://docs.google.com/forms/d/e/1FAIpQLScj1Qr58lfbpLBjSGOmyy3_qeMP1QFl59kWzdz1QhKm5_7rLA/viewform',
  fields: {type:'', id:'', name:'', meta:'', life:'', quote:''}
};
const GUESTBOOK_EMBEDDED = false;   // the claude.ai copy cannot reach Google; it links to the website instead
const GUESTBOOK_SITE = 'https://hseo1101-boop.github.io/80/';
const GB_REPORT_LIMIT = 3;
const GB_QUOTE_MAX = 140;

const gbReady = () => !GUESTBOOK_EMBEDDED && !!GUESTBOOK.csv && !!GUESTBOOK.form && Object.values(GUESTBOOK.fields).every(Boolean);
const gbStore = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('franceLife.gb.' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('franceLife.gb.' + k, JSON.stringify(v)); } catch { /* optional */ } }
};

function gbParseCSV(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (c === '"') quoted = false; else field += c; }
    else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}
// Google writes timestamps in the sheet's locale ("2026. 11. 2 오후 3:10:00" or "11/2/2026 15:10:00").
function gbTime(t) {
  let m = t.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?\s*(오전|오후)?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) { let h = +m[5]; if (m[4] === '오후' && h < 12) h += 12; if (m[4] === '오전' && h === 12) h = 0; return new Date(+m[1], m[2] - 1, +m[3], h, +m[6], +(m[7] || 0)).getTime(); }
  m = t.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) return new Date(+m[3], m[1] - 1, +m[2], +m[4], +m[5], +(m[6] || 0)).getTime();
  const d = Date.parse(t); return Number.isNaN(d) ? 0 : d;
}
function gbAgo(ms) {
  if (!ms) return '';
  const s = Math.max(0, (Date.now() - ms) / 1000);
  if (s < 60) return '방금'; if (s < 3600) return `${Math.floor(s / 60)}분 전`; if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}일 전`;
  const d = new Date(ms); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
// One sheet holds stories, likes and reports; stories are folded together here.
function gbFold(text) {
  const [head = [], ...rows] = gbParseCSV(text);
  const col = re => head.findIndex(h => re.test(h.trim()));
  const c = {time:col(/타임스탬프|timestamp/i), type:col(/^종류|type/i), id:col(/글번호|^id$/i), name:col(/^인물|name/i),
    meta:col(/^정보|meta/i), life:col(/^삶|life/i), quote:col(/한마디|quote/i), hide:col(/숨김|hide/i)};
  const get = (r, k) => c[k] < 0 ? '' : (r[c[k]] || '').trim();
  const posts = new Map(), likes = {}, reports = {};
  for (const r of rows) {
    const type = get(r, 'type'), id = get(r, 'id');
    if (!id) continue;
    if (type === 'like') likes[id] = (likes[id] || 0) + 1;
    else if (type === 'report') reports[id] = (reports[id] || 0) + 1;
    else if (type === 'story' && !posts.has(id)) posts.set(id, {id, time:gbTime(get(r, 'time')), name:get(r, 'name'), meta:get(r, 'meta'),
      life:get(r, 'life'), quote:get(r, 'quote'), hidden:!!get(r, 'hide')});
  }
  // A just-shared post appears at once, before the published sheet catches up (it refreshes every few minutes).
  for (const p of gbStore.get('mine', [])) if (!posts.has(p.id)) posts.set(p.id, p);
  return [...posts.values()].filter(p => !p.hidden && (reports[p.id] || 0) < GB_REPORT_LIMIT)
    .map(p => ({...p, likes:likes[p.id] || 0})).sort((a, b) => b.time - a.time);
}
let gbCache = null;
function gbLoad() {
  if (!gbReady()) return Promise.resolve(null);
  if (gbCache) return gbCache;
  gbCache = Promise.race([
    fetch(GUESTBOOK.csv, {cache:'no-cache'}).then(r => r.ok ? r.text() : Promise.reject(r.status)).then(gbFold),
    new Promise((_, no) => setTimeout(() => no('timeout'), 10000))
  ]).catch(() => { gbCache = null; return 'error'; });
  return gbCache;
}
function gbSend(values) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) body.append(GUESTBOOK.fields[k], v);
  // Google Forms accepts a plain cross-site POST; the response is opaque, so success is assumed.
  return fetch(GUESTBOOK.form.replace(/\/viewform.*$/, '/formResponse'), {method:'POST', mode:'no-cors', body});
}
// Names, contacts and links are not allowed: the life speaks, not the player.
function gbCheckQuote(q) {
  if (!q.trim()) return '한마디를 적어 주세요.';
  if (q.length > GB_QUOTE_MAX) return `${GB_QUOTE_MAX}자까지 쓸 수 있어요.`;
  if (/https?:|www\.|\.(com|net|kr|io|org|me|ly)\b/i.test(q)) return '링크는 쓸 수 없어요.';
  if (/[\w.+-]+@[\w-]+\.\w+/.test(q) || /@\w{2,}/.test(q)) return '이메일이나 계정 이름은 쓸 수 없어요.';
  if (/(\d[\s-]?){8,}/.test(q)) return '전화번호 같은 숫자는 쓸 수 없어요.';
  if (/카톡|카카오톡|오픈채팅|인스타|텔레그램|디스코드|kakao|insta|telegram|discord/i.test(q)) return '연락처나 메신저 아이디는 쓸 수 없어요.';
  return '';
}
function gbShare(post) {
  const p = {...post, id:'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), time:Date.now()};
  const mine = gbStore.get('mine', []); mine.unshift(p); gbStore.set('mine', mine.slice(0, 20));
  gbCache = null;
  return gbSend({type:'story', id:p.id, name:p.name, meta:p.meta, life:p.life, quote:p.quote}).then(() => p);
}
function gbLike(id) {
  const liked = gbStore.get('liked', []); if (liked.includes(id)) return false;
  liked.push(id); gbStore.set('liked', liked.slice(-500)); gbSend({type:'like', id, name:'', meta:'', life:'', quote:''}); return true;
}
function gbReport(id) {
  const rep = gbStore.get('reported', []); if (rep.includes(id)) return false;
  rep.push(id); gbStore.set('reported', rep.slice(-500)); gbSend({type:'report', id, name:'', meta:'', life:'', quote:''}); return true;
}
// Renders posts as a parish-register page: years in the margin, the epitaph first, the life below.
// All text goes through textContent: posts are untrusted.
const GB_CANDLE = '<svg viewBox="0 0 8 12" width="8" height="12" aria-hidden="true"><rect x="3" y="0" width="2" height="2" fill="#e8a33a"/><rect x="3" y="2" width="2" height="1" fill="#c0392b"/><rect x="2" y="4" width="4" height="8" fill="currentColor"/></svg>';
function gbRenderList(box, posts, {limit = 20, onReport} = {}) {
  box.replaceChildren();
  const liked = gbStore.get('liked', []), reported = gbStore.get('reported', []);
  for (const p of posts.slice(0, limit)) {
    if (reported.includes(p.id)) continue;
    const li = document.createElement('li'); li.className = 'gb-entry';
    const years = (p.meta.match(/^(\d{4}\s*[–-]\s*\d{4})\s*·\s*/) || []);
    const margin = document.createElement('div'); margin.className = 'gb-years'; margin.textContent = years[1] ? years[1].replace(/\s*[–-]\s*/, '\n') : '†';
    const body = document.createElement('div'); body.className = 'gb-body';
    const quote = document.createElement('p'); quote.className = 'gb-quote'; quote.textContent = p.quote;
    const top = document.createElement('div'); top.className = 'gb-top';
    const who = document.createElement('b'); who.textContent = p.name || '이름 없는 삶';
    const meta = document.createElement('span'); meta.className = 'gb-meta'; meta.textContent = years[0] ? p.meta.slice(years[0].length) : p.meta;
    top.append(who, meta);
    const life = document.createElement('p'); life.className = 'gb-life'; life.textContent = p.life;
    const actions = document.createElement('div'); actions.className = 'gb-actions';
    const like = document.createElement('button'); like.className = 'gb-like';
    const paint = (n, on) => { like.innerHTML = GB_CANDLE; like.append(on ? ` 촛불을 켰어요 · ${n}` : n ? ` 촛불 켜기 · ${n}` : ' 촛불 켜기');
      like.classList.toggle('on', on); like.setAttribute('aria-pressed', String(on)); };
    let count = p.likes; paint(count, liked.includes(p.id));
    like.onclick = () => { if (gbLike(p.id)) { count++; paint(count, true); } };
    const when = document.createElement('time'); when.textContent = gbAgo(p.time);
    const report = document.createElement('button'); report.className = 'gb-report'; report.textContent = '신고';
    report.onclick = () => (onReport || (f => f()))(() => { gbReport(p.id); li.remove(); });
    const right = document.createElement('span'); right.className = 'gb-right'; right.append(when, report);
    actions.append(like, right);
    if (p.quote) body.append(quote);
    body.append(top, life, actions);
    li.append(margin, body);
    box.append(li);
  }
}
// Plain-language summary of a finished life, in the manner of "인도 러크나우의 넉넉하지 않은 집에서 여자아이로 태어났습니다."
function gbLifeText(s, r) {
  const w0 = s.familyEvents?.w0;
  const home = typeof w0 !== 'number' ? '' : w0 < 25 ? '넉넉하지 않은 ' : w0 < 50 ? '평범한 ' : w0 < 75 ? '형편이 좋은 ' : '부유한 ';
  const kin = {'농민':'농민 집', '도시 평민':'장인 집', '부르주아':'부르주아 집안', '귀족':'귀족 집안'}[s.class] || '집';
  const place = s.place.includes('농촌') ? s.place.replace(' 농촌', '의 시골 마을') : s.place;
  const parts = [`${r.born}년 프랑스 ${place}의 ${home}${kin}에서 ${s.sex === '여성' ? '여자' : '남자'}아이로 태어났습니다.`];
  if (r.age >= 12) parts.push(literacyOf(s) === 'basic' ? '글을 읽고 쓸 줄 알았습니다.' : '글을 익히지 못했습니다.');
  const job = r.top || (!['없음', '은퇴', '아이', '학생'].includes(s.job) && r.age >= 16 ? s.job : '');
  if (job) parts.push(`${job}(으)로 일했습니다.`);
  const kids = s.relations.filter(x => x.role === '자녀').length;
  if (s.relations.some(x => x.role === '배우자' || x.role === '전 배우자')) parts.push(kids ? `혼인해 아이 ${kids}명을 두었습니다.` : '혼인했습니다.');
  else if (kids) parts.push(`아이 ${kids}명을 두었습니다.`);
  if (r.historic[0]) parts.push(`${r.historic[0].year}년 「${r.historic[0].title}」의 현장에 있었습니다.`);
  parts.push(r.age < 1 ? `${r.died}년 첫돌을 맞지 못하고 세상을 떠났습니다.` : `${r.died}년 ${r.age}세로 세상을 떠났습니다.`);
  return parts.join(' ');
}
