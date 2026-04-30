## 요약

두 번째 생명체 발견 상태를 정원 production roster로 노출했습니다. 기존 simulation의 `discoveredCreatureIds` 기반 합산 생산량을 화면에 연결해 `정원 동료 2명`, 두 생명체 이름, role별 분당 기여량, 합산 `분당 12.8 잎`이 보이게 했습니다.

## Small win

수집한 두 번째 생명체가 도감 보상으로 끝나지 않고 정원 생산 동료로 합류합니다.

## 사용자/운영자 가치

플레이어는 생명체 수집이 생산력 성장으로 이어진다는 production idle loop를 첫 화면에서 읽을 수 있습니다. 운영 관점에서는 #159/#142 이후 지침대로 작은 기능 개선이 아니라 vertical slice 기준으로 다음 작업을 선택했다는 증거를 남깁니다.

## Before / After 또는 Visual evidence

- Browser Use `iab`: `reports/visual/p0-creature-production-roster-browser-use-20260430.png`
- Visual report: `reports/visual/p0-creature-production-roster-v0-20260430.md`
- 새 visual artifact: `mobile-creature-production-roster-v0-393.png`

## Playable mode

- 로컬 작업 브랜치: `codex/0107-creature-production-roster-v0`
- 확인 URL: `http://127.0.0.1:5173/?qaResearchExpeditionReady=1`

## Game Studio route

- `game-studio:game-studio`
- `game-studio:web-game-foundations`
- `game-studio:game-ui-frontend`
- `game-studio:game-playtest`

## 검증

- [x] Browser Use `iab`로 roster 화면 확인
- [x] `npm run check:visual -- --grep "생산 roster"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`

## 안전 범위

- 신규 asset 생성 없음.
- 저장 schema 변경 없음.
- runtime image generation 없음.
- 결제/광고/외부 배포 없음.

## 남은 위험

- roster chip은 현재 최대 3개 표시로 제한했습니다. 더 많은 생명체가 production roster에 들어오는 단계에서는 scroll/summary 정책을 별도 slice로 다뤄야 합니다.

## 연결된 issue

Closes #194

## 작업 checklist

- [x] Plan-first item 작성
- [x] Game Studio route 기록
- [x] Browser Use 우선 QA evidence 기록
- [x] Visual regression 통과
- [x] `npm run check:ci` 통과
