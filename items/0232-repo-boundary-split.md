# 0232 Legacy React app / Phaser / Studio code and source-of-truth boundary split

## Problem

Phaser greenfield 방향을 결정했지만, 기존 게임 코드와 기존 P0/P0.5 설계 문서가 여전히 같은 top-level source-of-truth 표면에 있다. 현재 root `src/`, `index.html`, `vite.config.ts`, `package.json`의 기본 `dev/build` 경로는 기존 React playable을 active game처럼 보이게 한다. 이 상태에서 Issue #433을 바로 시작하면 다음 Studio 작업자가 기존 React/CSS 앱 구조와 `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, 기존 `items/02xx`, 기존 `reports/visual`을 active Phaser spec으로 오인할 수 있다.

반대로 문서만 분리하고 기존 React 코드가 root active app으로 남아도 같은 문제가 반복된다. 기존 React/CSS 정원 개선 루프와 Phaser greenfield 루프를 끊으려면 **코드 entrypoint, 문서, 이슈, asset, evidence 소유권을 함께 분리**해야 한다.

## Goal

Issue #433 구현 전에 repo의 ownership boundary를 명시적으로 나눈다.

1. 기존 React playable 코드는 root active app에서 내려 `apps/legacy-react-playable/` 같은 명시적 legacy app으로 격리한다.
2. 신규 Phaser game은 `apps/seed-garden-phaser/` 별도 active lane으로 분류한다.
3. Studio/operator 문서는 게임별 구현 spec이 아니라 cross-game 운영 계층으로 분류한다.
4. 다음 Studio WorkUnit이 legacy 코드/문서를 active Phaser spec으로 오인하지 않도록 package scripts, README, roadmap, checker에 guard를 추가한다.

## Game Studio Route

- `game-studio:game-studio`: greenfield game lane과 legacy reference lane을 분리한다.
- `game-studio:web-game-foundations`: app/runtime/source ownership boundary와 root entrypoint 정책을 정의한다.
- `game-studio:game-playtest`: evidence/report 경로가 legacy와 phaser를 구분하도록 만든다.

## Player Verb

N/A — 직접 gameplay 구현이 아니라, 다음 gameplay WorkUnit이 올바른 app entrypoint와 source-of-truth에서 시작하게 하는 운영/아키텍처 작업이다.

## Production / Progression Role

Issue #433의 Stage 1 구현이 기존 앱 visual spec에 끌려가지 않고, Phaser-first 정원 scene으로 진행되게 하는 blocker 제거다.

## Screen Moment

N/A — 기존 playable의 기능 변경은 없다. 다만 #436 구현 후 기존 앱은 legacy 경로에서 실행되고, Issue #433 이후 Browser Use evidence는 `reports/phaser/` 또는 `reports/visual/phaser-*`로 분리되어야 한다.

## Proposed Boundary

### Top-level

| Path | Role | Rule |
| --- | --- | --- |
| `package.json` | workspace/orchestrator scripts | 기본 script가 어떤 app을 띄우는지 모호하면 실패. `dev:legacy`, `build:legacy`, `dev:phaser`, `build:phaser`처럼 lane을 명시한다 |
| `src/`, `index.html`, `vite.config.ts` | 기존 active React app entrypoint | #436 구현 후 root active game entrypoint로 남기지 않는다. legacy app 경로로 이동하거나 root에서 명시적 launcher만 둔다 |
| `docs/NORTH_STAR.md` | 전체 Studio/game north star | 유지 |
| `docs/README.md` | source ownership index | legacy/phaser/studio routing table 추가 |
| `docs/ROADMAP.md` | active lane pointer | Current Next Action은 boundary split -> Phaser Stage 1 순서로 유지 |
| `docs/PROJECT_COMMANDS.md` | operator command contract | 유지 |

### Legacy lane

| Candidate path | Role |
| --- | --- |
| `apps/legacy-react-playable/` | 현재 root React/Vite playable의 새 home. 기존 `src/`, `index.html`, React/Vite config, legacy-specific tests/config가 이 lane으로 이동한다 |
| `apps/legacy-react-playable/README.md` | 이 앱이 active Phaser game이 아니라 reference/playable baseline임을 명시한다 |
| `docs/legacy/README.md` | 기존 React playable reference index |
| `docs/legacy/` 또는 `docs/archive/legacy-react-playable/` | 기존 P0/P0.5 UI/HUD/production rescue 문서의 reference home |
| `items/legacy/` 또는 기존 `items/02xx`에 legacy badge | 기존 React app work history |
| `reports/legacy/` 또는 기존 reports 유지 + README routing | 기존 visual/evidence history |
| `public/assets/game/` | legacy와 Phaser가 공유할 수 있는 accepted asset pool. app별 runtime binding은 lane별 manifest/README로 구분한다 |

