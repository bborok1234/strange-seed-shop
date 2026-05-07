# 도감 기록 스탬프 FX plan-prompt

## Problem

#478은 도감 기록 직후 `달빛 단서 기록됨`과 다음 씨앗 목표를 HUD surface로 남겼지만, 기록 순간 자체는 아직 텍스트 전환과 receipt 중심입니다. collection record는 “저장됐다”는 작은 시각적 확정감이 필요하며, 후속 runtime 구현 전에 FX strip의 binding/spec/prompt를 먼저 고정해야 합니다.

## Goal

`fx_album_record_stamp_strip_v1`을 generation-ready asset plan/prompt에 추가합니다. 이 FX는 `album.clue_record.action.record` binding으로 도감 기록 버튼 직후 한 번 재생될 8-frame 96x96 horizontal strip입니다.

## Game Studio Route

- `game-studio:game-studio`
- `game-studio:sprite-pipeline`
- `game-studio:phaser-2d-game`
- `game-studio:game-playtest`

## Acceptance Criteria

- `fx_album_record_stamp_strip_v1`이 `asset_plan.json`에 있습니다.
- prompt batch에 같은 asset id와 output path가 있습니다.
- plan metadata가 `frame_count: 8`, `frame_size: 96x96`, `intended_fps: 12`, `animation.binding: album.clue_record.action.record`, `behavior: once`를 포함합니다.
- prompt가 horizontal strip, no text/watermark/logo, no baked UI/card, compact rail-safe motion을 명시합니다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`가 통과합니다.

## Safety

새 runtime image generation/API/cache 호출은 없습니다. 새 accepted manifest game asset을 추가하지 않고 source plan/prompt만 generation-ready 상태로 확장합니다.
