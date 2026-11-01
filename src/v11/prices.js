// src/prices.js — what bread cost and what a day's work paid.
// Rough figures for the Paris 4-livre (about 2 kg) loaf of ordinary bread and an unskilled day wage, in
// sous (20 sous = 1 livre, later 1 franc). Provinces and the countryside paid less and ate cheaper bread.
// Sources in spirit: Labrousse, Rudé and Kaplan on Paris bread; Simiand and Chevalier on wages.
const BREAD_SOUS = {1750:9, 1768:11, 1770:12, 1771:11, 1774:10, 1775:13, 1776:9, 1788:12, 1789:14, 1790:12, 1795:16, 1796:14, 1797:11,
  1801:16, 1803:12, 1811:13, 1812:18, 1813:13, 1816:16, 1817:19, 1818:15, 1819:12, 1828:15, 1829:16, 1830:15, 1832:12, 1839:14, 1841:13, 1846:16, 1847:19, 1848:12};
const WAGE_SOUS = {1750:18, 1780:20, 1790:24, 1800:36, 1815:40, 1830:44, 1845:46};
const stepValue = (table, year) => Object.keys(table).map(Number).filter(y => y <= year).reduce((v, y) => table[y], table[Object.keys(table)[0]]);
function pricesOf(s) {
  const paris = s.place === '파리', rural = s.place.includes('농촌');
  const bread = Math.round(stepValue(BREAD_SOUS, s.year) * (paris ? 1 : rural ? .8 : .9));
  const wage = Math.round(stepValue(WAGE_SOUS, s.year) * (paris ? 1 : rural ? .6 : .75));
  return {bread, wage, share:Math.round(bread / wage * 100), franc:s.year >= 1795, assignat:s.year >= 1794 && s.year <= 1796};
}
function priceLine(s) {
  const p = pricesOf(s), unit = p.franc ? '수(1프랑=20수)' : '수';
  return `빵 2kg 한 덩이 약 ${p.bread}수 · 날품 하루 약 ${p.wage}${unit}`;
}
