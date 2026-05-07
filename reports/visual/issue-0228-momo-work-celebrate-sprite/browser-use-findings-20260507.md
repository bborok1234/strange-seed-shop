# Browser Use Findings — Issue 0228

- Date: 2026-05-07
- Tool: Browser Use `iab`
- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`
- Celebrate URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1&qaMomoCelebrate=1`

## Evidence

- Before/current baseline from deliberation: `reports/deliberation/momo-work-celebrate-sprite/browser-use-current-garden-20260507.png`
- After work loaded: `reports/visual/issue-0228-momo-work-celebrate-sprite/browser-use-after-momo-work-loaded-20260507.png`
- After celebrate loaded: `reports/visual/issue-0228-momo-work-celebrate-sprite/browser-use-after-momo-celebrate-loaded-20260507.png`

## Findings

- 모모는 정원 playfield 오른쪽 support actor로 보이며, 원형 portrait/card decoration이 아니라 별도 work actor로 읽힌다.
- `qaMomoCelebrate=1` 상태에서 모모는 work pose보다 큰 celebrate frame으로 보이고, production claim receipt와 동시에 화면에 남는다.
- 모모 actor는 plot label, resource HUD, bottom tabs를 가리지 않는다. 오른쪽 shelf에 가까운 배치라 후속 workstage composition에서는 plot/order crate와 더 자연스러운 anchor를 다듬을 여지가 있다.
