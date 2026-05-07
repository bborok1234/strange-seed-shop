# User Review — 모모 work/celebrate sprite

- Axis slug: `momo-work-celebrate-sprite`
- Date: 2026-05-07
- Status: approved

## Approval Source

사용자는 `studio-operate`로 계속 진행하라고 지시했고, 각 스튜디오 팀 간 크리틱이 제대로 동작하는지도 확인하라고 요청했다. 또한 이전 대화에서 캐릭터가 도감에만 존재하고 정원에서 움직이지 않는 문제, Browser Use 우선 QA, gpt-image-2 asset 생성 사용, 전체 목표 달성을 우선한다는 지시를 반복해서 남겼다.

## Approved Scope

- 모모를 정원 playfield의 독립 support worker actor로 보이게 한다.
- 신규 work/celebrate sprite strip을 실제 raster asset으로 생성하고 manifest에 accepted 등록한다.
- support worker runtime을 정적 portrait에서 animation binding 우선 계약으로 바꾼다.
- Browser Use `iab` visible QA evidence를 남긴다.
- 팀별 제안과 상호 크리틱 산출물이 실제 파일로 남는지 검증한다.

## Boundaries

- 런타임 이미지 생성은 금지한다.
- 실결제, 외부 배포, 고객 데이터, destructive migration은 범위 밖이다.
- 전체 desktop layout 재설계와 모든 creature animation bible은 이번 WorkUnit 범위 밖이며, 모모 vertical slice 통과 후 후속으로 다룬다.

## Decision

Approved. WorkUnit 0228로 이어간다.
