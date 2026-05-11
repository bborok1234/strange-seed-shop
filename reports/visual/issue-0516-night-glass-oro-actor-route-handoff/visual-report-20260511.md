# 밤유리 오로 actor route handoff visual report

## 요약

- WorkUnit: `items/0274-night-glass-oro-actor-route-handoff.md`
- Issue: #516
- Branch: `codex/v1-night-glass-oro-actor-route-handoff`
- 검증 경로: Browser Use 우선 시도 실패 기록 + Playwright fallback

## 증거

- `npm run build:phaser`: 통과
- `npm run check:phaser`: 통과
- Reveal screenshot: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/phaser-check-night-glass-revealed-393.png`
- Actor handoff screenshot: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/phaser-check-night-glass-oro-handoff-393.png`
- Browser Use blocker: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/browser-use-blocker-20260511.md`

## 관찰

- `밤유리 수확` 이후 objective는 `밤유리 오로 발견 · 오로 합류 · 월정 문 preview`로 전환된다.
- playfield 오른쪽에는 accepted `creature_lunar_rare_001` 기반 `밤유리 오로` actor marker가 남고, 기존 night-glass FX aura가 actor join pulse로 보인다.
- HUD surface는 `밤유리 오로 합류 · creature_lunar_rare_001 · expedition_moon_fence_locked`와 `expedition_moon_fence_locked preview · 월정 문 단서`를 표시한다.
- telemetry는 `actorIds`에 `actor_oro`, `nightGlassOroActorJoined=true`, `nightGlassOroRouteHandoffVisible=true`, `nextRareRoutePreviewId=expedition_moon_fence_locked`를 남긴다.
- final plot states는 `plot_01`, `plot_02`, `plot_03` 모두 empty로 돌아가며 `seed_rare_001` planted plot이 남지 않는다.

## 리스크

- 하단 action surface가 장기 progression receipt와 goal surface를 많이 담아 밀도가 높다. 이번 slice는 actor/route handoff를 닫는 범위이며, HUD density pass 또는 dedicated `actor_oro_explorer_strip_v1` asset batch는 후속 WorkUnit에서 분리하는 편이 낫다.
