# Brief — garden-respecting-hud-assets

## Axis

`garden-respecting-hud-assets`는 Cycle A 이후에도 남은 “HUD가 아직 cream rectangle처럼 보이고, 정원 느낌을 아트가 아니라 패널이 결정한다”는 문제를 해결하기 위한 의사결정 축이다. 목표는 HUD를 숨기거나 기능을 줄이는 것이 아니라, 사이드 dock·다음 행동·plot card·resource card가 정원 안의 잎, 나무 표지판, 덩굴, 햇살 리본, 유리 온실 장식 같은 raster UI asset/decal 언어로 보이게 할지, 그리고 그 asset을 어떤 순서로 생성·검증·적용할지를 결정하는 것이다.

## Current State

- Cycle A `stage-art-first-restructure`는 2026-05-05 사용자 승인으로 종료 OK를 받았고, 다음 axis는 사용자 메시지와 `docs/studio/HANDOFF.md` 기준 `garden-respecting-hud-assets`로 확정됐다.
- Cycle A 결과는 `reports/visual/cycle-A-evidence-20260505/README.md`에 기록되어 있다. art-share-gate는 12/12 PASS지만, honest known issues로 `plot card cream rectangle`, `dock card contrast 약함`, `첫 세션 onboarding 진입점 약화`가 남았다.
- 현재 데스크톱 구조는 `src/App.tsx`의 `.garden-stage`, `.garden-panel`, `.side-dock`, `.side-dock-card`와 `src/game/playfield/GardenPlayfieldHost.tsx`의 React plot overlay, `src/game/playfield/GardenScene.ts`의 Phaser plot rendering이 함께 구성한다.
- 현재 정원 배경과 게임 raster 자산은 `public/assets/game/backgrounds/`, `public/assets/game/ui/`, `public/assets/manifest/assetManifest.json`에 있다. 현재 UI 자산은 `ui_album_card_frame_001`, `ui_order_crate_leaf_001` 정도로 좁고, HUD frame/decal 전용 raster asset vocabulary가 부족하다.
- asset source-of-truth는 `assets/source/asset_style_bible.json`, `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`, `assets/source/gpt_image_asset_provenance.json`이다. 런타임 이미지 생성은 금지되어 있고, 새 game asset은 OpenAI Images API `gpt-image-2` 또는 Codex native image generation provenance를 남긴 PNG여야 한다.
- `package.json`에는 `check:art-share`가 있고, asset 관련 검증은 `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-normalization`, `npm run check:asset-alpha-quality` 계열을 사용한다.

## Why This Axis Now

사용자는 Cycle A hotfix 이후에도 “필요하다면 HUD를 위한 에셋을 생성해서라도 뭔가 정원같은 느낌을 줘야 한다”고 지적했다. Cycle A는 stage art share와 layout obstruction을 줄였지만, 남은 HUD surface가 여전히 UI 카드처럼 읽히면 “정원에 들어왔다”는 첫 인상이 회복되지 않는다. 이 axis가 결정되면 다음 구현 cycle은 단순 색/여백 polish가 아니라 HUD를 정원물로 바꾸는 asset-first vertical slice로 시작할 수 있다.

## Constraints

- Phase 2와 Phase 3에서는 `src/`, `public/`, `assets/source/` 구현 파일을 수정하지 않는다. specialist는 관련 코드와 자산을 읽고 proposal/critique만 쓴다.
- 새 HUD/game asset은 SVG/vector/code-native drawing으로 accepted manifest asset을 만들 수 없다. raster PNG provenance가 필요하다.
- runtime gameplay는 이미지 생성 API나 Codex image generation을 호출하지 않는다.
- 새 asset pipeline은 `assets/source/asset_plan.json` → `assets/source/asset_prompts.json` → generation provenance → `public/assets/manifest/assetManifest.json` → asset checks 흐름을 유지해야 한다.
- HUD asset은 garden art를 더 가리기 위한 장식이 아니라 cream rectangle을 줄이고 시각 hierarchy를 정원물로 바꾸는 수단이어야 한다.
- 모바일 invariant와 데스크톱 art-share-gate를 둘 다 보존한다. 특히 dock 확장 시 plot card가 가려지는 Cycle A measurement gap을 되살리면 안 된다.
- Phase 5 review는 `docs/studio/USER_PREFERENCES.md` P8 standing delegation을 적용할 수 있다. 단 destructive, credential, payment, external-production, customer-data boundary를 건드리면 standing delegation을 적용하지 않는다.

## Out of Scope

- 실결제, 광고, 외부 production 배포, customer data 변경.
- 게임 mechanic/economy 변경. resource values, growth formulas, save schema migration은 본 axis의 기본 범위가 아니다.
- 전체 desktop layout 재설계. Cycle A의 rail/stage/dock 골격은 유지한다.
- `garden-diegetic-ui` Cycle B 전체 구현. 단 이 axis는 plot card와 HUD asset이 Cycle B in-canvas diegetic UI와 충돌하지 않도록 interface와 sequencing을 결정해야 한다.
- 새 creature/seed roster 확장. 필요한 것은 HUD/decal/frame/FX 성격의 UI asset vocabulary다.
- marketing hero, landing page, promotional copy.

## Reference Artifacts

- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- User preferences: `docs/studio/USER_PREFERENCES.md`
- Handoff / user decision: `docs/studio/HANDOFF.md`
- Previous spec: `reports/deliberation/stage-art-first-restructure/spec.md`
- Cycle A evidence: `reports/visual/cycle-A-evidence-20260505/README.md`
- Asset style bible: `assets/source/asset_style_bible.json`
- Asset plan / prompts: `assets/source/asset_plan.json`, `assets/source/asset_prompts.json`
- Asset manifest: `public/assets/manifest/assetManifest.json`
- Main UI code: `src/App.tsx`, `src/styles.css`
- Playfield code: `src/game/playfield/GardenPlayfieldHost.tsx`, `src/game/playfield/GardenScene.ts`
- Studio loop WorkUnit: `items/0209-codex-studio-deliberation-ralph-loop.md`
