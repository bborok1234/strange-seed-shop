# Seed ops PR publication confirmation boundary

Date: 2026-05-01
Status: verified
Branch: `codex/0130-p05-studio-campaign-audit`
Related work: Issue #260, `items/0130-p05-studio-campaign-audit.md`, `items/0133-seed-ops-pr-publication-confirmation-boundary.md`

## Problem

`$seed-ops` loop가 PR publication 직전 Codex App action-time confirmation 경계에 도달했을 때, assistant가 “PR을 만들겠다”는 final summary로 멈췄다. 사용자가 요청한 동작은 무한 운영모드였으므로 이 종료는 버그다.

## Root Cause

기존 문서는 branch push, draft PR, CI, merge를 완료 조건으로 두고 있었지만, Codex App의 representational communication 확인 경계가 생겼을 때 어떻게 계속해야 하는지 명시하지 않았다. 그래서 safety confirmation을 terminal stop처럼 취급하는 실패 모드가 남아 있었다.

## Corrective Rule

`PR publication confirmation boundary`를 추가한다.

- GitHub PR/issue/comment 게시가 action-time confirmation을 요구할 수 있다.
- This is not a terminal stop.
- do not send final just to ask for PR creation.
- 확인이 필요한 순간에는 pending external-publication gate를 commentary checkpoint와 운영 보고서에 기록한다.
- branch, commit, PR body file, pending command, confirmation, next local safe work를 남긴다.
- `next issue plan artifact exists` 상태를 만들고 destructive/external이 아닌 local safe work를 계속한다.

## Pending External-Publication Gate

- Pending command: `gh pr create --draft --base main --head codex/0130-p05-studio-campaign-audit --title <title> --body-file reports/operations/pr-260-p05-studio-campaign-audit.md`
- Confirmation needed: Codex App action-time confirmation for GitHub PR publication.
- PR body file: `reports/operations/pr-260-p05-studio-campaign-audit.md`
- Current safe local work: 운영 계약/checker hardening, control room regeneration, roadmap/dashboard update, local verification.
- Next issue plan artifact: `items/0132-lunar-harvest-creature-payoff-v0.md` already exists; this corrective item also uses `items/0133-seed-ops-pr-publication-confirmation-boundary.md`.

## Verification

- `npm run check:seed-ops-queue` pass
- `npm run check:ops-live` pass
- `npm run check:dashboard` pass
- `npm run check:ci` pass
