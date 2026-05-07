# 연구 선반 preview bridge

## 요약

storage/offline reward 회수 이후 board가 research/discovery로 이어지도록 `연구 선반` preview bridge를 추가했습니다.

- `research_shelf` facility kind와 `facility_research_shelf` board slot 추가
- storage claim 후 research shelf를 preview state로 전환
- research shelf 선택 시 `살펴보기` action 제공
- `살펴보기` 후 달빛 씨앗 단서 preview receipt/objective와 telemetry 기록
- Phaser smoke verifier에 ready/inspected screenshots와 research telemetry assertion 추가

## Small win

보관 잎을 회수한 직후 다음 장기 목표가 빈 상태로 끝나지 않고, 플레이어가 다음 씨앗 단서를 살펴보는 discovery verb로 이어집니다.

## 사용자/운영자 가치

플레이어는 생산/보관/주문 다음에 “다음 씨앗을 발견한다”는 D1-D7 retention 실루엣을 봅니다. 운영자는 다음 WorkUnit에서 씨앗 family clue, research shelf raster, discovery content를 붙일 수 있는 좁은 runtime bridge를 확보했습니다.

## Before / After 또는 Visual evidence

- Before: storage claim 후 objective가 보관 회수 완료에서 멈추고 다음 discovery surface가 없었습니다.
- After: `facility_research_shelf` preview가 board 왼쪽에 열리고, `살펴보기` action 후 `연구 선반 살펴보기 · 달빛 씨앗 단서 preview` receipt가 남습니다.
- Ready: `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-research-shelf-ready-393.png`
- Inspected: `reports/visual/issue-0470-research-shelf-preview-bridge/phaser-check-research-shelf-inspected-393.png`
- Visual report: `reports/visual/issue-0470-research-shelf-preview-bridge/visual-report-20260508.md`

## Playable mode

- Phaser app only: `npm run dev:phaser`
- 검증 viewport: 393x852
- 기존 plant/care/harvest/order/storage/overview smoke loop 유지

## 검증

- `npm run check:phaser`: PASS
- `npm run check:ci`: PASS
- `researchShelfPreviewSeen`: `true`
- `previewSlotIds`: includes `facility_research_shelf`
- research facility state: `kind=research_shelf`, `visualState=preview`
- receipt: `연구 선반 살펴보기 · 달빛 씨앗 단서 preview`
- `git diff --check`: PASS

## 안전 범위

- 신규 asset 생성 없음
- runtime image generation/API/cache 호출 없음
- accepted manifest game asset 추가 없음
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음
- existing workbench raster를 임시 stand-in으로만 재사용

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] GitHub issue 생성
- [x] runtime state/action 추가
- [x] visual report 작성
- [x] Phaser smoke verifier 갱신
- [x] full CI 통과

## 남은 위험

- Browser Use execution tool이 이번 세션에 노출되지 않아 Playwright fallback evidence를 사용했습니다.
- `facility_research_shelf`는 dedicated raster가 아니라 existing accepted workbench raster를 임시 재사용합니다. research shelf 전용 raster/provenance는 후속 asset WorkUnit에서 처리해야 합니다.

## 연결된 issue

Closes #470
