# Roadmap

Status values:

- `todo`: not started
- `active`: currently being worked
- `blocked`: cannot proceed without a decision or external dependency
- `review`: work exists and needs verification
- `done`: completed with evidence


## Strategic North Star / 전략적 북극성

이 저장소는 현재 하나의 레포 안에 두 프로젝트를 함께 담고 있다.

1. **게임 프로젝트**: `이상한 씨앗상회` — 첫 5분 안에 “얘 귀엽다. 하나만 더 키워볼까?”를 만들고, 이름 있는 생명체 수집과 오프라인 복귀 욕구를 검증한다.
2. **운영사 프로젝트**: 에이전트 네이티브 게임 스튜디오/운영사 — 에이전트가 issue intake, 우선순위 선정, 구현, 검증, draft PR, CI 복구, follow-up issue까지 안전하게 반복하는 운영 계층을 만든다.

공통 헌장은 `docs/NORTH_STAR.md`가 소유한다. 게임 작업은 재미와 수집 욕구를, 운영사 작업은 장시간 자율성과 증거 기반 복구 능력을 개선해야 한다.

## P0.5 Idle Core + Creative Rescue

Goal: 현재 수집 UI 프로토타입을 production급 idle collection tycoon vertical slice로 전환한다. 게임 기획, UI, 에셋, 연출을 분리하지 않고 core loop 재미를 먼저 만든다.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Idle core creative guide | active | `docs/IDLE_CORE_CREATIVE_GUIDE.md`, `docs/SESSION_HANDOFF_20260429.md` | Egg, Inc./Idle Miner/Cell to Singularity에서 배운 생산 엔진, 장기 메타, asset bible, Codex vertical-slice workflow가 문서화됨 |
| Creature role + auto production v0 | done | Issue #121, PR #122, `items/0069-idle-production-order-v0.md`, production tick UI, visual evidence, main CI `25090571222` | 첫 생명체가 정원 경제에 참여하고 생산 tick이 화면에서 읽힘 |
| Order/commission v0 | done | Issue #121, PR #122, `items/0069-idle-production-order-v0.md`, first order UI, reward loop, visual evidence, main CI `25090571222` | 짧은 주문 목표가 생기고 납품 보상이 다음 씨앗/연구/탐험 목표로 이어짐 |
| Production garden UI v0 | done | Issue #123, PR #124, `items/0070-production-garden-ui-v0.md`, compact production/order UI, visual evidence, main CI `25090930573` | 정원 화면이 패널 앱이 아니라 생산 엔진이 보이는 모바일 게임 화면처럼 읽힘 |
| Core asset batch v0 | active | Issue #125 closed, PR #126, Issue #127, Issue #131, `items/0071-core-asset-batch-plan.md`, `items/0072-core-asset-generation-first-pass.md`, `items/0074-core-asset-manifest-normalization.md`, P0.5 generated candidates and manifest entries | gameplay role이 있는 asset batch가 투명 배경/작은 크기 판독성/manifest 검증을 통과함 |
| Production/order asset runtime v0 | done | Issue #133, PR #134, `items/0075-production-order-asset-runtime-v0.md`, Browser Use QA, visual gate, main CI `25094604445` | 첫 생산/주문 UI에서 work creature, order crate, celebrate state가 보이고 모바일 첫 화면 밀도가 유지됨 |
| Production/order FX runtime v0 | done | Issue #135, `items/0076-production-order-fx-runtime-v0.md`, Browser Use QA, `reports/visual/p0-production-order-fx-runtime-20260429.md` | 생산 수령/주문 납품 순간에 static FX strip feedback이 보이고 Phaser board 세로줄 artifact가 줄어듦 |
| Playfield production actors v0 | done | Issue #144, `items/0082-playfield-production-actors-v0.md`, Browser Use QA, `reports/visual/p0-playfield-production-actors-v0-20260429.md` | 정원 playfield 안에 work creature, order crate, order progress가 보여 production engine이 board scene으로 읽힘 |
| Upgrade choice surface v0 | done | Issue #146, `items/0083-upgrade-choice-surface-v0.md`, Browser Use QA, `reports/visual/p0-upgrade-choice-surface-v0-20260429.md` | 생산/주문 보상 아래에 밭 확장, 생산 속도, 주문 준비 선택이 보여 idle tycoon 성장 방향이 읽힘 |
| Production speed upgrade loop v0 | done | Issue #148, `items/0084-production-speed-upgrade-loop-v0.md`, Browser Use QA, `reports/visual/p0-production-speed-upgrade-loop-v0-20260429.md` | 첫 주문 납품 보상이 작업 간식 강화로 이어지고 production rate가 7.2 -> 9.0으로 상승함 |
| Repeat order v0 | done | Issue #150, `items/0085-repeat-order-v0.md`, Browser Use QA, `reports/visual/p0-repeat-order-v0-20260429.md` | 첫 주문 후 `연구 준비 잎 묶음`이 다음 주문으로 등장하고 생산 수령이 새 주문 진행률을 채움 |
| Research unlock v0 | done | Issue #152, `items/0086-research-unlock-v0.md`, Browser Use QA, `reports/visual/p0-research-unlock-v0-20260429.md` | 두 번째 주문 보상이 `새싹 기록법 연구` purchase와 `researchLevel` 저장으로 이어짐 |
| Research clue reward v0 | done | Issue #154, `items/0087-research-clue-reward-v0.md`, Browser Use QA, `reports/visual/p0-research-clue-reward-v0-20260429.md` | 연구 완료가 다음 생명체/씨앗 단서로 이어져 수집 목표가 더 명확해짐 |
| Research expedition bridge v0 | done | Issue #160, `items/0090-research-expedition-bridge-v0.md`, Browser Use QA, `reports/visual/p0-research-expedition-bridge-v0-20260429.md` | 연구 완료가 하단 원정 탭 `단서` badge와 `달빛 흔적 찾기` 장기 메타 preview로 이어짐 |
| Research expedition start v0 | done | Issue #162, `items/0091-research-expedition-start-v0.md`, Browser Use QA, `reports/visual/p0-research-expedition-start-v0-20260429.md` | 연구 완료와 두 번째 생명체 발견이 `달빛 흔적 찾기` 원정 시작/진행 상태로 이어짐 |
| Moon expedition reward bridge v0 | done | Issue #164, `items/0092-moon-expedition-reward-bridge-v0.md`, Browser Use QA, `reports/visual/p0-moon-expedition-reward-bridge-v0-20260429.md` | `달빛 흔적 찾기` 보상 수령이 `달방울 씨앗` / `달방울 누누` 다음 수집 목표로 이어짐 |
| Lunar seed harvest bridge v0 | done | Issue #166, `items/0093-lunar-seed-harvest-bridge-v0.md`, `reports/visual/p0-lunar-seed-harvest-bridge-v0-20260430.md` | `달방울 씨앗` 구매/심기/수확이 `달방울 누누` 발견과 다음 도감 목표 전환으로 이어지고 `npm run check:ci`가 통과함 |
| Lunar guardian offline bonus v0 | done | Issue #168, `items/0094-lunar-guardian-offline-bonus-v0.md`, `reports/visual/p0-lunar-guardian-offline-bonus-v0-20260430.md` | `달방울 누누` 발견이 오프라인 복귀 보상 bonus와 toast 문구로 이어지고 `npm run check:ci`가 통과함 |
| Comeback reward breakdown v0 | done | Issue #170, `items/0095-comeback-reward-breakdown-v0.md`, `reports/visual/p0-comeback-reward-breakdown-v0-20260430.md` | 15분 이상 복귀 보상이 시간, 잎, 달빛 수호 bonus, 다음 행동 CTA가 있는 compact modal로 보이고 `npm run check:ci`가 통과함 |
| Comeback next-action bridge v0 | done | Issue #172, `items/0096-comeback-next-action-bridge-v0.md`, `reports/visual/p0-comeback-next-action-bridge-v0-20260430.md` | 복귀 보상 modal의 다음 씨앗 CTA가 씨앗 탭 목표 row로 이어지고 `npm run check:ci`가 통과함 |
| Comeback one-tap seed spend v0 | done | Issue #174, `items/0097-comeback-one-tap-seed-spend-v0.md`, `reports/visual/p0-comeback-one-tap-seed-spend-v0-20260430.md` | Browser Use `iab`와 visual gate에서 복귀 보상 modal의 다음 목표 씨앗 바로 구매가 seeds 탭 목표 row로 이어지고 `npm run check:ci`가 통과함 |
| Comeback one-tap plant v0 | done | Issue #178, `items/0099-comeback-one-tap-plant-v0.md`, `reports/visual/p0-comeback-one-tap-plant-v0-20260430.md` | Browser Use `iab`와 visual gate에서 복귀 보상 modal의 다음 목표 씨앗 구매+심기가 정원 playfield 성장 상태로 이어지고 `npm run check:ci`가 통과함 |
| Comeback plant success nudge v0 | done | Issue #180, `items/0100-comeback-plant-success-nudge-v0.md`, `reports/visual/p0-comeback-plant-success-nudge-v0-20260430.md` | Browser Use `iab`와 visual gate에서 복귀 보상 구매+심기 후 toast가 심기 성공과 밭 tap 성장 다음 행동을 안내하고 `npm run check:ci`가 통과함 |
| Comeback growth progress nudge v0 | done | Issue #182, `items/0101-comeback-growth-progress-nudge-v0.md`, `reports/visual/p0-comeback-growth-progress-nudge-v0-20260430.md` | Browser Use `iab`와 visual gate에서 복귀 보상 구매+심기 후 다음 행동 패널이 현재 성장률과 남은 시간을 보여 밭 tap 성장 반복을 안내하고 `npm run check:ci`가 통과함 |
| Playfield board readability v0 | done | Issue #137, `items/0077-playfield-board-readability-v0.md`, Browser Use QA, `reports/visual/p0-playfield-board-readability-20260429.md` | 세로줄 artifact 완화 후에도 plot/status text가 읽히고 locked plot 반복 노이즈가 줄어듦 |

