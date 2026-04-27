# Phase 0 Economy Design: 이상한 씨앗상회

## 1. Economy Goal

Phase 0 economy exists to validate pacing, not revenue. The player should feel progress every session, but the first day should not exhaust the content.

The target rhythm:

- First reward: under 90 seconds
- First upgrade: under 5 minutes
- First expedition: under 10 minutes
- First comeback reward: meaningful after 15-60 minutes
- First content wall: no earlier than 25-35 minutes of active play

## 2. Currencies

### Leaves

Main soft currency.

Sources:

- Harvest
- Offline rewards
- Expedition rewards
- Album milestones
- Tutorial missions

Sinks:

- Seed purchase
- Plot upgrade
- Merge fee
- Tap power upgrade

### Pollen

Upgrade and milestone currency.

Sources:

- Rare harvest chance
- Album milestones
- Expedition rewards

Sinks:

- Research preview upgrades
- Offline cap upgrade
- Permanent family bonus preview

### Materials

Decor and expedition currency.

Sources:

- Expedition rewards

Sinks:

- Decor preview crafting

### Crystals

Premium placeholder only. No real purchase in Phase 0.

Sources:

- Tutorial grant
- Shop mock preview

Sinks:

- Mock speedup preview
- Mock decor bundle preview

## 3. Seed Families

| Family | Theme | Gameplay Role | Visual Direction |
| --- | --- | --- | --- |
| Herb | basic greenhouse plants | fast growth, low variance | leafy, round, friendly |
| Candy | sweet mutated crops | medium growth, better leaves | glossy, colorful, playful |
| Lunar | moonlit strange seeds | slow growth, pollen chance | pale glow, crescent shapes |

## 4. Seed Table

| ID | Name | Family | Unlock | Cost Leaves | Base Growth | Tap Value | Base Harvest Leaves | Creature Pool |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| seed_herb_001 | 말랑잎 씨앗 | Herb | start | 0 | 30s | -3s | 10 | herb_common_001/002 |
| seed_herb_002 | 방울새싹 씨앗 | Herb | album 1 | 25 | 60s | -4s | 24 | herb_common_003, herb_uncommon_001 |
| seed_herb_003 | 꼬불덩굴 씨앗 | Herb | plot level 2 | 80 | 3m | -6s | 70 | herb_common_004, herb_rare_001 |
| seed_herb_004 | 왕잎주머니 씨앗 | Herb | garden level 3 | 220 | 8m | -10s | 190 | herb_uncommon_002, herb_rare_002 |
| seed_candy_001 | 젤리콩 씨앗 | Candy | garden level 2 | 60 | 2m | -5s | 58 | candy_common_001/002 |
| seed_candy_002 | 솜사탕순 씨앗 | Candy | album 3 | 140 | 5m | -8s | 135 | candy_common_003, candy_uncommon_001 |
| seed_candy_003 | 캬라멜뿌리 씨앗 | Candy | plot level 3 | 360 | 12m | -12s | 330 | candy_uncommon_002, candy_rare_001 |
| seed_candy_004 | 설탕혜성 씨앗 | Candy | expedition tutorial | 720 | 25m | -18s | 690 | candy_rare_002, candy_epic_001 |
| seed_lunar_001 | 달방울 씨앗 | Lunar | garden level 4 | 300 | 10m | -10s | 260 | lunar_common_001/002 |
| seed_lunar_002 | 은빛이끼 씨앗 | Lunar | album 5 | 650 | 22m | -16s | 570 | lunar_uncommon_001, lunar_rare_001 |
| seed_lunar_003 | 초승달순 씨앗 | Lunar | first comeback | 1200 | 45m | -24s | 1100 | lunar_rare_002, lunar_epic_001 |
| seed_lunar_004 | 밤유리 씨앗 | Lunar | Phase 0 late | 2400 | 90m | -36s | 2300 | lunar_epic_002 |

## 5. Creature Table

Phase 0 starts with 24 creature records. Variants can share mechanics but must have distinct assets and album entries.

| Role | Count | Function |
| --- | ---: | --- |
| Gatherer | 8 | expedition leaf bonus |
| Alchemist | 5 | pollen bonus |
| Guardian | 4 | offline cap/efficiency bonus |
| Merchant | 4 | seed discount or shop flavor |
| Mascot | 3 | cosmetic/status only |

Rarity weights by seed tier:

| Seed Tier | Common | Uncommon | Rare | Epic |
| --- | ---: | ---: | ---: | ---: |
| starter/basic | 85% | 15% | 0% | 0% |
| early | 70% | 25% | 5% | 0% |
| mid | 50% | 35% | 14% | 1% |
| late | 35% | 40% | 22% | 3% |

