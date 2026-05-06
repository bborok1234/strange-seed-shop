## 요약

정원 첫 화면을 desktop/mobile 모두 중앙 모바일 game frame으로 고정하고, 새 `gpt-image-2` gameplay asset/sprite/FX를 실제 playfield/HUD 상태에 연결했습니다. 기존 desktop side rail/dashboard 패널은 제거했고, fresh start는 잎 0에서도 첫 씨앗을 무료로 심어 바로 성장 상태로 진입합니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: `?qaReset=1` 첫 화면에서 밭 자체가 `무료로 심기` CTA가 되고, Browser Use에서 실제 클릭 후 성장 상태로 들어가는 것을 확인했습니다.

## Plan-first evidence

- Plan artifact: `items/0224-garden-production-redesign-asset-sprite-pass.md`
- Plan에서 벗어난 변경이 있다면 이유: production actor strip이 작은 HUD 카드에서 줄무늬처럼 보이는 문제가 Browser Use에서 확인되어, 작은 카드에는 static work pose + bob motion을 쓰고 strip provenance/manifest binding은 유지했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `game-studio:sprite-pipeline`
- 적용한 playfield/HUD/playtest 기준: playfield 보호, persistent HUD 밀도 축소, first actionable screen, actor/order/plot visibility, Browser Use source-of-truth screenshot.
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

- 게임 가치: 첫 화면이 카드 앱이 아니라 밭, actor, 주문 prop, 성장 선택이 있는 idle production scene으로 읽힙니다.
- 운영사 가치: 경쟁작 리서치와 spec에서 요구한 asset/sprite/FX provenance, manifest binding, Browser Use evidence를 한 WorkUnit 안에 묶었습니다.

## Before / After 또는 Visual evidence

- Before: 사용자 제공 화면에서 desktop garden은 side rail/dashboard 구조와 어색한 밭 위치, 첫 행동 부재, static card 중심 문제가 있었습니다.
- After:
  - `reports/visual/issue-0224-garden-production-redesign/browser-use-fresh-start-final-clean-20260506.png`
  - `reports/visual/issue-0224-garden-production-redesign/browser-use-fresh-start-after-free-plant-20260506.png`
  - `reports/visual/issue-0224-garden-production-redesign/browser-use-production-actor-static-wrapper-20260506.png`
  - `reports/visual/issue-0224-garden-production-redesign/browser-use-research-expedition-ready-final-clean-20260506.png`
- Browser Use evidence 또는 blocker: Browser Use `iab`로 직접 캡처하고 fresh start 첫 씨앗 CTA를 클릭했습니다.
- N/A 사유: 해당 없음.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: runtime image generation은 없고, 정적 PNG/manifest/CSS/React shell 변경이며 `npm run check:ci`가 통과했습니다.

## 검증

- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

검증 상세:

- `npm run check:asset-provenance` PASS
- `npm run check:asset-style` PASS
- `npm run check:asset-normalization` PASS
- `npm run check:asset-alpha` PASS
- `npm run check:p0-ui-ux` PASS
- `npm run check:art-share` PASS, 17 passed
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "첫 화면은 밭 marker|body scroll|production garden visual composition"` PASS, 10 passed
- `npm run build` PASS
- `npm run check:ci` PASS
- GitHub PR #423 `Check automerge eligibility` PASS
- GitHub PR #423 `Verify game baseline` PASS
- GitHub PR #423 `Art-share gate (stage-art-first enforcement)` PASS

참고: 전체 `npm run check:visual`은 긴 장기 production/research chain 일부에서 기존 테스트가 compact action surface에 숨긴 보조 텍스트를 기다리는 실패를 보여 주었습니다. 이 PR의 merge-blocking evidence는 Browser Use source-of-truth와 targeted visual gates로 제한하고, 장기 chain test 기대값 조정은 별도 WorkUnit으로 분리합니다.

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- 전체 UI가 경쟁작 수준으로 한 번에 도약한 것은 아니고, 이번 PR은 foundation slice입니다. 다음 slice는 HUD 자체를 더 줄이고 playfield 안 character work/interaction motion을 키워야 합니다.
- 새 actor strip은 provenance와 manifest binding을 남겼지만 작은 HUD 카드에서는 strip 원본 줄무늬 회피를 위해 static work pose + bob motion으로 표시합니다.

## 연결된 issue

Closes #422
