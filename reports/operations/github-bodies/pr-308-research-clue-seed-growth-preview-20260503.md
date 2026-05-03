## 요약

#308 연구 단서 씨앗이 성장 중일 때 next creature card에 `수확 예고` pill을 표시해 다음 생명체 단서 추적 상태를 한 화면에서 읽히게 했습니다. #306의 연구 단서 구매/심기 payoff가 이제 성장 중 기대와 연결됩니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 연구 단서 씨앗을 심은 직후 정원에서 “이 씨앗을 수확하면 다음 생명체 단서가 풀린다”가 보입니다.

## Plan-first evidence

- Plan artifact: `items/0156-research-clue-seed-growth-preview.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. 신규 manifest asset 없이 DOM/CSS HUD affordance와 Playwright visual regression만 추가했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: playfield를 가리지 않는 compact next-creature HUD, persistent HUD 저밀도 유지, 393px bottom-tab overlap/action-surface overflow invariant, screenshot evidence.
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

- 게임 가치: 연구 완료 → 목표 씨앗 심기 → 성장 중 수확 기대가 끊기지 않아 “하나만 더 키워볼까?”를 강화합니다.
- 운영사 가치: queue-empty 이후에도 GitHub-authoritative WorkUnit/PR/CI evidence로 P0.5 production chain을 전진시킵니다.

## Before / After 또는 Visual evidence

- Before: 연구 단서 씨앗을 심은 뒤 성장 중 상태가 일반 밭과 비슷해 다음 생명체 수확 기대가 약했습니다.
- After: next creature card에 `수확 예고: <씨앗> 수확 예고 · <생명체> 단서 추적 중` pill이 표시되고 393px에서 bottom tab과 겹치지 않습니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0308-20260503.md` — 현재 Codex 세션 iab backend discovery 실패.
- Screenshot: `reports/visual/issue-308-research-clue-seed-growth-preview-393.png`
- N/A 사유: Browser Use screenshot은 세션 backend blocker로 확보하지 못해 Playwright screenshot을 regression evidence로 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch UI/CSS/test 변경만 포함하며 stable main playable worktree와 port 5174 계약을 변경하지 않습니다.

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|연구 단서 성장"` — 2 passed
- [x] `npm run check:visual` — 57 passed
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
- 더 강한 수확 예고 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리해야 합니다.

## 연결된 issue

Closes #308
