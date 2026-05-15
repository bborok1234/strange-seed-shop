# 월정 숲 source acquisition bridge

## 문제 / 배경

#534/#535는 `clue_moon_grove_001` promise를 accepted source icon/FX로 보여주게 만들었다. 하지만 아직 `월정 숲 source 확인` player verb와 `seed_moon_grove_001 source 획득` 상태가 없어 다음 planting loop로 이어질 근거가 약하다.

## 목표

월정 문 첫 원정 보상 이후 `clue_moon_grove_001`을 실제 source acquisition 상태로 전환한다.

## Small win

`월정 숲 source 확인`을 누르면 `seed_moon_grove_001 source 획득` receipt/objective/telemetry와 source icon/FX marker가 남는다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `docs/ROADMAP.md` P0.5 Idle Core + Creative Rescue

## Game Studio Department Signoff

- 기획팀: approve - 월정 문 보상이 다음 seed source inventory로 닫힌다.
- 리서치팀: approve - 장기 expedition reward가 그림 promise에서 멈추는 production gap을 해소한다.
- 아트팀: approve - accepted source icon/FX를 acquisition screen moment에 새 binding한다.
- 개발팀: approve - Phaser local state/action/render/checker 범위로 제한한다.
- 검수팀: approve - Browser Use 우선, unavailable 시 blocker + Playwright fallback.
- 마케팅팀: approve - 내부 playable progression이며 외부 채널/실결제 없음.
- 고객지원팀: approve - 플레이어가 다음 source target을 획득 상태로 이해한다.

## Subagent/Team Routing

Solo execute. 변경 범위가 응집되어 있고 현재 Browser Use callable이 노출되지 않아 병렬 QA 효용이 낮다.

## 플레이어 가치 또는 운영사 가치

- 플레이어: 월정 문 보상이 다음 수집 source로 실제 전환되는 것을 확인한다.
- 운영자: source promise -> acquisition -> planting으로 이어지는 후속 WorkUnit chain의 telemetry anchor를 만든다.

## 수용 기준

- `월정 문 귀환 상자 열기` 후 `월정 숲 source 확인` action이 보인다.
- action 후 `seed_moon_grove_001 source 획득` 상태가 objective/receipt/HUD에 남는다.
- telemetry: `moonGroveSourceAcquired=true`, `moonGroveSourceSeedAvailable=true`, `moonGroveSourceSeedId=seed_moon_grove_001`.
- `seed_moon_grove_001_icon`, `fx_moon_grove_source_reward_strip_v1`가 acquisition marker/reward motion에 사용된다.
- runtime image generation/API/cache 호출 없음.

## Visual evidence 계획

- Browser Use `iab` 우선 시도.
- unavailable이면 `reports/visual/issue-0536-moon-grove-source-acquisition-bridge/browser-use-blocker-20260515.md` 기록.
- Playwright fallback screenshots와 visual report를 같은 폴더에 저장.

## Playable mode 영향

Phaser playable의 월정 문 reward 후속 action이 추가된다. stable main playable command/port 계약은 유지한다.

## 안전 범위

- 실결제, 외부 배포, 고객 데이터, 실채널 GTM 변경 없음.
- planting/harvest loop는 후속 WorkUnit으로 분리한다.
- 새 raster asset generation 없음. 기존 gpt-image-2 provenance asset만 사용한다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`
