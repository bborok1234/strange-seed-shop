# 생명체 애착 문구 Browser QA 기록

Date: 2026-04-28
Status: fallback-pass
Issue: #34
Branch: `codex/creature-attachment-v0`

## Browser Use 우선 시도

- `browser-use:browser` 스킬을 먼저 읽고 `iab` backend 초기화를 시도했다.
- 현재 세션의 사용 가능한 JavaScript REPL(`js_repl`)은 Browser Use plugin의 `browser-client.mjs`가 포함한 static `node:` import를 로드하지 못했다.
- 실패 메시지 요약: JS REPL local-file import 제약으로 `browser-client.mjs` bootstrap 불가.
- 따라서 Browser Use 직접 조작 대신 기존 프로젝트 fallback인 Chrome DevTools Protocol 캡처를 사용했다.

## Fallback 검증

- Dev server: `npm run dev -- --host 127.0.0.1 --port 5174`
- Ownership/첫 5분 상태 캡처:
  - `reports/visual/creature-attachment-ownership-20260428.png`
  - URL: `http://127.0.0.1:5174/?qaOfflineMinutes=15&qaReset=1`
- Harvest reveal 검증 캡처:
  - `reports/visual/creature-attachment-reveal-20260428.png`
  - URL: `http://127.0.0.1:5174/?qaSpriteState=ready&qaReset=1`
  - CDP로 첫 밭 좌표를 클릭해 `새 생명체 소유` reveal을 열었다.
  - DOM text에서 `오늘도 잎을 같이 주우러 갈래요?`와 `새 생명체 소유`를 확인했다.

## 판정

- 첫 수확 reveal에 생명체 인사말이 표시된다.
- 첫 생명체 카드에 성격과 좋아하는 것이 표시된다.
- 이 작업은 정적 content/UI 표시만 변경하며 결제, 로그인/account, ads SDK, external navigation, runtime image generation을 건드리지 않는다.
