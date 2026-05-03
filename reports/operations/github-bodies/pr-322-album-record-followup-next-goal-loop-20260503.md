## 요약

#322 새 기록 후속 수확을 도감에 저장한 직후 album card가 `후속 기록 저장`, `다음 기록 목표`, `다음 기록으로 이어가기` CTA를 보여주고 seeds tab target row로 재진입하게 했습니다. `젤리콩 통통` 저장 후에는 다음 unlocked seed pool 목표인 `방울새싹 씨앗 → 이슬연금 라미`를 재순환 목표로 보여줍니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 새 기록 후속 수확을 도감에 저장하자마자 “다음 기록으로 이어가기” 버튼과 target row가 보여서 하나만 더 키우는 행동으로 이어집니다.

## Plan-first evidence

- Plan artifact: `items/0163-album-record-followup-next-goal-loop.md`
- Plan에서 벗어난 변경이 있다면 이유: 후속 수확 저장 뒤 `nextCreatureGoal`이 사라지는 문제가 있어, 첫 deterministic creature를 모두 발견한 뒤에는 unlocked seed의 다음 미발견 creature pool 목표로 재순환하도록 progression helper를 확장했습니다. 신규 manifest asset/API 호출 없이 existing visuals + DOM/CSS affordance + visual regression만 추가했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 후속 수확 reveal → 도감 저장 → album CTA → seeds target row, mobile 393px bottom-tab/overflow invariant, screenshot evidence.
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

- 게임 가치: “예고했던 아이를 만남”에서 끝나지 않고, 도감 저장 직후 다음 생명체 이름과 씨앗 source를 보여 “하나만 더” 수집 루프를 재시작합니다.
- 운영사 가치: #314→#316→#318→#320으로 이어진 새 기록 후속 루프를 next target acquisition까지 GitHub-authoritative evidence로 연결합니다.

## Before / After 또는 Visual evidence

- Before: `젤리콩 통통` 후속 수확을 도감에 저장하면 저장된 생명체는 보이지만, 다음 collection target/source로 재진입하는 affordance가 흐려질 수 있었습니다.
- After: 후속 기록 저장 card가 `다음 기록 목표: 이슬연금 라미`와 `다음 기록으로 이어가기: 방울새싹 씨앗`을 보여주고, seeds target row가 `다음 기록 재순환 · 이슬연금 라미 준비`를 표시합니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0322-20260503.md` — 현재 Codex 세션 iab backend discovery 실패.
- Screenshot: `reports/visual/issue-322-album-record-followup-next-goal-loop-393.png`
- N/A 사유: Browser Use screenshot은 세션 backend blocker로 확보하지 못해 Playwright screenshot을 regression evidence로 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch UI/CSS/progression helper/test 변경만 포함하며 stable main playable worktree와 port 5174 계약을 변경하지 않습니다.

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "후속 저장은 다음 기록 목표 재순환|후속 수확은 예고했던"` — 2 passed
- [x] `npm run check:visual` — 64 passed
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
- 후속 기록 전용 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리해야 합니다.
- 이번 PR은 unlocked seed pool 안에서 다음 미발견 creature 목표를 보여주도록 확장했지만, 신규 locked seed 해금/album_3 보상 UX는 별도 progression WorkUnit으로 분리해야 합니다.

## 연결된 issue

Closes #322
