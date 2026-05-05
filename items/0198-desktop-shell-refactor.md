# WorkUnit — Desktop shell refactor (Cycle 1 PR0)

## GitHub authority

- Spec: `reports/deliberation/desktop-ui-redesign/spec.md` § Implementation Sequence Phase 1 PR0
- Branch: `cycle1/0198-desktop-shell-refactor`
- Status: 시각 noop refactor

## Plan

`desktop-ui-redesign` Cycle 1의 prerequisite PR0. **시각 noop**으로 다음 PR(PR0.5 토큰, PR1 breakpoint, PR2 SideDock)이 안전하게 들어갈 토양 마련.

1. JSX: `<div className="desktop-shell">`를 `<main>` 안 wrapper로 도입.
2. `dev-panel`과 `bottom-tabs`를 `garden-stage` 형제 노드로 격상 (이전: garden-stage 자식).
3. CSS: geometry/visual 속성(width/height/border/box-shadow)을 garden-stage에서 desktop-shell로 이전. garden-stage는 100% w/h로 desktop-shell 채움.
4. 모바일 @media (max-width: 900px)에 `.desktop-shell` override 추가 (시각 noop 보장).

## 수용 기준

- [x] `npm run build` 통과
- [x] desktop·모바일 시각 동일 (모바일 mission cluster 등 회귀 0)
- [x] dev-panel·bottom-tabs absolute 좌표가 desktop-shell 기준으로 정상 작동
- [x] PR 변경 ≤ 500줄 / ≤ 5 파일

## 검증 명령

- `npm run build`
- `npm run check:ci`

## 리스크

- `.garden-stage` 사용처 ~30개 셀렉터가 inner element를 가리키게 됨 — 시각 동일하나 향후 selector specificity 변경 시 주의.
- `.app-shell.playable-focus .garden-stage { width: ... }` (line 5320) 명시 width override 잔존 — desktop-shell 도입 후 redundant. PR0.5에서 정리 검토.

## Subagent/Team Routing

- 단독 PR. PR0.5 (token introduction) 다음.
