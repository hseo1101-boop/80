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
- 플레이어 이야기는 GitHub Discussions의 `Player Stories` 카테고리를 씁니다. giscus 위젯을 켜려면 `community.html` 위쪽 `CONFIG`에 giscus.app에서 받은 `giscusRepoId`, `giscusCategoryId`를 넣으세요.
