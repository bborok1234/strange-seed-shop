## 요약

정원 첫 화면에 `생산 / 보관 / 납품` 3축이 한 줄로 읽히는 production graph를 추가하고, 첫 병목을 `보관 부족`으로 고정했습니다. 자동 생산에는 초기 보관 cap을 두고, `보관 바구니` upgrade가 보관 12 -> 24 수치와 화면 prop 변화로 이어지게 했습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 플레이어가 첫 production 화면에서 `분당 7.2 잎 · 보관 부족 · 주문 0/12`를 보고 왜 `보관 바구니`를 눌러야 하는지 이해할 수 있습니다.

## Plan-first evidence

- Plan artifact: `items/0221-bottleneck-readable-production-graph.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. #413 모모 sprite strip은 readiness gate와 충돌해 defer/close했고 #416을 새 WorkUnit으로 생성했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: first actionable screen, persistent HUD one-line summary, playfield obstruction 방지, action card detail, scripted screenshot evidence
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음

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

- 게임 가치: idle game의 핵심인 병목 해석과 upgrade 선택이 화면 안에서 연결됩니다.
- 운영사 가치: `docs/PRODUCTION_SLICE_READINESS.md`의 blocking gate를 실제 코드, QA, GitHub issue evidence로 연결했습니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/issue-416-bottleneck-production-graph/before-storage-393.png`
- After: `reports/visual/issue-416-bottleneck-production-graph/after-storage-393.png`
- Browser Use evidence 또는 blocker: `reports/visual/issue-416-bottleneck-production-graph/visual-report-20260506.md`
- N/A 사유: Browser Use `iab` backend가 발견되지 않아 Playwright fallback screenshot을 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: save migration은 backward-compatible normalize field 추가이며, desktop은 기존 mobile game frame 정책을 유지합니다.

## 검증

- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS
- [x] `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "병목|자동 생산과 첫 주문"` PASS
- [x] `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts` PASS
- [x] `npm run build` PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

초기 보관 cap은 production graph 가독성을 위한 P0.5 계약으로 추가했습니다. 이후 경제 밸런스가 바뀌면 `storageBasketLevel`, summary 문구, QA 수치를 함께 조정해야 합니다.

## 연결된 issue

Closes #416
