## 요약

`물안개 응축 납품` 완료가 숫자 보상에서 끝나지 않도록 playfield order crate와 production card에 `응축기 가동` / `달빛 온실 단서 +1` payoff를 추가했다. 기존 주문 완료 state에서 파생하므로 저장 schema는 늘리지 않았다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 돌아온 플레이어가 `물안개 응축 납품`을 완료하자마자 정원 화면에서 응축기가 켜지고 다음 온실 장기 메타 단서를 본다.

## Plan-first evidence

- Plan artifact: `items/0124-greenhouse-mist-condenser-payoff-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: playfield order crate 완료 variant, production card HUD chip, mobile 393px bottom-tab overlap/overflow invariant, Browser Use iab actual flow.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.

## 사용자/운영자 가치

- 게임 가치: 복귀 보너스 -> 생산 수령 -> 물안개 응축 납품 완료가 `응축기 가동`과 `달빛 온실 단서 +1`로 화면에 남아 다음 장기 메타가 읽힌다.
- 운영사 가치: 강화된 seed-ops queue gate가 기능-only가 아니라 asset/FX, HUD affordance, order crate visual state, playtest evidence를 실제 issue/PR에 반영한다.

## Before / After 또는 Visual evidence

- Before: `물안개 응축 납품 완료`와 숫자 보상은 보이지만 playfield/HUD가 새 설비 상태나 다음 단서를 충분히 남기지 않았다.
- After: production card에 `응축기 가동`, `달빛 온실 단서 +1`, `다음 온실 원정 준비`가 보이고, playfield order crate는 `order-variant-mist-condenser-complete` visual state와 droplet motion을 가진다.
- Browser Use evidence 또는 blocker: `reports/visual/p0-greenhouse-mist-condenser-payoff-20260501.md`
- Screenshot: `reports/visual/p0-greenhouse-mist-condenser-payoff-browser-use-20260501.png`

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch의 React/CSS/test/docs 변경이며, main playable worktree 정책과 port 5174 설정은 변경하지 않는다.

## 검증

- [x] `npm run check:ci` PASS
- [x] Browser Use iab PASS: `qaGreenhouseMist=1` -> `보상 확인` -> `생산 잎 수령` -> `주문 납품` -> `응축기 가동` / `달빛 온실 단서 +1`
- [x] `npm run check:visual -- --grep "물안개 응축"` PASS
- [x] `npm run check:content` PASS
- [x] `npm run check:loop` PASS
- [x] `npm run build` PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

응축 단서는 아직 별도 원정/수집 mechanic으로 소비되지 않는다. 후속 issue에서 새 collection/expedition clue loop로 이어야 한다.

## 연결된 issue

Closes #242
