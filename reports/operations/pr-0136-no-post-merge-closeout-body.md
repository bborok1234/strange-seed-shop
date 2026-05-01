## 요약

PR merge/close 이후 main 대상 closeout PR/commit으로 evidence를 backfill하는 패턴을 금지하는 seed-ops 하네스 게이트를 추가합니다.

## Small win

`reports/operations/pr-...closeout...body.md` 같은 새 closeout PR body 파일이 생기면 `npm run check:no-post-merge-closeout`와 `npm run check:ci`가 실패합니다.

## Plan-first evidence

- Plan artifact: `items/0136-no-post-merge-closeout.md`
- Plan에서 벗어난 변경이 있다면 이유: N/A

## Game Studio route

- Umbrella: N/A - 운영 하네스 수정
- Specialist route: N/A
- 적용한 playfield/HUD/playtest 기준: N/A
- Game Studio route에서 벗어난 변경이 있다면 이유: UI/gameplay 변경 없음

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다. N/A - 운영 하네스 수정
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다. N/A
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다. N/A
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다. N/A
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: N/A - 운영 하네스 안정화
- 운영사 가치: PR을 닫은 뒤 main을 대상으로 evidence backfill을 만드는 회귀를 CI에서 차단합니다.

## Before / After 또는 Visual evidence

- Before: PR #267 merge 이후 main CI evidence를 repo에 backfill하려고 closeout PR #268을 만들었다.
- After: #268은 닫혔고, 같은 `closeout-body` 패턴이 새로 생기면 checker가 실패한다.
- Browser Use evidence 또는 blocker: N/A - UI 변화 없음
- N/A 사유: docs/scripts-only PR

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: 런타임 코드 변경 없음

## 검증

- [x] `npm run check:no-post-merge-closeout`
- [x] `npm run check:seed-ops-queue`
- [x] `npm run check:github-metadata`
- [x] `npm run check:ci`

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

기존 historical closeout report는 남겨 둡니다. 새 금지는 closeout PR body 파일 패턴부터 막습니다.

## 연결된 issue

N/A - user-reported harness regression
