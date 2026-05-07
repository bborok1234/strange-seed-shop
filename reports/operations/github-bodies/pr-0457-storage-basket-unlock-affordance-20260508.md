## 요약

#457은 두 번째 주문 납품 후 `보관 바구니 준비`가 실제 board action으로 이어지게 만듭니다. `보관 바구니`를 선택하면 `정리 80잎` action이 뜨고, unlock 후 storage capacity가 `12 -> 24`로 올라갑니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 두 번째 납품 후 `보관 바구니`를 정리해 `오프라인 보관 24` affordance를 볼 수 있습니다.

## Plan-first evidence

- Plan artifact: `items/0245-storage-basket-unlock-affordance.md`
- Plan에서 벗어난 변경이 있다면 이유: 없음.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:phaser-2d-game`, `game-studio:game-ui-frontend`, `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: second delivery 이후 storage slot이 player action으로 열리고, selected facility HUD와 receipt가 screenshot evidence로 남습니다.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: 주문 반복 후 다음 병목인 storage/offline cap이 즉시 선택 가능한 성장 행동으로 보입니다.
- 운영사 가치: Phaser v1 first-session chain이 order throughput 이후 storage bottleneck까지 자동 검증됩니다.

## Before / After 또는 Visual evidence

- Before: `2번째 주문 납품 완료 · 보관 바구니 준비` 이후 storage slot은 locked 상태로 action이 없었습니다.
- After: `보관 바구니 정리 · 잎 -80 · 오프라인 보관 12 -> 24`, objective `보관 바구니 정리 완료 · 오프라인 보관 24`, `facility_storage` level `1`/active가 검증됩니다.
- Browser Use evidence 또는 blocker: Browser Use `iab` backend가 현재 세션에 노출되지 않아 `reports/visual/issue-0457-storage-basket-unlock-affordance/visual-report-20260508.md`에 blocker와 Playwright fallback evidence를 기록했습니다.
- N/A 사유: 새 accepted manifest asset은 추가하지 않았습니다. Dedicated storage raster는 후속 WorkUnit입니다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: Phaser app runtime/state/check script만 변경하고 playable main worktree 계약과 legacy playable command는 변경하지 않았습니다.

## 검증

- [x] `npm run check:phaser` PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

Storage 전용 raster, offline reward cap 수치, comeback modal은 후속 WorkUnit입니다. 이 PR은 board unlock affordance만 닫습니다.

## 연결된 issue

Closes #457
