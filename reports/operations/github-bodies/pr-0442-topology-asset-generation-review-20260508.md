## 요약

#442의 Phaser v1 topology 후보 PNG 14개를 `gpt-image-2`로 생성하고, provenance/status/review gate를 추가했습니다.

## Small win

Phaser garden board가 placeholder shape에서 벗어나기 위한 terrain, plot state, facility, actor, FX 후보를 workspace에 확보했습니다.

## 사용자/운영자 가치

사용자 관점에서는 plot/facility/worker state를 텍스트 없이 읽는 v1 garden board로 가기 위한 visual source가 생깁니다. 운영자 관점에서는 opaque 후보를 곧바로 accepted manifest asset으로 오인하지 않도록 review-required gate를 CI에 묶었습니다.

## Before / After 또는 Visual evidence

- Before: #440은 plan/prompt만 존재했고 실제 topology PNG 후보는 없었습니다.
- After: `public/assets/game/**`에 14개 후보 PNG가 생겼고, raw output은 `assets/source/generated/gpt-image/**`에 보존됩니다.
- Contact sheet: `reports/assets/topology_asset_contact_sheet_20260508.png`
- Review report: `reports/assets/topology_asset_review_20260508.md`

## Playable mode

이번 PR은 static asset generation/review입니다. Runtime integration은 하지 않았고, Browser Use playtest는 다음 integration WorkUnit에서 수행합니다.

## 검증

- `npm run check:topology-generated-assets`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API 호출 없음.
- Manifest accepted registration 없음.
- `gpt-image-2` transparent background 미지원으로 opaque 후보만 저장했고, background 외 후보는 알파/배경 후처리 또는 strict strip normalization 전까지 runtime manifest에 accepted로 등록하지 않도록 review report와 checker에 고정했습니다.

## 남은 위험

- Actor/FX 후보는 1024x1024 source candidate라 바로 spritesheet로 쓸 수 없습니다.
- Plot/facility/UI 후보는 opaque/checkerboard 배경 제거가 필요합니다.
- 다음 PR은 alpha cleanup, strict strip normalization, manifest registration, Phaser runtime integration, Browser Use/playtest evidence 중 하나 이상을 포함해야 합니다.

## 연결된 issue

- Closes #442

## 작업 checklist

- [x] 14개 PNG 후보 생성
- [x] provenance/style/alpha gate 실행
- [x] asset review report 작성
- [x] roadmap/control room/dashboard/heartbeat 갱신
