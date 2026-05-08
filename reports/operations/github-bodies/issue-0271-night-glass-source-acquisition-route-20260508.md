# 밤유리 source acquisition route bridge

## 문제 / 배경

#508/#509로 `밤유리 source 보기` preview는 dedicated rare source icon/FX까지 도달했다. 그러나 playable은 아직 `expedition_night_glass 잠김` promise에서 멈추며, rare seed source가 research/expedition gameplay로 획득된다는 v1 계약까지 이어지지 않는다.

경쟁작 production gap은 rare route가 preview 카드에 머물면 장기 목표가 실제 progression이 아니라 teaser로 읽힌다는 점이다.

## 목표

`밤유리 source 보기` 이후 `밤유리 온실 조사`를 보내고, 귀환/claim을 통해 `seed_rare_001` source 획득 상태를 남긴다.

## Small win

플레이어가 밤유리 route를 잠긴 힌트가 아니라 “보내기 -> 귀환 -> source 획득”으로 이해한다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- WorkUnit: `items/0271-night-glass-source-acquisition-route.md`

## Game Studio Department Signoff

| 부서 | 판정 | 산출물 |
| --- | --- | --- |
| 기획팀 | approve | player verb: `밤유리 조사 보내기`, `귀환 상자 열기`, `source 획득` |
| 리서치팀 | approve | rare route preview 다음 획득 route가 필요한 경쟁작 production gap |
| 아트팀 | approve | `seed_rare_001_icon` + `fx_night_glass_source_unlock_strip_v1` acquire binding |
| 개발팀 | approve | Phaser state/action/render/checker 범위 |
| 검수팀 | approve | Browser Use 우선, unavailable 시 blocker + Playwright fallback |
| 마케팅팀 | approve | mock/internal progression only |
| 고객지원팀 | approve | 다음 행동과 source 의미를 HUD/receipt로 설명 |

## Subagent/Team Routing

Solo execute. 변경 범위가 Phaser state/action/render/checker로 좁고 병렬 분리 이점보다 통합 검증이 중요하다.

## 플레이어 가치

`밤유리 source`가 placeholder가 아니라 D30 rare route의 첫 획득 loop처럼 보인다.

## 수용 기준

- `밤유리 source 보기` 후 route start action이 보인다.
- route start/return/acquire 상태가 objective, action rail, playfield marker, receipt에 반영된다.
- source 획득 순간 `seed_rare_001_icon`과 `fx_night_glass_source_unlock_strip_v1` 기반 reward motion이 보인다.
- runtime image generation/API/cache 호출 없음.
- `npm run check:phaser`, `npm run check:content`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check` 통과.

## Visual evidence 계획

- Browser Use `iab` 우선 시도.
- callable이 없으면 `reports/visual/issue-0510-night-glass-source-acquisition-route/browser-use-blocker-20260508.md` 기록.
- Playwright fallback screenshots와 `visual-report-20260508.md` 저장.

## Playable mode 영향

main playable route가 더 길어지며 별도 서버/외부 API는 추가하지 않는다.

## 안전 범위

- 실제 결제, 광고, 배포, 고객 데이터 없음.
- 새 runtime image generation 없음.
- 새 manifest asset 생성 없음. 기존 accepted raster asset을 새 gameplay binding으로 사용한다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
