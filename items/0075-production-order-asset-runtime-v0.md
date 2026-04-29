# Production order asset runtime v0

Status: review
Work type: game_ui
Issue: #133
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: moderate

## Intent

#131에서 manifest-ready가 된 P0.5 production/order asset을 실제 정원 생산 UI에 연결해, 첫 idle core가 숫자 카드보다 게임 장면처럼 읽히게 한다.

## Small win

자동 생산 카드에 work creature, 주문 진행 카드에 order crate, 납품 완료 상태에 celebrate creature가 보인다.

## Plan

1. `src/App.tsx` 생산/주문 카드에 manifest asset 렌더링을 추가한다.
2. `src/styles.css`에서 모바일 첫 화면 밀도를 유지하는 compact asset layout을 만든다.
3. `tests/visual/p0-mobile-game-shell.spec.ts`에 asset visibility와 bottom tab overlap 검증을 추가한다.
4. Browser Use 우선 QA evidence를 `reports/visual/`에 남긴다. 막히면 blocker와 Playwright/CDP fallback evidence를 기록한다.
5. `npm run check:visual`, `npm run check:all`로 검증한다.

## Acceptance Criteria

- 생산 카드에서 `creature_herb_common_001_work` asset이 보인다.
- 첫 주문 진행 카드에서 `ui_order_crate_leaf_001` asset이 보인다.
- 납품 완료 상태에서 `creature_herb_common_001_celebrate` asset이 보인다.
- 모바일 393px에서 production card와 next goal이 bottom tab과 겹치지 않는다.
- Browser Use QA evidence 또는 blocker가 남는다.
- `npm run check:all`이 통과한다.

## Verification

- Browser Use QA
- `npm run check:visual`
- `npm run check:all`

## Risks

- asset이 추가되며 production card 높이가 커질 수 있다. 모바일 393px visual gate에서 next goal과 bottom tab overlap을 반드시 확인한다.
- FX strip은 이번 issue에서 화면에 재생하지 않는다. 정적 creature/crate 연결만 먼저 닫는다.

## Apply Conditions

- 저장 schema, economy formula 변경 없음.
- Runtime image generation 금지.
- 새 dependency 추가 금지.
- 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential 변경 없음.

## Evidence

- Issue: #133
- Branch: `codex/0075-production-order-asset-runtime-v0`
- Browser Use QA: `reports/visual/p0-production-order-assets-runtime-20260429.md`
- Browser Use screenshot: `reports/visual/p0-production-order-assets-runtime-browser-use-20260429.png`
- Automated visual gate: `npm run check:visual` PASS
- Verification:
  - `npm run check:visual` PASS
  - `npm run check:all` PASS
