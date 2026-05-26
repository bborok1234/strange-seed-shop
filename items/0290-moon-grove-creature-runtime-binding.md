# 월정 숲 creature/actor runtime binding

## 상태

- Status: review
- Game Studio route: `game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`
- GitHub issue: #548
- PR: #549 draft
- Branch: `codex/0290-moon-grove-creature-runtime-binding`
- 연결: Issue #546, PR #547, Issue #548, PR #549, main CI `26428876014`

## 배경

#546/#547은 `creature_moon_grove_001`, `actor_moon_grove_miru_idle_strip_v1`, `actor_moon_grove_miru_work_strip_v1`, `fx_moon_grove_discovery_bloom_strip_v1`를 generated workspace 후보와 review evidence로 만들었다. 그러나 아직 `public/assets/manifest/assetManifest.json` accepted entry와 Phaser preload/render/telemetry가 없어 `월정 숲 새벽이끼` harvest reveal은 source badge와 기존 `fx_moon_grove_source_reward_strip_v1`에 머문다.

이번 slice는 generated 후보를 runtime에 연결해 `월정 숲 수확` 순간 전용 portrait, discovery bloom FX, playfield idle/work actor가 화면에 남도록 만든다.

## Creative brief

- Player verb: `월정 숲 수확` -> `새벽이끼 미루 발견/배치`
- Production/progression role: rare source harvest가 이름 있는 creature ownership과 playfield actor participation으로 닫힌다.
- Screen moment: harvest reveal, action rail discovery surface, overview mode, playfield actor idle/work.
- Asset/FX decision:
  - `creature_moon_grove_001`: accepted portrait, reveal/overview card
  - `actor_moon_grove_miru_idle_strip_v1`: accepted 8x96x96 idle loop, `moon_grove.discovery.actor.idle`
  - `actor_moon_grove_miru_work_strip_v1`: accepted 8x96x96 work loop, `moon_grove.discovery.actor.work`
  - `fx_moon_grove_discovery_bloom_strip_v1`: accepted 8x96x96 reveal FX, `moon_grove.discovery.action.reveal`
- Competition gap: rare discovery가 텍스트/seed icon으로 끝나면 collection desire가 약하다. 생성된 creature silhouette와 actor motion이 실제 화면에 남아야 한다.
- Rejected alternative: #547 asset을 manifest만 등록하고 화면은 유지. 이유: accepted asset이 runtime moment와 연결되지 않으면 production payoff가 발생하지 않는다.

## Plan

1. GitHub issue를 게시하고 issue 번호를 WorkUnit/roadmap/heartbeat에 반영한다.
2. `assetManifest.json`에 4개 accepted entry를 추가하고 animation metadata를 고정한다.
3. `TOPOLOGY_ASSETS`에 moon grove creature, idle/work actor, discovery bloom FX를 추가한다.
4. Phaser preload/animation 생성에 새 actor/FX를 포함한다.
5. `moonGroveSourceHarvest` pending FX를 `moonGroveDiscovery`로 분리하고 `lastFxKey`/`lastFxKind` telemetry를 전용 FX로 바꾼다.
6. `renderMoonGroveDiscoveryReveal`을 추가해 harvest 후 portrait+bloom+idle/work actor가 playfield에 남도록 한다.
7. HUD/action rail과 window telemetry에 creature/actor/FX asset keys를 노출한다.
8. `scripts/check-phaser-foundation.mjs`에 topology/harvested/overview assertions와 screenshot evidence를 추가한다.
9. Browser Use 우선 QA를 시도하고, tool blocker가 있으면 기록한 뒤 Playwright screenshot evidence를 사용한다.
10. local gates, PR checks, merge, main CI를 확인한다.

## 수용 기준

