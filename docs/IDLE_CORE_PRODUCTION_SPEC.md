# Idle Core Production Spec

Status: active
Updated: 2026-05-06
Scope: P0.5 이후 core gameplay, production loop, upgrade loop, offline return, long meta
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-playtest`
Related design docs: `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`
Blocking readiness gate: `docs/PRODUCTION_SLICE_READINESS.md`

## 목적

`docs/DESIGN.md`와 `docs/ART_HUD_PRODUCTION_SPEC.md`는 화면과 HUD의 production bar를 고정했다. 이 문서는 그 화면 안에서 실제로 굴러가야 할 idle core를 정의한다.

이 문서는 `docs/IDLE_CORE_CREATIVE_GUIDE.md`를 폐기하지 않는다. creative guide는 방향성과 vertical-slice 작업 방식을 유지하고, 이 문서는 새 core gameplay WorkUnit의 acceptance, 병목 모델, first 10 minutes target을 더 강하게 고정한다. Phase 0 baseline contract와 충돌하는 결제, 로그인, 실제 광고 SDK, 런타임 이미지 생성, 저장 구조 파괴는 여전히 금지다.

핵심 질문:

- 플레이어는 왜 10초 뒤에도 누를 것이 있는가?
- 왜 5분 뒤에 다음 생명체/업그레이드를 보고 싶은가?
- 왜 앱을 닫았다가 다시 오고 싶은가?
- 왜 숫자가 오른다는 사실이 화면 속 정원 변화로 느껴지는가?
- 왜 다음 issue가 단순 UI polish가 아니라 core loop를 전진시키는가?

## 경쟁작 Core Teardown

이 섹션은 2026-05-06 기준 공식 App Store, Steam, 공식 웹사이트 표면을 확인한 내용에 기반한다.

| Reference | Core loop | 오래 가는 이유 | 이 게임에 가져올 점 | 가져오지 않을 점 |
| --- | --- | --- | --- | --- |
| [Egg, Inc.](https://apps.apple.com/us/app/egg-inc/id993492744) | 닭 부화 -> hen house 확장 -> shipping vehicle -> research -> egg tier -> prestige | 단순한 주 행동을 3D 생산 시뮬레이션, capacity balancing, research, nested prestige로 확장한다. 화면이 메뉴가 아니라 닭 떼가 움직이는 농장이다. | 씨앗/생명체도 화면 속 actor와 시설 capacity를 통해 생산 병목이 보여야 한다. `plot`, `worker`, `delivery/order`, `research`가 서로 물려야 한다. | 압도적인 prestige/계약/아티팩트 복잡도를 P0에 한꺼번에 넣지 않는다. |
| [Idle Miner Tycoon](https://apps.apple.com/us/app/idle-miner-tycoon-gold-digger/id1116645064) | shaft 생산 -> elevator 운반 -> warehouse 출하 -> manager 자동화 -> mine/resource 확장 -> prestige | 생산 라인이 여러 단계라 병목이 명확하다. manager는 automation payoff이고 offline cash가 복귀 이유를 만든다. | 정원도 `생산`, `보관`, `주문/출하`의 병목을 분리한다. 생명체는 manager처럼 역할과 자동화 효과를 가진다. | 20개 mine/resource식 수평 확장을 너무 빨리 열지 않는다. |
| [AdVenture Capitalist](https://apps.apple.com/gb/app/adventure-capitalist-idle-sim/id927006017) | business 구매 -> manager 자동화 -> angel investor reset -> planet/event 확장 | 투자 대상이 병렬로 늘고, manager가 idle화를 열며, angel reset이 반복 성장의 핵심이 된다. events가 새 목표를 준다. | `작물/밭/주문/연구`를 병렬 투자축으로 만들되, P0에서는 2-3개 선택지만 보여준다. reset은 훗날 `계절 포자` 같은 soft prestige로 설계한다. | 돈 숫자만 커지는 추상 business list로 만들지 않는다. |
| [Cookie Clicker](https://store.steampowered.com/app/1454400/Cookie_Clicker/) | 클릭/자동 생산 -> producer 구매 -> upgrade/achievement -> heavenly prestige -> minigame | 처음에는 매우 단순하지만 업그레이드, achievement, mini-game, permanent upgrade가 긴 꼬리를 만든다. | 각 생명체/시설/업그레이드는 achievement 또는 collection milestone과 연결한다. 작은 목표를 많이 둔다. | 텍스트/숫자 목록 중심의 producer UI를 정원 기본 화면으로 가져오지 않는다. |
| [Cell to Singularity](https://celltosingularity.com/) | tap entropy -> life/tech node unlock -> tree 확장 -> 3D habitat/era progression | idle 수치를 발견의 서사와 tech tree로 바꾼다. 다음 node가 항상 보인다. | 연구는 단순 buff tree가 아니라 생명체, 씨앗, 원정, 온실 시설을 여는 discovery map이어야 한다. | 과학 백과식 설명량을 첫 5분에 노출하지 않는다. |
| [Realm Grinder](https://store.steampowered.com/app/610080/Realm_Grinder/) | 건물 수익 -> faction 선택 -> spells/upgrades -> research/reincarnation/excavation | faction마다 play style이 달라져 같은 idle core를 다르게 반복한다. achievement가 실제 빌드에 영향을 준다. | 식물 생명체 family 또는 온실 route가 play style 차이를 만들어야 한다. 예: 잎 생산형, 주문형, 연구형, 원정형. | 초반부터 build guide가 필요한 수준의 선택 복잡도는 금지한다. |
| [Idle Slayer](https://apps.apple.com/us/app/idle-slayer-addictive-clicker/id1526599527) | active running/slaying -> coins/souls -> quests -> ascension skill tree -> gear/world/boss | idle과 active play가 섞이고, ascension/skill tree/gear가 장기 목표를 만든다. offline progression도 유지한다. | 정원 tap/수확은 active play의 감각을 맡고, 자동 생산/원정은 idle 축을 맡는다. `돌보기`, `납품`, `탐험`은 짧은 active beat가 된다. | 플랫폼 액션식 조작 자체는 이 게임의 장르가 아니다. |

## 경쟁작에서 공통으로 보이는 구조

### 1. 한 가지 주 동사로 시작한다

좋은 idle game은 처음부터 시스템 설명을 많이 하지 않는다. Egg, Inc.는 닭을 만들고, Cookie Clicker는 쿠키를 만든다. 이후 생산자, 운송, 연구, prestige가 붙는다.

`이상한 씨앗상회`의 시작 동사:

```text
씨앗을 심고, 톡톡 키워, 생명체를 수확한다.
```

초반 화면에서 이 동사를 찾지 못하면 core 실패다.

### 2. 생산은 숫자가 아니라 보이는 엔진이다

경쟁작은 자원이 오르는 이유를 화면에 둔다. 닭, 광부, 매니저, 생산자, 생물 node가 각각 수치의 출처다.

우리 기준:

- 잎/꽃가루/재료가 오르면 누가 만들었는지 보여야 한다.
- 생산률은 actor와 시설에 귀속된다.
- 수령/납품/업그레이드는 playfield prop 또는 receipt로 남는다.

### 3. 병목이 있어야 업그레이드가 의미 있다

단순히 `+25%`만 누르는 업그레이드는 금방 죽는다. 좋은 idle core는 병목을 만든다.

경쟁작 병목:

- Egg, Inc.: 닭 수, hen house capacity, shipping capacity, egg value, research
- Idle Miner: shaft 생산, elevator 운반, warehouse 출하, manager boost
- AdVenture Capitalist: business 자동화, angel reset, planet/event 별 성장률

우리 병목:

| Bottleneck | 의미 | 화면 표현 | 업그레이드 예 |
| --- | --- | --- | --- |
| Plot capacity | 동시에 키울 수 있는 씨앗 수 | 밭 수, 잠긴 밭, 확장 prop | `밭 확장`, `온실 동선` |
| Worker capacity | 생산에 참여하는 생명체 수와 역할 | actor roster, workbench, support actor | `작업 간식`, `작업대 강화` |
| Storage capacity | offline으로 쌓이는 보상 한도 | 선반, 바구니, 보관 게이지 | `선반 정리`, `물안개 응축` |
| Order throughput | 주문 진행/납품 속도 | order crate, seal, dispatch lane | `주문 준비`, `포장대` |
| Research depth | 새 seed/facility/meta unlock | 연구 노트, clue map | `새싹 기록법`, `온실 단서` |
| Expedition reach | 장기 보상과 rare source | 원정 지도, marker, return crate | `달빛 흔적`, `숲길 조사` |

### 4. Reset/prestige는 “새로움”을 약속한다

Prestige는 단순 초기화가 아니라 다음 run을 다르게 만드는 장치다. Egg, Inc.의 nested prestige, AdVenture Capitalist의 angel investor, Cookie Clicker의 heavenly upgrades, Realm Grinder의 reincarnation 모두 reset 후 더 빠르고 다르게 성장하게 만든다.

P0에서는 prestige를 넣지 않는다. 대신 설계상 slot을 남긴다.

후보 이름:

- `계절 포자`
- `온실 품종 기록`
- `씨앗 계보`

초기 원칙:

- 수집한 생명체와 도감 기억은 reset하지 않는다.
- 첫 prestige는 최소 D3 이후 메타다.
- reset 보상은 다음 run의 성장 속도, rare seed chance, offline storage 중 하나를 강화한다.
- prestige가 없어도 P0 첫 10분은 닫힌 loop로 재미있어야 한다.

### 5. Long meta는 첫 화면에 실루엣만 보여준다

경쟁작은 장기 콘텐츠를 초반부터 전부 열지 않지만, 존재는 보여준다. Egg, Inc.는 egg tier와 prestige, Idle Miner는 여러 mine, Cell to Singularity는 tech tree, Realm Grinder는 faction/research, Idle Slayer는 skill tree/world/boss를 예고한다.

우리 첫 10분에 보여야 할 실루엣:

- 다음 생명체
- 두 번째 밭 또는 생산 슬롯
- 첫 주문
- 첫 연구
- 첫 원정
- 첫 온실 시설

단, 모두 동시에 큰 패널로 펼치면 안 된다. 정원 HUD와 각 탭의 preview로만 짧게 보인다.

## 이상한 씨앗상회 Core Contract

### 한 문장

**이름 있는 식물 생명체를 수확하고, 그 생명체들이 정원의 생산/주문/연구/원정을 자동화하며, 플레이어가 업그레이드 선택과 오프라인 복귀 보상으로 더 희귀한 씨앗을 향해 반복하는 idle collection tycoon.**

### Primary verbs

| Verb | Core role | 화면 표면 |
| --- | --- | --- |
| `심기` | run 시작, 수집 기대 | 정원 plot, 씨앗 탭 |
| `톡톡` | active acceleration | plot feedback, progress |
| `수확` | creature reveal | plot, reveal, 도감 |
| `배치/작업` | automation | playfield actor, production card |
| `수령` | idle reward | resource motion, receipt |
| `납품` | order loop | order crate, dispatch |
| `강화` | bottleneck 해결 | upgrade choice, facility prop |
| `연구` | unlock/map | research note, clue |
| `원정` | long meta/source | expedition tab, marker |
| `복귀` | offline payoff | comeback receipt, stored prop |

### Core loop

```text
씨앗 심기
-> 성장 tap/wait
-> 생명체 수확
-> 생명체가 생산 actor로 합류
-> 자동 생산 잎 수령
-> 주문 납품
-> 업그레이드 선택
-> 새 씨앗/연구/원정/시설 해금
-> 오프라인 복귀 보상
-> 더 희귀한 생명체 목표
```

### First 10 minutes target

| Time | Player state | Required payoff |
| --- | --- | --- |
| 0-10s | 첫 행동 이해 | seed/plot action이 바로 보임 |
| 30-90s | 첫 수확 | 이름 있는 생명체 reveal |
| 90-150s | 자동 생산 이해 | 생명체가 정원에서 일하고 잎 생산 |
| 2-4m | 첫 주문 이해 | order crate progress와 납품 보상 |
| 3-5m | 첫 선택 | 생산 속도, 밭, 주문, 연구 중 2개 이상 선택지 |
| 5-8m | 장기 목표 인지 | 다음 생명체/연구/원정 preview |
| 8-10m | 복귀 기대 | offline storage 또는 다음 수확 대기 상태 |

## Progression Architecture

### Layer 1: First creature loop

목표: 수집 감정과 조작 반응.

- starter seed
- tap growth
- harvest reveal
- creature joins garden
- album memory

실패 조건:

- 첫 수확 전 아무것도 할 수 없다.
- 첫 생명체가 reveal 뒤 화면에서 사라진다.

### Layer 2: Production loop

목표: 생명체가 경제에 참여한다.

- creature base rate
- production tick
- claim reward
- worker roster
- production upgrade

수식 방향:

```text
leaf_per_min =
  sum(creature_base_rate * role_multiplier)
  * facility_multiplier
  * temporary_boost_multiplier
