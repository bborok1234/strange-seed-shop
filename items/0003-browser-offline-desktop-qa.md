# Browser Use 오프라인/데스크톱 QA

Status: verified
Owner: agent
Created: 2026-04-27
Updated: 2026-04-27
Scope-risk: narrow

## Intent

Phase 0에서 남아 있던 오프라인 복귀, 360px 모바일, 데스크톱 폭 브라우저 QA를 실제 화면 증거로 닫는다.

## Acceptance Criteria

- Browser Use로 오프라인 복귀 보상 문구와 재화 증가를 확인한다.
- 360x900 viewport 캡처에서 주요 텍스트와 하단 탭이 잘리지 않는다.
- 1280x900 viewport 캡처에서 정원과 검증 패널이 겹치지 않는다.
- QA 증거 파일과 보고서를 갱신한다.

## Evidence

- `reports/visual/browser-use-offline-reward-20260427.png`
- `reports/visual/chrome-cdp-mobile-360-20260427.png`
- `reports/visual/chrome-cdp-desktop-1280-20260427.png`
- `reports/visual/browser_use_qa_20260427.md`
- 2026-04-27: Browser Use DOM에서 `잎 60`과 오프라인 보상 문구 확인

## Proposed Plan

- 개발 전용 QA URL 파라미터로 오프라인 복귀 상태를 재현한다.
- Browser Use로 실제 앱 DOM과 모바일 화면을 확인한다.
- 정확한 viewport 캡처가 필요한 경우 CDP 캡처 스크립트를 사용한다.
- 겹침 또는 잘림이 발견되면 CSS를 수정하고 다시 캡처한다.

## Apply Conditions

- QA 파라미터는 local/dev 환경에서만 동작한다.
- 런타임 이미지 생성 의존성은 추가하지 않는다.
- 새 외부 패키지는 추가하지 않는다.

## Verification

- Browser Use DOM 확인
- `npm run capture:local -- http://127.0.0.1:3001/?qaOfflineMinutes=60 reports/visual/chrome-cdp-mobile-360-20260427.png 360 900`
- `npm run capture:local -- http://127.0.0.1:3001/?qaOfflineMinutes=60 reports/visual/chrome-cdp-desktop-1280-20260427.png 1280 900`
- `npm run check:all`
