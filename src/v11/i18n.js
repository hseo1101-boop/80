// src/i18n.js — English mode.
// The game keeps Korean as its internal text; English is a display layer looked up from EN (built from
// src/v11/i18n/en/*.txt by tools/i18n.mjs). A string is found by exact match, then as a template in which
// names, places, classes, jobs, roles and numbers are numbered placeholders ({0}, {1:month} …), then line by
// line, ' · ' segment by segment and sentence by sentence. In English mode, events and decisions whose text
// is not translated yet are skipped rather than shown in Korean.
let LANG = 'ko';
const EN = {};
const I18N_CACHE = new Map(), I18N_MISS = new Map();
const HANGUL = /[가-힣]/;
const hasHangul = t => HANGUL.test(String(t).replace(/\{[^}]*\}/g, ''));
function setLang(lang) { LANG = lang === 'en' ? 'en' : 'ko'; I18N_CACHE.clear(); }
const FR_NAMES = {'장':'Jean','피에르':'Pierre','루이':'Louis','자크':'Jacques','앙투안':'Antoine','프랑수아':'François','니콜라':'Nicolas',
  '미셸':'Michel','에티엔':'Étienne','클로드':'Claude','조제프':'Joseph','샤를':'Charles','앙드레':'André','질':'Gilles','기욤':'Guillaume',
  '르네':'René','마티외':'Mathieu','쥘리앵':'Julien','필리프':'Philippe','위베르':'Hubert','장바티스트':'Jean-Baptiste','폴':'Paul',
  '오귀스탱':'Augustin','이브':'Yves','코랑탱':'Corentin','시몽':'Simon','알렉시':'Alexis','뱅상':'Vincent','오노레':'Honoré',
  '아드리앵':'Adrien','가브리엘':'Gabriel','레옹':'Léon',
  '마리':'Marie','잔':'Jeanne','안':'Anne','마들렌':'Madeleine','엘리자베트':'Élisabeth','루이즈':'Louise','카트린':'Catherine',
  '마르그리트':'Marguerite','프랑수아즈':'Françoise','마리안':'Marianne','쥐스틴':'Justine','쥘리':'Julie','빅투아르':'Victoire',
  '테레즈':'Thérèse','주느비에브':'Geneviève','아델라이드':'Adélaïde','앙젤리크':'Angélique','소피':'Sophie','클레르':'Claire',
  '마르트':'Marthe','로즈':'Rose','셀레스트':'Céleste','외제니':'Eugénie','조제핀':'Joséphine','앙투아네트':'Antoinette','니콜':'Nicole',
  '쉬잔':'Suzanne','아니에스':'Agnès','펠리시테':'Félicité','바르브':'Barbe',
  '뒤퐁':'Dupont','마르탱':'Martin','르페브르':'Lefebvre','베르나르':'Bernard','모로':'Moreau','로랑':'Laurent','프티':'Petit',
  '뒤랑':'Durand','르루아':'Leroy','루':'Roux','베르트랑':'Bertrand','모렐':'Morel','푸르니에':'Fournier','지라르':'Girard',
  '메르시에':'Mercier','블랑':'Blanc','게랭':'Guérin','부아예':'Boyer','가르니에':'Garnier','슈발리에':'Chevalier','르그랑':'Legrand',
  '고티에':'Gautier','페랭':'Perrin','로베르':'Robert','클레망':'Clément','모랭':'Morin','루셀':'Roussel','르메르':'Lemaire',
  '뒤부아':'Dubois','포르':'Faure','르클레르':'Leclerc','브뤼네':'Brunet','르브룅':'Lebrun','르고프':'Le Goff','르갈':'Le Gall',
  '뒤마':'Dumas','바이':'Bailly','콜랭':'Colin','아르노':'Arnaud','부셰':'Boucher','마송':'Masson','샤르팡티에':'Charpentier',
  '파브르':'Fabre','롤랑':'Roland','카라덱':'Caradec','바레':'Barré','라퐁':'Lafont','르블랑':'Leblanc'};
const realFr = () => typeof REAL_FR === 'object' ? REAL_FR : {};
function frenchName(name) { return String(name).split(' ').map(part => FR_NAMES[part] || realFr()[part] || part).join(' '); }
// A person's name as the current language shows it.
const nameOf = name => LANG === 'en' ? frenchName(name) : name;

