# 이상한 씨앗상회 게임 바이블

Status: active game source-of-truth
Updated: 2026-05-07
Owner: Studio
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:sprite-pipeline` -> `game-studio:game-playtest`

## 1. 결정

`이상한 씨앗상회`의 active game design source-of-truth는 이 문서다. `docs/NORTH_STAR.md`는 게임과 운영사의 최상위 헌장이고, 이 문서는 그중 게임 제품을 처음부터 끝까지 정의한다.

이 문서보다 하위다:

- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`: Phaser 구현 foundation
- `docs/DESIGN.md`: 과거/참고 UI 판단 기준
- `docs/ART_HUD_PRODUCTION_SPEC.md`: 과거/참고 정원 HUD 제작 기준
- `docs/IDLE_CORE_PRODUCTION_SPEC.md`: 경쟁작 teardown과 idle core 참고 자료
- `docs/PRD_PHASE0.md`, `docs/ECONOMY_PHASE0.md`: baseline 안전/경제 계약
- 기존 `items/`, `reports/`, P0/P0.5 문서: history/reference

신규 game implementation은 이 문서와 충돌할 경우 이 문서를 우선한다. 단, 실제 결제, 로그인, 외부 배포, 런타임 이미지 생성 금지 같은 안전 계약은 `docs/PRD_PHASE0.md`와 repo policy가 계속 우선한다.

## 2. 게임 정체성

### 한 문장

**이상한 씨앗에서 태어난 이름 있는 식물 생명체들이 정원 상회를 운영하고, 플레이어는 그 생명체와 시설을 배치해 생산, 주문, 연구, 원정을 확장하며 30일 동안 온실 세계를 키워가는 browser-first idle collection tycoon.**

### 고정된 정체성

- 장르: idle collection tycoon
- 핵심 판타지: 살아있는 정원 상회를 키운다
- 핵심 감정: “얘 귀엽다. 하나만 더 키워볼까?”에서 “이 정원이 실제로 움직이네. 다음 구역까지 열고 싶다”로 확장
- 핵심 대상: 이름, 역할, 기억을 가진 식물 생명체
- 핵심 무대: 배경 그림이 아니라 확장 가능한 온실 board/world
- v1 시간축: 출시 버전 + 30일 retention
- 엔드게임 방향: 온실 세계 확장
- 플레이 리듬: 1-3분 체크인 + 5-10분 집중 성장 세션
- 아트 톤: 따뜻한 기묘함
- 수익화: 초기 결제 없음. 광고는 선택적 후보로만 설계

### 경쟁작에서 가져올 자극 구조

| 자극 | 레퍼런스 | 이 게임의 해석 |
| --- | --- | --- |
| 보이는 생산 엔진 | Egg, Inc., Idle Miner Tycoon | 생명체와 시설이 실제 world에서 잎/재료/주문 진행을 만든다 |
| 병목 해소 | Egg, Inc., Idle Miner Tycoon, AdVenture Capitalist | plot, worker, storage, order, research, expedition 중 무엇을 먼저 키울지 선택한다 |
| 캐릭터 애착 | Cats & Soup, Neko Atsume | 생명체는 도감 보상이 아니라 이름/역할/행동/기억을 가진 상회 동료다 |
| 발견 욕구 | Cell to Singularity | 연구와 원정은 다음 씨앗 family와 온실 구역을 여는 clue map이다 |
| 내 공간 소유감 | Garden Galaxy, CookieRun: Kingdom | 시설/장식/생명체 배치가 내 온실이 커지는 느낌을 만든다 |
| 복귀 기대 | 대부분의 idle game | 돌아오면 숫자만이 아니라 수확, 납품, 해금, 기억이 기다린다 |

## 3. 플레이어 판타지와 대상

플레이어는 작은 온실 상회를 맡은 관리인이다. 처음에는 이상한 씨앗 몇 개와 빈 작업대뿐이지만, 씨앗에서 태어난 생명체들이 밭을 돌보고, 주문을 포장하고, 연구 노트를 채우고, 원정을 다녀오면서 상회가 살아난다.

타깃 플레이 경험:

