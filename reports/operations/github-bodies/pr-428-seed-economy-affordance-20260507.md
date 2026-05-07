## 요약

씨앗 탭의 구매/심기 CTA를 기획적으로 읽히는 거래 row로 바꿨습니다. `구매 25`처럼 재화가 불명확하던 버튼과 row를 `비용 60 잎 · 보유 72 잎`, `구매 후 보유 1개`, `구매 60 잎`, `48 잎 부족`, `정원에 심기` 상태로 분리해 초반 플레이어가 비용, 잔액, 결과, blocker를 같은 시선에서 판단할 수 있게 했습니다.

## Small win

Browser Use `iab`에서 `구매 60 잎` 버튼을 실제 클릭했고, row가 `보유 씨앗 1개`와 `정원에 심기`로 전환되는 것을 확인했습니다.

## 사용자/운영자 가치

초반 씨앗 구매 화면이 “무슨 자원을 쓰는지”와 “구매하면 무엇이 되는지”를 설명하지 못하면 core loop가 끊깁니다. 이번 변경은 씨앗 탭을 단순 목록이 아니라 반복 구매/심기 판단이 가능한 게임 HUD로 정리합니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/issue-0227-seed-economy-affordance/browser-use-before-seeds-affordance-20260507.png`
- After: `reports/visual/issue-0227-seed-economy-affordance/browser-use-after-seeds-affordance-20260507.png`
- Interaction: `reports/visual/issue-0227-seed-economy-affordance/browser-use-after-buy-seeds-affordance-20260507.png`
- Report: `reports/visual/issue-0227-seed-economy-affordance/visual-report-20260507.md`

## Playable mode

- Current QA URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1&qaTab=seeds`
- Stable main playable mode remains documented in `docs/OPERATOR_CONTROL_ROOM.md`.

## 검증

- `npm run build`
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "씨앗 경제 affordance|도감 목표 CTA|연구 단서 씨앗 구매와 심기"`
- `npm run check:ci`
- Browser Use `iab` before/after/interaction capture

## 안전 범위

- 실제 결제, 외부 배포, 런타임 이미지 생성 없음.
- 새 raster asset 생성 없음. 이번 작업의 visual payoff는 HUD affordance/정보 구조 개선이다.
- 기존 구매/심기 저장 흐름은 유지하고, 버튼 문구/disabled 상태와 회귀 테스트를 새 계약에 맞췄다.

## 남은 위험

- 이번 slice는 씨앗 탭 affordance에 집중했다. 정원 playfield의 캐릭터/생산 연출 고도화는 다음 visual/game-feel WorkUnit으로 남는다.

## 연결된 issue

Closes #428

## 작업 checklist

- [x] Game Studio route 기록
- [x] WorkUnit plan 작성
- [x] Browser Use `iab` before evidence
- [x] Browser Use `iab` after evidence
- [x] Browser Use `iab` interaction evidence
- [x] Focused regression
- [x] `npm run check:ci`
