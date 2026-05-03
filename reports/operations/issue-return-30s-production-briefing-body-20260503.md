# 복귀 첫 30초에 보상 수령과 다음 생산 목표를 한 화면에서 실행하게 만든다

## 문제 / 배경

AI 네이티브 운영사의 다음 WorkUnit은 `이상한 씨앗상회` production 게임 품질을 직접 올려야 한다. 현재 정원 첫 화면과 달방울 누누 production stage는 좋아졌지만, idle 경쟁작(Egg, Inc./Idle Miner류)이 강한 “돌아오자마자 보상 수령 → 생산 상태 확인 → 다음 목표 실행” 30초 comeback loop는 아직 한 화면의 game-feel로 충분히 압축되지 않았다.

## 목표

복귀 후 첫 30초 화면에서 플레이어가 오프라인/보관 보상, 생산 엔진 상태, 다음 주문/강화 목표를 하나의 정원 장면에서 읽고 즉시 실행하게 만든다.

## Small win

- 이번 issue가 만들 가장 작은 승리: 모바일 정원 첫 화면에서 `복귀 보상 수령` CTA와 `다음 생산 목표`가 playfield/order crate/production card와 연결된 한 장면으로 보이고, 수령 후 reward motion 또는 HUD affordance가 남는다.

## Campaign source of truth

- Active campaign: `P0.5 Idle Core + Creative Rescue`
- Production gap: comeback idle game의 핵심인 “복귀 후 첫 30초 압축 payoff”가 아직 production game scene으로 충분히 읽히지 않는다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- Browser QA route: `browser-use:browser` 우선, 불가 시 current-session blocker + Playwright fallback screenshot

## Candidate comparison / Strategic Jump Check

1. 선택 후보 — 복귀 첫 30초 production briefing: player verb(수령), production/progression role(오프라인 보상→주문/강화), screen moment(복귀 직후 정원), reward motion/HUD affordance, playtest evidence를 모두 갖춘다.
2. 대안 — 새 주문 한 개 추가: production chain은 늘지만 첫 화면/복귀 감정 payoff가 약하고 단순 주문 추가 위험이 크다.
3. 큰 방향 점프 후보 — 전체 art direction 재생성: asset payoff는 크지만 현재는 runner가 queue-empty 후 즉시 게임 loop를 개선해야 하므로 scope가 너무 크고 gpt-image asset pipeline이 선행된다.

## 플레이어 가치 또는 운영사 가치

- 플레이어 가치: 돌아왔을 때 “뭘 받았고, 지금 무엇을 누르면 되는지”를 즉시 이해한다.
- 운영사 가치: live runner가 queue empty 후 실제 production game quality issue를 intake했다는 evidence가 남는다.

## 수용 기준

- [x] 복귀/오프라인 보상 상태가 정원 첫 화면에서 production engine 장면으로 읽힌다.
- [x] 보상 수령 CTA가 다음 주문/강화/생산 목표와 연결된다.
- [x] 수령 후 reward motion 또는 HUD affordance가 보인다.
- [x] 모바일 visual regression이 body scroll, bottom-tab overlap, visible overflow를 막는다.
- [x] Browser Use current-session QA evidence 또는 blocker + Playwright fallback screenshot/report가 남는다.
- [x] `npm run check:visual`과 `npm run check:ci`가 통과한다.

## Visual evidence 계획

- Before/after mobile screenshot under `reports/visual/`
- Browser Use `iab` current-session attempt evidence
- Playwright fallback only after Browser Use blocker if tool unavailable

## Playable mode 영향

- `npm run play:main` flow 유지. 런타임 이미지 생성/결제/외부 배포 없음.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 신규 accepted manifest asset이 필요하면 별도 asset provenance를 남긴다. 이 issue의 기본 방향은 기존 accepted asset + DOM/CSS reward motion/HUD affordance다.

## 검증 명령

- `npm run check:visual -- --grep "복귀|보상|production"`
- `npm run check:visual`
- `npm run check:ci`


## 검증 결과

- `npm run build` → passed
- `npx playwright test --config playwright.config.ts --grep "모바일 복귀 첫 30초|모바일 복귀 보상은 달빛|모바일 복귀 보상은 온실 선반|모바일 복귀 후 온실 선반"` → 4 passed
- `npm run check:visual` → 55 passed
- `npm run check:ci` → passed
- Browser Use current-session blocker/fix evidence: `reports/visual/browser-use-blocker-0292-20260503.md`
- Playwright fallback screenshot: `reports/visual/0292-mobile-comeback-production-briefing-393-20260503.png`