- 모바일 브라우저에서 바로 시작한다.
- 복잡한 설명 없이 첫 씨앗을 심는다.
- 1분 안에 첫 생명체를 보고 이름을 기억한다.
- 생명체가 정원에서 일하는 모습을 본다.
- 짧게 들어와도 수령/납품/업그레이드가 있다.
- 길게 보면 배치, 성장, 연구, 원정 선택을 한다.
- D7 이후에는 “내 온실이 이렇게 커졌다”는 소유감을 느낀다.
- D30에는 아직 닫힌 구역과 희귀 씨앗 family가 보여 계속 돌아올 이유가 있다.

## 4. 전체 코어 루프

```text
씨앗 선택
-> 빈 plot 선택
-> 심기
-> 돌보기 / 기다림
-> 수확
-> 생명체 reveal
-> actor roster 합류
-> actor task 배정
-> 생산 / 주문 진행
-> 수령 / 납품
-> 업그레이드 선택
-> 연구 / 원정 / 새 구역 해금
-> 오프라인 복귀 보상
-> 더 희귀한 씨앗과 온실 세계 확장
```

### Primary verbs

| Verb | 목적 | 화면 표면 |
| --- | --- | --- |
| `심기` | 기대 시작 | plot, seed screen, action rail |
| `돌보기` | active acceleration | plot animation, caretaker task, care FX |
| `기다리기` | idle promise | timer, offline storage, worker state |
| `수확` | collection payoff | plot ready, reveal, creature arrival |
| `배정` | automation | actor roster, task path, facility anchor |
| `수령` | idle reward | resource flyout, storage, receipt |
| `납품` | resource sink | order crate, dispatch lane, reward |
| `강화` | 병목 해소 | facility prop, upgrade choice |
| `연구` | discovery | research note, clue map, seed family unlock |
| `원정` | long meta | expedition gate, return crate, rare source |
| `꾸미기` | ownership | decor slots, overview camera |

## 5. v1 진행 구조

### 첫 5분

목표: 막히지 않는 첫 행동, 첫 생명체 애착, 정원 생산 엔진의 증명.

| 시간 | 플레이어 상태 | 필수 payoff |
| --- | --- | --- |
| 0-10초 | 첫 행동 선택 | 빈 plot과 무료 starter seed가 보인다 |
| 30-90초 | 첫 성장/수확 | 말랑잎 계열 첫 생명체 reveal |
| 90-150초 | actor 이해 | 생명체가 plot/workbench에서 일한다 |
| 2-4분 | 첫 생산 수령 | 잎이 actor/facility에서 resource HUD로 이동한다 |
| 3-5분 | 첫 선택 | plot 확장, 작업대 강화, 주문 준비 중 2개 이상 선택 |

성공 기준:

- 시작 시 잎 0이어도 진행 가능하다.
- 첫 생명체가 reveal 뒤 도감에만 머물지 않고 world actor로 합류한다.
- 첫 화면이 static illustration이 아니라 생산 중인 정원으로 읽힌다.

### 첫날 D1

목표: 첫 주문, 두 번째 생명체, 첫 시설, 첫 오프라인 복귀.

필수 콘텐츠:

- 두 번째 plot 또는 locked preview unlock
- 첫 주문 crate
- storage 또는 basket 병목
- 작업대 강화
- research note preview
- 15분 이상 오프라인 복귀 보상

성공 기준:

- 플레이어는 생산/보관/주문 중 무엇이 막혔는지 알 수 있다.
- 첫 주문 납품은 새 seed, clue, facility 중 하나로 이어진다.
- 오프라인 복귀는 modal 숫자만이 아니라 정원 prop/actor 상태로 보인다.

### 7일 D7

목표: research/expedition route와 온실 구역 확장.

필수 콘텐츠:

- 최소 3개 seed family
- 최소 6개 생명체
- research clue map
- expedition gate
- 두 번째 온실 구역 unlock
- family별 role 차이

성공 기준:

- 생명체 family가 단순 스킨이 아니라 play style 차이를 만든다.
- 원정은 별도 탭의 dead content가 아니라 research clue와 seed source를 연결한다.
- 온실 구역 확장은 background swap이 아니라 board/world 확장이다.

