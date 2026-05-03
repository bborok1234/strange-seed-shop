## 요약

#312 연구 단서 생명체 발견 후 `도감에 기록하기` CTA가 도감 탭의 `새 단서 기록` card와 slot highlight로 이어지게 했습니다. 발견 overlay가 닫힌 뒤에도 방패새싹 모모가 새 기록으로 남고 다음 씨앗 목표가 보입니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 연구 단서 발견을 도감에 저장했다는 memory payoff가 즉시 보입니다.

## Plan-first evidence

- Plan artifact: `items/0158-research-clue-album-record.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. 신규 manifest asset 없이 DOM/CSS album highlight와 visual regression만 추가했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: reveal CTA 후 도감 탭 전환, 새 기록 card, bottom-tab overlap/action-surface overflow invariant, screenshot evidence.
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

- 게임 가치: 발견 → 도감 저장 → 다음 목표가 이어져 수집 idle game의 memory payoff가 강해집니다.
- 운영사 가치: queue-empty 이후에도 GitHub-authoritative WorkUnit/PR/CI evidence로 production game quality chain을 전진시킵니다.

## Before / After 또는 Visual evidence

- Before: 연구 단서 생명체를 발견해도 overlay를 닫은 뒤 도감 저장 감정이 약했습니다.
- After: `새 단서 기록` card, `도감 기록 저장`, `album-slot-new-record` highlight, 다음 씨앗 목표 CTA가 보입니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0312-20260503.md` — 현재 Codex 세션 iab backend discovery 실패.
- Screenshot: `reports/visual/issue-312-research-clue-album-record-393.png`
- N/A 사유: Browser Use screenshot은 세션 backend blocker로 확보하지 못해 Playwright screenshot을 regression evidence로 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch UI/CSS/test 변경만 포함하며 stable main playable worktree와 port 5174 계약을 변경하지 않습니다.

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 도감|새 단서 기록"` — 1 passed
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|연구 단서 성장|연구 단서 수확|단서 생명체|연구 단서 도감|새 단서 기록"` — 4 passed
- [x] `npm run check:visual` — 59 passed
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
- 더 강한 도감 기록 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리해야 합니다.

## 연결된 issue

Closes #312