// Words that stand for something the engine fills in. The set never depends on EN, so a template key found
// once stays the same key.
let I18N_TERMS = null;
function i18nTerms() {
  if (I18N_TERMS) return I18N_TERMS;
  const terms = new Map(); // ko → kind
  // Job words that are also everyday words (배우는 'learning', 화가 나다 'get angry') never stand for a job.
  const STOP = new Set(['배우', '화가', '의사', '기자', '선원']);
  const add = (t, kind) => { if (typeof t === 'string' && t.length >= 2 && HANGUL.test(t) && !terms.has(t) && !STOP.has(t)) terms.set(t, kind); };
  const figures = typeof FIGURES === 'object' ? Object.values(FIGURES) : [];
  for (const f of figures) add(f.name, 'figure');
  if (typeof REAL_LIVES === 'object') for (const p of Object.values(REAL_LIVES)) add(p.name, 'name');
  for (const f of families) { add(f.place, 'term'); add(f.place.replace(' 농촌', ' 시골'), 'term'); add(f.class, 'term'); add(f.job, 'term'); }
  if (typeof CAREERS === 'object') for (const c of Object.values(CAREERS)) { add(c.label, 'term'); for (const r of [...c.ranks, ...(c.women || [])]) if (!r.label.includes('○○')) add(r.label, 'term'); }
  for (const r of ['아버지','어머니','형제자매','자녀','할머니','배우자','친구','지인','전우','인물','고용주','조카','오빠','누나','언니','남동생','여동생','아들']) add(r, 'term');
  for (const r of ['형', '딸']) terms.set(r, 'term');
  // Jobs the engine hands out outside the career ladders.
  for (const j of ['군인','임시 노동자','코뮌 병사','망명자','군 관련 노동자','하녀','하인','방적 공장 아이','국립 작업장 노동자','직인','지역 주민','중개상','장인','자영업자',
    '숯·포도주 장수','수공예인','상이군인','사제','백화점 판매원','방적공','반급 장교','물장수','망명지 가정교사','가사·생계 활동','교육을 받은 점원','가업 보조','장인 견습',
    '농업 종사자','도제','점원','일꾼','은퇴','수학자','포병 장교','장군','극작가','군의관','정신과 의사','박물학자','화학자·징세청부인','직기 발명가']) add(j, 'term');
  if (typeof POLITICS_LABEL === 'object') for (const v of Object.values(POLITICS_LABEL)) add(v, 'term');
  I18N_TERMS = terms;
  return terms;
}
let I18N_RE = null;
function i18nRe() {
  if (I18N_RE) return I18N_RE;
  const esc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const given = [...new Set([...male, ...female, ...Object.keys(realFr())])].sort((a, b) => b.length - a.length).map(esc).join('|');
  const sur = [...new Set([...surnames, ...Object.keys(realFr())])].sort((a, b) => b.length - a.length).map(esc).join('|');
  const terms = [...i18nTerms().keys()].sort((a, b) => b.length - a.length).map(esc).join('|');
  // A term stands alone: not inside a longer word, though a particle may follow it.
  const after = '(?=의|에서|에게|에|은|는|이|가|을|를|과|와|으로|로|도|만|까지|부터|처럼|보다|들|이나|나|인 |[^가-힣]|$)';
  // A women's ladder rank with its employer's name filled in (변호사 뒤퐁 씨의 서류 담당).
  const ranks = typeof CAREERS === 'object' ? Object.values(CAREERS).flatMap(c => c.women || []).map(r => r.label).filter(l => l.includes('○○')) : [];
  const npcRanks = ranks.map(l => esc(l).replace('○○', `(?:${sur}) 씨`)).join('|') || '(?!)';
  I18N_RE = new RegExp(`(?<![가-힣])(${npcRanks})${after}|(?<![가-힣])((?:${given}) (?:${sur}))|(?<![가-힣])(${terms})${after}|(\\d{1,3}(?:,\\d{3})+|\\d+(?:\\.\\d+)?)|(?<![가-힣])((?:${sur}) 씨)${after}`, 'g');
  return I18N_RE;
}
// Korean particles after a placeholder take either form; the key keeps one.
const PARTICLES = [[/^(?:은\(는\)|은|는)(?![가-힣])/, '은(는)'], [/^(?:이\(가\)|이|가)(?![가-힣])/, '이(가)'], [/^(?:을\(를\)|을|를)(?![가-힣])/, '을(를)'],
  [/^(?:과\(와\)|과|와)(?![가-힣])/, '과(와)'], [/^(?:\(으\)로|으로|로)(?![가-힣])/, '(으)로'], [/^(?:이\(나\)|이나|나)(?![가-힣])/, '(이)나']];
