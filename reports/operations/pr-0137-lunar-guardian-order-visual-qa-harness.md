## 요약

`달방울 누누`가 합류한 뒤 `달빛 보호 주문`을 납품하는 화면 흐름을 추가하고, 사용자 스크린샷에서 드러난 `다음 행동` 카드 clipping 결함을 Browser Use와 visual regression으로 막습니다. 동시에 seed-ops가 작은 `bridge/payoff/v0/closeout` 패턴으로 수렴한 문제를 회고하고 `Strategic Jump Check` / `Title Contract`를 운영 하네스에 추가합니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `qaLunarOrderReady=1&qaFxTelemetry=1`에서 납품 후 `달빛 보호 주문 완료`, `누누 야간 근무`, `달빛 보상 재료 +1`이 잘리지 않고 보입니다.

## Plan-first evidence

- Plan artifact: `items/0137-lunar-guardian-order-bridge-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: 사용자 제보로 visual QA가 놓친 clipping 결함과 issue/PR 제목/선택 패턴 결함이 확인되어, 같은 issue에서 QA 하네스와 seed-ops 선택 계약을 보강했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:sprite-pipeline`
- 적용한 playfield/HUD/playtest 기준: production card clipping 금지, order crate lunar visual state, reward motion/FX binding, Browser Use 모바일 evidence
- Game Studio route에서 벗어난 변경이 있다면 이유: N/A

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: `달방울 누누`가 roster badge에서 끝나지 않고 lunar order delivery와 다음 연구 재료 payoff로 이어집니다. 납품 후 카드가 더 이상 보상 텍스트를 자르지 않습니다.
- 운영사 가치: seed-ops가 다음 issue를 고를 때 큰 방향 점프 후보와 제목 품질을 강제로 회고하게 되어, 작은 연결 기능/closeout evidence 루프에 갇히는 위험을 줄입니다.

## Before / After 또는 Visual evidence

- Before: 사용자 제보와 Browser Use 재현에서 `다음 행동` 카드의 `달방울 누누` 아래 payoff 영역이 잘리거나 눌려 보였습니다.
  - `reports/visual/lunar-guardian-user-defect-delivered-browser-use-20260502.png`
  - `reports/visual/lunar-guardian-order-current-delivered-browser-use-20260502.png`
- After:
  - `reports/visual/lunar-guardian-order-fixed-browser-use-20260502.png`
  - `reports/visual/lunar-guardian-order-delivered-no-clipping-browser-use-20260502.png`
- Browser Use evidence 또는 blocker: Browser Use `iab` current tab에서 `http://127.0.0.1:5173/?qaLunarOrderReady=1&qaFxTelemetry=1` 직접 납품 후 screenshot 저장.
- Issue/PR title retrospective: `reports/operations/seed-ops-issue-pr-title-retrospective-20260502.md`
- N/A 사유: N/A

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: runtime schema/route/deployment를 바꾸지 않고, QA query state와 모바일 CSS/visual regression을 추가합니다.

## 검증

- [x] `npm run check:content` PASS
- [x] `npm run check:loop` PASS
- [x] `npm run build` PASS
- [x] `npm run check:visual -- --grep "달빛 보호"` PASS
- [x] `npm run check:visual -- --grep "달빛"` PASS, 7 tests
- [x] `npm run check:seed-ops-queue` PASS
- [x] `npm run check:asset-provenance` PASS
- [x] `npm run check:asset-style` PASS
- [x] `npm run check:asset-alpha` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- `Lunar guardian order bridge v0`라는 기존 issue 제목은 Title Contract 관점에서 나쁜 예시입니다. 이번 PR은 본문에서 보정하고, 다음 issue부터 한국어 `screen moment + player verb + production/progression role` 제목을 사용해야 합니다.
- 달빛 보호 주문은 v0라서 새 raster asset family를 생성하지 않았습니다. 큰 art direction/asset family 개선은 다음 `Strategic Jump Check` 후보로 남아 있습니다.

## 연결된 issue

Closes #270