### 30일 D30

목표: 희귀 씨앗, 구역 전문화, decoration ownership, 장기 실루엣.

필수 콘텐츠:

- 최소 5개 seed family
- 최소 15개 생명체 목표
- 3개 이상 온실 구역
- 구역별 생산/주문/연구/원정 전문화
- rare seed source
- decoration slot과 screenshot-safe overview
- 첫 prestige 후보 preview

성공 기준:

- 플레이어는 “내 온실 세계”의 형태를 본다.
- 30일 뒤에도 닫힌 구역, 희귀 family, 씨앗 계보가 남아 있다.
- 반복은 숫자 상승만이 아니라 새 역할, 새 구역, 새 생명체 발견으로 이어진다.

### D30 이후

엔드게임은 온실 세계 확장이다.

후보 구조:

- 계절 포자: soft prestige 후보. 수집/기억은 유지하고 성장 속도 또는 rare source 확률을 강화한다.
- 씨앗 계보: family tree 완성 목표. 희귀 변종과 연구 노트를 연결한다.
- 상회 명성: 손님/주문/시즌 이벤트를 여는 보조 meta.

P0/v1에서는 이 구조를 구현하지 않는다. 다만 D30 UI에 silhouette로 보여 장기 기대를 만든다.

## 6. 월드와 board 설계

정원은 하나의 배경 이미지가 아니다. 정원은 board data, camera, runtime entity, actor task path의 조합이다.

### 월드 레이어

| Layer | 설명 | 금지 |
| --- | --- | --- |
| terrain | 바닥, 벽, 빛, 깊이 | plot/facility/order를 그려 넣기 |
| build slots | plot/facility/decor anchor | hardcoded 2-slot 구조 |
| plots | seed growth entity | 배경에 baked-in |
| facilities | workbench, storage, order crate, research desk, expedition gate | static decoration으로만 처리 |
| actors | 생명체, shadow, path | floating sticker |
| FX | care, harvest, reward, dispatch | 숫자만 바뀌는 처리 |
| HUD | resources, objective, action | dashboard panel |

### 구역

| 구역 | v1 역할 | 첫 등장 |
| --- | --- | --- |
| 햇살 온실 정원 | starter plot, 첫 생명체, 기본 생산 | 첫 5분 |
| 상회 작업대 | care, craft, worker task, material conversion | D1 |
| 주문 카운터 | order crate, dispatch, 손님 실루엣 | D1 |
| 연구 선반 | clue map, seed family unlock | D1-D7 |
| 원정 문 | expedition start/return, rare source | D7 |
| 물안개 방 | storage/offline/rare growth boost | D7-D30 |
| 달빛 온실 | rare seed, night family, long meta | D30 |

### Slot policy

- 시작 화면은 최소 3개 build slot을 가진다.
- 2개는 unlocked 또는 soon-unlocked, 1개는 locked preview다.
- D1 target은 5-6개 slot이다.
- D7 target은 9개 이상 slot이다.
- D30 target은 여러 구역 합산 18개 이상 slot이다.
- slot unlock은 배경 교체가 아니라 entity reveal, cleared patch, construction state, camera pan으로 표현한다.

## 7. 핵심 시스템

### Seed family

| Family | 성격 | gameplay role |
| --- | --- | --- |
| 말랑잎 | starter, 친근함, 돌보기 | growth/care tutorial, base leaf production |
| 방패새싹 | 든든함, 보관, 보호 | storage, order stability, offline bonus |
| 젤리콩 | 장난감, 빠른 성장 | tap acceleration, short-cycle orders |
| 달방울 | 신비, 밤, 단서 | research clue, expedition source, rare unlock |
| 물안개 | 회복, 보관, 습도 | storage cap, offline return, slow rare growth |
| 포장잎 | 상회, 주문, 손님 | order throughput, dispatch rewards |

각 family는 최소 하나의 creature, one gameplay role, one visual motif, one future rare branch를 가진다.

### Creature role

생명체는 아래 중 최소 하나의 role을 가진다.

