// src/pixel.js
// Procedural pixel art. Every sprite and scene is drawn from saved identity and the calendar,
// so rendering never consumes game RNG and needs no image atlas.
const PX = {
  outline:'#2a2126', eye:'#251d27', blush:'#eda5a2', shirt:'#efe8d8', shirtShade:'#d6ccb8',
  black:'#26232a', gold:'#d8ae45', white:'#f5f1e7', cream:'#ede3c8', red:'#c33b3b', blue:'#2c4f9e',
  skins:[['#f5d5b4','#e2b993'],['#efc6a0','#d9a881'],['#e7b78e','#cf9b72'],['#dca67d','#c18a62']],
  hairs:['#3a271c','#5a3a24','#7a4e2c','#262021','#9a6a3a','#c79f58','#8b3d22']
};
// Korean display names → the French originals used on the passport.
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
function frenchName(name) { return name.split(' ').map(part => FR_NAMES[part] || REAL_FR[part] || part).join(' '); }
function strHash(text) {
  let v = 2166136261;
  for (let i = 0; i < text.length; i++) v = Math.imul(v ^ text.charCodeAt(i), 16777619);
  return v >>> 0;
}
function mix(hex, other, t) {
  const a = parseInt(hex.slice(1),16), b = parseInt(other.slice(1),16);
  const ch = s => Math.round(((a>>s)&255)*(1-t) + ((b>>s)&255)*t);
  return '#' + ((1<<24) + (ch(16)<<16) + (ch(8)<<8) + ch(0)).toString(16).slice(1);
}
const dark = (c, t = .25) => mix(c, '#1a1418', t), light = (c, t = .3) => mix(c, '#ffffff', t);

class PixelGrid {
  constructor(w, h) { this.w = w; this.h = h; this.p = new Array(w*h).fill(null); }
  get(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.p[y*this.w+x] : null; }
  set(x, y, c) { if (c && x >= 0 && y >= 0 && x < this.w && y < this.h) this.p[y*this.w+x] = c; }
  rect(x, y, w, h, c) { for (let j = y; j < y+h; j++) for (let i = x; i < x+w; i++) this.set(i, j, c); }
  outline(c) {
    const add = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++)
      if (!this.get(x,y) && (this.get(x-1,y) || this.get(x+1,y) || this.get(x,y-1) || this.get(x,y+1))) add.push([x,y]);
    for (const [x,y] of add) this.set(x, y, c);
  }
  toCanvas(doc) {
    const canvas = doc.createElement('canvas'); canvas.width = this.w; canvas.height = this.h;
    canvas.topRow = Math.floor(this.p.findIndex(Boolean) / this.w);
    const ctx = canvas.getContext('2d');
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      const c = this.p[y*this.w+x]; if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
    }
    return canvas;
  }
}

// ---- Who looks like what -------------------------------------------------
function eraOf(year, month = 6) {
  if (year < 1789) return 'ancien';
  if (year < 1795) return 'revolution';
  if (year < 1815 || (year === 1815 && month < 7)) return 'empire';
  return 'restoration';
}
function jobKind(job = '') {
  if (/군/.test(job)) return 'soldier';
  if (/농부|소작|농업|농민/.test(job)) return 'peasant';
  if (/법률|교사|교육|의사|관리|공증|사제|변호사|서기|행정관|의원|도지사|교정원|팸플릿|기자|발행인|교수|아카데미|학사원|신학생|신부|참사회원|주교|수녀|외과|관청|사무관|국장|참사관|작가|측량사|기사|순경|경찰/.test(job)) return 'professional';
  if (/지주/.test(job)) return 'noble';
  if (/상인|점원|자영업|도매|은행|화가|작업장|공장|산업가|배우|살롱|의상실/.test(job)) return 'merchant';
  if (/도제|장인|직물|인쇄|제화|노동|하인|하녀|견습|보조|방적|직인|청소|산파|재봉사|선원|항해사|선장/.test(job)) return 'artisan';
  return null;
}
const FAMILY_ROLES = ['아버지','어머니','형제자매','자녀','할머니'];
function personSex(person) {
  return person.sex || (person.role === '아버지' ? '남성' : ['어머니','할머니'].includes(person.role) ? '여성' :
    female.includes(person.name.split(' ')[0]) ? '여성' : '남성');
}
function stageOf(age) {
  return age <= 1 ? 'baby' : age <= 5 ? 'toddler' : age <= 11 ? 'child' : age <= 17 ? 'teen' : age < 60 ? 'adult' : 'elder';
}
const STAGE_LABEL = {baby:'아기',toddler:'어린아이',child:'어린이',teen:'소년·소녀',adult:'성인',elder:'노인'};
const pickBy = (seed, list) => list[seed % list.length];