function i18nKey(text) {
  const args = [], re = i18nRe(), terms = i18nTerms();
  let key = '', last = 0, m;
  re.lastIndex = 0;
  while ((m = re.exec(text))) {
    key += text.slice(last, m.index) + `{${args.length}}`;
    args.push({text:m[0], kind:m[1] ? 'rank' : m[2] ? 'name' : m[3] ? terms.get(m[3]) : m[5] ? 'sir' : 'num'});
    last = re.lastIndex;
    const rest = text.slice(last);
    for (const [p, canon] of PARTICLES) { const pm = rest.match(p); if (pm) { key += canon; last += pm[0].length; break; } }
  }
  return {key:key + text.slice(last), args};
}
const MONTHS_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ROMAN = n => [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']].reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v; } return s; }, '');
function argText(a) {
  if (a.kind === 'name') return frenchName(a.text);
  if (a.kind === 'num') return a.text;
  if (a.kind === 'rank') for (const c of Object.values(CAREERS)) for (const r of c.women || []) {
    const [pre, post] = r.label.split('○○');
    if (post !== undefined && a.text.startsWith(pre) && a.text.endsWith(post) && Object.hasOwn(EN, r.label))
      return EN[r.label].replace('○○', 'M. ' + frenchName(a.text.slice(pre.length, a.text.length - post.length).replace(' 씨', '')));
  }
  if (a.kind === 'sir') return 'M. ' + frenchName(a.text.replace(' 씨', ''));
  return Object.hasOwn(EN, a.text) ? EN[a.text] : a.text;
}
function i18nFill(tpl, args) {
  return tpl.replace(/\{(\d+)(?::(\w+))?\}/g, (all, i, fmt) => {
    const a = args[+i]; if (!a) return all;
    if (fmt === 'month') return MONTHS_EN[+a.text] || a.text;
    if (fmt === 'roman') return ROMAN(+a.text);
    // Korean counts in units of 10,000 (만).
    if (fmt === 'man') { const n = parseFloat(a.text.replace(/,/g, '')) * 10000; return n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, '')} million` : n.toLocaleString('en-US'); }
    if (fmt === 's') return +a.text === 1 ? '' : 's';
    if (fmt === 'cap') { const t = argText(a); return t.charAt(0).toUpperCase() + t.slice(1); }
    if (fmt === 'low') return argText(a).toLowerCase();
    if (fmt === 'pl') { const t = argText(a); return t === 'child' ? 'children' : /s$/.test(t) ? t : t + 's'; }
    return argText(a);
  });
}
// Shapes that hold any phrase.
const I18N_RULES = [
  [/^(\d+)세 ([\s\S]+)$/, m => `Age ${m[1]} · ${trLeaf(m[2], false)}`],
  [/^(\d+)년 (\d+)월 · ([\s\S]+)$/, m => `${MONTHS_EN[+m[2]]} ${m[1]} · ${trPart(m[3], false)}`],
  // An old bond: “(n years ago) the person you … ” — the memory is an English relative clause.
  [/^(?:(\d+)년 전 )?당신이 (.+) 그 사람입니다\.$/, m => Object.hasOwn(EN, m[2]) ? `It is the person ${EN[m[2]]}${m[1] ? `, ${m[1]} years ago` : ''}.` : null],
  [/^늙은 (.+?)이\(가\) 찾아와 (\d+)년 전 당신이 (.+) 날 이야기를 꺼냈습니다\.$/, m => Object.hasOwn(EN, m[3]) ? `Old ${frenchName(m[1])} came to see you and talked about the day, ${m[2]} years ago, that made them the person ${EN[m[3]]}.` : null],
  // A child's wedding in the milestones names the child by first name only.
  [/^(\S+) 혼인$/, m => FR_NAMES[m[1]] ? `${FR_NAMES[m[1]]} married` : null],
];
function i18nMiss(t) {
  const {key} = i18nKey(t), m = I18N_MISS.get(key);
  if (m) m.n++; else I18N_MISS.set(key, {n:1, ex:t});
}
function trLeaf(t, record) {
  if (Object.hasOwn(EN, t)) return EN[t];
  const {key, args} = i18nKey(t);
  if (Object.hasOwn(EN, key)) return i18nFill(EN[key], args);
  // A leading emoji or mark, or closing punctuation, around a known phrase.
  const wrap = t.match(/^([^\p{L}\p{N}{]+)?([\s\S]*?\p{L}[\s\S]*?)([\s.…!?)\]·:]*)$/u);
  if (wrap && (wrap[1] || wrap[3]) && wrap[2] !== t) { const inner = trLeaf(wrap[2], false); if (!hasHangul(inner)) return (wrap[1] || '') + inner + (wrap[3] || ''); }
  for (const [re, f] of I18N_RULES) { const m = t.match(re); if (m) { const r = f(m); if (r != null && !hasHangul(r)) return r; } }
  // "Label: rest"
  const lab = t.match(/^([^:\n]{1,16}?): ([\s\S]+)$/);
  if (lab) { const a = trLeaf(lab[1], false), b = trPart(lab[2], record); if (!hasHangul(a)) return `${a}: ${b}`; }
  if (t.includes(' · ')) return t.split(' · ').map(x => trPart(x, record)).join(' · ');
  // Sentence by sentence: runs of consecutive sentences that are known as a whole, longest first.
  const sentences = t.split(/(?<=[.!?。”"』」])\s+(?=\S)/);
  if (sentences.length > 1) {
    const whole = x => { if (Object.hasOwn(EN, x)) return EN[x]; const k = i18nKey(x); return Object.hasOwn(EN, k.key) ? i18nFill(EN[k.key], k.args) : null; };
    const out = []; let i = 0, ok = true;
    while (i < sentences.length) {
      let j = sentences.length, r = null;
      for (; j > i; j--) { r = whole(sentences.slice(i, j).join(' ')); if (r != null) break; }
      if (r == null) { const x = trLeaf(sentences[i], false); if (hasHangul(x)) { ok = false; if (record) trLeaf(sentences[i], true); } out.push(x); i++; }
      else { out.push(r); i = j; }
    }
    return ok || record ? out.join(' ') : t;
  }
  if (record) i18nMiss(t);
  return t;
}
function trPart(t, record = true) {
  if (!hasHangul(t)) return t;
  const m = t.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (m[1] || m[3]) return m[1] + trPart(m[2], record) + m[3];
  if (Object.hasOwn(EN, t)) return EN[t];
  if (t.includes('\n')) return t.split('\n').map(x => trPart(x, record)).join('\n');
  return trLeaf(t, record);
}
// Display text in the current language. Korean mode returns the text as it is.
function L(text) {
  if (LANG !== 'en' || typeof text !== 'string' || !hasHangul(text)) return text;
  let r = I18N_CACHE.get(text);
  if (r === undefined) { r = trPart(text); I18N_CACHE.set(text, r); }
  return r;
}
// True when the text has a full English version (always true in Korean mode).
function enHas(text) {
  if (LANG !== 'en' || text == null || text === '') return true;
  if (typeof text !== 'string') return true;
  if (!hasHangul(text)) return true;
  return !hasHangul(trPart(text, false));
}
const enChoice = c => LANG !== 'en' || enHas(c.label) && enHas(c.preview) && enHas(c.result) && (c.outcomes || []).every(o => enHas(o.title) && enHas(o.result));
// A choice is shown when its conditions hold and, in English, when it is translated. A station's own
// choices that are not translated yet leave the player with the scene's general choices.
let CHOICE_OWNER = null;
function choiceVisible(s, c) {
  if (!enChoice(c)) return false;
  if (!c.when) return true;
  if (LANG === 'en' && (c.when.sceneRole || c.when.sceneRoleNot) && typeof sceneRoleOf === 'function') {
    if (!CHOICE_OWNER) { CHOICE_OWNER = new Map(); for (const d of decisions) for (const x of d.choices) CHOICE_OWNER.set(x, d); }
    const d = CHOICE_OWNER.get(c), role = sceneRoleOf(s);
    if (!(d && d.choices.some(x => x.when?.sceneRole === role && enChoice(x)))) {
      if (c.when.sceneRole) return false;
      const {sceneRoleNot, ...rest} = c.when;
      return matches(s, rest);
    }
  }
  return matches(s, c.when);
}
const EN_DECISION_OK = new Map();
function enDecision(d) {
  if (LANG !== 'en') return true;
  if (EN_DECISION_OK.has(d.id)) return EN_DECISION_OK.get(d.id);
  // Choices meant only for some (a station, a sex) may wait; they stay hidden until translated.
  const ok = enHas(d.title) && enHas(d.text) && d.choices.filter(c => !c.when).every(enChoice) && d.choices.some(enChoice);
  EN_DECISION_OK.set(d.id, ok);
  return ok;
}
