# 다음 씨앗 목표 수령/심기 bridge

## Problem

#478은 도감 기록 직후 `달빛 단서 기록됨`과 `다음 씨앗 목표: 달빛 새싹` surface를 보여줬지만, 이 목표는 아직 실제 player verb로 닫히지 않습니다. 플레이어가 다음 목표를 확인한 뒤 바로 씨앗을 받고 빈 밭에 심을 수 있어야 collection loop가 다시 재배 loop로 이어집니다.

## Goal

도감 기록 후 goal surface에서 `목표 씨앗 받기` action을 제공하고, 수령한 `달빛 새싹 씨앗`을 빈 밭에서 `목표 심기`로 심는 Phaser bridge를 추가합니다.

## Game Studio Route

- `game-studio:game-studio`
- `game-studio:game-ui-frontend`
- `game-studio:phaser-2d-game`
- `game-studio:game-playtest`

## Acceptance Criteria

- 도감 기록 후 `목표 씨앗 받기` action이 보입니다.
- action을 누르면 `달빛 새싹 씨앗`이 준비됐다는 receipt/objective/telemetry가 남습니다.
- 빈 밭에서 `목표 심기` action이 보이고, 심으면 plot seed id가 `seed_lunar_sprout_001`이 됩니다.
- planted plot에는 `목표` chip이 보입니다.
- `researchNextGoalSeedClaimed`와 `researchNextGoalSeedPlanted` telemetry가 true가 됩니다.
- `npm run check:phaser`와 `npm run check:ci`가 통과합니다.

## Safety

새 runtime image generation/API/cache 호출은 없습니다. #480의 dedicated record FX generation/runtime 연결은 후속 WorkUnit으로 분리합니다.
