## 요약

원정 문 preview 이후 첫 tutorial route `뒷마당 틈새길`을 출발/귀환 crate loop로 연결한다. `틈새길 보내기`를 누르면 route가 `traveling`이 되고, deterministic return-ready 후 `귀환 상자 열기`로 잎 보상과 receipt가 남는다.

## Small win

플레이어가 D7 원정 문을 단순 preview가 아니라 `보내기 -> 돌아옴 -> 상자 열기` long verb로 처음 경험한다.

## 사용자/운영자 가치

사용자는 research family reveal 이후 원정 route가 실제 idle comeback loop로 이어진다는 약속을 본다. 운영자는 #490 plan, screenshot evidence, deterministic smoke assertion으로 depart/traveling/returned/claimed 상태를 재현할 수 있다.

## Before / After 또는 Visual evidence

Before: #488 이후 원정 문은 board/HUD preview로 보이지만 출발/귀환 route state가 없다.

After:

- `reports/visual/issue-0490-first-expedition-depart-return/phaser-check-expedition-traveling-393.png`
- `reports/visual/issue-0490-first-expedition-depart-return/phaser-check-expedition-returned-393.png`
- `reports/visual/issue-0490-first-expedition-depart-return/phaser-check-expedition-claimed-393.png`
- `reports/visual/issue-0490-first-expedition-depart-return/visual-report-20260508.md`

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
- 실제 wall-clock 5분 timer, multi-party setup, rare drop 확률표 없음
- 결제/광고/외부 배포/고객 데이터 변경 없음
- Phaser route state, HUD/action, smoke checker, 운영 evidence 문서만 변경

## 남은 위험

dedicated expedition gate raster/return crate FX asset은 아직 없다. 현재 환경은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 새 raster provenance를 만들 수 없으므로 후속 asset WorkUnit으로 분리한다.

## 연결된 issue

Closes #490

## 작업 checklist

- [x] Plan-first WorkUnit 작성
- [x] Game Studio route 기록
- [x] Department Scorecard와 Role Debate 기록
- [x] Browser Use blocker 또는 evidence 기록
- [x] Screenshot evidence 저장
- [x] Local verification 통과
- [x] PR checks 통과
- [ ] Merge 후 main CI 확인
