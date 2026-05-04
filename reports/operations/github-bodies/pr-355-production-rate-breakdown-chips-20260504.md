## 요약

#354는 production card heading 영역에 component multiplier breakdown chip strip을 추가합니다. 활성 multiplier별로 label + +N% chip을 한 줄에 보여주고(`간식 +25% · 작업대 +15% · 시설 +10% · 물길 +15% · 단골 +10%` 등), `breakdown.length > 0 && !productionStatus.orderCompleted` 조건에서만 등장해 chain handoff arc CSS와 충돌하지 않습니다. 이전까지 `merchantChain`만 별도 badge로 노출되고 나머지 4개 source는 화면에서 숨겨져 있던 production engine readability gap을 닫습니다.

## Small win

플레이어가 "왜 분당 X.X 잎인가?"를 한 화면에서 즉시 읽을 수 있고, chain handoff arc(#344→#352)의 누적 보상이 production card에 visible하게 누적됩니다.

## 사용자/운영자 가치

- 사용자: production rate component multiplier(간식/작업대/시설/물길/단골)가 한 화면에 visible해 누적 보상이 인지된다.
- 운영자: chain handoff arc 누적 효과가 production card에서 시각적으로 보여 P0.5 Idle Core + Creative Rescue의 production engine readability axis를 한 칸 채운다.

## Before / After 또는 Visual evidence

- Before: production card는 `분당 X.X 잎` 한 줄만 보여주고 단골 chain 외 4개 multiplier source는 upgrades 카드 description으로 흩어져 있었다. 플레이어는 누적 보상이 어디서 오는지 한 화면에서 알기 어려웠다.
- After: production-card-heading 직후에 `.production-rate-breakdown` row 등장. 활성 multiplier별 `.production-rate-chip`을 한 줄(필요 시 wrap)에 보여준다. `간식 +25% · 작업대 +15% · 시설 +10%` 등 player progression 자연 순서로 정렬. orderCompleted state에서는 chip strip을 hide해 chain handoff arc CSS와 충돌하지 않는다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0354-20260504.md`.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(chip strip 포함).

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"`
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] `npm run check:dashboard`
- [x] `npm run check:control-room`
- [x] `npm run check:closed-workunit-mirrors`
- [x] `npm run check:github-metadata`
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0354-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing chip styling + DOM/CSS만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: 신규 state 없음, save schema 변경 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: economy 변동 없음. 신규 변경은 readability에 한정.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다.
- chip strip이 orderCompleted state에서는 hide되므로, chain handoff arc 단계의 receipt motion 동안에는 안 보인다(설계상 의도). 후속 economy/UX WorkUnit에서 receipt와의 시각 통합을 더 다듬을 수 있다.

## 연결된 issue

Closes #354

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0179-production-rate-breakdown-chips.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
