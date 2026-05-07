# Senior Critic Critique — 모모 work/celebrate sprite

## 판단

이 axis는 사용자 불만의 중심을 건드린다. "캐릭터가 도감에만 있고 정원에서는 안 산다"는 문제에 대해 모모를 두 번째 독립 worker actor로 세우는 방향은 맞다. 하지만 현재 제안들은 아직 안전한 작은 변경으로 도망갈 여지가 크다. 특히 Engineer 제안의 "celebrate는 data hook만 두고 다음 PR"은 사용자가 비판한 바로 그 패턴, 즉 스펙은 그럴듯한데 화면에서 체감 변화가 약한 작업이 될 위험이 있다.

## Blocking Concerns

1. **work loop만으로는 경쟁작 수준 game-feel에 못 닿는다.**  
   Cats & Soup류 reference의 핵심은 캐릭터가 "계속 움직인다"가 아니라 생산/수령/완료 순간에 플레이어 행동과 반응이 연결되는 것이다. 모모 work strip만 붙이고 claim/order/research 순간에 실제 celebrate가 보이지 않으면, 이 PR은 정적 portrait를 움직이는 portrait로 바꾼 수준에서 멈춘다.

2. **Browser Use QA가 acceptance의 중심이어야 한다.**  
   DOM에 `data-animation-asset`이 있고 frame count가 맞아도 화면에서 모모가 plot label, production card, resource HUD 사이에 묻히면 실패다. 이 axis는 코드 계약 검증보다 `iab` visible screenshot에서 "포리와 다른 모모가 실제로 일하고 반응한다"가 먼저 증명되어야 한다.

3. **팀 합의가 너무 빠르게 "foundation PR"로 축소되고 있다.**  
   Designer와 Art Director는 독립 actor와 celebrate를 요구했는데 Engineer는 celebrate runtime을 다음 PR로 밀 수 있다고 했다. Director가 여기서 work loop만 선택하면, "전체를 갈아엎어도 목표 달성이 중요하다"는 사용자 지시를 또 안전범위로 축소한 결정이 된다.

## Must-Have Acceptance Criteria

1. `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`에서 Browser Use `iab` 393x852 screenshot상 모모가 포리와 별개의 support worker actor로 48px 이상 식별되고, 원형 portrait mask나 카드 내부 장식으로 보이면 실패로 기록한다.

2. 생산 수령, 주문 완료, 연구 완료, support worker 합류 중 최소 하나의 실제 사용자 행동 후 모모의 celebrate state가 화면에서 1회 이상 관찰되어야 한다. `data-celebrate-animation-asset`만 있고 visible one-shot 반응이 없으면 불합격이다.

3. 신규 모모 work/celebrate strip은 accepted raster PNG로 manifest에 등록되고, provenance, frame count, frame size, frame rate, animation binding, source creature identity, alpha/background 검증을 통과해야 한다. CSS bounce나 정적 초상 pulse는 이 기준을 대체할 수 없다.

## Go / No-Go

**조건부 Go.** work strip + support worker binding만으로는 No-Go이고, 모모 celebrate가 실제 화면에서 관찰되는 범위까지 포함하면 Go다. 이번 spec은 "나중에 생명체별 motion vocabulary를 만들 기반"이 아니라 "이번 화면에서 두 번째 생명체가 살아 움직인다는 증거"를 목표로 잠가야 한다.

## 내가 아직 못 깬 hidden assumption

모모 한 명의 개선이 전체 비주얼 경쟁력 문제를 충분히 대표한다는 가정은 아직 검증되지 않았다. 다만 현재 정원에서 두 번째 생명체가 이미 생산 roster에 들어와 있으므로, 이 vertical slice를 통과하지 못하면 더 큰 리디자인도 신뢰할 수 없다.
