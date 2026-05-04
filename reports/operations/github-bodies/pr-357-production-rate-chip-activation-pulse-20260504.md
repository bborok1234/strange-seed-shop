## 요약

#356은 production rate breakdown chip strip(#354)의 신규 활성 source에 1.6s pulse motion을 추가합니다. `previousRateBreakdownKeysRef`로 이전 render의 key set을 추적하고, useEffect로 신규 key가 등장하면 `recentlyActivatedBoosts` set에 추가해 `.is-pulsing` className을 1.6s 토글합니다. CSS keyframe `production-rate-chip-pulse`(scale 1 → 1.06 → 1, box-shadow glow burst, background brighten)이 unlock moment를 시각적으로 강조합니다.

## Small win

upgrade click(작업대/시설/물길) 또는 chain-complete fires 직후 player가 "이번 +N%가 어디서 왔는지"를 chip pulse로 한 호흡에 인지합니다.

## 사용자/운영자 가치

- 사용자: upgrade click moment가 motion으로 강조되어 chain handoff arc(#344→#352)와 production engine readability(#354) 누적 효과의 unlock moment를 시각적으로 인지한다.
- 운영자: chain handoff arc + readability axis 위에 unlock moment motion layer가 추가되어 P0.5 Idle Core + Creative Rescue의 production engine readability axis가 한 칸 더 채워진다.

## Before / After 또는 Visual evidence

- Before: chip strip(#354)에 신규 source가 정적으로 등장만 한다. unlock moment가 비어 있다.
- After: 신규 source 활성화 첫 render 직후 해당 chip이 1.6s `.is-pulsing` 동안 scale 1.06 + glow + brighten으로 pulse motion 적용. 1.6s 후 정적 chip로 안착. initial mount 시 이미 활성인 source는 pulse하지 않는다(previousRateBreakdownKeysRef가 즉시 채워져 false positive 방지).
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0356-20260504.md`.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(chip strip 포함).

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"`(chip strip render 회귀 보장)
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] `npm run check:dashboard`
- [x] `npm run check:control-room`
- [x] `npm run check:closed-workunit-mirrors`
- [x] `npm run check:github-metadata`
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0356-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing chip styling + DOM/CSS keyframe만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: 신규 state는 transient runtime state(set/timeout). save schema 변경 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: economy 변동 없음. 신규 변경은 motion에 한정.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다.
- 1.6s pulse className 토글은 timing-fragile(클릭 직후 ms 단위)이라 자동화 어설션에 적합하지 않다. 기존 chip strip render regression이 build/render 안정성을 보장하고, motion은 visual inspection으로 검증한다.
- React.StrictMode에서 effect가 두 번 실행될 수 있다. previousRateBreakdownKeysRef는 idempotent하므로 영향 없음.

## 연결된 issue

Closes #356

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0180-production-rate-chip-activation-pulse.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression(chip strip render) + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
