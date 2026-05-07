## 문제 / 배경

#461로 보관 잎을 회수할 수 있게 됐지만, storage 상태는 아직 action rail/objective를 읽어야만 알 수 있습니다. v1 board는 생산 엔진이 화면 자체에서 읽혀야 하므로, 보관 바구니가 `4/24`로 찼는지 `0/24`로 비었는지가 playfield facility state로 보여야 합니다.

## 목표

보관 바구니가 unlocked이면 playfield 위에 작고 안정적인 storage fill bar/chip을 그리고, 생산 수령 후 `4/24`, 회수 후 `0/24`가 같은 자리에서 보이게 합니다.

## Small win

보관 바구니가 HUD 설명 없이도 board 위에서 "찼다/비었다"로 읽힌다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/GAME_BIBLE.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `docs/ROADMAP.md`

## Game Studio Department Signoff

- 기획팀: storage/offline state를 board state로 읽히게 한다.
- 리서치팀: idle storage cap은 container/fill 상태로 읽히는 편이 production bar에 맞다.
- 아트팀: 새 raster가 아니라 overlay로 처리한다. API 키 부재 때문에 dedicated storage raster는 후속 issue로 남긴다.
- 개발팀: `renderFacilitySlot` storage branch와 smoke verifier만 수정한다.
- 검수팀: `check:phaser` screenshot과 window state로 filled/claimed를 확인한다.
- 마케팅팀: 로컬/mock gameplay만 다룬다.
- 고객지원팀: 플레이어가 바구니가 찼는지 눌러보기 전에도 이해한다.

## Subagent/Team Routing

Solo execute. 변경 범위가 Phaser renderer와 기존 smoke verifier로 좁고, 별도 asset generation lane이 이번 scope에서 blocked라 병렬 subagent를 쓰지 않습니다.

## 플레이어 가치

플레이어가 보관 바구니를 눌러보기 전에도 "여기에 오프라인 잎이 쌓인다"는 comeback hook을 화면에서 이해합니다.

## 수용 기준

- 보관 바구니가 unlocked이면 playfield prop 위에 storage fill bar/chip이 보인다.
- 생산 수령 후 storage state가 `4/24`로 보인다.
- 회수 후 같은 위치에서 `0/24`로 비워진다.
- screenshot evidence가 filled/claimed 상태를 남긴다.
- runtime image generation/API/cache는 호출하지 않는다.
- `npm run check:phaser`와 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- `reports/visual/issue-0463-storage-playfield-fill-state/phaser-check-storage-buffer-393.png`
- `reports/visual/issue-0463-storage-playfield-fill-state/phaser-check-storage-claimed-393.png`
- `reports/visual/issue-0463-storage-playfield-fill-state/visual-report-20260508.md`

## Playable mode 영향

Phaser v1 local smoke path만 확장합니다. 기존 main playable worktree/port 계약은 유지합니다.

## 안전 범위

- 실제 결제/광고/외부 배포/고객 데이터 없음
- runtime image generation/API/cache 호출 없음
- 새 accepted manifest game asset 없음
- local deterministic Phaser render/action 변경만 수행

## 검증 명령

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
