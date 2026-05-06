# Studio Operate — Garden Production Redesign

- 일시: 2026-05-06
- WorkUnit: `items/0224-garden-production-redesign-asset-sprite-pass.md`
- GitHub issue: #422
- Branch: `codex/p05-garden-production-redesign`
- Status: review, PR publication gate 준비

## Goal

정원 첫 화면을 정적인 카드 UI가 아니라 중앙 모바일 game frame 안의 production scene으로 재구성한다. 데스크톱에서도 모바일 frame만 보이고, fresh start는 잎 0 상태에서 첫 씨앗을 무료로 심을 수 있어야 하며, gpt-image-2 asset/sprite/FX가 실제 화면 state에 연결되어야 한다.

## 변경 요약

- `gpt-image-2` raster PNG 12개를 생성하고 source/provenance/status/manifest를 갱신했다.
- UI frame 6개, production actor strip 3개, reward/order FX strip 3개를 `public/assets/game/**`에 배치했다.
- 정원 shell을 desktop/mobile 모두 중앙 mobile frame으로 유지하고 desktop side rail/dashboard panel을 제거했다.
- plot marker를 새 floor seedbed asset으로 바꾸고 label plate/shadow를 강화했다.
- production actor와 order prop을 playfield lane에 배치하고 worker strip animation/FX strip binding을 manifest 기반으로 연결했다.
- fresh start에서 production surface가 비어 보이지 않도록 숨기고, 첫 plot CTA `무료로 심기`를 Browser Use에서 실제 클릭해 성장 상태 진입을 확인했다.
- production-ready 상태에서는 하단 action surface를 compact하게 줄이고 추천 성장 선택 2개만 노출해 bottom tab overlap을 제거했다.

## Browser Use Evidence

- Fresh start final: `reports/visual/issue-0224-garden-production-redesign/browser-use-fresh-start-final-clean-20260506.png`
- Fresh start click-through: `reports/visual/issue-0224-garden-production-redesign/browser-use-fresh-start-after-free-plant-20260506.png`
- Production-ready final: `reports/visual/issue-0224-garden-production-redesign/browser-use-research-expedition-ready-final-clean-20260506.png`

## Asset Evidence

- Raw/contact sheet: `reports/assets/issue-0224-gpt-image-contact-sheet.png`
- Postprocessed contact sheet: `reports/assets/issue-0224-postprocessed-contact-sheet.png`
- Sprite normalization provenance: `assets/source/sprite_normalization_provenance_0224.json`

## Verification

- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:asset-normalization` pass
- `npm run check:asset-alpha` pass
- `npm run check:p0-ui-ux` pass
- `npm run check:art-share` pass, 17 passed
- `npm run build` pass
- `npm run check:ci` first attempt reached `check:ops-live` and failed only because the heartbeat still pointed at `codex/offline-return-reward-motion`; heartbeat updated to this WorkUnit and branch.

## Next Action

Re-run `npm run check:ci`, run visual gate if needed, then commit, push, create/update draft PR, and continue through GitHub checks/merge gate under the Studio contract.
