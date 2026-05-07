# Designer Proposal — 모모 Work/Celebrate Actor

## Player Verb

정원 화면의 플레이어 동사는 `생산 잎 수령`과 `다음 성장 선택`이다. 모모는 이 동사를 설명하는 장식이 아니라, “포리 혼자 일하는 정원”이 “동료 둘이 자동 생산하는 정원”으로 바뀌었다는 증거여야 한다.

## Session Context

이 axis는 첫 5분과 첫 재방문 사이를 건드린다. 내가 첫 생명체 포리를 얻은 뒤 두 번째 생명체 모모를 합류시키면, 화면은 즉시 “수집한 생명체가 실제 생산 엔진에 들어갔다”는 보상을 줘야 한다. 모모가 정적 초상으로만 남으면 수집 보상은 도감 카드에서 끝나고, 플레이어는 다음 씨앗을 키울 이유를 숫자 성장에서만 찾게 된다. 반대로 모모가 정원에서 작게라도 일하고, 수령/주문 완료 순간에 반응하면 “다음 생명체도 작업 방식이 다르겠지?”라는 기대가 생긴다.

## Screen Flow

1. `정원` 기본 상태에서 포리는 주 작업자, 모모는 보조 작업자로 읽힌다.
2. 자동 생산 중에는 포리와 모모가 같은 카드 안에 갇히지 않고, playfield의 작업대/plot 주변에 anchor를 가진다.
3. `생산 잎 수령` 또는 주문/연구 완료 receipt가 발생하면 모모는 짧은 celebrate 반응을 보여준다.
4. 반응 후에는 다시 work loop로 돌아가며, 플레이어의 다음 행동은 bottom action surface의 추천 성장 선택으로 이어진다.

탭 비용은 늘리지 않는다. 모모의 상태를 보려고 도감이나 별도 상세 패널을 열게 만들면 이 axis는 실패다.

## Information Hierarchy

정원 첫 화면에서 우선순위는 아래 순서다.

1. 지금 누를 수 있는 주요 행동: `생산 잎 수령`, `주문 납품`, `씨앗 심기` 중 하나
2. 현재 정원에 일하는 생명체: 포리와 모모의 위치, 이름, 작업 상태
3. 생산 결과: 분당 생산량, 보관량, 수령 가능 여부
4. 다음 성장 선택: 보관 바구니, 생산 속도, 주문 준비 같은 다음 목표

모모 label은 긴 설명이 아니라 `보조 수호자`, `잎 운반 중`, `납품 도와요`처럼 1줄 상태로만 둔다. 상세한 스탯은 production card 안에서 보이되, playfield 위 텍스트가 모모를 덮거나 plot label과 경쟁하면 안 된다. 모모의 위치는 떠다니는 임의 좌표가 아니라 첫 번째/두 번째 plot 사이, 주문 crate 옆, 또는 production card의 actor strip 중 하나에 고정되어야 한다.

## Proposed UX Behavior

- Work state: 모모는 포리보다 약간 작고 안정적인 보조 actor로, 방패/잎을 들고 짧은 왕복 또는 고개 끄덕임 loop를 가진다.
- Celebrate state: 수령/완료 순간에는 모모가 0.8-1.2초 정도 튀어 오르거나 방패잎을 들어 올리고, 잎 delta 또는 receipt motion과 연결된다.
- Reduced motion: 반복 loop는 약하게 줄이더라도 수령/완료 feedback은 색 변화, pose frame, receipt plate로 남긴다.
- HUD relationship: 모모가 action card 안의 원형 portrait 뒤에 묻히면 안 된다. card 안에는 작은 roster icon만 허용하고, 실제 “일하는 모모”는 playfield actor로 보여준다.

## Acceptance Criteria

- Browser Use `iab` 393x852 또는 현재 in-app browser 화면에서 모모가 포리와 별개의 support worker actor로 식별된다.
- 모모 work state는 정적인 portrait 한 장이 아니라 animation binding 또는 frame strip 기반의 반복 상태를 가진다.
- `생산 잎 수령`, 주문 완료, 연구 완료 중 최소 하나의 상태 변화에서 모모 celebrate state가 1회 이상 관찰된다.
- 모모 actor, plot label, resource HUD, bottom tabs가 서로 겹치지 않는다.
- 모모 관련 텍스트는 1줄 상태 plate 또는 production card의 짧은 roster 설명으로 제한된다.
- 360px, 393px, desktop-centered mobile frame에서 모모의 얼굴/실루엣이 잘리지 않고 48px 이상으로 읽힌다.
- visual QA evidence는 before/after screenshot과 “모모가 작업 중/축하 중으로 보인다”는 finding을 남긴다.

## Disagreements I Anticipate

- Art Director가 모모를 더 크게 보여주고 싶어 할 수 있지만, plot 조작과 bottom action surface를 가리면 player verb를 해친다.
- Engineer가 정적 portrait에 CSS bounce만 얹는 최소 구현을 제안할 수 있지만, 이 axis의 핵심은 두 번째 생명체가 독립 actor state를 갖는 것이다.
- Director가 이번 scope를 “sprite만 추가”로 좁히려 할 수 있지만, sprite가 어디에 anchor되고 어떤 상태를 읽히는지까지 정하지 않으면 또 도감용 asset이 된다.

## Open Questions

- 모모의 첫 gameplay role은 `수호자` 정체성을 살려 주문/보관 보호 보너스로 읽힐지, 아니면 현재 생산 roster에 맞춰 단순 잎 생산 보조로 읽힐지 결정이 필요하다.
- celebrate trigger를 `생산 수령`에만 둘지, `주문 납품 완료`와 `연구 완료 receipt`에도 재사용할지 Engineer와 Art Director가 범위를 나눠야 한다.
- 향후 모든 생명체에 같은 actor state contract를 강제할지, P0.5에서는 포리/모모 2체 vertical slice만 production bar로 삼을지 Director가 정해야 한다.
