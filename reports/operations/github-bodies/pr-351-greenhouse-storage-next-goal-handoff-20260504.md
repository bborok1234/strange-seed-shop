## 요약

#350은 첫 GREENHOUSE_ORDER 납품 dispatch receipt(1.8초)가 끝난 직후 production card에 영구 `.greenhouse-storage-next-goal` handoff card를 띄웁니다. card는 strong "다음 목표" + span "선반 정리 · 1 재료"(또는 "재료 부족" 안내) + arrow chip을 한 줄에 보여주고, storage upgrade가 완료되면 자동으로 사라집니다. handoff 활성 시 redundant `production-complete-row`를 hide해 393px production card overflow를 막습니다.

## Small win

온실 선반 첫 출하 직후 정원 자동 가속 보상이 "다음 목표(선반 정리)"로 자연스럽게 이어지는 손맛이 한 줄 handoff card로 마무리됩니다.

## 사용자/운영자 가치

- 사용자: chain handoff arc(#344 → #346 → #348)가 첫 출하 후에도 끊기지 않고 다음 production 단계(선반 정리)로 시각적으로 이어진다.
- 운영자: #336 → #338 → #344 → #346 → #348 chain handoff arc를 facility-greenhouse 진입의 네 번째 reveal moment로 닫아 P0.5 Idle Core + Creative Rescue의 production loop continuity를 한 칸 더 채운다.

## Before / After 또는 Visual evidence

- Before: GREENHOUSE_ORDER dispatch receipt가 끝나면 `getCurrentOrder` priority chain이 fall-through로 stale-completed GREENHOUSE_ORDER를 반환해 production card에는 "온실 선반 납품 완료" 정적 텍스트만 남고, "다음 목표"는 화면에서 사라진다.
- After: dispatch receipt 종료 직후 `.greenhouse-storage-next-goal` handoff card가 0.5s fade-in으로 등장한다. 카피는 "다음 목표 / 선반 정리 · 1 재료"(또는 "재료 부족" 안내) + arrow chip pulse. handoff active 시 redundant `production-complete-row`는 hide되어 393px overflow 없이 layout 예산 안에 맞춘다. storage 설립 직후 handoff card는 자동으로 사라진다.
- Browser Use: current-session iab discovery 실패 기록 `reports/visual/browser-use-blocker-0350-20260504.md`.
- Screenshot: focused regression artifact `mobile-greenhouse-facility-order-v0-393.png`(handoff card 포함).

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
- [x] Browser Use iab attempt or blocker: `reports/visual/browser-use-blocker-0350-20260504.md`

## 안전 범위

- 신규 accepted manifest asset 없음. existing facility/storage icon + DOM/CSS handoff card + arrow keyframe만 사용.
- runtime image generation/API 호출 없음.
- 결제, 고객 데이터, 외부 배포, 실채널 GTM 없음.
- save 호환: 신규 state 없음, save schema 변경 없음.
- 기존 first/greenhouse/lunar/follow-up/second-chapter 우선순위 보존: economy 변동 없음. 신규 변경은 시각적 handoff에 한정.

## 남은 위험

- Browser Use iab hands-on QA는 current session backend discovery 실패로 수행하지 못했다. blocker 해소 시 같은 flow를 재확인한다.
- handoff active 시 `production-complete-row` hide는 첫 GREENHOUSE_ORDER 한정으로만 적용된다(다른 chain 단계는 영향 없음). 후속 greenhouse 단계(GREENHOUSE_EXPANSION_ORDER 등)는 별도 WorkUnit으로 추적한다.

## 연결된 issue

Closes #350

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] Plan-first artifact: `items/0177-greenhouse-storage-next-goal-handoff.md`
- [x] Visual evidence 또는 current-session blocker 기록
- [x] Focused regression + CI/ops/mirror gates 통과
- [x] Routine GitHub publication은 body-file로 수행
