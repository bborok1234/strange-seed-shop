# Production Slice Readiness Gate

Status: active
Updated: 2026-05-06
Scope: next core gameplay production slice, starting with `Bottleneck-readable production graph`
Game Studio route: `game-studio:game-studio` -> `game-studio:web-game-foundations` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
Authority: blocking gate for core gameplay PR merge-readiness

## 목적

이 문서는 다음 core gameplay slice가 “좋은 의도”나 “부분 개선”으로 끝나지 않게 만드는 readiness gate다. 첫 적용 대상은 `docs/IDLE_CORE_PRODUCTION_SPEC.md`의 `Bottleneck-readable production graph` slice다.

핵심 목표:

```text
첫 10분 안에
첫 수확 -> 자동 생산 -> 보관 병목 -> 추천 업그레이드
-> 주문/납품 -> 다음 생명체/연구/원정 기대
가 한 번 이어져야 한다.
```

이 gate는 blocking이다. 다음 core gameplay PR이 이 기준을 만족하지 못하면 merge-ready가 아니다.

## Interview Decisions

사용자 인터뷰 결과, 첫 readiness slice의 결정은 아래와 같다.

| Decision | Locked Choice |
| --- | --- |
| 첫 readiness 대상 | `Bottleneck-readable production graph` |
| 병목 축 | `생산 / 보관 / 납품` 3축 |
| 첫 화면 노출 | 요약 1줄 + 상세는 action card |
| 통과 기준 | 플레이어가 무엇이 부족하고 왜 업그레이드해야 하는지 이해해야 함 |
| 업그레이드 구조 | 가장 부족한 축 1개 추천 + 다른 2축도 선택 가능 |
| 업그레이드 결과 | 수치와 화면 prop 둘 다 변해야 함 |
| 첫 병목 우선순위 | 보관 부족 먼저 |
| 범위 제한 | 목표 달성이 우선이며 full vertical slice 리빌드 허용 |
| 최종 성공 | 첫 10분 retention loop |
| gate 강도 | Blocking Gate |
| 실패 처리 | PR을 닫지 않고 같은 slice 안에서 보완 |
| 증거 | Scripted QA + screenshot evidence |

## Non-Negotiables

목표 달성을 위해 정원, 씨앗, 도감, 연구, 원정, save shape, economy config, UI 구조, prop/asset 추가까지 변경할 수 있다.

다만 아래 Phase 0 금지선은 계속 유지한다.

- 실제 결제 또는 checkout 금지
- 로그인/account/credential 입력 금지
- 실제 광고 SDK 금지
- 외부 배포 또는 production user data 금지
- 런타임 이미지 생성 금지
- accepted game asset으로 SVG/vector/code-native drawing 등록 금지

## Core Slice Definition

### 이름

`Bottleneck-readable production graph`

### Player Verb

`수확`, `수령`, `강화`, `납품`

### Core Loop Layer

- First creature loop
- Production loop
- Order loop
- Upgrade choice loop
- Offline return preparation
- Research/expedition preview

### 병목 3축

| Axis | Meaning | First Required Read | Example Upgrade |
| --- | --- | --- | --- |
| 생산 | 잎을 만드는 속도 | 누가/무엇이 잎을 만드는지 보인다 | `작업 간식`, `작업대 강화` |
| 보관 | 자동 생산과 offline reward를 담는 양 | 보관이 먼저 부족해진다 | `선반 정리`, `보관 바구니` |
| 납품 | 주문 crate로 자원을 목적 있게 내보내는 흐름 | 주문/출하 대기 상태가 보인다 | `포장대 정리`, `주문 준비` |

첫 구현의 추천 병목은 `보관`이어야 한다. 생산은 돌아가고 있지만 보관이 부족해서 `선반 정리` 같은 upgrade가 의미 있게 보여야 한다.

## Screen Contract

### First Screen Summary

정원 첫 화면에는 3축을 긴 panel로 펼치지 않는다. 한 줄 요약만 보여준다.

예시:

```text
생산 충분 · 보관 부족 · 납품 대기
```

또는:

```text
분당 12.8 잎 · 보관 거의 참 · 주문 24/24
```

요약은 아래 조건을 지켜야 한다.

- 첫 화면에서 playfield를 가리지 않는다.
- 360px 폭에서도 줄바꿈/잘림 없이 읽힌다.
- `보관 부족` 또는 equivalent warning이 첫 추천 upgrade와 연결된다.
- debug counter처럼 보이면 실패다.

### Action Card Detail

상세는 하단 action card에서 보여준다.

필수 정보:

- 현재 가장 부족한 축
- 왜 부족한지
- 추천 upgrade
- 추천 upgrade가 바꾸는 수치
- 추천 upgrade가 바꾸는 화면 prop
- 다른 2축의 선택지도 보조로 제공

예시:

