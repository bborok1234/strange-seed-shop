# Moon expedition reward bridge v0

Status: completed
Work type: game_loop
Branch: `codex/0092-moon-expedition-reward-bridge-v0`
Date: 2026-04-29
Issue: #164

## 문제 / 배경

#162에서 `달빛 흔적 찾기` 원정 시작은 열렸지만, 원정 완료 후 보상 수령이 다음 수집 목표로 이어지는 순간은 아직 약하다. 장기 메타는 진행 상태만으로는 부족하고, 돌아와서 보상을 받았을 때 다음 씨앗/생명체 기대감이 즉시 보여야 한다.

## Small win

`?qaResearchExpeditionClaimReady=1&qaTab=expedition`에서 `원정 보상 받기`를 누른 뒤 `달방울 씨앗`과 `달방울 누누` 다음 목표가 보인다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:web-game-foundations`: 기존 expedition save와 content id로 claim-ready QA state와 derived next-goal 상태를 만든다.
  - `game-studio:game-ui-frontend`: 원정 탭 안에 보상 후 단서를 compact card로 추가하고 playfield를 덮지 않는다.
  - `game-studio:game-playtest`: Browser Use와 visual gate로 보상 수령 전/후, 씨앗/도감 target bridge를 확인한다.
- Player verb: 원정 보상 수령, 다음 달빛 목표 확인, 씨앗/도감 행동으로 이동.
- Core loop role: 연구 -> 원정 시작 -> 복귀 보상 -> 다음 수집 목표.
- Screen moment: `?qaResearchExpeditionClaimReady=1&qaTab=expedition`.

## Plan

1. `moon_hint` 완료 상태 QA save를 추가한다.
2. `moon_hint` reward claim 후 달빛 목표를 보여줄 derived state를 만든다.
3. 원정 탭에 `달방울 씨앗` / `달방울 누누` next-goal bridge를 추가한다.
4. 필요하면 씨앗/도감 target 계산이 달빛 목표와 충돌하지 않도록 좁게 보정한다.
5. visual gate와 Browser Use evidence를 남긴다.
6. roadmap/dashboard/GitHub issue evidence를 갱신한다.

## 수용 기준

- [x] `?qaResearchExpeditionClaimReady=1&qaTab=expedition`에서 `달빛 흔적 찾기`가 보상 수령 가능 상태로 보인다.
- [x] `원정 보상 받기` 후 잎/재료 보상이 반영되고 active expedition이 해제된다.
- [x] 보상 수령 후 원정 탭 또는 연결 CTA에서 `달방울 씨앗`과 `달방울 누누` 다음 목표가 보인다.
- [x] 씨앗/도감 탭에서도 달빛 목표가 기존 수집 목표 흐름과 충돌하지 않는다.
- [x] Browser Use evidence와 visual report가 `reports/visual/`에 남는다.
- [x] `npm run check:ci`가 통과한다.

## 검증 명령

- [x] Browser Use QA: `http://127.0.0.1:5175/?qaResearchExpeditionClaimReady=1&qaTab=expedition`
- [x] `npm run check:visual -- --grep "달빛 원정 보상"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`

## Evidence

- Browser Use screenshot: `reports/visual/p0-moon-expedition-reward-bridge-v0-browser-use-20260429.png`
- Visual report: `reports/visual/p0-moon-expedition-reward-bridge-v0-20260429.md`
- Playwright screenshot: `reports/visual/p0-moon-expedition-reward-bridge-v0-20260429.png`

## 안전 범위

- 새 save schema migration 없음.
- 새 asset 생성 없음.
- 원정 보상 수치 재튜닝 없음.
- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
