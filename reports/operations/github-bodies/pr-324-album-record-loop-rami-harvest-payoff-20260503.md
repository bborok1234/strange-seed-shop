## 요약

#324 다음 기록 target row에서 `방울새싹 씨앗`을 구매/심기/성장/수확하면 `이슬연금 라미`가 `새 기록 재순환 생명체 발견` reveal과 `새 기록 재순환 수확` receipt로 나타나게 했습니다. playfield FX telemetry에도 `plotSource: album_record_next_seed`를 남겨 다음 기록 재순환 harvest임을 검증할 수 있습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: #322의 “다음 기록 목표”가 실제 라미 수확 reveal까지 이어져, 다음 target CTA가 믿을 수 있는 수집 루프가 됩니다.

## Plan-first evidence

- Plan artifact: `items/0164-album-record-loop-rami-harvest-payoff.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. 신규 manifest asset/API 호출 없이 existing 라미 portrait, playfield telemetry, DOM/CSS reveal copy, visual regression만 추가했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest` + `game-studio:phaser-2d-game`
- 적용한 playfield/HUD/playtest 기준: #322 next target row → planting → growth preview → 라미 harvest reveal, mobile 393px bottom-tab/overflow invariant, reward motion telemetry, screenshot evidence.
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

- 게임 가치: “다음 기록 목표”가 이름 있는 새 생명체 수확으로 닫혀 다음 클릭의 신뢰와 “하나만 더” 욕구가 강해집니다.
- 운영사 가치: #314→#316→#318→#320→#322 후속 기록 chain을 두 번째 named harvest payoff와 telemetry evidence까지 이어갑니다.

## Before / After 또는 Visual evidence

- Before: #322에서 `방울새싹 씨앗 → 이슬연금 라미` target row는 보였지만, 그 다음 planting/growth/harvest payoff가 별도 evidence로 닫히지 않았습니다.
- After: 라미 target seed를 심으면 성장 중 `이슬연금 라미 수확 예고`가 보이고, 수확 reveal이 `새 기록 재순환 생명체 발견` / `새 기록 재순환 수확`으로 나타납니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0324-20260503.md` — 현재 Codex 세션 iab backend discovery 실패.
- Screenshot: `reports/visual/issue-324-album-record-loop-rami-harvest-payoff-393.png`
- N/A 사유: Browser Use screenshot은 세션 backend blocker로 확보하지 못해 Playwright screenshot을 regression evidence로 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch UI/game-state/playfield telemetry/test 변경만 포함하며 stable main playable worktree와 port 5174 계약을 변경하지 않습니다.

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "이슬연금 라미 수확 payoff"` — 1 passed
- [x] `npm run check:visual` — 65 passed
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
- 라미 전용 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리해야 합니다.
- 신규 locked seed 해금/album_3 보상 UX는 별도 progression WorkUnit으로 분리해야 합니다.

## 연결된 issue

Closes #324
