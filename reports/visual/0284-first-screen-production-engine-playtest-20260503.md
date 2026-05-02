# #284 first-screen production engine playtest — 2026-05-03

## WorkUnit

- GitHub issue: #284 `정원 첫 화면을 생산 엔진 중심으로 재배치해 수확·납품을 한 장면에 묶는다`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `browser-use:browser`
- Viewport: mobile 393 × 852
- URL/state: `/?qaLunarOrderReady=1&qaReset=1`로 달방울 누누/달빛 보호 주문 ready save를 만든 뒤 localStorage `idleProduction.pendingLeaves = 16`으로 생산 수령 CTA까지 활성화하고 `/`에서 확인

## First actionable screen

- 첫 화면에서 `대표 생명체 무대`가 `달방울 누누`를 보여준다.
- `정원 생산 엔진 한 장면` group이 visible이고, 그 안의 `정원 자동 생산 장면`이 `달빛 보호 주문` progress/crate를 보여준다.
- playfield edge tray의 order crate/progress가 action panel보다 위에 있어 production scene과 action card가 같은 화면 맥락으로 읽힌다.

## Main verbs

- `돌보기` CTA는 creature stage 하단에서 visible.
- `생산 잎 수령` CTA는 활성 상태로 visible.
- `달빛 보호 주문 납품 +88 잎 · +3 꽃가루 · +1 재료` CTA는 visible이며 하단 탭에 가리지 않는다.

## HUD/playfield readability

- 기존 `has-creature-stage`에서 숨겨졌던 `.playfield-board-overlay.has-production-scene`을 다시 visible로 만들었다.
- overlay background는 transparent, 생산/주문 장면은 lower edge tray로 제한해 stage center를 보호한다.
- action card에서는 open lunar guardian order 상태의 secondary growth cards를 접고 order progress → production claim → worker/roster 순서로 배치해 crate/progress가 카드 본문보다 먼저 읽힌다.

## Layout invariants

자동 회귀 test `모바일 정원 첫 화면은 생산 엔진 한 장면으로 수령과 납품을 보여준다`가 검증한 조건:

- body scroll 없음: `bodyScrollHeight <= innerHeight + 2`
- action surface bottom은 bottom tabs 위에 유지
- playfield production lane은 creature focus 하단 CTA와 분리
- playfield order crate는 action panel보다 위에 표시
- order progress card는 production meter row보다 먼저 표시
- order progress card는 worker heading/roster보다 먼저 표시
- `돌보기`, `생산 잎 수령`, `달빛 보호 주문 납품` CTA는 viewport/bottom tabs 안쪽에 있음
- `.starter-panel`과 visible child overflow 없음

## Browser Use

- Browser Use `iab`는 current session에서 다시 시도했으나 Node REPL `js` tool이 노출되지 않아 bootstrap이 불가했다.
- Blocker: `reports/visual/browser-use-blocker-0284-20260503.md`

## Fallback screenshot evidence

- Screenshot: `reports/visual/first-screen-production-engine-one-scene-20260503.png`

## Local focused checks

- `npm run check:visual -- --grep "생산 엔진|한 장면|production engine"` → 1 passed
- `npm run check:visual -- --grep "creature stage|기억 도장|생산 엔진|달빛 보호 주문 완료"` → 4 passed

## Findings in severity order

1. **P0 없음** — CTA/bottom tab overlap, body scroll, visible child clipping은 재현되지 않았다.
2. **P1 없음** — order crate/progress가 playfield와 action panel 사이에서 먼저 읽히며, 기존 달방울 stage/care/order completion regression도 유지된다.
3. **P2 follow-up** — 이후 별도 asset/FX issue에서 달방울 누누 idle/care sprite strip을 만들면 production tray와 resident attachment를 더 자연스럽게 연결할 수 있다. 이번 WorkUnit은 신규 asset 없이 layout blocker를 닫는다.
