# Lunar harvest creature payoff v0

## 요약

`달방울 씨앗` 수확이 단순 도감 reveal에서 끝나지 않고, `달방울 누누`가 production actor/work-state로 합류하게 만든다.

## Small win

수확 직후 플레이어가 “새 생명체를 얻었다”뿐 아니라 “얘가 이제 정원에서 일한다”를 같은 화면 흐름에서 확인한다.

## 사용자/운영자 가치

- 사용자: `달방울 누누` 발견이 생산 속도, roster, playfield actor로 이어져 수집 보상이 살아있는 정원 변화로 읽힌다.
- 운영자: accepted raster asset reuse/provenance와 Browser Use evidence가 남아 다음 dedicated FX generation lane으로 확장할 수 있다.

## Before / After 또는 Visual evidence

Before: lunar harvest는 named creature reveal과 다음 도감 목표 전환 중심으로 읽혔고, production visual language는 herb starter actor에 머물렀다.

After:

- `reports/visual/lunar-harvest-payoff-before-browser-use-20260501.png`
- `reports/visual/lunar-harvest-payoff-reveal-browser-use-20260501.png`
- `reports/visual/lunar-harvest-payoff-production-browser-use-20260501.png`
- `reports/visual/lunar-harvest-creature-payoff-v0-20260501.md`

## Playable mode

QA URL:

`http://127.0.0.1:5173/?qaLunarSeedReadyToHarvest=1&qaFxTelemetry=1`

Stable playable main은 별도 `$seed-play` gate에서 `http://127.0.0.1:5174`로 유지한다.

## 검증

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:content`
- `npm run check:loop`
- `npm run check:visual -- --grep "달빛 씨앗"`
- `npm run check:ci`
- Browser Use `iab` mobile capture: ready harvest, harvest reveal, post-harvest production state

## 안전 범위

- 런타임 이미지 생성 없음.
- 실결제, 로그인, 외부 배포, 고객 데이터, 실제 GTM action 없음.
- `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 missing이라 dedicated gpt-image-2 generation은 수행하지 않음.
- v0는 accepted Codex native raster FX strip을 `fx_lunar_harvest_moonburst_001` harvest binding으로 재사용한다.

## 남은 위험

Dedicated 6-frame lunar harvest moonburst strip은 image API key/model 접근이 생긴 뒤 별도 lane에서 생성해야 한다. 현재 change는 provenance가 있는 accepted raster reuse binding이다.

## 연결된 issue

- GitHub issue: #266
- Item: `items/0132-lunar-harvest-creature-payoff-v0.md`
- Campaign: `P0.5 Idle Core + Creative Rescue`
