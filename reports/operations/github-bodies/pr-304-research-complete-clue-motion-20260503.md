## 요약

#304 연구 완료 순간을 `도감 단서 기록` reward motion과 playfield/HUD 상태로 production화했습니다. `새싹 기록법 연구` 완료 직후 도감 단서가 다음 씨앗/생명체 목표로 연결된다는 사실을 393px 모바일 첫 화면에서 확인할 수 있습니다.

## Small win

연구 완료가 단순 `연구 완료` 텍스트에서 끝나지 않고 `도감 단서 기록`, `연구 노트 저장`, `단서 기록`, 다음 생명체 목표 카드 glow로 이어집니다.

## 사용자/운영자 가치

- 사용자: 두 번째 주문 → 연구 → 도감 단서 → 다음 씨앗 목표의 progression chain을 한 장면에서 이해합니다.
- 운영자: queue-empty 이후 선택한 작업이 P0.5 campaign source of truth에서 나온 production game quality WorkUnit임을 issue/plan/visual/CI evidence로 남깁니다.

## Before / After 또는 Visual evidence

- Before: #302로 연구 unlock은 보였지만, 연구 완료 직후 도감 단서가 기록되는 보상 motion이 약했습니다.
- After: 연구 완료 receipt와 playfield `연구 노트 저장`/`단서 기록` state, 다음 생명체 목표 CTA가 함께 보입니다.
- Browser Use: `reports/visual/browser-use-blocker-0304-20260503.md` — 현재 세션 iab backend 미발견 blocker.
- Screenshot: `reports/visual/issue-304-research-complete-clue-motion-393.png`.

## Playable mode

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror: `npm run play:main`, then `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`

## 검증

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "연구 unlock"` — 1 passed
- [x] `npm run check:visual` — 55 passed
- [x] `npm run check:ci` — pass

## 안전 범위

- Runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. DOM/CSS reward motion, playfield state, HUD affordance만 추가했습니다.
- real payment, customer data, external production deployment 없음.

## 남은 위험

- Browser Use iab는 현재 세션에서 backend discovery 실패로 blocked입니다. 다음 UI/visual WorkUnit에서 반드시 새로 재시도해야 합니다.
- 새 raster research-note asset이 필요하다고 판단되면 별도 asset provenance WorkUnit으로 분리해야 합니다.

## 연결된 issue

Closes #304

## 작업 checklist

- [x] Plan-first artifact 작성
- [x] Game Studio route 기록
- [x] Browser Use 우선 시도 또는 blocker 기록
- [x] Visual screenshot evidence 저장
- [x] Focused/full checks 실행
- [ ] GitHub PR checks 확인
- [ ] Merge 후 main CI 관찰
