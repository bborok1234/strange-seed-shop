# Sprite batch Browser Use QA fallback — 2026-04-27

## Browser Use 우선 시도

`browser-use:browser` 스킬을 먼저 읽고 `iab` backend + Node REPL bootstrap 경로를 확인했다. 이 세션에서 tool discovery 결과 `node_repl js` 실행 도구가 노출되지 않았고, 사용 가능한 실행 도구는 Codex `js_repl`뿐이었다. `js_repl`에서 Browser Use bootstrap을 1회 시도했지만 plugin-local module의 static `node:` import 제약으로 초기화가 실패했다. Browser Use plugin의 요구사항은 전용 Node REPL browser-client runtime이므로 직접 Browser Use 조작은 blocked로 기록한다.

## Accepted fallback

- fallback: local Vite server + project capture script / Chromium-CDP 계열 screenshot evidence
- 이유: 기존 프로젝트도 `reports/visual/phaser-browser-use-fallback-20260427.md`에서 Browser Use fallback을 허용했고, 이번 작업은 외부 navigation 없이 localhost static runtime 검증만 필요하다.
- 금지사항 준수: 실제 결제, login/account, ads SDK, external navigation, runtime image generation 없음.

## Required evidence

- `reports/visual/sprite-batch-mobile-360-20260427.png`
- `reports/visual/sprite-batch-desktop-1280-20260427.png`

## Visual acceptance

- Phaser playfield가 crash 없이 mount된다.
- `qaSpriteState=growing` 360x800 capture에서 starter growing plot과 `asset 26` manifest 상태가 확인된다.
- `qaSpriteState=ready` 1280x900 capture에서 ready plot과 desktop layout이 확인된다.
- ready/harvest/reward path는 static gate와 game-loop check로 보조 검증한다.
