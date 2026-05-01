# P0.5 Studio Campaign Audit — 2026-05-01

Status: local-verified
Issue: #260
Item: `items/0130-p05-studio-campaign-audit.md`
Campaign source of truth: `P0.5 Idle Core + Creative Rescue`

## Summary

P0.5는 기능 사슬 자체는 길게 연결됐다. 심기 -> 성장 가속 -> 수확/발견 -> 자동 생산 -> 주문/시설/연구/원정 -> 온실 단서 -> 달방울 씨앗 심기까지 이어진다.

하지만 production idle vertical slice로 닫기에는 아직 화면 언어가 `말랑잎 포리`와 leaf crate 중심에 치우쳐 있다. 다음 implementation tranche는 `달방울 씨앗 수확 -> 달방울 누누 탄생 -> 누누가 정원 actor로 일함`을 static raster asset/FX와 Browser Use playtest로 증명한다.

Selected next tranche: `items/0132-lunar-harvest-creature-payoff-v0.md`

## Browser Use Evidence

이번 세션에서 Browser Use `iab`를 직접 사용했다. 과거 blocker report를 재사용하지 않았다.

- Bootstrap: Node REPL `js` discovery 후 `/Users/mirlim/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs` absolute import, `setupAtlasRuntime({ backend: "iab" })`.
- Dev server: `http://127.0.0.1:5173/`
- Captures:
  - `reports/visual/p05-campaign-audit-greenhouse-lunar-plant-browser-use-20260501.png`
  - `reports/visual/p05-campaign-audit-lunar-ready-harvest-browser-use-20260501.png`
  - `reports/visual/p05-campaign-audit-lunar-harvest-reveal-browser-use-20260501.png`

Observed:

- `qaGreenhouseLunarSeedPlantReady=1`: 온실 단서 payoff와 `응축기 가동 / 달빛 온실 단서 +1`는 읽힌다. 그러나 playfield는 세 밭 모두 `빈 자리`로 보이고, 다음 생명체 준비 상태에서 실제 심기/성장 affordance가 약하다.
- `qaLunarSeedReadyToHarvest=1`: 달방울 씨앗 ready harvest는 밭에서 읽힌다.
- Harvest click: `달방울 누누` reveal은 귀엽고 도감 progress는 3/9로 오른다. 생산 roster에도 3번째 동료로 합류한다. 다만 다음 성장 선택은 작업대/기존 주문 중심이라 누누가 무엇을 새로 여는지 약하다.

## Department Signoff

| 부서 | Audit result | Evidence |
| --- | --- | --- |
| 기획팀 | Player verbs는 심기, 톡톡 성장, 수확, 생산 수령, 납품, 업그레이드, 연구, 원정까지 있다. Missing verb는 `새 생명체가 일하는 것을 본다`와 `수확 직후 다음 장기 메타를 선택한다`다. | `src/App.tsx`, `src/game/playfield/GardenScene.ts`, Browser Use captures |
| 리서치팀 | Egg, Inc. 기준 생산 주체와 보상 anticipation은 보이나 worker variation이 약하다. Idle Miner 기준 station/manager 선택성은 아직 선형 checklist다. Cell to Singularity 기준 장기 unlock silhouette는 보이나 lunar harvest 이후 tech-tree/expedition anticipation이 약하다. | `docs/NORTH_STAR.md`, `docs/IDLE_CORE_CREATIVE_GUIDE.md`, `items/0130-p05-studio-campaign-audit.md` |
| 아트팀 | Manifest accepted raster asset은 충분히 늘었지만 lunar creature runtime states가 portrait 한 장에 머문다. `creature_lunar_common_001`은 album card only이고 idle/work/ready/harvest FX가 없다. | `public/assets/manifest/assetManifest.json`, `assets/source/gpt_image_asset_provenance.json` |
| 개발팀 | Save/economy boundary는 다음 tranche에서 좁게 유지 가능하다. 수확/roster/view model 경로와 manifest asset binding만 건드리면 된다. | `src/App.tsx`, `src/game/playfield/types.ts`, `src/game/playfield/GardenPlayfieldHost.tsx` |
| 검수팀 | 최근 P0.5는 Browser Use evidence가 많지만 첫 5분 전체 rubric은 균일하지 않다. 다음 tranche는 first actionable screen, main verbs, HUD readability, playfield obstruction, overflow를 고정 섹션으로 남겨야 한다. | `reports/visual/*.md`, `tests/visual/p0-mobile-game-shell.spec.ts` |
| 마케팅팀 | Mock-only promise는 `온실 단서에서 태어난 달방울 누누가 밤사이 보상을 지켜준다`로 잡을 수 있다. 실채널 게시, 광고, 결제는 하지 않는다. | `docs/PRD_PHASE0.md`, `docs/DESIGN_SYSTEM.md` |
| 고객지원팀 | 혼란 위험은 `다음 생명체를 준비하세요` 상태에서 밭이 전부 빈 자리로 보이는 순간과, 누누 수확 후 다음 행동이 작업대/주문으로 분산되는 순간이다. | Browser Use captures |

