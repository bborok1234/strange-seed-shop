# P0.5 studio campaign audit

Status: verified
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Work type: game_feature
Scope-risk: moderate
Issue: #260

## Intent

`P0.5 Idle Core + Creative Rescue`가 정말 production idle vertical slice로 닫힐 수 있는지, 현재 첫 5분 화면/루프/에셋/FX/QA 증거를 게임사 부서별로 감사하고 다음 implementation tranche를 정한다.

## Studio Campaign Gate

Campaign source of truth: `P0.5 Idle Core + Creative Rescue`

P0.5 completion 기준:

- 첫 5분 loop가 심기 -> 성장 가속 -> 수확/발견 -> 자동 생산 -> 보상 사용 -> 다음 목표로 이어진다.
- 정원 화면에서 생산 주체, 생산량, 주문/납품, 다음 보상, 오프라인 복귀 hook이 즉시 읽힌다.
- 핵심 seed/creature/FX/order/facility visual surface는 accepted manifest raster asset이다.
- Asset/FX work는 gpt-image-2 default 또는 Codex native fallback provenance와 gastory-style asset bundle evidence를 남긴다.
- Browser Use `iab` 또는 현재 세션 blocker와 screenshot/report evidence가 visible gameplay PR마다 남는다.

## Game Studio Route

- Umbrella: `game-studio:game-studio`
- UI/HUD/playfield review: `game-studio:game-ui-frontend`
- Browser playtest: `game-studio:game-playtest`
- Asset/FX planning: `game-studio:sprite-pipeline` + project-local GPT asset skills

## Game Studio Department Signoff

| 부서 | 이번 audit 질문 | 산출물 |
| --- | --- | --- |
| 기획팀 | 첫 5분 player verb와 reward timing이 “하나만 더”로 이어지는가 | current loop map, missing verb list |
| 리서치팀 | Egg, Inc. / Idle Miner / Cell to Singularity 대비 production gap이 어디인가 | reference teardown, next gap priority |
| 아트팀 | 현재 화면의 seed/creature/FX/order/facility asset이 같은 art bible로 보이는가 | asset/FX consistency table, gpt-image-2 batch 후보 |
| 개발팀 | 다음 tranche가 save/economy/runtime boundary를 깨지 않는가 | implementation tranche 후보와 touched files |
| 검수팀 | Browser Use 기준으로 첫 화면, HUD, playfield, bottom tab, FX가 읽히는가 | mobile/desktop screenshot QA plan |
| 마케팅팀 | 첫 5분을 한 문장으로 팔 수 있는 약속이 있는가 | mock-only player-facing promise |
| 고객지원팀 | 플레이어가 헷갈릴 지점과 깨진 asset/support risk가 무엇인가 | confusion/support risk list |

## Subagent/Team Routing

Use Codex native subagents for at least one independent repo-local or visual/QA audit lane if available. The main agent owns integration and next tranche selection. Do not split write scopes until the audit picks a concrete implementation tranche.

## Reference Teardown

Compare against:

- Egg, Inc.: production visibility, workers/machines, reward anticipation.
- Idle Miner Tycoon: manager/automation readability, station upgrade clarity.
- Cell to Singularity: long-term unlock silhouettes, discovery/tech-tree anticipation.
- gastory: style state, prompt/model sidecar, reference image consistency, animation camera/composition lock, frame/GIF/spritesheet extraction.

## Creative Brief

The first 5 minutes should feel like a small enchanted greenhouse production scene, not a form-based collection menu. The player should see a living creature working, a seed growing, a reward moving the economy forward, and a visible next mystery.

## Role-Debate Note

Expected tension: 아트팀은 asset batch와 motion polish를 우선할 가능성이 높고, 개발팀은 다음 생산/주문 loop slice를 우선할 수 있다. Audit output must choose one next tranche and explicitly reject the other as deferred if it is not selected.

## Plan

1. Capture current P0.5 first-5-minute state from docs, roadmap, and current playable URL.
2. Run Browser Use `iab` mobile QA if available; if blocked, record current blocker and use accepted fallback only with evidence.
3. Produce a campaign audit report under `reports/operations/` or `reports/playtests/` with department signoff.
4. Select one next implementation tranche with player verb, production/progression role, screen moment, asset/FX, playtest evidence.
5. Create/update the next implementation issue plan artifact from the selected tranche.

## Acceptance Criteria

- [x] Audit report names at least three competition-inspired production gaps.
- [x] Audit report includes department signoff and role-debate note.
- [x] Asset/FX gaps use gpt-image-2 default/Codex fallback and gastory-style bundle language.
- [x] Next implementation tranche names player verb, production/progression role, screen moment, asset/FX, playtest evidence.
- [x] Browser Use `iab` evidence or current-session blocker is recorded.

## Evidence

- Draft PR: #265 `https://github.com/bborok1234/strange-seed-shop/pull/265`
- Audit report: `reports/operations/p05-studio-campaign-audit-20260501.md`
- Next implementation plan artifact: `items/0132-lunar-harvest-creature-payoff-v0.md`
- Browser Use `iab` screenshots:
  - `reports/visual/p05-campaign-audit-greenhouse-lunar-plant-browser-use-20260501.png`
  - `reports/visual/p05-campaign-audit-lunar-ready-harvest-browser-use-20260501.png`
  - `reports/visual/p05-campaign-audit-lunar-harvest-reveal-browser-use-20260501.png`
- Subagent audit lanes:
  - loop/progression gap audit
  - asset/FX consistency audit
  - visual/playtest evidence audit

## Selected Next Tranche

`Lunar harvest creature payoff v0` was selected over full roster work and order board choice.

Rationale: P0.5 latest path already reaches `온실 단서 -> 달방울 씨앗 심기`; the next strongest production gap is proving that `달방울 누누` becomes a working garden actor with lunar-specific harvest/reward payoff. Full roster work is deferred until one lunar creature proves the asset/runtime contract.

## Verification

- `npm run check:seed-ops-queue` — pass
- `npm run check:ops-live` — pass
- `npm run check:dashboard` — pass
- `npm run check:ci` — pass
- `npm run check:visual` — pass, 49 tests. First sandbox run failed on local port bind `127.0.0.1:4173`; escalated rerun passed.
- PR #265 checks — pass:
  - Check automerge eligibility: `https://github.com/bborok1234/strange-seed-shop/actions/runs/25219403256/job/73947597649`
  - Verify game baseline: `https://github.com/bborok1234/strange-seed-shop/actions/runs/25219403267/job/73947597333`

## Risks

- Audit can become another document-only loop. Mitigation: acceptance requires selecting one next implementation tranche with concrete asset/FX and playtest evidence.
