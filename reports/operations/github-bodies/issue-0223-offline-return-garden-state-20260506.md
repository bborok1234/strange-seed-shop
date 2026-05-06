# WorkUnit #0223 - Offline return as garden state

Status: planning
Branch: `codex/offline-return-garden-state`
Source specs: `docs/IDLE_CORE_PRODUCTION_SPEC.md`, `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## Goal

오프라인 복귀 보상이 modal 숫자와 toast에서 끝나지 않고, 정원 화면의 보관 바구니/worker/order 목표 상태로 남게 한다. Slice A `Bottleneck-readable production graph` 다음의 core 우선순위인 Slice B `Offline return as garden state`를 시작한다.

## Plan

1. 현재 `qaOfflineMinutes=60` 복귀 흐름을 기준으로 modal 수령 후 정원에 남는 상태를 확인한다.
2. 복귀 보상 수령/확인/생산 이어가기 액션이 `comeback garden state` receipt를 남기게 한다.
3. production card와 playfield production scene에 `복귀 잎 보관`, `바구니 정리`, `다음 주문 목표`가 짧은 prop/receipt로 보이게 한다.
4. 기존 저장 구조와 보상 수치 계산은 유지한다. 새 재화, 결제, 런타임 이미지 생성은 금지한다.
5. Browser Use `iab`를 먼저 시도하고, 막히면 blocker와 Playwright screenshot fallback을 남긴다.
6. 모바일 393/360과 desktop mobile-frame regression에 복귀 후 정원 state 검사를 추가한다.

## Acceptance Criteria

- [ ] `qaOfflineMinutes=60&qaLunarGuardian=1`에서 복귀 보상 modal 이후 정원에 `복귀 잎 보관` 또는 동등한 garden-state receipt가 보인다.
- [ ] receipt는 보상 잎 수, worker/guardian attribution, 다음 주문/생산 목표를 한 화면에서 보여준다.
- [ ] 정원 production card 또는 playfield scene에 바구니/order crate 상태 변화가 남고, modal 하나로 끝나지 않는다.
- [ ] 모바일 393과 360에서 receipt/action card/bottom tabs가 겹치거나 잘리지 않는다.
- [ ] 데스크톱 1280에서는 중앙 모바일 frame이 유지된다.
- [ ] Browser Use `iab` evidence 또는 현재 세션 blocker + Playwright fallback screenshot이 있다.
- [ ] `npm run build`
- [ ] focused visual regression
- [ ] `npm run check:ci`

## Reference Teardown

- Idle Miner Tycoon: offline cash는 다시 들어왔을 때 다음 생산/운반 병목을 해소하는 행동으로 이어진다.
- Idle Slayer: offline progression은 수령 직후 다음 active beat를 만든다.
- Pikmin Bloom: 닫혀 있는 동안 진행됐다는 신호가 돌아온 화면의 상태 변화로 남는다.

Rejected alternative: 복귀 modal copy만 고치는 방식. `docs/IDLE_CORE_PRODUCTION_SPEC.md`가 명시한 실패 조건인 “복귀 modal만 있고 정원 상태가 그대로”를 해결하지 못한다.

## Creative Brief

플레이어가 돌아오면 “정원이 나 없이 일했다”가 보여야 한다. 보상 수치보다 먼저 바구니가 차 있었고, 누가 지켜줬고, 이제 어떤 주문/생산 행동으로 이어지는지가 읽혀야 한다.

## Core Acceptance Template

- Player verb: `복귀`, `수령`, `주문/생산 이어가기`
- Core loop layer: Layer 6 `Offline return`
- Screen moment: 60분 복귀 modal 수령 직후 정원
- Resource/bottleneck affected: leaves, storage capacity, order throughput
- Required actor/prop/FX: storage basket prop, production worker attribution, order crate/next objective receipt
- First 10m impact: 첫 복귀가 숫자 보상에서 다음 생산 행동으로 이어짐
- Offline/comeback impact: 복귀 보상이 정원 state로 남아 재방문 이유를 강화

## Department Signoff

- 기획팀: 복귀 보상이 다음 생산/주문 행동으로 이어져야 한다.
- 리서치팀: 경쟁작 gap은 offline reward가 modal 숫자에서 끝나는 점이다.
- 아트팀: 신규 accepted asset은 기본 범위가 아니다. 기존 storage basket/order crate/worker asset과 DOM/CSS receipt로 먼저 해결한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, visual tests만 건드리고 save schema 변경은 피한다.
- 검수팀: Browser Use 우선, fallback 시 mobile 393/360 + desktop screenshots.
- 마케팅팀: 실제 push/광고/결제 promise 없음.
- 고객지원팀: “보상을 받았는데 다음에 뭘 하죠?”를 정원 receipt와 CTA로 줄인다.

## Stop / Blocker Boundaries

- No payment, login, external deployment, production user data, runtime image generation, or accepted SVG/vector game asset.
- Save migration이 필요하면 scope를 멈추고 별도 WorkUnit으로 분리한다.
