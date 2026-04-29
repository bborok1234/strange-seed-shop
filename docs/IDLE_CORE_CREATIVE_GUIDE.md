# Idle Core Creative Guide

Status: draft-v0
Owner: agent
Updated: 2026-04-29
Scope: P0.5 idle core + production game feel rescue

## 목적

`이상한 씨앗상회`는 현재 귀여운 수집 UI 프로토타입에 가깝고, 아직 production급 idle game으로 플레이할 콘텐츠와 재미가 부족하다. 이 문서는 게임 기획, UI/UX, 에셋, 연출, Codex 작업 방식을 분리하지 않고 하나의 vertical slice 기준으로 묶는다.

핵심 전환:

> 귀여운 씨앗 수집 UI에서, 식물 생명체들이 정원을 자동화하고 주문을 처리하고 탐험을 다녀오며 온실 제국을 키우는 idle collection tycoon으로 전환한다.

## 레퍼런스에서 배운 원칙

- Egg, Inc.: 귀여운 외피 아래 농장 확장, 연구, prestige, contracts, spaceships/artifacts 같은 장기 메타가 있다.
- Idle Miner Tycoon: 광산/매니저/자동화/오프라인 수익/이벤트/대륙 확장으로 생산 엔진을 계속 키운다.
- Cell to Singularity: 클릭/idle 위에 거대한 tech tree와 발견의 서사를 얹어 다음 콘텐츠를 계속 보여준다.

공통점:

1. 생산 엔진이 화면에 보인다.
2. 업그레이드 선택이 있다.
3. 다음 해금 목표가 계속 보인다.
4. 오프라인 진행이 의미 있다.
5. 장기 메타가 있다.
6. UI와 에셋은 기능 장식이 아니라 core loop의 일부다.

## Game Fantasy

플레이어는 이상한 씨앗에서 태어난 식물 생명체들을 모아 정원을 자동화한다. 생명체들은 각자 역할을 가지고 잎, 꽃가루, 재료를 생산하거나 주문을 돕고, 탐험을 다녀오며 더 희귀한 씨앗과 연구를 열어준다.

## Core Loop Contract

```text
씨앗 심기
→ 생명체 탄생
→ 생명체가 정원에서 일함
→ 자동 생산
→ 주문/의뢰 납품
→ 새 씨앗/시설/탐험 해금
→ 더 희귀한 생명체 수집
→ 연구/계절 메타
→ 반복
```

모든 게임 기능 issue는 아래를 함께 정의해야 한다.

- Player fun target: 이 작업이 어떤 재미를 만드는가?
- Core loop role: 생산, 수집, 주문, 탐험, 연구, 복귀 중 어디에 속하는가?
- Screen moment: 플레이어가 언제 어디서 이것을 보는가?
- Required assets: 캐릭터, 아이콘, FX, 배경, 성장 단계.
- Game-feel requirements: 탭, 수확, 납품, 보상 순간의 반응.
- Acceptance criteria: 기능, 화면, 에셋, visual QA가 함께 통과해야 한다.

## Production UI Bar

- 첫 화면은 생산 엔진이 보여야 한다. 정적인 메뉴/패널이 아니라 생명체와 자원 흐름이 보여야 한다.
- 생명체는 도감 보상 카드가 아니라 정원 경제에 참여하는 actor여야 한다.
- CTA는 `확인/완료`보다 `수확`, `납품`, `보내기`, `연구`, `배치` 같은 게임 동사를 사용한다.
- 숫자 변화는 화면에서 느껴져야 한다: floating reward, 자원 통 채움, 주문 상자 진행률, 생산 tick.
- 모바일은 하나의 game frame이다. 정원과 메뉴가 동시에 보이는 대시보드가 아니라, 하단 탭으로 전환되는 게임 화면이어야 한다.
- 패널은 플레이필드를 가리지 않고, 탭 화면은 게임의 다른 공간처럼 보여야 한다.

## Asset Bible v0

### Creature asset minimum

각 주요 생명체는 vertical slice에서 최소 아래 상태를 목표로 한다.

- `portrait`: reveal/modal/card용 고해상도 초상
- `idle`: 정원 배치 상태
- `work`: 생산/주문/탐험 준비 상태
- `celebrate`: 수확/납품/해금 보상 순간
- `silhouette`: 미발견 도감 슬롯
- `small_icon`: 32~64px UI 칩

### Seed/crop asset minimum

- `seed`
- `sprout`
- `growing`
- `ready`
- `harvest_pop`

### System assets

- leaf icon
- pollen icon
- material icon
- order crate
- research icon
- expedition map marker
- reward burst FX
- production tick FX

### Quality bar

- creature/item/icon/fx는 투명 배경이 기본이다.
- 64px에서도 형태와 역할이 읽혀야 한다.
- 동일 시점, 동일 조명, 동일 외곽선 언어를 유지한다.
- checkerboard/흰 배경이 노출되면 실패다.
- manifest 등록 전 asset review를 통과해야 한다.

## Codex 작업 방식

Codex는 게임 기획과 에셋을 분리해서 처리하지 않는다. 작은 vertical slice마다 아래 순서를 따른다.

1. Reference teardown: 이 slice가 어떤 idle game 재미를 차용하는지 명시.
2. Creative brief: 플레이어 감정, core loop role, 화면 순간 정의.
3. Asset plan: 필요한 gameplay asset과 크기/용도/투명 배경 여부 정의.
4. Prompt batch: asset prompt 작성.
5. Image generation: 필요한 asset만 생성.
6. Asset review: 투명도, 작은 크기 판독성, 스타일 일관성 확인.
7. Manifest integration: runtime에서 정적 asset만 사용.
8. Visual QA: Playwright/Browser Use/Computer Use fallback으로 실제 화면 증거 저장.

## P0.5 추천 vertical slice

### 목표

첫 5분 안에 플레이어가 “귀엽다”를 넘어서 “이 정원이 자동으로 커지고, 다음 주문/생명체/연구가 기다린다”를 느끼게 한다.

### Slice 1: Creature role + auto production v0

- 첫 생명체가 정원에 배치되어 잎을 천천히 생산한다.
- 생산 tick이 화면에 보인다.
- 첫 업그레이드는 단순 plot unlock이 아니라 생산 엔진 강화처럼 읽힌다.

### Slice 2: Order/commission v0

- 짧은 주문이 생긴다: 예) `말랑잎 포리의 잎 20개 납품`.
- 납품 progress와 보상이 보인다.
- 보상은 새 씨앗/연구/탐험으로 이어진다.

### Slice 3: Production garden UI v0

- 정원 화면에서 생명체, 생산 자원, 주문 상자가 동시에 읽힌다.
- 기존 앱 패널 느낌을 줄이고 게임 HUD와 playfield 중심으로 재배치한다.

### Slice 4: Asset batch v0

- 첫 creature role state assets
- 생산 tick/reward FX
- order crate/resource icons

## 금지/주의

- 새 시스템을 추가하더라도 첫 5분을 더 복잡하게 만들면 실패다.
- 숫자만 늘리는 idle은 부족하다. 화면에서 생산과 보상 순간이 느껴져야 한다.
- UI polish만 하고 core loop가 재미없으면 실패다.
- 에셋만 늘리고 gameplay role이 없으면 실패다.
- 운영사 인프라 작업은 게임 제작을 막는 blocker일 때만 우선한다.
