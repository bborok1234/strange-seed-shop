# P0 모바일 정원 HUD와 액션 카드 polish

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #97
Branch: p0-mobile-garden-hud-polish

## Intent

#95는 모바일 탭 구조와 visual regression gate를 고정했지만, 정원 기본 화면은 여전히 개발적 라벨과 잘리는 보조 문구 때문에 “모바일 게임 첫 화면”으로 읽히는 힘이 부족했다. P0의 다음 small win은 첫 3초 안에 온실/밭/현재 행동/하단 탭만 선명하게 보이도록 HUD와 action card를 정리하는 것이다.

## Acceptance Criteria

- 상단 eyebrow는 개발적 문구가 아니라 세계관/화면명으로 표시된다.
- 모바일 정원 action card는 393/375/360px에서 내부 스크롤 없이 하단 nav 위에 완전히 들어온다.
- 모바일 기본 정원 화면에서 `MOBILE GARDEN HUD`가 노출되지 않는다.
- Playwright visual/layout regression이 action card와 하단 nav 겹침 및 내부 스크롤 회귀를 잡는다.
- mobile/desktop screenshot evidence가 `reports/visual/`에 저장된다.

## Evidence

- Visual report: `reports/visual/p0-mobile-garden-hud-polish-20260428.md`
- Mobile 393: `reports/visual/p0-mobile-garden-hud-polish-mobile-20260428.png`
- Mobile 360: `reports/visual/p0-mobile-garden-hud-polish-mobile-360-20260428.png`
- Desktop: `reports/visual/p0-mobile-garden-hud-polish-desktop-20260428.png`
- Test: `tests/visual/p0-mobile-game-shell.spec.ts`

## Apply Conditions

- 저장 데이터 구조, economy values, content schema, analytics event 이름은 변경하지 않는다.
- 실제 결제/로그인/광고/외부 배포/런타임 이미지 생성은 범위 밖이다.

## Verification

- `npm run check:visual` (393/375/360 garden + mobile tabs + desktop split)
- `npm run check:all`
