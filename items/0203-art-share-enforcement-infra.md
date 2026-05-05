# WorkUnit — Art-share enforcement infrastructure (Cycle A PR0)

## GitHub authority

- Spec: `reports/deliberation/stage-art-first-restructure/spec.md` § Implementation Sequence Cycle A PR0 + § Decisions §4·§5
- Branch: `cycle-a/0203-art-share-enforcement-infra`
- Status: 시각 noop, **enforcement infra만**. Cycle A 후속 PR(PR1~PR5)의 hard 의존성.

## Plan

`stage-art-first-restructure` Cycle A PR0 — Cycle 1 implementation 갭의 자동 차단 mechanism 도입.

1. `tests/visual/desktop-art-share.spec.ts` 신설 — playwright test:
   - 3 desktop viewport (1280×800 / 1600×900 / 1920×1180) 각각:
     - stage region 안 React panel(`.garden-panel`, `.starter-panel`, `.action-surface`, `.garden-action-surface`) overlay 면적 비율 ≤ 25%
     - rail 버튼 height ≤ 44px
     - dock 배경 ≠ stage 배경 (computed style differ)
2. `package.json` — `check:art-share` script 추가 (focused playwright run).
3. `.github/workflows/ci.yml` — 신규 job `art-share-gate` 추가:
   - playwright chromium install
   - npm run check:art-share 실행
   - PR required check로 등록 (branch protection 별도 설정 필요)

## 수용 기준

- [x] `npm run check:art-share` 로컬 실행 가능 (`npx playwright install chromium` 후)
- [x] CI에서 `art-share-gate` job 추가, PR마다 자동 실행
- [x] 본 PR에서 (실제 Cycle A 시각 변경 없음) 현재 main 상태로는 **fail 예상** (stage cream panel 비율 ~85%) — 본 PR 자체는 fail 허용 (infra 도입), 후속 visual PR이 fail 해소
- [x] 후속 PR(PR1~PR5)이 머지 가능하려면 art-share-gate 통과 필수

## 검증 명령

- `npm run build`
- `npx playwright install chromium && npm run check:art-share` (로컬)
- CI: `art-share-gate` job 통과

## 리스크

- **본 PR 머지 시 infra 자체는 통과하지만 후속 art-share 측정은 현재 상태에서 fail이 예상**. 즉 main에 PR0 머지 후 art-share-gate가 PR마다 빨간 상태로 보이게 됨 (PR1~PR4가 점진 해소). 단계적 fix가 정상.
- playwright chromium install 비용 (~1분) CI에 추가됨. 별도 job이라 verify와 병렬 실행으로 wall clock 영향 최소.
- branch protection rule(art-share-gate를 required check로) 설정은 본 PR 외부 — 사용자가 GitHub repo 설정에서 별도 처리.

## Subagent/Team Routing

- 단독 PR. 다음 PR1 (token 수정 + dock contrast 회복) — PR1이 통과해야 art-share-gate의 dock contrast 부분이 green.
