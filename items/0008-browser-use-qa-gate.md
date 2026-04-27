# Browser Use QA gate

Status: verified

## 목적

Browser Use 플러그인을 로컬 브라우저 QA의 기본 경로로 고정하고, 이 원칙이 문서에만 머물지 않도록 자동 검증에 연결한다.

## 범위

- `docs/BROWSER_QA.md`
- `reports/visual/browser_use_qa_20260427.md`
- `reports/visual/browser-use-main-20260427.png`
- `scripts/check-browser-qa.mjs`
- `package.json`

## 완료 조건

- Browser Use 우선 원칙과 폴백 조건이 문서에 명시된다.
- Browser Use main 재확인 스크린샷이 저장된다.
- `npm run check:browser-qa`가 시각 QA 증거와 핵심 문구를 검증한다.
- `npm run check:all`이 `check:browser-qa`를 포함한다.

## 검증

- Browser Use `iab` backend로 `http://127.0.0.1:3001/` 접속 확인
- `npm run check:browser-qa`
- `npm run check:all`

## 비고

정확한 viewport 크기 지정은 Browser Use가 아니라 Chrome DevTools Protocol 캡처를 보조로 사용한다. 단, 보조 경로는 Browser Use 우선 시도와 근거를 문서에 남긴 뒤에만 사용한다.
