## 요약

작업대 강화 완료 후 `온실 설비` 목표가 등장하고, 잎 80 + 재료 1로 첫 온실 선반을 설치해 자동 생산률을 `분당 15.3 잎`까지 올리게 했다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 원정 재료 -> 작업대 강화 -> 첫 온실 설비 목표로 이어지는 장기 시설 progression 실루엣.

## Plan-first evidence

- Plan artifact: `items/0109-greenhouse-facility-unlock-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 작업대 강화 이후에만 설비 목표를 조건부 노출하고, 모바일 action surface overflow를 visual test로 검증했다.
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

- 게임 가치: 재료 사용이 일회성 강화에서 끝나지 않고 온실 설비라는 다음 장기 성장 목표로 이어진다.
- 운영사 가치: #159 이후 기준에 맞게 안전한 작은 작업이 아니라 production vertical slice를 선택했다.

## Before / After 또는 Visual evidence

- Before: 작업대 강화 완료 후 다음 시설 확장 실루엣이 없었다.
- After: 작업대 강화 완료 후 `온실 설비` 카드가 등장하고 완료 시 `온실 선반 +10% 가동`, `분당 15.3 잎`으로 보인다.
- Browser Use evidence 또는 blocker: `reports/visual/p0-greenhouse-facility-unlock-browser-use-20260430.png`
- N/A 사유: 해당 없음.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: local save migration 기본값을 추가했고, playable main worktree를 수정하지 않는다.

## 검증

- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS
- [x] `npm run check:visual -- --grep "온실 설비"` PASS
- [x] `npm run check:visual` PASS, 34 passed

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

GitHub checks에서 동일한 CI gate를 재확인해야 한다.

## 연결된 issue

Closes #200
