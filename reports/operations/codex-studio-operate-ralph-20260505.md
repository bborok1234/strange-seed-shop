# Codex studio-operate + Ralph Prompt-Side Loop — 2026-05-05

## Summary

사용자 요청: Claude Code `/studio-operate`처럼 Codex에서도 가볍게 Studio 운영 패스를 돌리고, `$ralph` prompt-side state를 활용해 무한 supervisor 없이도 어느 정도 지속되게 만들기.

## Changes

- Added Codex project-local skill: `.codex/skills/studio-operate/SKILL.md`.
- Fixed `scripts/studio-v3-operator.mjs` false-positive limit detection:
  - previous behavior scanned stdout and stderr;
  - `omx exec` echoes the user prompt on stdout;
  - the generated prompt contains limit-handling text;
  - supervisor killed the pass by detecting its own prompt text.
- New behavior scans runtime limit patterns only on stderr.
- Added self-test coverage through `scripts/check-studio-v3-operator.mjs`.
- Updated `docs/PROJECT_COMMANDS.md` to distinguish:
  - detached supervisor: `npm run studio:v3:operate -- --detached ...`;
  - Codex/Claude in-session bounded pass: `$studio-operate` / `studio-operate`;
  - prompt-side `$ralph`: state/persistence guidance, not a live runner.
- Wrote Ralph context and planning artifacts:
  - `.omx/context/codex-studio-operate-ralph-20260505T124128Z.md`
  - `.omx/plans/prd-codex-studio-operate-ralph.md`
  - `.omx/plans/test-spec-codex-studio-operate-ralph.md`

## Verification

- `npm run check:studio-v3-operator` PASS.
- `npm run check:project-commands` PASS.
- Ralph state JSON parse PASS.

## Usage

In Codex, use project-local skill invocation:

```text
$studio-operate
```

or natural language:

```text
studio-operate로 다음 bounded pass 돌려줘
```

For detached/background operation:

```bash
npm run studio:v3:operate -- --detached --duration-hours 24 --interval-seconds 300 --axis garden-respecting-hud-assets --cycle-a-approved
```

The detached path should no longer stop immediately because the prompt itself contains limit-handling wording.
