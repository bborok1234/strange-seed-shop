# 온실 물길 강화 완료 증거 고정

## 요약

#225 병합 뒤 main CI가 `docs/DASHBOARD.md` stale 상태로 실패한 운영 증거 gap을 #226에서 복구합니다. 기능 코드는 바꾸지 않고, roadmap/dashboard/item/issue evidence를 main 기준으로 맞춥니다.

## Small win

온실 물길 강화 vertical slice의 기능 완료와 운영 closeout 상태가 같은 source of truth에 남습니다.

## 사용자/운영자 가치

플레이어-facing 동작은 #225에서 이미 반영되었습니다. 운영 측면에서는 병합 후 main CI 실패를 놓치지 않고 closeout PR로 복구해, 장시간 운영 루프의 완료 조건을 지킵니다.

## Before / After 또는 Visual evidence

- Before: #225는 병합됐지만 main CI run `25203668266`이 stale dashboard 때문에 실패했습니다.
- After: `docs/DASHBOARD.md`와 완료 문서가 최신 상태가 되고, dashboard/docs checks가 통과합니다.
- Browser Use evidence: `reports/visual/p0-greenhouse-irrigation-upgrade-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-irrigation-upgrade-v0-20260430.md`

## Playable mode

- 기능 QA 경로: `/?qaOfflineMinutes=60&qaLunarGuardian=1&qaGreenhouseShelf=1&qaGreenhouseStorage=1&qaGreenhouseRoute=1&qaGreenhouseRouteSupply=1&qaReset=1`
- 이번 closeout은 playable 동작을 바꾸지 않습니다.

## 검증

- `npm run update:dashboard`: PASS
- `npm run check:dashboard`: PASS
- `npm run check:docs`: PASS

## 안전 범위

- 기능 코드 변경 없음.
- 신규 asset 생성 없음.
- runtime image generation 없음.
- 실제 결제, 광고, 외부 배포, credential, 고객 데이터 없음.

## 작업 checklist

- [x] #225 병합 확인
- [x] #225 main CI 실패 원인 확인
- [x] dashboard 갱신
- [x] dashboard/docs local check
- [ ] closeout PR checks
- [ ] closeout merge 뒤 main CI 확인

## 남은 위험

- closeout PR checks와 merge 뒤 main CI를 아직 확인해야 합니다.

## 연결된 issue

Refs #224
