## 요약

달빛 새싹 목표 씨앗이 planting에서 끝나지 않도록 성장/수확 branch를 추가한다. `seed_lunar_sprout_001` 수확은 일반 말랑잎 수확이 아니라 `달빛 새싹 발견 준비` objective, receipt, telemetry, action surface로 전환된다.

## Small win

플레이어가 `목표 심기` 이후 두 번 `돌보기`와 `수확`을 하면 다음 발견/reveal-ready 상태를 바로 본다.

## 사용자/운영자 가치

사용자는 연구 단서가 실제 다음 씨앗 성장과 발견 준비로 이어지는 progression을 이해한다. 운영자는 #484 plan, screenshot evidence, deterministic smoke assertion으로 이 player-facing claim을 재현할 수 있다.

## Before / After 또는 Visual evidence

Before: #482 이후 `seed_lunar_sprout_001` 수확은 일반 수확 branch로 떨어질 위험이 있었다.

After:

- `reports/visual/issue-0484-lunar-sprout-growth-reveal/phaser-check-lunar-sprout-ready-393.png`
- `reports/visual/issue-0484-lunar-sprout-growth-reveal/phaser-check-lunar-sprout-harvested-393.png`
- `reports/visual/issue-0484-lunar-sprout-growth-reveal/visual-report-20260508.md`

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
- Phaser runtime state, HUD telemetry, smoke checker, 운영 evidence 문서만 변경

## 남은 위험

dedicated 달빛 새싹 reveal FX/portrait asset은 아직 없다. 현재 환경은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 새 raster provenance를 만들 수 없으므로 후속 asset WorkUnit으로 분리한다.

## 연결된 issue

Closes #484

PR: #485

## 작업 checklist

- [x] Plan-first WorkUnit 작성
- [x] Game Studio route 기록
- [x] Department Scorecard와 Role Debate 기록
- [x] Browser Use blocker 또는 evidence 기록
- [x] Screenshot evidence 저장
- [x] Local verification 통과
- [x] PR checks 통과
- [ ] Merge 후 main CI 확인
