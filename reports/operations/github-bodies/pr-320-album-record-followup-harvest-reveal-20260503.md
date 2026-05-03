## 요약

#320 `album_record_next_seed` 후속 재배 씨앗을 끝까지 키워 수확하면 harvest reveal이 `새 기록 후속 생명체 발견`과 `새 기록 후속 수확` receipt를 보여주게 했습니다. #318의 성장 중 수확 예고가 실제 `젤리콩 통통` 발견과 도감 저장 CTA로 닫힙니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 새 기록 다음 씨앗을 수확하는 순간 “예고했던 아이를 정말 만났다”가 reveal과 도감 저장 CTA로 보입니다.

## Plan-first evidence

- Plan artifact: `items/0162-album-record-followup-harvest-reveal.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. 신규 manifest asset/API 호출 없이 existing creature portrait, DOM/CSS reveal treatment, playfield reward motion, visual regression만 추가했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest` + 필요 시 `game-studio:phaser-2d-game`
- 적용한 playfield/HUD/playtest 기준: ready plot harvest, reveal receipt, 도감 저장 CTA, garden production scene continuity, mobile 393px overflow/bottom-tab invariant, screenshot evidence.
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

- 게임 가치: 새 기록 다음 씨앗 심기 → 성장 중 예고 → 수확 reveal → 도감 저장이 한 목표 생명체 이름으로 이어져 수집 루프 promise/payoff가 닫힙니다.
- 운영사 가치: #314→#316→#318→#320으로 이어진 도감 새 기록 후속 루프를 harvest/reveal checkpoint까지 GitHub-authoritative evidence로 전진시킵니다.

## Before / After 또는 Visual evidence

- Before: 성장 중에는 `젤리콩 통통 수확 예고`가 보였지만, 실제 수확 reveal은 새 기록 후속 맥락을 별도로 강조하지 않았습니다.
- After: 수확 reveal과 receipt가 `새 기록 후속 수확`, `젤리콩 씨앗 → 젤리콩 통통`, 도감 저장 CTA를 보여주고, 저장 후 garden production scene도 같은 payoff를 유지합니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0320-20260503.md` — 현재 Codex 세션 iab backend discovery 실패.
- Screenshot: `reports/visual/issue-320-album-record-followup-harvest-reveal-393.png`
- N/A 사유: Browser Use screenshot은 세션 backend blocker로 확보하지 못해 Playwright screenshot을 regression evidence로 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch UI/CSS/playfield/test 변경만 포함하며 stable main playable worktree와 port 5174 계약을 변경하지 않습니다.

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "새 기록 후속 수확|후속 재배 수확|새 생명체 발견"` — 1 passed
- [x] `npm run check:visual` — 63 passed
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
- 후속 수확 전용 sprite/FX가 필요하면 별도 asset provenance WorkUnit으로 분리해야 합니다.

## 연결된 issue

Closes #320
