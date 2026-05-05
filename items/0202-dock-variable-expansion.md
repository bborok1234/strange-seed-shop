# WorkUnit — Dock 가변 확장 + 4 surface slot 통합 (Cycle 1 PR3 — 마지막)

## GitHub authority

- Spec: `reports/deliberation/desktop-ui-redesign/spec.md` § Implementation Sequence Phase 1 PR3
- Branch: `cycle1/0202-dock-variable-expansion`
- Status: Cycle 1 마지막 PR — desktop layout 큰 골격 완성

## Plan

`desktop-ui-redesign` Cycle 1 PR3 — rail 4탭 클릭 시 dock 영역이 가변 확장되어 해당 surface(씨앗/도감/원정/상점) 콘텐츠가 노출되도록 통합. Stage는 비례 축소 (Phaser canvas resize listener 자동 처리).

1. JSX: `desktop-shell`에 `data-dock-expanded={isDesktopLayout && isPlayerTabScreen}` 속성 추가.
2. CSS @media (min-width: 1280px) 신규 블록:
   - `.desktop-shell` grid-template-columns에 transition (motion.gesture.reveal = 420ms entrance)
   - `[data-dock-expanded="true"]` → 3-col grid에서 dock 영역 확장 (clamp(280,22vw,360) → clamp(420,35vw,560))
   - 확장 시 4 cluster (.side-dock) hidden — dev-panel이 자리를 가져감
   - dev-panel 데스크톱+확장 시 dock 영역 fill (top:0, right:0, bottom:0, width: clamp(420,35vw,560)), 기존 absolute 좌표 무효화
3. Garden tab 활성 시 (data-dock-expanded="false") dock은 default 4 cluster, dev-panel은 미렌더 (showSidePanel=false).
4. 닫기 affordance: 기존 `tab-screen-return` 버튼 ("정원 보기")이 activeTab을 "garden"으로 set → dock 자동 collapse.

## 수용 기준

- [x] 데스크톱 ≥1280px viewport에서 rail 4탭 클릭 시 dock 영역 확장 + 해당 surface 콘텐츠 노출
- [x] Garden 모드(activeTab === "garden")에서 dock = 4 cluster, dev-panel 미노출
- [x] Stage가 dock 확장 시 비례 축소 (Phaser canvas resize listener 자동)
- [x] 확장/축소 motion (`--motion-gesture-reveal` = 420ms entrance) 적용
- [x] 모바일 ≤ 480px snapshot 회귀 0
- [x] PR0.5 신규 토큰 `--motion-gesture-reveal`, `--color-surface-dock`, `--elevation-dock-raised`, `--spacing-2xl` 사용
- [x] `npm run build` 통과
- [x] PR 변경 ≤ 500줄

## 검증 명령

- `npm run build`
- `npm run check:ci`

## 리스크

- grid-template-columns transition은 modern browser에서만 부드럽게 작동 (Safari, Chrome, Firefox 최신은 지원). 구형 webview에서는 step transition이 될 수 있으나 시각 noise 수준.
- dock 확장 시 stage 폭이 col-span-7(58%) → col-span-5(약 41%)로 축소 — Phaser scene 내부 anchor가 mobile portrait 가정으로 hardcoded면 plot 1개가 좌상단에 더 작게 박힐 수 있음 (spec § Risks 첫 항목 + § Open Questions Q4 — `garden-scene-anchor-adjustment` follow-up axis).
- Active tween budget: dock 확장 motion + Phaser scene resize + GardenScene 내부 tween 동시 발화 시 frame jank 가능. 기존 plot tap scale-pulse(#386)와 충돌 위험은 PR3 작업 범위 외.

## 후속 axis (Cycle 1 종료 후)

spec § Implementation Sequence "후속 axis" 7종 모두 별도 axis로 분리:
1. `garden-scene-anchor-adjustment` — Phaser plot grid anchor viewport-비례 적응 (★ brief 70% empty 완전 해소)
2. `desktop-token-migration`
3. `desktop-motion-vocabulary-remap`
4. `desktop-session-telemetry`
5. `desktop-drawer-revisit`
6. `garden-stagehero-phaser-migration`
7. `option-c-in-canvas-spike`

`mission-ux-visibility` Cycle 1 implementation은 본 PR3 머지 직후 진입 가능 (Cycle 1 PR2 = SideDock 머지 후 의존성 만족).

## Subagent/Team Routing

- 단독 PR. Cycle 1 종료 → 사용자 review + 후속 axis 결정.