## P0 Game Studio Operating Mode — UI/UX Rescue

Goal: P0가 단순히 기능이 돌아가는 상태가 아니라, 첫 화면이 게임처럼 보이고 자동화가 실제 화면 회귀를 잡는 상태가 될 때까지 운영모드로 반복한다.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| P0 UI/UX research baseline | done | `docs/GAME_UI_UX_RESEARCH_20260428.md`, `items/0053-game-ui-ux-p0-rescue.md`, Issue #89 | HUD/playfield, Phaser viewport, CLI visual QA, alpha asset 기준과 프로젝트 결정이 문서화됨 |
| Playfield-first garden screen | active | `src/App.tsx`, `src/styles.css`, `src/game/playfield/GardenScene.ts` | 정원 기본 화면에서 안내/하이라이트/패널이 밭을 가리지 않고 Phaser playfield가 주 시각 영역으로 보임 |
| Garden action surface v0 | done | Issue #140, `items/0080-garden-action-surface-v0.md`, `src/App.tsx`, `src/styles.css`, `reports/visual/p0-garden-action-surface-v0-20260429.md` | 정원 기본 화면의 하단 UI가 작은 스크롤 패널이 아니라 primary CTA와 compact goal strip 중심의 game action surface로 읽힘 |
| Phaser playfield presentation polish | done | Issue #99, PR #100, `items/0058-playfield-presentation-polish.md`, `src/game/playfield/GardenScene.ts` | ready/locked/empty plot 상태가 모바일 수집 게임 화면처럼 더 선명하게 구분되고 main CI가 통과함 |
| Phaser playfield visual-noise cleanup | done | Issue #101, PR #102, `items/0059-playfield-visual-noise-cleanup.md`, `src/game/playfield/GardenScene.ts` | locked plot 반복 텍스트/강한 선을 줄이고 main CI가 통과함 |
| Player/debug surface split | active | app shell/debug mode policy | `asset count`, `save ready`, `events`, `runtime image generation disabled`는 playable 기본 화면에서 숨겨지고 debug mode에서만 노출됨 |
| Mobile/desktop viewport policy | active | `docs/DESIGN_SYSTEM.md`, visual evidence | 모바일 세로 game frame과 데스크톱 중앙 game frame 기준으로 capture evidence가 남음 |
| Mobile tab screen architecture | done | Issue #95, PR #96, `items/0056-mobile-tab-screen-visual-regression.md`, `src/App.tsx`, `src/styles.css` | 모바일 non-garden 탭은 half overlay가 아니라 body scroll 없는 full tab screen으로 전환되고 main CI가 통과함 |
| Mobile game frame tab rework | done | Issue #104, PR #105, `items/0060-mobile-game-frame-tab-rework.md`, Playwright evidence | 모바일 탭 화면은 viewport 상단부터 bottom nav 위까지 고정되고 정원 HUD/playfield가 뒤에 비치거나 터치되지 않으며 main CI가 통과함 |
| Mobile garden HUD/action card polish | done | Issue #97, PR #98, `items/0057-mobile-garden-hud-polish.md`, visual evidence | 모바일 정원 기본 화면의 개발 라벨과 잘리는 설명을 제거하고 action card가 하단 nav에 가리지 않으며 main CI가 통과함 |
| Game Studio routing gate | active | `items/0079-game-studio-routing-gate.md`, `AGENTS.md`, `docs/PROJECT_COMMANDS.md`, seed command skills, GitHub templates, metadata checkers | 게임 기능/UI/에셋/QA issue가 `game-studio:game-studio`와 specialist route 없이 plan/PR로 진행되지 않음 |
| North Star production bar | done | Issue #142, `items/0081-north-star-production-bar.md`, `docs/NORTH_STAR.md`, `scripts/check-p0-game-ui-ux.mjs` | 경쟁작 기준 production idle loop가 최상위 헌장에 반영되고, 작은 기능 개선보다 vertical slice 기준으로 다음 issue를 선택함 |
| CLI visual QA gate | active | Playwright CLI, `tests/visual/p0-mobile-game-shell.spec.ts`, `docs/BROWSER_QA.md` | `npm run check:visual`이 mobile/desktop layout regression과 screenshot artifact를 운영 QA evidence로 검증함. CI required checks는 `npm run check:ci`로 분리됨 |
| Browser Use source-of-truth guard | done | Issue #175, `items/0098-browser-use-source-of-truth-guard.md`, `docs/BROWSER_QA.md`, `scripts/check-browser-qa.mjs` | UI/visual 작업에서 Browser Use `iab` QA와 현재 세션 blocker 없이 Playwright fallback만으로 완료하지 못하게 운영 지침과 checker가 강제하고 `npm run check:ci`가 통과함 |
| Asset alpha/background quality gate | active | asset checker, asset review follow-up | creature/seed/icon/fx는 alpha 필요 조건 또는 명시 예외를 검증하고, checkerboard/배경 오염 asset은 후속 cutout/remaster 대상으로 기록됨 |
| P0 PR evidence contract | active | PR template/control room/report links | UI 변경 PR마다 small win, viewport, screenshot, verification, 남은 리스크가 한 곳에 연결됨 |
| First harvest reveal reward polish | done | Issue #103, PR #108, `items/0062-harvest-reveal-polish.md`, visual evidence, main CI `25063830331` | 첫 수확 reveal이 일반 모달이 아니라 수집형 게임 보상 화면처럼 읽히고 CTA가 393/360에서 잘리지 않음 |
| Playfield tap/harvest feedback | done | Issue #109, PR #110, `items/0063-playfield-tap-harvest-feedback.md`, `reports/visual/p0-playfield-tap-harvest-feedback-20260429.md`, main CI `25066468406` | 성장 탭과 ready 수확 탭이 `qaFxTelemetry=1` Playwright gate와 mobile screenshot으로 즉시 피드백을 검증함 |
| Mobile tab card polish | done | Issue #111, PR #112, `items/0064-mobile-tab-card-polish.md`, `reports/visual/p0-mobile-tab-card-polish-20260429.md`, main CI `25067574458` | seeds/album 탭이 수집 게임 메뉴처럼 읽히고 full-screen tab regression이 유지됨 |
| Expedition/shop card polish | done | Issue #113, PR #114, `items/0065-expedition-shop-card-polish.md`, `reports/visual/p0-expedition-shop-card-polish-20260429.md`, main CI `25068421504` | expedition/shop 탭이 같은 게임 메뉴 카드 언어를 공유하고 mock shop safety를 유지함 |

