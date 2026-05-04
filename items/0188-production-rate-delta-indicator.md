# WorkUnit #370 — production card rate에 upgrade 활성 시 "+분당 X.X 잎" delta inline indicator를 1.6s 표시한다

## GitHub authority

- GitHub issue: #370 https://github.com/bborok1234/strange-seed-shop/issues/370
- Branch: `codex/0188-production-rate-delta-indicator`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Status: plan-first

## 문제 / 배경

#354 chip strip + #356 chip pulse는 어느 source가 활성화되었는지 보여주지만, 실제 rate 숫자(`분당 X.X 잎`)는 silent하게 새 값으로 바뀐다. player perception 관점에서 "이번 upgrade로 분당 +1.5 잎이 늘었다"는 magnitude 정보가 한 호흡에 안 잡힌다.

## 목표

`productionStatus.ratePerMinute`가 증가하는 첫 render 직후 1.6s 동안 inline `.production-rate-delta`를 rate 옆에 표시한다. 카피: `+분당 X.X 잎`. 1.6s 후 자동 unmount.

## Plan

1. `previousRatePerMinuteRef = useRef<number>(0)` + `rateDeltaIndicator = useState<number | null>(null)` 추가.
2. useEffect로 `productionStatus.ratePerMinute`을 watch — 이전 값보다 증가 시 delta 계산 후 setRateDeltaIndicator(delta), 1.6s timeout으로 clear. 첫 mount는 ref 초기화 후 skip.
3. production-card-rate span에 `<span className="production-rate-delta">+{delta} 잎/분</span>` 인접 렌더(rateDeltaIndicator > 0 일 때).
4. CSS: `.production-rate-delta` chip pulse + fade-out keyframe.
5. focused build + 기존 regression 통과.

## 수용 기준

- [ ] rate 증가 직후 1.6s indicator 표시.
- [ ] 1.6s 후 자동 unmount.
- [ ] 첫 mount 시 false positive 없음(ref 초기화).
- [ ] rate 감소나 미변동 시 표시 안됨.

## 검증 명령

- `npm run build`
- 기존 regression 통과.
- `npm run check:ci` 외 mirror gates.

## Subagent/Team Routing

- 기본은 solo execution.
