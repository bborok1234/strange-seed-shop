# Designer Critique — 모모 Work/Celebrate Sprite

## 판정

세 제안은 같은 방향을 보고 있다. 모모는 카드 안의 원형 초상이 아니라 정원 playfield에서 포리와 구분되는 support worker로 보여야 하며, work loop와 claim/complete 순간의 짧은 celebrate 반응까지 있어야 한다. 이 축의 player verb는 `자동 생산을 지켜보고 보상을 수령한다`이며, 성공 조건은 "내가 얻은 두 번째 생명체가 실제 정원 생산에 합류했다"가 첫 화면에서 읽히는 것이다.

## Proposal별 크리틱

### Designer proposal

Player verb, 첫 5분 맥락, 정보 위계는 정확하다. 특히 모모를 보기 위해 도감이나 별도 패널을 열게 하지 않는다는 기준은 반드시 유지해야 한다. 다만 "주문 완료, 연구 완료, 생산 수령 중 최소 하나"로 trigger를 열어두면 구현 후 QA에서 무엇을 봐야 하는지 흐려질 수 있다. 이번 slice는 production claim을 primary trigger로 고정하고, 주문/연구 완료는 같은 celebrate strip을 재사용할 수 있는 후속 확장으로 남기는 편이 더 선명하다.

### Art Director proposal

정적 portrait pulse를 금지하고 6-frame strip, 48px 판독성, transparent raster, honey glint 같은 제작 조건을 구체화한 점은 좋다. plot 위 임의 좌표 대신 workstage/support anchor를 요구한 것도 playfield protection 관점에서 맞다. 다만 `leaf tick FX`, `honey sparkle`, `afterimage`, `crate/order trigger`까지 한 번에 넣으면 화면의 주동사가 `보상 수령`인지 `장식 감상`인지 흐려질 수 있다. 첫 PR에서는 모모의 silhouette, work loop, claim celebrate가 먼저이고, FX는 actor 주변 1회성 보조 효과로 제한해야 한다.

### Engineer proposal

support worker에 primary actor와 같은 animation descriptor를 붙이고, manifest binding과 test hook을 둔 것은 이 축을 반복 가능한 production contract로 바꾸는 올바른 접근이다. save migration을 피하고 `creatureIds` 기반으로 계산하는 것도 player state를 불필요하게 복잡하게 만들지 않는다. 그러나 celebrate를 data hook까지만 넣고 실제 one-shot 재생을 다음 PR로 미루면, 사용자 눈에는 또 "움직이는 척하는 계약"으로 보일 위험이 있다. 최소한 production claim QA mode에서는 모모 celebrate가 실제로 한 번 관찰되어야 한다.

## Blocking Concerns

1. `work strip + manifest binding`만 있고 정원 첫 화면에서 모모가 포리와 별개의 actor로 읽히지 않으면 실패다.
2. celebrate가 실제 화면에서 관찰되지 않고 `data-celebrate-animation-asset` 같은 내부 계약에만 남으면 이번 축의 game-feel 목표를 달성하지 못한다.
3. support actor, plot label, production card, bottom action surface가 서로 경쟁하면 새 sprite를 추가해도 playfield protection 실패다.

## Must-have Acceptance Criteria

1. Browser Use `iab` 393x852와 desktop-centered mobile frame에서 `방패새싹 모모`가 48px 이상 silhouette로 보이고, 포리와 다른 위치/역할의 support worker로 식별된다.
2. `qaResearchExpeditionReady=1` 정원에서 모모 work state는 정적 portrait/CSS bounce가 아니라 6-frame raster sprite strip 기반 animation binding으로 반복 재생된다.
3. production claim 또는 동등한 QA trigger를 실행하면 모모 celebrate strip이 최소 1회 실제 화면에서 관찰되고, 그 순간 plot label/resource HUD/bottom tab을 가리지 않는다.

## Compromise Recommendation

이번 PR은 `모모 work loop + production claim celebrate + support actor anchor/test`까지를 닫고, 주문/연구/원정 trigger 확장과 추가 FX vocabulary는 다음 생명체 animation slice로 넘긴다. 이렇게 하면 Art Director의 "정적 UI 탈출" 목표와 Engineer의 "한 PR 안에서 검증 가능한 계약"을 동시에 만족하면서, Designer 관점의 player verb도 흐려지지 않는다.

## Self-critique

Designer proposal은 player journey를 넓게 보려는 장점이 있지만, 주문/연구/수령 trigger를 모두 열어두면 첫 implementation slice가 과도하게 넓어질 수 있었다. 이번 critique에서는 primary trigger를 production claim으로 좁혀 QA가 실제 화면에서 무엇을 확인해야 하는지 명확히 했다.
