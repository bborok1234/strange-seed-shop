# Browser Use iab Runtime Diagnostic — 2026-04-28

Status: accepted fallback
Issue: #18
Item: `items/0030-browser-use-iab-recovery.md`
Scope-risk: narrow

## 목적

Phaser playfield Browser QA에서 Browser Use `iab` backend 직접 검증을 다시 시도하고, 복구되지 않으면 환경 차단 상태와 허용 가능한 CDP fallback 기준을 명확히 남긴다.

## Browser Use 우선 시도

1. `browser-use:browser` skill 전체를 읽고 `iab` backend bootstrap 절차를 확인했다.
2. tool discovery로 `node_repl js`, `mcp__node_repl__js`, `js`, `node_repl js JavaScript execution` 노출 여부를 확인했다.
3. 현재 세션에서 Browser Use skill이 요구하는 Node REPL `js` 실행 tool은 노출되지 않았다.
4. 사용 가능한 `functions.js_repl`로 절대 경로 bootstrap을 재시도했다.

시도한 bootstrap:

```js
const pluginRoot = "/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1";
const modulePath = `${pluginRoot}/scripts/browser-client.mjs`;
const { setupAtlasRuntime } = await import(modulePath);
const backend = "iab";
await setupAtlasRuntime({ globals: globalThis, backend });
```

결과:

```text
Static import "node:os" is not supported from js_repl local files. Use await import("node:os") instead.
```

판정: Browser Use plugin 파일은 존재하지만, 이 세션의 callable tool 표면에 Browser Use skill이 요구하는 Node REPL `js`가 없고, 대체 `functions.js_repl`은 plugin `browser-client.mjs`의 static Node import를 처리하지 못한다. 따라서 이번 작업에서 Browser Use 직접 검증은 환경 차단으로 기록한다.

## Accepted fallback evidence

Browser Use 직접 실행이 차단되었으므로 `docs/BROWSER_QA.md`의 fallback 기준에 따라 Chrome DevTools Protocol 캡처를 사용했다.

- Mobile 360x900: `reports/visual/browser-use-iab-fallback-phaser-mobile-20260428.png`
- Desktop 1280x900: `reports/visual/browser-use-iab-fallback-phaser-desktop-20260428.png`

확인된 화면 기준:

- Phaser 중앙 playfield가 렌더링된다.
- starter seed 선택 HUD가 유지된다.
- 하단 5개 tab이 유지된다.
- runtime image generation disabled 배지가 desktop HUD에 유지된다.

## 다음 복구 조건

Browser Use 직접 검증을 다시 시도하려면 다음 중 하나가 필요하다.

- Codex App 세션에 `mcp__node_repl__js` 또는 동등한 Node REPL `js` execution tool이 노출된다.
- Browser Use plugin이 현재 `functions.js_repl` 제한과 호환되도록 static `node:` import 없이 bootstrap 가능해진다.
- OMX/Browser Use runtime이 별도 공식 wrapper를 제공해 `scripts/browser-client.mjs`를 직접 import하지 않고 `iab` backend를 초기화할 수 있다.

그 전까지는 Browser Use skill을 먼저 읽고 위 차단 조건을 확인한 뒤, `reports/visual/`에 blocker report를 남기는 경우에만 CDP fallback을 허용한다.

## Verification

- Browser Use skill read: done
- Tool discovery: Node REPL `js` unavailable in current callable surface
- `functions.js_repl` bootstrap attempt: blocked by static `node:os` import
- CDP fallback capture: PASS
