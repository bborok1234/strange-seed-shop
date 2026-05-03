# #296 첫 주문 납품 상자 출하 / 보상 흐름 production화

## 상태

- 상태: pr-ready
- GitHub issue: #296 `첫 주문 납품을 상자 출하 상태와 보상 흐름으로 production화한다`
- Branch: `codex/0296-order-crate-dispatch-reward-motion`
- Studio Harness v3 route: GitHub-authoritative WorkUnit intake. `$seed-ops` 사용 안 함.
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`

## Plan

1. 현재 `deliverFirstOrder`, `productionStatus`, order card/playfield crate/test surface를 매핑한다.
2. 첫 주문 납품 가능 상태에서 order card와 playfield crate가 `출하 준비`로 읽히게 state/copy/class를 추가한다.
3. 납품 완료 직후 첫 주문 완료 row가 `상자 출하 완료`, `보상 수거`, 다음 주문 준비로 이어지게 reward motion/state를 추가한다.
4. 모바일 393px에서 completion row가 bottom tab과 겹치지 않고 card clipping 없이 보이는 CSS를 보강한다.
5. focused visual regression으로 납품 전/후 상태, telemetry, overflow/bottom-tab invariants, screenshot을 고정한다.
6. Browser Use `iab` 우선 QA를 시도한다. 현재 Codex CLI 세션에서 `node_repl` MCP tool palette가 계속 노출되지 않으면 #296 전용 blocker report와 Playwright fallback screenshot을 남긴다.
7. `docs/ROADMAP.md`, `docs/DASHBOARD.md`, `docs/OPERATOR_CONTROL_ROOM.md`, PR/issue body evidence를 갱신한다.

## 수용 기준

- [x] 첫 주문 카드가 납품 가능 상태에서 상자/출하 readiness를 명확히 보여준다.
- [x] `납품` 실행 후 상자 출하 완료와 보상 수거 motion/state가 한 장면에서 확인된다.
- [x] 보상 결과가 기존 telemetry/toast 또는 새 deterministic evidence로 검증된다.
- [x] 모바일 393px에서 body scroll, panel overflow, bottom-tab overlap 회귀가 없다.
- [x] Browser Use `iab` current-session evidence 또는 현재 세션 blocker + Playwright fallback screenshot을 남긴다.
- [x] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "첫 주문 납품|order crate|상자 출하|자동 생산과 첫 주문"`
- `npm run check:visual`
- `npm run check:ci`

## 리스크

- 현재 Codex CLI 세션은 #292에서 확인한 것처럼 `node_repl` MCP 추가 후에도 tool palette를 hot-load하지 못한다. 이 WorkUnit에서도 Browser Use 우선 시도와 현재 세션 blocker evidence가 필요하다.
- 새 raster asset/manifest asset을 만들지 않는다. 이번 payoff는 기존 crate asset과 DOM/CSS state/motion으로 한정한다.
- 첫 주문 완료 row를 키우면 모바일 starter panel overflow가 재발할 수 있다. focused test에서 `scrollHeight <= clientHeight`, bottom-tab overlap을 gate로 둔다.


## Evidence log — 2026-05-03

- GitHub queue snapshot: `npm run studio:v3:runner -- --once --dry-run` → decision `select-github-workunit`, target `Issue #296`, next action `implementation gate: plan-first for GitHub issue #296`.
- Build: `npm run build` → 통과.
- Focused visual regression: `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문|복귀 첫 30초"` → 2 passed.
- Browser Use `iab`: current-session bootstrap 실패. 세부 blocker: `reports/visual/browser-use-blocker-0296-20260503.md`.
- Playwright fallback screenshot: `reports/visual/issue-296-order-crate-dispatch-reward-motion-393.png`.
- Studio operator checker: `npm run check:studio-v3-operator` → 통과. 현재 Codex CLI는 `--ask-for-approval` 대신 `-c approval_policy="never"`가 필요하므로 v3 foreground report/doctor gate도 함께 보정했다.

- Scope correction: `출하 준비`/`상자 봉인 완료` copy는 첫 주문 ready 상태에만 제한했다. 첫 시도에서 후속 온실 주문 ready copy까지 바뀌어 `npm run check:visual` 5개가 실패했고, 수정 후 focused 8개 + full visual 55개가 통과했다.
- Full visual: `npm run check:visual` → 55 passed (4.9m).
- Full CI: `npm run check:ci` → pass.
