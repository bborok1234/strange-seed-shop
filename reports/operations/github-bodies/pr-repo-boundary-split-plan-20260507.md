## 요약

Phaser Stage 1 구현 전에 필요한 `Legacy React app / Phaser / Studio code and source-of-truth boundary split` WorkUnit을 등록했습니다. Issue #436, plan artifact, roadmap next action, heartbeat/control room을 #436 기준으로 정렬했습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: #433 구현 전에 기존 React playable 코드와 문서가 신규 Phaser active lane과 다시 섞이지 않도록 선행 WorkUnit을 만들었습니다.

## Plan-first evidence

- Plan artifact: `items/0232-repo-boundary-split.md`
- Plan에서 벗어난 변경이 있다면 이유: N/A — 이번 PR은 boundary split 구현 전 plan/issue 등록입니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 신규 Phaser WorkUnit이 root 기존 React 앱 코드나 legacy docs/reports를 active spec으로 오인하지 않도록 app/source ownership을 분리하는 운영/아키텍처 gate입니다.
- Game Studio route에서 벗어난 변경이 있다면 이유: N/A

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [ ] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다. N/A — 문서/운영 boundary plan 등록이며 화면 변경 없음.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: #433이 기존 React/CSS rescue 기준에 끌려가지 않고 Phaser-first 정원 scene으로 시작할 수 있게 합니다.
- 운영사 가치: Studio가 어떤 코드 lane과 문서를 active source로 읽어야 하는지 명확히 하는 선행 WorkUnit을 만들었습니다.

## Before / After 또는 Visual evidence

- Before: 기존 React game code가 root active app으로 남아 있고, legacy game docs, Phaser spec, Studio docs가 top-level에서 섞여 있음.
- After: #436이 #433의 선행 code+docs boundary split WorkUnit으로 등록됨.
- Browser Use evidence 또는 blocker: N/A — 화면 변경 없음.
- N/A 사유: 실제 boundary split 구현 후에도 화면 변경은 없고, #433 구현에서 Browser Use evidence를 남깁니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: 이번 PR은 plan/issue 등록이며 runtime code를 변경하지 않습니다. #436 구현에서는 기존 playable을 `apps/legacy-react-playable/` 같은 legacy lane에서 계속 실행 가능하게 유지해야 합니다.

## 검증

- [x] `npm run check:docs` PASS
- [x] `npm run check:dashboard` PASS
- [x] `npm run check:github-metadata` PASS
- [x] `npm run check:ops-live` PASS
- [x] `npm run check:ci` PASS
- [ ] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS
  - N/A — 구현/화면 변경 없음.

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

#436 구현에서 실제 코드/문서 이동을 너무 크게 하면 과거 PR/evidence 링크나 CI script가 깨질 수 있습니다. 그래서 plan은 migration map, legacy playable 실행 보존, root entrypoint 모호성 제거를 수용 기준으로 포함했습니다.

## 연결된 issue

Refs #436
Blocks #433
