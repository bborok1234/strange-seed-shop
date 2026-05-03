## 요약

#306 연구 완료 후 목표 씨앗 구매/심기를 `연구 단서 씨앗` reward motion과 playfield state로 production화했습니다. 연구 단서가 실제 씨앗 심기 행동으로 닫히고, 정원 화면에 `도감 목표 심기`/`연구 단서` 상태가 남습니다.

## Small win

연구 단서를 따라 목표 씨앗을 구매하고 심으면 정원 첫 화면에서 “이 씨앗은 연구 단서로 심은 목표”라는 상태와 다음 생명체 CTA가 함께 보입니다.

## 사용자/운영자 가치

- 사용자: 연구 → 씨앗 구매/심기 → 다음 생명체 수집 루프가 끊기지 않습니다.
- 운영자: queue-empty 이후에도 P0.5 campaign chain을 GitHub WorkUnit/PR/CI evidence로 전진시킵니다.

## Before / After 또는 Visual evidence

- Before: 연구 완료 후 목표 씨앗은 보였지만 구매/심기 결과가 연구 단서 payoff로 남지 않았습니다.
- After: `연구 단서 씨앗` receipt, playfield `도감 목표 심기`, plot `연구 단서`, next creature CTA가 함께 보입니다.
- Browser Use: `reports/visual/browser-use-blocker-0306-20260503.md` — 현재 세션 iab backend 미발견 blocker.
- Screenshot: `reports/visual/issue-306-research-clue-seed-planting-payoff-393.png`.

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror: `npm run play:main`, then `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗"` — 1 passed
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|달빛 씨앗은 구매와 심기"` — 2 passed
- [x] `npm run check:visual` — 56 passed
- [x] `npm run check:ci` — pass

## 안전 범위

- Runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. DOM/CSS reward motion, playfield state, HUD affordance만 추가했습니다.
- real payment, customer data, external production deployment 없음.

## 남은 위험

- Browser Use iab는 현재 세션에서 backend discovery 실패로 blocked입니다. 다음 UI/visual WorkUnit에서 반드시 새로 재시도해야 합니다.
- 향후 달빛 씨앗 같은 장기 목표에는 별도 source payoff 정책이 필요할 수 있어 이번 범위에서는 early research target seed로 제한했습니다.

## 연결된 issue

Closes #306

## 작업 checklist

- [x] Plan-first artifact 작성
- [x] Game Studio route 기록
- [x] Browser Use 우선 시도 또는 blocker 기록
- [x] Visual screenshot evidence 저장
- [x] Focused/full checks 실행
- [ ] GitHub PR checks 확인
- [ ] Merge 후 main CI 관찰
