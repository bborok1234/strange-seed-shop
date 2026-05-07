# 연구 단서 씨앗 심기 bridge

## 요약

research shelf `살펴보기` 이후 `달빛 씨앗 단서`가 실제 재배 행동으로 이어지도록 Phaser bridge를 추가했습니다.

- `researchClueSeedAvailable`, `researchClueSeedPlanted`, `researchClueHarvested` state/telemetry 추가
- research shelf `살펴보기` 후 `달빛 씨앗 단서 확보` objective/receipt와 clue seed availability 설정
- 빈 unlocked plot에서 `단서 심기` action 추가
- clue seed planting/harvest objective와 receipt 추가
- smoke verifier를 `살펴보기 -> 단서 심기 -> 돌보기 -> 수확`까지 확장

## Small win

`살펴보기`가 receipt에서 끝나지 않고, 플레이어가 바로 `단서 심기`를 눌러 다음 family clue를 수확하는 작은 discovery loop가 생겼습니다.

## 사용자/운영자 가치

플레이어는 storage reward 이후 research/discovery가 실제 재배 verb로 이어지는 것을 봅니다. 운영자는 다음 WorkUnit에서 도감 단서 저장, dedicated research shelf/FX integration, family clue content를 붙일 수 있는 runtime state를 확보했습니다.

## Before / After 또는 Visual evidence

- Before: research shelf `살펴보기` 후 다음 행동은 없고 receipt/objective만 남았습니다.
- After: 빈 밭에서 `단서 심기` action이 열리고, clue seed를 돌본 뒤 `달빛 family clue +1` receipt로 수확합니다.
- Clue action: `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-action-393.png`
- Clue planted: `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-planted-393.png`
- Clue harvested: `reports/visual/issue-0474-research-clue-seed-planting/phaser-check-research-clue-harvested-393.png`
- Visual report: `reports/visual/issue-0474-research-clue-seed-planting/visual-report-20260508.md`

## Playable mode

- Phaser app only: `npm run dev:phaser`
- 검증 viewport: 393x852
- 기존 plant/care/harvest/order/storage/overview/research smoke loop 유지

## 검증

- `npm run check:phaser`: PASS
- `npm run check:ci`: PASS
- `clueBeforePlant.researchClueSeedAvailable`: `true`
- `researchClueSeedPlanted`: `true`
- `researchClueHarvested`: `true`
- final leaves: `38`
- `git diff --check`: PASS

## 안전 범위

- 신규 asset 생성 없음
- runtime image generation/API/cache 호출 없음
- dedicated research shelf/FX asset은 #472 plan-prompt 계약만 존재하며 이번 PR에서 runtime에 연결하지 않음
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
- clue seed는 아직 dedicated seed/FX art가 아니라 existing plot lifecycle과 small HUD/playfield affordance로 표현됩니다.
- 다음 WorkUnit에서 도감 단서 저장 또는 generated research shelf/FX runtime integration이 필요합니다.

## 연결된 issue

Closes #474
