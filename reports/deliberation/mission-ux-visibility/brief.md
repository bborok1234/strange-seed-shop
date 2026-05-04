# Brief — Mission UX 가시성 결정

- Axis slug: `mission-ux-visibility`
- Owner: studio main session (Director: main thread)
- Date: 2026-05-04
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
- Pilot status: **Phase (a) `/studio-deliberate` skill의 두 번째 dogfood axis**. 첫 번째는 `desktop-ui-redesign`. 본 axis는 더 작은 scope로 skill 안정성 검증.

## Axis

**현재 production 빌드에서는 mission이 player에게 보이지 않는다.** 6개 mission(튜토리얼 3 + 데일리 3)이 데이터로는 정의되어 있고, advance/claim 로직도 완전 구현되어 있고, `claimMissionIds` save state까지 영속됨. 그러나 UI 노출은 `showDebugPanel === true` 조건부 — debug 모드에서만 보임. 본 axis는 **mission을 production player에게 어떻게 노출할 것인가**를 결정한다.

## Current State

### 코드 사실 (`src/App.tsx`)

- `App.tsx:2880-2904`: `<section className="tab-panel mission-board" aria-label="정원 미션">`가 `showDebugPanel && activeTab === "garden"` 조건부 렌더. **production(showDebugPanel=false)에서는 missions UI가 DOM에 mount 안 됨.**
- `App.tsx:643`: `const visibleMissions = save ? content.missions : [];` — 6개 모두 visible 대상.
- mission progress / claim / reward leaves 모두 정상 작동 (tap·구매·수확·원정 시 advance, claim 버튼 활성화 시 leaves 지급).
- mission 데이터 (`src/data/missions.json`):
  - 튜토리얼 3종: 첫 씨앗 심기(+10잎), 첫 생명체 수확(+20잎), 도감 보상 받기(+20잎)
  - 데일리 3종: 생명체 5회 수확(+50잎), 씨앗 3개 구매(+45잎), 원정 1회 시작(+60잎)

### 관측

- player가 데일리 cycle 보상(총 +155잎/일)을 받고 있다는 사실 자체를 모른다 — 보이지 않으므로.
- 튜토리얼 3종은 첫 세션 onboarding의 "다음 행동" guidance가 될 수 있는데, 현재는 별도 `nextAction` chip이 그 역할을 일부 흡수.
- claim UI(`+X 잎` 버튼)가 활성화되어도 player가 클릭할 surface가 없어, mission reward가 실질적으로 dead reward.
- analytics: `mission_reward_claimed` event는 `App.tsx:1826`에 정의되어 있으나 production trigger 0 (UI 부재).

### 게임 컨텍스트

- 이상한 씨앗상회는 idle/tycoon + 감성 도감 장르. 다른 production idle 게임의 mission UX는 일반적으로:
  - bottom dock의 항상 visible 카드 (예: AdVenture Capitalist, Cookie Clicker)
  - 별도 mission tab + badge (예: 모바일 RPG)
  - quest log modal (full-screen) + bottom 진행도 표시
- 우리 게임의 5탭 중에 mission 전용 surface 없음. 정원·씨앗·도감·원정·상점 어디에도 자연 흡수 안 됨.

## Why This Axis Now

- 22개 micro-polish PR이 이 mission 데이터 위에 쌓이고 있다 (예: progress hint, milestone count). 그러나 **player가 mission 자체를 보지 못하므로 그 polish의 가치가 0**. 이 axis는 polish 회수의 ROI 자체를 결정한다.
- 데일리 cycle (+155잎/일)이 활성화되어 있는데도 불구하고 player retention 데이터에 반영 안 된 상태 — 이건 game design intent 위반.
- Plan 0001에 따라 첫 dogfood axis 이후 더 작은 axis로 `/studio-deliberate` skill 안정성을 검증. mission UX는 "5탭 골격 안 건드리고 noise 작은" 적절한 dogfood 후보.

## Constraints

### Non-negotiable

