# P0 Playfield Tap/Harvest Feedback Evidence

Issue: #109
Item: `items/0063-playfield-tap-harvest-feedback.md`
Branch: `p0-playfield-feedback-109`
Date: 2026-04-29

## Plan-first evidence

Plan artifact: `items/0063-playfield-tap-harvest-feedback.md`

## Small win

정원 playfield의 성장 중 탭과 수확 가능 탭에 즉시 읽히는 피드백을 추가했다. 성장 탭은 procedural `+성장`/sparkle 및 host action badge가 보이고, 수확 탭은 harvest/reward sparkle과 reveal 보상 화면으로 자연스럽게 이어진다.

## 변경 요약

- 성장 탭: tap feedback은 procedural text/sparkle + host `playfield-action-feedback` badge를 canonical로 사용한다.
- 수확 탭: 기존 harvest/reward spritesheet effect를 유지하면서 `수확!`/`+잎` procedural feedback과 reveal 연결을 검증한다.
- 모바일 캔버스 캡처에서 세로 artifacts를 만들던 camera shake와 tap spritesheet 의존을 제거하고, 정적/명확한 feedback으로 대체했다.
- `qaFxTelemetry=1`에서만 Playwright가 확인 가능한 `garden-playfield-fx` telemetry counter를 노출한다.
- Playwright visual gate가 tap/harvest procedural path와 screenshot artifact를 검증한다.

## Evidence screenshots

- Tap feedback mobile 393: `reports/visual/p0-playfield-feedback-tap-mobile-393-20260429.png`
- Harvest feedback/reveal mobile 393: `reports/visual/p0-playfield-feedback-harvest-mobile-393-20260429.png`

## Verification

- `npm run check:visual` — 12 passed.

## Remaining visual risk

- playfield의 배경 온실 선은 게임 배경 일부라 완전히 제거하지 않았다. 추가 polish 단계에서 playfield panel opacity/texture를 별도 아트 방향으로 더 다듬을 수 있다.
- sound/haptic은 Phase 0 범위 밖이라 추가하지 않았다.
