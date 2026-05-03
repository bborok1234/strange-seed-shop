## 요약

#326 라미 수확 reveal을 도감에 저장한 뒤 다음 기록 목표가 `젤리콩 씨앗 → 포장잎 상인`으로 이어지도록 고쳤습니다. 핵심 수정은 harvest reveal이 실제로 보여준 생명체 id를 discovered list에 저장하는 것으로, `방울새싹 씨앗`의 첫 pool 생명체로 저장이 되돌아가 next target이 멈추던 문제를 막습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `이슬연금 라미`를 저장하자마자 `포장잎 상인`이라는 다음 named target과 `젤리콩 씨앗` source CTA가 보여 “하나만 더” 수집 루프가 계속됩니다.

## Plan-first evidence

- Plan artifact: `items/0165-rami-record-next-merchant-goal.md`
- Plan에서 벗어난 변경이 있다면 이유: 신규 manifest asset/FX 없이 state 저장 버그와 visual regression으로 닫았습니다. 테스트 안정화를 위해 긴 성장/수확 루프가 이미 reveal에 도달한 상태를 완료로 인식하는 헬퍼를 추가했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 라미 reveal → 도감 저장 → album next goal CTA → seeds target row 재진입, mobile 393px bottom-tab/overflow invariant, screenshot evidence.
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

- 게임 가치: 라미 저장 이후에도 다음 수집 목표가 사라지지 않아 collection idle loop의 신뢰와 반복 동기가 유지됩니다.
- 운영사 가치: #322/#324로 만든 unlocked seed pool 재순환을 세 번째 named target까지 GitHub-authoritative evidence로 고정합니다.

## Before / After 또는 Visual evidence

- Before: `이슬연금 라미` reveal은 보였지만, 저장 시 discovered list가 seed pool 첫 번째 생명체로 회귀해 다음 목표가 `포장잎 상인`으로 안정적으로 넘어가는 evidence가 없었습니다.
- After: 라미 저장 직후 album card가 `후속 기록 저장`, `이슬연금 라미`, `다음 기록 목표: 포장잎 상인`을 보여주고, `다음 기록으로 이어가기: 젤리콩 씨앗` CTA가 seeds target row로 이어집니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0326-20260503.md` — 현재 Codex 세션 iab backend discovery 실패.
- Screenshot: `reports/visual/issue-326-rami-record-next-merchant-goal-393.png`
- N/A 사유: Browser Use screenshot은 세션 backend blocker로 확보하지 못해 Playwright screenshot을 regression evidence로 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch game-state/test/evidence 변경만 포함하며 stable main playable worktree와 port 5174 계약을 변경하지 않습니다.

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 도감 기록|라미 도감 저장|새 기록 후속 수확은 예고했던"` — 3 passed
- [x] `npx playwright test --config playwright.config.ts --grep "새 기록 후속 저장은 다음 기록 목표 재순환"` — 1 passed
- [x] `npm run check:visual` — 66 passed
- [x] `npm run check:ci` — pass
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- Runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음.

## 남은 위험

- Browser Use iab는 현재 세션에서 backend discovery 실패로 blocked입니다. 다음 UI/visual WorkUnit에서 새로 재시도해야 합니다.
- 포장잎 상인 전용 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리해야 합니다.
- 새 target row에서 실제 포장잎 상인 수확까지 닫는 작업은 다음 production vertical slice 후보입니다.

## 연결된 issue

Closes #326
