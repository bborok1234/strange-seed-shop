# 요약

#480 도감 기록 스탬프 FX plan-prompt를 추가한다. #478 이후 도감 기록 순간이 텍스트 전환 중심으로 남아 있어, 후속 runtime FX 연결 전에 dedicated record confirmation strip의 generation-ready spec과 prompt를 고정한다.

## 작업 checklist

- [x] Game Studio route 기록: `game-studio:game-studio`, `sprite-pipeline`, `phaser-2d-game`, `game-playtest`
- [x] plan-first WorkUnit 작성: `items/0256-album-record-fx-plan-prompt.md`
- [x] `fx_album_record_stamp_strip_v1` asset plan entry 추가
- [x] 같은 id의 gpt-image-2 prompt 추가
- [x] topology asset checker required/sprite 목록 추가
- [x] roadmap/dashboard/control room/heartbeat 갱신

## Small win

도감 기록 버튼 직후 “저장됐다”는 짧은 stamp/sparkle FX를 만들 수 있는 asset contract가 생겼다.

## 사용자/운영자 가치

- 사용자: 후속 runtime에서 collection record 순간이 더 명확한 visual payoff로 읽힌다.
- 운영자: `animation.binding`, frame count/size/fps가 먼저 고정되어 generation/runtime 연결이 검증 가능해진다.

## Before / After 또는 Visual evidence

- Before: record moment 전용 FX strip plan/prompt가 없었다.
- After: `fx_album_record_stamp_strip_v1` plan/prompt가 추가됐고 checker required/sprite id에 포함됐다.
- Visual evidence: N/A - runtime UI 변화 없음. 후속 runtime FX 연결 WorkUnit에서 Browser Use 또는 Playwright screenshot을 남긴다.

## Playable mode

- 대상: `apps/seed-garden-phaser`
- 후속 binding: `album.clue_record.action.record`

## 검증

- `npm run check:topology-asset-plan` pass
- `npm run check:asset-provenance` pass
- `npm run check:asset-style` pass
- `npm run check:ci` pass

## 안전 범위

- source asset plan/prompt와 checker만 변경한다.
- 새 runtime image generation/API/cache 호출은 없다.
- 새 accepted manifest game asset은 추가하지 않는다.

## 남은 위험

- 실제 이미지 generation, strip normalization, Phaser runtime 연결, screenshot QA는 후속 WorkUnit이다.

## 연결된 issue

Closes #480
