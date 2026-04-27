# Bottom tab surfaces

Status: verified

## 목적

하단 탭을 실제 화면 전환으로 연결해 Phase 0 UI가 반복 사용 가능한 게임 앱 구조를 갖게 한다.

## 범위

- `src/App.tsx`
- `src/styles.css`
- `docs/ROADMAP.md`
- `scripts/check-browser-qa.mjs`
- `reports/visual/browser_use_qa_20260427.md`

## 완료 조건

- 하단 탭 버튼이 현재 선택 상태를 표시한다.
- `정원`, `씨앗`, `도감`, `원정`, `상점` 탭이 각각 별도 패널 내용을 보여준다.
- 상점 탭은 `shop_surfaces.json`의 mock 상품 이미지와 CTA를 렌더링한다.
- mock 상점 CTA는 결제를 일으키지 않고 analytics event만 기록한다.
- Browser Use로 탭 전환과 상점 CTA 렌더링을 확인한다.

## 검증

- `npm run check:browser-qa`
- `npm run check:all`
- Browser Use `iab` backend로 하단 탭 전환 및 상점 mock CTA 확인

## 비고

상점은 Phase 0 mock surface다. 실제 결제, 계정, 외부 전송은 없다.
