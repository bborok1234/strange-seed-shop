## 요약

- 달빛 resident가 발견된 정원에서 `대표 생명체 무대`를 보여주고, `돌보기` 후 눈빛/반짝임/발자국 단서 상태로 전환합니다.
- 도감을 reward grid보다 creature memory photo / clue polaroid 감상면 중심으로 재배치합니다.
- stage가 기존 연구/온실 progression UI를 압박하지 않도록 달빛 resident 발견 순간으로 scope를 좁히고, 온실 chain과 달빛 주문이 동시에 가능한 QA 상태에서는 온실 chain order precedence를 보존합니다.

## Small win

첫 정원 화면에서 달방울 누누가 카드 텍스트보다 먼저 읽히고, 돌보기 후 단서가 생겨 “얘 귀엽다. 하나만 더 키워볼까?” 감정 loop가 도감 감상면까지 이어집니다.

## 사용자/운영자 가치

- 사용자: 수집한 생명체를 작은 카드가 아니라 정원 resident/사진 기록으로 감상하고, 다음 단서를 행동으로 이해합니다.
- 운영자: v2 local recovery diff를 GitHub WorkUnit evidence, current-session visual evidence, regression gate로 승격해 local ledger authority 회귀를 막습니다.

## Before / After 또는 Visual evidence

- Before: 정원 첫 화면의 생산/주문 카드 위계가 강하고 resident reaction/clue가 화면 장면으로 읽히기 어려웠습니다.
- After:
  - `reports/visual/creature-stage-production-20260503.png`
  - `reports/visual/care-clue-production-20260503.png`
  - `reports/visual/album-appreciation-production-20260503.png`
  - `reports/visual/album-clue-focus-production-20260503.png`
- Browser Use current-session blocker: `reports/visual/browser-use-blocker-0275-20260503.md`
- Playtest report: `reports/visual/0275-production-playtest-20260503.md`

## Playable mode

- 사람 확인용 stable main worktree는 기존 계약대로 `npm run play:main` 후 `../strange-seed-shop-play`에서 port 5174로 실행합니다.
- 이 PR의 직접 확인 URL:
  - `/?qaLunarOrderReady=1&qaReset=1`
  - `/?qaGreenhouseLunarClaimReady=1&qaTab=album&qaReset=1`

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `browser-use:browser`
- Browser Use `iab`: current session에서 skill/client/Node REPL `js` discovery를 시도했지만 `js` execution tool이 노출되지 않아 blocker를 기록하고 Playwright fallback screenshot을 수집했습니다.

## 작업 checklist

- [x] Plan-first artifact 작성: `items/0142-creature-stage-care-album-production.md`
- [x] Game Studio route 기록
- [x] Browser Use current-session blocker 기록
- [x] Visual/playtest screenshot evidence 저장
- [x] Focused regression 통과
- [x] Full visual regression 통과
- [x] `npm run check:ci` 통과
- [ ] GitHub checks 확인
- [ ] Merge 후 main CI 관찰

## 검증

- `npm run check:visual -- --grep "creature stage|도감은 보상표"` → 2 passed
- `npm run check:visual -- --grep "복귀 후 온실 선반|온실 선반 정리|온실 확장 준비|온실 동선|온실 물길|온실 물안개|연구 단서는|creature stage|달빛 보호 주문"` → 12 passed
- `npm run check:visual` → 52 passed (4.6m)
- `npm run check:ci` → passed

## 안전 범위

- 새 asset generation/manifest 등록 없음
- economy/schema migration 없음
- runtime image generation/API 호출 없음
- 결제/광고/고객 데이터/실채널 GTM 없음
- v2 local campaign ledger는 evidence mirror일 뿐 authority로 사용하지 않음

## 남은 위험

- Browser Use `iab` hands-on QA는 current session에서 Node REPL `js` 미노출로 막혀 Playwright fallback을 사용했습니다.
- stage는 달빛 resident 발견 상태로 scope를 좁혔습니다. 일반 연구/온실 progression 화면은 기존 action surface를 유지합니다.

## 연결된 issue

Closes #275
