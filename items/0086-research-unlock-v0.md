# Research unlock v0

Status: completed
Work type: game_meta_ui_runtime
Branch: `codex/0086-research-unlock-v0`
Date: 2026-04-29
Issue: #152

## 문제 / 배경

#150에서 두 번째 주문까지 이어졌지만 보상이 장기 메타로 연결되지 않는다. North Star production bar는 Phase 0라도 연구/온실 확장 같은 장기 구조의 실루엣이 UI와 action으로 보여야 한다고 규정한다.

## Small win

두 번째 주문 납품 후 `새싹 기록법 연구`를 구매하면 `researchLevel`이 저장되고 action surface에 연구 완료 상태가 남는다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: save schema migration과 단일 연구 purchase loop를 추가한다.
  - `game-studio:game-ui-frontend`: research choice가 잠김/가능/완료 상태로 읽히게 한다.
  - `game-studio:game-playtest`: 두 번째 주문 납품 -> 연구 구매 -> 완료 상태를 Browser Use와 visual gate로 검증한다.
- Player verb: 두 번째 주문 납품, 첫 연구 구매, 장기 메타 확인.
- Core loop role: 주문 반복 -> 연구 재료 획득 -> 장기 성장 메타 첫 unlock.
- Screen moment: `?qaResearchReady=1`와 short mobile viewport.
- Asset/FX need: 새 asset 없음.
- Playtest evidence: Browser Use current tab QA, mobile 393, short 399x666 visual gate.

## Plan

1. `PlayerSave`에 `researchLevel`을 추가하고 persistence normalize 기본값을 둔다.
2. `buyFirstResearch` 액션과 analytics event를 추가한다.
3. upgrade choice surface에 `연구` choice를 추가한다.
4. `qaResearchReady=1` save를 추가해 두 번째 주문 납품 직전 상태를 만든다.
5. visual gate가 두 번째 주문 납품 후 연구 구매와 완료 상태를 검증하게 한다.
6. Browser Use QA와 `reports/visual/` evidence를 남긴다.

## 수용 기준

- [x] 두 번째 주문 완료 전에는 연구 choice가 잠김/준비 상태로 보인다.
- [x] 두 번째 주문 납품 후 `새싹 기록법 연구`를 구매할 수 있다.
- [x] 구매 후 `researchLevel`이 저장되고 연구 완료 상태가 보인다.
- [x] 기존 save는 migration을 통해 정상 로드된다.
- [x] 399x666 짧은 viewport에서 panel internal scroll과 bottom tab overlap이 없다.
- [x] `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- [x] Browser Use in-app QA
- [x] `npm run check:visual -- --grep "연구 unlock|짧은 모바일|반복 주문"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 새 dependency 없음.
- runtime image generation 없음.
- Branch protection 우회 없음.

## Evidence

- Browser Use: `reports/visual/p0-research-unlock-v0-browser-use-20260429.png`
- Visual report: `reports/visual/p0-research-unlock-v0-20260429.md`
- Focused visual gate: PASS, `npm run check:visual -- --grep "연구 unlock|짧은 모바일|반복 주문"`
- Full visual gate: PASS, 16 tests
- CI gate: PASS, `npm run check:ci`

## 남은 리스크

- 연구 구매는 저장/표시까지만 담당한다. 연구 효과가 도감 단서나 새 시설로 이어지는 후속 issue가 필요하다.
- upgrade choice가 4개로 늘었다. 더 늘어나는 순간 compact choice 구조를 carousel/drawer로 바꿔야 한다.
