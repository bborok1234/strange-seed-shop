# Item 0062 — 첫 수확 생명체 reveal 보상감 polish

Status: active
Work type: game_ui
Issue: #103
Date: 2026-04-29

## Small win

첫 생명체를 얻는 순간이 일반 앱 모달이 아니라 “귀여운 아이를 뽑았다/발견했다”는 수집형 게임 보상 화면처럼 느껴진다. 모바일 393/360에서 캐릭터, 발견 문구, 다음 목표, `도감에 기록하기` CTA가 한 화면 안에 잘리지 않고 보인다.

## Plan

1. `src/App.tsx`의 harvest reveal markup을 보상 화면 구조로 바꾼다.
   - portrait frame, sparkle/halo 장식, 발견 title, trait chips, 다음 목표 teaser를 추가한다.
   - 기존 `도감에 기록하기` 버튼 텍스트와 클릭 동작은 유지한다.
2. `src/styles.css`에서 reveal card를 모바일 viewport에 맞춰 compact + game reward 스타일로 조정한다.
   - 393/360 viewport에서 card bottom과 CTA가 viewport 안에 들어오도록 max-height/spacing을 제어한다.
   - portrait가 focal point가 되도록 glow/ring/scale을 추가한다.
3. `tests/visual/p0-mobile-game-shell.spec.ts`에 harvest reveal 전용 Playwright assertions를 추가한다.
   - 393/360에서 card bounds, CTA visibility, portrait size, body scroll 없음 검증.
   - screenshot artifact를 남긴다.
4. visual evidence report와 screenshots를 `reports/visual/`에 저장한다.
5. `docs/ROADMAP.md`, `docs/BROWSER_QA.md`, `scripts/check-p0-game-ui-ux.mjs`를 갱신한다.
6. `npm run check:visual`, `npm run check:p0-ui-ux`, `npm run check:all`로 검증한다.

## 수용 기준

- [ ] 모바일 393/360에서 reveal card가 viewport 안에 들어오고 CTA가 잘리지 않는다.
- [ ] 캐릭터 portrait가 현재보다 큰 focal point가 된다.
- [ ] “새 생명체 소유”보다 게임 보상/도감 발견 문구로 읽힌다.
- [ ] Playwright visual test가 reveal viewport/CTA 회귀를 잡는다.
- [ ] visual evidence와 `npm run check:all` 결과가 남는다.

## 금지 범위

- 저장 구조, 경제 값, 콘텐츠 schema, analytics event 이름 변경 금지.
- 실제 결제/로그인/광고/외부 배포/runtime image generation 금지.
