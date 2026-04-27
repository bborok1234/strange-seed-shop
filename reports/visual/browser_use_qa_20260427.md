# Browser Use QA Report - 2026-04-27

## 범위

Phase 0 브라우저 앱이 Codex Browser Use 플러그인으로 접근 가능한지 확인했다.

## 결과

- 상태: 통과
- URL: `http://127.0.0.1:3000/`
- 브라우저 경로: Browser Use `iab` backend
- 확인한 제목: `이상한 씨앗상회`
- 저장된 스크린샷: `reports/visual/browser-use-mobile-20260427.png`
- 클릭 플로우 후속 스크린샷: `reports/visual/browser-use-click-flow-20260427.png`
- 오프라인 복귀 스크린샷: `reports/visual/browser-use-offline-reward-20260427.png`
- main 재확인 스크린샷: `reports/visual/browser-use-main-20260427.png`
- 미션 보상 루프 스크린샷: `reports/visual/mission-reward-loop-20260427.png`
- 씨앗 구매 루프 스크린샷: `reports/visual/seed-purchase-loop-20260427.png`
- 원정 보상 루프 스크린샷: `reports/visual/expedition-reward-loop-20260427.png`
- 360px 캡처: `reports/visual/chrome-cdp-mobile-360-20260427.png`
- 데스크톱 캡처: `reports/visual/chrome-cdp-desktop-1280-20260427.png`

## 관찰

- 모바일 폭에서 정원, 씨앗 목록, 하단 탭이 렌더링된다.
- 정원 슬롯과 하단 탭 텍스트는 화면 안에 들어온다.
- 상단 재화 영역은 표시되지만 매우 좁은 폭에서는 좌측 제목과 우측 재화 묶음의 여백을 계속 관찰해야 한다.
- 실제 클릭으로 스타터 씨앗 선택, 성장 탭, 첫 수확, 도감 보상, 두 번째 밭 업그레이드, 원정 시작까지 진행됐다.
- 원정 시작 후 DOM에 `원정 진행 중`과 비활성 `원정 보상 받기` 버튼이 표시됐다.
- 개발 전용 `qaOfflineMinutes=60` 파라미터로 오프라인 복귀 보상을 브라우저에서 재현했다.
- Browser Use DOM에서 `자리를 비운 동안 잎 50개를 모았습니다.`와 `잎 60`이 확인됐다.
- 360x900 viewport와 1280x900 viewport 캡처에서 주요 텍스트와 하단 탭이 화면 안에 들어온다.
- 2026-04-27 후속 점검에서 Browser Use `iab` backend로 main 앱을 다시 열어 제목과 씨앗 UI를 확인했다.
- 2026-04-27 후속 점검에서 `qaReset=1`로 시작해 첫 씨앗 심기 미션 보상 `+10 잎` 버튼이 활성화되고 수령 후 `완료`로 바뀌는 것을 확인했다.
- 2026-04-27 후속 점검에서 `qaOfflineMinutes=60`으로 시작해 씨앗 3회 구매 후 `씨앗 3개 구매` 보상 `+45 잎`이 활성화되고 수령 후 `완료`로 바뀌는 것을 확인했다.
- 2026-04-27 후속 점검에서 `qaExpeditionReady=1`로 시작해 `원정 보상 받기` 버튼이 활성화되고 수령 후 잎이 55로 증가하며 다시 `틈새길 정찰 시작` 상태로 돌아가는 것을 확인했다.
- Chrome DevTools Protocol은 viewport 고정 캡처에만 보조로 사용했다.

## 자동 검증

- `npm run check:browser-qa`는 Browser Use 우선 원칙, 폴백 조건, 핵심 스크린샷 파일 존재를 검사한다.
- `npm run check:all`은 `check:browser-qa`를 포함한다.

## 남은 검증

- Phase 0 기준의 브라우저/시각 QA는 통과했다.
- 다음 검증은 신규 UI 또는 새 루프 추가 시 갱신한다.