## Competition-Inspired Production Gaps

1. **Worker variation gap**: Egg, Inc.나 Idle Miner는 생산 주체가 늘어나는 장면이 즉시 보인다. 현재는 roster 숫자는 늘지만 production card/playfield 시각 언어가 `creature_herb_common_001_work`에 과하게 의존한다.
2. **Choice gap**: Idle Miner식 station/manager investment처럼 “무엇을 키울지”가 화면에서 선택으로 읽혀야 한다. 현재 주문/시설은 `getCurrentOrder()`의 단일 선형 chain이 중심이다.
3. **Discovery payoff gap**: Cell to Singularity는 새 발견이 다음 tech-tree silhouette로 이어진다. 현재 달방울 누누 reveal 뒤에는 도감/생산 roster가 갱신되지만, lunar guardian role과 다음 원정/복귀 hook이 한 화면에서 강하게 이어지지 않는다.
4. **Comeback scene gap**: 오프라인 보상은 숫자 modal과 bonus copy로 존재하지만, 보관함/guardian actor/재료/꽃가루 split payoff가 아직 장면으로 충분히 보이지 않는다.
5. **Asset bundle gap**: Gastory식 bundle 기준에서 lunar source icon/planting FX는 생겼지만, lunar harvest/creature work-state는 style state, prompt/model sidecar, animation camera/composition lock, frame extraction, manifest QA가 아직 없다.

## Asset/FX Audit

Current strengths:

- `runtime_generation_allowed=false`
- accepted manifest raster assets are PNG files.
- `seed_lunar_001_greenhouse_source_icon` and `fx_lunar_greenhouse_planting_pulse_001` replaced the rejected SVG/vector attempt.
- Current gates are designed to keep accepted manifest game assets out of SVG/vector/code-native drawing paths.

Open gaps:

- `creature_lunar_common_001` has only `intended_use: album_card`.
- `ui_order_crate_leaf_001` is reused for many order/facility states.
- `fx_production_tick_leaf_001` and `fx_order_delivery_burst_001` have animation bindings in manifest, but runtime type/lookup still relies on direct ids in `src/App.tsx`.
- `assets/source/gpt_image_asset_provenance.json` records the gpt-image-2 organization verification blocker for `seed_lunar_001_greenhouse_source_icon`; the accepted fallback is visible in `asset_generation_status.json` and manifest but should be made more explicit in the next asset batch sidecar.

Next asset/FX bundle language:

- Default: OpenAI Images API `gpt-image-2` with `OPENAI_API_KEY` and `SEED_ASSET_IMAGE_MODEL`.
- If organization verification, quota, credit, rate, or model access blocks generation: Codex native image generation fallback.
- Accepted files must be raster PNG workspace files only.
- SVG/vector/code-native drawings remain rejected for accepted manifest game graphics.
- Sidecar must include style state, prompt/model sidecar, reference image consistency, animation camera/composition lock, frame/GIF/spritesheet extraction, manifest QA, and small-size visual review.

## Candidate Tranches

