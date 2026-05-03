## GitHub authority

- Issue: #318 https://github.com/bborok1234/strange-seed-shop/issues/318
- Branch: `codex/0318-album-record-followup-growth-preview`
- Plan artifact: `items/0161-album-record-followup-growth-preview.md`

## 문제 / 배경

#316이 새 기록 다음 seed row의 구매/심기를 정원 `새 기록 후속 재배` payoff로 연결했지만, 심은 뒤 실제 성장 탭 반복 중에는 “이 후속 재배가 어떤 새 생명체 수확으로 이어지는지”가 아직 약하다. 도감 저장 이후 다음 씨앗을 심은 플레이어가 성장 중에도 다음 수확 기대를 계속 느껴야 한다.

## 목표

`새 기록 후속 재배` 상태의 씨앗을 성장시키는 동안 action feedback/next creature card/playfield state가 다음 생명체 수확 예고와 현재 성장 행동을 보여주게 만든다.

## Small win

새 기록 다음 씨앗을 심고 밭을 톡톡 누르면 “젤리콩 통통 수확까지 가고 있다”가 즉시 보인다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #316: 새 기록 다음 씨앗 심기 → 정원 재성장 payoff

## Game Studio Department Signoff

- 기획팀: player verb는 `새 기록 후속 씨앗 성장시키기`; progression role은 후속 재배 시작 → 성장 탭 반복 → 다음 생명체 수확 기대다.
- 리서치팀: collection idle games는 target planting 뒤 성장 중에도 target reward/next unlock preview를 유지한다. 심기 receipt에서 끝나는 대안은 reject한다.
- 아트팀: 신규 accepted manifest asset 없이 existing seed/plot visuals + DOM/CSS feedback/reward motion으로 제한한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche. GardenScene action feedback binding이 필요하면 `src/game/playfield/*`도 포함한다.
- 검수팀: Browser Use iab current-session 우선, blocker 시 `reports/visual/`에 새 blocker와 393px Playwright screenshot/layout invariant 남김.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “심은 건 알겠는데 뭘 얻나요?”를 성장 중 수확 예고로 줄인다.

## Subagent/Team Routing

- 단일 React/CSS/visual regression tranche라 Codex native subagents/team mode는 기본 미사용.
- 독립 분리 기준: Phaser action feedback 변경이 커지면 runtime worker, Browser Use 복구가 필요하면 QA/verifier subtask, 새 FX asset이 필요하면 asset pipeline subtask로 분리.

## 플레이어 가치 또는 운영사 가치

- 사용자: 새 기록 다음 씨앗을 심은 뒤 성장 탭 반복이 다음 생명체 수확 기대와 계속 연결된다.
- 운영자: queue-empty를 종료로 취급하지 않고, player verb + progression role + screen moment + HUD/playfield reward motion + playtest evidence가 있는 GitHub-authoritative WorkUnit으로 production vertical slice를 이어간다.

## 수용 기준

- [ ] `새 기록 후속 재배` 씨앗을 한 번 이상 성장시키면 action feedback 또는 action surface가 다음 생명체/씨앗 이름과 수확 예고를 보여준다.
- [ ] next creature card 또는 동등한 HUD가 후속 재배 성장 중 상태를 `수확 예고`/`후속 성장 중`으로 설명한다.
- [ ] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS/playfield feedback/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [ ] 393px 모바일에서 playfield/action surface/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [ ] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence 계획

- Browser Use iab target: 연구 단서 수확 → 도감 기록 CTA → 다음 씨앗 CTA → 구매/심기 → 정원 `새 기록 후속 재배` → 성장 탭 → 수확 예고.
- Fallback screenshot: `reports/visual/issue-318-album-record-followup-growth-preview-393.png`.
- Layout invariant: playfield/action surface vs `.bottom-tabs`, no body scroll, no masked overflow.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing visuals, DOM/CSS/playfield feedback, reward motion만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build`
- focused Playwright: 새 기록 후속 성장/수확 예고
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
