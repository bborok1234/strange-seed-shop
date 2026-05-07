## 요약

신규 Phaser v1 구현의 첫 WorkUnit으로 `garden board foundation`을 만든다. 기존 Stage 1의 2개 밭/낮은 카메라 계획을 그대로 구현하지 않고, `docs/GAME_BIBLE.md`, `docs/GAME_PRODUCTION_SPEC.md`, `docs/phaser/REBOOT_FOUNDATION_SPEC.md` 기준으로 확장 가능한 build slot, runtime plot/facility entity, actor task path, contextual HUD/action rail을 먼저 증명한다.

## Small win

`apps/seed-garden-phaser/` 첫 화면을 placeholder text에서 실제 playable garden board foundation으로 바꾼다. 플레이어는 무료 starter seed를 빈 plot에 심고, 돌보고, 수확해 `말랑잎 포리` actor가 world에 합류하는 장면을 본다.

## 사용자/운영자 가치

- 사용자: 정원이 배경 이미지나 카드 UI가 아니라, slot과 actor가 있는 작은 운영 게임으로 읽힌다.
- 운영자: Studio가 v1 구현을 topology -> asset bundle -> first 5m vertical slice 순서로 진행할 수 있는 runtime 기준점을 확보한다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `items/0235-garden-board-topology-scaffold.md`

## Game Studio Department Signoff / Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | Player verbs는 slot 선택, 심기, 돌보기, 수확, actor 합류, unlock preview다. |
| 리서치팀 | approve | 경쟁작 production gap은 “생산 엔진과 다음 해금 목표가 화면에 보이는가”다. 감상 모드 #434는 foundation 이후로 보류한다. |
| 아트팀 | revise | 이번 slice는 topology placeholder만 사용한다. accepted manifest game asset은 다음 asset bundle WorkUnit에서 gpt-image-2 또는 Codex native raster provenance로 만든다. |
| 개발팀 | approve | Simulation state를 Phaser Scene 밖 typed state로 두고 Scene은 render/input을 담당한다. |
| 검수팀 | approve | `build:phaser`/`check:phaser`와 Browser Use 또는 blocker + screenshot evidence를 요구한다. |
| 마케팅팀 | approve | 외부 채널, 실결제, 광고, 배포 없음. |
| 고객지원팀 | approve | 시작 행동은 empty plot과 `심기` action rail로 설명 없이 드러나야 한다. |

## Self-evaluation loop

- Claim: 신규 Phaser app이 v1 garden board foundation의 첫 playable proof다.
- Smallest verifier: `npm run build:phaser`, `npm run check:phaser`, fresh start 화면의 3개 slot/runtime facility 확인.
- Rubric: topology, player verb, actor task, HUD budget, v1 continuation.
- Artifact path: `apps/seed-garden-phaser/src/*`, `reports/visual/issue-0433-garden-board-foundation/`.
- Stop condition: foundation acceptance와 visual/build evidence가 남거나, Browser Use/tool blocker가 report로 남는다.

## Before / After 또는 Visual evidence

- Before: `apps/seed-garden-phaser`는 “#433 Stage 1 구현 대기 중” placeholder다.
- After 목표: fresh start 화면에 runtime build slots, empty/growing/ready plot, workbench, order crate preview, actor task path, contextual HUD/action rail이 보인다.

## Playable mode

- 대상 app: `npm run dev:phaser`
- 대상 viewport: 393x852 mobile frame
- Browser Use `iab`: fresh start -> plot 선택 -> 심기 -> 돌보기 -> 수확 -> actor 합류

## 검증

- `npm run build:phaser`
- `npm run check:phaser`
- 가능하면 Browser Use screenshot/report
- 필요 시 `npm run check:ci`

## 안전 범위

- 기존 React playable 대규모 수정 제외
- accepted manifest game asset 추가 제외
- 실제 결제, 로그인, 광고, 외부 배포, 런타임 이미지 생성 금지

## 남은 위험

이번 slice는 final art가 아니다. placeholder가 production asset으로 굳지 않도록 다음 WorkUnit에서 raster asset bundle과 sprite/FX strip을 별도로 만든다.

## 연결된 issue

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/433
