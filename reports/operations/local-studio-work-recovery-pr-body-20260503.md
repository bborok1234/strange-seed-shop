## 요약

PR #273 이후 로컬에 남아 있던 Studio Harness / game production 작업을 삭제하지 않고 복구 단위로 분리했습니다.

## Small win

`stash@{0}`에 숨어 있던 미반영 작업을 `WU-A #274`, `WU-B #275`, `WU-C #276`으로 나눠 GitHub issue에 연결했습니다.

## 사용자/운영자 가치

로컬 branch/stash에 쌓인 Codex 작업이 다시 사라지거나 한 PR에 섞여 들어가는 일을 막습니다. 이후 작업자는 `reports/operations/local-studio-work-recovery-20260503.md`를 기준으로 필요한 파일만 선택 적용할 수 있습니다.

## Before / After 또는 Visual evidence

Before:

- `codex/studio-harness-v3-autonomous-design` 로컬 브랜치는 원격이 삭제된 상태였습니다.
- `stash@{0}`에는 tracked diff 33개와 untracked 90개가 섞여 있었습니다.
- 실제 game/UI production 변경과 v2 local ledger 산출물이 구분되지 않았습니다.

After:

- recovery branch: `codex/recover-local-studio-work-20260503`
- backup stash: `stash@{0}` 보존
- 복구 원장: `reports/operations/local-studio-work-recovery-20260503.md`
- `check:ops-live`는 CI에서 committed fallback heartbeat/control-room timestamp를 wall-clock live state로 오해하지 않도록 조정했습니다.
- GitHub issues:
  - #274 `로컬 v2 campaign ledger를 v3 WorkUnit evidence로 격리/백필`
  - #275 `대표 생명체 stage, 돌보기 반응, 도감 감상면을 production으로 복구`
  - #276 `Studio Harness v3 bot runner 구현 spec 및 checker 정리`

## Playable mode

해당 없음. 이 PR은 복구/운영 정리 문서만 추가합니다.

## 검증

- `gh issue create`로 #274, #275, #276 생성 확인
- selective staging으로 복구 원장/issue body 파일만 커밋
- production game/UI 및 v2 ledger diff는 이 PR 커밋에 포함하지 않음
- `npm run check:ops-live`
- `npm run check:ci`

## 안전 범위

- 문서/report만 추가합니다.
- `stash@{0}`를 drop하지 않았습니다.
- `git reset --hard`, `git clean`, 전체 restore를 수행하지 않았습니다.
- 펼쳐진 recovery diff는 후속 WU에서 선택 적용합니다.

## 남은 위험

- recovery branch 작업트리에는 아직 펼쳐진 미커밋 diff가 남아 있습니다.
- #274, #275, #276은 별도 issue/PR로 처리해야 합니다.
- 이 PR은 정리 원장 PR이며, 실제 game/UI 변경을 merge하지 않습니다.

## 연결된 issue

Refs #274
Refs #275
Refs #276

## 작업 checklist

- [x] stash 내용을 삭제하지 않고 복구 브랜치에 펼침
- [x] 작업 묶음을 WU-A/WU-B/WU-C/WU-D로 분류
- [x] GitHub issue #274, #275, #276 생성
- [x] 복구 원장과 issue body 파일 커밋
- [x] CI fallback heartbeat stale-age 오탐 수정
- [ ] 후속 PR에서 #274 처리
- [ ] 후속 PR에서 #275 처리
- [ ] 후속 PR에서 #276 처리
