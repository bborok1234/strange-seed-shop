# WorkUnit — Garden playfield plot tap에 group container scale-pulse micro-animation을 추가한다

## GitHub authority

- GitHub issue: #386 https://github.com/bborok1234/strange-seed-shop/issues/386
- Branch: `codex/0196-plot-tap-bounce`
- Status: plan-first

## Plan

1. `GardenScene.drawPlot` 안의 hitZone pointerdown handler 직전 또는 직후에 plot group container scale tween 추가.
2. `plot.state === "growing"` 또는 `"ready"`일 때만 tween 발화 (empty/locked는 motion 없음).
3. Tween: `targets: group, scale: 1.04, yoyo: true, duration: 160, ease: "Sine.easeOut"`.
4. 기존 emitPlotAction → playProceduralFeedback flow는 유지.
5. `npm run build` 통과.

## 수용 기준

- [ ] growing plot tap 시 plot 컨테이너 scale-pulse.
- [ ] ready plot tap 시 plot 컨테이너 scale-pulse.
- [ ] empty plot tap에는 scale-pulse 없음.
- [ ] 기존 FX/floating text와 충돌 없음.

## 검증 명령

- `npm run build`
- mirror gates 5개

## 리스크

- group이 매 render 재생성 — tween이 destroyed target을 참조할 가능성. Phaser tween은 target destroy 시 안전하게 정리됨.
- 빠른 연속 tap에서 tween이 누적되면 visual stutter — 무시 가능 (yoyo 단일 cycle).

## Game Studio route

- visible gameplay (Garden playfield 탭 핵심 verb) — Browser Use iab attempt or blocker.

## Subagent/Team Routing

- 기본 solo execution.
