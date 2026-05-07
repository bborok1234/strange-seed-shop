# 연구 선반 raster와 단서 FX plan-prompt

## 요약

#470 이후 남은 research shelf art debt를 다음 generation WorkUnit이 바로 실행할 수 있는 plan/prompt 계약으로 고정했습니다.

- `facility_research_shelf_v1` plan/prompt 추가
- `fx_research_clue_glimmer_strip_v1` plan/prompt 추가
- research clue FX 계약을 `facility_research_shelf.action.inspect_clue`, 8 frames, 96x96, 12fps, once behavior로 고정
- topology asset plan checker가 새 research facility/FX 후보를 필수 id로 검증

## Small win

연구 선반이 workbench stand-in에서 벗어날 수 있도록 고유 raster prop과 `살펴보기` 전용 clue glimmer FX 후보를 generation-ready 상태로 만들었습니다.

## 사용자/운영자 가치

플레이어 관점에서는 storage reward 다음에 열리는 research/discovery surface가 생산 workbench와 구분될 준비가 됐습니다. 운영자 관점에서는 다음 asset generation/runtime integration WorkUnit이 재기획 없이 전용 prop/FX를 생성하고 연결할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #470 runtime은 `facility_research_shelf`를 열었지만 existing workbench raster를 임시 재사용했습니다.
- After: `facility_research_shelf_v1`과 `fx_research_clue_glimmer_strip_v1`이 plan/prompt에 있고, FX metadata가 checker로 잠겼습니다.
- Visual evidence: N/A — runtime UI/visual 변경 없이 asset plan/prompt만 추가했습니다. 다음 generation/runtime integration WorkUnit에서 Browser Use 또는 명시 blocker + Playwright fallback evidence를 남깁니다.

## Playable mode

영향 없음. runtime gameplay, save data, playable route를 변경하지 않았습니다.

## 검증

- `npm run check:topology-asset-plan`: PASS, requiredCount 18, planCount 71, promptCount 71, failures 0
- `npm run check:asset-provenance`: PASS
- `npm run check:asset-style`: PASS
- `npm run check:ci`: PASS
- `npm run check:ops-live`: PASS after heartbeat next_action contract fix
- `git diff --check`: PASS

## 안전 범위

- runtime image generation/API/cache 호출 없음
- 실제 gpt-image-2/Codex native image generation 실행 없음
- accepted manifest game asset 추가 없음
- SVG/vector/code-native game graphics 계획 없음
- runtime Phaser behavior 변경 없음
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음

## 작업 checklist

- [x] Game Studio route 기록
- [x] project asset plan/prompt skills 적용
- [x] plan-first item 작성
- [x] GitHub issue 생성
- [x] asset plan/prompt one-to-one 검증
- [x] research FX animation metadata 검증
- [x] roadmap/dashboard/control-room/heartbeat 갱신
- [x] full CI 통과

## 남은 위험

- 실제 PNG 생성과 alpha/style review는 다음 WorkUnit 범위입니다.
- Phaser runtime integration은 generated asset 후보가 승인된 뒤 별도 검증해야 합니다.
- #467 blocker 기준으로 현재 세션에는 `OPENAI_API_KEY`/native save path가 확보되지 않았으므로 이번 PR은 generation을 실행하지 않습니다.

## 연결된 issue

Closes #472
