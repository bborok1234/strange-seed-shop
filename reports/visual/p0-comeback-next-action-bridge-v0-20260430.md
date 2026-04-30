# P0 Comeback Next-Action Bridge v0 — 2026-04-30

## Summary

오프라인 복귀 보상 modal에서 다음 도감 목표 씨앗 CTA를 눌러 바로 씨앗 탭의 목표 row로 이동하는지 확인했다.

## Game Studio route

- `game-studio:game-studio`: comeback reward -> spend/replant -> next collection vertical slice.
- `game-studio:web-game-foundations`: 기존 `nextCreatureGoal` 계산과 tab state만 사용했다.
- `game-studio:game-ui-frontend`: comeback modal 안에 다음 행동 CTA를 추가하고 보조 `보상 확인` CTA를 유지했다.
- `game-studio:game-playtest`: focused visual gate로 modal CTA, tab 전환, 목표 row visibility를 확인했다.

## Visual gate

- Focused: `npm run check:visual -- --grep "복귀 다음 행동"` PASS, 1 test.
- Full visual: `npm run check:visual` PASS, 25 tests.
- CI: `npm run check:ci` PASS.
- Screenshot: `reports/visual/p0-comeback-next-action-bridge-v0-20260430.png`

## Findings

- PASS: 복귀 보상 modal에 실제 `nextCreatureGoal.seed.name`인 `방울새싹 씨앗 보러가기` CTA가 보인다.
- PASS: CTA 클릭 후 modal이 사라지고 seeds 탭이 열린다.
- PASS: seeds 탭의 `다음 도감 목표 씨앗` row가 `방울새싹 씨앗`과 `방패새싹 모모`를 보여준다.

## Remaining risk

- 복귀 modal에서 바로 구매까지 수행하는 one-tap spend는 아직 없다.
- next-action CTA는 현재 단일 `nextCreatureGoal` 기준이며 주문/연구/원정 완료 보상 우선순위는 별도 설계가 필요하다.
