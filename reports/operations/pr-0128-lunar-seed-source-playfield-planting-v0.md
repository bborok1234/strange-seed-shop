## 요약

Issue #254의 온실 단서 달방울 씨앗 심기 vertical slice를 닫습니다. `달빛 온실 조사` 보상 source가 `달방울 씨앗` 구매/심기 뒤 garden playfield의 source plot, generated seed icon, tap-bound spritesheet FX로 이어집니다.

## Small win

- 플레이어가 온실 단서로 열린 `달방울 씨앗`을 구매하고 심으면 첫 번째 밭이 `온실 단서` source state로 보입니다.
- 사용자 QA에서 지적된 정적 FX strip 오염을 제거했습니다. FX strip은 밭에 이미지로 상시 표시되지 않고, 첫 탭의 `tap_growth` spritesheet feedback으로만 실행됩니다.

## 사용자/운영자 가치

- 사용자 가치: 긴 온실 production chain의 보상이 실제 정원 playfield 성장 순간으로 보입니다.
- 운영자 가치: 신규 game asset은 gpt-image-2 API 우선, organization/credit/quota blocker 시 Codex native raster fallback만 허용하는 provenance gate를 갖습니다.

## Before / After 또는 Visual evidence

- Before: Issue #251은 source가 seed/album 목표까지만 이어졌고, 심기 순간은 generic planting에 가까웠습니다.
- After: `reports/visual/p0-lunar-seed-source-playfield-planting-20260501.md`
- Browser Use `iab`: `sourcePlotCount=1`, `sourceIconCount=1`, `sourceFxCount=0`
- Tap telemetry: `tap_growth` 이벤트에서 `source=spritesheet` 확인

## Playable mode

- 확인 URL: `http://127.0.0.1:5174/?qaGreenhouseLunarSeedPlantReady=1&qaTab=seeds&qaReset=1&qaFxTelemetry=1`
- 실제 main playable worktree 변경은 없음.

## 검증

- `npm run check:ci`
- `npm run build`
- `npm run check:visual -- --grep "온실 단서 달방울"`
- `npm run check:visual -- --grep "신규 asset"`
- `npm run check:visual -- --grep "fallback"`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- Browser Use `iab`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터 변경 없음.
- 런타임 image generation 없음.
- SVG/vector/code-native 신규 game graphic acceptance 없음.

## 남은 위험

- `gpt-image-2` API는 OpenAI까지 도달했지만 organization verification propagation blocker가 반환되어 최종 생성 성공은 검증하지 못했습니다. 해당 blocker 시 Codex native image generation fallback provenance로 남겼습니다.

## 작업 checklist

- [x] Game Studio route 기록
- [x] plan-first artifact 작성
- [x] generated raster seed icon/FX strip manifest 연결
- [x] asset provenance/style/alpha gate 추가 또는 통과
- [x] Browser Use evidence 기록
- [x] focused visual regression 추가
- [x] `npm run check:ci` 통과

## 연결된 issue

Closes #254
