# 정원 밭 marker를 실제 화면 object로 교체

## 문제 / 배경

PR #402는 `garden-respecting-hud-assets`의 PR1로 plot marker 후보 PNG와 preview gate를 GitHub 운영 루프로 복구했다. 하지만 실제 `GardenPlotCard` runtime은 아직 cream rectangle 카드로 남아 있어, 정원 중앙의 첫 player verb가 앱 카드처럼 읽힌다.

## 목표

PR1에서 생성한 Codex native raster plot marker family를 accepted manifest asset으로 등록하고, `GardenPlotCard` 화면 surface를 정원 object처럼 보이도록 교체한다.

## Small win

fresh/growing/ready 밭 버튼이 cream rectangle이 아니라 seedbed marker + ready ribbon + subordinate text plate 조합으로 보인다.

## Campaign source of truth

P0.5 Idle Core + Creative Rescue

## Game Studio Department Signoff

- 기획팀: `plant_seed`, `tap_growth`, `harvest_plot` player verb 위치를 시각적으로 강화한다.
- 리서치팀: Egg, Inc./Idle Miner 기준 생산 node readability를 축소 적용한다.
- 아트팀: PR1 Codex native raster PNG만 사용하고, `ui_hud_plot_text_plate_001`은 small subordinate label plate로 제한한다.
- 개발팀: manifest, `GardenPlayfieldHost.tsx`, `src/styles.css`, visual regression만 변경한다.
- 검수팀: Browser Use 우선 QA와 Playwright screenshot fallback을 evidence로 남긴다.
- 마케팅팀: 외부 채널/결제/광고 없음.
- 고객지원팀: “정원 화면이 카드 묶음처럼 보인다”는 confusion risk를 줄인다.

## Subagent/Team Routing

사용하지 않는다. 이번 slice는 단일 runtime surface와 screenshot 판정이 밀접하게 결합되어 있어 로컬 통합 작업이 더 안전하다.

## 플레이어 가치

첫 5분 정원 화면에서 플레이어가 메뉴 카드를 읽는 대신 실제 밭 object를 눌러 심고 키우고 수확하는 게임 장면으로 이해한다.

## 수용 기준

- [ ] `public/assets/manifest/assetManifest.json`에 네 plot marker asset이 accepted로 등록된다.
- [ ] manifest entry는 `screen_moment`, `player_verb`, `state_binding`, `text_safe_zone`, `must_not_obscure`를 남긴다.
- [ ] `GardenPlotCard` button/aria/click/disabled semantics가 유지된다.
- [ ] screenshot에서 cream rectangle 시각 주도권이 사라진다.
- [ ] ready ribbon이 label/source/progress를 가리지 않는다.
- [ ] dock-expanded seeds tab에서 plot card가 가려지지 않는다.
- [ ] mobile 393x852에서 body scroll, bottom tab overlap, text clipping이 없다.

## Visual evidence 계획

- Browser Use `iab`: desktop default, loaded ready plot, dock-expanded seeds tab, mobile 393x852.
- Browser Use가 막히면 blocker report를 남기고 Playwright screenshot fallback을 `reports/visual/`에 저장한다.

## Playable mode 영향

main playable flow와 save schema는 유지한다. runtime image generation은 계속 disabled다.

## 안전 범위

save schema, Phaser scene logic, 결제, 외부 배포, production customer data는 scope 밖이다.

## 검증 명령

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-normalization`
- `npm run check:asset-alpha`
- `npm run check:art-share`
- `npm run check:p0-ui-ux`
- `npm run check:visual`
- `npm run build`

## 연결 문서

- `items/0211-garden-plot-marker-runtime.md`
- `items/0210-garden-hud-plot-marker-assets.md`
- `reports/assets/garden-hud-plot-marker-preview-20260505.md`