Exit criteria: 위 항목이 모두 검증되고, CI required checks(`npm run check:ci`)와 운영 QA용 mobile/desktop visual evidence(`npm run check:visual`)가 최신 main에서 통과할 때 P0 UI/UX Rescue를 닫는다.

## Current Milestone

**Milestone 0: Planning and Autonomous Project Backbone**

Goal: make the project understandable to future agents, then produce enough asset and product scaffolding to start the Phase 0 MVP without re-planning.

| Step | Status | Output | Evidence |
| --- | --- | --- | --- |
| Define Phase 0 product contract | done | `docs/PRD_PHASE0.md` | Product flow, screens, analytics, acceptance criteria documented |
| Define Phase 0 economy contract | done | `docs/ECONOMY_PHASE0.md` | Seed table, currencies, formulas, tuning levers documented |
| Define autonomous operating model | done | `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md` | Intake/review/apply/verify/audit lanes documented |
| Create project-local asset skills | done | `.codex/skills/gpt-game-asset-*` | Four skill surfaces created |
| Create docs index and agent guide | done | `AGENTS.md`, `docs/README.md`, `docs/ROADMAP.md` | Current file |

## Milestone 0.1: Dual North Star + Split-Ready Strategy

Goal: make the game project and the agent-native studio/operator project explicit, while they still share one repository.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Define dual north star | review | `docs/NORTH_STAR.md`, `items/0018-dual-north-star-agent-studio.md` | Game north star and operator north star are written as separate but connected charters |
| Index north star for agents | review | `AGENTS.md`, `docs/README.md`, `scripts/check-docs-index.mjs` | Required reading order and docs index point to `docs/NORTH_STAR.md`; `npm run check:docs` validates it |
| Add split-ready milestone ladder | review | `docs/ROADMAP.md`, `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md` | Roadmap distinguishes Ralph-session operator, watchdog, queue, feedback/GTM, 24h operator, and future split |

## Next Milestone

**Milestone 1: Static Asset Pipeline Proof**

Goal: prove that Codex native image generation can repeatedly produce usable game assets and store them as project-local static files.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create first asset plan | done | `assets/source/asset_plan.json` | 20 planned assets with stable ids, categories, families, output paths; JSON parsed successfully |
| Create first prompt batch | done | `assets/source/asset_prompts.json` | 20 prompts created; all map to planned assets with acceptance checks |
| Generate first sample assets | done | `public/assets/game/**` | 20 generated assets saved in workspace, not only Codex cache; generation status recorded |
| Review generated assets | done | `reports/assets/asset_review_20260427.md` | 20 accepted, 0 rejected; follow-up optimization risks documented |
| Create asset manifest | done | `public/assets/manifest/assetManifest.json` | 20 accepted assets registered with path, category, family, rarity, dimensions |

