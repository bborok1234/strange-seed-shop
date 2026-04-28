# P0 Phaser playfield 시각 노이즈 줄이기

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #101
Branch: p0-playfield-noise-cleanup

## Intent

#99 이후 상태 구분은 좋아졌지만, locked plot의 반복 텍스트/번호/강한 선이 작은 모바일 화면에서 grid noise처럼 보였다. 이번 small win은 조작 가능한 ready plot을 우선하고 locked/empty slot은 조용히 뒤로 물러나게 만드는 것이다.

## Acceptance Criteria

- locked plot은 반복 텍스트/강한 경계선이 줄어든다.
- ready plot의 수확 가능 상태는 계속 선명하다.
- empty plot은 씨앗을 심을 자리로만 간결히 보인다.
- 모바일 393/375/360 Playwright gate가 계속 통과한다.
- mobile/desktop screenshot evidence와 visual report가 `reports/visual/`에 저장된다.

## Evidence

- Visual report: `reports/visual/p0-playfield-noise-cleanup-20260428.md`
- Mobile 393: `reports/visual/p0-playfield-noise-cleanup-mobile-393-20260428.png`
- Mobile 375: `reports/visual/p0-playfield-noise-cleanup-mobile-375-20260428.png`
- Mobile 360: `reports/visual/p0-playfield-noise-cleanup-mobile-360-20260428.png`
- Desktop: `reports/visual/p0-playfield-noise-cleanup-desktop-20260428.png`

## Apply Conditions

- 저장 구조, economy values, content schema, analytics event 이름은 변경하지 않는다.
- 실제 결제/로그인/광고/외부 배포/런타임 이미지 생성은 범위 밖이다.

## Verification

- `npm run check:visual`
- `npm run check:all`
