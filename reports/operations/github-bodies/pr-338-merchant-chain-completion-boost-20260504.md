## 요약

#338은 `MERCHANT_SECOND_CHAPTER_ORDER` 납품 직후 단골 시퀀스 마침 reveal motion + 영구 +10% 자동 생산 boost를 정원에 남깁니다. 이전까지 두 번째 chapter 납품 후 silent fall-through만 있던 production card 전환에, idle 경쟁작의 contract-series-complete 패턴을 따르는 영구 production engine 보상 beat를 추가합니다.

## Small win

단골과의 정기 거래 chain이 누적된 단발 보상으로 끝나지 않고, 정원 자체의 자동 생산 속도가 한 번 더 빨라지는 손맛으로 마무리됩니다.

## 사용자/운영자 가치

- 사용자: 포장잎 상인 단골 chain이 정원 자체 성장으로 이어져, 거래 chain 마무리가 게임 메타에 영구적인 자국을 남깁니다.
- 운영자: #328 → #330 → #332 → #336 → #338 merchant chain을 production engine permanent boost beat로 닫아 P0.5 Idle Core + Creative Rescue의 long-term-meta hint 라인을 한 칸 더 채웁니다.

## Before / After 또는 Visual evidence

- Before: 두 번째 chapter 납품 직후 production card는 `merchant-second-delivered`만 보이고, fall-through로 떨어지면서 단골 chain의 누적 의미가 휘발했다.
- After: 두 번째 chapter 납품 직후 production card에 `.merchant-chain-complete-receipt`가 sparkle reveal로 등장(2.2초)하고, 이후 `.merchant-chain-complete-badge`가 영구 표시되어 "단골 시퀀스 마침 +10%" 카피가 한 화면에서 읽힌다. playfield order crate는 chain-complete variant(메달/리본)로 한 번 회전 reveal한 뒤 fallback crate로 전환된다. `save.merchantChainBoostActive = true`가 영구 기록되고 `getProductionRatePerSecond`가 `+0.10` multiplier를 더해 다음 production tick부터 leaf 수치가 새 속도로 차오른다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0338-20260504.md`.
- Screenshot: `reports/visual/issue-338-merchant-chain-completion-boost-393.png` (focused regression artifact 사본).

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "단골 시퀀스 마침|merchant-chain-complete|chain-completion-boost"`
- [x] `npm run check:visual`
- [x] `npm run check:ci`
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0338-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing merchant/order crate asset + DOM/CSS chip + 메달/리본 SVG-less variant + sparkle keyframe만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: `merchantChainBoostActive`는 default `false`로 `normalizeSave`에서 채우므로 기존 save가 깨지지 않는다.
- 기존 first/greenhouse/lunar/follow-up/second-chapter order 우선순위 보존: 영구 boost는 second-chapter 완료 시 1회 토글되며 priority chain은 변경 없음.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- +10% 영구 multiplier가 후속 greenhouse/lunar 경제 균형에 미치는 영향은 별도 economy balance WorkUnit에서 추적한다(현재 production/workbench/facility/irrigation boost와 동일한 단계 단위로 잡았다).

## 연결된 issue

Closes #338

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0171-merchant-chain-completion-boost.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + full visual + CI 통과
- [x] Routine GitHub publication은 body-file로 수행
