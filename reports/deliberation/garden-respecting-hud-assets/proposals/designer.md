# Designer Proposal — garden-respecting-hud-assets

## Player Verb

이 화면의 player verb는 **정원 장면을 보면서 지금 키울 밭을 톡톡 누르고, 준비된 보상을 수확하거나 납품한 뒤, 다음에 심을 씨앗/목표를 고르는 것**이다.

내가 처음 이 게임을 켜면 “정원이 예쁘다”보다 먼저 “어디를 누르면 첫 씨앗이 자라나?”를 알아야 한다. 왜 HUD asset이 필요한가? cream rectangle을 덜 보이게 하려는 장식이 아니라, 밭·주문 상자·자원·다음 행동이 정원 안의 물건처럼 읽혀서 내가 플레이필드에서 바로 행동하게 만들기 위해서다. 왜 그 정보가 그 위치에 있어야 하나? idle/tycoon에서는 자원과 다음 목표가 항상 시야 안에 있어야 하지만, 조작 대상인 밭과 생명체를 밀어내면 생산 엔진이 아니라 앱 패널이 된다.

## Session Context

이 axis가 건드리는 핵심 여정은 **첫 30초 + 첫 5분 + 데일리 복귀**다.

- 첫 30초: 저장 데이터가 없거나 starter 단계일 때, 플레이어는 `첫 씨앗 선택 -> 정원에서 심기`로 바로 들어가야 한다. 데스크톱에서 `starter-panel`이 숨겨진 현재 구조는 art share에는 유리하지만, `side-dock-next-action`이 작은 텍스트 카드로만 남으면 “첫 씨앗을 어디서 시작하지?”가 약해진다.
- 첫 5분: `말랑잎 씨앗` 30초 성장, 탭 단축, 첫 수확, 도감 보상, 두 번째 밭/다음 생명체 목표까지 이어진다. HUD asset은 이 흐름에서 `밭 상태`, `수확 가능`, `주문 상자 진행`, `다음 목표 씨앗`을 한 화면의 게임 사물로 묶어야 한다.
- 데일리 복귀: 복귀 보상은 숫자 요약보다 “정원에서 뭔가 준비되어 있다”가 먼저 보여야 한다. 자원 HUD는 지갑이 아니라 잎 바구니/꽃가루 병/재료 상자로 읽혀야 하고, 다음 행동 표지는 `수령`, `납품`, `씨앗 보러가기` 중 하나로 닫혀야 한다.

현재 코드 근거는 `src/App.tsx`의 `.garden-stage`, `.garden-panel`, `.side-dock`, `.side-dock-card`, `GardenPlayfieldHost`의 React plot overlay, `GardenScene`의 Phaser plot rendering이다. 현재 manifest 근거로는 `ui_album_card_frame_001`, `ui_order_crate_leaf_001`, 생산/납품 FX가 있으나, resource HUD frame, next-action signpost, plot marker/frame 전용 vocabulary가 부족하다.

## Screen Flow

1. **정원 기본 진입**
   - 플레이어가 보는 첫 층은 배경 정원과 활성 plot이다.
   - HUD asset 1순위는 plot card를 “카드”가 아니라 **흙 표지/화분 자리/밭 말뚝**으로 읽히게 하는 것이다.
   - 빈 밭은 `+` 카드보다 “심을 자리”로, 성장 중 밭은 “톡톡 누르면 줄어드는 자리”로, 수확 가능 밭은 “수확할 열매가 열린 자리”로 보여야 한다.

2. **다음 행동**
   - `nextAction.title`은 사이드 dock의 작은 문구로만 두면 첫 세션에서 약하다.
   - 첫 세션과 복귀 세션에서는 next-action을 **정원 표지판 asset**으로 격상해야 한다. 단, 이것은 긴 설명 패널이 아니라 한 줄 목표 + 하나의 CTA로 닫혀야 한다.
   - 한 verb를 위해 3 tap 이상 들면 실패다. `씨앗 보러가기 -> 구매 -> 정원 돌아가기 -> 심기`가 필요한 상태라면, next-action 표지는 가능한 경우 `구매하고 심기` 또는 `정원에서 심기`로 줄여야 한다.

3. **자원 HUD**
   - `잎/꽃가루/재료`는 데스크톱 side dock과 모바일 top HUD에 계속 남아야 한다. idle/tycoon convention상 자원은 항상 visible해야 한다.
   - 다만 현재처럼 같은 cream card 안의 텍스트 숫자면 정원 fantasy와 분리된다. resource asset은 **잎 바구니, 꽃가루 유리병, 재료 상자**처럼 플레이어가 “모은 물건”으로 받아들이는 최소 아이콘/받침 역할을 해야 한다.

4. **주문/생산**
   - `ui_order_crate_leaf_001`은 이미 주문 상자의 좋은 시작점이다. 다음 구현 cycle은 새 asset을 무작정 늘리기보다 이 주문 상자 언어를 dock과 playfield의 진행 상태까지 확장해야 한다.
   - 생산/주문 surface의 verb는 `생산 잎 수령`과 `납품`이다. asset은 카드 frame보다 `상자가 차오른다`, `봉인됐다`, `출하됐다`가 읽히는 상태 표지에 우선 배정해야 한다.

