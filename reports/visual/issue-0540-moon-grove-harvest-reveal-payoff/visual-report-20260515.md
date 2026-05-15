# 월정 숲 source harvest/reveal payoff visual report

- Date: 2026-05-15
- Issue: #540
- WorkUnit: `items/0286-moon-grove-harvest-reveal-payoff.md`
- Browser Use: unavailable in this session; blocker recorded at `browser-use-blocker-20260515.md`
- Fallback: `npm run check:phaser`

## Evidence

| Moment | Screenshot | Observation |
| --- | --- | --- |
| Ready action | `phaser-check-moon-grove-ready-393.png` | `월정 숲 수확 준비` objective, `월정 숲 수확` CTA, `seed_moon_grove_001 재배 중 · plot_01` state가 보인다. |
| Harvest reveal | `phaser-check-moon-grove-harvested-393.png` | 잎 `459`, `월정 숲 발견`, `월정 숲 새벽이끼 · discovery_moon_grove_001 · 다음 온실 숲길 preview`가 HUD에 남는다. |
| Overview | `phaser-check-moon-fence-source-overview-393.png` | overview mode에서 action rail은 접히고, playfield에는 월정 문/source 경로와 harvested 후 빈 plot 상태가 유지된다. |

## Automated assertions

- `moonGroveSourceSeedPlanted=false`
- `moonGroveSourceSeedHarvested=true`
- `moonGroveDiscoveryRevealed=true`
- `moonGroveDiscoveryId=discovery_moon_grove_001`
- `moonGroveDiscoveryName=월정 숲 새벽이끼`
- `moonGroveNextPreviewVisible=true`
- `lastFxKind=moonGroveSource`
- `lastFxKey=fx_moon_grove_source_reward_strip_v1`
- `seed_moon_grove_001` plot cleared after harvest

## Result

`npm run check:phaser` passed. No runtime image generation/API/cache path was added.
