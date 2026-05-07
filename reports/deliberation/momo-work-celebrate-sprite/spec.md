# Spec — 모모 work/celebrate sprite

- Axis slug: `momo-work-celebrate-sprite`
- Brief: `reports/deliberation/momo-work-celebrate-sprite/brief.md`
- Director: Codex studio-operate session
- Date: 2026-05-07
- Status: approved-for-workunit

## Vision

정원 화면에서 방패새싹 모모는 도감 초상이나 카드 장식이 아니라 포리 옆의 두 번째 작업자 actor로 보인다. 플레이어는 자동 생산을 지켜보다가 생산 잎을 수령하는 순간 모모가 짧게 반응하는 것을 보고, 수집한 생명체가 실제 정원 엔진에 들어왔다는 보상을 받는다. 이 화면은 숫자 HUD보다 "생명체가 일하고 반응한다"는 사실을 먼저 증명한다.

## Layout Skeleton

이번 축은 전체 레이아웃을 다시 열지 않는다. `docs/DESIGN.md`와 `docs/ART_HUD_PRODUCTION_SPEC.md`의 모바일 frame 중심 정책을 유지하고, support actor anchor와 motion contract만 바꾼다.

| Viewport | Grid | Regions |
|---|---|---|
| Mobile | 기존 단일 모바일 game frame 유지 | `hud-top`, `garden-playfield`, `workstage.actor.primary`, `workstage.actor.support`, `action-surface`, `bottom-tabs` |
| Tablet | 중앙 모바일 frame 유지 | 모바일과 동일, frame 외부 dashboard 없음 |
| Desktop | 중앙 모바일 frame 유지 | 모바일과 동일, desktop side rail 없음 |

## Design Tokens

새 색상 token은 만들지 않는다. 기존 production actor token을 재사용하되 motion/scale 의미를 spec에서 명명한다.

| Token | Type | Value | Used by |
|---|---|---|---|
| `scale.actor.support` | scale | existing support actor display band | 모모 support actor visual box |
| `motion.actor.supportWorkLoop` | motion | existing stepped sprite rhythm adapted to support slot | 모모 work strip |
| `motion.actor.supportCelebratePop` | motion | one-shot reward reaction rhythm | 모모 celebrate strip |
| `layer.actor.support` | layer | playfield actor layer | 모모 support actor anchor |
| `layer.transientFx.actor` | layer | actor-local reward layer | 모모 celebrate 주변 짧은 반응 |

## Component Composition

| Component | Status | Notes |
|---|---|---|
| `GardenPlayfieldHost` | modify | support worker를 정적 `<img>` 우선이 아니라 animation descriptor 우선으로 렌더링한다. |
| `GardenPlayfieldViewModel.productionScene.supportWorkers` | modify | `workAnimation`과 `celebrateAnimation`을 support worker별로 전달한다. |
| `ProductionScene` support actor slot | modify | `data-worker-role`, `data-worker-id`, `data-animation-asset`, `data-celebrate-animation-asset`를 노출한다. |
| `assetManifest` | extend | 모모 work/celebrate strip 2종을 accepted spritesheet asset으로 등록한다. |
| `production claim receipt` | constrained trigger | 이번 WorkUnit에서는 생산 수령 또는 QA production-ready 상태 중 하나에서 모모 celebrate를 실제 화면에 1회 관찰 가능하게 한다. |

## Acceptance Criteria

