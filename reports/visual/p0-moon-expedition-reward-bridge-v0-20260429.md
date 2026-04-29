# P0 Moon Expedition Reward Bridge v0 — 2026-04-29

## Summary

`moon_hint` 원정 완료 후 보상 수령이 숫자 보상에서 끝나지 않고 `달방울 씨앗` / `달방울 누누` 다음 수집 목표로 이어지는지 확인했다.

## Game Studio route

- `game-studio:game-studio`: 연구 -> 원정 -> 보상 -> 다음 수집 목표 vertical slice.
- `game-studio:web-game-foundations`: 기존 `activeExpedition` claim flow에서 `seed_lunar_001` 해금을 추가했다.
- `game-studio:game-ui-frontend`: 원정 탭 안의 compact reward bridge와 씨앗/도감 target bridge로 playfield를 덮지 않았다.
- `game-studio:game-playtest`: Browser Use와 visual gate로 보상 수령 전/후와 다음 목표 visibility를 확인했다.

## Browser Use QA

- URL: `http://127.0.0.1:5175/?qaResearchExpeditionClaimReady=1&qaTab=expedition`
- 수령 전: `원정 완료`, `+420 잎 · +2 재료 수령 가능`, `원정 보상 받기` 확인.
- 수령 후: `달빛 원정 보상 다음 목표`, `달방울 씨앗`, `달방울 누누`, `달방울 씨앗 보러가기` 확인.
- 씨앗 탭 전환 후: `다음 도감 목표 씨앗`이 `달방울 씨앗` / `달방울 누누`를 가리키는 것 확인.
- Screenshot: `reports/visual/p0-moon-expedition-reward-bridge-v0-browser-use-20260429.png`

## Visual gate

- Focused: `npm run check:visual -- --grep "달빛 원정 보상"` PASS
- Full: `npm run check:visual` PASS, 21 tests
- Screenshot: `reports/visual/p0-moon-expedition-reward-bridge-v0-20260429.png`

## CI gate

- `npm run check:ci` PASS

## Findings

- PASS: `moon_hint` claim clears `activeExpedition`, adds +420 leaves and +2 materials, and unlocks `seed_lunar_001`.
- PASS: next creature target priority changes to `달방울 누누` only after lunar seed unlock.
- PASS: expedition, seed, album tab target surfaces agree on the same lunar goal.

## Remaining risk

- 달빛 씨앗 구매/심기 후 실제 lunar creature harvest polish는 후속 vertical slice다.
- 새 lunar asset/FX 제작은 이번 PR 범위가 아니다.
