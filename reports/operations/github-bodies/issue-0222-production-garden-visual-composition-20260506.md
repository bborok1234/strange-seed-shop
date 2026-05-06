## 문제 / 배경

#417은 생산/보관/납품 병목을 읽히게 했지만, 정원 화면의 더 큰 art/HUD 문제는 남아 있습니다. 지금 화면은 경쟁작 조사와 새 spec이 요구한 수준처럼 `살아있는 production hub`로 읽히기보다, 아직 배경 위에 plot/text/HUD를 얹은 느낌이 강합니다.

사용자 지적과 `docs/ART_HUD_PRODUCTION_SPEC.md` 기준을 합치면 다음 축이 현재 가장 시급합니다.

- 밭이 배경 원근과 floor play area를 존중하지 못함
- plot/actor label이 배경과 싸우거나 asset 위에 직접 올라감
- HUD hierarchy가 기능은 하지만 production game 화면의 시선 흐름으로 충분히 정리되지 않음
- 자동 생산 actor가 plot/crate/workbench/action surface 중 하나에 강하게 anchor되지 않음
- 데스크톱도 모바일 frame 기준으로 같은 composition bar를 통과해야 함

## 목표

정원 첫 production 화면을 기능 카드가 아니라 `plot + worker actor + order/storage prop + primary action`이 한 장면으로 읽히는 모바일 production garden scene으로 재구성합니다.

## Small win

플레이어가 3초 안에 “여기가 밭이고, 이 생명체가 일하고 있고, 지금 이 행동을 하면 된다”를 읽을 수 있게 합니다.

## Campaign source of truth

- `docs/DESIGN.md`
- `docs/ART_HUD_PRODUCTION_SPEC.md`
- `docs/PRODUCTION_SLICE_READINESS.md`
- `docs/IDLE_CORE_PRODUCTION_SPEC.md`

## Game Studio Department Signoff

- 기획팀: player verb는 `수확/수령/납품/강화`, first 10-minute garden comprehension이 목표입니다.
- 리서치팀: Cats & Soup, Animal Restaurant, CookieRun: Kingdom의 hub composition/worker anchoring gap을 적용합니다.
- 아트팀: accepted game asset은 raster provenance만 허용합니다. 새 asset이 필요하면 Codex native image generation 또는 gpt-image-2 provenance를 남깁니다.
- 개발팀: `src/App.tsx`, `src/styles.css`, visual tests 중심으로 작게 시작하고 save compatibility를 유지합니다.
- 검수팀: Browser Use `iab`를 먼저 시도하고, blocker 발생 시 Playwright fallback screenshot을 남깁니다.
- 마케팅팀: mock/playable surface만 유지하고 외부 채널/결제는 다루지 않습니다.
- 고객지원팀: 첫 화면에서 “밭이 어디인지”, “생명체가 왜 있는지”, “뭘 눌러야 하는지”가 보이게 합니다.

## Subagent/Team Routing

첫 pass는 단일 owner로 진행합니다. DOM/CSS/visual QA가 강하게 결합되어 있어, 초반에 분산하면 scene coherence가 깨질 위험이 큽니다. 첫 스크린샷 이후 별도 verifier pass가 필요하면 분리합니다.

## 플레이어 가치

경쟁작 조사와 spec이 실제 화면에 반영됩니다. 기능이 되는 화면을 넘어, 생명체와 밭과 주문 prop이 함께 존재하는 게임 장면으로 보이게 합니다.

## 수용 기준

- [ ] 393px 모바일 first production garden에서 plot, worker actor, order/storage prop, primary action이 한 화면에 보인다.
- [ ] 360px 모바일에서 summary, plot label, actor label, bottom action text가 잘리지 않는다.
- [ ] 1280px 데스크톱에서 중앙 모바일 game frame이 유지되고 side rail/dock이 재등장하지 않는다.
- [ ] 첫 plot은 선반/서랍이 아니라 floor play area에 anchor된다.
- [ ] plot/status text는 plate/ribbon/shadow를 가지며 상세 배경 위 naked text로 올라가지 않는다.
- [ ] 자동 생산 actor는 plot, crate, workbench, action surface 중 하나에 anchor된다.
- [ ] first production state에서 actor가 48px 이상으로 읽힌다.
- [ ] plot, actor, order crate, storage basket, reward motion 중 최소 2개 visual state가 screenshot evidence에 보인다.
- [ ] Browser Use `iab` 시도 또는 현재 세션 blocker + Playwright fallback evidence를 남긴다.

## Visual evidence 계획

- `reports/visual/issue-XXXX-production-garden-visual-composition/mobile-393-before.png`
- `reports/visual/issue-XXXX-production-garden-visual-composition/mobile-393-after.png`
- `reports/visual/issue-XXXX-production-garden-visual-composition/mobile-360-after.png`
- `reports/visual/issue-XXXX-production-garden-visual-composition/desktop-1280-after.png`
- `reports/visual/issue-XXXX-production-garden-visual-composition/visual-report-20260506.md`

## Playable mode 영향

main playable worktree 정책은 유지합니다. 데스크톱 playable도 모바일 frame을 중앙에 보여주는 정책을 유지합니다.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, customer data 없음
- 런타임 이미지 생성 없음
- accepted SVG/vector game asset 없음
- save migration은 필요한 경우 backward-compatible만 허용

## 검증 명령

- `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "병목|자동 생산과 첫 주문|visual composition"`
- `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts`
- `npm run build`
- `npm run check:ci`
