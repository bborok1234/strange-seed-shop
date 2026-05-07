## 문제 / 배경

#463까지 보관 바구니는 `4/24 -> 0/24` 상태를 playfield에서 보여주지만, `회수` 순간은 아직 숫자와 receipt 중심입니다. v1 idle game feel 기준에서는 보상을 가져가는 순간에 보관 바구니 위치에서 즉시 시각 반응이 필요합니다.

## 목표

보관 바구니 `회수` action을 누르면 기존 generated `fx_harvest_leaf_flyout_strip_v1`을 storage slot 위치에서 재생해 reward motion처럼 보이게 합니다.

## Small win

보관 바구니 회수 순간이 숫자 변경이 아니라 storage 위치 reward motion으로 느껴진다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/GAME_BIBLE.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `docs/ROADMAP.md`

## Game Studio Department Signoff

- 기획팀: 회수 verb가 즉시 보상 반응으로 이어진다.
- 리서치팀: idle claim 순간은 위치 기반 reward motion이 production quality에 맞다.
- 아트팀: 새 raster 없이 existing generated FX strip을 reuse한다. dedicated storage FX는 후속 후보.
- 개발팀: pending FX kind/slot routing과 smoke verifier만 수정한다.
- 검수팀: `check:phaser` screenshot과 receipt/state로 검증한다.
- 마케팅팀: 로컬/mock gameplay만 다룬다.
- 고객지원팀: 플레이어가 회수 성공을 즉시 이해한다.

## Subagent/Team Routing

Solo execute. 변경 범위가 Phaser FX routing과 smoke verifier로 좁고, 새 asset generation lane은 이번 scope에 없습니다.

## 플레이어 가치

플레이어가 보관 바구니에서 잎을 가져갔다는 사실을 위치 기반 motion으로 즉시 이해합니다.

## 수용 기준

- `회수` action 후 storage slot 위치에서 leaf flyout reward motion이 재생된다.
- 회수 후 leaves `20`, storedLeaves `0`, receipt `오프라인 보관 회수 · 잎 +4`가 유지된다.
- screenshot evidence가 storage claim 후 상태를 남긴다.
- runtime image generation/API/cache는 호출하지 않는다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0465-storage-claim-reward-motion/phaser-check-storage-claimed-393.png`
- `reports/visual/issue-0465-storage-claim-reward-motion/visual-report-20260508.md`

## Playable mode 영향

Phaser v1 local smoke path만 확장합니다. 기존 main playable worktree/port 계약은 유지합니다.

## 안전 범위

- 실제 결제/광고/외부 배포/고객 데이터 없음
- runtime image generation/API/cache 호출 없음
- 새 accepted manifest game asset 없음
- existing generated FX strip만 runtime에서 재사용

## 검증 명령

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
