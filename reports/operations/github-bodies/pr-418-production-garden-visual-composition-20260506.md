## 요약

정원 production 화면을 숫자/카드 위주에서 `plot + worker actor + order/storage prop + primary action`이 한 장면으로 읽히도록 정리했습니다. #417의 병목 그래프는 유지하면서, storage bottleneck 상태에서는 하단 action surface의 중복 문구를 줄이고 playfield 높이와 plot/label 가독성을 강화했습니다.

## Small win

플레이어가 첫 production 화면에서 밭 위치, 일하는 포리, 주문 상자, 보관 병목 추천을 더 빨리 읽을 수 있습니다.

## Plan-first evidence

- Plan artifact: `items/0222-production-garden-visual-composition.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음. 새 raster asset 없이 기존 asset/CSS/visual regression으로 첫 composition pass를 닫았습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
- 적용한 기준: mobile-frame first, playfield 보호, HUD 예산, plot floor anchor, actor 48px readability, label plate, Browser Use 우선 QA
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음

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

- 게임 가치: 경쟁작 리서치와 `DESIGN.md`/`ART_HUD_PRODUCTION_SPEC.md`가 실제 화면 acceptance로 이어집니다.
- 운영사 가치: "텍스트가 있다"가 아니라 screenshot/geometry 기준으로 plot, actor, label, action surface를 검수합니다.

## Before / After 또는 Visual evidence

- Mobile 393 after: `reports/visual/issue-418-production-garden-visual-composition/mobile-393-after.png`
- Mobile 360 after: `reports/visual/issue-418-production-garden-visual-composition/mobile-360-after.png`
- Desktop 1280 after: `reports/visual/issue-418-production-garden-visual-composition/desktop-1280-after.png`
- Browser Use evidence 또는 blocker: `reports/visual/issue-418-production-garden-visual-composition/visual-report-20260506.md`
- N/A 사유: Browser Use `iab` backend가 발견되지 않아 Playwright fallback screenshot을 사용했습니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: 저장 구조 변경 없이 mobile-frame CSS/visual tests만 조정했습니다.

## 검증

- [x] `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "visual composition|병목 production graph"` PASS
- [x] `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts --grep "production garden visual composition|모바일 game frame 하나"` PASS
- [x] `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts` PASS
- [x] `npm run build` PASS
- [x] `npm run check:ci` PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음
- [x] runtime image generation 없음
- [x] accepted SVG/vector game asset 추가 없음

## 남은 위험

이번 pass는 existing raster assets를 활용한 composition 정리입니다. 여전히 화면이 더 살아 움직여야 한다고 판단되면 다음 slice는 CSS polish가 아니라 workbench/dispatch lane/reward motion용 새 raster prop 또는 FX bundle이어야 합니다.

## 연결된 issue

Closes #418