## Milestone 2: Phase 0 Game Scaffold

Goal: create the playable browser foundation.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Choose frontend stack and scaffold app | done | Vite/React app | `npm run build` succeeds and app shell renders the garden screen |
| Add content config schemas | done | `src/data/*.json` | Seeds, creatures, growth curves, rewards, expeditions, missions, shop surfaces load from config |
| Add local persistence | done | `src/lib/persistence.ts` | Local save interface and first-save creation stub exist |
| Add asset manifest loading | done | `src/lib/assetManifest.ts` | UI renders static assets by manifest id |

## Milestone 3: First Playable Loop

Goal: implement the minimum game loop from first seed to first comeback.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Starter seed flow | done | Garden onboarding | Starter seed selection implemented in app state |
| Plant/grow/tap/harvest | done | Core garden loop | First seed growth is 30s; tap acceleration and harvest implemented |
| Album and first upgrade | done | Album + upgrade UI | First harvest + album reward can buy first upgrade |
| Expedition teaser | done | Expedition screen | First expedition duration is 5 minutes and can be started after discovery |
| Offline reward | done | Comeback reward modal | 15+ minute local comeback reward calculation implemented |
| Mission reward loop | review | `src/App.tsx`, `items/0011-mission-reward-loop.md` | First-loop actions advance missions and completed missions pay leaves once |
| Seed purchase loop | review | `src/App.tsx`, `items/0012-seed-purchase-loop.md` | Unlocked seeds can be bought into inventory, planted into open plots, and advance the buy-3 mission |
| Expedition reward loop | review | `src/App.tsx`, `items/0013-expedition-reward-loop.md` | Ready expeditions can be claimed for configured rewards and verified through Browser Use |
| Bottom tab surfaces | review | `src/App.tsx`, `items/0014-bottom-tab-surfaces.md` | Bottom tabs switch panel content for garden, seeds, album, expedition, and mock shop surfaces |

## Milestone 3.5: Design System + First 5 Minutes UX Rescue

Goal: improve the first 5 minutes without adding new game systems, while preserving the existing save/content/analytics contracts.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Devil's advocate UX review | review | `docs/UX_REVIEW_20260427.md` | Current UI risks are recorded by severity with allowed/forbidden change boundaries |
| Design system foundation | review | `docs/DESIGN_SYSTEM.md`, `items/0015-design-system-foundation.md` | Usage rules precede tokens; first-session loop, bottom tabs, mock shop safety, and Browser Use evidence requirements are explicit |
| Mobile HUD rescue implementation | review | `src/App.tsx`, `src/styles.css` | 360x800 garden viewport, 1280x900 desktop, 하단 5개 탭, 상점 CTA 안전성이 `reports/visual/design-system-*-20260427.*`로 검증됨 |
| Creature attachment copy v0 | review | `items/0024-creature-attachment-v0.md`, `src/data/creatures.json`, `src/App.tsx` | 첫 수확 reveal, 첫 생명체 카드, 도감 카드가 성격/취향/인사말을 노출하고 `npm run check:content`, `npm run check:loop`가 첫 생명체 애착 문구를 검증함 |
| Next creature goal card v0 | review | `src/App.tsx`, `src/styles.css`, `items/0031-next-creature-goal-card.md`, `reports/visual/next-creature-goal-mobile-20260428.png` | 첫 발견 이후 다음 미발견 deterministic creature 목표와 도감 진행도를 보여줘 collection desire를 강화함 |
| Seed creature preview v0 | review | `src/App.tsx`, `src/styles.css`, `items/0032-seed-creature-preview.md`, `reports/visual/seed-creature-preview-mobile-20260428.png` | 씨앗 구매/주머니 row가 `seed.creaturePool[0]`의 만날 아이와 발견 상태를 보여줘 선택 전 수집 기대를 강화함 |
| Harvest reveal next-goal teaser v0 | review | `src/App.tsx`, `src/styles.css`, `items/0033-harvest-reveal-next-goal.md`, `reports/visual/harvest-reveal-next-goal-mobile-20260428.png` | 첫 수확 reveal modal이 다음 목표 creature/seed hint를 보여줘 “하나만 더” 루프를 강화함 |
| Album locked slots and collection clues v0 | review | `src/App.tsx`, `src/styles.css`, `items/0036-album-locked-slots.md`, `reports/visual/album-locked-slots-mobile-20260428.png` | 도감이 발견 수/전체 수와 미발견 silhouette, rarity/family, source seed hint를 보여줘 남은 수집 목표를 강화함 |
| Album next-goal CTA v0 | review | `src/App.tsx`, `src/styles.css`, `items/0037-album-goal-cta.md`, `reports/visual/album-goal-cta-desktop-20260428.png` | 도감 다음 목표 카드가 관련 씨앗 행동 탭으로 이어져 수집 루프 마찰을 줄임 |
| Album mobile next-action chip v0 | review | `src/App.tsx`, `src/styles.css`, `items/0038-album-mobile-action-chip.md`, `reports/visual/album-mobile-action-chip-mobile-20260428.png` | 모바일 도감 상단에서 다음 발견 생명체/희귀도/씨앗 단서를 즉시 보여줘 수집 행동으로 이어지게 함 |
| Seed tab album target highlight v0 | review | `src/App.tsx`, `src/styles.css`, `items/0039-seed-tab-target-highlight.md`, `reports/visual/seed-tab-target-highlight-mobile-20260428.png` | 씨앗 탭에서 다음 도감 목표 씨앗과 해당 row를 강조해 CTA 이후 행동 마찰을 줄임 |
| Garden target seed action bridge v0 | review | `src/App.tsx`, `src/styles.css`, `items/0041-garden-target-seed-action.md`, `reports/visual/garden-target-seed-action-mobile-20260428.png` | 정원 seed shop에서도 다음 발견 seed row를 강조하고 씨앗 탭에서 정원 행동으로 돌아가게 함 |
| Seed purchase shortfall copy v0 | review | `src/App.tsx`, `src/styles.css`, `items/0042-seed-purchase-shortfall-copy.md`, `reports/visual/seed-purchase-shortfall-mobile-20260428.png` | 정원 seed shop에서 목표 씨앗을 살 잎이 부족할 때 부족분을 보여줘 다음 행동을 명확히 함 |
| Album progress tab badge v0 | review | `src/App.tsx`, `src/styles.css`, `items/0043-album-progress-tab-badge.md`, `reports/visual/album-progress-tab-badge-mobile-20260428.png` | 하단 도감 탭에 발견 수/전체 수 배지를 붙여 수집 진행률을 항상 보이게 함 |
| Garden next creature rarity cue v0 | review | `src/App.tsx`, `src/styles.css`, `items/0044-garden-next-creature-rarity-cue.md`, `reports/visual/garden-next-creature-rarity-cue-mobile-20260428.png` | 정원 다음 목표 카드에 희귀도·계열 단서를 붙여 수집 카드 감각을 강화함 |
| Seed growth and harvest summary v0 | review | `src/App.tsx`, `items/0045-seed-growth-harvest-summary.md`, `reports/visual/seed-growth-harvest-summary-mobile-20260428.png` | 씨앗 row에 성장 시간과 수확 잎 보상을 같이 보여 구매·심기 판단을 명확히 함 |
| Album reward milestone preview v0 | review | `src/App.tsx`, `src/styles.css`, `items/0046-album-reward-milestone-preview.md`, `reports/visual/album-reward-milestone-preview-mobile-20260428.png` | 도감 화면에 다음 milestone 보상과 남은 발견 수를 보여 수집 동기를 강화함 |
| Expedition reward preview v0 | review | `src/App.tsx`, `src/styles.css`, `items/0047-expedition-reward-preview.md`, `reports/visual/expedition-reward-preview-mobile-20260428.png` | 원정 탭에서 첫 원정의 시간·필요 생명체·보상을 보여 원정 루프 동기를 명확히 함 |
| Expedition unlock hint v0 | review | `src/App.tsx`, `src/styles.css`, `items/0048-expedition-unlock-hint.md`, `reports/visual/expedition-unlock-hint-mobile-20260428.png` | 원정 시작 전 필요한 생명체 수와 시작 가능 상태를 보여 첫 수확 후 원정 전환 마찰을 줄임 |
| Expedition progress hint v0 | review | `src/App.tsx`, `src/styles.css`, `items/0049-expedition-progress-hint.md`, `reports/visual/expedition-progress-hint-mobile-20260428.png` | 진행 중인 원정의 남은 시간과 완료 보상 상태를 보여 idle comeback 루프를 명확히 함 |
| Expedition tab status badge v0 | review | `src/App.tsx`, `items/0050-expedition-tab-status-badge.md`, `reports/visual/expedition-tab-status-badge-mobile-20260428.png` | 하단 원정 탭에 진행/완료 배지를 붙여 다른 탭에서도 복귀·수령 신호를 놓치지 않게 함 |