function characterLook(s, person = s) {
  const age = ageOf(s, person), sex = personSex(person), woman = sex === '여성';
  const self = person === s, kin = self || FAMILY_ROLES.includes(person.role) || person.role === '배우자';
  const seed = strHash(person.name + '|' + (person.birthYear ?? s.born));
  const famSeed = strHash(s.name.split(' ').at(-1) + s.born);
  const stage = stageOf(age), era = eraOf(s.year, s.month);
  const job = self ? s.job : person.job || '없음';
  const cls = kin ? s.class : jobKind(job) === 'merchant' ? '부르주아' : '도시 평민';
  const parentJob = kin && !['배우자'].includes(person.role) ? s.parentJob : '';
  const kind = jobKind(job) || jobKind(parentJob) ||
    (cls === '농민' ? 'peasant' : cls === '귀족' ? 'noble' : cls === '부르주아' ? 'merchant' : 'artisan');
  const country = s.place.includes('농촌'), paris = s.place.includes('파리');
  const skinPair = PX.skins[((FAMILY_ROLES.includes(person.role) || self) ? famSeed + (seed % 2) : seed) % PX.skins.length];
  let hair = PX.hairs[((FAMILY_ROLES.includes(person.role) || self) ? (famSeed >>> 4) + (seed % 3 === 0 ? 1 : 0) : seed >>> 4) % PX.hairs.length];
  if (stage === 'elder') hair = age >= 70 ? '#e9e6df' : '#b8b2a8';
  else if (stage === 'adult' && age >= 48) hair = mix(hair, '#b8b2a8', .45);
  const o = {stage, sex, woman, skin:skinPair[0], skinShade:skinPair[1], hair, hairStyle: woman ? 'long' : 'short',
    hat:null, coat:null, vest:null, top:PX.shirt, legs:'#5a4a3a', legStyle:'breeches', stockings:'#c9c2b4',
    shoes:'#3a2a20', skirt:null, stripe:null, apron:null, fichu:false, sash:null, trim:null, shawl:null,
    cravat:false, neckerchief:null, belts:false, cockade:null, cane:false, plume:null, empire:false, lace:false, swaddle:null};
  const v = n => (seed >>> n) % 4;
  const cockade = (era === 'revolution' || era === 'empire' || (s.year === 1789 && s.month >= 7)) ? 'tricolor' : null;

  if (stage === 'baby') {
    o.swaddle = woman ? '#e9b6c2' : '#a9cbe0';
  } else if (!woman) {
    if (stage === 'toddler' || stage === 'child') {
      o.vest = pickBy(v(3), ['#6b4a34','#4d6a8a','#7a3f37','#4f6b4a']);
      o.legs = kind === 'noble' ? '#3b4f8f' : '#6a5440'; o.stockings = kind === 'noble' || kind === 'merchant' ? PX.white : '#b8b0a0';
      if (kind === 'noble') { o.coat = '#3b4f8f'; o.trim = PX.gold; o.cravat = true; }
      if (era !== 'ancien' && stage === 'child') o.legStyle = 'trousers';
      if (country) o.shoes = '#9a7048';
    } else if (kind === 'soldier' && stage !== 'elder') {
      const royal = era === 'ancien' || era === 'restoration';
      o.coat = royal && era === 'ancien' ? '#e7e2d4' : '#2d4c8e'; o.trim = royal && era === 'ancien' ? '#2d4c8e' : '#b8323a';
      o.vest = PX.white; o.legs = PX.white; o.stockings = '#2b2a30'; o.belts = true; o.cravat = true;
      o.hat = era === 'ancien' ? 'tricorne' : 'bicorne'; o.plume = '#c8343a'; o.cockade = era === 'ancien' || (era === 'restoration' && s.year < 1830) ? 'white' : 'tricolor';
    } else if (kind === 'peasant') {
      o.vest = pickBy(v(3), ['#7a5a3a','#5e6b45','#8a4b32','#4e5a6b']); o.legs = '#6b5038';
      o.legStyle = era === 'ancien' || era === 'revolution' ? 'breeches' : 'trousers';
      o.stockings = '#a49d90'; o.shoes = '#9a7048'; o.neckerchief = v(5) % 2 ? '#b5463a' : null;
      o.hat = pickBy(v(7), ['straw','straw','felt',null]);
    } else if (kind === 'artisan') {
      o.vest = pickBy(v(3), ['#3d4a5a','#5a3f35','#4a5a48','#6a5a4a']); o.legs = '#5a4a3a';
      if (stage !== 'teen' || age >= 14) o.apron = '#8b5e3c';
      if (era === 'revolution' && paris) { o.legStyle = 'striped'; if (s.year >= 1792) o.hat = 'phrygian'; o.cockade = 'tricolor'; }
      else if (era !== 'ancien') { o.legStyle = 'trousers'; o.legs = '#4b4f5a'; }
      else { o.hat = v(9) === 0 ? 'tricorne' : null; o.stockings = '#a8a296'; }
      o.neckerchief = v(5) % 2 ? '#c9b48a' : null;
    } else if (kind === 'professional') {
      o.coat = '#26262b'; o.vest = '#26262b'; o.cravat = true; o.legs = '#26262b'; o.stockings = PX.white;
      if (era === 'ancien') { o.hairStyle = 'wig'; o.hat = 'tricorne'; } else o.hat = era === 'revolution' ? 'bicorne' : 'tophat';
      if (era === 'empire' || era === 'restoration') { o.legStyle = 'trousers'; o.legs = '#3a3936'; }
      o.cockade = era === 'revolution' ? cockade : null;
    } else if (kind === 'noble') {
      o.coat = pickBy(v(3), ['#3d4f8f','#7a2b45','#3f6b55','#6b4a8a']); o.vest = '#efe0b0'; o.trim = PX.gold;
      o.cravat = true; o.legs = o.coat; o.stockings = PX.white; o.shoes = '#1f1c22';
      if (era === 'ancien' || era === 'restoration') { o.hairStyle = era === 'ancien' ? 'wig' : 'short'; o.hat = era === 'ancien' ? 'tricorne' : 'tophat'; }
      else { o.hat = 'tophat'; o.legStyle = 'trousers'; o.legs = '#d9cfb8'; o.trim = null; }
    } else {
      o.coat = pickBy(v(3), ['#5b3b2a','#2f4a3a','#2b3a5a','#6b2f2f']); o.vest = pickBy(v(5), ['#d8c08a','#efe3c0','#b9a46e','#e3d2a8']);
      o.cravat = true; o.legs = '#2a2a2e'; o.stockings = PX.white;
      if (era === 'ancien') o.hat = 'tricorne';
      else if (era === 'revolution') { o.hat = v(7) % 2 ? 'bicorne' : 'tricorne'; o.cockade = cockade; }
      else { o.hat = 'tophat'; o.legStyle = 'trousers'; o.legs = '#4a453e'; }
    }
    if (stage === 'teen' && o.hat && !['straw','phrygian'].includes(o.hat)) o.hat = null;
    if (stage === 'elder') { o.cane = true; if (!o.coat && kind !== 'peasant') o.coat = '#4a4038'; if (o.hairStyle === 'wig') o.hair = '#ece8e0'; }
    if (o.hairStyle === 'wig' && stage !== 'elder') o.hair = '#e4dfd6';
  } else {
    if (stage === 'toddler' || stage === 'child') {
      o.skirt = pickBy(v(3), ['#6a8aa8','#a0524a','#7a8a5a','#8a6a9a']); o.top = o.skirt;
      o.apron = kind === 'noble' ? null : '#f0e8d6'; o.hat = kind === 'noble' ? null : stage === 'child' ? 'coiffe' : null;
      if (kind === 'noble') { o.skirt = o.top = '#e7a8b8'; o.lace = true; o.sash = '#fff3f6'; }
      if (country) o.shoes = '#9a7048';
    } else if (kind === 'peasant') {
      o.top = pickBy(v(3), ['#9a4a32','#6b5a3a','#4e5f7a','#7a6a3a']); o.skirt = pickBy(v(5), ['#3e4a63','#6b4a32','#5a3a3a','#4a5a3e']);
      o.apron = '#e9e1cd'; o.hat = 'coiffe'; o.fichu = true; o.shoes = '#9a7048'; o.hairStyle = 'bun';
    } else if (kind === 'soldier') {
      o.top = '#2d4c8e'; o.trim = '#b8323a'; o.skirt = '#c4574f'; o.stripe = '#efe4d0'; o.apron = null; o.hat = 'bicorne'; o.cockade = cockade; o.hairStyle = 'bun';
    } else if (kind === 'artisan') {
      o.top = pickBy(v(3), ['#3f5f7f','#8a3a3a','#5a6a4a','#6a4a6a']); o.skirt = pickBy(v(5), ['#c4574f','#4f6a8a','#8a6a3a','#5a5a6a']);
      o.stripe = v(7) % 2 ? '#efe4d0' : null; o.apron = '#efe6d2'; o.fichu = true; o.hat = 'coiffe'; o.hairStyle = 'bun';
      if (paris && (era === 'revolution')) o.cockade = 'tricolor';
    } else if (kind === 'noble' && (era === 'ancien' || era === 'restoration')) {
      o.top = o.skirt = pickBy(v(3), ['#e8a2b2','#9ab8de','#c9b6e0','#a8d0b8']); o.lace = true; o.trim = PX.white;
      o.hairStyle = era === 'ancien' ? 'pouf' : 'bun'; o.hair = era === 'ancien' && stage !== 'elder' ? '#e8e2d8' : o.hair; o.sash = '#f5d8e0';
      if (era === 'restoration') o.hat = 'bonnet';
    } else if (era === 'empire' || (era === 'revolution' && s.year >= 1794) || kind === 'noble') {
      o.empire = true; o.top = o.skirt = '#f3efe6'; o.sash = pickBy(v(3), ['#5a7fb0','#b0505a','#5a9a7a','#c9a040']);
      o.hairStyle = 'bun'; o.hat = 'headband'; if (kind === 'noble') o.trim = PX.gold;
    } else {
      o.top = o.skirt = pickBy(v(3), ['#4f7a9a','#7a8f5a','#a35a6a','#8a6a4a']); o.fichu = true; o.hat = 'bonnet'; o.hairStyle = 'bun';
      if (era === 'restoration') o.stripe = light(o.skirt, .35);
    }
    if (stage === 'teen' && o.hat === 'bonnet') o.hat = null;
    if (stage === 'teen' && o.hairStyle === 'bun') o.hairStyle = 'long';
    if (stage === 'elder') { o.shawl = kind === 'noble' ? '#5a4a6a' : '#4a4038'; o.hat = o.hat === 'headband' || o.hat === 'pouf' ? 'coiffe' : o.hat || 'coiffe'; o.empire = false; o.hairStyle = 'bun'; }
  }
  const costume = o.stage === 'baby' ? '포대기' : o.coat ? (kind === 'soldier' ? '군복' : kind === 'noble' ? '귀족 예복' : '외투') :
    o.apron ? '작업 앞치마' : o.empire ? '엠파이어 드레스' : '평상복';
  o.key = JSON.stringify(o);
  o.label = `${STAGE_LABEL[stage]} · ${costume}`;
  o.stageLabel = STAGE_LABEL[stage]; o.costume = costume;
  return o;
}

