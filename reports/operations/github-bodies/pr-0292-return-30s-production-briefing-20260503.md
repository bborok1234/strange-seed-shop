## 요약

복귀 첫 30초 흐름을 오프라인 보상 수령에서 다음 생산 목표 실행까지 한 화면으로 압축했습니다. 보상 모달에 `다음 생산 목표` 카드를 추가하고, 첫 CTA가 생산 잎 수령 또는 첫 주문 납품으로 곧바로 이어지도록 연결했습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 복귀 플레이어가 보상만 받고 멈추지 않고, 같은 CTA에서 `생산 잎 수령` 또는 `첫 주문 납품`까지 바로 실행합니다.

## Plan-first evidence

- Plan artifact: `items/0148-return-30s-production-briefing.md`
- Plan에서 벗어난 변경이 있다면 이유: Codex CLI 현재 세션에서 Browser Use `node_repl` MCP tool palette가 hot-load되지 않아, Browser Use blocker와 CLI 설정 복구 문서를 추가하고 Playwright visual fallback으로 검증했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 첫 actionable screen, main verbs, HUD readability, playfield obstruction, mobile bottom-tab overlap, panel overflow invariants를 확인했습니다.
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

- 게임 가치: 복귀 순간의 보상 수령이 다음 생산/주문 행동으로 이어져 “하나만 더” 동기가 즉시 생깁니다.
- 운영사 가치: Codex CLI Browser Use `node_repl` 설정/세션 hot-load 한계를 evidence로 남겨 v3 하네스가 같은 실패를 재진단할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: 오프라인 보상 모달은 보상 수령 후 어디로 이어질지 명확히 말하지 않아, 복귀 첫 30초의 다음 생산 목표가 끊겼습니다.
- After: 보상 모달에 `다음 생산 목표` 카드와 `보상 받고 생산 잎 수령` CTA가 표시되고, CTA 후 첫 주문 진행도 `12/12`, 납품 가능 상태, 보상 FX telemetry가 검증됩니다.
- Browser Use evidence 또는 blocker: `reports/visual/browser-use-blocker-0292-20260503.md`
- Visual fallback evidence: `reports/visual/0292-mobile-comeback-production-briefing-393-20260503.png`
- N/A 사유: Browser Use hands-on은 현재 Codex CLI 세션의 MCP tool palette hot-load 한계 때문에 blocker로 기록했고, 새 세션에서 재확인하도록 문서화했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: 앱 런타임은 기존 Vite/React 경로를 유지하며, 오프라인 보상 모달 CTA와 모바일 레이아웃만 보강했습니다.

## 검증

- [x] `npm run build` PASS
- [x] `npx playwright test --config playwright.config.ts --grep "모바일 복귀 첫 30초|모바일 복귀 보상은 달빛|모바일 복귀 보상은 온실 선반|모바일 복귀 후 온실 선반"` PASS — 4 passed
- [x] `npm run check:visual` PASS — 55 passed
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- 현재 Codex CLI 세션은 `codex mcp add node_repl -- /Applications/Codex.app/Contents/Resources/node_repl` 이후에도 MCP tool palette를 hot-load하지 못해 Browser Use iab hands-on을 새 세션에서 재확인해야 합니다.
- 이 PR은 복귀 보상 → 생산 목표의 1차 연결을 다루며, 장시간 live runner가 자동으로 이 visual gate를 새 세션에서 반복하는 문제는 별도 v3 하네스 hardening WorkUnit으로 남깁니다.

## 연결된 issue

Closes #292
