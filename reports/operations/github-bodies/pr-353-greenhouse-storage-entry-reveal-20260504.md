## 요약

#352는 `buyGreenhouseStorage` 성공 직후 production card에 "선반 정리 완료" 2.0초 reveal motion(strong "선반 정리 완료" + "다음 주문: 온실 확장 준비 시작" + "보관 보너스 +10% 적용")을 1회 표시합니다. 이전까지 storage handoff(#350)가 가리켰던 "선반 정리" 목표가 player click 후 silent 변화로만 끝났던 transition gap을 시각적 reveal beat로 닫고, chain handoff arc(#344→#346→#348→#350)의 다섯 번째 beat를 마무리합니다.

## Small win

storage handoff(#350) → click → "선반 정리 완료" reveal beat → 다음 주문 등장이 한 호흡으로 마무리되어 facility-greenhouse 진입 phase의 다섯 번째 beat가 닫힙니다.

## 사용자/운영자 가치

- 사용자: storage handoff card → click → 선반 정리 완료 reveal → 다음 주문(온실 확장 준비)으로 production loop가 끊기지 않고 이어진다.
- 운영자: #336 → #338 → #344 → #346 → #348 → #350 chain handoff arc를 facility-greenhouse 진입의 다섯 번째 reveal moment로 닫아 P0.5 Idle Core + Creative Rescue의 production loop continuity를 한 칸 더 채운다.

## Before / After 또는 Visual evidence

- Before: storage handoff(#350)을 따라 선반 정리 click하면 `greenhouseStorageLevel`이 silent하게 1로 토글되고 다음 priority로 GREENHOUSE_EXPANSION_ORDER가 등장한다. 화면에서 "선반 정리"라는 결과가 시각적으로 표현되지 않는다.
- After: `buyGreenhouseStorage` 성공 직후 production card에 `.greenhouse-storage-entry-receipt`가 sparkle reveal로 등장(2.0s)하며 chip "선반 정리 완료" + strong "선반 정리 완료" + span "다음 주문: 온실 확장 준비 시작" + small "보관 보너스 +10% 적용" 카피가 한 화면에서 읽힌다. #350 storage handoff card는 storage level 토글로 자동 unmount된다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0352-20260504.md`.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(entry receipt 포함).

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror 계약 유지: `npm run play:main` 후 port 5174.

## 검증

- [x] `npm run build`
- [x] `npx playwright test --config playwright.config.ts --grep "온실 설비는 새 납품 주문으로 이어진다"`
- [x] `npm run check:ci`
- [x] `npm run check:ops-live`
- [x] `npm run check:dashboard`
- [x] `npm run check:control-room`
- [x] `npm run check:closed-workunit-mirrors`
- [x] `npm run check:github-metadata`
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0352-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing storage icon + DOM/CSS receipt + sparkle keyframe(facility-entry 재사용)만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: 신규 state는 transient receipt에 한정, save schema 변경 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: economy 변동 없음. 신규 변경은 시각적 reveal에 한정.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- 후속 greenhouse 단계(GREENHOUSE_EXPANSION_ORDER → buyGreenhouseRoute → ...)도 같은 silent 패턴이 남아 있다. 이번 PR은 storage 한 단계에 한정하고, 후속 단계는 별도 WorkUnit으로 추적한다.

## 연결된 issue

Closes #352

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0178-greenhouse-storage-entry-reveal.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