- manifest가 4개 moon grove creature/actor/FX asset을 accepted로 등록한다.
- `TOPOLOGY_ASSET_KEYS`에 4개 key가 포함된다.
- `월정 숲 수확` 후 `lastFxKey=fx_moon_grove_discovery_bloom_strip_v1`, `lastFxKind=moonGroveDiscovery`가 된다.
- harvest/overview telemetry가 `creature_moon_grove_001`, idle/work actor keys, discovery bloom FX key를 노출한다.
- action rail에 `월정 숲 발견`과 전용 creature/actor surface가 표시된다.
- Visual evidence가 `reports/visual/issue-0548-moon-grove-creature-runtime-binding/` 아래 남는다.
- `npm run check:phaser`, `npm run check:asset-provenance`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check`가 통과한다.

## Department Scorecard

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | rare harvest가 named creature ownership과 actor participation으로 이어진다. |
| 리서치팀 | approve | 경쟁작식 rare unlock은 새 silhouette/motion이 남아야 하는 production gap을 닫는다. |
| 아트팀 | approve | #547 generated asset 후보를 accepted manifest와 runtime moment에 연결한다. |
| 개발팀 | approve | manifest/Phaser/checker만 변경하고 새 image generation은 하지 않는다. |
| 검수팀 | approve | check-phaser-foundation과 Browser Use/playtest screenshot evidence가 acceptance verifier다. |
| 마케팅팀 | approve | mock-only 내부 gameplay binding이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | 플레이어가 source와 creature의 차이를 화면에서 이해할 수 있다. |

## Role Debate

필수 debate는 발생하지 않았다. 모든 부서가 approve다. 검수팀은 DOM telemetry만으로 통과하지 않고 screenshot evidence를 남기라고 요구했다.

## Self-evaluation loop

- Claim: 월정 숲 새벽이끼 generated assets are bound to accepted manifest and Phaser harvest reveal.
- Smallest verifier: `npm run check:phaser`
- Rubric: manifest accepted entries, topology keys, lastFx binding, HUD surface, overview telemetry, screenshot evidence.
- Artifact path: `public/assets/manifest/assetManifest.json`, `apps/seed-garden-phaser/src/main.ts`, `scripts/check-phaser-foundation.mjs`, `reports/visual/issue-0548-moon-grove-creature-runtime-binding/`
- Iteration log: checker or visual failure occurs, patch runtime/checker and rerun.
- Stop condition: PR checks, merge, main CI green or written blocker report.

## Subagent/Team Routing

- Solo execute. Runtime and checker edits share the same Phaser telemetry contract, so splitting write scope would add coordination risk.

## 검증 명령

- `npm run build:phaser` - pass
- `npm run check:phaser` - pass
- `npm run check:asset-provenance` - pass
- `npm run check:asset-normalization` - pass
- `npm run check:asset-alpha` - pass
- `npm run check:asset-style` - pass
- `npm run check:ops-live` - pass
- `npm run check:ci` - pass after heartbeat/control-room refresh
- `git diff --check` - pass

## Implementation evidence

- Manifest accepted entries:
  - `creature_moon_grove_001`
  - `actor_moon_grove_miru_idle_strip_v1`
  - `actor_moon_grove_miru_work_strip_v1`
  - `fx_moon_grove_discovery_bloom_strip_v1`
- Runtime binding:
  - `TOPOLOGY_ASSET_KEYS` includes all 4 keys.
  - `moonGroveDiscovery` pending FX uses `fx_moon_grove_discovery_bloom_strip_v1`.
  - `actor_moon_grove_miru` joins after `seed_moon_grove_001` harvest.
  - `renderMoonGroveDiscoveryReveal` leaves portrait, idle actor, work actor, and bloom FX in playfield/overview.
- Telemetry:
  - `__seedGardenMoonGroveCreatureAssetKey=creature_moon_grove_001`
  - `__seedGardenMoonGroveIdleActorKey=actor_moon_grove_miru_idle_strip_v1`
  - `__seedGardenMoonGroveWorkActorKey=actor_moon_grove_miru_work_strip_v1`
  - `__seedGardenMoonGroveDiscoveryFxKey=fx_moon_grove_discovery_bloom_strip_v1`
  - `__seedGardenLastFxKey=fx_moon_grove_discovery_bloom_strip_v1`
  - `__seedGardenLastFxKind=moonGroveDiscovery`
- Visual evidence:
  - `reports/visual/issue-0548-moon-grove-creature-runtime-binding/phaser-check-moon-grove-harvested-393.png`
  - `reports/visual/issue-0548-moon-grove-creature-runtime-binding/phaser-check-moon-fence-source-overview-393.png`
  - Browser Use blocker: `reports/visual/issue-0548-moon-grove-creature-runtime-binding/browser-use-blocker-20260526.md`

## 리스크

- 화면 밀도 리스크는 overview screenshot에서 확인했다. 작은 label cluster는 남지만 body scroll과 bottom-tab overlap은 없다.
- Browser Use는 현재 tool surface 미노출 blocker를 기록하고 Playwright screenshot evidence로 fallback했다.
