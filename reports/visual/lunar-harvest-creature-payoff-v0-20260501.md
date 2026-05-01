# Lunar harvest creature payoff v0 visual QA

Date: 2026-05-01
Mode: Browser Use `iab` + Playwright visual gate
Branch: `codex/0132-lunar-harvest-creature-payoff-v0`
Item: `items/0132-lunar-harvest-creature-payoff-v0.md`

## Scope

`달방울 씨앗` 수확이 단순 도감 reveal로 끝나지 않고, `달방울 누누`가 production actor/work-state로 합류하는지 확인했다. 신규 gpt-image-2 생성은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 모두 없어 차단되었고, v0는 이미 승인된 Codex native raster FX strip을 harvest binding으로 재사용한다.

## Browser Use evidence

QA URL: `http://127.0.0.1:5173/?qaLunarSeedReadyToHarvest=1&qaFxTelemetry=1`

| State | Evidence | Result |
| --- | --- | --- |
| Ready harvest | `reports/visual/lunar-harvest-payoff-before-browser-use-20260501.png` | `달방울 씨앗 수확`이 garden playfield의 2번 밭에 보이고, 생산 HUD/하단 탭이 겹치지 않는다. |
| Harvest reveal | `reports/visual/lunar-harvest-payoff-reveal-browser-use-20260501.png` | `첫 생명체 획득` modal이 `달방울 누누`를 named creature로 보여주고, 달빛 수집 완료 문구가 보인다. |
| Production state | `reports/visual/lunar-harvest-payoff-production-browser-use-20260501.png` | 도감 기록 후 production card와 playfield production actor가 lunar portrait로 바뀌고, roster에 `달방울 누누`가 포함된다. |

## Checks

- Browser Use locator check: `달방울 씨앗 수확` button count `1`.
- Browser Use reveal check: `첫 생명체 획득` visible, snapshot contains `달방울 누누`.
- Browser Use production check: `.production-asset-lunar-work img` visible.
- Browser Use production check: `.playfield-production-actor.is-lunar-actor img` visible.
- Browser Use roster check: `.production-roster` contains `달방울 누누`.
- Visual regression: `npm run check:visual -- --grep "달빛 씨앗"` passed.
- Asset gates passed before this report: `check:asset-provenance`, `check:asset-style`, `check:asset-alpha`, `check:content`.

## Risk

Dedicated 6-frame harvest moonburst generation remains blocked until image API key/model access is available. The current change is intentionally a narrow accepted-raster reuse binding with provenance, not a local vector or runtime-generated substitute.
