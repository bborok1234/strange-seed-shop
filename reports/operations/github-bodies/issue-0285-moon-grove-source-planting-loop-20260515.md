# 월정 숲 source planting loop

## 문제 / 배경

#536/#537은 `clue_moon_grove_001` promise를 `월정 숲 source 확인` player verb와 `seed_moon_grove_001 source 획득` state로 닫았다. 그러나 source 획득 후 빈 밭에서 실제 `seed_moon_grove_001` planting action이 없어 플레이어가 다음 재배 루프를 시작할 수 없다.

## 목표

`seed_moon_grove_001 source`를 빈 밭 planting loop로 연결한다. 이번 slice는 harvest/reveal이 아니라 source availability 소비, planted plot state, source icon marker, deterministic checker evidence까지만 닫는다.

## Small win

월정 숲 source를 획득한 직후 빈 밭에서 `월정 숲 심기`를 눌러 실제 plot에 심을 수 있다.

## Campaign source of truth

- `docs/GAME_BIBLE.md`
- `docs/GAME_PRODUCTION_SPEC.md`
- `docs/phaser/REBOOT_FOUNDATION_SPEC.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `docs/ROADMAP.md`

## Game Studio Department Signoff

| 부서 | 판정 | 근거 |
| --- | --- | --- |
| 기획팀 | approve | acquisition reward를 다음 planting verb로 연결한다. |
| 리서치팀 | approve | 장기 reward가 inventory receipt에 갇히는 production gap을 plot state로 해소한다. |
| 아트팀 | approve | accepted `seed_moon_grove_001_icon`을 planted marker로 재사용하고 새 asset은 만들지 않는다. |
| 개발팀 | approve | Phaser state/action/render/checker 범위로 제한한다. |
| 검수팀 | approve | Browser Use 우선, unavailable 시 current blocker + Playwright evidence를 남긴다. |
| 마케팅팀 | approve | 내부 mock playable progression이며 외부 채널/실결제/광고 없음. |
| 고객지원팀 | approve | source 획득 후 다음 행동이 빈 밭 planting임을 명확히 한다. |

## Subagent/Team Routing

Solo execute. 이전 `밤유리 source planting loop`와 `초승달순 source planting loop` 패턴을 재사용하는 좁은 Phaser slice다.

## 플레이어 가치

월정 문 장기 보상이 실제 재배 시작으로 이어져 “받았다 -> 심었다 -> 다음에 무엇이 나올까?”의 수집 기대를 만든다.

## 수용 기준

- `월정 숲 source 확인` 후 빈 밭 선택 시 `월정 숲 심기` action이 보인다.
- action 후 objective/receipt에 `seed_moon_grove_001` planting 상태가 남는다.
- `moonGroveSourceSeedAvailable=false`, `moonGroveSourceSeedPlanted=true`, planted plot `seedId=seed_moon_grove_001` telemetry가 검증된다.
- planted plot에 `seed_moon_grove_001_icon` marker가 보인다.
- runtime image generation/API/cache 호출 없음.

## Visual evidence 계획

- Browser Use `iab` 우선 시도.
- unavailable이면 `reports/visual/issue-0538-moon-grove-source-planting-loop/browser-use-blocker-20260515.md` 기록.
- Playwright fallback screenshot:
  - source acquired before planting
  - moon grove planted plot
  - overview after planting

## Playable mode 영향

- Stable main playable worktree는 변경하지 않는다.
- Feature branch Phaser checker와 PR screenshots로 검증한다.

## 안전 범위

- 새 asset 생성 없음.
- Runtime image generation/API/cache 호출 없음.
- harvest/reveal은 후속 WorkUnit으로 분리한다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`
