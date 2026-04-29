# Research clue reward v0

Status: completed
Work type: game_meta_ui_runtime
Branch: `codex/0087-research-clue-reward-v0`
Date: 2026-04-29
Issue: #154

## 문제 / 배경

#152에서 두 번째 주문 보상이 `새싹 기록법 연구` purchase로 이어졌지만, 연구 완료가 아직 다음 수집 행동을 바꾸지는 않는다. 연구가 장기 메타라면 완료 후 플레이어가 “다음 생명체를 더 잘 찾게 됐다”는 역할을 읽을 수 있어야 한다.

## Small win

`researchLevel >= 1`이면 정원 다음 생명체 카드와 씨앗 탭에 연구 단서가 보여, 연구가 다음 수집 목표를 도와주는 행동으로 읽힌다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: `researchLevel` 기반 next creature clue projection을 추가한다.
  - `game-studio:game-ui-frontend`: 연구 단서를 작은 gameplay cue로 표시하되 playfield/action surface를 덮지 않는다.
  - `game-studio:game-playtest`: `qaResearchComplete=1` 정원/씨앗 탭과 짧은 모바일 viewport를 Browser Use + visual gate로 검증한다.
- Player verb: 연구 완료 확인, 다음 생명체 단서 읽기, 씨앗 탭에서 다음 수집 행동으로 이동.
- Core loop role: 주문 -> 연구 -> 다음 생명체 목표 clarity.
- Screen moment: `?qaResearchComplete=1` 정원 첫 화면과 씨앗 탭.
- Asset/FX need: 새 asset 없음.
- Playtest evidence: Browser Use current tab QA, mobile 393, short 399x666 visual gate.

## Plan

1. `qaResearchComplete=1` save를 추가해 연구 완료 상태를 빠르게 재현한다.
2. `researchLevel >= 1`이면 다음 생명체 카드에 `연구 단서` line을 추가한다.
3. 씨앗 탭의 다음 목표 seed 또는 goal banner에 같은 research clue를 노출한다.
4. visual gate가 연구 완료 단서와 viewport fit을 검증하게 한다.
5. Browser Use QA와 `reports/visual/` evidence를 남긴다.
6. `npm run check:visual`, `npm run check:ci`로 검증한다.

## 수용 기준

- [x] `qaResearchComplete=1`에서 `researchLevel` 완료 상태가 로드된다.
- [x] 정원 다음 생명체 카드에 연구 단서가 보인다.
- [x] 씨앗 탭에서 다음 목표 seed 또는 goal banner에 연구 단서가 보인다.
- [x] 399x666 짧은 viewport에서 action surface internal scroll과 bottom tab overlap이 없다.
- [x] Browser Use evidence, `npm run check:visual`, `npm run check:ci`가 통과한다.

## 검증 명령

- [x] Browser Use in-app QA
- [x] `npm run check:visual -- --grep "연구 단서|짧은 모바일"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 새 dependency 없음.
- runtime image generation 없음.
- Branch protection 우회 없음.

## Evidence

- Browser Use:
  - `reports/visual/p0-research-clue-reward-v0-browser-use-20260429.png`
  - `reports/visual/p0-research-clue-reward-v0-seeds-tab-browser-use-20260429.png`
- Visual report: `reports/visual/p0-research-clue-reward-v0-20260429.md`
- Focused visual gate: PASS, `npm run check:visual -- --grep "연구 단서|짧은 모바일"`
- Full visual gate: PASS, 18 tests
- CI gate: PASS, `npm run check:ci`

## 남은 리스크

- 연구 단서는 아직 실제 확률/경제 효과가 아니다. 후속에서 도감 단서 강화, 탐험 준비, 온실 시설 중 하나로 연결해야 한다.
