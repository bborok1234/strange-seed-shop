# 0239 Actor and FX runtime strip normalization

## Problem

#444 made the Phaser board read as generated topology art, but the moving actor and feedback effects are still placeholder shapes. #442 generated actor/FX source candidates (`actor_pori_caretaker_strip_v1`, `actor_momo_carrier_strip_v1`, `fx_care_spark_strip_v1`, `fx_harvest_leaf_flyout_strip_v1`) as 1024x1024 opaque source sheets, not strict Phaser spritesheets. v1 still needs generated actor/FX motion to feel alive.

## Goal

Alpha-clean and normalize Pori/Momo actor and care/harvest FX candidates into strict runtime strips, then connect at least Pori actor and care/harvest feedback to the Phaser board.

## Game Studio Route

- `game-studio:game-studio`: #444 이후 next visual/game-feel payoff 선택
- `game-studio:sprite-pipeline`: source sheet alpha cleanup, frame extraction, 6-frame/FX strip normalization, animation metadata
- `game-studio:phaser-2d-game`: Phaser spritesheet preload/animation/runtime triggering
- `game-studio:game-playtest`: plant/care/harvest/workbench smoke and screenshots

## Department Scorecard

| 부서 | 판정 | 근거 artifact |
| --- | --- | --- |
| 기획팀 | approve | 첫 수확 후 `말랑잎 포리`가 shape가 아니라 generated actor로 움직여야 수집/정원 애착이 생긴다. |
| 리서치팀 | approve | 경쟁 idle/tycoon은 worker motion과 reward feedback이 board 생동감을 만든다. |
| 아트팀 | caution | Source sheets가 1024x1024라 strict strip crop/extraction 품질을 contact sheet로 확인해야 한다. |
| 개발팀 | approve | Runtime API 호출 없이 normalized workspace PNG를 Phaser spritesheet로 사용한다. |
| 검수팀 | approve | `check:phaser`가 actor/FX texture keys와 screenshots를 확인해야 한다. |
| 마케팅팀 | approve | 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | care/harvest feedback이 있으면 사용자가 tap 결과를 더 쉽게 이해한다. |

## Self-Evaluation Loop

Claim: generated actor/FX source candidates become strict runtime strips and Phaser smoke shows actor/FX keys loaded without breaking first loop.

Smallest verifier:

- normalized strip files exist with expected dimensions
- provenance/status record post-processing
- `npm run check:phaser`
- visual report with screenshot/contact sheet

Rubric:

| 항목 | 통과 기준 |
| --- | --- |
| actor strip | Pori actor source becomes strict 6-frame strip |
| FX strip | care/harvest FX source becomes strict strip |
| runtime | Phaser loads spritesheet/FX texture keys and smoke still passes |
| visual payoff | care/harvest produces generated FX or actor sprite visibility |
| separation | no runtime image generation/API/cache dependency |

Artifact path:

- `public/assets/game/sprites/actor_pori_caretaker_strip_v1.png`
- `public/assets/game/fx/fx_care_spark_strip_v1.png`
- `public/assets/game/fx/fx_harvest_leaf_flyout_strip_v1.png`
- `apps/seed-garden-phaser/src/main.ts`
- `reports/visual/issue-0446-actor-fx-runtime-strips/`

Stop condition:

- PR merges and main CI passes, or source strip quality is explicitly blocked with evidence.

## Plan

1. GitHub issue를 생성한다.
2. Actor/FX source candidates를 alpha-clean하고 strict strip으로 normalize한다.
3. Phaser preload/animation/runtime feedback에 연결한다.
4. `check:phaser`에 actor/FX loaded key evidence를 추가한다.
5. visual report와 contact sheet를 저장한다.
6. Roadmap/control room/dashboard/heartbeat를 갱신한다.

## Acceptance Criteria

- Pori actor is rendered from a generated normalized strip, not hand-drawn shape.
- Care or harvest interaction triggers generated FX texture visibility.
- Normalized strips have deterministic dimensions and provenance/status notes.
- `npm run check:phaser` and `npm run check:ci` pass.

## Verification Commands

- `npm run check:phaser`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## Browser Use

Browser Use `iab`가 노출되면 care/harvest FX와 actor motion을 직접 확인한다. 도구가 노출되지 않으면 blocker를 기록하고 Playwright screenshot fallback을 저장한다.

## GitHub

- Issue: https://github.com/bborok1234/strange-seed-shop/issues/446
- Draft PR: pending

## Evidence

- `node scripts/normalize-actor-fx-runtime-strips.mjs` — pass, Pori/Momo/care/harvest strips normalized
- `reports/assets/actor_fx_runtime_strip_contact_sheet_20260508.png`
- `npm run check:phaser` — pass
- `reports/visual/issue-0446-actor-fx-runtime-strips/visual-report-20260508.md`
- `npm run check:topology-generated-assets` — pass
- `npm run check:asset-provenance` — pass
- `npm run check:asset-style` — pass
- `npm run check:asset-alpha` — pass
- `npm run check:ci` — pass
- Issue checkpoint comment: https://github.com/bborok1234/strange-seed-shop/issues/446#issuecomment-4399746392
