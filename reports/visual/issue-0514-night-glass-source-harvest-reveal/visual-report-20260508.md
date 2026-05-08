# 밤유리 source harvest reveal visual report

## 요약

- WorkUnit: `items/0273-night-glass-source-harvest-reveal.md`
- Issue: #514
- Branch: `codex/v1-night-glass-source-harvest-reveal`
- 검증 경로: Browser Use 우선 시도 실패 기록 + Playwright fallback

## 증거

- `npm run build:phaser`: 통과
- `npm run check:phaser`: 통과
- Ready 스크린샷: `reports/visual/issue-0514-night-glass-source-harvest-reveal/phaser-check-night-glass-ready-393.png`
- Reveal 스크린샷: `reports/visual/issue-0514-night-glass-source-harvest-reveal/phaser-check-night-glass-revealed-393.png`
- Browser Use blocker: `reports/visual/issue-0514-night-glass-source-harvest-reveal/browser-use-blocker-20260508.md`

## 관찰

- `밤유리 심기` 이후 `돌보기` 반복으로 `seed_rare_001` plot이 ready가 되고 action rail에 `밤유리 수확`이 노출된다.
- 수확 후 objective는 `밤유리 오로 발견 · 밤유리 rare route 완성`으로 전환된다.
- 화면 오른쪽 playfield에는 accepted `creature_lunar_rare_001` 기반 `밤유리 오로 발견` marker가 보이며, 기존 `fx_night_glass_source_unlock_strip_v1` aura가 reveal payoff로 재사용된다.
- HUD surface는 `밤유리 오로 발견 · creature_lunar_rare_001`을 표시하고, action note도 `밤유리 오로 발견`으로 정리된다.
- telemetry는 `nightGlassSourceSeedPlanted=false`, `nightGlassSourceSeedHarvested=true`, `nightGlassRareCreatureRevealed=true`, `nightGlassRareCreatureId=creature_lunar_rare_001`, `nightGlassRareCreatureName=밤유리 오로`를 남긴다.
- final plot states는 `plot_01`, `plot_02`, `plot_03` 모두 empty로 돌아가며 `seed_rare_001` planted plot이 남지 않는다.

## 리스크

- 하단 action surface가 장기 progression receipt와 goal surface를 많이 담아 밀도가 높다. 이번 slice는 harvest/reveal payoff를 닫는 범위이며, dedicated reveal FX 또는 HUD density pass는 후속 WorkUnit에서 분리하는 편이 낫다.
