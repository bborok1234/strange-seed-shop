# Seed ops issue/PR title retrospective

Date: 2026-05-02
Source: `gh issue list --state all --limit 200 --json number,title,state,createdAt`, `gh pr list --state all --limit 200 --json number,title,state,createdAt,mergedAt,headRefName`

## Finding

최근 issue/PR 제목은 큰 제품 기획보다 직전 작업의 다음 칸을 잇는 패턴으로 수렴했다.

Measured sample:

- Issues checked: 114
- PRs checked: 156
- Issue titles containing `bridge/브릿지/이어/연결`: 12
- Issue titles containing `v0/P0/P0.5`: 52
- Issue titles containing ops/gate/closeout language: 27
- PR titles containing `closeout/완료 증거/증거/main CI`: 25
- PR titles containing `bridge/브릿지/이어/연결`: 14
- PR titles containing `v0/P0/P0.5`: 42

Recent examples:

- `#270 Lunar guardian order bridge v0`
- `#266 Lunar harvest creature payoff v0`
- `#254 온실 단서 달방울 씨앗이 정원 심기 source로 이어진다`
- `#251 달빛 온실 조사 보상이 씨앗 수집 source로 이어진다`
- `#248 Seed ops no-final continuation gate`
- `PR #256 Issue 254 closeout: 온실 단서 심기 완료 증거`
- `PR #253 온실 단서 보상 완료 증거를 main 기준으로 닫는다`
- `PR #231 ops live readiness main CI closeout`

## Diagnosis

The active seed-ops documents already say to choose from `P0.5 Idle Core + Creative Rescue`, but the harness did not force the agent to compare a large-direction candidate before selecting a small adjacent feature.

The title surface also lacked a concrete contract. As a result, titles drifted between English/Korean, `bridge`, `payoff`, `v0`, `closeout`, and evidence-backfill wording. This made the work look like implementation fragments instead of a game studio roadmap.

## Product Risk

If the loop keeps choosing only adjacent bridge/payoff items, the game can pass CI while the visible game barely changes. The player still sees a dense mobile panel with cramped text and incremental progression chips instead of a stronger production-game moment.

## Harness Fix

This PR adds two explicit gates to `$seed-ops` and `docs/PROJECT_COMMANDS.md`.

1. `Strategic Jump Check`
   - Each new game issue plan must compare at least 3 candidates.
   - At least one candidate must be a large-direction jump: art direction, first-screen UI/UX rework, core gameplay verb, visual QA harness defect, or high-severity first-5-minute confusion.
   - If a smaller adjacent feature wins, the plan must explain why it beats the larger candidate with evidence.

2. `Title Contract`
   - Game issue/PR titles default to Korean.
   - Titles must include at least 2 of `screen moment`, `player verb`, and `production/progression role`.
   - `bridge`, `payoff`, `v0`, `closeout`, and `완료 증거` cannot carry the title by themselves.

`scripts/check-seed-ops-queue-gate.mjs` now keeps these phrases under static CI guard so the rule does not silently disappear from the seed-ops surface.

## Current Loop Correction

The current issue title `Lunar guardian order bridge v0` is itself evidence of the anti-pattern. The implementation and PR body must therefore explicitly state the correction:

- product work: `달방울 누누` order delivery UI no longer clips payoff text;
- QA work: completed lunar order visual QA now fails if the payoff row is overflow-hidden or internally clipped;
- ops work: future issue selection must run `Strategic Jump Check` and `Title Contract`.