## Milestone 3.6: Phaser Playfield Runtime + Sprite Pipeline Spike

Goal: prove whether the garden must become a real 2D playfield, instead of continuing React DOM dashboard polish.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Game Studio structure review | done | `docs/GAME_STUDIO_REVIEW_20260427.md`, `.omx/specs/deep-interview-game-studio-realignment.md` | CSS-only polish limits, Phaser playfield boundary, and sprite state needs are recorded |
| Phaser central garden playfield transition | done | `items/0016-phaser-playfield-runtime-spike.md`, `src/game/playfield/GardenPlayfieldHost.tsx`, `src/game/playfield/GardenScene.ts`, `vite.config.ts`, `reports/visual/phaser-playfield-*-20260427.png` | React owns save/HUD/panels; Phaser owns central garden playfield; first loop preserves named creature ownership -> album reward -> second plot/next collection goal; Phaser runtime is lazy-loaded into a separate chunk |
| Phaser risk closure and PR readiness | review | `reports/audits/phaser_risk_resolution_20260427.md`, `reports/visual/phaser-browser-use-fallback-20260427.md` | Bundle warning, Browser Use fallback reason, and team shutdown risk are recorded before draft PR publication |
| Starter seed sprite-pipeline first batch | review | `items/0017-starter-seed-sprite-pipeline-first-batch.md`, `public/assets/game/sprites/starter/**`, `public/assets/game/fx/**`, `scripts/check-sprite-batch.mjs` | 6개 starter strip, manifest animation metadata, GardenScene spritesheet loader, sprite batch QA evidence가 `npm run check:all`에 포함됨 |
| Sprite state-to-animation mapping layer | review | `items/0027-sprite-animation-mapping-layer.md`, `public/assets/manifest/assetManifest.json`, `src/game/playfield/GardenScene.ts`, `scripts/check-sprite-batch.mjs` | `seedId + plot state + action` mapping이 manifest animation binding으로 이동하고 GardenScene hard-coded sprite key 회귀를 checker가 실패로 잡음 |
| Asset export and strip normalization path | review | `items/0028-asset-export-normalization-path.md`, `reports/assets/asset_export_normalization_20260428.md`, `assets/source/sprite_normalization_provenance.example.json`, `scripts/check-asset-normalization.mjs` | Codex native output -> workspace raw -> 96x96 normalized strip -> manifest -> checker 경로가 재현 가능하게 문서/검증됨 |

## Milestone 4: Economy and Verification

Goal: make the game measurable and tunable.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Economy simulator | done | `scripts/simulate-economy.mjs` | 1h/D1/D3/D7 projections exist and run with `npm run simulate:economy` |
| Analytics event log | done | `src/lib/analytics.ts` | Required first-loop events are tracked to localStorage |
| Acceptance test checklist | done | `docs/ACCEPTANCE_PHASE0.md` | PRD and economy criteria are listed with verification commands |
| Visual/mobile QA | done | `reports/visual/browser_use_qa_20260427.md` | Browser Use 오프라인 복귀 QA, 360px 모바일 캡처, 1280px 데스크톱 캡처까지 확인 |

## Milestone 5: Autonomous Project Management Scaffold

