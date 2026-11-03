// Invariant audit: plays many lives and reports runtime errors, empty choice sets, unreplaced text tokens,
// stats out of range, women in posts closed to them, impossible family dates and repeated historic scenes.
// Usage: node tools/audit.cjs [lives=300] [seed=99] [--en]   (rebuild first: node src/v11/build.mjs)
// --en plays in English mode up to 1820 and also reports Korean left in English text and unfilled placeholders.
const G=require('./engine.cjs');
const ARGS=process.argv.slice(2).filter(a=>!a.startsWith('--')),EN=process.argv.includes('--en');if(EN)G.setLang('en');
const N=+ARGS[0]||300;let seed=+(ARGS[1]||99);const HANGUL=/[가-힣]/,ENBAD=/\{\d+(:\w+)?\}|\{[가-힣]+\}/;const rnd=()=>(seed=(seed*1103515245+12345)>>>0)/4294967296;
const e=new G.GameEngine();const bugs={};const add=(k,ex)=>{(bugs[k]=bugs[k]||{n:0,ex:[]}).n++;if(bugs[k].ex.length<3)bugs[k].ex.push(ex)};
const fams=[null,{place:'파리',class:'도시 평민'},{place:'파리',class:'부르주아'},{place:'투르',class:'귀족'},{place:'리옹',class:'도시 평민'},{place:'브르타뉴 농촌',class:'농민'},{place:'보르도',class:'부르주아'}];
const BAD=/\{[가-힣a-z]+\}|○○|undefined|NaN|null(?!\w)|\[object/;
const MALE_ONLY=/^(군인|육군|사제|보좌 신부|본당 신부|주교|신학생|변호사|법률 서기|국민 대표 의원|도지사|지방 행정관|순경|경찰|은행가|도매상|공장주|산업가|이공대학|학사원|외과의|의사|선장|항해사|토목 기사)/;
for(let i=0;i<N;i++){const f=fams[i%fams.length];let s;
 try{e.replace(G.createState(5000+i*131,{born:EN?1745+Math.floor(rnd()*60):1745+Math.floor(rnd()*116),...(f?{family:f}:{})}));s=e.state;}catch(err){add('createState throws',String(err));continue}
 let n=0,lastLog=0;const seen={};
 try{while(!s.dead&&n++<5000){
  if(EN&&s.year>1820)break;
  if(s.decision){if(s.decisionResult){e.acknowledgeDecision();continue}
   const d=G.decisions.find(x=>x.id===s.decision);if(!d){add('unknown decision',s.decision);break}
   const o=d.choices.map((c,j)=>[c,j]).filter(([c])=>G.choiceAvailable(s,c));
   if(!o.length){add('no available choice',d.id+' '+s.job+' '+s.year);break}
   seen[d.id]=(seen[d.id]||0)+1;
   e.choose(o[Math.floor(rnd()*o.length)][1]);
  }else e.skipToDecision();
  for(const [k,v] of Object.entries(s.stats))if(!(v>=0&&v<=100))add('stat out of range',k+'='+v+' '+s.year);
  if(s.sex==='여성'&&MALE_ONLY.test(s.job)&&!/의 /.test(s.job))add('woman in male-only job',s.job+' '+s.year);
  if(G.ageOf(s)<10&&!['없음','도제','목동','방적공'].includes(s.job)&&s.job)add('child with job',s.job+' age '+G.ageOf(s));
  for(let k=lastLog;k<s.log.length;k++){const x=s.log[k];if(BAD.test(x.title+' '+x.desc))add('bad token in log',x.title+' :: '+(x.title+' '+x.desc).match(BAD)[0]+' :: '+x.desc.slice(0,80));}
  if(EN)for(let k=lastLog;k<s.log.length;k++){const x=s.log[k];for(const t of [x.title,x.desc]){const r=G.L(t);if(HANGUL.test(r.replace(/\{[^}]*\}/g,'')))add('Korean in English log',t.slice(0,90));else if(ENBAD.test(r))add('placeholder left in English',r.slice(0,90));}}
  lastLog=s.log.length;
 }}catch(err){add('runtime error',String(err&&err.stack||err).split('\n').slice(0,3).join(' | '));continue}
 // post-life checks
 const sp=s.relations.filter(r=>r.role==='배우자');for(const r of sp)if(r.sex&&r.sex===s.sex)add('same-sex spouse',r.name);
 for(const r of s.relations){if(r.birthYear>s.year)add('relation born in future',r.role+' '+r.birthYear+'>'+s.year);if(r.role==='자녀'&&r.birthYear-s.born<14)add('child born when player <14',r.birthYear-s.born);if(r.role==='자녀'&&s.sex==='여성'&&r.birthYear-s.born>50&&r.alive!==undefined&&!/맡긴|조카/.test(r.role))add('child born to woman >50',r.birthYear-s.born);
  if(['아버지','어머니'].includes(r.role)&&s.born-r.birthYear<14)add('parent too young',r.role+' '+(s.born-r.birthYear));}
 for(const x of s.log){if(x.year>s.year)add('log after death/current',x.year+'>'+s.year+' '+x.title)}
 for(const [id,c] of Object.entries(seen)){const d=G.decisions.find(x=>x.id===id);if(c>1&&d.historic)add('historic decision repeated',id+' x'+c)}
 if(s.dead&&!s.log.some(x=>x.title==='생애의 끝'))add('dead without end log',s.year);
}
if(EN){const m=[...G.I18N_MISS.entries()].sort((a,b)=>b[1].n-a[1].n);console.log('untranslated pieces:',m.length);for(const [k,v] of m.slice(0,25))console.log(String(v.n).padStart(5),k.slice(0,100));}
for(const [k,v] of Object.entries(bugs).sort((a,b)=>b[1].n-a[1].n))console.log(String(v.n).padStart(5),k,'\n      ',v.ex.join('\n       '));
console.log('done',N);
