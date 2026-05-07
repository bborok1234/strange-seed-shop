# 0238 Topology alpha cleanup and runtime integration

## Problem

#442는 Phaser v1 topology 후보 PNG 14개를 생성했지만, `gpt-image-2`의 transparent background 미지원 때문에 background 외 후보는 opaque/checkerboard 배경을 가진 source candidate다. v1 playable이 실제 게임 장면처럼 보이려면 최소 background, plot state, facility state 후보를 alpha-clean asset으로 정리하고 Phaser board runtime에 연결해야 한다.

## Goal

`bg_garden_terrain_open_v1`, plot state tiles, workbench, order crate 후보를 runtime에서 보이는 Phaser board asset으로 연결한다. Actor/FX strip 후보는 이번 범위에서 accepted manifest로 올리지 않고 후속 sprite-pipeline normalization 대상으로 유지한다.

## Game Studio Route

- `game-studio:game-studio`: #442 이후 visual/game-feel payoff WorkUnit 선택
- `game-studio:game-ui-frontend`: playfield를 카드/placeholder shape가 아니라 readable board object로 보이게 조정
- `game-studio:phaser-2d-game`: Phaser preload/image rendering/runtime click target 유지
- `game-studio:game-playtest`: first screen, plant/care/harvest/workbench flow screenshot evidence
- `game-studio:sprite-pipeline`: actor/FX 후보는 후속 strict strip normalization으로 분리

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | 첫 5분 핵심 verb인 심기/돌보기/수확/수령이 visual state 변화로 읽혀야 한다. |
| 리서치팀 | approve | 경쟁 idle/tycoon은 plot/facility state가 텍스트 이전에 그림으로 구분된다. |
| 아트팀 | caution | Source 후보가 opaque라 alpha cleanup 품질을 contact sheet와 runtime screenshot으로 확인해야 한다. |
| 개발팀 | approve | Runtime image API 호출 없이 Phaser preload + workspace PNG만 사용한다. |
| 검수팀 | approve | `check:phaser`, `check:ci`, screenshot evidence로 placeholder regression을 막는다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | plot/facility 상태가 시각적으로 읽히면 첫 플레이 혼란이 줄어든다. |

## Self-Evaluation Loop

Claim: Phaser v1 board first screen이 generated topology art를 사용해 plot/facility state를 직접 보여주며, runtime generation/API/cache 의존 없이 심기-돌보기-수확-수령 smoke가 통과한다.

Smallest verifier:

- processed PNG exists and has alpha where required
- Phaser preload keys exist
- `npm run check:phaser`
- screenshot evidence under `reports/visual/issue-0444-topology-runtime-integration/`

Rubric:

| 항목 | 통과 기준 |
| --- | --- |
| generated-art visibility | terrain/plot/facility가 placeholder shape 대신 PNG로 보임 |
| alpha quality | plot/facility PNG가 background block 없이 board 위에 layered |
| interaction integrity | existing click targets and HUD actions still pass smoke |
| runtime separation | no image generation/API/cache runtime import |
| evidence | before/after or final screenshot report saved |

Artifact path:

- `apps/seed-garden-phaser/src/main.ts`
- `public/assets/game/**`
- `scripts/check-phaser-foundation.mjs`
- `reports/visual/issue-0444-topology-runtime-integration/`

Stop condition:

- runtime integration PR merges and main CI passes, or alpha cleanup quality is explicitly blocked with evidence.

## Plan

1. GitHub issue를 생성한다.
2. Plot/facility 후보의 opaque/checkerboard background를 alpha cleanup한 runtime PNG로 저장한다.
3. Phaser scene에서 terrain/plot/facility images를 preload/render하고 fallback shape는 selection/progress/interaction support로 축소한다.
4. `check:phaser`를 PNG visibility까지 확장한다.
5. Browser Use 또는 fallback screenshot evidence를 저장한다.
6. Roadmap/control room/dashboard/heartbeat를 갱신한다.

## Acceptance Criteria

- Phaser first screen에서 terrain, plot states, workbench, order crate가 generated raster art로 보인다.
- 심기/돌보기/수확 이후 plot image state가 empty/sprout/growing/ready로 바뀐다.
- Workbench/order crate state image가 보이고 existing workbench claim smoke가 유지된다.
- Runtime은 OpenAI/Image generation/cache path를 import/call하지 않는다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:phaser`
- `npm run check:topology-generated-assets`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 first screen, after plant, ready, workbench claim을 직접 확인한다. 도구가 노출되지 않으면 blocker를 기록하고 Playwright screenshot fallback을 저장한다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/444
- Draft PR: pending

## Evidence

- `node scripts/postprocess-topology-runtime-assets.mjs` — pass, 9 topology runtime candidates alpha-cleaned
- `npm run build:phaser` — pass
- `npm run check:phaser` — pass
- `reports/assets/topology_runtime_alpha_contact_sheet_20260508.png`
- `reports/visual/issue-0444-topology-runtime-integration/visual-report-20260508.md`
- `npm run check:topology-generated-assets` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass
- `npm run check:asset-alpha` — pass
- `npm run check:ci` — pass
- Issue checkpoint comment: https://github.com/bborok1234/strange-seed-shop/issues/444#issuecomment-4399592192