- [ ] `sprite_creature_herb_common_002_work_strip`는 raster PNG spritesheet로 생성되고 manifest에 `frames=6`, `frameWidth=96`, `frameHeight=96`, `frameRate=10`, `repeat=-1`, `binding.target=actor`, `binding.slot=work`, `creatureIds=["creature_herb_common_002"]`로 accepted 등록된다.
- [ ] `sprite_creature_herb_common_002_celebrate_strip`는 raster PNG spritesheet로 생성되고 manifest에 `frames=6`, `frameWidth=96`, `frameHeight=96`, `frameRate=12`, `repeat=0`, `binding.target=actor`, `binding.slot=celebrate`, `creatureIds=["creature_herb_common_002"]`로 accepted 등록된다.
- [ ] `qaResearchExpeditionReady=1`에서 모모 support actor는 `data-worker-id="creature_herb_common_002"`, `data-worker-role="support"`, `data-animation-asset="sprite_creature_herb_common_002_work_strip"`, `data-frame-count="6"`를 가진다.
- [ ] Browser Use `iab` 393x852 screenshot에서 모모는 포리와 별개의 support worker actor로 보이고, 원형 portrait mask나 정적 카드 이미지로 보이면 실패다.
- [ ] production claim 또는 QA trigger 후 Browser Use `iab`에서 모모 celebrate state가 1회 이상 실제 화면에 관찰된다. 내부 data hook만 있고 화면 반응이 없으면 실패다.
- [ ] 모모 actor와 plot label, resource HUD, production/action surface, bottom tabs가 서로 겹치지 않는다.
- [ ] `npm run check:asset-normalization`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-alpha`, `npm run build`가 통과한다.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| gpt-image-2 strip이 같은 baseline/scale을 유지하지 못함 | high | prompt에 horizontal strict strip, same anchor, same scale을 고정하고 생성 후 작은 크기 검수와 normalization check를 통과하지 못하면 재생성한다. |
| celebrate one-shot이 receipt 상태와 결합되어 flake가 생김 | medium | trigger는 production claim 또는 QA state 하나로 좁히고, 복잡한 주문/연구 전체 state machine은 후속으로 보낸다. |
| support actor가 playfield 위 텍스트나 plot label과 충돌함 | high | Browser Use screenshot과 bounding-box test를 둘 다 acceptance에 둔다. |
| asset만 추가되고 런타임이 여전히 정적 portrait를 보여줌 | high | support worker animation descriptor와 DOM data attribute test를 필수로 둔다. |

## Implementation Sequence

1. **WorkUnit 0228** — 모모 production sprite vertical slice. Files: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, `public/assets/game/sprites/production/*002*`, `public/assets/manifest/assetManifest.json`, `src/App.tsx`, `src/game/playfield/types.ts`, `src/game/playfield/GardenPlayfieldHost.tsx`, `src/styles.css`, visual tests, reports.
2. **Follow-up axis** — creature actor motion vocabulary. Trigger: 모모 slice가 Browser Use와 asset checks를 통과한 뒤, 3번째 생명체 이상으로 contract를 반복할 때.
3. **Follow-up axis** — order/research/expedition celebrate expansion. Trigger: production claim celebrate가 안정화된 뒤.

## Decisions Resolved

### Decision 1 — work loop only vs visible celebrate

- **Disagreement:** Engineer는 one-shot celebrate state machine이 과해질 수 있으므로 work loop와 data hook을 우선하자고 했다. Designer, Art Director, Senior Critic은 화면에서 실제 celebrate가 보이지 않으면 사용자 불만을 해결하지 못한다고 봤다.
- **Resolution:** 이번 WorkUnit은 work loop 실노출과 최소 1회 visible celebrate를 모두 포함한다.
- **Reasoning:** 이 axis의 목표는 내부 계약이 아니라 "캐릭터가 정원에서 살아 움직인다"는 화면 증거다.
- **Loser's concession:** celebrate trigger는 production claim 또는 QA state 하나로 제한하고, 주문/연구/원정 전체 확장은 후속으로 보낸다.

### Decision 2 — static portrait fallback vs accepted sprite requirement

- **Disagreement:** 런타임 continuity를 위해 정적 portrait fallback은 필요하지만, Art Director와 Senior Critic은 CSS bob/portrait pulse가 실패 조건이라고 지적했다.
- **Resolution:** fallback은 asset missing 방어용으로만 남기고 acceptance에는 accepted work/celebrate sprite strip과 manifest binding을 필수로 둔다.
- **Reasoning:** 정적 portrait를 흔드는 방식은 기존 "원형 캐릭터가 뒤에 있고 이상한 stripe만 움직임" 문제를 반복한다.
- **Loser's concession:** manifest가 깨졌을 때 화면 전체가 비는 것은 막기 위해 fallback branch는 유지한다.

### Decision 3 — support anchor scope

- **Disagreement:** Designer proposal은 plot 사이, 주문 crate 옆, production card actor strip 등 anchor 후보를 열어두었다. Art Director는 후보가 넓으면 또 임의 좌표가 된다고 봤다.
- **Resolution:** 이번 WorkUnit은 기존 support actor slot과 `plot-2-order-crate` anchor를 유지하되, 렌더링을 sprite actor로 바꾼다.
- **Reasoning:** layout redesign을 다시 열지 않고도 "모모가 두 번째 작업자"라는 screen moment를 검증할 수 있다.
- **Loser's concession:** 전체 workstage 재배치와 추가 actor lane은 후속 visual composition axis로 보낸다.

## Open Questions

- 모든 creature에 `idle/work/celebrate/tired/portrait/icon` state를 필수화할지 — 모모 slice 통과 후 세 번째 creature 적용 전에 재검토한다.
- 주문/연구/원정 completion이 각각 같은 celebrate strip을 공유할지 — production claim trigger가 안정화된 뒤 재검토한다.
- gpt-image-2 생성물의 strip consistency가 충분하지 않을 경우 Codex native image generation fallback을 쓸지 — 생성/검수 결과가 실패할 때만 결정한다.

## References

- Brief: `reports/deliberation/momo-work-celebrate-sprite/brief.md`
- Proposals: `reports/deliberation/momo-work-celebrate-sprite/proposals/designer.md`, `reports/deliberation/momo-work-celebrate-sprite/proposals/art-director.md`, `reports/deliberation/momo-work-celebrate-sprite/proposals/engineer.md`
- Critiques: `reports/deliberation/momo-work-celebrate-sprite/critique-designer.md`, `reports/deliberation/momo-work-celebrate-sprite/critique-art-director.md`, `reports/deliberation/momo-work-celebrate-sprite/critique-engineer.md`, `reports/deliberation/momo-work-celebrate-sprite/critique-senior-critic.md`
- Browser Use evidence: `reports/deliberation/momo-work-celebrate-sprite/browser-use-current-garden-20260507.png`
- Related code: `src/App.tsx`, `src/game/playfield/types.ts`, `src/game/playfield/GardenPlayfieldHost.tsx`, `public/assets/manifest/assetManifest.json`

## Changelog

- 2026-05-07: initial approved spec from proposal and critique rounds.
