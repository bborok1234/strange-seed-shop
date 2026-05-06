# WorkUnit — 정원 첫 화면을 production scene으로 재구성

- ID: `0224`
- Status: review
- GitHub issue: #422 — https://github.com/bborok1234/strange-seed-shop/issues/422
- Draft PR: #423 — https://github.com/bborok1234/strange-seed-shop/pull/423
- Campaign source: P0.5 Idle Core + Creative Rescue
- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest` + `game-studio:sprite-pipeline`
- Source specs: `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, `docs/IDLE_CORE_PRODUCTION_SPEC.md`

## Goal

정원 첫 화면을 “정적인 배경 위 카드 UI”에서 “생명체가 일하고, 밭/주문/보상이 움직이는 모바일 idle collection tycoon scene”으로 재구성한다.

이번 WorkUnit의 성공 기준은 작은 UI polish가 아니다. 데스크톱에서도 중앙 모바일 game frame만 보이고, 첫 시작 상태에서 즉시 할 행동이 있으며, gpt-image-2로 만든 gameplay asset/sprite/FX가 실제 화면 state에 연결되어야 한다.

## Reference Teardown

- `Cats & Soup`: 캐릭터가 시설에서 일하는 장면 자체가 idle 생산을 설명한다. 이 게임도 worker actor를 card icon이 아니라 정원 anchor에 배치해야 한다.
- `Egg, Inc.`: 생산량, 보관, 주문/납품 병목이 한눈에 보이고 업그레이드 선택으로 이어진다. 정원 HUD는 숫자를 길게 설명하지 않고 다음 player verb를 열어야 한다.
- `Neko Atsume 2`: 조작은 단순하지만 배치/기다림/방문 기록이 소유감으로 이어진다. fresh start는 잎 0이어도 첫 씨앗/밭 행동이 막히면 안 된다.
- `CookieRun: Kingdom`: 생산 건물과 캐릭터가 hub 안에서 함께 움직인다. 정원은 메뉴 dashboard가 아니라 세계 안 생산 hub처럼 보여야 한다.

Rejected alternative: 기존 cream card와 CSS 장식만 조정한다. 사용자가 지적한 문제는 spacing bug가 아니라 asset, label, actor, HUD 위계가 서로 싸우는 구조적 문제라서, card polish만으로는 production bar를 통과하지 못한다.

## Creative Brief

- Player verb: `첫 씨앗 심기`, `성장 탭`, `수확`, `생산 잎 수령`, `주문 납품`.
- Production/progression role: 첫 5분 생산 엔진 가시성, fresh-start 진행 가능성, 다음 성장 선택.
- Screen moment: fresh start 첫 3초, research-expedition-ready 정원, desktop browser에서 보는 중앙 mobile frame.
- Player feeling: “정원이 실제로 움직인다. 이 생명체가 일을 하고 있으니 다음 주문/밭/씨앗까지 보고 싶다.”

## Plan

1. `gpt-image-2` asset/FX batch를 추가한다.
   - budget cap: hard `$250`, soft checkpoint `$200`
   - provider: OpenAI Images API `gpt-image-2`
   - runtime generation: 금지
   - accepted graphics: raster PNG only
