# WorkUnit — Phaser canvas transparent + art-plate composite (Cycle A PR3)

## GitHub authority

- Spec: `reports/deliberation/stage-art-first-restructure/spec.md` § Implementation Sequence Cycle A PR3 + § Decisions §1
- Branch: `cycle-a/0206-phaser-canvas-transparent`
- Status: Phaser scene mechanic 변경 0 — host config 1줄

## Plan

`stage-art-first-restructure` Cycle A PR3 — Phaser canvas의 cream fill 배경을 transparent로 전환하여 garden-stage의 backgroundImage(L0 art-plate, 햇살 온실 일러스트)가 Phaser canvas 영역에서도 비쳐 보이게 한다.

1. `src/game/playfield/GardenPlayfieldHost.tsx`:
   - Phaser config `transparent: false` → `transparent: true`
   - `backgroundColor: "#fff1c4"`는 transparent 모드에서 의미 없음 (주석 추가)
2. Phaser scene 내부 mechanic 변경 0 (scene이 자체 background fill 안 함, 검증됨).

## 수용 기준

- [x] `npm run build` 통과
- [x] art-share-gate 측정값 변화 없음 (구조적 변경 안 함, PR2 결과 유지)
- [x] Phaser scene 내부 mechanic invariant 보존
- [x] 모바일 ≤ 480px snapshot 회귀 0 (Phaser canvas alpha는 모바일에서도 동일 적용 — Safari/Chrome 둘 다 alpha 지원)
- [x] PR 변경 ≤ 10줄

## 검증 명령

- `npm run build`
- `npm run check:art-share` (art-share-gate 측정값은 변화 없음 — visual 효과는 PR5 사용자 evidence에서 검증)

## 리스크

- **mobile WebView Safari iOS Phaser canvas alpha 호환성**: spec § Open Questions Q2. iOS Safari 일부 버전에서 transparent canvas의 alpha rendering이 정합 안 될 가능성. PR5 사용자 검증 단계에서 모바일 디바이스 확인 필요.
- 기존 cream fill이 사용자에게 익숙한 visual cue였을 수 있음 — 이제 art가 비쳐서 더 정원답지만 plot card visibility가 약간 줄어들 수 있음. plot card 자체 cream 배경(`.playfield-plot-card`)은 그대로 유지되므로 인지 가능.

## Subagent/Team Routing

- 단독 PR. 다음 PR4 (rail button 축소 + brand cluster 흡수, art-share-gate 마지막 fail 항목 해소).
