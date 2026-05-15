## 문제 / 배경

#538/#539는 `월정 숲 source 확인` 이후 `월정 숲 심기`까지 연결했다. 하지만 `seed_moon_grove_001`은 planted growth `26`에서 멈추며 수확/reveal payoff와 다음 장기 메타 힌트가 없다.

## 목표

`seed_moon_grove_001`을 care -> ready -> `월정 숲 수확` -> `월정 숲 발견` HUD surface -> 다음 온실/숲길 preview로 연결한다.

## Small win

플레이어가 월정 문 첫 보상을 실제로 키우고 수확해 다음 발견을 봤다고 느낀다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/GAME_BIBLE.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `items/0286-moon-grove-harvest-reveal-payoff.md`

## Game Studio Department Signoff

- 기획팀: `월정 숲 수확` player verb와 다음 preview를 정의한다.
- 리서치팀: rare reward가 planting에서 멈추는 competition production gap을 해소한다.
- 아트팀: 새 raster asset은 만들지 않고 accepted source FX를 harvest reward motion으로 재바인딩한다. dedicated creature asset은 후속 WorkUnit으로 분리한다.
- 개발팀: Phaser state/action/HUD/checker만 건드린다.
- 검수팀: Browser Use 우선, unavailable 시 blocker + Playwright fallback screenshot evidence.
- 마케팅팀: 외부 채널/실결제/광고 없음.
- 고객지원팀: 수확 후 다음 목표가 한 줄로 보이게 한다.

## Subagent/Team Routing

Solo execute. 변경 범위가 직전 source planting slice의 후속 state/action/render/checker로 좁고, 독립 write scope가 없다.

## 플레이어 가치

월정 문 보상이 receipt나 inventory promise가 아니라 실제 재배-수확-발견 loop로 닫힌다.

## 수용 기준

- `월정 숲 심기` 후 care action으로 ready state가 되고 `월정 숲 수확` action이 보인다.
- 수확 후 plot이 비워지고 `moonGroveSourceSeedHarvested=true`, `moonGroveDiscoveryRevealed=true` telemetry가 남는다.
- HUD에 `월정 숲 발견` surface와 다음 온실/숲길 preview가 보인다.
- `fx_moon_grove_source_reward_strip_v1` reward motion binding이 수확 순간에 사용된다.
- runtime image generation/API/cache 호출 없음.

## Visual evidence 계획

- Browser Use `iab`를 먼저 시도한다.
- unavailable이면 `reports/visual/issue-0540-moon-grove-harvest-reveal-payoff/browser-use-blocker-20260515.md`를 남긴다.
- Playwright fallback screenshot:
  - ready/action
  - harvested/reveal
  - overview/next preview

## Playable mode 영향

Phaser playable main loop의 월정 문 후속 source progression만 확장한다. legacy React playable은 건드리지 않는다.

## 안전 범위

로컬 game state/HUD/checker 변경만 수행한다. 결제, 광고, 고객 데이터, 외부 배포, runtime image generation은 포함하지 않는다.

## 검증 명령

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`
- `git diff --check`
