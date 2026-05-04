## 요약

#344는 `MERCHANT_SECOND_CHAPTER_ORDER` 납품 후 chain-complete sparkle motion(2.2초)이 끝난 직후 production card에 "다음 목표: 달빛 온실 설립" handoff card를 영구 표시합니다. 이전까지 chain-complete reveal이 끝나면 `getCurrentOrder` priority chain의 fall-through로 stale order(SECOND_ORDER)가 화면에 잡히고 다음 progression 목표가 시각적으로 사라졌던 production loop gap을 닫습니다.

## Small win

단골 시퀀스 마침의 영구 +10% boost가 화면에서 다음 production 단계(달빛 온실 설립)로 손을 잡아 끌어주는 한 줄 카드로 마무리됩니다.

## 사용자/운영자 가치

- 사용자: 단골 시퀀스 마침 직후 다음 progression 목표(달빛 온실 설립)가 같은 화면에 보여, chain-complete의 영구 boost가 다음 단계로 이어집니다.
- 운영자: #328 → #330 → #332 → #336 → #338 merchant chain의 끝을 facility-greenhouse 진입 phase로 시각적으로 묶어 P0.5 Idle Core + Creative Rescue의 long-term-meta hint 라인을 한 칸 더 채웁니다.

## Before / After 또는 Visual evidence

- Before: chain-complete sparkle motion이 끝나면 production card는 `.merchant-chain-complete-badge`만 남고, fall-through로 stale `SECOND_ORDER`가 잡혀 "다음에 무엇" 목표가 화면에서 사라졌다.
- After: chain-complete sparkle motion(2.2초)이 끝난 직후 `.merchant-chain-next-goal` handoff card가 0.5초 fade-in으로 등장한다. card는 strong "다음 목표" + span "달빛 온실 설립" + small 비용(`잎 80 · 재료 1` 또는 `작업대 완성 후 시작`) + arrow chip을 보여준다. playfield order crate는 chain-complete sparkle 종료 후 `merchant-chain-handoff` variant로 전환되어 다음 단계 표식(arrow + 초록 톤)을 영구 표시한다. facility level이 1이 되면 handoff card와 playfield variant가 자동으로 사라진다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0344-20260504.md`.
- Screenshot: focused regression artifact `mobile-merchant-chain-completion-boost-393.png`(handoff card 포함).

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "단골 시퀀스 마침"`
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] `npm run check:dashboard`
- [x] `npm run check:control-room`
- [x] `npm run check:closed-workunit-mirrors`
- [x] `npm run check:github-metadata`
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0344-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing facility icon + DOM/CSS handoff card + arrow keyframe + playfield variant만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: 기존 save에 `merchantChainBoostActive`/`greenhouseFacilityLevel`은 이미 normalize되어 있어 추가 migration 불필요.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: 영구 boost(+10%) economy 변동 없음. 신규 변경은 시각적 handoff에 한정.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- handoff card 카피("다음 목표 / 달빛 온실 설립")가 facility build prerequisites를 정확히 anchor하는지는 player feedback에서 검증한다. 카피는 별도 economy/UX WorkUnit에서 추적할 수 있다.
- chain-complete reveal motion과 handoff fade-in의 시퀀스 충돌은 `merchantChainCompleteReceipt`가 null로 돌아간 직후로 condition gate를 분리해 막았으나, 다른 receipt motion과의 동시 발생 케이스는 후속 regression에서 보강한다.

## 연결된 issue

Closes #344

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0174-merchant-chain-next-goal-handoff.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