2. 새 asset/sprite 후보를 `assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 추가한다.
   - plot ground states: empty/growing/ready label-safe marker
   - worker sprite: starter creature idle/work/celebrate strip
   - reward/order FX: leaf trail, harvest pop, order seal/receipt
   - diegetic HUD: resource pouch, objective sign, compact action ribbon
3. 생성 결과를 `public/assets/game/**`에 저장하고 provenance를 남긴다.
   - `assets/source/gpt_image_asset_provenance.json`
   - prompt/model sidecar
   - animation frame metadata
4. `public/assets/manifest/assetManifest.json`에 accepted asset과 `animation.binding`을 등록한다.
5. 정원 shell을 모바일 game frame 기준으로 강제한다.
   - desktop rail/side dock/dashboard column 제거
   - 360-430px 세로 frame을 중앙에 배치
6. 정원 scene layout을 재작성한다.
   - top HUD: brand/objective/resource pills만
   - center playfield: plot, actor, order/research prop, short plate
   - bottom action surface: 현재 primary verb와 다음 성장 선택만
   - bottom nav: top-level tab 5개 유지
7. fresh start를 막히지 않게 수정한다.
   - 잎 0에서도 첫 씨앗을 무료로 심을 수 있음
   - 첫 행동 CTA가 정원 안에서 보임
8. Browser Use `iab`로 직접 검수한다.
   - fresh start
   - `?qaResearchExpeditionReady=1`
   - 393x852, 360x800, desktop browser 중앙 mobile frame

## Asset/FX Bundle

Required new or regenerated assets:

| Asset ID | Category | Output | Binding |
| --- | --- | --- | --- |
| `ui_garden_objective_wood_sign_001` | `ui_frame` | `public/assets/game/ui/ui_garden_objective_wood_sign_001.png` | top objective sign |
| `ui_garden_resource_pouch_001` | `ui_frame` | `public/assets/game/ui/ui_garden_resource_pouch_001.png` | resource pill frame |
| `ui_garden_action_ribbon_001` | `ui_frame` | `public/assets/game/ui/ui_garden_action_ribbon_001.png` | bottom primary action |
| `ui_garden_plot_floor_empty_001` | `ui_frame` | `public/assets/game/ui/ui_garden_plot_floor_empty_001.png` | empty plot marker |
| `ui_garden_plot_floor_growing_001` | `ui_frame` | `public/assets/game/ui/ui_garden_plot_floor_growing_001.png` | growing plot marker |
| `ui_garden_plot_floor_ready_001` | `ui_frame` | `public/assets/game/ui/ui_garden_plot_floor_ready_001.png` | ready plot marker |
| `sprite_creature_herb_common_001_idle_strip` | `sprite_strip` | `public/assets/game/sprites/production/creature_herb_common_001_idle_strip.png` | `target=production_actor`, `slot=idle` |
| `sprite_creature_herb_common_001_work_strip` | `sprite_strip` | `public/assets/game/sprites/production/creature_herb_common_001_work_strip.png` | `target=production_actor`, `slot=work` |
| `sprite_creature_herb_common_001_celebrate_strip` | `sprite_strip` | `public/assets/game/sprites/production/creature_herb_common_001_celebrate_strip.png` | `target=production_actor`, `slot=celebrate` |
| `fx_garden_leaf_trail_001_strip` | `fx_strip` | `public/assets/game/fx/fx_garden_leaf_trail_001_strip.png` | `action=claim_production` |
| `fx_garden_harvest_pop_001_strip` | `fx_strip` | `public/assets/game/fx/fx_garden_harvest_pop_001_strip.png` | `action=harvest_plot` |
| `fx_garden_order_receipt_001_strip` | `fx_strip` | `public/assets/game/fx/fx_garden_order_receipt_001_strip.png` | `action=deliver_order` |

Sprite/FX frame spec:

- actor strips: 6 frames, 96x96 frame, 8-10 fps, horizontal strip, transparent/alpha-ready
- FX strips: 6 frames, 128x128 frame, 12 fps, horizontal strip, transparent/alpha-ready
- UI frames: 1024x1024 source, cropped/post-processed if needed, no text baked into image

## Game Studio Department Signoff

- 기획팀: 첫 화면에서 `씨앗 심기/수확/생산 수령/납품` 중 하나가 3초 안에 보인다.
- 리서치팀: Cats & Soup actor work scene, Egg Inc. production readability, Neko Atsume simple placement를 축소 적용한다.
- 아트팀: gpt-image-2 default, style bible reference consistency, alpha-ready PNG, small-size review, manifest binding을 소유한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `src/game/playfield/*`, manifest/source asset files만 우선 범위로 삼는다.
- 검수팀: Browser Use `iab` before/after, 393/360/desktop screenshot, fresh-start playable assertion을 남긴다.
- 마케팅팀: mock-only devlog angle은 “정원이 실제로 움직이기 시작했다”로 제한한다. 실제 채널 게시 없음.
- 고객지원팀: 첫 행동을 못 찾는 confusion을 high severity로 보고, 첫 action CTA와 plot affordance를 명확히 한다.

## Subagent/Team Routing Decision

이번 Codex App pass에서는 native subagent를 사용하지 않는다. 사용자가 끝까지 수행을 요청했지만 현재 immediate blocker는 local code/asset manifest/Browser Use loop가 같은 write set에 강하게 결합되어 있어 leader가 직접 통합한다. 독립 QA는 구현 후 Browser Use와 focused checks로 수행한다.

## Acceptance Criteria

- [x] 데스크톱 브라우저에서도 중앙 모바일 game frame만 보이고 side rail/dashboard panel이 없다.
- [x] fresh start에서 잎 0이어도 첫 씨앗/밭 행동이 가능하다.
- [x] 정원 중심부가 permanent card에 덮이지 않고 plot/actor/order prop이 먼저 읽힌다.
- [x] worker actor가 최소 48px 이상으로 정원 playfield에 보이고 idle/work/celebrate 중 최소 2개 motion state를 가진다.
- [x] plot label은 plate/ribbon/shadow 처리되어 배경 위 직접 텍스트가 아니다.
- [x] `gpt-image-2` generated raster PNG provenance가 남는다.
- [x] sprite/FX asset은 manifest `animation.binding`, frame count, frame size, frame rate를 가진다.
- [x] Browser Use `iab` screenshot evidence가 `reports/visual/issue-0224-garden-production-redesign/`에 저장된다.
- [x] `npm run check:asset-provenance`
- [x] `npm run check:asset-style`
- [x] `npm run check:asset-normalization`
- [x] `npm run check:asset-alpha`
- [x] `npm run check:p0-ui-ux`
- [x] `npm run check:art-share`
- [x] `npm run build`

## Risks

- gpt-image-2 output이 spritesheet frame consistency를 지키지 못할 수 있다. 이 경우 raw generation은 유지하되 post-process/strip normalization으로 frame extraction evidence를 남긴다.
- 전체 shell 재배치가 기존 visual regression을 깨뜨릴 수 있다. desktop 전용 rail을 없애는 변경은 의도된 breaking visual delta로 PR body에 명시한다.
- 기존 saved state가 복잡해 첫 pass에서 모든 production chain state를 완벽히 새 layout에 맞추기 어려울 수 있다. 우선 fresh start와 research-expedition-ready를 acceptance anchor로 삼는다.

## Out of Scope

- 실제 결제, 광고, 외부 배포, 계정/로그인.
- 런타임 이미지 생성.
- 전체 economy 수치 재튜닝.
- 모든 creature family의 full animation set. 이번 slice는 starter worker 기준 production bar 회복이 목적이다.

## Verification Notes

- Browser Use reconnect evidence: `reports/visual/browser-use-reconnect-20260506.png`
- Current user source-of-truth: in-app browser `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`
- Generated asset contact sheets:
  - `reports/assets/issue-0224-gpt-image-contact-sheet.png`
  - `reports/assets/issue-0224-postprocessed-contact-sheet.png`
- Browser Use final evidence:
  - `reports/visual/issue-0224-garden-production-redesign/browser-use-fresh-start-final-clean-20260506.png`
  - `reports/visual/issue-0224-garden-production-redesign/browser-use-fresh-start-after-free-plant-20260506.png`
  - `reports/visual/issue-0224-garden-production-redesign/browser-use-research-expedition-ready-final-clean-20260506.png`
  - `reports/visual/issue-0224-garden-production-redesign/browser-use-production-actor-static-wrapper-20260506.png`
- Focused checks:
  - `npm run check:asset-provenance` pass
  - `npm run check:asset-style` pass
  - `npm run check:asset-normalization` pass
  - `npm run check:asset-alpha` pass
  - `npm run check:p0-ui-ux` pass
  - `npm run check:art-share` pass, 17 passed
  - `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "첫 화면은 밭 marker|body scroll|production garden visual composition"` pass, 10 passed
  - `npm run build` pass
