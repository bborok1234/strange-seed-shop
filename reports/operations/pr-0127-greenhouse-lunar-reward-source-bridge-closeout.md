## 요약

PR #252 merge와 main CI `25213197863` 성공 뒤 Issue #251의 roadmap/item/dashboard/control room/heartbeat를 main 기준 완료 상태로 닫습니다.

## Small win

- `Greenhouse lunar reward source bridge v0`가 `review/local CI`가 아니라 `done/main CI` evidence로 운영 표면에 남습니다.

## 사용자/운영자 가치

- 사용자 가치: 없음, UI 변경 없는 closeout입니다.
- 운영자 가치: 다음 `$seed-ops` 재개 시 Issue #251이 완료됐고 다음 후보가 달방울 씨앗 구매/심기 source playfield slice라는 사실을 바로 알 수 있습니다.

## Before / After 또는 Visual evidence

- Before: PR #252, `reports/visual/p0-greenhouse-lunar-reward-source-bridge-20260501.md`
- After: roadmap row `done`, item `Status: done`, control room closeout heartbeat
- UI 변경 없음.

## Playable mode

- 변경 없음.

## 검증

- [x] `npm run check:ci`
- [x] main CI `25213197863`

## 작업 checklist

- [x] Issue #251 item status done
- [x] Roadmap row done + main CI evidence
- [x] Control room current mission 갱신
- [x] Heartbeat closeout 기록

## 안전 범위

- 코드/UI 변경 없음.
- 실제 결제, 광고, 로그인, 외부 배포, 고객 데이터 없음.

## 남은 위험

- 다음 issue는 아직 plan artifact가 필요합니다. closeout merge 후 stop rule이 없으면 `달방울 씨앗 구매/심기 source playfield vertical slice`를 plan-first로 시작합니다.

## 연결된 issue

Follow-up closeout for #251 / #252
