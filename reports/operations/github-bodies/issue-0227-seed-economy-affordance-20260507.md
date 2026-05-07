## 요약

씨앗 탭의 구매/심기 CTA가 비용 재화, 현재 보유량, 구매 후 결과, 부족 사유를 충분히 설명하지 못해 초반 진행성이 끊깁니다. `?qaResearchExpeditionReady=1&qaTab=seeds` 화면에서 `구매 25`처럼 숫자만 보이는 상태를 개선해 플레이어가 다음 행동을 스스로 판단할 수 있게 합니다.

## 사용자/운영자 가치

첫 플레이어가 씨앗 구매와 정원 심기 흐름을 이해하지 못하면 게임 core loop가 정적 그림처럼 보입니다. 이번 작업은 기획 문서의 UI/UX 기준을 실제 씨앗 목록 화면에 반영해 `무엇을 살 수 있는지`, `무슨 재화가 필요한지`, `구매하면 무엇이 생기는지`, `왜 막혔는지`를 같은 시선 안에서 설명합니다.

## Game Studio route

- `game-studio:game-studio`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## Plan

1. Browser Use `iab`로 현재 씨앗 탭 before 화면을 저장합니다.
2. 씨앗 row와 도감 목표 CTA에 비용 재화, 현재 잎 보유량, 구매 후 결과, blocker 사유를 표시합니다.
3. 모바일 393px 폭에서 줄바꿈/하단 탭 겹침을 막도록 CSS를 조정합니다.
4. 구매/심기 테스트와 visual regression을 갱신합니다.
5. Browser Use after evidence, `npm run build`, focused Playwright, `npm run check:ci`를 남깁니다.

## Acceptance criteria

- 씨앗 row에서 `60 잎`, `보유 72 잎`, `구매 후 보유 1개`가 함께 보입니다.
- 버튼 레이블이 `구매 60 잎`, `13 잎 부족`, `정원에 심기`, `밭 비우기 필요`처럼 상태를 설명합니다.
- 도감 목표 CTA가 구매/심기 결과 또는 blocker 사유를 표시합니다.
- 모바일 393x852에서 텍스트가 잘리거나 하단 탭에 가리지 않습니다.
- Browser Use before/after screenshot과 회귀 테스트 결과가 남습니다.

## Verification

- `npm run build`
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "씨앗 경제 affordance|도감 목표 CTA|연구 단서 씨앗 구매와 심기"`
- `npm run check:ci`

## 안전 범위

실제 결제, 외부 배포, 런타임 이미지 생성은 포함하지 않습니다. 기존 씨앗/정원 루프의 정보 구조와 CTA 동작성만 다룹니다.
