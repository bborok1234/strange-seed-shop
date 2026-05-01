## 요약

`달방울 씨앗` 수확 후 `달방울 누누`가 도감 reveal에서 끝나지 않고 production card, playfield production actor, roster에 lunar work-state로 합류하게 했습니다.

## Small win

수확 직후 화면이 “새 생명체 발견”에서 “정원 동료 3명 작업 중”으로 이어져, lunar creature payoff가 idle production 변화로 읽힙니다.

## 사용자/운영자 가치

- 사용자: `달방울 누누`가 바로 정원 일꾼으로 보이고 분당 생산량/roster에 반영됩니다.
- 운영자: dedicated FX 생성이 막힌 상태에서도 accepted raster reuse binding과 provenance를 남겨 다음 asset lane으로 안전하게 이어갈 수 있습니다.

## Before / After 또는 Visual evidence

Before: lunar harvest 흐름은 reveal과 다음 목표 전환은 있었지만, production actor/work-state는 herb starter visual에 머물렀습니다.

After:

- `reports/visual/lunar-harvest-payoff-before-browser-use-20260501.png`
- `reports/visual/lunar-harvest-payoff-reveal-browser-use-20260501.png`
- `reports/visual/lunar-harvest-payoff-production-browser-use-20260501.png`
- `reports/visual/lunar-harvest-creature-payoff-v0-20260501.md`

## Playable mode

- Local QA URL: `http://127.0.0.1:5173/?qaLunarSeedReadyToHarvest=1&qaFxTelemetry=1`
- Stable playable main: `http://127.0.0.1:5174` via `$seed-play` gate

## 검증

- [x] `npm run check:asset-provenance`
- [x] `npm run check:asset-style`
- [x] `npm run check:asset-alpha`
- [x] `npm run check:content`
- [x] `npm run check:loop`
- [x] `npm run check:visual -- --grep "달빛 씨앗"`
- [x] `npm run check:ci`
- [x] Browser Use `iab` ready harvest / reveal / post-harvest production screenshot evidence
- [x] Seed-ops publication/Ralph runner harness regression fixed and covered by `npm run check:seed-ops-publication-gate`, `npm run check:ralph-runner-bridge`, `npm run check:ops-live`

## 작업 checklist

- [x] Game Studio route 기록
- [x] Asset/FX provenance 기록
- [x] Browser Use 우선 QA evidence 기록
- [x] Local CI pass
- [x] GitHub PR checks pass
- [ ] main CI pass after merge

## 안전 범위

- 런타임 이미지 생성 없음.
- 실결제, 로그인, 외부 배포, 고객 데이터, 실제 GTM action 없음.
- `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL` missing으로 dedicated gpt-image-2 generation은 수행하지 않았습니다.
- `fx_lunar_harvest_moonburst_001`은 accepted Codex native raster FX strip reuse binding입니다.

## 남은 위험

Dedicated 6-frame harvest moonburst strip은 image API key/model 접근이 생긴 뒤 별도 issue에서 생성해야 합니다.

운영 하네스 수정은 이번 branch에서 같이 고정했습니다. Codex App prompt-side `$ralph` activation은 실제 detached long runner가 아니며, 앞으로 장시간 운영 주장은 runner artifact + heartbeat + watchdog evidence로만 인정합니다.

## 연결된 issue

Closes #266
