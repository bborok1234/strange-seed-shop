# 보관 바구니 전용 raster와 회수 FX plan-prompt 만들기

## 요약

#465 이후 남은 storage/offline reward asset debt를 다음 generation WorkUnit이 바로 실행할 수 있는 plan/prompt 계약으로 고정했습니다.

- `facility_storage_basket_v1` plan/prompt 추가
- `fx_storage_claim_leaf_flyout_strip_v1` plan/prompt 추가
- storage claim FX 계약을 `facility_storage.action.claim_reward`, 8 frames, 96x96, 14fps, once behavior로 고정
- topology asset plan checker가 새 storage facility/FX 후보를 필수 id로 검증

## Small win

보관 바구니가 고유 raster prop과 dedicated claim FX strip 후보를 갖게 되어, 다음 asset generation/runtime integration WorkUnit에서 재기획 없이 바로 생성과 연결을 진행할 수 있습니다.

## 사용자/운영자 가치

플레이어 관점에서는 storage/offline reward loop가 주문 상자와 구분되는 고유 오브젝트와 보상 모션으로 읽힐 준비가 됐습니다. 운영자 관점에서는 runtime 변경 없이 asset production contract를 좁혀 다음 작업의 불확실성을 줄였습니다.

## Before / After 또는 Visual evidence

- Before: 보관 바구니는 gameplay verb가 연결됐지만 전용 storage raster와 dedicated claim FX 후보가 asset pipeline에 없었습니다.
- After: `facility_storage_basket_v1`과 `fx_storage_claim_leaf_flyout_strip_v1`이 plan/prompt에 있고, FX metadata가 checker로 잠겼습니다.
- Visual evidence: N/A — runtime UI/visual 변경 없이 asset plan/prompt만 추가했습니다. 다음 generation/runtime integration WorkUnit에서 Browser Use 또는 명시 blocker + Playwright fallback evidence를 남깁니다.

## Playable mode

영향 없음. runtime gameplay, save data, playable route를 변경하지 않았습니다.

## 검증

- `npm run check:topology-asset-plan`: PASS, requiredCount 16, planCount 69, promptCount 69, failures 0
- `npm run check:asset-provenance`: PASS
- `npm run check:asset-style`: PASS
- `npm run check:control-room`: PASS
- `npm run check:ops-live`: PASS
- `npm run check:github-metadata`: PASS
- `npm run check:ci`: PASS
- `npm run check:dashboard`: PASS after evidence update
- `git diff --check`: PASS

## 안전 범위

- runtime image generation/API/cache 호출 없음
- 실제 gpt-image-2/Codex native image generation 실행 없음
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음
- SVG/vector/code-native game graphics 계획 없음
- runtime Phaser behavior 변경 없음

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] GitHub issue 생성
- [x] asset plan/prompt one-to-one 검증
- [x] storage FX animation metadata 검증
- [x] roadmap/dashboard/control-room/heartbeat 갱신
- [x] full CI 통과

## 남은 위험

- 실제 PNG 생성과 alpha/style review는 다음 WorkUnit 범위입니다.
- Phaser runtime integration은 generated asset 후보가 승인된 뒤 별도 검증해야 합니다.

## 연결된 issue

Closes #467
