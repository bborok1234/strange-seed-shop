# Expedition reward loop

Status: verified

## 목적

원정 시작 이후 보상 수령까지 Phase 0 루프를 닫고, 긴 대기 없이 Browser Use로 검증할 수 있게 한다.

## 범위

- `src/App.tsx`
- `scripts/check-game-loop.mjs`
- `scripts/check-browser-qa.mjs`
- `docs/BROWSER_QA.md`
- `reports/visual/browser_use_qa_20260427.md`

## 완료 조건

- `quick_scout` 원정 보상이 0보다 큰 잎 보상인지 검증한다.
- 개발 전용 `qaExpeditionReady=1` 파라미터로 완료 가능한 원정 저장 상태를 만들 수 있다.
- 원정 보상 수령 후 잎이 증가하고 active expedition이 사라진다.
- Browser Use로 보상 버튼 활성화와 수령 후 화면을 확인한다.

## 검증

- `npm run check:loop`
- `npm run check:browser-qa`
- `npm run check:all`
- Browser Use `iab` backend로 `qaExpeditionReady=1` 접속 후 원정 보상 수령 확인

## 비고

`qaExpeditionReady=1`은 dev + localhost/127.0.0.1에서만 동작한다.