Goal: make the project increasingly self-managing.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create `items/` work records | done | `items/0001-pr-automation-trial.md` | 첫 자동화 작업이 item record로 표현되고 검증 기록이 남음 |
| Create PR verification scaffold | review | `.github/workflows/ci.yml`, `.github/workflows/agent-automerge.yml`, `docs/PR_AUTOMATION.md` | 로컬 검증 통과; GitHub Actions 실행 증거는 push/PR 이후 필요 |
| Create review report format | review | `docs/REPORTING.md`, `reports/reviews/README.md` | Agents can propose changes without applying them |
| Create apply conditions | review | `docs/APPLY_CONDITIONS.md`, `scripts/check-apply-conditions.mjs` | Mutations require valid proposal + acceptance criteria |
| Create audit report | review | `reports/audits/audit_20260427.md`, `scripts/check-docs-index.mjs` | Drift between docs, items, code, assets is detectable |
| Create dashboard | review | `docs/DASHBOARD.md`, `scripts/update-dashboard.mjs` | Current status, next item, verification health visible and checkable |
| Document automerge governance | review | `docs/AUTOMERGE_GOVERNANCE.md`, `scripts/check-governance.mjs` | Branch protection, required checks, and `ENABLE_AGENT_AUTOMERGE` operating rules are checkable |
| Accumulate PR automation audit | review | `reports/audits/pr_automation_20260427.md`, `scripts/check-audit-reports.mjs` | PR #1-#5 automation results are preserved and checkable |
| Audit Branch protection status | done | `reports/audits/branch_protection_20260427.md` | `main.protected=true`; required checks `Verify game baseline`, `Check automerge eligibility` are enforced |
| Generate PR automation audit | review | `scripts/update-pr-automation-audit.mjs`, `reports/audits/pr_automation_20260427.md` | PR automation audit can be regenerated from `gh pr list`; `check:audit` validates snapshot consistency instead of forcing endless self-refresh |
| Browser Use QA gate | review | `scripts/check-browser-qa.mjs`, `reports/visual/browser-use-main-20260427.png` | Browser Use first policy and visual evidence are checked by `npm run check:browser-qa` |
| Browser Use iab recovery diagnostic | review | `reports/visual/browser-use-iab-runtime-diagnostic-20260428.md`, `reports/visual/browser-use-iab-fallback-phaser-mobile-20260428.png`, `reports/visual/browser-use-iab-fallback-phaser-desktop-20260428.png` | Browser Use 직접 실행 차단 조건과 CDP fallback evidence가 Issue #18 기준으로 고정됨 |
| GitHub metadata quality guard | review | Issue #128, `items/0073-github-metadata-quality-guard.md`, `scripts/check-github-metadata-quality.mjs`, `.github` templates | PR/issue/comment가 rich evidence, 작업 checklist, Browser Use QA evidence 또는 blocker, `--body-file` 제출 규칙을 유지하고 literal `\n` 회귀를 막음 |

## Milestone 6: Ralph-Session Operating Company v0

Goal: before claiming overnight autonomy again, make a single `$ralph`/Codex session behave like a small operating company that can keep working, prove liveness, and recover from obvious stalls.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create operator work item schema | review | `items/0019-ralph-session-operating-company-v0.md`, `reports/operations/README.md` | Work items distinguish game feature, game content, agent ops, feedback, GTM mock, and safety-gated tasks |
| Add heartbeat ledger | review | `.omx/state/operator-heartbeat.json`, `reports/operations/operator-heartbeat-20260428.jsonl`, `scripts/write-operator-heartbeat.mjs` | A running session writes timestamp, phase, branch, PR, current command, and next action at least once per iteration |
| Add Ralph stuck report procedure | review | `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, `reports/operations/stuck-drill-20260428.md`, `scripts/report-operator-stuck.mjs` | `collab: Wait`, stale tmux, orphan process, red CI, and timeout states produce explicit reports instead of false completion |
| Add CI repair loop contract | review | `docs/PR_AUTOMATION.md`, `reports/operations/operator-loop-20260428.md` | PR checks are polled; red checks trigger log inspection, fix attempt, re-run, or blocker report |
| Add operator completion gate | review | `docs/PR_AUTOMATION.md`, `reports/operations/operator-completion-gate-20260428.md`, `items/0029-operator-completion-gate.md` | 작업 완료 선언 전 draft PR, 검증 명령, 남은 위험, follow-up issue/audit 링크가 필수 gate로 고정됨 |
| Prove one closed loop | done | Issue #25, PR #26, Issue #27, `reports/operations/operator-loop-20260428.md` | One issue/work item reached branch -> commit -> PR -> local checks -> GitHub checks -> follow-up issue/comment without main auto-merge |

## Milestone 7: Supervised Multi-Hour Operator

Goal: run for multiple hours under supervision with budget, safety gates, and restart behavior before attempting 24-hour operation.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Build watchdog runner | review | `scripts/operator-watchdog.mjs`, `reports/operations/watchdog-fresh-drill-20260428.md`, `reports/operations/watchdog-stale-drill-20260428.md` | Runner detects stale heartbeat and records a reportable state before supervised restart behavior |
| Add iteration budget and stop rules | review | `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`, `reports/operations/operator-trial-template-20260428.md` | Time, branch, risk, and network/credential stop conditions are explicit before long-running trials |
| Create supervised trial dry-run | review | `scripts/operator-trial-dry-run.mjs`, `reports/operations/operator-trial-dry-run-20260428.md` | Trial lifecycle report is generated from fixtures without real 2h/4h/24h execution |
| Add 2h supervised trial readiness gate | review | `reports/operations/operator-trial-readiness-20260428.md`, `scripts/check-operator-trial-readiness.mjs` | Time, token/context, branch, network, credential, heartbeat, CI, and automerge stop rules are checked before any real 2h run |
| Run 2-hour supervised trial | done | Issue #33, PR #50, `reports/operations/operator-trial-20260428T025400Z.md`, `items/0023-supervised-2h-operator-trial.md` | 24회 heartbeat, watchdog fresh, PR #35-#49 completed work, green CI, failures/recovery, stop rules가 기록됨 |
| Add live operator status report | review | `scripts/update-operator-live-status.mjs`, `reports/operations/operator-live-status-20260428.md`, `items/0040-operator-live-status-report.md` | Running trial의 heartbeat freshness, deadline, completed PRs, recovery, next action을 한 파일로 생성하고 `check:operator`가 검증함 |
| Run 4-hour supervised trial | review | `reports/operations/operator-trial-20260428T053230Z.md`, `items/0035-supervised-4h-operator-trial.md` | heartbeat 47건, merge된 PR 15개, green main CI, initial stuck report, final watchdog freshness, heartbeat gap warning이 기록됨 |
| Harden heartbeat daemon before 24h run | review | Issue #84, `scripts/operator-heartbeat-daemon.mjs`, `reports/operations/heartbeat-daemon-hardening-20260428.md`, `items/0051-heartbeat-daemon-hardening.md` | 독립 heartbeat daemon, stale-gap dry-run guard, watchdog stuck-output guard로 600초 초과 gap을 완료로 오인하지 않게 한다 |
| Add operator control room and playable mode | review | Issue #87, `docs/OPERATOR_CONTROL_ROOM.md`, `docs/PLAYABLE_MODE.md`, `.github/ISSUE_TEMPLATE/agent-work-item.md`, `.github/pull_request_template.md`, `scripts/prepare-playable-main.mjs`, `items/0052-operator-control-room-playable-mode.md` | 사람이 active mission, small win, visual evidence, PR/issue, playable main command를 한 화면에서 파악하고 agent 작업 중에도 게임을 실행할 수 있음 |
| Issue-level plan-first gate | done | Issue #106, PR #107, `items/0061-issue-plan-first-operating-rule.md`, operator docs/checker | 모든 issue/work-item 단위 작업은 개발 전에 `## Plan` artifact를 만들고 검증 계획을 기록해야 하며 main CI가 통과함 |
| Operator continuation watchdog | done | Issue #115, PR #116, `items/0066-operator-continuation-watchdog.md`, `reports/operations/operator-continuation-watchdog-20260429.md`, main CI `25085732384` | 완료 보고는 중단 조건이 아니라 체크포인트이며, 명시 중단/시간 상한/외부 승인/치명적 blocker가 없으면 다음 issue를 plan-first로 선택함 |
| Project command surface | done | Issue #117, `items/0067-project-command-surface.md`, `docs/PROJECT_COMMANDS.md`, `.codex/skills/seed-*` | `$seed-ops`, `$seed-brief`, `$seed-design`, `$seed-qa`, `$seed-play`로 운영 루프와 대화/보고/QA/playable 세션을 구분함 |

