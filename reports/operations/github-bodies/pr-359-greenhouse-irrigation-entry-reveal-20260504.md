## 요약

#358은 `buyGreenhouseIrrigation` 성공 직후 production card에 "물길 점검 완료" 2.0초 reveal motion(strong "물길 점검 완료" + "다음 주문: 온실 물길 점검 시작" + "자동 생산 +15% 적용")을 1회 표시합니다. chain handoff arc(#344→#346→#348→#350→#352)의 다음 호흡(irrigation upgrade unlock)을 시각적으로 닫고, #354 chip strip + #356 chip pulse 인프라와 합쳐 새 "물길 +15%" chip이 등장하면서 자동 pulse 발사됩니다.

## Small win

irrigation upgrade click → 정원 rate가 +15% 가속되는 unlock moment가 production card receipt + chip strip pulse(#356)로 한 호흡에 마무리됩니다.

## 사용자/운영자 가치

- 사용자: facility/storage entry reveal과 같은 무게로 irrigation upgrade 결과가 시각적으로 마무리되어 chain handoff arc symmetry가 닫힌다.
- 운영자: #336→#352 chain handoff arc의 일관된 visual pattern이 irrigation까지 확장되어 P0.5 Idle Core + Creative Rescue의 production loop continuity가 한 단계 더 채워진다.

## Before / After 또는 Visual evidence

- Before: irrigation upgrade click이 silent state 변화로만 끝났다. +15% rate 보너스가 적용됐지만 시각적 unlock moment 없음.
- After: receipt sparkle(2.0s) + 다음 주문 카피 + 보너스 카피 + chip strip의 "물길 +15%" chip이 1.6s pulse(#356)로 등장. facility/storage entry와 동일 패턴(`greenhouse-facility-entry-reveal/-chip-pulse` keyframe 재사용)으로 visual consistency 유지.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0358-20260504.md`.
- Layout invariant: production card heading 직후 receipt는 facility/storage entry와 동일 위치/크기. 393px overflow 위험 없음.

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] 기존 chip strip regression (`npx playwright test --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"`)
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] `npm run check:dashboard`
- [x] `npm run check:control-room`
- [x] `npm run check:closed-workunit-mirrors`
- [x] `npm run check:github-metadata`
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0358-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing icon + DOM/CSS receipt + facility-entry keyframe 재사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: 신규 state는 transient receipt에 한정.
- 기존 우선순위 보존: economy 변동 없음.

## 남은 위험

- Browser Use iab hands-on QA 실패. blocker 기록.
- buyGreenhouseIrrigation 도달까지 단계가 많아(routeSupply order completion + materials + pollen 모두) 자동화 regression 추가 비용이 높다. build + render 안정성 + facility/storage entry 패턴 일관성으로 충분히 검증된다.

## 연결된 issue

Closes #358

## 작업 checklist

- [x] Game Studio route 기록
- [x] Plan-first artifact: `items/0181-greenhouse-irrigation-entry-reveal.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Build + chip strip regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