| Candidate | Player verb | Production/progression role | Screen moment | Asset/FX need | Decision |
| --- | --- | --- | --- | --- | --- |
| Creature work-state roster v0 | 동료가 일하는 걸 보고 생산 수령 | 생산 엔진 가시성, 소유 생명체 역할 | 첫/두 번째 생명체 수확 후 production card/playfield | multi-creature work/celebrate/small icon, roster tick FX | Fold into lunar-first proof. Full roster deferred. |
| Order board choice v0 | 다음 의뢰를 선택하고 납품 | 주문/납품 선택성 | 첫 주문 완료 직후 | order crate variants, selection FX | Deferred. Requires stronger actor surface first. |
| Duplicate + merge reveal v0 | 같은 아이를 다시 만나 별 올리기 | 수집 반복/잎 sink | 반복 수확 reveal | duplicate stamp, star-up burst | Deferred. Depends on collection variance decision. |
| Comeback production scene v0 | 돌아와서 보관함 열고 바로 다음 행동 | 오프라인 복귀 hook | 15분 복귀 modal + 정원 crate | storage chest, guardian work state, split reward FX | Deferred but high priority after lunar actor payoff. |
| Lunar harvest creature payoff v0 | 달방울 씨앗을 수확하고 누누가 일하는 것을 본다 | 연구/원정/희귀 수집 bridge + 생산 actor fantasy | lunar ready harvest, reveal, production roster/playfield | lunar ready/harvest FX, `creature_lunar_common_001_work`, guardian reward motion | Selected. |

## Role-Debate Note

아트팀은 `lunar harvest + creature birth payoff`를 우선했고, 개발팀/루프 감사는 `Creature work-state roster v0`를 우선했다. 최종 선택은 `Lunar harvest creature payoff v0`다.

Reason:

- 최신 P0.5 path가 이미 `온실 단서 -> 달방울 씨앗 심기`까지 왔다.
- 달방울 수확은 실제 첫 5분 후반/복귀 후 30초에서 보이는 named creature payoff다.
- full roster batch는 범위가 커지고 asset 수가 늘어난다. 먼저 `달방울 누누` 한 명을 work-state actor로 증명하면 이후 roster 확장 기준이 생긴다.

Rejected:

- `Order board choice v0`: 생산 actor surface가 약한 상태에서 주문 선택을 추가하면 카드형 checklist가 늘어날 위험이 있다.
- `Full creature work-state roster v0`: 올바른 방향이지만 asset/FX batch가 커져 #260의 다음 small win으로는 범위가 넓다.

## Selected Next Tranche

Plan artifact: `items/0132-lunar-harvest-creature-payoff-v0.md`

Required axes:

- `player verb`: 달방울 씨앗을 수확하고, 달방울 누누가 정원에서 일하는 것을 본다.
- `production/progression role`: 연구/원정으로 얻은 lunar seed source가 named creature ownership과 production roster로 이어진다.
- `screen moment`: `qaLunarSeedReadyToHarvest=1` 수확 전/후, harvest reveal, 정원 production card/playfield.
- `asset/FX`: `creature_lunar_common_001_work`, lunar harvest moonburst FX strip, optional reward drop FX strip, manifest `animation.binding`.
- `playtest evidence`: Browser Use `iab` mobile 393px + desktop, first actionable screen/main verbs/HUD/playfield obstruction/overflow checks, `npm run check:visual`, asset gates.

## Verification Runbook

For this audit:

- `npm run check:seed-ops-queue`
- `npm run check:ops-live`
- `npm run check:ci`

For the selected implementation tranche:

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:content`
- `npm run check:loop`
- `npm run check:visual -- --grep "달방울"`
- Browser Use `iab` evidence under `reports/visual/`

## Remaining Risks

- GitHub issue/PR metadata still needs to be updated through `--body-file` when remote publication begins.
- gpt-image-2 may remain blocked by organization verification; if so, Codex native fallback is acceptable but must leave explicit provenance.
- First 5 minutes still needs a standardized playtest rubric pass after the lunar payoff implementation, not just deterministic QA states.
