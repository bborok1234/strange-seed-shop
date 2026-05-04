## 요약

#346은 `buyGreenhouseFacility` 성공 직후 production card에 "달빛 온실 입장" 2.0초 reveal motion(strong "달빛 온실 입장" + "다음 주문: 온실 선반 납품 시작" + "정원 자동 생산 +10% 적용")을 1회 표시합니다. 이전까지 chain handoff(#344)가 가리켰던 "달빛 온실 설립" 목표가 player click 후 silent 수치 변화로만 끝났던 transition gap을 시각적 reveal beat로 닫습니다.

## Small win

chain handoff(#344) → 작업대 강화 → 달빛 온실 설립까지 따라온 손맛이 "달빛 온실에 들어왔다"는 한 번의 시각적 beat로 보상받는다.

## 사용자/운영자 가치

- 사용자: chain handoff card → 작업대 강화 → 온실 설비 click → 달빛 온실 입장 reveal → 다음 주문(온실 선반 납품)으로 production loop가 끊기지 않고 이어진다.
- 운영자: #336 → #338 → #344 chain handoff loop를 facility-greenhouse 진입의 첫 reveal moment로 닫아 P0.5 Idle Core + Creative Rescue의 production loop continuity를 한 칸 더 채운다.

## Before / After 또는 Visual evidence

- Before: 작업대 강화 후 온실 설비 click하면 production rate가 silent하게 분당 13.9 → 15.3 잎으로 올라가고 다음 주문(GREENHOUSE_ORDER)이 backstage로 등장한다. 화면에서 "달빛 온실 설립"이라는 결과가 시각적으로 표현되지 않는다.
- After: `buyGreenhouseFacility` 성공 직후 production card에 `.greenhouse-facility-entry-receipt`가 sparkle reveal로 등장(2.0s)하며 strong "달빛 온실 입장" + span "다음 주문: 온실 선반 납품 시작" + small "정원 자동 생산 +10% 적용" 카피가 한 화면에서 읽힌다. playfield order crate가 `greenhouse-facility-entry` variant로 같은 2.0s 동안 표시된 뒤 GREENHOUSE_ORDER variant로 자연스럽게 전환된다. #344 handoff card는 facility level 토글로 자동 unmount된다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0346-20260504.md`.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-unlock-v0-393.png`(entry receipt 포함).

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
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0346-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing facility icon + DOM/CSS receipt + sparkle keyframe + playfield variant만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: 신규 state는 transient receipt에 한정, save schema 변경 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: 영구 boost(+10%) economy 변동 없음. 신규 변경은 시각적 reveal에 한정.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- entry receipt가 chain-complete sparkle 활성 중에 동시 발생하는 케이스는 일반 플레이 흐름에서 발생하지 않으나(서로 다른 행동의 결과), 후속 regression에서 시퀀스 충돌 보강을 추적한다.

## 연결된 issue

Closes #346

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0175-greenhouse-facility-entry-reveal.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
