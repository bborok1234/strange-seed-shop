# P0 Phaser 정원 playfield 수집 게임 presentation polish

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #99
Branch: p0-playfield-presentation-polish

## Intent

모바일 탭 구조와 정원 HUD는 안정화됐지만, Phaser playfield 내부 plot은 흐릿한 카드와 반복 라벨처럼 보여 수집형 게임의 기대감을 충분히 주지 못했다. 이번 small win은 현재 활성/수확/잠김/빈 밭 상태를 더 선명하게 보여 “지금 누를 곳”이 바로 보이게 만드는 것이다.

## Acceptance Criteria

- ready plot은 수확 가능 상태가 더 선명하게 보인다.
- locked plot은 긴 텍스트보다 낮은 우선순위의 간결한 잠금 상태로 보인다.
- empty plot은 씨앗을 심을 자리로 읽히는 cue를 가진다.
- 모바일 393/375/360 Playwright gate가 계속 통과한다.
- mobile/desktop screenshot evidence와 visual report가 `reports/visual/`에 저장된다.

## Evidence

- Visual report: `reports/visual/p0-playfield-presentation-polish-20260428.md`
- Mobile 393: `reports/visual/p0-playfield-presentation-polish-mobile-393-20260428.png`
- Mobile 375: `reports/visual/p0-playfield-presentation-polish-mobile-375-20260428.png`
- Mobile 360: `reports/visual/p0-playfield-presentation-polish-mobile-360-20260428.png`
- Desktop: `reports/visual/p0-playfield-presentation-polish-desktop-20260428.png`

## Apply Conditions

- 저장 구조, economy values, content schema, analytics event 이름은 변경하지 않는다.
- 실제 결제/로그인/광고/외부 배포/런타임 이미지 생성은 범위 밖이다.

## Verification

- `npm run check:visual`
- `npm run check:all`
