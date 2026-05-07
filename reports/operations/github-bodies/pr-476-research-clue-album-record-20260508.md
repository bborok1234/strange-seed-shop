# 연구 단서 도감 기록 bridge

## 요약

clue seed 수확 후 `도감 기록` action으로 달빛 family clue를 collection meta에 저장하는 Phaser bridge를 추가했습니다.

- `researchClueRecordReady`, `researchClueAlbumRecorded` state/telemetry 추가
- clue seed harvest 후 `도감 기록` action 제공
- `도감 기록` 후 receipt/objective로 다음 씨앗 목표 저장 피드백 추가
- smoke verifier를 clue harvest -> record ready -> recorded까지 확장

## Small win

단서 수확이 receipt에서 끝나지 않고, 플레이어가 `도감 기록`으로 discovery reward를 collection meta에 저장합니다.

## 사용자/운영자 가치

플레이어는 얻은 family clue가 어디에 남는지 확인할 수 있습니다. 운영자는 다음 WorkUnit에서 실제 album tab representation, 다음 씨앗 목표 CTA, record animation을 붙일 수 있는 runtime state를 확보했습니다.

## Before / After 또는 Visual evidence

- Before: clue seed 수확 후 `달빛 family clue +1` receipt만 남았습니다.
- After: action rail에 `도감 기록`이 열리고, 실행 후 `달빛 단서 도감 기록 · 다음 씨앗 목표 저장` receipt와 recorded telemetry가 남습니다.
- Record ready: `reports/visual/issue-0476-research-clue-album-record/phaser-check-research-clue-record-ready-393.png`
- Recorded: `reports/visual/issue-0476-research-clue-album-record/phaser-check-research-clue-recorded-393.png`
- Visual report: `reports/visual/issue-0476-research-clue-album-record/visual-report-20260508.md`

## Playable mode

- Phaser app only: `npm run dev:phaser`
- 검증 viewport: 393x852
- 기존 plant/care/harvest/order/storage/research/clue seed smoke loop 유지

## 검증

- `npm run check:phaser`: PASS
- `npm run check:ci`: PASS
- `clueBeforeRecord.researchClueRecordReady`: `true`
- `researchClueAlbumRecorded`: `true`
- `researchClueRecordReady`: `false` after record
- `git diff --check`: PASS

## 안전 범위

- 신규 asset 생성 없음
- runtime image generation/API/cache 호출 없음
- dedicated album/record animation 없음
- legacy app/save/external systems 변경 없음
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first item 작성
- [x] GitHub issue 생성
- [x] state/action/telemetry 추가
- [x] visual report 작성
- [x] Phaser smoke verifier 갱신
- [x] full CI 통과

## 남은 위험

- Browser Use execution tool이 이번 세션에 노출되지 않아 Playwright fallback evidence를 사용했습니다.
- 이번 PR은 Phaser state에 기록만 남기며, 별도 도감 탭/screen representation은 후속 작업입니다.
- dedicated record animation/FX는 별도 asset/FX WorkUnit 후보입니다.

## 연결된 issue

Closes #476