```

P0에서는 수식보다 화면 출처가 중요하다. 각 rate delta는 actor 또는 facility에 귀속되어야 한다.

### Layer 3: Order loop

목표: 생산 자원에 목적을 부여한다.

- order requirement
- progress from production claim
- dispatch/receipt
- reward currency or unlock source

주문은 resource sink다. 주문이 없으면 생산은 숫자 증가로만 남는다.

### Layer 4: Upgrade choice loop

목표: 플레이어가 성장 방향을 고른다.

업그레이드 선택지는 항상 아래 중 하나를 건드린다.

- speed: 더 빨리 생산
- capacity: 더 많이 저장/동시 진행
- throughput: 주문/납품 처리 향상
- unlock: 새 seed/research/expedition
- quality: rare chance 또는 reward tier

P0.5 화면 기준 한 번에 보여줄 선택지는 2-4개다.

### Layer 5: Research/expedition meta

목표: 다음 생명체와 long-term source.

- research clue opens specific seed target
- expedition consumes clue/creature requirement
- expedition returns material/source
- source unlocks rare seed or facility

연구와 원정은 서로 분리된 탭이 아니라 `단서 -> 준비 -> 귀환 -> 새 목표`로 연결된다.

### Layer 6: Offline return

목표: 다시 열었을 때 바로 보상과 다음 행동.

오프라인 보상은 아래 3가지를 동시에 보여야 한다.

- 누가 벌었는지: worker/facility attribution
- 얼마나 쌓였는지: stored leaves/materials
- 무엇을 할 수 있는지: claim, order, upgrade, harvest

복귀 modal만 있고 정원 상태가 그대로면 실패다.

### Layer 7: Future prestige slot

목표: 장기 반복의 이유.

P0 이후 열 수 있는 구조:

```text
온실 계절 종료
-> 일부 생산/시설 진행 reset
-> 도감/생명체/기억 유지
-> 계절 포자 획득
-> 다음 계절 성장률/희귀도/저장량 보너스
```

이 구조는 지금 구현하지 않는다. 다만 연구/원정/시설 이름과 save model이 완전히 막히지 않게 둔다.

## WorkUnit Acceptance Template

새 core gameplay issue는 아래를 반드시 적는다.

```text
Game Studio route:
Player verb:
Core loop layer:
Reference teardown:
Screen moment:
Resource/bottleneck affected:
Required actor/prop/FX:
First 10m impact:
Offline/comeback impact:
Acceptance:
Visual/playtest evidence:
```

`색`, `여백`, `문구`, `카드 정리`만 있는 issue는 이 문서 기준으로 core issue가 아니다. 단, 위 항목 중 3개 이상을 실제로 개선하면 visual polish가 core slice의 일부가 될 수 있다.

## P0.6 추천 Core Slices

`P0.6`은 이 문서 안에서는 다음 후보 slice 묶음이다. Roadmap이 별도 active milestone로 승격하기 전까지는 확정 단계명이 아니며, P0.5를 건너뛰거나 Phase 0 baseline contract를 대체하지 않는다.

### Slice A: Bottleneck-readable production graph

- 현재 잎 생산률이 어떤 생명체/시설/주문 병목에서 오는지 보여준다.
- `생산`, `보관`, `납품` 중 부족한 축을 다음 upgrade choice로 제시한다.
- Inspired by: Egg, Inc. capacity balancing, Idle Miner shaft/elevator/warehouse.
- This is the first blocking readiness slice. See `docs/PRODUCTION_SLICE_READINESS.md`.

### Slice B: Offline return as garden state

- 복귀 보상을 modal 수치가 아니라 선반/바구니/order crate 상태로 남긴다.
- claim 뒤 즉시 주문 또는 업그레이드로 이어진다.
- Inspired by: Idle Miner offline cash, Idle Slayer offline progression.

### Slice C: Research tree as collection map

- 연구 노트가 다음 씨앗/생명체/원정 source를 visual map으로 예고한다.
- 단순 buff tree가 아니라 collection desire를 만든다.
- Inspired by: Cell to Singularity tech tree.

### Slice D: Creature family role differentiation

- 생명체 family가 생산형, 주문형, 연구형, 원정형 중 하나의 play style 차이를 가진다.
- 첫 2-3종만 적용한다.
- Inspired by: Realm Grinder faction play styles.

### Slice E: Commission/contracts-lite

- 기간제 monetization event가 아니라, 작은 일일/연속 주문 목표를 둔다.
- 보상은 rare seed source, material, research clue 중 하나다.
- Inspired by: Egg, Inc. contracts and AdVenture Capitalist events, but P0-safe.

## 금지선

- 첫 5분 전에 prestige, season, faction, event를 모두 노출하지 않는다.
- 숫자 성장만 있고 actor/prop 변화가 없으면 core 개선으로 보지 않는다.
- offline reward를 claim modal 하나로 끝내지 않는다.
- upgrade가 무엇을 개선하는지 화면에서 추론할 수 없으면 실패다.
- 새 재화를 추가할 때는 source, sink, 화면 prop, unlock target을 같이 정의한다.
- 실제 광고, 결제, 계정, 외부 배포는 Phase 0 범위 밖이다.
