# WorkUnit — .garden-panel cream-rectangle 폐기 + alpha-aware 전환 (Cycle A PR2)

## GitHub authority

- Spec: `reports/deliberation/stage-art-first-restructure/spec.md` § Implementation Sequence Cycle A PR2 + § Decisions §1·§2
- Branch: `cycle-a/0205-garden-panel-art-aware`
- Status: 가장 큰 시각 변화 — Cycle 1의 cream rectangle 패러다임 회귀 핵심

## Plan

`stage-art-first-restructure` Cycle A PR2 — 데스크톱 viewport (≥1280px)에서 stage 안 React panel cream 점유율을 ~80% → ~22%로 감소시켜 brief의 사용자 critique "정원 의미 퇴색 / UI/패널로 다 뭉갬"을 직접 해결.

1. CSS @media (min-width: 1280px):
   - `.garden-panel` 절대 좌표 패러다임 폐기 (top:122/bottom:78/left/right:--space-4 → top:88, 중앙 정렬, width clamp(320,32vw,480), height auto + max-height clamp(280,45vh,420))
   - `.garden-panel` background/border/box-shadow/backdrop-filter 모두 제거 → art가 비쳐 보임
   - `.garden-panel` grid-template-rows: 1fr (starter-panel hidden되므로 single row)
   - `.starter-panel`, `.garden-action-surface` desktop hide (dock의 next-action card가 정보 흡수)
   - debug-shell 모드는 starter-panel 다시 노출 (디버그 surface 검증 도구)

## 수용 기준

- [x] art-share-gate `stage cream panel ratio ≤ 0.25` 3 viewport 모두 PASS (이전 fail → 회복)
- [x] art-share-gate `dock background contrast` 3 viewport PASS 유지 (PR1 효과)
- [x] art-share-gate `rail button height ≤ 44` 3 viewport 여전히 FAIL (PR4 대기, 정상)
- [x] `npm run build` 통과
- [x] 모바일 ≤ 480px snapshot 회귀 0 (모든 변경이 desktop @media 안)
- [x] PR 변경 ≤ 50줄

## 검증 명령

- `npm run build`
- `npm run check:art-share` 로컬: stage cream 3 PASS / dock contrast 3 PASS / rail height 3 FAIL (정상)

## 리스크

- starter-panel desktop hide → 첫 세션 player가 "다음 행동 / 첫 씨앗을 고르세요" 영역을 stage 안에서 못 봄. dock의 next-action card에 정보가 있으나 dock 자체 visibility는 PR1으로 회복됨. 첫 세션 onboarding이 dock chip의 spike state(spec § Decisions §4 Cycle 1) + Cycle B의 L1 in-canvas diegetic UI(binding promise spec § Decisions §7)에서 본격 회복.
- garden-panel이 작은 floating card로 변경됨 → plot 카드 1개일 때 무대 중앙 위쪽에 떠 있는 형태. plot 9칸이 잠금 해제되면 garden-panel max-height(420px)가 부족할 수 있음 — 후속 axis `garden-scene-anchor-adjustment`에서 plot grid 자체를 viewport 비례 적응.
- shop_surfaces.json의 starter helper "두 번째 밭 열기 25잎" 버튼이 starter-panel 안에 있었음. desktop hide로 첫 업그레이드 진입점 상실 — Cycle B 또는 별도 polish PR에서 dock 또는 garden-panel 안에 복원 검토.

## Subagent/Team Routing

- 단독 PR. 다음 PR3 (Phaser canvas transparent + L0 art-plate composite).