| Role | 효과 | 화면 표현 |
| --- | --- | --- |
| caretaker | 성장 보조, care task | plot 주변 돌보기 |
| producer | 잎/꽃가루 생산 | facility 또는 plot work loop |
| carrier | 수확물/재료 이동 | crate/storage path |
| order_helper | 주문 진행/보상 증가 | order counter |
| researcher | clue 생성/연구 시간 단축 | research shelf |
| explorer | 원정 보상/rare source | expedition gate |
| guardian | offline/storage 보호 | night/rest state |

금지: 도감에만 존재하는 생명체, 카드를 world actor로 그대로 확대하는 방식, clipping된 sprite strip.

### Facility

| Facility | 기능 | 병목 |
| --- | --- | --- |
| plot | 씨앗 성장 | plot capacity |
| workbench | care, craft, worker task | worker throughput |
| storage basket/shelf | offline 보관 | storage capacity |
| order crate/counter | 납품/출하 | order throughput |
| research shelf | clue/research unlock | research depth |
| expedition gate | rare source 획득 | expedition reach |
| decor slot | 소유감/보너스 | ownership/meta |

Facility는 수치 buff가 아니라 world prop으로 보여야 한다. 강화 후 외형 또는 state가 변한다.

### Economy

기본 재화:

- 잎: 기본 생산/구매/초기 upgrade
- 꽃가루: 생명체/성장/rare seed 관련
- 재료: facility/order/research upgrade
- 단서: research/expedition unlock source
- 계절 포자: D30 이후 soft prestige 후보

모든 경제 CTA는 cost, balance, result, blocker를 같은 화면 안에 보여준다.

### Production bottlenecks

| Bottleneck | 질문 | 해결 |
| --- | --- | --- |
| plot capacity | 더 심을 곳이 있는가? | plot unlock, 구역 확장 |
| worker capacity | 누가 일하는가? | creature role, workbench |
| storage capacity | 닫아도 얼마나 쌓이는가? | shelf/basket upgrade |
| order throughput | 생산 자원이 어디로 쓰이는가? | crate/counter/helper |
| research depth | 다음 family가 보이는가? | clue map/research |
| expedition reach | rare source를 얻는가? | expedition gate/explorer |

좋은 upgrade는 항상 하나의 bottleneck을 화면에서 해결한다.

### Task queue

Actor는 task를 가진다.

```text
idle -> move_to_target -> work/care/carry -> produce_or_progress -> return/rest
```

Task는 simulation state가 소유하고, Phaser는 path와 animation을 보여준다. actor movement는 world position/path로만 표현한다. sprite frame advance로 이동을 흉내 내지 않는다.

### Orders

주문은 resource sink이자 상회 판타지의 중심이다.

주문 구성:

- 요구량: resource 또는 product
- progress source: production claim, worker task, facility task
- reward: leaves, material, clue, seed source, facility unlock
- visual state: empty, filling, sealed, dispatched, claimed

주문은 단순 list가 아니라 order crate/counter prop으로 보여야 한다.

### Research and expedition

Research는 다음 seed family를 보여주는 discovery map이다. Expedition은 research clue를 rare source로 바꾸는 long meta다.

```text
주문/수확 -> 단서 획득 -> 연구 노트 -> 원정 준비 -> 귀환 상자 -> rare seed/source -> 새 family
```

Research와 expedition은 첫날부터 실루엣이 보이되, 실제 depth는 D7 이후 열린다.

### Offline return

오프라인 복귀는 3가지를 반드시 보여준다.

- 누가 벌었는가: actor/facility attribution
- 무엇이 쌓였는가: storage/resource state
- 지금 무엇을 할 수 있는가: claim, harvest, dispatch, upgrade

숫자 modal만 보여주면 실패다.

### Decoration ownership

Decoration은 단순 꾸미기와 작은 meta bonus를 겸한다.

- 배치하면 overview mode에서 보인다.
- 특정 family 또는 facility와 어울리는 theme를 가진다.
- D7 전에는 preview만, D30까지 ownership loop로 확장한다.
- gameplay bonus는 작게 유지한다. 장식이 필수 최적화가 되면 안 된다.

