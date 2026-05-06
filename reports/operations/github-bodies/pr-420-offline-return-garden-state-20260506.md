# 요약

오프라인 복귀 보상이 modal 숫자에서 끝나지 않도록, 보상 확인 후 정원 화면에 `복귀 잎 보관` receipt와 playfield order crate 상태를 남겼습니다.

# Small win

플레이어가 돌아왔을 때 “정원이 나 없이 일했다”는 흔적이 정원에 남고, 다음 주문/생산 행동으로 이어집니다.

# 사용자/운영자 가치

- 사용자: 복귀 보상을 받은 뒤 다음에 무엇을 하면 되는지 정원 안에서 바로 읽을 수 있습니다.
- 운영자: P0.6 Slice B `Offline return as garden state`의 핵심 실패 조건인 “복귀 modal만 있고 정원 상태가 그대로”를 제거합니다.

# Before / After 또는 Visual evidence

Before: 복귀 보상은 modal/toast 중심이라 수령 후 정원 장면에 보상 결과가 오래 남지 않았습니다.

After: 정원 production card에 `복귀 잎 보관` receipt가 남고, playfield order crate가 `comeback-return` variant로 바뀌어 보관 바구니/다음 목표 상태를 보여줍니다.

- Browser Use blocker + visual report: `reports/visual/issue-420-offline-return-garden-state/visual-report-20260506.md`
- Mobile 393 screenshot: `reports/visual/issue-420-offline-return-garden-state/mobile-393-after.png`
- Mobile 360 screenshot: `reports/visual/issue-420-offline-return-garden-state/mobile-360-after.png`
- Desktop 1280 screenshot: `reports/visual/issue-420-offline-return-garden-state/desktop-1280-after.png`

# Playable mode

`http://127.0.0.1:4173/?qaOfflineMinutes=60&qaLunarGuardian=1`에서 복귀 보상 modal의 `보상 확인` 이후 정원 상태를 확인합니다.

# 검증

- `npm run build`
- `npx playwright test --config playwright.config.ts tests/visual/p0-mobile-game-shell.spec.ts --grep "복귀 보상 확인 후|짧은 모바일 복귀 정원 state|복귀 첫 30초"`
- `npx playwright test --config playwright.config.ts tests/visual/desktop-art-share.spec.ts --grep "복귀 정원 state|production garden visual composition"`
- `npm run check:ci`

# 안전 범위

- 저장 schema 변경 없음
- 신규 결제/로그인/외부 배포 없음
- 런타임 이미지 생성 없음
- accepted SVG/vector game asset 추가 없음
- 기존 복귀 보상 수치 계산은 유지

# 남은 위험

Browser Use `iab` backend가 현재 세션에서 발견되지 않아, 직접 in-app browser evidence 대신 blocker와 Playwright screenshot fallback을 남겼습니다.

# 연결된 issue

Closes #420

# 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first WorkUnit 작성
- [x] Browser Use 우선 시도 및 blocker 기록
- [x] 모바일/데스크톱 visual evidence 저장
- [x] focused visual regression 통과
- [x] `npm run check:ci` 통과
