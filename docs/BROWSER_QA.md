# 브라우저 QA 절차

## 원칙

이 프로젝트의 로컬 브라우저 검증은 Codex Browser Use 플러그인을 1순위로 사용한다.

기본 경로:

1. `browser-use:browser` 스킬을 읽고 따른다.
2. Node REPL에서 Browser Use 런타임을 `iab` backend로 초기화한다.
3. 로컬 앱을 `http://127.0.0.1:3000/`에서 연다.
4. DOM snapshot, 클릭, 스크린샷을 통해 실제 사용자 화면 기준으로 확인한다.
5. 중요한 증거는 `reports/visual/`에 저장하고 로드맵 또는 수용 기준 문서에 연결한다.

## 폴백 기준

Browser Use를 시도하기 전에 별도 Playwright 설치, Computer Use, macOS `screencapture`를 기본 선택지로 쓰지 않는다.

폴백은 아래 중 하나가 명확할 때만 허용한다.

- Browser Use 플러그인 또는 `scripts/browser-client.mjs`가 없다.
- Node REPL `js` 실행 도구가 노출되지 않는다.
- Browser Use 런타임이 로컬 앱에 접근하지 못하며, 에러가 재시도 후에도 재현된다.
- CI처럼 Codex in-app browser가 없는 환경에서 자동 검증이 필요하다.

## 현재 검증 증거

- 2026-04-27: Browser Use `iab` backend로 `http://127.0.0.1:3000/` 접속 확인.
- 2026-04-27: 모바일 폭 스크린샷 저장: `reports/visual/browser-use-mobile-20260427.png`
- 2026-04-27: 페이지 제목 `이상한 씨앗상회` 확인.
- 2026-04-27: 스타터 씨앗 선택, 밭 탭 성장, 첫 수확, 도감 보상, 두 번째 밭 업그레이드, 원정 시작 클릭 플로우 확인.
- 2026-04-27: 클릭 플로우 후속 스크린샷 저장: `reports/visual/browser-use-click-flow-20260427.png`

## 남은 QA

- 오프라인 복귀 모달을 브라우저에서 확인한다.
- 넓은 데스크톱 폭에서 레이아웃을 한 번 더 확인한다.
