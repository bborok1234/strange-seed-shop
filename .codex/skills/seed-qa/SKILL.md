---
name: seed-qa
description: 이상한 씨앗상회 프로젝트 전용 실기 QA/visual QA 모드. 사용자가 `$seed-qa`, 화면 확인, 모바일 QA, visual regression, 스크린샷, Browser Use, Playwright, Computer Use 대체 검증을 요청할 때 사용한다.
---

# Seed QA

## Purpose

실제 브라우저 화면 기준으로 모바일 게임 UI/UX 회귀를 잡는다.

## Tool order

1. `browser-use:browser` 스킬이 세션에 listed 되어 있으면 먼저 사용한다.
2. Browser Use는 별도 `browser` namespace tool이 아니라 Node REPL `js`에서 plugin의 `scripts/browser-client.mjs`를 absolute import해 `iab` backend로 bootstrap하는 방식이다. `browser-use` tool namespace가 안 보인다는 이유만으로 unavailable이라고 판단하지 않는다.
3. 첫 Browser Use action 전에는 `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/skills/browser/SKILL.md` 전체를 한 번에 읽고, Node REPL `js`로 아래 bootstrap을 시도한다.
4. Node REPL `js` tool이 처음 보이지 않으면 fallback 전에 `tool_search`로 `node_repl js`, `mcp__node_repl__js`, `js`, `node_repl js JavaScript execution`을 순서대로 재확인한다.
5. Browser Use bootstrap 또는 iab action이 실제로 실패한 경우에만 현재 세션 blocker를 기록하고 Playwright CLI/CDP fallback을 사용한다.
6. Computer Use는 in-app browser/CLI fallback이 부적합할 때만 사용한다.

필수 bootstrap:

```js
if (!globalThis.agent) {
  const { setupAtlasRuntime } = await import("/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs");
  const backend = "iab";
  await setupAtlasRuntime({ globals: globalThis, backend });
}
await agent.browser.nameSession("🔎 seed QA");
if (typeof tab === "undefined") {
  globalThis.tab = await agent.browser.tabs.new();
}
```

## Required evidence

- 모바일 393/375/360 중 관련 viewport
- 데스크톱 1280x900 또는 명시된 game frame
- `reports/visual/` screenshot 또는 markdown report
- UI 변경이면 `npm run check:visual`
- 게임 화면 QA는 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction, screenshot review findings를 남긴다.
- 사용자 screenshot이 제보된 경우 같은 URL, viewport, action sequence를 먼저 재현하고 before/after screenshot을 모두 남긴다.
- 모바일 카드/패널 QA는 visible text만 확인하지 않는다. body scroll, 하단 탭 overlap, visible child의 `scrollHeight > clientHeight`, `overflow: hidden`에 의한 내부 잘림을 layout invariant로 확인한다.

## Guardrails

- 스크린샷 없이 “괜찮아 보임”이라고 보고하지 않는다.
- Browser Use가 세션에 listed 되어 있는데 Node REPL bootstrap을 시도하지 않고 “도구가 없다”고 보고하지 않는다.
- DOM assertion만으로 “production-ready”라고 보고하지 않는다.
- DOM에 문구가 존재해도 화면에서 카드 내부가 잘리면 실패다.
- 모바일 정원은 body scroll 없이 playfield와 하단 탭을 보존해야 한다.
- non-garden 모바일 탭은 half overlay가 아니라 full tab screen이어야 한다.
