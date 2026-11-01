# 어느 프랑스인의 삶

1750–1850년 프랑스에서 태어난 한 사람의 일생을 살아 보는 픽셀아트 생애 시뮬레이션.

- `index.html` — 게임 (GitHub Pages 첫 화면, 브라우저로 바로 열 수도 있음)
- `french_life_v11.html` — 같은 게임
- `site/index.html` — 문서 틀 없이 감싸 주는 호스트(claude.ai 아티팩트)용 빌드
- `src/v11/` — 소스와 빌드 스크립트: `node src/v11/build.mjs`
- `original/french_life_v10.html` — 개편 전 원본
- `docs/analysis.md` — 분석과 변경 기록

## 광장 (커뮤니티)
- `community.html` — 업데이트 노트 · 의견 보내기 · 플레이어 이야기 (GitHub Pages: `/community.html`)
- `updates.md` — 업데이트 노트 원본. 맨 위에 `## v0.20 · 날짜 · 제목` 과 `- 항목`을 추가하면 커뮤니티 페이지에 바로 나옵니다.
- `.github/ISSUE_TEMPLATE/` — 의견(플레이 소감)·버그 제보 양식
- 플레이어 이야기(방명록)는 구글 설문으로 받고, 응답 시트를 CSV로 웹에 게시해 시작 화면과 광장에 띄웁니다. 설정은 `src/v11/guestbook.js` 맨 위 `GUESTBOOK`(csv, form, prefill)에 넣고 `node src/v11/build.mjs`로 다시 빌드하세요. 시트에 `숨김` 열을 만들어 글자를 적으면 그 줄이 숨겨집니다.
