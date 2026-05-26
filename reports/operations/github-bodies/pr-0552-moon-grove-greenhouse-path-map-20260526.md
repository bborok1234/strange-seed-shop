## 요약

미루 연구 handoff 이후 연구 선반에서 `숲길 지도 펼치기` action을 열고, action 후 `research_moon_grove_path -> route_moon_grove_greenhouse_path -> source_mist_greenhouse_silhouette` 3-node clue map을 HUD/playfield/telemetry에 남깁니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `온실 숲길 단서`가 receipt 문구에서 끝나지 않고 플레이어가 직접 펼치는 research map screen moment로 바뀝니다.

## Plan-first evidence

- Plan artifact: `items/0292-moon-grove-greenhouse-path-map.md`
- Plan에서 벗어난 변경이 있다면 이유: `fx_research_clue_glimmer_strip_v1.png` workspace PNG가 없었고 `OPENAI_API_KEY`가 없어 새 gpt-image-2 생성이 불가능했습니다. runtime texture contract를 깨지 않기 위해 accepted gpt-image-2 provenance가 있는 기존 `fx_moon_grove_discovery_bloom_strip_v1.png`를 strict 8x96x96 derivative로 복제했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 연구 선반 playfield state, 낮은 persistent HUD 밀도, action rail overflow 방지, 393px screenshot fallback evidence.
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

- 게임 가치: rare creature 연구 결과가 다음 숲길/물안개 목표로 이어지는 장기 메타를 화면에서 확인하게 합니다.
- 운영사 가치: clue map state/action/FX/telemetry/screenshot을 deterministic checker로 고정해 다음 production vertical slice가 같은 route state 위에서 이어질 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/issue-0552-moon-grove-greenhouse-path-map/phaser-check-moon-grove-miru-research-handoff-393.png`
- After: `reports/visual/issue-0552-moon-grove-greenhouse-path-map/phaser-check-moon-grove-clue-map-opened-393.png`
- Browser Use evidence 또는 blocker: `reports/visual/issue-0552-moon-grove-greenhouse-path-map/browser-use-blocker-20260526.md`
- N/A 사유: 해당 없음. UI/gameplay visual 변경입니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch의 Phaser runtime slice만 바꾸며, playable main worktree 정책과 port 5174 계약은 변경하지 않습니다.

## 검증

- [x] `npm run check:phaser` PASS
- [x] `npm run check:asset-provenance` PASS
- [x] `npm run check:asset-style` PASS
- [x] `git diff --check` PASS
- [x] `npm run check:ci` PASS
- [x] `npm run check:dashboard && npm run check:ops-live` PASS after heartbeat/doc updates
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- 전용 clue glimmer art는 아직 독립 생성/review가 아닙니다. 이번 PR은 accepted gpt-image-2 provenance strip derivative로 runtime texture contract를 닫고, dedicated clue glimmer generation/review는 후속 후보로 남깁니다.
- Browser Use tool surface가 이번 세션에도 노출되지 않아 hands-on Browser Use evidence 대신 blocker + Playwright/checker screenshot fallback을 사용했습니다.

## 연결된 issue

Closes #552
