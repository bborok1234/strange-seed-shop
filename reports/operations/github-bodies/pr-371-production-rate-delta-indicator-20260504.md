## 요약

#370은 production card rate가 upgrade 활성으로 증가할 때 inline `.production-rate-delta` chip을 1.6초 표시합니다. previousRatePerMinuteRef + useEffect로 rate 변화를 감지하고, 0.05 이상 증가 시 delta 값을 setRateDeltaIndicator로 보냄. CSS keyframe `production-rate-delta-pulse`로 fade-in/scale/fade-out. #354 chip strip + #356 chip pulse와 페어링되어 SOURCE(어느 source)와 MAGNITUDE(얼마)를 함께 표현.

## Small win

upgrade click 직후 chip strip pulse + rate delta indicator로 player가 "이 upgrade가 분당 +X.X 잎을 더했다"는 magnitude 정보를 한 호흡에 인지한다.

## 사용자/운영자 가치

- 사용자: rate 변화의 magnitude가 시각화되어 누적 보상 perception이 강해진다.
- 운영자: production engine readability axis(#354/#356)에 magnitude layer 추가, P0.5 production loop의 visual completeness가 한 단계 더 채워진다.

## Before / After

- Before: rate 숫자가 silent하게 새 값으로 갱신.
- After: 0.05 이상 증가 시 inline `+X.X` chip이 1.6s pulse로 등장.

## 검증

- [x] `npm run build`
- [x] 기존 chip strip regression(`작업대 강화는 첫 온실 설비 목표로 이어진다`) 통과
- [x] mirror gates 통과
- [x] Browser Use iab attempt or blocker

## 안전 범위

- 신규 manifest asset 없음.
- save 호환: 신규 state는 transient runtime state.

## 남은 위험

- 1.6s indicator 토글은 timing-fragile하므로 자동화 어설션은 추가하지 않았다.

## 연결된 issue

Closes #370