### Phaser lane

| Candidate path | Role |
| --- | --- |
| `apps/seed-garden-phaser/` | 신규 Phaser app code |
| `apps/seed-garden-phaser/README.md` | 낮은 관리 카메라, 감상 모드, actor care loop, asset/sprite pipeline의 active app contract |
| `docs/phaser/README.md` | Phaser game source-of-truth index |
| `docs/phaser/VISION.md` | Phaser slice fantasy/camera/player verb |
| `docs/phaser/VERTICAL_SLICE_SPEC.md` | Stage 1/2/3 active spec, 현재 `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`의 future home |
| `docs/phaser/ASSET_SPEC.md` | Phaser asset ids, provenance, generation rules |
| `items/phaser/` | 신규 Phaser WorkUnit home 또는 migration target |
| `reports/phaser/` | Browser Use, playtest, asset review evidence |
| `assets/phaser/` 또는 `public/assets/phaser/` | Phaser source/runtime assets |

### Studio/operator lane

| Path | Role |
| --- | --- |
| `.codex/skills/studio-*` | operator workflows |
| `docs/studio/` | deliberation/user preference/handoff |
| `reports/operations/` | heartbeat, GitHub body, run evidence |
| `scripts/studio-*`, `scripts/check-*` | harness/checker |

## Plan

