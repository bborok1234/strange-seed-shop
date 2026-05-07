# 이상한 씨앗상회 프로덕션 세부 기획서

Status: active production companion spec
Updated: 2026-05-08
Owner: Studio
Parent: `docs/GAME_BIBLE.md`
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:sprite-pipeline` -> `game-studio:game-playtest`

## 1. 목적

이 문서는 `docs/GAME_BIBLE.md`의 게임 방향을 실제 제작 가능한 표와 계약으로 내린다. 바이블은 정체성, 루프, 금지선, 품질 기준을 소유하고, 이 문서는 기획자, 프로듀서, 엔지니어, 아티스트, QA가 다음 질문에 바로 답할 수 있게 한다.

- 어떤 화면과 상태를 만들어야 하는가?
- 어떤 데이터 레코드가 필요한가?
- 첫 5분, D1, D7, D30의 콘텐츠와 경제 목표는 무엇인가?
- 어떤 asset/FX가 production-ready 주장에 필요하며, 어떤 검증으로 닫는가?

이 문서는 구현 코드를 대신하지 않는다. 모든 수치는 첫 production pass의 기준값이며, playtest와 economy simulation으로 조정한다.

## 2. 제작 범위와 출시 단위

### v1 Launch Slice

v1 Launch는 “출시 가능한 첫 세로 절단면”이다. 완전한 D30 endgame을 모두 구현하지 않더라도 첫 5분, D1 복귀, D7 실루엣, D30 목표 실루엣이 한 제품처럼 연결되어야 한다.

| 범위 | 필수 | 제외 |
| --- | --- | --- |
| 첫 5분 | 씨앗 선택, 심기, 돌보기, 수확, 첫 생명체 actor 합류, 첫 생산 수령, 첫 병목 선택 | 복잡한 튜토리얼 챕터, 유료 상점 |
| D1 | 첫 주문, storage/offline 병목, 작업대 강화, research note preview, 15분 복귀 payoff | 다중 원정 지역, 시즌 이벤트 |
| D7 | 3개 이상 family, research clue map, 원정 문, 두 번째 구역 unlock | 실시간 협동, 랭킹 |
| D30 | 5개 이상 family 목표, 3개 이상 구역, decoration ownership, rare source, prestige preview | 실제 prestige reset, 실제 광고/결제 |

### Production Stop Line

아래 중 하나라도 빠지면 production-ready가 아니라 prototype이다.

| 축 | 통과 기준 |
| --- | --- |
| Player verb | 화면에서 직접 수행 가능한 핵심 행동이 있다 |
| System result | 행동 후 simulation state가 바뀐다 |
| Screen moment | 변화가 world, HUD, receipt, FX 중 2개 이상에 남는다 |
| Asset/FX | 상태 변화가 raster asset 또는 sprite/FX로 읽힌다 |
| Playtest evidence | fresh start, mobile, first 5m 또는 해당 scripted path 증거가 있다 |

## 3. Player Journey 상세

### 첫 5분 Script

| Step | 시간 목표 | 플레이어 행동 | 시스템 결과 | 화면/연출 | 실패 조건 |
| --- | ---: | --- | --- | --- | --- |
| `start_garden` | 0-3초 | 첫 행동 파악 | 무료 starter seed와 빈 plot 노출 | unlocked plot 2개, locked preview 1개, objective chip | 시작 행동이 패널 설명에 묻힘 |
| `plant_starter` | 0-20초 | 말랑잎 씨앗 심기 | plot state `planted`, timer 시작 | plot sprout, caretaker 관심 표시, action rail 전환 | 잎 0 상태에서 진행 불가 |
| `care_growth` | 20-60초 | 탭/돌보기 | growth timer 단축, care count 기록 | care spark, plot scale/leaf motion | 탭이 숫자만 바꿈 |
| `harvest_first` | 60-90초 | 수확 | 첫 생명체 생성, album record pending | focus camera, reveal, 이름/역할/인사말 | 생명체가 currency icon처럼 보임 |
| `assign_actor` | 90-150초 | actor 배정 또는 자동 합류 | actor task queue 시작 | actor가 plot/workbench로 이동 | 도감 카드에만 남음 |
| `claim_production` | 2-4분 | 잎 수령 | leaves 증가, order progress 후보 생성 | resource flyout, storage/order hint | 생산 원인이 안 보임 |
| `choose_bottleneck` | 3-5분 | plot/worker/order 중 선택 | upgrade 또는 unlock preview | cost/balance/result/blocker 동시 표시 | 버튼이 단순 “확인”으로 보임 |

### D1 Script

| Beat | Unlock | 요구 상태 | Payoff | 증거 |
| --- | --- | --- | --- | --- |
| 첫 주문 | order crate | 첫 actor + 잎 생산 | crate filling -> sealed -> dispatched | order crate 4-state screenshot |
| 작업대 강화 | workbench | 첫 주문 또는 생산 보상 | worker throughput + visual prop upgrade | before/after prop |
| storage 병목 | basket/shelf | 5분 이상 idle 가능 | offline cap/보관량 설명 | comeback modal + world state |
| research preview | research shelf | 첫 clue 또는 order reward | 다음 family silhouette | note stamp FX |
| 첫 복귀 | offline return | 15분 이상 away simulation | 누가 벌었는지, 무엇이 쌓였는지, 무엇을 할 수 있는지 표시 | D1 comeback scripted QA |

### D7 Script

| Beat | Content target | Gameplay role | Screen requirement |
| --- | --- | --- | --- |
| 두 번째 구역 | 물안개 방 또는 주문 카운터 확장 | storage/order 병목 해소 | camera pan 또는 construction state |
| 세 번째 family | 젤리콩 또는 달방울 | short-cycle order 또는 research clue | seed family silhouette + first creature target |
| Research map | 3-node clue map | next family unlock route | node locked/current/complete 상태 |
| Expedition gate | first real route | rare source와 clue 소비 | depart, traveling, returned crate |
| Family role contrast | 3 families | care/storage/order 등 차이 | roster filter와 task assignment |

### D30 Script

| Beat | Content target | Retention function | Production requirement |
| --- | --- | --- | --- |
| 3개 구역 | 햇살 온실, 물안개 방, 달빛 온실 | 내 온실 세계 소유감 | overview camera에서 slot 18개 이상 실루엣 |
| 5개 family 목표 | 말랑잎, 방패새싹, 젤리콩, 달방울, 물안개 또는 포장잎 | 발견 목표 지속 | family tree 또는 album silhouette |
| Rare source | 원정/연구/특수 주문 | D30 이후 목표 | rare seed source가 상점이 아니라 gameplay에서 옴 |
| Decoration ownership | theme decor slots | screenshot/share 욕구 | overview mode, no HUD obstruction |
| Prestige preview | 계절 포자 | 장기 성장 실루엣 | reset 실행 없이 preview만 표시 |

## 4. 화면별 상태 계약

### Garden

| State | Trigger | 필수 정보 | Primary CTA | 보조 표면 |
| --- | --- | --- | --- | --- |
| fresh_start | 새 save | 무료 seed, empty plot, objective | `심기` | starter seed picker |
| plot_empty | 빈 plot 선택 | 가능한 seed, cost, 보유량 | `심기` | seed detail |
| plot_growing | planted | 남은 시간, care 효과 | `돌보기` | actor task hint |
| plot_ready | growth complete | 예상 reward, creature hint | `수확` | harvest FX |
| actor_working | actor assigned | task, target, rate | `수령` 또는 `보기` | path/facility anchor |
| order_ready | crate sealed | 요구량 완료, reward | `납품` | dispatch lane |
| upgrade_choice | resource enough | cost/balance/result/blocker | 병목별 CTA | recommendation badge |
| offline_return | away threshold | time away, attribution, next action | `수령` | world state marker |

### Seed

| State | 필수 정보 | CTA 규칙 |
| --- | --- | --- |
| unlocked_affordable | family, growth time, expected role, cost, current balance | `구매`, plot이 비면 `구매하고 심기` 허용 |
| unlocked_shortfall | 부족 재화, 획득 경로, 예상 시간 | disabled CTA + shortage copy |
| locked | unlock source, next visible milestone | locked preview. hidden exact rare odds 금지 |
| owned | 보유 수, 심을 수 있는 plot | `정원에 심기` |

### Album

| State | 필수 정보 | CTA 규칙 |
| --- | --- | --- |
| new_record_pending | 생명체 이름, family, role, 인사말 | `도감에 기록` |
| discovered | 역할, 기억 문장, production contribution | `정원에서 보기` |
| silhouette | family, source hint, unlock route | `관련 씨앗 보기` |
| milestone_ready | discovered count, reward | `보상 받기` |

### Order

| State | Visual | Simulation | CTA |
| --- | --- | --- | --- |
| empty | 빈 상자 | active order 없음 또는 다음 주문 대기 | `주문 보기` |
| filling | 재료가 차는 상자 | progress 1..required-1 | `생산 수령` 우선 |
| sealed | 묶인 상자 | requirements met | `납품` |
| dispatched | 상자 이동/영수증 | reward pending/claimed | `보상 받기` 또는 자동 receipt |

### Research / Expedition

| Surface | State | 필수 정보 | 금지 |
| --- | --- | --- | --- |
| research shelf | locked/current/complete | clue source, unlock result, duration | 설명 텍스트만 있는 dead tab |
| clue map | node graph | current node, next family hint | 전체 tree를 paywall처럼 표시 |
| expedition gate | unavailable/ready/traveling/returned | required actor, duration, expected reward | 첫 10분 내 복잡한 party setup |
| return crate | ready | rare source, material, clue attribution | 숫자 modal만 표시 |

## 5. 데이터 모델 계약

### Content Entity 목록

| Entity | 필수 필드 | 예시 |
| --- | --- | --- |
| `SeedFamily` | `id`, `name`, `motif`, `primaryRole`, `unlockPhase`, `rareBranchHint` | `family_malang_leaf` |
| `Seed` | `id`, `familyId`, `name`, `cost`, `growthSeconds`, `tapSeconds`, `harvestTableId`, `unlockCondition`, `assetId` | `seed_malang_001` |
| `Creature` | `id`, `familyId`, `name`, `rarity`, `role`, `personality`, `greeting`, `taskAffinity`, `assetId`, `animationIds` | `creature_pori_001` |
| `Plot` | `id`, `slotId`, `state`, `seedId`, `plantedAt`, `growthEndsAt`, `careCount` | `plot_01` |
| `Facility` | `id`, `kind`, `slotId`, `level`, `state`, `visualState`, `upgradeTableId` | `facility_workbench` |
| `ActorTask` | `id`, `actorId`, `kind`, `targetEntityId`, `pathId`, `startedAt`, `endsAt`, `result` | `task_pori_care_01` |
| `Order` | `id`, `requirements`, `progress`, `reward`, `visualState`, `unlockCondition` | `order_leaf_bundle_01` |
| `ResearchNode` | `id`, `requirements`, `rewardUnlock`, `visualState`, `nextNodeIds` | `research_sprout_notes` |
| `Expedition` | `id`, `durationSeconds`, `requiredRoles`, `rewardTableId`, `state` | `expedition_moon_hint` |
| `Zone` | `id`, `name`, `slotIds`, `unlockCondition`, `cameraBounds`, `themeAssetId` | `zone_sun_greenhouse` |

### Save State 최소 계약

| Group | 저장 필드 |
| --- | --- |
| player | resources, createdAt, lastSeenAt, tutorialFlags |
| board | unlockedZones, slots, plots, facilities, decorPlacements |
| collection | discoveredCreatureIds, creatureInstances, albumMilestones |
| production | actorTasks, storageState, orderQueue |
| meta | researchNodes, expeditionRuns, offlineHistory, analyticsQueue |

## 6. v1 콘텐츠 수량과 해금 계획

### Family Roadmap

| Family | 첫 등장 | v1 목표 creature 수 | 첫 gameplay hook | rare branch |
| --- | --- | ---: | --- | --- |
| 말랑잎 | 첫 5분 | 4 | care/growth tutorial | 왕잎주머니 |
| 방패새싹 | D1 | 3 | storage/offline 보호 | 밤보관 수호자 |
| 젤리콩 | D1-D7 | 3 | 빠른 성장/짧은 주문 | 설탕혜성 |
| 달방울 | D7 | 3 | research clue/expedition | 밤유리 |
| 물안개 | D7-D30 | 2 | storage cap/rare growth | 안개진주 |
| 포장잎 | D30 목표 | 2 | order throughput/dispatch | 황금포장잎 |

### Creature Production List v1

| Id | 이름 | Family | Role | 첫 사용 |
| --- | --- | --- | --- | --- |
| `creature_pori` | 말랑잎 포리 | 말랑잎 | caretaker | 첫 수확, care tutorial |
| `creature_dori` | 둥근잎 도리 | 말랑잎 | producer | 첫 생산 수령 |
| `creature_rami` | 이슬연금 라미 | 말랑잎 | researcher | research note preview |
| `creature_bori` | 왕잎 보리 | 말랑잎 | guardian | storage hint |
| `creature_momo` | 방패새싹 모모 | 방패새싹 | carrier | order crate 이동 |
| `creature_toto` | 껍질방패 토토 | 방패새싹 | guardian | D1 storage upgrade |
| `creature_suri` | 단단순 수리 | 방패새싹 | order_helper | order stability |
| `creature_jelly` | 젤리콩 젤리 | 젤리콩 | producer | short-cycle order |
| `creature_popi` | 통통젤 포피 | 젤리콩 | caretaker | tap acceleration |
| `creature_caram` | 캬라멜뿌리 카람 | 젤리콩 | carrier | fast dispatch |
| `creature_nunu` | 달방울 누누 | 달방울 | guardian | offline/night bonus |
| `creature_lumi` | 은빛이끼 루미 | 달방울 | researcher | clue map |
| `creature_oro` | 초승달순 오로 | 달방울 | explorer | first rare route |
| `creature_miru` | 물안개 미루 | 물안개 | guardian | offline cap |
| `creature_nari` | 안개진주 나리 | 물안개 | producer | slow rare growth |
| `creature_pipi` | 포장잎 피피 | 포장잎 | order_helper | D30 order throughput |
| `creature_roro` | 황금포장 로로 | 포장잎 | carrier | high-tier dispatch |

### Seed Production List v1

| Id | 이름 | Family | Unlock | Cost target | Growth target | Creature pool |
| --- | --- | --- | --- | ---: | --- | --- |
| `seed_malang_001` | 말랑잎 씨앗 | 말랑잎 | start | 0 | 30초 | 포리/도리 |
| `seed_malang_002` | 방울말랑 씨앗 | 말랑잎 | first album | 25 | 60초 | 도리/라미 |
| `seed_malang_003` | 이슬연금 씨앗 | 말랑잎 | research preview | 80 | 3분 | 라미/보리 |
| `seed_shield_001` | 방패새싹 씨앗 | 방패새싹 | first order | 60 | 2분 | 모모/토토 |
| `seed_shield_002` | 단단순 씨앗 | 방패새싹 | storage upgrade | 140 | 5분 | 토토/수리 |
| `seed_jelly_001` | 젤리콩 씨앗 | 젤리콩 | D1 order chain | 60 | 2분 | 젤리/포피 |
| `seed_jelly_002` | 캬라멜뿌리 씨앗 | 젤리콩 | D7 short order | 360 | 12분 | 포피/카람 |
| `seed_lunar_001` | 달방울 씨앗 | 달방울 | research node 2 | 300 | 10분 | 누누/루미 |
| `seed_lunar_002` | 초승달순 씨앗 | 달방울 | first expedition return | 650 | 22분 | 루미/오로 |
| `seed_mist_001` | 물안개 씨앗 | 물안개 | water room unlock | 900 | 30분 | 미루/나리 |
| `seed_pack_001` | 포장잎 씨앗 | 포장잎 | D30 order counter | 1200 | 45분 | 피피/로로 |
| `seed_rare_001` | 밤유리 씨앗 | 달방울 | rare source preview | 2400 | 90분 | 오로/나리/로로 |

### Zone Slot Targets

| Phase | Zone count | Slot target | Slot mix |
| --- | ---: | ---: | --- |
| 첫 5분 | 1 | 3-4 | plot 2, workbench 1, locked preview 1 |
| D1 | 1 | 5-6 | plot 3, workbench, order crate, storage preview |
| D7 | 2 | 9-12 | plot 4-5, order, storage, research, expedition, decor |
| D30 | 3+ | 18+ | zone-specialized production/order/research/expedition/decor |

### Order Chain v1

| Id | 이름 | Unlock | Requirement | Reward | Visual state focus |
| --- | --- | --- | --- | --- | --- |
| `order_leaf_bundle_01` | 첫 잎 묶음 | 첫 생산 수령 | 잎 12 | 잎 20, 작업대 강화 preview | crate filling/sealed |
| `order_workbench_snack_01` | 작업 간식 준비 | 첫 주문 납품 | 잎 24 | 작업대 강화권, 재료 1 | workbench prop upgrade |
| `order_research_note_01` | 새싹 기록법 납품 | 작업대 강화 | 잎 36, 재료 1 | 단서 1, research shelf unlock | note stamp |
| `order_storage_basket_01` | 보관 바구니 정리 | 첫 복귀 | 잎 48 | storage cap +12 | basket before/after |
| `order_jelly_quick_01` | 젤리콩 빠른 납품 | 젤리콩 unlock | 잎 60 | 젤리콩 family 확장 | quick dispatch |
| `order_mist_supply_01` | 물안개 응축 납품 | 물안개 방 unlock | 잎 120, 재료 2 | offline bonus, water room slot | mist crate |
| `order_lunar_clue_01` | 달빛 단서 포장 | 달방울 research | 단서 2, 잎 160 | expedition rare route | moon stamp |
| `order_pack_counter_01` | 포장잎 상회 주문 | D30 order counter | 잎 300, 재료 4 | 포장잎 seed source | counter dispatch |

### Upgrade List v1

| Id | 이름 | Bottleneck | Unlock | Cost target | Result |
| --- | --- | --- | --- | ---: | --- |
| `upgrade_plot_02` | 두 번째 밭 정리 | plot capacity | first harvest | 35 잎 | plot 2 active |
| `upgrade_plot_03` | 온실 동선 열기 | plot capacity | first order | 120 잎, 재료 1 | plot 3 active |
| `upgrade_workbench_01` | 작업 간식 강화 | worker capacity | order 1 | 40 잎 | production rate +25% |
| `upgrade_storage_01` | 보관 바구니 | storage capacity | D1 comeback | 80 잎 | offline cap/storage +100% |
| `upgrade_order_01` | 주문 상자 끈 | order throughput | order 2 | 90 잎, 재료 1 | order requirement -10% 또는 progress +10% |
| `upgrade_research_01` | 새싹 기록법 | research depth | research note order | 단서 1, 잎 100 | clue map node 1 complete |
| `upgrade_expedition_01` | 원정 문 손질 | expedition reach | D7 | 재료 3, 단서 2 | first expedition route |
| `upgrade_overview_01` | 온실 표지판 | ownership | D7-D30 | 재료 4 | overview/decor slots |

### Research Nodes v1

| Id | 이름 | Requirement | Unlock | 화면 payoff |
| --- | --- | --- | --- | --- |
| `research_sprout_notes` | 새싹 기록법 | 단서 1 | 말랑잎 후속 seed, research shelf | note stamp + next seed CTA |
| `research_jelly_route` | 빠른 성장 관찰 | 젤리콩 creature 1, 잎 120 | 젤리콩 short order | clue map branch |
| `research_lunar_trace` | 달빛 흔적 | 단서 2, expedition preview | 달방울 seed | moon clue glow |
| `research_mist_room` | 물안개 온도표 | 달방울 creature 1, 재료 3 | 물안개 방 | zone construction marker |
| `research_pack_counter` | 상회 포장법 | order 5회, 재료 4 | 포장잎 order counter | counter stamp |
| `research_rare_glass` | 밤유리 배양 기록 | D30 rare source | rare seed preview | rare branch silhouette |

### Expedition Routes v1

| Id | 이름 | Unlock | Duration target | Requirement | Reward |
| --- | --- | --- | --- | --- | --- |
| `expedition_backyard_gap` | 뒷마당 틈새길 | tutorial expedition | 5분 | actor 1 | 잎 35, pollen chance |
| `expedition_moon_trace` | 달빛 흔적 찾기 | research_lunar_trace | 15분 | guardian 또는 researcher 1 | 단서 1, 재료 1 |
| `expedition_mist_pipe` | 물안개 관로 점검 | water room preview | 30분 | carrier 1, guardian 1 | 재료 2, offline bonus source |
| `expedition_night_glass` | 밤유리 온실 조사 | D30 preview | 60분 | explorer 1, researcher 1 | rare source chance, 밤유리 씨앗 preview |

## 7. 경제와 밸런스 기준값

### Core Resource Rates

| Moment | Target balance | 이유 |
| --- | ---: | --- |
| 첫 심기 직후 | 잎 0 허용 | 무료 starter가 막힘을 제거 |
| 첫 수확 | 잎 10-15 | 다음 행동 preview 가능 |
| 첫 생산 수령 | 잎 +8-12 | 수령 verb를 학습 |
| 첫 meaningful upgrade | 비용 25-40 잎 | 5분 안에 도달 |
| 첫 주문 납품 | 잎 20-40 또는 재료 1 | production -> sink -> reward 학습 |
| D1 storage upgrade | 비용 80-140 잎 또는 재료 1 | 복귀 hook 강화 |
| D7 zone unlock | 복합 요구량 | 단일 currency grind 방지 |

### Bottleneck Recommendation 규칙

| 상태 | 추천 | 표시해야 할 근거 |
| --- | --- | --- |
| storage full | storage upgrade | `보관 n/n`, 놓친 예상 생산량 |
| no empty plot | plot unlock | 다음 seed와 비어 있는 자리 없음 |
| order stalled | order helper 또는 production | 요구량/현재량/예상 수령량 |
| research blocked | clue source | 필요한 단서와 얻는 행동 |
| expedition blocked | actor role 또는 research | 요구 role, duration, 예상 rare source |

## 8. Asset / FX 제작 계약

### Production Asset Families

| Asset group | 최소 단위 | Acceptance |
| --- | --- | --- |
| terrain background | zone별 1장 | gameplay object baked-in 금지 |
| plot states | empty/sprout/growing/ready/locked | 64px scale에서도 상태 구분 |
| facility states | base/upgraded/active | 수치 buff가 prop 변화와 연결 |
| actor strips | idle/work/celebrate 또는 role-specific | bottom-center anchor, frame clipping 없음 |
| order crate | empty/filling/sealed/dispatched | 주문 상태가 텍스트 없이도 읽힘 |
| research FX | note stamp/clue glow | 상태 변화 feedback 유지 |
| reward FX | leaf/material/clue flyout | resource 증가 원인이 보임 |

### Runtime Asset 금지선

- SVG/vector/code-native drawing을 accepted game asset으로 등록하지 않는다.
- 런타임에서 image generation API를 호출하지 않는다.
- placeholder는 `prototype` 또는 `debug`로만 표시하고 production acceptance에 쓰지 않는다.
- background에 plot, crate, workbench, storage, research desk, expedition gate를 그려 넣지 않는다.

## 9. Telemetry와 Playtest 기록

### Local Analytics Event

| Event | Required payload |
| --- | --- |
| `first_action_seen` | `screen`, `secondsFromStart`, `visibleCta` |
| `seed_planted` | `seedId`, `plotId`, `cost`, `balanceAfter` |
| `care_tapped` | `plotId`, `secondsReduced`, `remainingSeconds` |
| `creature_harvested` | `creatureId`, `seedId`, `secondsFromStart`, `rarity` |
| `actor_task_started` | `actorId`, `role`, `taskKind`, `targetEntityId` |
| `production_claimed` | `sourceActorId`, `resource`, `amount`, `storageState` |
| `order_dispatched` | `orderId`, `requirements`, `reward` |
| `upgrade_bought` | `upgradeId`, `bottleneck`, `cost`, `result` |
| `offline_claimed` | `awaySeconds`, `attributions`, `reward`, `nextAction` |
| `research_node_completed` | `nodeId`, `rewardUnlock`, `nextNodeIds` |
| `expedition_returned` | `expeditionId`, `durationSeconds`, `reward` |

### Playtest Report 최소 항목

| 항목 | 기준 |
| --- | --- |
| first 5m run | fresh save, 첫 생명체, 첫 생산, 첫 선택까지 기록 |
| mobile visual | 393x852와 360px narrow screenshot |
| desktop visual | centered mobile frame 또는 명시적 expanded debug frame |
| D1 comeback | 15분 이상 away simulation |
| rubric | `GAME_BIBLE.md` acceptance rubric 점수 |
| findings | severity order, screenshot path, follow-up issue |

## 10. WorkUnit 분해 기준

새 게임 WorkUnit은 아래 중 최소 3개를 포함해야 한다.

- player verb
- production/progression role
- screen moment
- asset/FX need
- playtest evidence plan

### 다음 구현 순서

| WorkUnit | 목적 | 산출물 | 필수 검증 |
| --- | --- | --- | --- |
| `0235 garden board topology` | slot/zone/entity data foundation | topology data, debug render, first 3 slots | build, unit/static check, mobile smoke |
| `0236 topology asset plan` | 필요한 raster asset id/prompt 확정 | asset plan/prompt batch | asset provenance/style check |
| `0237 actor task scaffold` | actor task queue와 path 표시 | caretaker/carrier task state | scripted task observation |
| `0238 first 5m playable slice` | planting -> harvest -> actor -> production -> choice | Phaser playable path | Browser Use first 5m evidence |
| `0239 D1 order/offline slice` | order crate + comeback world state | order/offline systems | D1 comeback QA |
| `0240 D7 research/expedition slice` | clue map + expedition gate | research/expedition data | D7 scripted path |

## 11. Completion Audit Checklist

기획 문서가 “게임 하나를 처음부터 끝까지 만들 수 있는 수준”이라고 주장하려면 아래 항목을 모두 증거로 연결해야 한다.

| Requirement | Evidence |
| --- | --- |
| 게임 정체성 | `docs/GAME_BIBLE.md` |
| 플레이어 여정 | 이 문서 `3. Player Journey 상세` |
| 화면 상태 | 이 문서 `4. 화면별 상태 계약` |
| 데이터 모델 | 이 문서 `5. 데이터 모델 계약` |
| 콘텐츠 수량/해금 | 이 문서 `6. v1 콘텐츠 수량과 해금 계획` |
| 경제 기준값 | 이 문서 `7. 경제와 밸런스 기준값`, `docs/ECONOMY_PHASE0.md` |
| asset/FX 정책 | 이 문서 `8. Asset / FX 제작 계약`, `docs/GAME_BIBLE.md` |
| telemetry/playtest | 이 문서 `9. Telemetry와 Playtest 기록`, `docs/GAME_BIBLE.md` |
| WorkUnit 순서 | 이 문서 `10. WorkUnit 분해 기준`, `items/0234-game-bible-full-redesign.md` |
| 안전 금지선 | `docs/GAME_BIBLE.md`, `docs/PRD_PHASE0.md` |
