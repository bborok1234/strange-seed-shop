## 요약

정원 첫 밭 marker를 PR1 raster asset으로 실제 runtime에 붙이고, fresh desktop/mobile reset에서 아무 행동도 못 하던 시작 deadlock을 `무료로 심기` action으로 복구했습니다. 사용자 재확인에서 지적된 shelf placement와 text safe-zone 문제도 같이 고쳐서 ready marker가 상단 선반이 아니라 정원 바닥 action area에 놓이도록 했습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 새 유저가 잎/꽃가루/재료가 0이어도 첫 밭 marker를 눌러 말랑잎 씨앗을 바로 심을 수 있습니다.

## Plan-first evidence

- Plan artifact: `items/0211-garden-plot-marker-runtime.md`
- Plan에서 벗어난 변경이 있다면 이유: full visual attempt 중 mobile merchant follow-up overflow와 second-chapter delivered-state precedence 회귀가 노출되어, 같은 하단 action panel/readability 문제로 묶어 함께 수정했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 첫 actionable screen, main verb readability, playfield obstruction, marker text safe-zone, mobile bottom-tab/action-panel overlap, Browser Use screenshot evidence.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: 첫 화면이 정적인 그림이 아니라 밭 object를 눌러 시작하는 idle production surface로 읽힙니다.
- 운영사 가치: Browser Use evidence와 focused visual regression으로 사용자 screenshot 기준의 실패를 재현하고 닫았습니다.

## Before / After 또는 Visual evidence

- Before: ready marker가 상단 shelf band에 걸리고, fresh start에서 플레이어가 잎을 모으거나 씨앗을 살 방법 없이 정지했습니다.
- After: ready marker는 floor action area에 고정되고, fresh reset은 `말랑잎 씨앗 무료로 심기`에서 `말랑잎 씨앗 성장시키기`로 진행됩니다.
- Browser Use evidence 또는 blocker: `reports/visual/issue-403-garden-plot-marker-runtime-20260505.md`
- 주요 screenshot:
  - `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-fresh-start-iab.png`
  - `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-fresh-start-after-plant-iab.png`
  - `reports/visual/issue-403-garden-plot-marker-runtime/browser-use-ready-floor-placement-iab.png`
- N/A 사유: 없음.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: save schema, external service, payment, deployment 경로를 건드리지 않고 local React runtime/CSS/visual tests만 변경했습니다.

## 검증

- [x] `npm run check:asset-provenance` PASS
- [x] `npm run check:asset-style` PASS
- [x] `npm run check:asset-normalization` PASS
- [x] `npm run check:asset-alpha` PASS
- [x] `npm run check:p0-ui-ux` PASS
- [x] `npm run check:art-share` PASS, 21 passed
- [x] Browser Use `iab` fresh/ready screenshots PASS
- [x] Focused mobile first-start/overflow regression PASS, 8 passed
- [x] Merchant follow-up + second-chapter focused regression PASS, 2 passed
- [x] `npm run check:dashboard` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

`npm run check:visual` full suite는 main plot fix 후 한 번 시도했고, long merchant chapter 경로에서 두 회귀를 발견해 focused repair로 전환했습니다. 두 실패 케이스는 수정 후 targeted rerun에서 모두 통과했습니다. 전체 96-test visual suite는 merchant 경로가 길어 end-to-end로 다시 돌리지는 않았습니다.

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

이 PR은 dead-start, 밭 marker 위치/텍스트, first-pass idle motion, merchant mobile overflow를 닫습니다. 사용자가 지적한 경쟁작급 캐릭터 게임 품질은 아직 끝난 게 아니며, 다음 WorkUnit은 sprite-sheet 기반 creature actor motion과 gameplay-facing behavior로 분리해야 합니다.

## 연결된 issue

Closes #403
