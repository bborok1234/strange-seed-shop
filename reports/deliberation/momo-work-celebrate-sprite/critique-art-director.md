# Art Director Critique — 모모 Work/Celebrate Sprite

## 판정

세 제안은 같은 문제를 제대로 겨냥한다. 현재 모모는 `creature_herb_common_002` accepted creature이지만 manifest상 `album_card` 1254x1254 정적 초상이고, production strip 계약은 포리(`creature_herb_common_001`)에만 있다. 따라서 이번 axis의 통과선은 "모모 이미지를 흔든다"가 아니라, 모모가 방패잎 silhouette을 가진 독립 support actor로 work/celebrate state를 갖는 것이다.

## Blocking Concerns

1. 정적 초상 + CSS bob은 이 축의 실패 조건이다. Engineer proposal의 fallback은 continuity용으로만 허용해야 하며, acceptance에는 `sprite_creature_herb_common_002_work_strip`의 spritesheet binding이 반드시 들어가야 한다.
2. 모모 identity가 포리 strip의 변형처럼 보이면 실패다. 48-64px 표시에서도 broad leaf shield, 둥근 얼굴, 짧은 발, guardian stance가 읽혀야 하며, 포리의 통통 튀는 수집가 motion과 다른 shield sway vocabulary를 가져야 한다.
3. gpt-image-2 생산물은 alpha와 frame consistency를 통과하기 전까지 accepted asset이 아니다. 6프레임 가로 strip, 96x96 frame, 동일 anchor, 동일 scale, no text, no circular badge, no white matte가 깨지면 manifest 등록을 막아야 한다.

## Proposal Critique

Designer proposal은 player verb와 screen flow를 잘 닫았다. 특히 모모를 도감/상세 패널로 보내지 않고 정원 playfield actor로 보여야 한다는 기준은 맞다. 다만 "첫 번째/두 번째 plot 사이, 주문 crate 옆, 또는 production card actor strip"처럼 anchor 후보가 넓어서, spec에서는 하나의 primary anchor를 고정해야 한다. Art 기준으로는 workstage card 내부 원형 portrait가 아니라 floor/workbench edge에 붙은 `workstage.actor.support`가 가장 덜 위험하다.

Engineer proposal은 기존 포리 strip 계약을 재사용하고 support worker에 animation descriptor를 붙이는 방향이 맞다. 다만 celebrate를 data hook까지만 두고 실제 one-shot 노출을 다음 PR로 미루면, 사용자에게는 "또 실제로 바뀐 게 없다"로 보일 위험이 있다. 최소 통과선은 work loop 실노출이고, celebrate는 짧은 claim/order receipt 순간에 1회 보이거나 Browser Use에서 강제 QA state로 관찰 가능해야 한다.

내 Art Director proposal도 risk가 있다. 96px strip과 54-60px runtime display를 동시에 요구하면 생성물의 작은 크기 판독성이 흔들릴 수 있다. 그래서 prompt/review는 예쁜 full-size character보다 `48px silhouette read`와 `same baseline anchor`를 더 우선해야 한다.

## Must-Have Acceptance Criteria

1. `sprite_creature_herb_common_002_work_strip`와 `sprite_creature_herb_common_002_celebrate_strip`는 raster PNG, transparent alpha, 576x96, 6 frames, 96x96 frame, 각각 10fps loop / 12fps one-shot 계약으로 manifest에 accepted 등록된다.
2. Browser Use `iab`의 `qaResearchExpeditionReady=1` 정원 화면에서 모모 support actor는 원형 portrait나 정적 카드 이미지가 아니라 `data-animation-asset="sprite_creature_herb_common_002_work_strip"`를 가진 독립 actor로 보인다.
3. 393x852, 360x800, desktop-centered mobile frame에서 모모 얼굴과 방패잎 silhouette이 plot label, resource HUD, bottom nav, production card에 잘리지 않고 최소 48px visual read를 유지한다.

## Compromise Recommendation

이번 PR은 전체 creature animation bible을 만들지 말고, 모모 work strip 실노출 + celebrate strip accepted asset + Browser Use QA state에서 celebrate 1회 관찰까지를 단일 vertical slice로 닫는다. 이렇게 하면 Designer의 "도감 밖 캐릭터" 목표, Engineer의 runtime 계약 안정성, Art의 silhouette/motion 품질 기준이 모두 최소한으로 충족된다.