No paid random acquisition exists in Phase 0.

## 6. Upgrade Cost Curves

### Plot Upgrade

Formula:

```text
cost(level) = round(30 * level^2.15)
effect = +1 plot every selected milestone
```

Phase 0 plot unlock targets:

| Plot Count | Target Time | Approx Cost |
| ---: | --- | ---: |
| 2 | 3-5 min | 40 |
| 3 | 8-12 min | 130 |
| 4 | 20-30 min | 420 |
| 5 | 45-60 min | 1000 |
| 6+ | late Phase 0 | tuning gate |

### Tap Power

Formula:

```text
tap_seconds_removed = base_tap_value * (1 + tap_level * 0.12)
cost(level) = round(20 * level^1.8)
```

Purpose:

- Make active play feel better.
- Avoid turning tapping into required labor.

### Merge

Merge rule:

```text
3 duplicates + leaves fee -> next star level of same creature
```

Merge fee:

```text
fee = 25 * rarity_multiplier * current_star
```

Rarity multipliers:

- Common: 1
- Uncommon: 2.5
- Rare: 6
- Epic: 15

## 7. Offline Reward Formula

Offline reward is based on expected passive garden output, not exact simulated taps.

```text
offline_seconds = min(now - last_seen_at, offline_cap_seconds)
base_rate = sum(active_plot_expected_leaf_per_second)
guardian_bonus = 1 + sum(guardian_bonus_percent)
offline_efficiency = 0.35 in Phase 0
offline_leaves = floor(offline_seconds * base_rate * offline_efficiency * guardian_bonus)
```

Caps:

- Phase 0 default cap: 4 hours
- Phase 0 experimental cap: 8 hours

Comeback thresholds:

| Away Time | UX |
| --- | --- |
| < 5 min | no modal, inline reward |
| 5-15 min | compact reward toast |
| 15+ min | full comeback modal |
| cap reached | show cap reached state and upgrade preview |

## 8. Expedition Economy

Phase 0 has one expedition zone: `뒷마당 틈새길`.

| Mission | Duration | Required Creatures | Reward |
| --- | ---: | ---: | --- |
| quick_scout | 5m | 1 | 35 leaves, 10% pollen |
| tidy_route | 15m | 1 | 120 leaves, 1 material |
| moon_hint | 60m | 2 | 420 leaves, 2 materials, 35% pollen |

Reward formula:

```text
reward = base_reward * (1 + role_bonus + star_bonus)
star_bonus = total_assigned_stars * 0.03
```

## 9. Missions

Tutorial missions:

1. Plant first seed
2. Harvest first creature
3. Claim album reward
4. Buy first upgrade
5. Plant two seeds
6. Start expedition
7. Return and claim offline reward

Daily mission pool:

- Harvest 5 creatures
- Buy 3 seeds
- Upgrade plot 1 time
- Tap growth 25 times
- Start 1 expedition
- Claim album or mission reward

## 10. Phase 0 Simulation Targets

| Time Horizon | Expected State |
| --- | --- |
| 1 hour active-equivalent | 4-5 plots, 6-8 creatures discovered, first expedition loop done |
| D1 casual | 5-6 plots, 9-12 creatures discovered, Candy family unlocked |
| D3 casual | most Phase 0 seeds unlocked except late Lunar, 15+ creatures discovered |
| D7 casual | Phase 0 content mostly exhausted, ready for Phase 1 content expansion |

## 11. Tuning Levers

Use these before adding new systems:

- Seed growth time
- Base harvest leaves
- Plot upgrade cost exponent
- Offline efficiency
- Offline cap
- Album milestone rewards
- Expedition duration/reward
- Duplicate merge cost
- Rare creature weight

## 12. Balance Warnings

- If tapping is too strong, idle players feel punished.
- If offline efficiency is too high, active sessions become claim-only.
- If duplicate merge is too expensive, collection feels like clutter.
- If first Lunar unlock is too slow, the third family becomes invisible.
- If shop mock appears before first ownership, it will feel extractive.

## 13. Economy Acceptance Criteria

- Baseline player reaches second plot under 5 minutes.
- Baseline player reaches first expedition under 10 minutes.
- 15-minute offline reward buys at least one useful action.
- 8-hour cap reward does not skip more than one major unlock tier.
- Paid/convenience mock benefits never imply more than 1.5x core progression speed.
- Every currency has at least one visible source and one visible sink in Phase 0, except Crystals which are mock-only.
