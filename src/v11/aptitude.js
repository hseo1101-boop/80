// src/aptitude.js
// Innate aptitude and starting knowledge follow an IQ-like bell curve (mean 50, SD 15, clamped 1–100):
// 1–19 ≈2.3% · 20–34 ≈13.6% · 35–49 ≈34.1% · 50–64 ≈34.1% · 65–79 ≈13.6% · 80–94 ≈2.1% · 95–100 ≈0.1%.
const APTITUDE_BANDS = [
  {max:19, label:'매우 낮음', mult:.70}, {max:34, label:'낮음', mult:.85}, {max:49, label:'평균보다 낮음', mult:.95},
  {max:64, label:'평균~평균 이상', mult:1.00}, {max:79, label:'높음', mult:1.10}, {max:94, label:'매우 높음', mult:1.20},
  {max:100, label:'극히 드묾', mult:1.30}
];
const bellScore = z => Math.max(1, Math.min(100, Math.round(50 + 15*z)));
function gaussian(next) {
  const u = Math.max(1e-12, next()), v = next();
  return [Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v), Math.sqrt(-2*Math.log(u)) * Math.sin(2*Math.PI*v)];
}
// Starting knowledge is correlated with aptitude (r ≈ 0.7) but keeps the same bell-shaped spread.
function assignAptitude(s) {
  const [za, zb] = gaussian(() => random(s));
  s.aptitude = bellScore(za);
  s.stats.지식 = bellScore(0.7*za + Math.sqrt(1 - 0.49)*zb);
}
// Saves from before v0.11.3 get a stable aptitude derived from the person, without touching game RNG.
function legacyAptitude(v) {
  let x = strHash(String(v.name) + v.born) || 1;
  const next = () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  return bellScore(gaussian(next)[0]);
}
function aptitudeBand(score) { return APTITUDE_BANDS.find(b => score <= b.max); }
// Share of people at or above this score under the normal curve.
function aptitudeTopPercent(score) {
  const z = (score - 50) / 15, t = 1 / (1 + .3275911*Math.abs(z)/Math.SQRT2);
  const erf = 1 - (((((1.061405429*t - 1.453152027)*t) + 1.421413741)*t - .284496736)*t + .254829592)*t*Math.exp(-z*z/2);
  const cdf = .5 * (1 + Math.sign(z) * erf);
  return Math.max(.1, (1 - cdf) * 100);
}
// Knowledge gains are scaled by aptitude and slow down above 50, so the adult spread stays bell-shaped
// instead of everyone piling up at 100. Losses are not scaled.
function knowledgeDelta(s, delta) {
  if (delta <= 0) return delta;
  const mult = aptitudeBand(s.aptitude || 50).mult, k = s.stats.지식;
  const room = k < 50 ? 1 : Math.max(.08, ((100 - k) / 50) ** 2);
  return Math.round(delta * mult * room * 10) / 10;
}
// Knowledge is a standing among one's peers, not a running total: each year it drifts 5% back toward
// the person's aptitude, so what was learned matters most when it is kept up.
function knowledgeYear(s) {
  const k = s.stats.지식, target = s.aptitude || 50;
  s.stats.지식 = clamp(Math.round((k + (target - k) * .05) * 10) / 10);
}
