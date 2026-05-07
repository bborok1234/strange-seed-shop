# 0227 씨앗 탭 경제 affordance

## Problem

`?qaResearchExpeditionReady=1&qaTab=seeds`에서 씨앗 구매 CTA가 `구매 25`처럼 표시되어 비용 재화가 무엇인지, 현재 보유 잎이 충분한지, 구매 후 무엇이 달라지는지 한눈에 알기 어렵다. 정원에서 심기 흐름도 씨앗 구매/보유/밭 상태가 분리되어 보여 초반 진행 가능성을 플레이어가 판단하기 어렵다.

## Goal

씨앗 탭의 각 씨앗 row와 도감 목표 CTA가 비용, 현재 잎 보유량, 구매/심기 결과, 부족/잠김 사유를 같은 시선 안에서 설명하게 만든다. 목표는 기획 문서의 UI/UX 기준을 실제 런타임 화면에 반영해 첫 플레이어가 다음 행동을 스스로 이해하고 실행하게 하는 것이다.

## Game Studio Route

- `game-studio:game-studio`: 게임 화면 품질 작업으로 분류한다.
- `game-studio:game-ui-frontend`: HUD/메뉴/CTA 정보 구조와 모바일 프레임 보호를 담당한다.
- `game-studio:game-playtest`: Browser Use `iab`로 실제 씨앗 탭 화면과 정원 복귀 흐름을 확인한다.

## Reference Teardown

- 경쟁작 방치형/수집형 UI는 구매 CTA 주변에 비용 재화, 현재 잔액, 구매 후 효과를 같은 카드 안에 배치한다.
- 플레이어가 막힌 상태일 때는 숫자만 비활성화하지 않고 부족 자원 또는 선행 조건을 명시한다.
- 씨앗/업그레이드 목록은 반복 구매 화면이므로 현재 자원과 결과 예측을 row 내부에서 빠르게 스캔할 수 있어야 한다.

## Creative Brief

- 새 대형 패널을 추가하지 않고 기존 씨앗 row를 정보 밀도가 있는 거래 카드처럼 다듬는다.
- `잎` 비용은 버튼과 row 메타에 모두 표시한다.
- 보유량, 구매 후 씨앗 수, 심기 가능/불가 사유를 짧은 chip 또는 1줄 설명으로 제공한다.
- 모바일 393px 폭에서 하단 탭과 겹치지 않고 텍스트가 잘리지 않아야 한다.

## Plan

1. Browser Use `iab`로 현재 씨앗 탭 before 화면을 저장한다.
2. 씨앗 row 데이터에 비용 재화, 현재 잎, 구매 후 보유 수, 심기 가능 상태, 부족 사유를 계산해 표시한다.
3. 도감 목표 CTA에도 비용/보유량/구매 후 심기 또는 blocker 사유를 표시한다.
4. 모바일 CSS를 조정해 row 메타와 액션 버튼이 줄바꿈되어도 잘리지 않게 한다.
5. 씨앗 구매/심기 테스트를 새 레이블에 맞게 갱신하고 focused visual regression을 추가한다.
6. Browser Use `iab` after 화면과 회귀 테스트 결과를 `reports/visual/`에 남긴다.
7. PR, checks, merge, main CI까지 진행한다.

## Acceptance Criteria

- 씨앗 row에서 `60 잎`, `보유 72 잎`, `구매 후 보유 1개`처럼 비용 재화와 현재 잔액과 결과가 함께 보인다.
- 버튼 레이블은 `구매 60 잎`, `13 잎 부족`, `정원에 심기`, `밭 비우기 필요`처럼 상태가 명확하다.
- 도감 목표 CTA는 `구매하고 심기`와 함께 비용/보유량/결과 또는 막힌 이유를 표시한다.
- 씨앗 탭에서 젤리콩 씨앗을 구매 가능한 상태로 누르면 보유량 또는 정원 심기 흐름이 실제로 진행된다.
- 모바일 393x852와 데스크톱 모바일 프레임에서 주요 텍스트가 잘리거나 하단 탭에 가리지 않는다.
- Browser Use before/after screenshot이 `reports/visual/issue-0227-seed-economy-affordance/`에 남는다.

## Verification Commands

- `npm run build`
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "씨앗 경제 affordance|도감 목표 CTA|연구 단서 씨앗 구매와 심기"`
- `npm run check:ci`

## Browser Use QA Plan

- 대상 URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1&qaTab=seeds`
- before: 현재 씨앗 탭에서 비용 단위/보유량/결과가 빠진 상태를 캡처한다.
- after: 같은 URL에서 젤리콩 씨앗 row와 도감 목표 CTA가 비용/보유량/결과를 표시하는지 캡처한다.
- interaction: 구매 가능한 씨앗 CTA를 눌러 동작이 정원 또는 보유량 변화와 연결되는지 확인한다.

## Risks

- 기존 테스트가 `구매 300` 같은 정확한 버튼명을 기대할 수 있으므로 레이블 변경에 맞춰 테스트도 갱신해야 한다.
- row 정보가 과밀해질 수 있으므로 모바일 폭에서 chip 수와 줄바꿈을 제한한다.
- 시각적 payoff는 이번 작업에서 새 에셋 생성보다 정보 설계와 HUD affordance에 집중한다.

## Evidence

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/428
- PR: https://github.com/bborok1234/strange-seed-shop/pull/429
- Browser Use before: `reports/visual/issue-0227-seed-economy-affordance/browser-use-before-seeds-affordance-20260507.png`
- Browser Use after: `reports/visual/issue-0227-seed-economy-affordance/browser-use-after-seeds-affordance-20260507.png`
- Browser Use interaction: `reports/visual/issue-0227-seed-economy-affordance/browser-use-after-buy-seeds-affordance-20260507.png`
- Verification: `npm run build` pass, focused mobile visual regression 3 passed, `npm run check:ci` pass.
