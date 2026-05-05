# WorkUnit — SideDock 4 cluster (Cycle 1 PR2)

## GitHub authority

- Spec: `reports/deliberation/desktop-ui-redesign/spec.md` § Implementation Sequence Phase 1 PR2 + § Decisions §4
- Branch: `cycle1/0201-sidedock-4-cluster`
- Status: 데스크톱 dock region 시각 도입

## Plan

`desktop-ui-redesign` Cycle 1 PR2 — 데스크톱 viewport (≥1280px) dock region에 자원·다음행동·active expedition·album mini 4 cluster를 vertical stack으로 노출.

1. JSX: `<aside className="side-dock">` 신설 (isDesktopLayout && save 조건). 4 article로 cluster 구성:
   - 자원 cluster (잎/꽃가루/재료) — top-bar의 currency-cluster를 dock으로 이전
   - 다음 행동 chip — top-bar의 objective-chip을 dock으로 이전
   - 진행 중 원정 (`save.activeExpedition` 있을 때만) — 잔여시간 + 회수 가능 상태
   - 도감 진행 (X/Y) — album mini
2. CSS @media (min-width: 1280px) 업데이트:
   - desktop-shell 그리드: 2-col → **3-col** (rail / stage / dock)
   - .side-dock styling: vertical stack + dock background + dock-raised cards
   - top-bar의 currency-cluster·objective-chip은 desktop에서 `display: none` (dock 중복 제거)
3. PR0.5 토큰 사용처: `--color-surface-dock`, `--radius-panel-desktop`, `--elevation-dock-raised`, `--spacing-2xl`.

## 수용 기준

- [x] 데스크톱에서 우측 dock에 4 cluster 노출
- [x] 데스크톱 top-bar에서 currency·objective 미노출 (dock으로 이전)
- [x] 모바일 ≤ 480px snapshot 회귀 0 (`is-desktop-rail` className 미부여 + side-dock 미렌더)
- [x] PR0.5 신규 토큰 ≥ 4종 사용
- [x] `npm run build` 통과
- [x] PR 변경 ≤ 500줄

## 검증 명령

- `npm run build`
- `npm run check:ci`

## 리스크

- side-dock card 안 currency-cluster의 grid layout이 mobile/tablet과 다르게 single-column으로 강제됨 — desktop 한정 override.
- `dev-panel`이 desktop에서 stage cell 우상단 floating으로 그대로 유지 → side-dock과 동시에 노출 시 시각 충돌 가능. PR3에서 dock 가변 확장 + dev-panel 정리.
- top-bar에 eyebrow + h1만 남으면 시각 weight 약화 — Cycle 1 종료 후 polish axis에서 brand cluster로 보강 검토.

## Subagent/Team Routing

- 단독 PR. 다음 PR3 (dock 가변 확장 + 4 surface slot 통합).