1. 현재 root active app inventory를 만든다: `src/`, `index.html`, `vite.config.ts`, legacy React/Vite tests, visual reports, scripts가 어떤 app에 묶여 있는지 표로 정리한다.
2. `apps/legacy-react-playable/`를 만들고 현재 React/Vite playable 코드를 그 아래로 이동한다. 기존 플레이어 확인 경로는 `npm run dev:legacy` 또는 `npm run play:main`으로 유지한다.
3. root `package.json` scripts를 lane-aware로 바꾼다. 최소 `dev:legacy`, `build:legacy`, `dev:phaser`, `build:phaser`, `check:legacy`, `check:phaser` 정책을 명시한다. root `dev`가 남는다면 active lane을 문서와 script 이름으로 분명히 해야 한다.
4. `apps/seed-garden-phaser/`를 만들고 Stage 1 구현이 들어갈 빈 Phaser app boundary를 준비한다. #436에서는 placeholder/README/scaffold까지만 허용하고, 실제 gameplay 구현은 #433으로 남긴다.
5. `docs/README.md`에 `Source Ownership Boundary` 섹션을 추가한다.
6. `apps/legacy-react-playable/README.md`, `docs/legacy/README.md`를 만들고 기존 React playable 코드와 문서가 reference/legacy임을 명시한다.
7. `apps/seed-garden-phaser/README.md`, `docs/phaser/README.md`를 만들고 Phaser active source-of-truth를 고정한다.
8. `docs/PHASER_GREENFIELD_VERTICAL_SLICE_SPEC.md`의 future home 또는 active alias를 결정한다.
9. 기존 `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, `docs/IDLE_CORE_PRODUCTION_SPEC.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`에 `legacy/reference unless explicitly imported by docs/phaser/*` 배지를 추가하거나 `docs/legacy/README.md`에서 명확히 분류한다.
10. `docs/ROADMAP.md` Current Next Action을 Issue #436 boundary split으로 갱신하고, #433은 `blocked until boundary split lands`로 표시한다.
11. `scripts/check-*` 중 적절한 곳에 최소 guard를 추가한다. 예: active Phaser WorkUnit이 root `src/` 또는 legacy docs만 source로 삼고 `apps/seed-garden-phaser/` / `docs/phaser/*`를 참조하지 않으면 실패.
12. 기존 issue body/report template에 Phaser lane이면 `apps/seed-garden-phaser/README.md`와 `docs/phaser/README.md` 또는 `docs/phaser/VERTICAL_SLICE_SPEC.md` 참조를 요구한다.
13. Browser Use evidence 경로 정책을 정한다: 신규 Phaser 구현 evidence는 `reports/phaser/issue-####-*`를 기본으로 한다.

## Acceptance Criteria

- `docs/README.md`에서 legacy/phaser/studio ownership이 한눈에 구분된다.
- 기존 React playable 코드가 root active app으로 남지 않고 `apps/legacy-react-playable/` 같은 명시적 legacy lane으로 격리된다.
- root `package.json` scripts가 legacy와 Phaser를 이름으로 구분한다. `npm run dev` 또는 `npm run build`가 남아 있다면 어떤 lane을 대상으로 하는지 README와 script 이름에서 오해가 없어야 한다.
- 기존 playable은 legacy 경로에서 계속 실행/빌드/검증된다.
- `apps/seed-garden-phaser/`가 존재하고 #433 Stage 1 구현을 받을 active app boundary를 제공한다.
- `apps/legacy-react-playable/README.md`가 존재하고 기존 React playable이 reference baseline임을 명시한다.
- `apps/seed-garden-phaser/README.md`가 존재하고 신규 Phaser game의 active runtime boundary를 명시한다.
- `docs/phaser/README.md`가 존재하고, 신규 Phaser WorkUnit의 active source-of-truth를 명시한다.
- `docs/legacy/README.md`가 존재하고, 기존 React playable/P0/P0.5 문서를 reference로 분류한다.
- `docs/ROADMAP.md`에서 Issue #433보다 이 boundary split이 먼저 실행되어야 함이 명확하다.
- Issue #433은 boundary split 완료 전 구현 시작 금지 또는 blocked 상태로 읽힌다.
- checker 또는 문서 gate가 “Phaser WorkUnit이 root legacy 코드나 legacy 문서만 읽고 active spec으로 착각하는” 회귀를 막는다.
- `npm run check:docs`, `npm run check:dashboard`, `npm run check:ci`가 통과한다.

## Verification Commands

- `npm run check:docs`
- `npm run check:dashboard`
- `npm run check:github-metadata`
- `npm run check:ci`

## Risks

- 실제 코드/문서 파일 이동을 너무 크게 하면 과거 PR/evidence 링크나 기존 CI script가 깨질 수 있다. #436 구현은 migration map을 먼저 쓰고, legacy playable이 계속 실행되는지 검증해야 한다.
- 기존 문서를 전부 archive로 보내면 Phaser가 참고해야 할 경제/asset/provenance 지식까지 잃을 수 있다. 따라서 `legacy/reference`는 금지가 아니라 명시적 import가 필요하다는 의미다.
- root package를 너무 빨리 Phaser 전용으로 바꾸면 기존 `play:main`과 baseline checks가 깨질 수 있다. legacy scripts를 먼저 살리고, Phaser scripts를 별도 이름으로 추가한다.

## Stop / Blocker Boundaries

- 기존 React 앱 코드를 삭제하지 않는다. 이동/격리만 허용한다.
- 기존 playable이 legacy lane에서 실행되지 않으면 #436은 완료할 수 없다.
- 대량 파일 이동으로 GitHub history/evidence 링크가 깨질 위험이 있으면 멈추고 migration map을 먼저 만든다.
- Issue #433 구현은 이 boundary split이 merge되기 전 시작하지 않는다.

## Evidence

- GitHub issue: https://github.com/bborok1234/strange-seed-shop/issues/436
- Branch: `codex/legacy-react-phaser-boundary`
- Legacy app: `apps/legacy-react-playable/`
- Phaser app: `apps/seed-garden-phaser/`
- Browser Use smoke: `reports/visual/issue-0436-boundary-split/browser-use-smoke-20260507.md`
- PR: https://github.com/bborok1234/strange-seed-shop/pull/438

## Implementation Notes

- 기존 root `src/`, `index.html`, `vite.config.ts`를 `apps/legacy-react-playable/`로 이동했다.
- `dev:legacy`, `build:legacy`, `check:legacy`, `dev:phaser`, `build:phaser`, `check:phaser` scripts를 추가했다.
- root `dev`/`preview`는 사람 플레이 호환성을 위해 legacy app alias로 유지했다.
- `apps/seed-garden-phaser/`에는 #433 구현 전용 Phaser scaffold만 만들었다. 실제 낮은 관리 카메라/actor gameplay 구현은 #433 범위로 남겼다.
- `docs/phaser/README.md`, `docs/phaser/VERTICAL_SLICE_SPEC.md`, `docs/legacy/README.md`, `apps/*/README.md`로 source ownership을 분리했다.
- `scripts/check-app-boundaries.mjs`로 root legacy entrypoint 재발생과 script/source ownership 회귀를 막는다.

## Verification Evidence

- `npm run check:app-boundaries` — pass
- `npm run check:content` — pass
- `npm run check:loop` — pass
- `npm run simulate:economy` — pass
- `npm run build:legacy` — pass
- `npm run build:phaser` — pass
- `npm run check:docs` — pass
- `npm run check:dashboard` — pass
- `npm run check:ops-live` — pass
- `npm run check:github-metadata` — pass
- `npm run check:ci` — pass
- `npm run check:art-share` — 17 passed
- Browser Use `iab` legacy smoke — `말랑잎 씨앗 무료로 심기` button count 1
- Browser Use `iab` Phaser smoke — canvas count 1
