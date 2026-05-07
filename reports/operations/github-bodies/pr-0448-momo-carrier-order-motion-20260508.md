## 요약

#446에서 정규화한 Momo carrier strip을 Phaser runtime actor로 연결하고, 첫 작업대 수령 후 주문 상자 진행이 state/화면에서 읽히게 했습니다.

## Small win

Pori 수확 -> 작업대 수령 다음에 Momo가 workbench -> order crate 경로를 왕복해서, 생산 체인이 텍스트가 아니라 actor motion으로 보입니다.

## 사용자/운영자 가치

플레이어는 첫 5분 안에 정원이 “일하는 상회”로 확장되는 순간을 봅니다. 운영자는 generated strip asset이 실제 gameplay actor, task path, deterministic smoke evidence까지 이어지는 경로를 확보합니다.

## Before / After 또는 Visual evidence

- Before: Momo strip은 normalized/preloaded 상태였지만 runtime actor는 Pori 하나였습니다. 주문 상자 진행은 숫자/receipt 중심이었습니다.
- After: workbench claim 후 `actor_momo`가 추가되고 `actor_momo_carrier_strip_v1` animation으로 order crate task path를 왕복합니다.
- Visual report: `reports/visual/issue-0448-momo-carrier-order-motion/visual-report-20260508.md`
- Screenshot sequence:
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-fresh-start-393.png`
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-after-plant-393.png`
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-ready-393.png`
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-after-harvest-393.png`
  - `reports/visual/issue-0448-momo-carrier-order-motion/phaser-check-workbench-claim-393.png`

## Playable mode

Phaser app lane changed. Merge 후 main playable worktree refresh 대상입니다. Legacy playable lane은 수정하지 않았습니다.

## 검증

- `npm run check:phaser`
- `npm run check:control-room`
- `npm run check:ops-live`
- `git diff --check`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 기존 generated PNG/spritesheet만 Phaser에서 preload/render합니다.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

- Full order delivery/claim economy는 아직 연결하지 않았습니다. 다음 WorkUnit에서 order crate delivery claim 또는 reward motion으로 분리해야 합니다.
- Browser Use `iab` hands-on QA는 이번 Codex CLI 세션에서 tool 미노출로 blocked이며, Playwright fallback evidence를 사용했습니다.

## 연결된 issue

- Closes #448

## 작업 checklist

- [x] Momo carrier state 추가
- [x] role별 actor spritesheet rendering
- [x] workbench -> order crate task motion
- [x] order crate progress smoke evidence
- [x] visual report 저장
- [x] roadmap/control room/dashboard/heartbeat 갱신