// ---- Drawing a person ------------------------------------------------------
const SPRITE_W = 20, SPRITE_H = 32;
const BODY = {toddler:{tw:6,th:4,lh:2}, child:{tw:6,th:5,lh:4}, teen:{tw:8,th:6,lh:5}, adult:{tw:8,th:7,lh:6}, elder:{tw:8,th:7,lh:6}};

function drawHead(g, o, top, small = false) {
  const x0 = small ? 6 : 5, w = small ? 8 : 10, h = small ? 7 : 9;
  g.rect(x0, top, w, h, o.skin);
  for (const [x,y] of [[x0,top],[x0+w-1,top],[x0,top+h-1],[x0+w-1,top+h-1]]) g.p[y*g.w+x] = null;
  g.rect(x0+1, top+h-1, w-2, 1, o.skinShade);
  const eyeY = top + (small ? 3 : 5), lx = small ? 8 : 7, rx = small ? 11 : 12;
  g.set(lx, eyeY, PX.eye); g.set(rx, eyeY, PX.eye);
  if (!small) { g.set(lx, eyeY+1, PX.eye); g.set(rx, eyeY+1, PX.eye); }
  g.set(lx-1, eyeY+(small?1:2), PX.blush); g.set(rx+1, eyeY+(small?1:2), PX.blush);
  g.set(9, eyeY+(small?2:2), o.skinShade); g.set(10, eyeY+(small?2:2), o.skinShade);
  return {x0, w, h};
}
function drawHair(g, o, top) {
  const c = o.hair, d = dark(c, .3);
  if (o.hairStyle === 'wig') {
    g.rect(5, top-1, 10, 3, c); g.rect(6, top-2, 8, 1, c);
    g.rect(3, top+4, 3, 2, c); g.rect(14, top+4, 3, 2, c); g.rect(3, top+6, 3, 1, d); g.rect(14, top+6, 3, 1, d);
    g.set(4, top+5, d); g.set(15, top+5, d); return;
  }
  if (o.hairStyle === 'pouf') {
    g.rect(7, top-5, 6, 1, c); g.rect(6, top-4, 8, 1, c); g.rect(5, top-3, 10, 5, c); g.rect(5, top+2, 1, 4, c); g.rect(14, top+2, 1, 4, c);
    g.set(8, top-3, light(c)); g.set(11, top-2, light(c)); g.rect(12, top-4, 2, 2, o.sash || '#e88aa0'); return;
  }
  g.rect(5, top, 10, 2, c);
  g.set(5, top+2, c); g.set(6, top+2, c); g.set(8, top+2, c); g.set(11, top+2, c); g.set(13, top+2, c); g.set(14, top+2, c);
  g.set(7, top, d); g.set(10, top, d); g.set(12, top+1, d);
  if (o.hairStyle === 'short') { g.rect(5, top+3, 1, 2, c); g.rect(14, top+3, 1, 2, c); }
  else if (o.hairStyle === 'bun') { g.rect(5, top+3, 1, 3, c); g.rect(14, top+3, 1, 3, c); g.rect(8, top-2, 4, 2, c); g.set(9, top-2, d); }
  else { g.rect(4, top+2, 2, 9, c); g.rect(14, top+2, 2, 9, c); g.set(4, top+10, d); g.set(15, top+10, d); g.set(4, top+5, d); g.set(15, top+6, d); }
}
function drawHat(g, o, top) {
  const cockade = x => {
    if (o.cockade === 'tricolor') { g.set(x, top-1, PX.blue); g.set(x+1, top-1, PX.white); g.set(x+2, top-1, PX.red); }
    else if (o.cockade === 'white') { g.set(x, top-1, PX.white); g.set(x+1, top-1, PX.white); }
  };
  switch (o.hat) {
    case 'tricorne': {
      const edge = o.trim === PX.gold ? PX.gold : '#4a4650';
      g.rect(8, top-3, 4, 1, PX.black); g.rect(6, top-2, 8, 1, PX.black); g.set(3, top-2, PX.black); g.set(16, top-2, PX.black);
      g.rect(3, top-1, 14, 1, PX.black); g.rect(4, top, 12, 1, PX.black);
      g.set(3, top-2, edge); g.set(16, top-2, edge); g.rect(4, top, 12, 1, PX.black); g.set(9, top+1, PX.black); g.set(10, top+1, PX.black);
      if (o.trim === PX.gold) { g.rect(4, top-1, 12, 1, PX.gold); g.rect(5, top-1, 10, 1, PX.black); }
      cockade(12); break;
    }
    case 'bicorne': g.rect(2, top, 16, 1, PX.black); g.rect(3, top-1, 14, 1, PX.black); g.rect(5, top-2, 10, 1, PX.black); g.rect(7, top-3, 6, 1, PX.black);
      if (o.plume) { g.rect(9, top-6, 2, 3, o.plume); g.set(10, top-7, o.plume); }
      if (o.cockade) { g.set(9, top-2, PX.blue); g.set(10, top-2, PX.white); g.set(11, top-2, o.cockade === 'tricolor' ? PX.red : PX.white); }
      break;
    case 'straw': case 'felt': {
      const c = o.hat === 'straw' ? '#d9b765' : '#4a3a2c';
      g.rect(2, top, 16, 1, c); g.rect(6, top-3, 8, 3, c); g.rect(6, top-1, 8, 1, o.hat === 'straw' ? '#8a5a2a' : '#2a2220');
      g.set(4, top, dark(c, .15)); g.set(14, top, dark(c, .15)); break;
    }
    case 'phrygian': g.rect(5, top-2, 10, 3, '#c0392b'); g.rect(6, top-3, 7, 1, '#c0392b'); g.rect(12, top-4, 4, 1, '#c0392b'); g.set(16, top-3, '#c0392b');
      g.set(15, top-3, '#9a2a20'); g.rect(5, top, 10, 1, '#9a2a20'); g.set(6, top+1, PX.blue); g.set(7, top+1, PX.white); g.set(8, top+1, PX.red); break;
    case 'tophat': g.rect(6, top-5, 8, 5, PX.black); g.rect(4, top, 12, 1, PX.black); g.rect(6, top-1, 8, 1, '#4a4650'); if (o.cockade) cockade(10); break;
    case 'coiffe': g.rect(6, top-2, 8, 1, PX.white); g.rect(4, top-1, 12, 2, PX.white); g.rect(5, top+1, 10, 1, '#e6e0d2');
      g.set(4, top+2, PX.white); g.set(15, top+2, PX.white); g.set(4, top+3, '#e6e0d2'); g.set(15, top+3, '#e6e0d2');
      if (o.cockade) { g.set(12, top-1, PX.blue); g.set(13, top-1, PX.white); g.set(14, top-1, PX.red); } break;
    case 'bonnet': { const c = '#f6f3ec';
      g.rect(5, top-2, 10, 1, c); g.rect(4, top-1, 12, 2, c); g.rect(3, top+1, 2, 6, c); g.rect(15, top+1, 2, 6, c);
      g.rect(4, top-1, 12, 1, o.sash || '#b0505a'); g.rect(4, top+1, 12, 1, dark(c, .12)); break; }
    case 'headband': g.rect(5, top+1, 10, 1, o.sash || PX.gold); break;
  }
}
function drawBody(g, o) {
  const b = BODY[o.stage], cx = 10, shoeY = SPRITE_H - 2;
  const legTop = shoeY - b.lh, torsoTop = legTop - b.th, left = cx - b.tw/2, right = cx + b.tw/2 - 1;
  const headTop = torsoTop - 9;
  // Legs and shoes first, so a skirt covers them.
  if (!o.woman) {
    const lx = b.tw <= 6 ? cx-2 : cx-3, rx = b.tw <= 6 ? cx : cx+1;
    for (const x of [lx, rx]) {
      if (o.legStyle === 'breeches') { const k = Math.max(1, Math.ceil(b.lh/2)); g.rect(x, legTop, 2, k, o.legs); g.rect(x, legTop+k, 2, b.lh-k, o.stockings); }
      else if (o.legStyle === 'striped') { g.rect(x, legTop, 1, b.lh, '#3a5a9a'); g.rect(x+1, legTop, 1, b.lh, PX.white); }
      else g.rect(x, legTop, 2, b.lh, o.legs);
    }
    g.rect(lx-1, shoeY, 3, 1, o.shoes); g.rect(rx, shoeY, 3, 1, o.shoes);
    if (o.trim === PX.gold) { g.set(lx, shoeY, PX.gold); g.set(rx+1, shoeY, PX.gold); }
  } else {
    g.rect(cx-3, shoeY, 2, 1, o.shoes); g.rect(cx+1, shoeY, 2, 1, o.shoes);
  }
  // Torso and sleeves.
  const sleeve = o.coat || (o.woman ? o.top : o.top);
  g.rect(left, torsoTop, b.tw, b.th, o.woman ? o.top : (o.coat || o.top));
  g.rect(left-1, torsoTop+1, 1, b.th-2, sleeve); g.rect(right+1, torsoTop+1, 1, b.th-2, sleeve);
  g.set(left-1, torsoTop+b.th-1, o.skin); g.set(right+1, torsoTop+b.th-1, o.skin);
  if (o.empire) { g.rect(left-1, torsoTop+2, 1, b.th-3, o.skin); g.rect(right+1, torsoTop+2, 1, b.th-3, o.skin); }
  if (!o.woman) {
    if (o.coat) {
      g.rect(cx-2, torsoTop, 4, b.th-1, o.vest || PX.shirt);
      g.rect(left, legTop, 2, 2, o.coat); g.rect(right-1, legTop, 2, 2, o.coat);
      if (o.trim) { g.rect(cx-3, torsoTop, 1, b.th, o.trim); g.rect(cx+2, torsoTop, 1, b.th, o.trim); g.set(left-1, torsoTop+b.th-2, o.trim); g.set(right+1, torsoTop+b.th-2, o.trim); }
      g.set(cx-1, torsoTop+3, dark(o.vest || PX.shirt)); g.set(cx-1, torsoTop+5, dark(o.vest || PX.shirt));
    } else if (o.vest) {
      g.rect(left+1, torsoTop+1, b.tw-2, b.th-1, o.vest); g.rect(cx-1, torsoTop, 2, 3, PX.shirt);
      g.set(cx-1, torsoTop+4, dark(o.vest));
    }
    if (o.cravat) g.rect(cx-1, torsoTop, 2, 2, PX.white);
    if (o.neckerchief) g.rect(cx-1, torsoTop, 2, 1, o.neckerchief);
    if (o.belts) for (let i = 0; i < b.th; i++) { g.set(left+i, torsoTop+i, PX.white); g.set(right-i, torsoTop+i, PX.white); }
    if (o.trim && o.coat && !o.belts && o.trim !== PX.gold) { g.rect(cx-2, torsoTop, 4, 1, o.trim); }
    if (o.apron) g.rect(cx-3, torsoTop+2, 6, b.th-2 + Math.min(3, b.lh-1), o.apron);
  } else {
    const waist = torsoTop + (o.empire ? 2 : Math.min(4, b.th-1));
    if (o.fichu) { g.rect(left, torsoTop, b.tw, 2, PX.white); g.rect(cx-1, torsoTop+2, 2, 1, PX.white); }
    if (o.trim && !o.fichu) { g.rect(cx-1, torsoTop, 2, waist-torsoTop, o.trim); }
    if (o.sash) g.rect(left, waist-1, b.tw, 1, o.sash);
    for (let y = waist, i = 0; y < shoeY; y++, i++) {
      const half = Math.min(8, b.tw/2 + 1 + Math.floor(i/2));
      for (let x = cx-half; x < cx+half; x++) g.set(x, y, o.stripe && (x % 2 === 0) ? o.stripe : o.skirt);
    }
    if (o.lace) for (let x = 2; x < 18; x += 2) g.set(x, shoeY-1, PX.white);
    if (o.apron) g.rect(cx-3, waist, 6, shoeY-waist-1, o.apron);
    g.set(left-1, torsoTop+b.th-1, o.skin);
  }
  if (o.shawl) { g.rect(left-1, torsoTop, b.tw+2, 3, o.shawl); g.rect(cx-2, torsoTop+3, 4, 1, o.shawl); g.rect(cx-1, torsoTop+4, 2, 1, o.shawl); }
  if (o.cane) { g.rect(right+2, torsoTop+b.th-1, 1, shoeY-torsoTop-b.th+2, '#6b4a2c'); g.set(right+1, torsoTop+b.th-1, '#6b4a2c'); }
  return headTop;
}
function drawBaby(g, o) {
  const bottom = SPRITE_H - 2, c = PX.white, band = o.swaddle;
  for (let i = 0; i < 9; i++) { const w = i < 2 || i > 6 ? 6 : 8; g.rect(10 - w/2, bottom-8+i, w, 1, i === 8 ? '#ddd5c4' : c); }
  g.rect(6, bottom-5, 8, 1, band); g.rect(7, bottom-3, 6, 1, band);
  g.rect(6, bottom-16, 8, 8, c); g.rect(7, bottom-15, 6, 6, o.skin);
  g.set(8, bottom-12, PX.eye); g.set(11, bottom-12, PX.eye); g.set(7, bottom-11, PX.blush); g.set(12, bottom-11, PX.blush);
  g.rect(6, bottom-17, 8, 1, band); g.rect(7, bottom-18, 6, 1, c);
}
function buildSprite(o) {
  const g = new PixelGrid(SPRITE_W, SPRITE_H);
  if (o.stage === 'baby') drawBaby(g, o);
  else {
    const headTop = drawBody(g, o);
    drawHead(g, o, headTop);
    drawHair(g, o, headTop);
    drawHat(g, o, headTop);
  }
  g.outline(PX.outline);
  return g;
}
const spriteCache = new Map();
function spriteCanvas(doc, look) {
  let c = spriteCache.get(look.key);
  if (!c) { c = buildSprite(look).toCanvas(doc); spriteCache.set(look.key, c); if (spriteCache.size > 400) spriteCache.delete(spriteCache.keys().next().value); }
  return c;
}
const urlCache = new Map();
function spriteURL(doc, look) {
  let u = urlCache.get(look.key);
  if (!u) { u = spriteCanvas(doc, look).toDataURL(); urlCache.set(look.key, u); if (urlCache.size > 400) urlCache.delete(urlCache.keys().next().value); }
  return u;
}

