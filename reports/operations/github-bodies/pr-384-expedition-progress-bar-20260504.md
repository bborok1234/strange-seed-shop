## 요약

#384는 원정 진행 중 expedition tab에 시각적 progress bar를 추가합니다. duration 대비 elapsed 비율을 fill width로 시각화하고, ambient leaf-trail keyframe으로 "정원 생명체가 원정에서 일하고 있다"는 미세 motion을 표시합니다. 90% 이상 진행 시 fill 색조가 lunar/golden gradient로 전환되어 "곧 도착" cue를 줍니다.

## Small win

원정이라는 idle wait moment에도 즉시 시각 feedback이 발생한다. 플레이어는 "얼마나 가까이 왔지?"를 텍스트로 추론하지 않고 bar 길이로 한눈에 인지한다.

## Before / After

- Before: `"원정 진행 중"` + `"5분 남음 · 돌아오면 보상 수령"` 텍스트만.
- After: 같은 텍스트 위에 progress bar (0~100%), 작은 leaf-trail glyph가 좌→우로 흐르는 ambient motion, >=90%에서 색조 전환 + readout 색 변화.

## 변경

- `expedition-progress-bar` JSX (App.tsx) — `<div role="progressbar">`로 fill width / aria-valuenow / readout 표기.
- styles.css에 `.expedition-progress-bar`, `.expedition-progress-fill`, `.expedition-progress-trail`, `.expedition-progress-readout`, `expedition-leaf-trail` keyframe 추가.
- `near-complete` modifier로 90%+ 색조 전환.

## 검증

- [x] `npm run build`
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- 신규 manifest asset 없음.
- save 호환: 변경 없음 (계산은 기존 `expeditionRemainingSeconds` + `activeExpeditionDefinition.durationSeconds` 활용).
- duration 0 가드: `totalSeconds > 0` 분기로 NaN 회피.

## 연결된 issue

Closes #384
