# 밤유리 source icon/FX plan-prompt

## 요약

#502에서 `밤유리 source` locked preview가 들어갔지만 전용 `seed_rare_001` source icon과 dedicated unlock FX가 없어 accepted rare creature silhouette가 stand-in으로 쓰이고 있다. 다음 rare acquisition/route loop 전에 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1`을 generation-ready asset plan/prompt로 고정한다.

## Small win

- 루미 reveal 이후 다음 장기 목표인 밤유리 source가 placeholder가 아니라 전용 seed icon/FX production queue를 갖는다.

## 사용자/운영자 가치

- 게임 가치: rare route promise가 실제 보상 물성을 가진 seed icon/FX로 이어진다.
- 운영사 가치: generation 전에 asset ids, output paths, frame contract, manifest binding을 deterministic checker로 고정한다.

## Before / After 또는 Visual evidence

- Before: #503 이후 runtime은 accepted `creature_lunar_rare_001` silhouette로만 `seed_rare_001`을 예고한다.
- After: `seed_rare_001_icon`, `fx_night_glass_source_unlock_strip_v1` plan/prompt가 generation-ready 상태가 된다.
- Browser Use evidence 또는 blocker: runtime 화면 변경이 아닌 asset source plan/prompt slice라 Browser Use N/A.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev:legacy -- --host 127.0.0.1 --port 5174`
- 이 이슈가 사람 플레이 환경을 막지 않는 이유: source JSON 계획만 추가하고 runtime route나 playable worktree 계약은 변경하지 않는다.

## 검증

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Runtime image generation/API/cache 호출 없음.
- 이번 이슈는 generation-ready plan/prompt까지만 다룬다.

## 남은 위험

- 실제 PNG generation, manifest acceptance, Phaser runtime binding은 후속 WorkUnit으로 분리한다.