// ---- Scenes ----------------------------------------------------------------
function seasonOf(month) { return [12,1,2].includes(month) ? 'winter' : month <= 5 ? 'spring' : month <= 8 ? 'summer' : 'autumn'; }
function flagOf(year, month) {
  const t = year*12 + month;
  if (t < 1790*12+7) return 'royal';
  if (t < 1814*12+4) return 'tricolor';
  if (t >= 1815*12+3 && t < 1815*12+7) return 'tricolor';
  if (t < 1830*12+8) return 'royal';
  return 'tricolor';
}
function placeKind(s) {
  if (atFront(s)) return 'camp';
  if (s.place.includes('파리')) return 'paris';
  if (s.class === '귀족') return 'chateau';
  if (s.place.includes('농촌')) return 'country';
  return 'town';
}
function sceneSpec(s, cast) {
  return {kind:placeKind(s), place:s.place, season:seasonOf(s.month), month:s.month, year:s.year,
    flag:flagOf(s.year, s.month), dead:s.dead, cast, seed:strHash(s.name + s.place)};
}

function createScene(canvas, doc) {
  const ctx = canvas.getContext('2d');
  let W = 220, H = 84, scale = 3;
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  function resize() {
    const cssW = canvas.parentElement ? canvas.parentElement.clientWidth : 660;
    scale = cssW < 560 ? 2 : 3;
    W = Math.max(150, Math.ceil(cssW / scale)); H = cssW < 560 ? 88 : 84;
    const dpr = Math.min(3, globalThis.devicePixelRatio || 1);
    canvas.width = W * scale * dpr; canvas.height = H * scale * dpr;
    canvas.style.width = W*scale + 'px'; canvas.style.height = H*scale + 'px';
    ctx.setTransform(scale*dpr, 0, 0, scale*dpr, 0, 0); ctx.imageSmoothingEnabled = false;
  }
  function circle(cx, cy, r, c) { for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r*r - y*y)); R(cx-w, cy+y, w*2+1, 1, c); } }
  function cloud(x, y, w, sp) {
    R(x+3, y, w-8, 1, '#ffffff'); R(x+1, y+1, w-3, 2, '#ffffff'); R(x, y+3, w, 2, '#ffffff'); R(x+1, y+5, w-2, 1, sp.cloudShade);
    R(x+Math.floor(w/3), y-2, Math.floor(w/3), 2, '#ffffff');
  }
  function sky(sp) {
    const pal = sp.dead ? ['#b9bcc2','#c7cace','#d4d6d8'] : sp.season === 'winter' ? ['#b4c6d3','#c4d3dd','#d6e1e7'] :
      sp.season === 'autumn' ? ['#93bcd8','#a9cbe0','#c6dbe6'] : ['#8cc6e6','#a3d3ec','#bfe1ef'];
    const band = Math.ceil(H*0.62/3);
    pal.forEach((c, i) => R(0, i*band, W, band, c));
    for (let i = 1; i < 3; i++) for (let x = (i%2); x < W; x += 2) R(x, i*band, 1, 1, pal[i-1]);
    sp.cloudShade = sp.dead ? '#c0c3c6' : '#dbe8ef';
  }
  function sun(sp, t) {
    if (sp.dead) return;
    const x = Math.round(W*0.17), y = 13;
    circle(x, y, 6, sp.season === 'winter' ? '#f6efd2' : '#fff1b8'); circle(x, y, 4, sp.season === 'winter' ? '#fbf5df' : '#ffe58a');
  }
  function clouds(sp, t) {
    const drift = (t/1000) * 1.5;
    [[0.32,6,18],[0.74,4,22],[0.55,15,13],[1.02,11,16]].forEach(([fx, y, w], i) => {
      const x = ((fx*W + drift*(1+i*0.3)) % (W+40)) - 20; cloud(Math.round(x), y, w, sp);
    });
  }
  function hills(sp, y0, colors) {
    for (let x = 0; x < W; x++) {
      const h = Math.round(5 + 3*Math.sin((x + sp.seed%50)/13) + 2*Math.sin((x+7)/5.3));
      R(x, y0 - h, 1, h + 4, colors[0]);
      if ((x + h) % 3 === 0) R(x, y0 - h, 1, 1, colors[1]);
    }
  }
  function tree(x, base, sp, size = 1) {
    const s = sp.season, r = 5*size;
    R(x-1, base-8*size, 2, 8*size, '#6b4a2c');
    if (s === 'winter') { R(x-4*size, base-11*size, 1, 4, '#6b4a2c'); R(x+3*size, base-12*size, 1, 5, '#6b4a2c'); R(x-3*size, base-13*size, 6*size, 1, '#6b4a2c'); return; }
    const c = s === 'autumn' ? ['#d48a3a','#b8662a','#e8b15a'] : s === 'spring' ? ['#6fae5a','#579347','#f2b6c6'] : ['#4f9a4a','#3b7e3a','#78b862'];
    circle(x, base-10*size, r, c[0]); circle(x-2, base-12*size, r-2, c[2] && s !== 'spring' ? c[2] : c[0]);
    for (let i = 0; i < 6; i++) R(x - r + ((i*7 + sp.seed) % (2*r)), base-10*size - r + ((i*5) % (2*r)), 1, 1, c[1]);
    if (s === 'spring') for (let i = 0; i < 5; i++) R(x - r + 1 + ((i*5 + sp.seed) % (2*r-1)), base-12*size + ((i*3) % r), 1, 1, c[2]);
  }
  function roofSnow(x, y, w, sp) { if (sp.season === 'winter' && !sp.dead) R(x, y, w, 1, '#f6f8fa'); }
  function cottage(x, base, sp, opt = {}) {
    const wall = opt.wall || '#efe6d2', roof = opt.roof || '#c9a25a', roofD = dark(roof, .22), w = opt.w || 26, wh = 16, rows = 10;
    R(x, base-wh, w, wh, wall); R(x, base-1, w, 1, dark(wall, .15)); R(x, base-wh, 1, wh, dark(wall, .1));
    for (let i = 0; i < 6; i++) R(x + 2 + (i*7) % (w-4), base-wh+3 + (i%3)*4, 3, 1, dark(wall, .1));
    for (let r = 0; r < rows; r++) { const rw = Math.min(w + 4, 8 + 3*r); R(Math.round(x + w/2 - rw/2), base-wh-rows+r, rw, 1, r % 2 ? roof : roofD); }
    for (let r = 1; r < rows; r += 2) for (let i = 0; i < w; i += 4) R(x - 1 + i + (r%4), base-wh-rows+r, 1, 1, dark(roof, .35));
    roofSnow(Math.round(x + w/2 - 4), base-wh-rows, 8, sp);
    R(x + w - 8, base-wh-rows-1, 3, 6, '#8a6a52');
    R(x + 4, base-10, 6, 10, '#6b4a32'); R(x + 5, base-9, 4, 1, '#5a3c28'); R(x + 8, base-5, 1, 1, PX.gold);
    R(x + w - 13, base-12, 8, 6, '#f5efe0'); R(x + w - 12, base-11, 6, 4, '#7fa6c4'); R(x + w - 9, base-11, 1, 4, '#f5efe0'); R(x + w - 12, base-9, 6, 1, '#f5efe0');
    R(x + w - 14, base-12, 1, 6, '#4f7a5a'); R(x + w - 5, base-12, 1, 6, '#4f7a5a');
  }
  function townhouse(x, base, w, floors, sp, opt = {}) {
    const wall = opt.wall || '#e2d6bf', roof = opt.roof || '#566472', top = base - floors*9 - 1;
    R(x, top, w, base-top, wall); R(x, top, 1, base-top, dark(wall, .12));
    if (opt.timber) { for (let i = 0; i <= w; i += 6) R(x+i, top, 1, base-top, '#6b4a32'); for (let f = 0; f <= floors; f++) R(x, top + f*9, w, 1, '#6b4a32'); }
    for (let f = 0; f < floors; f++) for (let i = 2; i + 3 <= w - 1; i += 6) {
      const wy = top + 2 + f*9;
      if (f === floors-1 && i > 2 && i < 10) continue;
      R(x+i, wy, 3, 5, '#5f7f99'); R(x+i, wy, 3, 1, '#87a5bb'); R(x+i-1, wy+5, 5, 1, light(wall, .3));
      if (opt.shutters) { R(x+i-1, wy, 1, 5, opt.shutters); R(x+i+3, wy, 1, 5, opt.shutters); }
    }
    R(x+3, base-7, 5, 7, '#5a3e2c'); R(x+3, base-8, 5, 1, dark(wall, .2));
    const rh = opt.mansard ? 6 : 5;
    for (let r = 0; r < rh; r++) { const inset = opt.mansard ? Math.max(0, r - 3) : rh - r; R(x - 1 + inset, top - rh + r, w + 2 - inset*2, 1, r % 2 ? roof : dark(roof, .15)); }
    roofSnow(x+1, top-rh, w-2, sp);
    if (opt.mansard) for (let i = 3; i < w - 4; i += 8) { R(x+i, top-5, 4, 4, wall); R(x+i+1, top-4, 2, 3, '#5f7f99'); }
    R(x + w - 6, top - rh - 4, 3, 4, '#b26b4f'); R(x + 3, top - rh - 3, 2, 3, '#b26b4f');
    return top - rh;
  }
  function chateau(x, base, w, sp) {
    const wall = '#efe8da', roof = '#4c5866';
    const top = townhouse(x+8, base, w-16, 3, sp, {wall, roof, mansard:true});
    for (const tx of [x, x + w - 10]) {
      R(tx, base-30, 10, 30, wall); R(tx, base-30, 1, 30, dark(wall, .12));
      for (let f = 0; f < 3; f++) { R(tx+4, base-27+f*9, 2, 4, '#5f7f99'); }
      for (let r = 0; r < 12; r++) { const rw = Math.max(1, Math.round((r+1)*11/12)); R(tx + 5 - rw/2, base-42+r, rw, 1, r % 2 ? roof : dark(roof, .2)); }
      R(tx+5, base-45, 1, 3, PX.gold);
    }
    return top;
  }
  function church(x, base, c) {
    R(x, base-14, 12, 14, c); R(x+4, base-24, 4, 10, c);
    for (let r = 0; r < 8; r++) R(x+6 - Math.ceil(r/3), base-32+r, Math.ceil(r/3)*2 || 1, 1, c);
    R(x+6, base-35, 1, 3, c); R(x+5, base-34, 3, 1, c);
  }
  function notreDame(x, base, c) {
    R(x, base-26, 8, 26, c); R(x+14, base-26, 8, 26, c); R(x+8, base-20, 6, 20, c);
    R(x+22, base-15, 24, 15, c); R(x+33, base-28, 1, 13, c); R(x+32, base-20, 3, 5, c);
    circle(x+11, base-14, 2, light(c, .25));
    for (let i = 1; i < 8; i += 3) { R(x+i, base-24, 1, 3, light(c, .18)); R(x+14+i, base-24, 1, 3, light(c, .18)); }
  }
  function flag(x, top, sp, t, pole = 30) {
    top = Math.max(2, top);
    R(x, top, 1, pole, '#6b5a48'); R(x-1, top-1, 3, 1, PX.gold);
    const wave = sp.moving ? Math.floor(t/250) % 2 : 0;
    for (let i = 0; i < 10; i++) {
      const dy = (i + wave) % 4 === 0 ? 1 : 0;
      let c;
      if (sp.flag === 'tricolor') c = i < 3 ? PX.blue : i < 7 ? '#f4f1e6' : '#c8343a';
      else c = '#f4f1e6';
      R(x+1+i, top+1+dy, 1, 6, c);
    }
    if (sp.flag === 'royal') { R(x+5, top+3, 2, 2, PX.gold); R(x+4, top+4, 1, 1, PX.gold); R(x+7, top+4, 1, 1, PX.gold); }
  }
  function fence(y, sp) {
    const wood = sp.dead ? '#7a756e' : '#7a5434', d = dark(wood, .3);
    R(0, y+2, W, 1, wood); R(0, y+5, W, 1, wood); R(0, y+3, W, 1, d);
    for (let x = 2; x < W; x += 7) { R(x, y, 2, 8, wood); R(x+1, y, 1, 8, d); }
  }
  function ground(sp, gy) {
    const winter = sp.season === 'winter' && !sp.dead, urban = sp.kind === 'paris' || sp.kind === 'town';
    const grass = sp.dead ? '#8e9a86' : winter ? '#eef2f4' : sp.season === 'autumn' ? '#9fb352' : '#76b950';
    const grassD = sp.dead ? '#7a8672' : winter ? '#cfd9e0' : sp.season === 'autumn' ? '#7f9440' : '#5b9b40';
    if (urban) {
      R(0, gy, W, H-gy, sp.dead ? '#8f8c86' : winter ? '#e6eaee' : '#a49d90');
      for (let y = gy+1; y < H; y += 3) for (let x = (y % 2) * 3; x < W; x += 6) R(x, y, 4, 2, winter ? '#f3f6f8' : sp.dead ? '#9a978f' : '#b5ad9e');
      R(0, gy, W, 1, dark('#a49d90', .2));
      return;
    }
    R(0, gy, W, 3, grass); R(0, gy+3, W, H-gy-3, sp.dead ? '#7d7266' : winter ? '#e8edf0' : '#8b6a4f');
    for (let x = 0; x < W; x += 3) R(x, gy - ((x*7) % 3 === 0 ? 1 : 0), 1, 1, grassD);
    for (let i = 0; i < W/3; i++) {
      const x = (i*37 + sp.seed) % W, y = gy + 5 + ((i*13) % (H-gy-6));
      R(x, y, 1, 1, winter ? '#cdd8df' : i % 2 ? '#6e523d' : '#a3826a');
    }
  }
  function field(sp, y0) {
    if (sp.dead) return;
    const s = sp.season, c = s === 'summer' && sp.month >= 7 ? ['#e2c15e','#c9a446'] : s === 'autumn' ? ['#c9a876','#a8865a'] : s === 'winter' ? ['#e9eef1','#d5dde3'] : ['#9cc76a','#86b45a'];
    R(0, y0, W, 6, c[0]);
    for (let x = 0; x < W; x += 2) R(x, y0 + (x % 4 === 0 ? 1 : 3), 1, 1, c[1]);
    if (sp.place.includes('부르고뉴') && s !== 'winter') for (let x = 4; x < W; x += 6) { R(x, y0+1, 1, 4, '#5b7a3a'); R(x+1, y0+2, 1, 1, '#7a3a5a'); }
  }
  function laundry(x1, x2, y, sp) {
    if (sp.season === 'winter' || sp.dead) return;
    R(x1, y, 1, 14, '#6b4a2c'); R(x2, y, 1, 14, '#6b4a2c'); R(x1, y+1, x2-x1, 1, '#d9d2c4');
    const cloth = ['#2f8f80','#e3b03a','#c8443f','#f2efe6','#3f7fb0'];
    for (let i = 0, x = x1 + 3; x + 4 < x2; i++, x += 7) R(x, y+2, 4, 5 + (i%2), cloth[(i + sp.seed) % cloth.length]);
  }
  function lantern(x1, x2, y, sp) {
    R(x1, y, x2-x1, 1, '#4a4038'); const mid = Math.round((x1+x2)/2);
    R(mid-1, y+1, 3, 4, '#3a3430'); R(mid, y+2, 1, 2, sp.dead ? '#bbb' : '#ffd86a');
  }
  function snowfall(sp, t) {
    if (sp.season !== 'winter' || sp.dead) return;
    for (let i = 0; i < W/5; i++) {
      const x = (i*29 + sp.seed + Math.floor(t/400)*(i%3 ? 1 : 0)) % W, y = (i*17 + Math.floor(t/120)) % (H-12);
      R(x, y, 1, 1, '#ffffff');
    }
  }
  function grave(x, base) {
    R(x-4, base-14, 8, 14, '#9a958c'); R(x-3, base-15, 6, 1, '#9a958c'); R(x-1, base-12, 2, 7, '#5f5a54'); R(x-3, base-10, 6, 2, '#5f5a54');
    R(x-6, base, 12, 1, '#6e6a62'); R(x+5, base-3, 2, 3, '#b8586a'); R(x-7, base-2, 2, 2, '#e6d36a');
  }
  function backdrop(sp, t) {
    sky(sp); sun(sp, t); clouds(sp, t);
    const gy = H - 22, horizon = gy - 8;
    const k = sp.kind;
    if (k === 'paris') {
      for (let x = -4, i = 0; x < W; i++) { const w = 14 + (i*7 + sp.seed) % 10, h = 22 + (i*11) % 12; R(x, horizon - h + 6, w, h, i % 2 ? '#c4ccd3' : '#b7c1c9'); R(x, horizon-h+4, w, 2, '#9fa9b3'); x += w; }
      notreDame(Math.round(W*0.42), horizon+2, '#a7b1bb');
    } else if (k === 'town') {
      hills(sp, horizon, ['#b5c8b0','#a6bba0']);
      for (let x = -2, i = 0; x < W; i++) { const w = 12 + (i*5 + sp.seed) % 8, h = 12 + (i*7) % 8; R(x, horizon - h + 4, w, h, '#c9cfc9'); R(x-1, horizon-h+1, w+2, 3, '#a8b0b6'); x += w + 1; }
      church(Math.round(W*0.6), horizon+3, '#a9b2b4');
      if (sp.place.includes('보르도')) for (const fx of [0.3, 0.36, 0.78]) { const mx = Math.round(W*fx); R(mx, horizon-24, 1, 26, '#7a6a5a'); R(mx-4, horizon-20, 9, 1, '#7a6a5a'); R(mx-3, horizon-19, 7, 5, '#efe9dc'); }
    } else {
      hills(sp, horizon - 4, sp.dead ? ['#a4aaa2','#989e96'] : sp.season === 'winter' ? ['#d4dde2','#c6d0d6'] : ['#a8c79a','#98b98a']);
      hills({...sp, seed:sp.seed+31}, horizon + 2, sp.dead ? ['#959b92','#8a9087'] : sp.season === 'winter' ? ['#e3e9ec','#d3dbe0'] : ['#8fb57c','#7fa66e']);
      church(Math.round(W*0.55), horizon + 2, sp.dead ? '#8f948f' : '#a2ad9e');
      if (k === 'country') field(sp, gy - 7);
    }
    return {gy, horizon};
  }
  function buildings(sp, gy, t) {
    const k = sp.kind, slate = sp.place.includes('브르타뉴') || sp.place.includes('투르');
    if (k === 'camp') {
      const tent = (x, w) => { for (let r = 0; r < 12; r++) { const rw = Math.max(2, Math.round(w * (r + 1) / 12)); R(x + w/2 - rw/2, gy - 11 + r, rw, 1, r % 3 ? '#e8e0cc' : '#d6ccb4'); } R(x + w/2 - 1, gy - 5, 3, 6, '#5a4a3a'); R(x + w/2, gy - 13, 1, 3, '#6b5a48'); };
      tent(4, 24); tent(30, 20); tent(W - 30, 24);
      for (let i = 0; i < 3; i++) { R(W - 52 + i*3, gy - 9 + i, 1, 10, '#5a4a3a'); }
      R(W - 54, gy - 9, 11, 1, '#5a4a3a');
      const cx = W - 70; R(cx, gy - 3, 12, 3, '#3d3a36'); R(cx - 2, gy - 1, 3, 3, '#4a4038'); R(cx + 10, gy - 1, 3, 3, '#4a4038'); R(cx + 11, gy - 5, 8, 2, '#3d3a36');
      if (!sp.dead) { const f = Math.floor(t / 300) % 2; R(58, gy - 2, 6, 2, '#6b4a2c'); R(59, gy - 5 - f, 2, 3, '#e8963a'); R(61, gy - 4, 2, 2, '#f2c84b'); R(60, gy - 9 - f, 1, 3, '#b9b5ad'); }
      flag(W - 12, gy - 30, sp, t, 31);
    } else if (k === 'paris') {
      townhouse(-6, gy+1, 40, 4, sp, {wall:'#e4dbc8', roof:'#5b6875', mansard:true, shutters:'#7a8a8a'});
      const top = townhouse(W-46, gy+1, 48, 4, sp, {wall:'#dcd2bc', roof:'#5b6875', mansard:true});
      flag(W-30, top - 12, sp, t, 13); lantern(34, W-46, gy-26, sp);
    } else if (k === 'town') {
      const timber = sp.place.includes('루앙') || sp.place.includes('투르');
      const lyon = sp.place.includes('리옹');
      townhouse(2, gy+1, 30, 2, sp, {wall: timber ? '#f1ead8' : lyon ? '#e8b98c' : '#ebe2cc', roof: timber || slate ? '#4f5a66' : '#b5533c', timber});
      const top = townhouse(W-44, gy+1, 42, 3, sp, {wall: lyon ? '#e9c79a' : '#e6dcc6', roof: slate || timber ? '#4f5a66' : '#b0573f', shutters: lyon ? '#3f7a6a' : '#4f6a7a'});
      flag(W-36, top - 12, sp, t, 13);
    } else if (k === 'chateau') {
      tree(10, gy+1, sp, 1); tree(W*0.3, gy+1, sp, 1);
      const top = chateau(W-62, gy+1, 60, sp);
      flag(W-34, top - 12, sp, t, 13);
      for (let x = 0; x < W - 64; x += 6) R(x, gy-3, 5, 3, sp.dead ? '#7f8a7c' : sp.season === 'winter' ? '#dfe7ea' : '#3f7a3a');
    } else {
      const auvergne = sp.place.includes('오베르뉴');
      tree(Math.round(W*0.36), gy, sp, 1);
      cottage(4, gy+1, sp, {wall: auvergne ? '#b9b3a8' : slate ? '#cfc8bb' : '#efe6d2', roof: slate ? '#5d6b7a' : auvergne ? '#8a5040' : '#c9a25a', w:28});
      cottage(W-40, gy+1, sp, {wall: slate ? '#d8d2c6' : '#e9dfc8', roof: slate ? '#5d6b7a' : '#b5533c', w:36});
      flag(W-50, gy-30, sp, t, 31);
      laundry(36, Math.min(W-54, 36 + 40), gy-15, sp);
    }
    if (k !== 'paris' && k !== 'camp') fence(gy - 7, sp);
  }
  function drawCast(sp, gy, t) {
    const feet = gy + 7, cast = sp.cast, n = cast.length;
    if (!n) return;
    const step = Math.min(15, Math.floor((W - 24) / Math.max(1, n))), start = Math.round(W/2 - (step*(n-1))/2);
    cast.forEach((a, i) => {
      const bob = sp.moving && (Math.floor(t/ (380/Math.sqrt(sp.speed||1))) + i) % 2 === 0 ? 1 : 0;
      const sx = start + i*step - SPRITE_W/2, sy = feet - SPRITE_H + 1 - bob;
      const img = spriteCanvas(doc, a.look);
      ctx.drawImage(img, sx, sy);
      if (a.me) {
        const ay = sy + img.topRow - 5 + (Math.floor(t/500) % 2);
        const mx = sx + 9;
        R(mx-1, ay-1, 4, 1, PX.outline); R(mx-1, ay, 4, 1, '#f2c84b'); R(mx, ay+1, 2, 1, '#f2c84b'); R(mx-2, ay, 1, 1, PX.outline); R(mx+3, ay, 1, 1, PX.outline); R(mx-1, ay+1, 1, 1, PX.outline); R(mx+2, ay+1, 1, 1, PX.outline); R(mx, ay+2, 2, 1, PX.outline);
      }
    });
  }
  let measured = -1;
  function draw(sp, t = 0) {
    if (!sp) return;
    const cw = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    if (cw && cw !== measured) { measured = cw; resize(); }
    const {gy} = backdrop(sp, t);
    buildings(sp, gy, t);
    ground(sp, gy);
    if (sp.dead) grave(Math.round(W/2), gy + 8);
    else drawCast(sp, gy, t);
    snowfall(sp, t);
    if (sp.dead) { ctx.fillStyle = 'rgba(70,72,80,.18)'; ctx.fillRect(0, 0, W, H); }
  }
  resize();
  return {draw, resize, get width() { return W; }};
}

