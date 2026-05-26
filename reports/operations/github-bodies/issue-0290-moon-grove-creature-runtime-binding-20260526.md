## 문제 / 배경

Issue #546 / PR #547은 월정 숲 새벽이끼 전용 portrait, idle/work actor strip, discovery bloom FX를 generated workspace asset 후보와 review evidence로 만들었습니다. 그러나 아직 manifest accepted entry와 Phaser runtime binding이 없어 harvest reveal은 source badge와 기존 source reward FX에 머뭅니다.

## 목표

4개 generated asset 후보를 accepted manifest와 Phaser preload/render/telemetry에 연결해 `월정 숲 수확` 후 전용 creature portrait, actor motion, discovery bloom FX가 화면에 남게 합니다.

## Small win

`월정 숲 새벽이끼`가 텍스트 discovery가 아니라 고유 silhouette와 motion payoff를 가진 named creature로 플레이어에게 읽힙니다.

## Game Studio route

`game-studio:game-studio -> game-studio:phaser-2d-game -> game-studio:game-ui-frontend -> game-studio:game-playtest`

## Plan

1. `assetManifest.json`에 4개 accepted asset entry와 animation metadata를 추가합니다.
2. Phaser `TOPOLOGY_ASSETS`에 portrait, idle/work actor strip, discovery bloom FX를 추가합니다.
3. preload/animation/pending FX routing을 전용 discovery asset으로 연결합니다.
4. harvest reveal과 overview telemetry에 creature/actor/FX keys를 노출합니다.
5. `check-phaser-foundation`과 visual evidence로 화면/telemetry를 검증합니다.
6. PR checks, merge, main CI를 확인합니다.

## 플레이어 가치 또는 운영사 가치

플레이어는 rare harvest 후 새 생명체가 실제로 등장하고 정원에 남는 보상을 봅니다. 운영자는 asset generation과 runtime binding 사이의 traceability를 manifest/checker/visual evidence로 유지합니다.

## 수용 기준

- [ ] 4개 asset이 accepted manifest entry로 등록됩니다.
- [ ] `TOPOLOGY_ASSET_KEYS`에 4개 key가 포함됩니다.
- [ ] harvest 후 `lastFxKey=fx_moon_grove_discovery_bloom_strip_v1`, `lastFxKind=moonGroveDiscovery`.
- [ ] harvest/overview telemetry가 creature portrait, idle/work actor, discovery bloom FX key를 노출합니다.
- [ ] action rail과 playfield에서 `월정 숲 발견`이 전용 creature/actor surface로 읽힙니다.
- [ ] `npm run check:phaser`, `npm run check:asset-provenance`, `npm run check:asset-alpha`, `npm run check:ci`, `git diff --check` 통과.
- [ ] PR checks, merge, main CI green.

## Visual evidence 계획

Browser Use 우선 QA로 harvest reveal 화면을 확인하고 `reports/visual/issue-0548-moon-grove-creature-runtime-binding/`에 screenshot/report를 남깁니다. Browser Use가 막히면 blocker를 기록하고 Playwright screenshot evidence를 fallback으로 남깁니다.

## Playable mode 영향

Phaser playable runtime에 moon grove creature/actor/FX가 추가됩니다. 사람 플레이용 main worktree 정책은 변경하지 않습니다.

## 안전 범위

- 새 image generation 없음
- runtime image generation 없음
- 기존 accepted asset overwrite 없음
- 결제, 광고, 고객 데이터, 외부 배포 없음
- manifest/Phaser runtime/checker/visual evidence 범위로 제한

## 검증 명령

- `npm run check:phaser`
- `npm run check:asset-provenance`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`
