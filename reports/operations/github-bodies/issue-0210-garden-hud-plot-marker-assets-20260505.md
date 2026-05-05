## 문제 / 배경

Codex `$studio-operate` bounded pass가 `garden-respecting-hud-assets`의 첫 implementation slice를 로컬 `items/0210-garden-hud-plot-marker-assets.md`와 report/evidence로 진행했지만, GitHub issue/PR로 승격하지 않아 Studio Harness v3의 GitHub-authoritative 루프가 약해졌다.

현재 GitHub open issue/PR은 없고, 마지막 merge PR은 #400이다. 이 issue는 로컬 0210 WorkUnit을 GitHub operational truth로 복구하고, plot marker asset PR1을 draft PR/check/evidence 표면으로 연결한다.

## 목표

`GardenPlotCard` cream rectangle 문제를 해결하는 첫 단계로, plot HUD marker asset family의 plan/prompt/provenance/preview gate를 GitHub issue + draft PR 흐름으로 복구한다.

## Small win

로컬에만 있던 0210 작업을 GitHub issue/branch/draft PR로 올려, 다음 PR2 구현 전에 운영 루프가 다시 issue/PR/check 중심으로 보이게 만든다.

## Campaign source of truth

P0.5 Idle Core + Creative Rescue.

## Game Studio Department Signoff

- 기획팀: `plant_seed`, `tap_growth`, `harvest_plot`, `read_plot_state` player verb를 asset plan/prompt에 명시한다.
- 리서치팀: 경쟁작 idle game의 production loop처럼 plot이 앱 카드가 아니라 실제 행동 사물로 읽혀야 한다는 production gap을 기준으로 삼는다.
- 아트팀: Codex native raster PNG 후보 4개를 생성하고, manifest accepted 전 preview/reject gate를 둔다.
- 개발팀: PR1은 runtime code를 변경하지 않고 asset source/provenance/evidence만 다룬다. PR2에서 manifest/runtime skinning을 별도 처리한다.
- 검수팀: preview screenshot과 asset/provenance/style/alpha/build checks를 남긴다.
- 마케팅팀: 외부 채널 게시 없음. mock/player-facing promise 없음.
- 고객지원팀: “정원 화면이 카드 묶음처럼 보인다”는 첫 5분 confusion risk를 plot marker surface로 줄이는 방향이다.

## Subagent/Team Routing

이미 `reports/deliberation/garden-respecting-hud-assets/`에서 Designer, Art Director, Engineer, Senior Critic proposal/critique가 완료됐다. 이번 issue는 그 spec의 PR1 publish/repair slice이므로 새 subagent를 추가로 쓰지 않고 GitHub 루프 복구와 evidence packaging에 집중한다.

## 플레이어 가치

다음 PR2에서 밭 버튼이 cream card가 아니라 정원 사물로 읽히게 만들 준비를 완료한다. 플레이어가 첫 30초에 “어느 밭을 누르면 시작되는지” 더 명확히 이해하게 하는 전 단계다.

## 수용 기준

- [ ] GitHub issue가 생성되어 `items/0210-garden-hud-plot-marker-assets.md`와 연결된다.
- [ ] branch가 main에서 분기되고 draft PR이 생성된다.
- [ ] PR body가 `요약`, `Small win`, `사용자/운영자 가치`, `Before / After 또는 Visual evidence`, `Playable mode`, `검증`, `안전 범위`, `남은 위험`, `연결된 issue` 섹션을 포함한다.
- [ ] `.omc/` 세션 캐시는 PR에 포함하지 않는다.
- [ ] PR1은 runtime code 변경 없이 plot HUD asset plan/prompt/provenance/preview gate만 포함한다.
- [ ] `reports/visual/garden-hud-plot-marker-preview-20260505.png`가 evidence로 연결된다.
- [ ] `npm run check:asset-provenance`
- [ ] `npm run check:asset-style`
- [ ] `npm run check:asset-normalization`
- [ ] `npm run check:asset-alpha`
- [ ] `npm run check:p0-ui-ux`
- [ ] `npm run check:art-share`
- [ ] `npm run check:studio-v3-operator`
- [ ] `npm run check:project-commands`
- [ ] `npm run check:studio-deliberation-ralph-loop`
- [ ] `npm run check:docs`
- [ ] `npm run build`

## Visual evidence 계획

- `reports/visual/garden-hud-plot-marker-preview-20260505.png`
- PR2에서 실제 `GardenPlotCard` 적용 후 Browser Use 또는 fallback screenshot evidence를 추가한다.

## Playable mode 영향

PR1은 runtime code를 바꾸지 않으므로 playable mode 동작 영향은 없다. PR2에서 실제 garden surface 변경 후 playable screenshot/evidence가 필요하다.

## 안전 범위

- runtime image generation 금지.
- SVG/vector/code-native game graphics 금지.
- payment, ads, external production deployment, customer data 없음.
- manifest accepted 등록과 runtime skinning은 PR2로 분리.

## 검증 명령

```bash
npm run check:asset-provenance
npm run check:asset-style
npm run check:asset-normalization
npm run check:asset-alpha
npm run check:p0-ui-ux
npm run check:art-share
npm run check:studio-v3-operator
npm run check:project-commands
npm run check:studio-deliberation-ralph-loop
npm run check:docs
npm run build
```
