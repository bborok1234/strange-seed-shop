# 밤유리 source planting loop

## 문제 / 배경

#510/#511로 `seed_rare_001 source 획득`까지 열렸지만, 획득한 source가 아직 빈 밭 planting loop로 이어지지 않는다. rare source가 receipt로만 끝나면 플레이어는 다음 행동을 잃는다.

## 목표

`seed_rare_001 source 획득` 후 빈 밭에 `밤유리 심기` action을 열고, 심기 후 rare source plot state를 화면과 telemetry에 남긴다.

## Small win

밤유리 보상이 inventory promise가 아니라 실제 재배 시작으로 이어진다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- WorkUnit: `items/0272-night-glass-source-planting-loop.md`

## Game Studio Department Signoff

| 부서 | 판정 | 산출물 |
| --- | --- | --- |
| 기획팀 | approve | player verb: `밤유리 심기` |
| 리서치팀 | approve | rare source 보상 다음 재배 loop production gap |
| 아트팀 | approve | `seed_rare_001_icon` plot overlay/chip binding |
| 개발팀 | approve | Phaser state/action/render/checker 범위 |
| 검수팀 | approve | Browser Use 우선, unavailable 시 Playwright fallback |
| 마케팅팀 | approve | mock/internal progression only |
| 고객지원팀 | approve | source 사용처를 빈 밭 action으로 설명 |

## Subagent/Team Routing

Solo execute. 상태/렌더/검증 변경이 한 slice에 묶여 있어 병렬화 이점이 낮다.

## 플레이어 가치

rare source 획득 후 “이걸 어디에 쓰지?”가 사라지고, 바로 다음 재배 목표가 생긴다.

## 수용 기준

- `밤유리 심기` action이 빈 밭에서 보인다.
- 심기 후 `seed_rare_001` plot telemetry와 `nightGlassSourceSeedPlanted=true`가 남는다.
- plot에 `seed_rare_001_icon` overlay 또는 rare chip이 보인다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check` 통과.

## Visual evidence 계획

- Browser Use `iab` 우선 시도.
- unavailable이면 blocker report와 Playwright fallback screenshots 저장.

## Playable mode 영향

Phaser playable route만 확장하며 외부 API/결제/광고/배포는 추가하지 않는다.

## 안전 범위

- 새 accepted manifest asset 없음.
- 기존 gpt-image-2 provenance `seed_rare_001_icon`만 runtime binding 재사용.
- harvest/reveal은 후속 issue로 분리.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
