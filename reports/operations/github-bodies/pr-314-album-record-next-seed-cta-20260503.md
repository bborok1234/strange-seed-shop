## 요약

#314 새 도감 기록 card의 다음 씨앗 목표 CTA가 씨앗 탭 target row의 `새 기록 다음 목표`/`도감 기록 다음 씨앗` 강조로 이어지게 했습니다. 도감 저장 직후 다음 수집 행동이 구매/심기 준비로 닫힙니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 새 단서 기록을 저장한 뒤 다음 씨앗을 누르면 “이 씨앗을 사거나 심으면 된다”가 target row에서 바로 읽힙니다.

## Plan-first evidence

- Plan artifact: `items/0159-album-record-next-seed-cta.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. 신규 manifest asset 없이 DOM/CSS row highlight와 visual regression만 추가했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 도감 새 기록 CTA 이후 seeds tab target row 강조, 구매/심기 affordance, bottom-tab overlap/action-surface overflow invariant, screenshot evidence.
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

- 게임 가치: 도감 기록 저장 → 다음 목표 씨앗 선택 → 구매/심기 준비가 한 흐름으로 이어져 “하나만 더 키우기” 루프가 강해집니다.
- 운영사 가치: queue-empty 이후에도 GitHub-authoritative WorkUnit/PR/CI evidence로 production game quality chain을 전진시킵니다.

## Before / After 또는 Visual evidence

- Before: 새 단서 기록 card의 다음 씨앗 CTA가 씨앗 탭 이동으로 끝나 target row의 후속 행동 강조가 약했습니다.
- After: seeds tab 목표 banner/row가 `새 기록 다음 목표`, `도감 기록 다음 씨앗`, `구매/심기 준비`를 한 화면에서 보여줍니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0314-20260503.md` — 현재 Codex 세션 iab backend discovery 실패.
- Screenshot: `reports/visual/issue-314-album-record-next-seed-cta-393.png`
- N/A 사유: Browser Use screenshot은 세션 backend blocker로 확보하지 못해 Playwright screenshot을 regression evidence로 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch UI/CSS/test 변경만 포함하며 stable main playable worktree와 port 5174 계약을 변경하지 않습니다.

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "새 단서 기록 다음 씨앗|도감 기록 다음 씨앗"` — 1 passed
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|연구 단서 성장|연구 단서 수확|단서 생명체|연구 단서 도감|새 단서 기록|새 단서 기록 다음 씨앗|도감 기록 다음 씨앗"` — 5 passed
- [x] `npm run check:visual` — 60 passed
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
- 더 강한 새 기록 reward motion이나 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리해야 합니다.

## 연결된 issue

Closes #314
