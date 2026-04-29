# Research expedition bridge v0

Status: completed
Work type: game_ui
Branch: `codex/0090-research-expedition-bridge-v0`
Date: 2026-04-29
Issue: #160

## 문제 / 배경

#154에서 연구 완료가 다음 생명체/씨앗 단서로 이어졌지만, 연구가 아직 원정/장기 메타 행동으로 연결되지 않는다. North Star production bar는 Phase 0라도 연구, 탐험, 희귀 생명체 같은 장기 구조의 실루엣을 UI와 content hint로 보여줘야 한다고 규정한다.

## Small win

`?qaResearchComplete=1`에서 하단 원정 탭이 `단서` 상태를 보여주고, 원정 탭에 `달빛 흔적 찾기` 연구 원정 preview가 나타난다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 연구 완료 derived state와 원정 content hint를 save migration 없이 연결한다.
  - `game-studio:game-ui-frontend`: playfield/action surface를 늘리지 않고 bottom tab badge와 expedition tab card로 장기 메타를 노출한다.
  - `game-studio:game-playtest`: Browser Use와 visual gate로 research complete -> expedition clue를 검증한다.
- Player verb: 연구 완료 후 원정 탭 확인, 다음 장기 목표 기대.
- Core loop role: 주문 반복 -> 연구 완료 -> 원정/희귀 메타 실루엣.
- Screen moment: `?qaResearchComplete=1` 정원 하단 탭과 원정 탭.

## Plan

1. `researchLevel >= 1`일 때 `moon_hint` 원정을 research expedition teaser로 계산한다.
2. active expedition이 없고 연구 완료 상태이면 하단 원정 탭에 `단서` badge를 표시한다.
3. 원정 탭에 연구 원정 preview, 필요 생명체 수, 보상, 잠김/준비 상태 문구를 추가한다.
4. visual gate에 `?qaResearchComplete=1` 원정 탭 테스트를 추가한다.
5. Browser Use evidence와 visual report를 `reports/visual/`에 남긴다.

## 수용 기준

- [x] `?qaResearchComplete=1`에서 하단 원정 탭이 연구 단서 상태를 표시한다.
- [x] 원정 탭에 `달빛 흔적 찾기` 연구 원정 preview와 필요 생명체/보상/잠김 사유가 보인다.
- [x] 정원 playfield/action surface layout은 기존 research complete short viewport visual gate를 깨지 않는다.
- [x] Browser Use evidence와 visual report가 `reports/visual/`에 남는다.
- [x] `npm run check:ci`가 통과한다.

## 검증 명령

- [x] Browser Use QA: `http://127.0.0.1:5175/?qaResearchComplete=1`
- [x] `npm run check:visual -- --grep "연구 완료 후 원정"`
- [x] `npm run check:visual -- --grep "연구 단서|짧은 모바일"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`

## Evidence

- Browser Use screenshot: `reports/visual/p0-research-expedition-bridge-v0-browser-use-20260429.png`
- Visual report: `reports/visual/p0-research-expedition-bridge-v0-20260429.md`
- Playwright screenshot: `reports/visual/p0-research-expedition-bridge-v0-20260429.png`

## 안전 범위

- save schema migration 없음.
- economy payout, 실제 expedition unlock/claim semantics 변경 없음.
- assets 변경 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
