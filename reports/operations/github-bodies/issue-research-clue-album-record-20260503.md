## 문제 / 배경

#310이 연구 단서 씨앗 수확 순간을 `단서 생명체 발견` reveal로 만들었지만, reveal CTA `도감에 기록하기` 이후 도감/앨범 화면에서 방금 발견한 생명체가 기억으로 저장됐다는 보상감은 아직 약했다. #312는 발견 결과를 도감 기억과 다음 목표로 연결한다.

## 목표

`도감에 기록하기` 이후 도감 탭이 방금 발견한 연구 단서 생명체를 `새 단서 기록`으로 보여주고 다음 수집 목표로 자연스럽게 전환되게 만든다.

## Small win

플레이어가 연구 단서 생명체를 발견한 뒤 CTA를 누르면 “도감에 새 기록이 저장됐다”는 memory payoff를 즉시 본다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #310: 연구 단서 씨앗 수확 발견 연출

## Game Studio Department Signoff

- 기획팀: player verb는 `도감에 연구 단서 기록하기`; progression role은 생명체 발견 → 도감 기억 저장 → 다음 씨앗 목표 전환이다.
- 리서치팀: Cell to Singularity는 unlock 이후 node가 tree에 남고 다음 branch가 보인다. 발견 overlay만 닫고 끝내는 대안은 reject한다.
- 아트팀: 신규 accepted manifest asset 없이 기존 creature image와 DOM/CSS album highlight/reward motion으로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 우선, blocker 시 `reports/visual/`에 새 blocker와 393px Playwright screenshot/layout invariant 남김.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “발견했는데 도감에 기록됐는지 모르겠다”를 새 기록 highlight로 줄인다.

## Subagent/Team Routing

- 단일 React/CSS/visual regression tranche이므로 Codex native subagents/team mode는 미사용.
- 독립 분리 기준: Browser Use 복구가 필요하면 QA/verifier subtask, 새 album asset이 필요하면 asset pipeline subtask로 분리.

## 플레이어 가치 또는 운영사 가치

- 사용자: 발견 순간이 도감 기억으로 저장되어 수집 game identity가 강해진다.
- 운영자: queue-empty 이후에도 player verb + production role + screen moment + HUD/reward motion + playtest evidence를 갖춘 GitHub-authoritative WorkUnit으로 production game quality를 전진시킨다.

## 수용 기준

- [x] 연구 단서 발견 reveal의 `도감에 기록하기` 이후 방금 발견한 생명체의 `새 단서 기록`/`도감 기록 저장` 상태가 보인다.
- [x] 도감 탭 또는 action surface가 다음 수집 목표 전환을 한 화면에서 설명한다.
- [x] 신규 accepted manifest asset 없이 DOM/CSS album highlight/HUD affordance로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 album/action surface/next creature card가 bottom tab과 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use blocker: `reports/visual/browser-use-blocker-0312-20260503.md` — 현재 세션 iab backend 미발견.
- Screenshot: `reports/visual/issue-312-research-clue-album-record-393.png`.
- Layout invariant: album/action surface/next creature card vs `.bottom-tabs`, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. DOM/CSS album highlight, reward motion, HUD affordance만 사용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- [x] `npm run build` — pass
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 도감|새 단서 기록"` — 1 passed
- [x] `npx playwright test --config playwright.config.ts --grep "연구 단서 씨앗|연구 단서 성장|연구 단서 수확|단서 생명체|연구 단서 도감|새 단서 기록"` — 4 passed
- [x] `npm run check:visual` — 59 passed
- [x] `npm run check:ci` — pass
- [x] `npm run update:dashboard` / `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md` — pass
- [x] `npm run check:dashboard` / `npm run check:control-room` / `npm run check:ops-live` / `npm run check:github-metadata` / `npm run check:seed-ops-queue` / `npm run check:closed-workunit-mirrors` — pass