## Milestone 8: Feedback + GTM Mock Intake

Goal: make the operating company ingest player/customer/GTM signals safely before touching real external accounts.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create feedback intake format | review | `reports/playtests/README.md`, `reports/playtests/playtest-intake-sample-20260428.md`, `items/0025-feedback-intake-and-fun-rubric-v0.md` | Playtest/customer notes become normalized items with severity, product axis, evidence, duplicate links, and recommended next item |
| Add game fun rubric | review | `docs/NORTH_STAR.md`, `scripts/check-playtest-intake.mjs` | First 5 minutes, cuteness, collection desire, comeback hook, and confusion are scored consistently by `npm run check:playtest-intake` |
| Add GTM mock lane | review | `reports/gtm/README.md`, `reports/gtm/gtm-mock-sample-20260428.md`, `items/0026-gtm-mock-lane-v0.md` | Bot can draft devlog/release note/community post proposals without publishing or using credentials |
| Add approval gates for real channels | review | `docs/APPLY_CONDITIONS.md`, `scripts/check-gtm-mock.mjs` | Email/SNS/ads/store/community/payment/customer data actions require explicit human approval before real channel action |

## Milestone 9: 24-Hour Agent-Native Studio Prototype

Goal: only after Milestones 6-8 are proven, attempt a 24-hour bot that behaves like a cautious junior game studio operator.

| Step | Status | Output | Acceptance Criteria |
| --- | --- | --- | --- |
| Create 24h runbook | review | `docs/OPERATOR_RUNBOOK.md`, `items/0034-operator-runbook-daily-report.md` | Start, monitor, recover, stop, and summarize procedures are explicit |
| Add daily operating report | review | `reports/operations/daily-template-20260428.md`, `items/0034-operator-runbook-daily-report.md` | Human can wake up and see completed work, failed work, open PRs, red checks, decisions, and next queue |
| Run 24h dry run without external credentials | todo | `reports/operations/operator-24h-*.md` | No production side effects; heartbeat, CI repair, issue/PR loop, and escalation behavior are evidenced |
| Prepare split-ready operator package | todo | docs/scripts package plan | Operator surfaces that should move to a future separate repo are inventoried |

## Current Next Action

현재 운영모드는 **북극성 지속 운영 루프**다. P0가 끝나도 멈추지 않고 게임 북극성(첫 5분 귀여움/수집 욕구)과 운영사 북극성(issue intake -> plan -> 구현 -> 검증 -> PR -> CI 복구 -> follow-up evidence)을 향해 계속 진행한다. 완료 보고는 중단 조건이 아니라 체크포인트이며, 명시 중단/시간 상한/외부 승인/치명적 blocker가 없으면 다음 issue를 plan-first로 선택한다.

즉시 다음 작업:

1. 현재 P0.5 운영은 복귀 보상 -> 소비 -> 재심기 -> 다음 수집으로 이어지는 작은 vertical slice를 계속 닫는다.
2. 다음 `$seed-ops` issue는 열린 GitHub issue가 없으면 plan-first로 새 small win을 만들고, 게임 core/UI/visual QA를 한 PR에서 닫는다.
3. 우선순위는 첫 5분 귀여움/수집 욕구와 복귀 후 30초 안의 다음 행동을 직접 강화하는 작업이다.
4. 운영사 인프라는 CI/QA/상태 이해가 게임 개발을 막을 때만 우선한다.

## Previous Next Action History


`docs/NORTH_STAR.md`가 게임 프로젝트와 에이전트 네이티브 운영사 프로젝트의 공통 헌장으로 추가되었다. Issue #53의 4h supervised trial report와 Issue #84 heartbeat daemon hardening은 merge 완료되었다. 현재 안전한 다음 작업은 Issue #87의 operator control room + playable mode를 PR로 검증·merge해 사람이 자동화 중에도 현재 mission과 게임 실행 상태를 즉시 파악하게 하는 것이다.

