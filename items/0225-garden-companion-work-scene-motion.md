# WorkUnit — 정원 동료 work scene motion

- ID: `0225`
- Status: planning
- GitHub issue: #424 — https://github.com/bborok1234/strange-seed-shop/issues/424
- Draft PR: pending
- Campaign source: P0.5 Idle Core + Creative Rescue
- Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:sprite-pipeline` -> `game-studio:game-playtest`
- Source specs: `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, `docs/IDLE_CORE_PRODUCTION_SPEC.md`

## Problem

#423 fixed the dead first screen, central mobile frame, plot assets, and raw strip artifact, but the production scene still reads too much like HUD cards plus small static worker poses. The user-visible issue is that `정원 동료 2명 작업 중` still does not feel like a living garden: the main creature is small, support actors are card-bound, and production motion is not strongly anchored to plot/crate/workbench space.

This is a production-bar gap, not a spacing bug. Cats & Soup makes the working character and station explain the idle loop. Egg, Inc. makes moving production units, capacity, and shipment feel like the farm itself. Strange Seed Shop needs a smaller version of that: companions should visibly work in the garden scene before the player reads the panel.

## Reference Teardown

- `Cats & Soup`: character + facility + loop motion is the UI explanation. Apply by putting `말랑잎 포리` and `방패새싹 모모` near plot/crate/workbench anchors, not only inside summary cards.
- `Egg, Inc.`: production readability comes from visible moving units and capacity pressure. Apply by showing leaf trail/order receipt motion from actor to crate or resource pouch.
- `Neko Atsume`: low-density object placement keeps the scene calm while characters remain the reason to look. Apply by using small anchored work spots instead of more panels.

Rejected alternative: another HUD skin pass. The current blocker is that the actor work scene is not dominant enough; more plaques or resource pills will not produce the “character game” jump the user is asking for.

## Creative Brief

- Player fun target: “내 동료들이 진짜 정원에서 일하고 있네.”
- Core loop role: automatic production + order preparation + upgrade recommendation.
- Screen moment: `?qaResearchExpeditionReady=1` and production-ready garden with two companions.
- Required assets/FX: existing gpt-image-2 worker strips can be reused only if they are normalized into readable anchored actor surfaces; if support actor work pose is missing or too small, generate one new gpt-image-2/Codex raster support work sprite and bind it through manifest.
- Game-feel requirement: at least one visible motion path connects worker -> leaves/order crate/resource pouch without a distracting raw strip or circular badge.

## Game Studio Department Signoff

- 기획팀: player verb is collect/produce/upgrade; the slice must make auto production legible before panel reading.
- 리서치팀: competition gap is character-at-work scene composition, not another dashboard card.
- 아트팀: actor scale, anchor, label plate, FX path must pass 393x852 small-size readability; new accepted asset requires gpt-image-2/Codex provenance.
- 개발팀: keep runtime image generation disabled; implement through manifest/static assets/CSS/React state only.
- 검수팀: Browser Use `iab` is mandatory for before/after production-ready screenshots.
- 마케팅팀: mock-only, no external channel or monetization claim.
- 고객지원팀: first 5 minutes confusion risk is “I see numbers but not who is doing work”; acceptance must reduce that.

## Subagent / Team Routing

No native subagent for the first implementation pass. The work touches a narrow shared surface (`src/App.tsx`, `src/game/playfield/GardenPlayfieldHost.tsx`, `src/styles.css`, manifest/assets if needed), and parallel edits would increase merge conflict risk. Browser Use QA remains in the main lane because the user explicitly requires the in-app browser.

## Plan

1. Inspect current production-ready DOM/CSS and Browser Use screenshot for actor/card/playfield bounds.
2. Move production companions from card-first presentation toward anchored playfield work spots:
   - primary worker near first plot/workbench;
   - support worker near second plot/order crate;
   - production trail/receipt motion crossing a short diegetic path.
3. Compress the production summary cards so they explain status without becoming the visual subject.
4. Add or reuse manifest-bound actor/FX assets only when the existing sprite assets remain readable at 48-72px.
5. Add focused visual assertions for anchored work scene, no raw strip exposure, and no circular badge artifact.
6. Verify with Browser Use `iab` before/after and local regression gates.
7. Publish draft PR, wait for checks, merge, and observe main CI.

## Acceptance Criteria

- [ ] `?qaResearchExpeditionReady=1` first viewport shows at least two companion work actors anchored to plot/crate/workbench positions, not only inside cards.
- [ ] No raw horizontal sprite strip or distracting circular helper badge is visible in the production card or playfield.
- [ ] At least one production motion path visually connects worker -> resource/order target.
- [ ] Top HUD/resource/action text remains glanceable and does not cover actor/plot labels at 393x852 and desktop central mobile frame.
- [ ] If a new accepted game asset is added, provenance, manifest entry, animation binding, style, alpha, and normalization gates pass.
- [ ] Browser Use `iab` before/after screenshots are stored under `reports/visual/issue-0225-garden-companion-work-scene-motion/`.
- [ ] `npm run check:p0-ui-ux`, `npm run check:art-share`, focused visual regression, `npm run build`, and `npm run check:ci` pass or a written blocker is recorded.

## Verification Commands

```bash
npm run check:p0-ui-ux
npm run check:art-share
npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "production garden visual composition|정원 동료|actor|raw strip"
npm run build
npm run check:ci
```

## Browser Use QA Plan

- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`
- Capture before screenshot and note actor/card/playfield bounds.
- Capture after screenshot at the same viewport.
- Inspect DOM for raw strip image dimensions and visible support actor anchors.
- Confirm no fallback-only claim: Playwright is regression evidence, not Browser Use replacement.

## Risks

- Existing gpt-image-2 strips may not frame-consistently animate at small size. If so, use static extracted poses plus CSS motion for this slice and create a later sprite-remaster WorkUnit.
- Moving actors into playfield can collide with plot labels on 360px width. Actor priority is higher; labels must move into plates.
- Full `npm run check:visual` may still expose long-chain expectation drift from #423. This slice should add focused gates for the new scene and split unrelated long-chain test cleanup if needed.