## 8. 화면과 HUD

Top-level screens:

- 정원: world, actor, plot, facility, action rail
- 씨앗: next creature expectation, cost/balance/result, plant action
- 도감: discovered memories, role, next silhouette
- 원정: requirement, duration, expected reward, return
- 상점: mock/광고 후보만. 실제 결제 없음

Persistent HUD:

- resource 2-3개
- objective 1개
- contextual action rail 1개
- mode toggle 1개

금지:

- 기본 화면의 desktop side rail
- 하단 절반을 항상 덮는 panel
- center playfield 설명 카드
- cost 단위 없는 CTA
- 도감/상점/씨앗 화면이 정원 위 overlay로 겹치는 구조

## 9. 아트, motion, asset policy

아트 방향은 따뜻한 기묘함이다.

- cozy greenhouse lighting
- 손으로 만든 상회 도구
- 귀엽지만 약간 이상한 seed/creature silhouette
- 과도한 판타지 UI glow보다 tactile prop 중심
- beige/green 단색화 금지. 식물 녹색, 따뜻한 목재, 유리, 달빛, 사탕색 accent를 균형 있게 쓴다.

Asset production order:

```text
world topology
-> entity taxonomy
-> asset id list
-> prompt batch
-> gpt-image-2 or Codex native generation
-> asset review
-> sprite normalization
-> manifest binding
-> Browser Use playtest
```

배경 asset에는 gameplay object를 baked-in 하지 않는다.

필수 motion source:

- actor idle/work
- plot growth/ready
- reward/resource flyout
- order crate state
- unlock/research stamp

`prefers-reduced-motion`에서는 반복 장식 motion만 줄이고, 상태 변화 feedback은 남긴다.

## 10. 광고와 수익화

v1 초기에는 실제 결제와 real store를 넣지 않는다. 광고도 구현하지 않고 설계 슬롯만 둔다.

허용 후보:

- 선택형 rewarded ad 후보: 오프라인 보관 +소량, 원정 시간 소폭 단축, 장식 reroll
- ad-free supporter 후보: 장기 검토용 placeholder

금지:

- 성장 blocker를 광고로만 풀기
- 첫 5분 안에 광고 노출
- 강제 interstitial
- 실제 결제/checkout/account
- 확률형 압박이나 희귀 생명체 판매 중심 설계

상점 탭은 Phase 0/v1에서 mock/click-intent와 향후 슬롯 설명까지만 허용한다.

## 11. Acceptance rubric

새 playable 또는 design issue는 아래 기준을 통과해야 한다.

| Rubric | 통과 기준 |
| --- | --- |
| first_action | 첫 화면 3초 안에 가능한 행동이 보인다 |
| creature_attachment | 첫 생명체가 이름/역할/행동으로 기억된다 |
| production_readability | resource가 오르는 이유가 actor/facility로 보인다 |
| bottleneck_choice | 다음 upgrade가 어떤 병목을 푸는지 알 수 있다 |
| collection_desire | 다음 seed/family silhouette가 보인다 |
| comeback_hook | 닫아도 보상/수확/납품이 기다린다는 기대가 있다 |
| world_ownership | 온실이 확장 가능한 내 공간으로 읽힌다 |
| visual_gamefeel | 상태 변화가 motion/FX/receipt로 남는다 |
| no_static_poster | screenshot이 정적 일러스트나 dashboard로 보이지 않는다 |

## 12. Playtest protocol

문서-only 작업은 Browser Use evidence가 필수는 아니다. 화면/게임 구현은 Browser Use `iab`가 source-of-truth다.

필수 playtest:

- first 5 minutes scripted run
- fresh start with 0 leaves
- D1 offline return simulation
- 393x852 mobile frame
- 360px narrow mobile
- desktop centered mobile frame
- overview mode screenshot
- actor task sequence observation

완료 주장 조건:

- build/check green
- Browser Use screenshot 또는 blocker 기록
- playtest findings severity order
- GAME_BIBLE rubric 결과
- 후속 issue가 plan-first로 존재

