## 문제 / 배경

#506/#507에서 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1` PNG 후보가 생성됐지만, Phaser preview는 아직 accepted `creature_lunar_rare_001` silhouette stand-in을 사용한다. manifest에도 dedicated source icon/FX가 accepted runtime asset으로 등록되지 않았다.

## 목표

`밤유리 source 보기` 후 화면에 dedicated `seed_rare_001_icon`과 unlock FX가 보이도록 manifest와 Phaser runtime binding을 연결한다.

## Small win

rare route preview가 잠긴 실루엣/텍스트 promise에서 전용 source icon + unlock motion으로 바뀐다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `items/0270-night-glass-source-runtime-binding.md`

## Game Studio Department Signoff

- 기획팀: `밤유리 source 보기` player verb의 보상 물성을 dedicated source icon/FX로 닫는다.
- 리서치팀: rare route preview가 locked silhouette에 머무르는 경쟁작 대비 production gap을 해소한다.
- 아트팀: #506 gpt-image-2 provenance PNG와 strict 8-frame FX strip을 runtime candidate로 사용한다.
- 개발팀: manifest, Phaser preload/render/checker만 수정하고 runtime image generation은 추가하지 않는다.
- 검수팀: Browser Use 우선 QA를 시도하고, 현재 unavailable이면 blocker + Playwright fallback screenshot을 남긴다.
- 마케팅팀: 내부 playable promise이며 외부 채널/실결제/광고 없음.
- 고객지원팀: 플레이어가 다음 rare source route를 icon과 lock FX로 이해할 수 있게 한다.

## Subagent/Team Routing

Solo execute. 범위가 manifest + Phaser preview binding + focused checker로 좁고 병렬화 이득이 낮다.

## 플레이어 가치

`밤유리 source`가 placeholder가 아니라 실제 rare seed/source route로 읽혀 장기 수집 욕구를 강화한다.

## 수용 기준

- `public/assets/manifest/assetManifest.json`에 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1` accepted entry가 추가된다.
- Phaser `TOPOLOGY_ASSETS`/preload/topology telemetry에 두 asset key가 포함된다.
- `밤유리 source 보기` 후 preview가 dedicated seed icon 중심으로 보인다.
- unlock FX strip은 `night_glass_source.action.preview_unlock`, 8 frames, 96x96, 12fps로 binding된다.
- `npm run check:phaser`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Visual evidence 계획

- Browser Use `iab` 우선.
- 현재 tool discovery에서 Browser Use callable surface가 노출되지 않았으므로, blocker를 `reports/visual/issue-0508-night-glass-source-runtime-binding/browser-use-blocker-20260508.md`에 기록한다.
- Playwright fallback screenshot을 `reports/visual/issue-0508-night-glass-source-runtime-binding/`에 저장한다.

## Playable mode 영향

Phaser preview route의 visible gameplay가 바뀐다. stable main playable mode는 그대로 `npm run play:main` / port `5174` 계약을 유지한다.

## 안전 범위

- Runtime image generation/API/cache를 추가하지 않는다.
- SVG/vector/code-native game graphics를 추가하지 않는다.
- 실제 rare acquisition/liveops/payment scope는 열지 않는다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