1. **5탭 골격 보존** — 6번째 탭 추가는 거부 (`desktop-ui-redesign` spec § Decisions §7와 일관). mission은 기존 5 surface 중 하나에 자연 흡수되거나 floating element가 되어야 함.
2. **Mission 데이터·로직 변경 0** — `src/data/missions.json`, `claimMissionReward`, `advanceMission` 함수 모두 invariant. UX axis이므로 reward·target·trigger는 안 건드림.
3. **save 호환성** — `claimedMissionIds`, `missionProgress` 필드 모두 invariant. 새 mission 추가나 마이그레이션 0.
4. **모바일 우선** — 가장 player가 많을 viewport. mission UX는 모바일에서 잘 동작해야 하고, desktop은 부수.
5. **Daily reset 무관** — 데일리 mission이 UTC 자정에 리셋되는 메커니즘은 본 axis 범위 외 (별도 timezone axis).
6. **`npm run check:ci` 통과**.

### Soft

- 한 PR ≤ 500줄, ≤ 5 파일.
- bundle size +10KB gzipped 이내.
- 신규 컴포넌트 도입은 OK이나 5개 미만 권장.

## Out of Scope

- 신규 mission 추가 또는 reward 재밸런스.
- mission 데이터 마이그레이션 (timezone, 신규 카테고리 등).
- 신규 일러스트·sound asset.
- shop tab의 dark pattern 분리 (별도 axis).
- A/B test infra.
- desktop layout 골격 변경 — `desktop-ui-redesign` spec에 의존하되 본 axis는 mobile + desktop 모두 적용 가능한 작은 결정만.

## Reference Artifacts

### 코드

- `src/App.tsx:2880-2904` — 현재 mission-board 위치 (debug 조건부)
- `src/App.tsx:643` — visibleMissions 산정
- `src/App.tsx:1814-1826` — claimMissionReward 로직
- `src/App.tsx:1005, 1021, 1083, 1238, 1239, 1366, 1804` — advanceMission trigger 위치들
- `src/data/missions.json` — 6 mission 정의
- `src/types/game.ts` — `MissionDefinition`, PlayerSave의 `missionProgress`, `claimedMissionIds`

### 메모리

- `feedback_layout_over_polish.md` — 이미 mission polish PR에 layout 결정 우선이 적용됨
- `feedback_studio_team_critique.md` — 본 axis도 4 persona deliberation으로
- `feedback_harness_neutral_source_of_truth.md` — 모든 산출물 repo-native
- `project_studio_loop_polish_bias.md` — mission 위 polish가 이 axis 결정 전 22 PR 누적된 사례

### 관련 spec / plan

- `reports/deliberation/desktop-ui-redesign/spec.md` — 5탭 골격 + dock region 결정 reference
- `reports/deliberation/desktop-ui-redesign/retrospective.md` — Open Q ≤ 5 / Engineer cost-only 금지 등 (a) skill 개선 사항이 본 axis에서 작동하는지 dogfood

### 사전 옵션 sketch (anchor lock-in 주의 — Critic brief-level 4-4 학습)

본 axis는 sketch 옵션을 **의도적으로 제공하지 않음**. specialist가 framing 없이 brief의 player verb·hierarchy·cost를 직접 분석. 이전 axis(desktop-ui-redesign)에서 brief의 A/B/C sketch가 specialist 사고를 narrow했다는 retrospective 학습 적용.

## Success after this axis

- production player가 켰을 때 mission의 존재를 인지한다 (UI surface 1곳 이상).
- 튜토리얼 3종이 첫 세션 onboarding에 자연 통합되거나 명시적으로 분리되어 있어, "다음 행동"의 guidance와 충돌 없음.
- 데일리 3종이 player의 데일리 복귀 cycle에 의미 있는 hook 역할.
- `mission_reward_claimed` event가 production에서 발화 (현재 0 → 측정 가능 수준).
- 22개 누적된 mission-adjacent polish PR(progress hint·milestone count 등)이 player에게 도달.
