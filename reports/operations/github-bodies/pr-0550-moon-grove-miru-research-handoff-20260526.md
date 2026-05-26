## 요약

월정 숲 수확 후 `새벽이끼 미루`를 연구 선반에 맡기는 Phaser action을 추가했습니다. Handoff가 완료되면 미루가 `researcher` actor로 연구 선반에 anchor되고, `research_moon_grove_path`와 `route_moon_grove_greenhouse_path` preview가 HUD/playfield/telemetry에 남습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: rare creature가 보상 이미지에서 끝나지 않고 다음 연구/숲길 progression을 여는 actor로 작동합니다.

## Plan-first evidence

- Plan artifact: `items/0291-moon-grove-miru-research-handoff.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. Phaser state/action/render/checker와 운영/시각 evidence 범위로 유지했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 연구 선반 action affordance, persistent HUD surface 밀도, bottom-tab overlap 없는 393px screenshot, actor telemetry, action 전후 state assertion.
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

- 게임 가치: 플레이어가 `월정 숲 새벽이끼`를 얻은 뒤 `미루 연구 맡기기`로 다음 온실 숲길 단서를 열어 named creature의 역할 payoff를 즉시 이해합니다.
- 운영사 가치: rare discovery 이후 progression handoff를 state, telemetry, deterministic checker, visual evidence로 추적할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/issue-0550-moon-grove-miru-research-handoff/phaser-check-moon-grove-miru-research-ready-393.png`
- After: `reports/visual/issue-0550-moon-grove-miru-research-handoff/phaser-check-moon-grove-miru-research-handoff-393.png`
- Browser Use evidence 또는 blocker: `reports/visual/issue-0550-moon-grove-miru-research-handoff/browser-use-blocker-20260526.md`
- N/A 사유: 해당 없음. UI/HUD/playfield 변경이며 Playwright fallback screenshot과 blocker를 함께 남겼습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch의 Phaser runtime state/action 추가이며 playable main worktree 정책과 port 5174 계약은 변경하지 않습니다. `npm run check:control-room`의 playable main check가 통과했습니다.

## 검증

- [x] `npm run build:phaser` PASS
- [x] `npm run check:phaser` PASS
- [x] `npm run check:asset-provenance` PASS
- [x] `npm run check:asset-style` PASS
- [x] `git diff --check` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- Browser Use namespace가 이번 Codex 세션에서 노출되지 않아 hands-on Browser Use 대신 blocker와 Playwright fallback screenshot evidence로 검증했습니다.
- 이번 slice는 새 asset 생성이 아니라 기존 accepted 미루 work strip과 discovery bloom을 재사용합니다. 전용 연구 노트 FX가 필요하면 후속 issue에서 plan-prompt-generate-review로 분리합니다.

## 연결된 issue

Closes #550
