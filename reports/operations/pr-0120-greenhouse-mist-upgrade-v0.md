## 요약

`온실 물길 점검` 주문 보상 `재료 1 · 꽃가루 3`이 다음 성장 선택 `온실 물안개`로 이어지게 했다. 물안개 완료 뒤 오프라인 복귀 modal에서 온실 보관 보너스가 `+30%`로 보이며, Browser Use iab와 Playwright visual gate로 실제 화면을 확인했다.

또한 Browser Use가 Codex App에서 별도 browser namespace가 아니라 Node REPL `js` + `browser-client.mjs` bootstrap으로 노출되는 점을 seed QA/ops 지침에 고정했다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 물길 점검 주문 보상이 바로 `온실 물안개` 구매와 다음 복귀 보관 보너스로 환류된다.

## Plan-first evidence

- Plan artifact: `items/0120-greenhouse-mist-upgrade-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: Browser Use 하네스 오판 재발을 막기 위해 `.codex/skills/seed-qa/SKILL.md`, `.codex/skills/seed-ops/SKILL.md`, `docs/BROWSER_QA.md`에 bootstrap 경로를 명시했다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:game-ui-frontend`
  - `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 모바일 정원 playfield와 bottom tabs를 보호하고, Browser Use iab에서 main verbs와 오프라인 복귀 보상 화면을 확인했다.
- Game Studio route에서 벗어난 변경이 있다면 이유: N/A

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.

## 사용자/운영자 가치

- 게임 가치: 주문 보상이 다음 시설 강화와 복귀 보상으로 이어져 idle tycoon loop가 끊기지 않는다.
- 운영사 가치: Browser Use 하네스 사용법을 문서/스킬에 고정해 다음 UI 작업에서 같은 fallback 오판을 줄인다.

## Before / After 또는 Visual evidence

- Before: `온실 물길 점검` 보상은 재료/꽃가루를 주지만 다음 성장 선택으로 바로 연결되지 않았다.
- After: `온실 물안개` 구매 후 복귀 modal에서 `보관 보상 +30%`가 보인다.
- Browser Use evidence 또는 blocker: `reports/visual/p0-greenhouse-mist-upgrade-browser-use-20260501.png`
- N/A 사유: N/A

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch 변경이며 playable main worktree 정책과 port 5174 설정은 변경하지 않았다.

## 검증

- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

검증 상세:

- `npm run check:visual -- --grep "온실 물안개"` PASS
- Browser Use iab PASS: `보상 확인` -> `생산 잎 수령` -> `주문 납품` -> `온실 물안개` 구매 -> `qaGreenhouseMist=1` 복귀 modal `보관 보상 +30%`
- `npm run check:ci` PASS
- PR #233 GitHub checks PASS: `Check automerge eligibility`, `Verify game baseline`

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- PR #233 checks는 통과했다. main CI는 merge 직후 확인한다.
- 신규 asset은 만들지 않았고 기존 order crate/production surface를 재사용했다.

## 연결된 issue

Closes #232

---

작성 규칙:

- 이 본문은 markdown 파일로 작성한 뒤 `gh pr create/edit --body-file <file>`로 제출한다.
- 셸 인자에 `\n`을 넣어 multi-line 본문을 만들지 않는다. GitHub 화면에 literal `\n`이 보이면 실패다.
- 섹션을 삭제하지 않는다. 해당 없음이면 `N/A 사유:`를 적는다.
- `작업 checklist`는 삭제하지 않는다. 완료되지 않은 항목은 빈 체크박스로 남기고 사유를 적는다.
