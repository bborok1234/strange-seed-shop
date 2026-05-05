# WorkUnit — Rail button 축소 + brand cluster 흡수 (Cycle A PR4)

## GitHub authority

- Spec: `reports/deliberation/stage-art-first-restructure/spec.md` § Implementation Sequence Cycle A PR4 + Cycle 1 § Decisions §2 loser concession
- Branch: `cycle-a/0207-rail-brand-cluster`
- Status: art-share-gate 마지막 fail 항목 해소

## Plan

`stage-art-first-restructure` Cycle A PR4 — rail button을 ambient nav 정신에 맞게 축소 + 게임 title을 rail 상단 brand cluster로 흡수 (Cycle 1 § Decisions §2 loser concession 마침내 implement) + top-bar desktop 폐기.

1. JSX: rail nav 상단에 `.rail-brand-cluster` div 추가 (`isDesktopLayout` 조건):
   - eyebrow "햇살 온실 정원" + strong "이상한 씨앗상회"
   - aria-hidden="true" (스크린리더 중복 방지)
2. CSS @media (min-width: 1280px):
   - `.bottom-tabs.is-desktop-rail .rail-brand-cluster` styling
   - `.bottom-tabs.is-desktop-rail button` min-height 56 → 40px (≤44 acceptance), padding 축소
   - `.top-bar { display: none; }` (desktop 폐기 — eyebrow/h1 brand cluster, currency·objective는 dock 흡수)
   - `.garden-panel { top: var(--spacing-2xl); }` 보정 (top-bar 부재 보정)

## 수용 기준

- [x] art-share-gate **9/9 PASS** (stage cream / rail height / dock contrast 3 viewport × 3 test 모두)
- [x] rail button height ≤ 44px (40px 적용)
- [x] top-bar desktop 미노출 → stage art top portion 가리던 cream gradient 제거
- [x] brand cluster가 rail 상단에 게임 title 노출 (Cycle 1 § Decisions §2 loser concession 회복)
- [x] 모바일 ≤ 480px snapshot 회귀 0
- [x] `npm run build` 통과
- [x] PR 변경 ≤ 60줄

## 검증 명령

- `npm run build`
- `npm run check:art-share`: 9 passed (모든 spec promise 자동 검증 통과)

## 리스크

- 기존 `.top-bar` 안 currency-cluster·objective-chip CSS 룰이 dead code로 잔존 (Cycle 1 PR2 추가 + 본 PR이 top-bar 자체 hide). 후속 token-migration axis에서 cleanup.
- Brand cluster의 rail 상단 위치가 viewport 좁아질 때 (1280px) tab 영역 압박 — clamp(180,14vw,220) rail 폭 안에 brand text "이상한 씨앗상회" (16px font) 잘릴 위험. 1280px에서 rail width ≈ 180px → 한 줄 가능. 검증 필요.

## Subagent/Team Routing

- 단독 PR. 다음 PR5 (Cycle close + 사용자 review evidence 패키징).