5. **탭/보조 화면**
   - 좌측 rail과 하단 tabs는 정원물 asset 우선순위가 낮다. navigation은 ambient해야 하고, 플레이어의 첫 5분 verb를 훔치면 안 된다.
   - 씨앗/도감/원정/상점 탭은 이번 axis의 주 대상이 아니다. 단, 다음 목표 seed/creature를 정원 HUD에서 누르면 해당 탭으로 이동하는 bridge는 유지되어야 한다.

## Information Hierarchy

1. **L0: 정원과 생명체/밭**
   - 가장 먼저 보여야 하는 것은 배경 정원, 활성 plot, 생산 actor다.
   - plot asset은 HUD이면서 playfield 사물이어야 한다. cream card를 줄이는 가장 큰 효과는 여기서 나온다.

2. **L1: 지금 가능한 행동**
   - `수확!`, `톡톡 성장`, `납품 가능`, `첫 씨앗 심기` 같은 현재 verb가 가장 강해야 한다.
   - next-action signpost는 항상 하나의 주 verb만 말해야 한다. “다음 행동”, “도감”, “주문”, “업그레이드”를 한 표지에 다 넣으면 app dashboard로 돌아간다.

3. **L2: 진행 중인 목표**
   - 주문 진행률, 다음 생명체, 도감 진행은 보조 목표다.
   - 이 정보는 사이드 dock에 남되, card frame보다 **표지판/리본/꼬리표**처럼 작은 정원물로 읽히게 해야 한다.

4. **L3: 자원**
   - 자원 숫자는 항상 보이되, focal point가 되면 안 된다.
   - resource icon/decal은 숫자를 장식하는 것이 아니라 “수확/납품 보상이 여기로 들어왔다”는 reward loop를 닫는 anchor다.

5. **L4: Navigation**
   - rail/bottom tabs는 목적지 전환 장치다. 이번 axis에서 가장 마지막에 만져도 된다.
   - 탭 자체를 정원 장식으로 과도하게 꾸미면 첫 화면의 verb가 흐려진다.

### Asset Sequencing Proposal

1. **Plot marker/frame set**: empty/growing/ready 상태를 카드가 아니라 밭 사물로 읽히게 하는 raster UI asset vocabulary. 첫 30초와 첫 5분 clarity에 가장 직접적이다.
2. **Next-action signpost**: 첫 씨앗, 수확, 납품, 다음 씨앗 목표를 한 줄로 안내하는 정원 표지판 계열. desktop starter-panel hide로 약해진 onboarding을 회복한다.
3. **Resource holder icons**: 잎 바구니, 꽃가루 병, 재료 상자. reward motion의 도착점으로 쓴다.
4. **Order crate state extensions**: 기존 `ui_order_crate_leaf_001`의 상태 변형 또는 같은 언어의 crate tag. 생산/납품 loop 이해도를 높인다.
5. **Dock/card decal pass**: 위 1-4가 화면 verb를 회복한 뒤, side dock card를 덩굴/리본/온실 유리 장식으로 덜 rectangular하게 만든다.

## Disagreements I Anticipate

- Art Director가 전체 dock과 rail을 먼저 정원 장식으로 꾸미자고 하면 반대한다. 내가 플레이어라면 첫 30초에는 rail 장식보다 “밭을 누르면 자란다”가 먼저 필요하다.
- Engineer가 CSS background와 border 조정만으로 충분하다고 하면 반대한다. 본 axis의 문제는 computed color 차이가 아니라 플레이어가 HUD를 게임 사물로 읽지 못하는 것이다. 단, layout behavior와 accessibility는 기존 DOM 구조를 유지해도 된다.
- Director가 이 axis를 “visual polish”로만 취급하면 반대한다. `Player verb + screen moment + asset/FX + playtest evidence` 중 최소 3개가 없으면 북극성 vertical slice가 아니다.
- resource HUD를 숨기거나 축소하는 안에는 반대한다. idle/tycoon convention상 자원과 다음 목표는 visible해야 하며, 문제는 정보량이 아니라 정보가 앱 카드처럼 보이는 방식이다.
- 새 asset을 creature/seed roster 확장으로 쓰는 안에는 반대한다. 이번 범위는 새 수집 대상이 아니라 기존 loop의 표지, holder, crate, frame vocabulary다.

## Open Questions

1. 첫 구현 cycle의 primary acceptance는 `첫 30초 starter clarity`와 `loaded garden art-share` 중 어느 쪽을 더 높은 tie-breaker로 둘 것인가?
2. plot marker/frame은 React overlay에 남길지, Cycle B의 in-canvas diegetic UI로 넘길지 Director가 sequencing을 정해야 한다.
3. resource holder icon 3종은 이번 axis에서 생성할 필수 asset인가, 아니면 order/plot payoff 후속으로 미뤄도 되는가?
4. Browser Use playtest에서는 fresh save, loaded save, desktop expanded dock, mobile garden 중 어떤 2개 상태를 Phase 2 spec의 최소 증거로 고정할 것인가?
