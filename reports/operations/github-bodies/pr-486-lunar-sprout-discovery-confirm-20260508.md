## 요약

달빛 새싹 수확 후 `다음 발견 준비 완료`가 안내에서 멈추지 않도록 `발견 확인` action을 추가한다. 클릭 후 연구 선반에 `달빛 family reveal` surface가 남고, `researchLunarFamilyRevealed=true`, `researchNextGoalRevealReady=false` telemetry가 기록된다.

## Small win

플레이어가 달빛 새싹 수확 직후 `발견 확인`을 눌러 다음 연구 family가 열렸다는 상태를 연구 선반에서 본다.

## 사용자/운영자 가치

사용자는 수확 보상이 다음 연구 목표로 이어지는 progression을 이해한다. 운영자는 #486 plan, screenshot evidence, deterministic smoke assertion으로 이 player-facing claim을 재현할 수 있다.

## Before / After 또는 Visual evidence

Before: #484 이후 `달빛 새싹 발견 준비`는 action rail 안내로만 남았다.

After:

- `reports/visual/issue-0486-lunar-sprout-discovery-confirm/phaser-check-lunar-sprout-harvested-393.png`
- `reports/visual/issue-0486-lunar-sprout-discovery-confirm/phaser-check-lunar-family-revealed-393.png`
- `reports/visual/issue-0486-lunar-sprout-discovery-confirm/visual-report-20260508.md`

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
- 결제/광고/외부 배포/고객 데이터 변경 없음
- Phaser runtime state, HUD/action, research shelf visual chip, smoke checker, 운영 evidence 문서만 변경

## 남은 위험

dedicated 달빛 family reveal FX/portrait asset은 아직 없다. 현재 환경은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 새 raster provenance를 만들 수 없으므로 후속 asset WorkUnit으로 분리한다.

## 연결된 issue

Closes #486

PR: #487

## 작업 checklist

- [x] Plan-first WorkUnit 작성
- [x] Game Studio route 기록
- [x] Department Scorecard와 Role Debate 기록
- [x] Browser Use blocker 또는 evidence 기록
- [x] Screenshot evidence 저장
- [x] Local verification 통과
- [ ] PR checks 통과
- [ ] Merge 후 main CI 확인
