# 경제 시뮬레이션 보고서: 2026-04-27

## 범위

Phase 0의 1h/D1/D3/D7 대략 진행 곡선을 확인하기 위한 초기 시뮬레이터를 추가했다.

명령:

```bash
npm run simulate:economy
```

## 목적

정밀 밸런싱이 아니라 다음 리스크를 빠르게 확인한다.

- 첫 업그레이드가 가능한가
- D1 안에 2-3개 plot 진행이 가능한가
- D7 전에 Phase 0 콘텐츠가 대부분 소진되는가
- 조정 가능한 tuning lever가 코드/데이터로 노출되어 있는가

## 알려진 제한

- 실제 플레이어 행동 모델은 아직 단순 가정이다.
- 광고/결제/시즌 보상은 포함하지 않는다.
- 서버 검증 경제는 Phase 1 범위다.

## 2026-04-27 실행 결과

```json
{
  "projection": [
    { "horizon": "1h", "projectedLeaves": 1679, "expectedPlots": 5 },
    { "horizon": "D1", "projectedLeaves": 35897, "expectedPlots": 5 },
    { "horizon": "D3", "projectedLeaves": 105562, "expectedPlots": 5 },
    { "horizon": "D7", "projectedLeaves": 244891, "expectedPlots": 5 }
  ]
}
```
