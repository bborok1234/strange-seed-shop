## 문제 / 배경

#459에서 `storedLeaves`가 생겼지만 플레이어가 그 잎을 회수하는 동사는 아직 없습니다. 지금 상태는 보관 바구니가 `오프라인 보관 4/24`를 보여주기만 하므로, idle game의 핵심 comeback reward 순간이 닫히지 않습니다.

## 목표

보관 바구니가 열린 뒤 생산 수령으로 잎이 쌓이면, 보관 바구니 선택 시 `회수` action을 제공하고 `storedLeaves`를 현재 잎으로 이전합니다.

## Small win

`오프라인 보관 4/24`가 `회수` 한 번으로 `잎 +4`, `오프라인 보관 0/24`가 되는 deterministic Phaser v1 loop를 만든다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/GAME_BIBLE.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `docs/ROADMAP.md`

## Game Studio Department Signoff

- 기획팀: storage를 passive number가 아니라 `회수` verb로 연결한다.
- 리서치팀: Idle Miner / Egg, Inc.류 storage/offline gain은 복귀 claim 순간이 필요하다.
- 아트팀: 새 accepted raster는 만들지 않고 HUD/action affordance를 이번 payoff로 고정한다. dedicated storage raster는 다음 후보로 남긴다.
- 개발팀: `claimStoredLeaves`와 action rail, smoke verifier만 수정한다.
- 검수팀: Browser Use 노출을 재시도하고, 안 되면 Playwright fallback screenshot과 state assertions를 남긴다.
- 마케팅팀: 로컬/mock gameplay promise만 다룬다.
- 고객지원팀: "보관된 잎은 바구니에서 회수한다"는 다음 행동 설명이 가능해야 한다.

## Subagent/Team Routing

Solo execute. 변경 범위가 좁고, 병렬 subagent를 쓸 만큼 독립 산출물이 분리되지 않습니다.

## 플레이어 가치

플레이어가 "보관 바구니를 열었더니 돌아올 때 잎을 모아준다"는 오프라인 복귀 hook을 첫 5분 후반에 이해합니다.

## 수용 기준

- 보관 바구니가 unlocked이고 `storedLeaves > 0`이면 `회수` action이 보인다.
- `회수`는 `storedLeaves`만큼 잎을 늘리고 storage를 0으로 비운다.
- receipt가 `오프라인 보관 회수 · 잎 +n`을 남긴다.
- objective/action rail이 회수 후 `오프라인 보관 0/24` 상태를 보여준다.
- screenshot evidence가 storage claim 후 상태를 남긴다.
- runtime image generation/API/cache는 호출하지 않는다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0461-offline-storage-reward-claim/phaser-check-storage-buffer-393.png`
- `reports/visual/issue-0461-offline-storage-reward-claim/phaser-check-storage-claimed-393.png`
- `reports/visual/issue-0461-offline-storage-reward-claim/visual-report-20260508.md`

## Playable mode 영향

Phaser v1 local smoke path만 확장합니다. 기존 main playable worktree/port 계약은 유지합니다.

## 안전 범위

- 실제 결제/광고/외부 배포/고객 데이터 없음
- runtime image generation/API/cache 호출 없음
- 새 accepted manifest game asset 없음
- local deterministic Phaser state/action 변경만 수행

## 검증 명령

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
