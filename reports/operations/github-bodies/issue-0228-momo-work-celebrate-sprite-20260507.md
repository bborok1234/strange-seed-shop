## 요약

방패새싹 모모를 정원 playfield의 독립 support worker actor로 만든다. 현재 모모는 자동 생산 roster에 포함되어도 정원에서는 정적 portrait처럼 보이므로, 신규 work/celebrate sprite strip, manifest binding, support worker runtime animation, Browser Use visible QA를 한 WorkUnit으로 닫는다.

## Small win

두 번째 생명체가 도감 밖 정원에서 실제로 일하고, 생산 수령 또는 QA trigger에서 짧게 반응하는 장면을 만든다.

## 사용자/운영자 가치

사용자는 "캐릭터가 도감에만 존재한다"는 문제를 가장 크게 지적했다. 이번 작업은 새 에셋과 런타임 binding을 같이 반영해, 플레이어가 수집한 생명체가 정원 자동 생산에 실제로 참여한다는 보상을 화면에서 확인하게 한다.

## Before / After 또는 Visual evidence

- Before evidence: `reports/deliberation/momo-work-celebrate-sprite/browser-use-current-garden-20260507.png`
- After evidence target: `reports/visual/issue-0228-momo-work-celebrate-sprite/`

## Playable mode

- `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`
- Browser Use `iab` 우선 검수

## Game Studio route

- `game-studio:game-studio`
- `game-studio:sprite-pipeline`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## Studio deliberation

- Brief: `reports/deliberation/momo-work-celebrate-sprite/brief.md`
- Proposals: `reports/deliberation/momo-work-celebrate-sprite/proposals/`
- Critiques: `reports/deliberation/momo-work-celebrate-sprite/critique-*.md`
- Spec: `reports/deliberation/momo-work-celebrate-sprite/spec.md`
- User review: `reports/deliberation/momo-work-celebrate-sprite/user-review.md`
- Retrospective: `reports/deliberation/momo-work-celebrate-sprite/retrospective.md`

## Acceptance criteria

- `sprite_creature_herb_common_002_work_strip`와 `sprite_creature_herb_common_002_celebrate_strip`가 gpt-image-2 또는 Codex native image generation raster PNG provenance로 생성된다.
- 두 strip은 manifest에 accepted spritesheet asset으로 등록되고 frame count, frame size, frame rate, animation binding, source creature identity를 가진다.
- `qaResearchExpeditionReady=1`에서 모모 support actor가 `data-animation-asset="sprite_creature_herb_common_002_work_strip"`를 가진다.
- production claim 또는 QA trigger에서 모모 celebrate state가 실제 화면에 1회 이상 관찰된다.
- Browser Use `iab` screenshot에서 모모가 원형 portrait/card decoration이 아니라 포리와 별개의 work actor로 읽힌다.
- 모모 actor가 plot label, resource HUD, action surface, bottom tabs와 겹치지 않는다.

## 검증

- `npm run check:asset-normalization`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run build`
- focused visual regression
- `npm run check:ci`
- Browser Use `iab` before/after/celebrate screenshot

## 안전 범위

- 런타임 이미지 생성 없음
- 실결제/외부 배포/고객 데이터/파괴적 migration 없음
- save migration 없음

## 남은 위험

- gpt-image-2 strip consistency가 불안정하면 재생성이 필요할 수 있다.
- 전체 creature animation bible은 이번 issue가 아니라 모모 vertical slice 통과 후 후속으로 다룬다.

## 연결된 issue

이 issue가 원본 WorkUnit이다.
