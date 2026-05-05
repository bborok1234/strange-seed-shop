## 요약

Codex `$studio-operate`가 로컬 `items/0210` 산출물로만 진행되던 상태를 GitHub issue/branch/draft PR 루프로 복구한다. 함께 `garden-respecting-hud-assets` deliberation evidence, Codex studio skill/checker 정비, plot HUD marker asset PR1 후보 4개와 preview gate를 제출한다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `local-0210`이 GitHub issue #401과 이 draft PR로 승격되어, 다음 PR2가 다시 GitHub issue/PR/check 중심으로 진행될 수 있다.

## Plan-first evidence

- Plan artifact: `items/0210-garden-hud-plot-marker-assets.md`
- Plan에서 벗어난 변경이 있다면 이유: 사용자 지적으로 GitHub issue/PR 공백이 확인되어, `.codex/skills/studio-operate/SKILL.md`와 checker에 local-only 방지 규칙을 추가했다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + asset pipeline review
- 적용한 playfield/HUD/playtest 기준: plot card는 첫 행동 surface이며, PR1은 runtime 적용 전 candidate preview/reject gate까지 수행한다.
- Game Studio route에서 벗어난 변경이 있다면 이유: 운영사 루프 복구를 위해 Studio Harness v3 operator/skill 문서와 checker도 함께 묶었다.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [ ] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다. PR1은 runtime code 변경 없음. PR2에서 필수.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: 다음 PR2에서 밭 카드가 cream rectangle이 아니라 실제 정원 plot marker object로 읽히게 만들 candidate asset family를 준비한다.
- 운영사 가치: Codex bounded pass가 local-only 산출물로 조용히 쌓이지 않도록 issue 승격 + draft PR publication 규칙을 Codex skill/checker에 반영한다.

## Before / After 또는 Visual evidence

- Before: GitHub open issue/PR이 0개였고, 마지막 merge PR은 #400이었다. 0210은 local item/report/heartbeat로만 존재했다.
- After: GitHub issue #401, branch `codex/0210-garden-hud-plot-marker-pr1`, 이 draft PR이 존재한다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-recovery-20260505/garden-current-iab.png`, `reports/visual/garden-hud-plot-marker-preview-20260505.png`
- N/A 사유: PR1은 runtime UI를 바꾸지 않고 asset preview gate만 만든다. 실제 GardenPlotCard visual replacement screenshot은 PR2의 merge gate다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: runtime game code와 save schema를 변경하지 않는다. 새 PNG 후보와 운영 문서/skill/checker/evidence만 추가한다.

## 검증

- [x] `npm run check:ci` PASS
- [x] `npm run check:asset-provenance` PASS
- [x] `npm run check:asset-style` PASS
- [x] `npm run check:asset-normalization` PASS
- [x] `npm run check:asset-alpha` PASS
- [x] `npm run check:p0-ui-ux` PASS
- [x] `npm run check:art-share` PASS, 12 passed
- [x] `npm run check:studio-v3-operator` PASS
- [x] `npm run check:project-commands` PASS
- [x] `npm run check:studio-deliberation-ralph-loop` PASS
- [x] `npm run check:docs` PASS
- [x] `npm run build` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- Runtime image generation 없음. 새 game graphics는 Codex native raster PNG 후보이며, manifest accepted 등록은 PR2로 분리했다.

## 남은 위험

- `ui_hud_plot_text_plate_001`은 panel-like 위험이 있어 PR2에서 small subordinate label plate로만 써야 한다.
- PR1 후보가 실제 `GardenPlotCard`에서 cream rectangle 시각 주도권을 제거하지 못하면 PR2에서 asset crop/scale/reject가 필요하다.
- GitHub Actions #402 checks는 `Check automerge eligibility`, `Verify game baseline`, `Art-share gate` 모두 PASS다.

## 연결된 issue

Closes #401

---

작성 규칙:

- 이 본문은 markdown 파일로 작성한 뒤 `gh pr create/edit --body-file <file>`로 제출한다.
- 셸 인자에 `\n`을 넣어 multi-line 본문을 만들지 않는다. GitHub 화면에 literal `\n`이 보이면 실패다.
- 섹션을 삭제하지 않는다. 해당 없음이면 `N/A 사유:`를 적는다.
- `작업 checklist`는 삭제하지 않는다. 완료되지 않은 항목은 빈 체크박스로 남기고 사유를 적는다.
- PR merge/close 이후 main CI 결과를 repo 문서에 backfill하기 위한 closeout PR을 만들지 않는다. main CI는 GitHub run에서 관찰하고, 다음 작업은 별도 plan-first issue로 시작한다.
