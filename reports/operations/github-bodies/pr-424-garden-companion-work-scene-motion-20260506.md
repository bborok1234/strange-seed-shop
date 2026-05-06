## 요약

- #424 production-ready 정원에서 자동 생산 동료를 카드 속 아이콘이 아니라 playfield 위 worker actor로 재배치했습니다.
- `말랑잎 포리`와 `방패새싹 모모`를 plot/crate/workbench anchor에 놓고, 텍스트 칩 대신 작은 잎/상자 prop과 낮은 motion trail로 작업 흐름을 표시했습니다.
- Browser Use `iab`로 실제 in-app 화면을 확인하며 큰 workstage panel, 로딩 문구, 이름표/원형 칩이 장면을 가리는 회귀를 제거했습니다.

## Small win

정원 동료 2명이 “roster에만 있는 캐릭터”가 아니라 정원 배경 위에서 일하는 캐릭터로 보입니다.

## Plan-first evidence

- GitHub issue: #424
- Plan artifact: `items/0225-garden-companion-work-scene-motion.md`
- Game Studio route: `game-studio:game-studio` → `game-ui-frontend` + `game-playtest`, sprite/FX axis noted for follow-up.

## 작업 checklist

- [x] Browser Use `iab` before screenshot 기록
- [x] Workstage actor/support actor/prop target 구현
- [x] 이름표/원형 텍스트 칩 제거
- [x] Desktop/mobile visual regression 업데이트
- [x] Browser Use after screenshot과 visual report 저장
- [x] `check:ci` 통과

## 사용자/운영자 가치

- 사용자: 자동 생산 상태가 static card가 아니라 캐릭터가 정원에서 움직이며 일하는 장면으로 읽힙니다.
- 운영자: Browser Use screenshot, focused visual tests, art-share, full CI evidence가 한 WorkUnit에 묶여 다음 visual slice가 같은 기준을 재사용할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/issue-0225-garden-companion-work-scene-motion/browser-use-before-production-ready-20260506.png`
- After: `reports/visual/issue-0225-garden-companion-work-scene-motion/browser-use-after-workstage-prop-pass-20260506.png`
- Report: `reports/visual/issue-0225-garden-companion-work-scene-motion/visual-report-20260506.md`

## Playable mode

- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`
- Desktop도 모바일 game frame으로 강제되는 현행 UX 계약을 유지합니다.

## 검증

- Browser Use `iab` live screenshot pass
- `npm run build`
- `npm run check:p0-ui-ux`
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts tests/visual/desktop-art-share.spec.ts --config playwright.config.ts -g "production garden visual composition|생산 roster|정원 동료|production actor와 support actor|짧은 모바일 브라우저"`
- `npm run check:art-share`
- `npm run check:closed-workunit-mirrors`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API 호출 없음.
- 새 manifest game asset 추가 없음.
- 변경 범위는 production garden playfield composition, CSS motion/placement, visual regression, WorkUnit mirror evidence로 제한했습니다.

## 남은 위험

- 이번 PR은 기존 raster asset과 CSS motion으로 장면성을 올린 slice입니다. 경쟁작 수준의 leap를 위해 다음 WorkUnit에서 `방패새싹 모모` 전용 work/celebrate sprite strip 또는 더 강한 creature interaction behavior를 생성하는 편이 맞습니다.

## 연결된 issue

Closes #424