```text
추천: 선반 정리
보관이 거의 찼어요. 선반을 정리하면 오프라인 보관량이 +20% 늘고,
정원 선반이 더 넉넉한 상태로 바뀝니다.

선택 가능: 작업 간식 / 포장대 정리
```

## Upgrade Contract

업그레이드가 통과하려면 수치와 화면 prop이 모두 변해야 한다.

| Upgrade Type | Numeric Change | Visual/Prop Change |
| --- | --- | --- |
| 생산 강화 | `leaf_per_min` 또는 actor contribution 증가 | worker action, tool, workbench, production badge 변화 |
| 보관 강화 | offline/storage cap 또는 stored reward cap 증가 | 선반, 바구니, 보관 게이지, stored leaf prop 변화 |
| 납품 강화 | order throughput, dispatch readiness, crate capacity 중 하나 변화 | order crate, seal, dispatch lane, receipt 상태 변화 |

숫자만 바뀌면 실패다. prop만 바뀌어도 실패다.

## First 10 Minutes Retention Loop

다음 흐름을 scripted QA로 재현해야 한다.

| Step | Required State | Required Evidence |
| --- | --- | --- |
| 1. 첫 수확 | 첫 생명체가 이름 있는 존재로 reveal됨 | reveal screenshot/assertion |
| 2. 자동 생산 | 생명체가 정원 actor로 일하고 잎 생산이 시작됨 | actor + production summary screenshot |
| 3. 보관 병목 | 보관이 가장 부족한 축으로 읽힘 | `보관 부족` 요약 또는 equivalent assertion |
| 4. 추천 업그레이드 | `선반 정리` 계열 upgrade가 추천되고 다른 2축도 선택 가능 | action card screenshot/assertion |
| 5. upgrade 적용 | 보관 수치와 선반/바구니 prop이 모두 변함 | before/after screenshot + state assertion |
| 6. 주문/납품 | 생산 자원이 order crate/납품 흐름으로 연결됨 | crate/progress/dispatch screenshot |
| 7. 다음 기대 | 다음 생명체, 연구, 원정 중 최소 1개가 preview됨 | next-goal screenshot/assertion |

## Blocking Gate

Core gameplay PR은 아래 항목을 모두 만족해야 merge-ready다.

- `Bottleneck-readable production graph`가 WorkUnit plan에 명시됨
- 병목 3축 `생산 / 보관 / 납품`이 화면과 state에 존재함
- 첫 추천 병목이 `보관 부족`으로 재현됨
- 첫 화면에는 요약 1줄, 상세는 action card에 표시됨
- 추천 upgrade 1개와 대체 선택지 2개가 존재함
- upgrade 후 수치와 화면 prop이 모두 변함
- 첫 10분 retention loop 7단계를 scripted QA로 증명함
- mobile 393 screenshot, mobile 360 또는 short-height screenshot, desktop browser frame screenshot을 남김
- Browser Use `iab` 실기 확인 또는 현재 세션 blocker 기록을 남김
- PR body에 readiness evidence를 연결함

## Failure Handling

이 gate를 만족하지 못하면 부분 merge하지 않는다.

실패 처리:

1. PR을 닫지 않는다.
2. 같은 slice 안에서 보완 commit 또는 보완 issue를 만든다.
3. 실패한 readiness 항목을 PR body와 item에 표시한다.
4. scripted QA와 screenshot evidence가 통과할 때까지 merge-ready로 표시하지 않는다.

금지:

- “일부 개선됐으니 merge하고 후속 issue로 넘김”
- “수치만 바뀌었으니 core는 통과”
- “prop만 바뀌었으니 visual은 통과”
- “Playwright assertion만 있고 screenshot evidence 없음”
- “Browser Use 시도/blocker 없음”

## Required WorkUnit Template

다음 core gameplay issue는 이 template을 채워야 한다.

```text
Game Studio route:
Readiness gate: docs/PRODUCTION_SLICE_READINESS.md
Slice: Bottleneck-readable production graph
Player verb:
Core loop layer:
Reference teardown:
3-axis bottleneck state:
First bottleneck recommendation:
Screen summary:
Action card details:
Upgrade numeric change:
Upgrade prop change:
First 10m retention loop evidence plan:
Browser Use evidence plan:
Non-goals / Phase 0 forbidden boundaries:
Acceptance:
```

## QA Evidence Plan

최소 자동화 시나리오:

- fresh start path
- first harvest path
- production claim path
- storage bottleneck path
- recommended storage upgrade path
- order delivery path
- next-goal preview path

최소 screenshot:

- `mobile-393-before-upgrade`
- `mobile-393-after-upgrade`
- `mobile-360-summary-fit`
- `desktop-frame-summary-fit`
- `order-delivery-after-upgrade`
- `next-goal-preview`

Scripted QA는 Playwright로 반복 가능해야 하고, Browser Use는 실제 in-app browser source-of-truth로 시도해야 한다.

