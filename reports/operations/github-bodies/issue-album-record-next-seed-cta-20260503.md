## 문제 / 배경

#312가 연구 단서 발견을 도감의 `새 단서 기록`으로 저장했지만, 새 기록 card의 다음 씨앗 목표 CTA가 실제 씨앗 구매/심기 준비 상태로 강하게 이어지는지는 아직 약하다. 도감 기억 저장 이후 곧바로 “다음 하나만 더 키우기” 행동으로 넘어가야 한다.

## 목표

`새 단서 기록`의 다음 씨앗 목표 CTA를 누르면 씨앗 탭 목표 row가 `새 기록 다음 목표` 상태와 구매/심기 affordance를 보여주게 만든다.

## Small win

도감 기록을 저장한 직후 다음 씨앗을 보러 가면 “방금 기록 다음으로 이 씨앗을 키우면 된다”가 한눈에 보인다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #312: 연구 단서 도감 새 기록 저장 payoff

## Game Studio Department Signoff

- 기획팀: player verb는 `새 기록 다음 씨앗 고르기`; progression role은 도감 기억 저장 → 다음 씨앗 목표 구매/심기 준비다.
- 리서치팀: collection idle games는 새 발견 뒤 다음 target CTA가 shop/inventory row에 연결된다. 도감에서 씨앗 탭으로만 이동하는 대안은 reject한다.
- 아트팀: 신규 accepted manifest asset 없이 DOM/CSS row highlight/HUD affordance로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 우선, blocker 시 `reports/visual/`에 새 blocker와 393px Playwright screenshot/layout invariant 남김.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “다음엔 뭘 심어야 하나요?”를 다음 씨앗 target row로 줄인다.

## Subagent/Team Routing

- 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 기본 미사용.
- 독립 분리 기준: Browser Use 복구가 필요하면 QA/verifier subtask, 새 FX asset이 필요하면 asset pipeline subtask로 분리.

## 플레이어 가치 또는 운영사 가치

- 사용자: 도감 저장 후 다음 수집 행동이 씨앗 구매/심기로 바로 이어진다.
- 운영자: player verb + progression role + screen moment + HUD affordance/reward motion + playtest evidence를 갖춘 GitHub-authoritative WorkUnit으로 production quality chain을 전진시킨다.

## 수용 기준

- [ ] `새 단서 기록`의 다음 씨앗 목표 CTA를 누르면 씨앗 탭 target row가 `새 기록 다음 목표`/`도감 기록 다음 씨앗` 상태를 보여준다.
- [ ] target row가 다음 생명체/씨앗 이름과 구매/심기 가능성을 한 화면에서 설명한다.
- [ ] 신규 accepted manifest asset 없이 DOM/CSS row highlight/HUD affordance로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 target row/action buttons가 bottom tab과 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: 연구 단서 수확 → 도감 기록 CTA → 새 기록 다음 씨앗 목표 CTA → seeds tab target row.
- Fallback screenshot: `reports/visual/issue-314-album-record-next-seed-cta-393.png`.
- Layout invariant: target row/buttons vs `.bottom-tabs`, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. DOM/CSS row highlight, reward motion, HUD affordance만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 새 단서 기록 다음 씨앗 CTA
- `npm run check:visual`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`
