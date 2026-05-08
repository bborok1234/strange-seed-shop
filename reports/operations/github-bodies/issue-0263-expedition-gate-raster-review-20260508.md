# 첫 원정 문/귀환 상자 raster 후보 생성/리뷰

## 요약

#493에서 준비한 첫 원정 문, 귀환 상자, 귀환 보상 FX strip prompt 3개를 실제 PNG workspace 후보로 생성하고 리뷰합니다. runtime 통합 전 단계로, provenance와 review evidence를 남겨 전용 prop/FX art debt를 해소할 수 있는지 판정합니다.

## Small win

첫 원정 route가 텍스트와 기존 order crate stand-in만 쓰지 않고, `facility_expedition_gate_v1`, `facility_expedition_return_crate_v1`, `fx_expedition_return_reward_strip_v1` 후보를 갖게 됩니다.

## 사용자/운영자 가치

플레이어는 D7 장기 목표를 전용 원정 문과 귀환 보상 cargo로 더 쉽게 이해합니다. 운영자는 prompt-only 계약에서 실제 generated raster 후보, provenance, review gate로 넘어갑니다.

## Before / After 또는 Visual evidence

- Before: #490 runtime은 첫 원정 출발/귀환 flow가 있지만 전용 원정 prop/FX 후보가 없습니다.
- After: 3개 output path에 PNG 후보와 review/contact-sheet evidence를 남깁니다.

## Playable mode

이번 WorkUnit은 asset generation/review 중심입니다. runtime binding을 같은 PR에 포함하지 않으면 playable 변화는 없습니다.

## 작업 checklist

- [ ] `facility_expedition_gate_v1` 생성
- [ ] `facility_expedition_return_crate_v1` 생성
- [ ] `fx_expedition_return_reward_strip_v1` 생성
- [ ] provenance/status 갱신
- [ ] asset review report 작성
- [ ] asset provenance/style/alpha/plan 검증

## 검증

- `npm run asset:generate:gpt-image -- --asset-id=facility_expedition_gate_v1 --force`
- `npm run asset:generate:gpt-image -- --asset-id=facility_expedition_return_crate_v1 --force`
- `npm run asset:generate:gpt-image -- --asset-id=fx_expedition_return_reward_strip_v1 --force`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:topology-asset-plan`
- `git diff --check`

## 안전 범위

- 실시간 게임 런타임에서 OpenAI API나 Codex native image generation을 호출하지 않습니다.
- accepted manifest/runtime binding은 후보 리뷰가 충분할 때만 포함합니다.
- SVG/vector/code-native 대체 그래픽은 사용하지 않습니다.

## 남은 위험

- `gpt-image-2` transparent background 제한으로 opaque 후보 후처리가 필요할 수 있습니다.
- FX strip이 strict 8x96x96 layout을 만족하지 못하면 normalization 후속 WorkUnit이 필요합니다.

## 연결된 issue

- Follows #492
- Follows PR #493
