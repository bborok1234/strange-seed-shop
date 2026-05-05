# WorkUnit — Cycle A close + 사용자 review evidence 패키징 (Cycle A PR5 — 마지막)

## GitHub authority

- Spec: `reports/deliberation/stage-art-first-restructure/spec.md` § Implementation Sequence Cycle A PR5 + § Decisions §4 (Director self-restriction)
- Branch: `cycle-a/0208-evidence-package`
- Status: Cycle A 마지막 PR — Director는 본 PR 머지 후 Cycle close 자체 선언 금지

## Plan

`stage-art-first-restructure` Cycle A PR5 — Layer 3 사용자 review gate를 위한 evidence 패키징. Cycle 1 self-validation 실패 mechanism 차단의 enforcement 단계.

1. playwright capture 7+ screenshots:
   - 3 viewport (1280×800 / 1600×900 / 1920×1180) × Garden mode (fresh + loaded) = 6
   - 3 viewport × Seeds tab (fresh + loaded, dock 가변 확장 검증) = 6
   - 모바일 invariant 1
2. `reports/visual/cycle-A-evidence-20260505/README.md` 작성:
   - art-share-gate 9/9 PASS 자동 측정 결과
   - 사용자 critique 5종 항목별 해결 여부 표 (✅/⚠️ 명시)
   - **Honest known issues 3종** (plot card cream / dock card contrast / onboarding 진입점) — 해결 안 된 부분 정직 명시
   - Cycle 1 vs Cycle A before/after 비교
   - Director self-restriction 명시
3. heartbeat에 `userApproved: false` 명시 유지

## 수용 기준

- [x] 13 screenshots 캡처 완료
- [x] README.md 작성 완료, 5종 critique 항목별 표 + honest known issues 명시
- [x] Director self-restriction 명시 (Cycle close 자체 선언 금지)
- [x] heartbeat `userApproved: false`
- [x] PR description에 사용자에게 묻는 명시적 질문 3종 포함

## 검증 명령

- 본 PR은 시각 변경 0 (evidence + 문서만). build 검증 불필요.

## 리스크

- 사용자가 Cycle A를 Cycle B 진입 전에 polish PR 추가 요구할 가능성 (예: dock 카드 contrast 강화). 본 PR은 평가만, Director는 사용자 결정 따름.
- 사용자가 모바일 직접 검증 요구할 경우 playwright snapshot만으로 부족 — 사용자 안내 필요.

## Subagent/Team Routing

- 단독 PR. **Director는 본 PR 머지 후 Cycle close 자체 선언 금지.** 사용자 명시 approval 후에만 Cycle close 보고.
