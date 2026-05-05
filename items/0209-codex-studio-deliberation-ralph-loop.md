# Codex studio deliberation + Ralph loop 정비

Status: verified
Owner: agent
Created: 2026-05-05
Updated: 2026-05-05
Scope-risk: moderate
Work type: agent_ops

## Intent

Claude Code 전용 `/studio-deliberate` 어댑터를 Codex에서도 같은 repo-native source of truth로 실행할 수 있게 만들고, Studio Harness v3 foreground operator가 선택된 deliberation axis를 사용자 개입 없이 루프 안에서 이어갈 수 있게 한다.

## Plan

1. `.claude/skills/studio-deliberate/SKILL.md`의 하네스 중립 계약을 확인한다.
2. `.codex/skills/studio-deliberate/SKILL.md`를 repo-local Codex skill로 만든다.
3. `studio:v3:operate`가 `--axis`와 Cycle A 승인 상태를 prompt/state/report에 반영하게 한다.
4. deliberation workflow와 사용자 선호 문서에 standing delegation 규칙을 명시한다.
5. checker와 skill validator로 계약을 검증한다.

## Acceptance Criteria

- [x] Codex skill이 `docs/studio/*`를 런타임 source of truth로 참조하고 persona 본문을 복제하지 않는다.
- [x] `npm run studio:v3:operate -- --prompt-only --axis garden-respecting-hud-assets --cycle-a-approved`가 선택 axis와 승인 상태를 prompt/report에 남긴다.
- [x] heartbeat writer가 `userApproved`와 selected axis를 구조화 필드로 남길 수 있다.
- [x] `npm run check:studio-deliberation-ralph-loop`가 통과한다.
- [x] Codex skill 구조 validator가 통과한다.

## Verification Commands

- `PYTHONPATH=/tmp/codex-skill-validate-pyyaml python3 /Users/mirlim/.codex/skills/.system/skill-creator/scripts/quick_validate.py .codex/skills/studio-deliberate` → pass (`PyYAML`은 임시 target에만 설치)
- `npm run check:studio-deliberation-ralph-loop` → pass
- `npm run check:studio-v3-operator` → pass
- `npm run check:docs` → pass
- `npm run check:project-commands` → pass

## Risks

- Codex App outside tmux에서는 실제 OMX `$ralph` runner가 자동으로 붙지 않는다. 이 정비는 foreground operator + Codex skill + heartbeat evidence 루프로 구현하고, detached OMX runner가 없으면 live long runner라고 주장하지 않는다.
- 사용자 review gate를 완전히 삭제하면 P4 선호와 충돌한다. 따라서 standing delegation은 repo-native evidence가 있을 때만 review gate를 통과한 것으로 기록한다.