// A framed bust for the passport card, and a small chip for relation lists.
function portraitURL(doc, look, sp) {
  const key = 'p' + look.key + sp.season + sp.kind + sp.dead;
  let u = urlCache.get(key);
  if (u) return u;
  const c = doc.createElement('canvas'); c.width = 28; c.height = 34;
  const x = c.getContext('2d'), R = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  const winter = sp.season === 'winter';
  R(0, 0, 28, 22, winter ? '#c8d6df' : '#a9d6ec'); R(0, 0, 28, 6, winter ? '#b7c8d4' : '#93c9e6');
  if (sp.kind === 'paris' || sp.kind === 'town') { R(0, 12, 9, 12, '#d9cfbb'); R(20, 9, 8, 15, '#d2c8b4'); R(2, 14, 2, 3, '#5f7f99'); R(23, 12, 2, 3, '#5f7f99'); }
  else { R(0, 16, 28, 6, winter ? '#e3e9ec' : '#98b98a'); }
  R(0, 22, 28, 2, winter ? '#eef2f4' : '#76b950'); R(0, 24, 28, 10, winter ? '#e8edf0' : '#8b6a4f');
  if (sp.kind !== 'paris') { R(0, 18, 28, 1, '#7a5434'); R(0, 20, 28, 1, '#7a5434'); for (let i = 1; i < 28; i += 6) R(i, 16, 1, 7, '#5a3c24'); }
  x.drawImage(spriteCanvas(doc, look), 4, 2);
  u = c.toDataURL(); urlCache.set(key, u);
  return u;
}
