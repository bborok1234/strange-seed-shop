# Design system foundation

Status: verified
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: moderate

## Intent

Milestone 3.5에서 Phase 0 UI를 기능 확장 없이 정리할 수 있도록 디자인 시스템 사용 규칙, UX 리뷰, 검증 증거 연결을 만든다. 이 작업은 첫 세션 루프와 기존 저장/콘텐츠/analytics 계약을 보존하면서 모바일 360px 및 데스크톱 1280px에서 하단 탭과 핵심 CTA가 화면 안에 유지되는지 검증 가능하게 만든다.

`game-studio:game-ui-frontend` 기준을 참고해 정원 화면을 일반 앱 대시보드가 아니라 플레이필드를 보호하는 모바일 게임 HUD로 다룬다.

## Acceptance Criteria

- `docs/DESIGN_SYSTEM.md`가 생성되고, 토큰 목록보다 사용 규칙이 먼저 나온다.
- `docs/UX_REVIEW_20260427.md`가 생성되고, 허용 변경 범위와 금지 변경 범위를 명시한다.
- 첫 세션 루프가 유지된다: 스타터 선택 -> 심기 -> 탭 성장 -> 수확 -> 도감 보상 -> 두 번째 밭 열기.
- 저장 데이터 구조, 콘텐츠 JSON schema, analytics event 이름이 변경되지 않는다.
- 하단 탭 5개가 유지된다: 정원, 씨앗, 도감, 원정, 상점.
- 360px viewport에서 하단 탭 5개와 각 탭 핵심 CTA가 화면 밖으로 밀리지 않는다.
- 360x800/360x900 viewport에서 모바일 정원 탭 핵심 루프가 세로 스크롤 없이 조작 가능하다.
- 스크롤은 씨앗, 도감, 상점 같은 보조 목록 탭 내부에서만 허용된다.
- 1280px viewport에서 하단 탭 5개와 각 탭 핵심 CTA가 화면 밖으로 밀리지 않는다.
- 성장 idle, 탭 반응, 수확 가능 상태, 보상 reveal에 제한적 motion 피드백이 정의된다.
- `prefers-reduced-motion` 기준이 문서 또는 CSS에 반영된다.
- mock 상점 CTA는 `shop_surface_clicked`만 기록한다.
- mock 상점 CTA는 결제, 외부 이동, 계정 생성/로그인 흐름을 실행하지 않는다.
- `docs/README.md`, `docs/ROADMAP.md`, `docs/BROWSER_QA.md` 또는 visual report에 새 증거 파일 링크가 추가된다.
- `npm run check:all`이 통과하거나, 실패 시 실패 원인과 후속 작업이 기록된다.

## Evidence

참고 증거:

- `docs/README.md`
- `docs/ROADMAP.md`
- `docs/PRD_PHASE0.md`
- `docs/ECONOMY_PHASE0.md`
- `docs/BROWSER_QA.md`
- `reports/visual/browser_use_qa_20260427.md`
- `reports/visual/bottom-tab-surfaces-20260427.png`
- `reports/visual/chrome-cdp-mobile-360-20260427.png`
- `reports/visual/chrome-cdp-desktop-1280-20260427.png`
- `items/0014-bottom-tab-surfaces.md`

완료 증거:

- `reports/visual/design-system-mobile-360-20260427.png`: 360x800 garden viewport에서 core loop UI가 한 화면에 들어오는지 확인.
- `reports/visual/design-system-desktop-1280-20260427.png`: 1280x900 desktop viewport에서 HUD/playfield/panel 배치 확인.
- `reports/visual/design-system-tabs-20260427.png`: 하단 5개 탭 전환과 상점 bottom sheet 확인.
- `reports/visual/design-system-shop-click-20260427.md`: 상점 CTA 클릭 후 URL 유지, 결제/외부 이동/계정 흐름 없음, raw `mock` 미노출, 이벤트 카운트 +1 확인.
- `reports/visual/browser_use_qa_20260427.md`: Browser Use `iab` backend 기반 첫 세션 루프와 디자인 시스템 QA 기록.

## Implemented Plan

1. `docs/DESIGN_SYSTEM.md`를 사용 규칙 우선 구조로 작성했다.
2. `docs/UX_REVIEW_20260427.md`에 현재 UX 상태, 불변 조건, 허용/금지 변경 범위, 계량 acceptance criteria를 기록했다.
3. `src/styles.css`와 표시-only `src/App.tsx`를 제한적으로 정리했다.
4. 모바일 정원 탭이 360x800/360x900에서 세로 스크롤 없이 핵심 루프를 담도록 플레이필드와 bottom HUD를 재배치했다.
5. 성장 idle, 탭 반응, 수확 가능 상태, 보상 reveal에만 제한적 motion을 적용하고 `prefers-reduced-motion`을 반영했다.
6. 저장 구조, 콘텐츠 schema, analytics event 이름은 변경하지 않았다.
7. Browser Use로 첫 세션 루프와 하단 5개 탭 전환을 검증했다.
8. 상점 mock CTA 클릭이 URL 이동/결제/계정 흐름 없이 이벤트 카운트만 1 증가시키는 것을 확인했다.
9. 360x800 및 1280x900 viewport 캡처를 저장했다.
10. `docs/ROADMAP.md`, `docs/BROWSER_QA.md`, visual report에 새 증거 파일을 연결했다.
11. `npm run check:all` 결과를 완료 전 최종 검증으로 기록한다.

## Apply Conditions

- 이 item은 proposed 상태여야 한다.
- 작업 전 `docs/README.md`, `docs/ROADMAP.md`, `docs/PRD_PHASE0.md`, `docs/ECONOMY_PHASE0.md`, `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`를 확인한다.
- 변경은 문서, visual evidence, 제한적 CSS/표시 마크업에 한정한다.
- 다음 파일/계약은 변경하지 않는다.
  - 저장 데이터 구조
  - 콘텐츠 JSON schema
  - analytics event 이름
  - mock 상점의 Phase 0 비결제 계약
- 변경 중 첫 세션 루프가 깨지면 즉시 중단하고 원인 기록 후 수정한다.
- 결제, 외부 이동, 계정, credential, 배포 작업은 범위 밖이다.

## Verification

- Browser Use: 첫 세션 루프 완료 확인
- Browser Use: 하단 탭 5개 전환 확인
- Browser Use 또는 analytics log 확인: 상점 CTA 클릭 후 `shop_surface_clicked`만 기록
- Browser Use 또는 CDP: 360x800/360x900 정원 탭에서 핵심 루프가 세로 스크롤 없이 조작 가능한지 확인
- 360px viewport 캡처 확인
- 1280px viewport 캡처 확인
- `npm run check:all`
- 문서 링크 확인: `docs/README.md`, `docs/ROADMAP.md`, `docs/BROWSER_QA.md` 또는 visual report 중 하나 이상이 새 증거를 참조
