## 요약

달빛 family reveal 이후 `원정 문 단서 보기` action을 추가한다. 클릭하면 preview-only `facility_expedition_gate`가 board/HUD에 남고, `expeditionGatePreviewVisible=true` telemetry가 기록된다.

## Small win

플레이어가 연구 선반에서 다음 장기 목표인 원정 문 preview를 실제 board state로 본다.

## 사용자/운영자 가치

사용자는 research family reveal이 D7 원정 route로 이어지는 실루엣을 이해한다. 운영자는 #488 plan, screenshot evidence, deterministic smoke assertion으로 이 player-facing claim을 재현할 수 있다.

## Before / After 또는 Visual evidence

Before: #486 이후 다음 장기 route는 `원정 문 단서` text promise에 머물렀다.

After:

- `reports/visual/issue-0488-expedition-gate-preview-route/phaser-check-lunar-family-revealed-393.png`
- `reports/visual/issue-0488-expedition-gate-preview-route/phaser-check-expedition-gate-preview-393.png`
- `reports/visual/issue-0488-expedition-gate-preview-route/visual-report-20260508.md`

Browser Use: 현재 세션에서 `iab` 실행 도구가 노출되지 않아 blocker를 보고서에 기록하고 Playwright fallback을 사용했다.

## Playable mode

main playable worktree 계약은 유지한다. 이번 변경은 Phaser v1 branch에서 검증한 뒤 PR/merge/main CI로 main에 반영한다.

## 검증

- [x] `npm run check:phaser`
- [x] `npm run check:ci`
- [x] `npm run check:control-room`
- [x] `npm run check:ops-live`
- [x] `npm run check:github-metadata`
- [x] `git diff --check`

## 안전 범위

- runtime image generation/API/cache 호출 없음
- 새 accepted game asset 추가 없음
- 실제 expedition timer/return/reward 없음
- 결제/광고/외부 배포/고객 데이터 변경 없음
- Phaser preview-only slot/facility, HUD/action, smoke checker, 운영 evidence 문서만 변경

## 남은 위험

dedicated expedition gate raster/return crate FX asset은 아직 없다. 현재 환경은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 새 raster provenance를 만들 수 없으므로 후속 asset WorkUnit으로 분리한다.

## 연결된 issue

Closes #488

## 작업 checklist

- [x] Plan-first WorkUnit 작성
- [x] Game Studio route 기록
- [x] Department Scorecard와 Role Debate 기록
- [x] Browser Use blocker 또는 evidence 기록
- [x] Screenshot evidence 저장
- [x] Local verification 통과
- [x] PR checks 통과
- [ ] Merge 후 main CI 확인
