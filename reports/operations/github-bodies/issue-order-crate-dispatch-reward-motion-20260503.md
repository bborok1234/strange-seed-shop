# 첫 주문 납품을 상자 출하 상태와 보상 흐름으로 production화한다

## 문제 / 배경

#292로 복귀 보상 CTA가 첫 주문 납품 가능 상태까지 이어졌지만, 실제 `납품` 순간은 아직 production idle game처럼 읽히지 않는다. 플레이어는 주문 상자가 채워졌는지, 출하됐는지, 어떤 보상이 수거됐는지를 한 장면에서 감각적으로 확인해야 한다.

Studio Harness v3 queue가 비었으므로 local ledger가 아니라 GitHub issue를 새 WorkUnit authority로 만든다. 이 작업은 `$seed-ops` 재사용이 아니라 Studio Harness v3 foreground operator의 production game quality intake다.

## 후보 비교 / 선택 근거

1. 선택: 첫 주문 납품 상자 출하 + 보상 수거 motion
   - player verb: `납품하기`, `보상 수거 확인`
   - production/progression role: 주문/자동 생산 엔진의 첫 payoff
   - screen moment: 복귀 또는 생산 잎 수령 직후 첫 주문이 `12/12`가 된 순간
   - asset/FX/game-feel payoff: 새 그래픽 asset 없이 order crate visual state, reward motion, delivery trail/state copy를 UI motion으로 표현
   - playtest evidence: 모바일 393px에서 납품 전/후 상자 상태, 보상 흐름, bottom-tab overlap, overflow를 screenshot으로 검증
2. 보류: 원정 teaser를 다음 생산 목표로 연결
   - 이유: 현재 첫 주문 payoff가 약하면 원정 teaser가 또 다른 카드처럼 보인다. 생산 엔진 첫 payoff를 먼저 고정한다.
3. 보류: 도감 memory appreciation 추가 polish
   - 이유: #275/#282에서 이미 creature stage와 memory reward가 개선됐다. 이번 queue-empty intake는 core production loop payoff를 우선한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용 기준: protect playfield, low-density persistent HUD, first actionable screen, main verbs, HUD readability, playfield obstruction, screenshot evidence.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0150-order-crate-dispatch-reward-motion.md`
- 예상 변경 단계:
  1. 현재 주문 납품 상태/telemetry/test surface 매핑
  2. 납품 가능/출하 완료/보상 수거 상태를 UI state로 추가
  3. 모바일에서 order crate visual state와 reward motion이 card clipping/bottom-tab overlap 없이 보이게 CSS 보강
  4. focused visual regression 추가
  5. Browser Use `iab` 우선 QA 시도, 현재 CLI 세션 blocker면 신규 blocker + Playwright fallback evidence 기록
  6. roadmap/dashboard/control room/PR evidence 갱신
- 검증 계획: `npm run build`, focused Playwright visual test, `npm run check:visual`, `npm run check:ci`
- 건드리지 않을 범위: 새 raster asset generation, manifest asset 등록, payment/login/ads/customer data/external deploy, seed-ops entrypoint 부활.

## 플레이어 가치 또는 운영사 가치

- 게임 가치: 첫 주문 납품이 단순 숫자 버튼이 아니라 상자 출하와 보상 수거로 읽혀 “자동 생산 → 주문 → 보상” loop가 production game처럼 느껴진다.
- 운영사 가치: queue-empty가 멈춤이 아니라 GitHub-authoritative production game WorkUnit intake로 이어졌다는 evidence를 남긴다.

## 수용 기준

- [x] 첫 주문 카드가 납품 가능 상태에서 상자/출하 readiness를 명확히 보여준다.
- [x] `납품` 실행 후 상자 출하 완료와 보상 수거 motion/state가 한 장면에서 확인된다.
- [x] 보상 결과가 기존 telemetry/toast 또는 새 deterministic evidence로 검증된다.
- [x] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [x] Browser Use `iab` current-session evidence 또는 현재 세션 blocker + Playwright fallback screenshot을 남긴다.
- [x] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- Before screenshot: 첫 주문 납품 전 현재 order card 상태.
- After screenshot: 납품 후 상자 출하/보상 수거 상태.
- Browser Use 우선 QA 계획: `browser-use:browser` `iab` backend를 먼저 시도한다. 현재 Codex CLI 세션에서 `node_repl` tool palette가 계속 보이지 않으면 새 blocker를 남기고 Playwright fallback을 사용한다.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: local Vite preview/dev server, 모바일 393px viewport.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.
- 새 accepted manifest game asset 없음.
- `$seed-ops`를 v3 entrypoint로 재도입하지 않음.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "첫 주문 납품|order crate|상자 출하"`
- `npm run check:visual`
- `npm run check:ci`


## 검증 결과 — 2026-05-03

- Branch: `codex/0296-order-crate-dispatch-reward-motion`
- Plan artifact: `items/0150-order-crate-dispatch-reward-motion.md`
- Browser Use current-session blocker: `reports/visual/browser-use-blocker-0296-20260503.md`
- Playwright fallback screenshot: `reports/visual/issue-296-order-crate-dispatch-reward-motion-393.png`
- Focused regression: `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문|온실 설비|온실 확장 준비|동선 순환|물길 점검|물안개 응축"` → 8 passed
- Full visual: `npm run check:visual` → 55 passed
- Full CI: `npm run check:ci` → pass
- Scope correction: `출하 준비`/`상자 봉인 완료` copy는 첫 주문 ready 상태에만 제한했다. 후속 온실 주문의 `납품 준비` copy는 focused/full visual gate로 보존을 확인했다.
