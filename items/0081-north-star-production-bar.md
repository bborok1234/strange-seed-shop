# North Star production bar 정렬

Status: completed
Work type: product_direction
Branch: `codex/0081-north-star-production-bar`
Date: 2026-04-29
Issue: #142

## 문제 / 배경

`docs/IDLE_CORE_CREATIVE_GUIDE.md`에는 Egg, Inc. / Idle Miner Tycoon / Cell to Singularity 기준으로 `이상한 씨앗상회`를 production급 idle collection tycoon으로 끌어올리는 방향이 적혀 있다. 하지만 최상위 헌장인 `docs/NORTH_STAR.md`는 여전히 “첫 5분 귀여움”과 “작은 수집 루프” 중심이라, `$seed-ops`가 다음 작업을 고를 때 경쟁사 수준의 production bar보다 작은 기능 개선과 UI patch를 우선하기 쉽다.

## Small win

`NORTH_STAR.md`가 “귀여운 수집 프로토타입”이 아니라 “식물 생명체가 정원을 자동화하고 주문/탐험/연구로 확장되는 idle collection tycoon”을 최상위 목표로 선언한다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations` for core loop, progression, simulation/render/UI boundaries
  - `game-studio:game-ui-frontend` for production HUD, playfield-first, action surface policy
  - `game-studio:game-playtest` for first 5m clarity, game feel, screen evidence
  - `game-studio:sprite-pipeline` for creature actor and FX asset requirements

## Plan

1. `docs/NORTH_STAR.md`에 competitive production bar를 추가한다.
2. Phase 0 핵심 루프를 production engine loop 기준으로 확장한다.
3. 게임 북극성 지표에 production engine, upgrade choice, order delivery, visible actor/FX, long-meta tease를 추가한다.
4. 작업 우선순위 판단법을 작은 기능 단위가 아니라 vertical slice 단위로 바꾼다.
5. Roadmap에 문서 정렬 item을 연결한다.

## 수용 기준

- [x] `NORTH_STAR.md`가 Egg, Inc. / Idle Miner / Cell to Singularity에서 차용한 production bar를 최상위 문서로 소유한다.
- [x] 다음 issue는 단순 UI polish보다 production engine visibility, player verb, asset/FX, upgrade/order/progression slice를 우선하게 된다.
- [x] 작은 기능 개선은 vertical slice를 강화할 때만 우선순위가 높아진다는 규칙이 문서화된다.

## Evidence

- Issue #142: CLOSED
- `docs/NORTH_STAR.md`: `경쟁작 기준 Production Bar`, `Phase 0 핵심 루프`, `게임 북극성 지표`, `우선순위 판단법`, `작은 작업 선택 금지선`
- Checker: `scripts/check-p0-game-ui-ux.mjs`

## 검증 명령

- `npm run check:docs`
- `npm run check:ci`

## 안전 범위

- 문서/운영 방향만 수정한다.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