1. Starter sprite batch evidence는 `items/0017-starter-seed-sprite-pipeline-first-batch.md`와 `scripts/check-sprite-batch.mjs`에 고정되어 있으며, 게임 작업은 계속 **이름 있는 생명체 수집**과 첫 5분 재미를 우선한다.
2. Issue #44 / PR #45는 첫 발견 이후 다음 미발견 deterministic creature 목표를 보여줘 “하나만 더” 수집 욕구를 강화했다.
3. Issue #46 / PR #47은 씨앗 구매/주머니 row에 `seed.creaturePool[0]`의 만날 아이 preview를 붙여 선택 전 수집 기대를 강화했다.
4. Issue #48 / PR #49는 merge 완료되어 첫 수확 reveal에서 다음 목표 creature/seed hint를 보여줘 “하나만 더” 루프를 강화한다.
5. 첫 loop는 starter seed -> plant -> tap growth -> harvest -> named creature ownership -> album reward -> second plot/next collection goal 순서를 보존한다.
6. Issue #25/PR #26, Issue #27/PR #28, Issue #29/PR #30, Issue #31/PR #32, Issue #33/PR #50으로 운영사 루프, watchdog, trial dry-run, readiness gate, 실제 2h trial report가 닫혔다.
7. Issue #34 / PR #35는 merge 완료되어 생명체의 성격/취향/인사말을 수확 reveal·소유 카드·도감에 노출한다.
8. Issue #36 / PR #37은 merge 완료되어 실제 고객 데이터나 외부 채널 없이 플레이테스트 신호를 severity/product axis/evidence/duplicate/fun rubric/next item으로 정규화한다.
9. Issue #38 / PR #39는 merge 완료되어 devlog/release note/community post를 mock proposal로만 남기고, SNS/email/ads/store/community 실채널 action은 명시 승인 전 금지한다.
10. Issue #21 / PR #40은 merge 완료되어 다음 sprite family/rarity batch를 위해 GardenScene hard-code를 manifest animation binding으로 이동했다.
11. Issue #22 / PR #41은 merge 완료되어 실제 생성 없이 Codex output -> workspace raw -> normalized strip -> manifest -> checker 경로를 고정했다.
12. Issue #17 / PR #42는 작업 완료 선언 전 draft PR, 검증 증거, 남은 위험, follow-up issue/audit 링크를 필수 gate로 고정했다.
13. Issue #18 / PR #43은 Browser Use `iab` 직접 검증의 현재 환경 차단 원인과 CDP fallback evidence를 검증 가능한 상태로 고정했다.
14. 24시간 봇, 고객 피드백 실채널, GTM 실게시, 광고/결제/계정/credential 사용은 Milestone 6-8의 안전 장치와 명시 승인이 생기기 전까지 금지한다.
15. 실제 결제, 로그인/account, ads SDK, external navigation, runtime image generation은 계속 제외한다.
16. Issue #51은 4h/24h 운영 전에 필요한 operator runbook과 daily operating report 템플릿을 만드는 작업이며, 실제 4h/24h 실행은 이 문서/checker PR이 merge되기 전 시작하지 않는다.
17. Issue #53의 4h supervised trial은 PR #85로 보고서가 merge되어 닫혔고, Issue #84가 24h run 전 heartbeat gap 보강 follow-up으로 열렸다.
18. Issue #56은 도감 다음 목표 카드에서 씨앗 탭으로 이어지는 CTA를 추가해 Issue #54의 미발견 슬롯 단서를 실제 다음 행동으로 연결한다.
19. Issue #58은 모바일 도감 첫 화면에서도 다음 발견 생명체와 씨앗 행동이 보이도록 상단 compact CTA chip을 추가한다.
20. Issue #60은 도감 CTA 이후 씨앗 탭에서 다음 도감 목표 씨앗과 해당 row를 강조해 구매/심기 행동 전환을 돕는다.
21. Issue #62는 장시간 운영 중 사람이 돌아왔을 때 heartbeat, deadline, 완료 PR, recovery, next action을 한 파일에서 읽을 수 있게 live status report를 생성한다.
22. Issue #64 / PR #65는 merge 완료되어 실제 구매/심기 버튼이 있는 정원 seed shop에서도 다음 발견 seed row를 강조하고, 씨앗 탭 목표 배너에서 정원 행동으로 돌아가게 한다.
23. Issue #66 / PR #67은 merge 완료되어 목표 seed row가 보이지만 잎이 부족한 순간 `n 잎 부족`/`n 잎 더 모으면 구매 가능` copy로 다음 행동을 명확히 한다.
24. Issue #68 / PR #69는 merge 완료되어 하단 `도감` 탭에 발견 수/전체 수 배지를 붙여 어느 화면에서도 수집 진행률을 의식하게 한다.
25. Issue #70 / PR #71은 merge 완료되어 정원 `다음에 만날 아이` 카드에 희귀도·계열 단서를 붙여 수집 카드 감각을 강화한다.
26. Issue #72 / PR #73은 merge 완료되어 seed shop/씨앗 주머니 row에 성장 시간과 수확 잎 보상 요약을 붙여 구매·심기 판단을 명확히 한다.
27. Issue #74 / PR #75는 merge 완료되어 도감 화면에 다음 album milestone 보상과 남은 발견 수를 보여 수집 동기를 강화한다.
28. Issue #76 / PR #77은 merge 완료되어 원정 탭에서 첫 원정의 시간·필요 생명체·보상 요약을 보여 원정 루프 동기를 명확히 한다.
29. Issue #78 / PR #79는 merge 완료되어 원정 시작 전 필요한 생명체 수와 시작 가능 상태를 보여 첫 수확 후 원정 전환 마찰을 줄인다.
30. Issue #80 / PR #81은 merge 완료되어 진행 중인 원정의 남은 시간과 완료 보상 상태를 보여 idle comeback 루프를 명확히 한다.
31. Issue #82 / PR #83은 merge 완료되어 하단 원정 탭에 진행/완료 배지를 붙여 다른 탭에서도 복귀·수령 신호를 놓치지 않게 한다.
32. Issue #53의 4h supervised trial report는 `reports/operations/operator-trial-20260428T053230Z.md`로 작성되었고, PR #85로 merge되어 닫혔다.
33. Issue #84는 24h run 전 heartbeat daemon hardening 작업으로, 4h trial에서 드러난 702.5초 gap을 dry-run failure와 watchdog stuck report로 고정한다.
34. Issue #87은 24h dry run 전 operator control room과 playable mode를 고정해 사람이 중간에 현재 mission, small win, evidence, 게임 실행법을 즉시 파악하게 한다.
