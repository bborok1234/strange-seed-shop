## 요약

`온실 물안개` 완료 뒤 복귀 보너스 payoff가 새 주문 `물안개 응축 납품`으로 이어지게 했다. `qaGreenhouseMist=1` 복귀 상태에서 보관 보상 `+30%` 확인, 생산 잎 수령, 주문 납품, `재료 1 · 꽃가루 2` 보상까지 Browser Use iab와 모바일 visual gate로 검증했다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 돌아온 플레이어가 물안개 보너스로 받은 잎을 바로 `물안개 응축 납품`에 써서 다음 재료/꽃가루 보상을 받는다.

## Plan-first evidence

- Plan artifact: `items/0121-greenhouse-mist-order-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: N/A

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route:
  - `game-studio:game-ui-frontend`
  - `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: 모바일 정원 playfield와 bottom tabs를 보호하고, Browser Use iab에서 comeback modal, production claim, order crate, delivery reward를 확인했다.
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

- 게임 가치: 오프라인 복귀 보너스가 숫자 증가에서 끝나지 않고 즉시 납품 완료감과 다음 온실 보상으로 이어진다.
- 운영사 가치: `$seed-ops`가 #232 merge 후 바로 다음 production vertical slice를 plan-first로 선택하고 Browser Use 우선 QA까지 수행했다.

## Before / After 또는 Visual evidence

- Before: `온실 물안개` 완료 뒤 복귀 보너스는 커지지만 새 주문 목표로 바로 이어지지 않았다.
- After: `물안개 응축 납품` 주문이 열리고, 복귀 잎 수령 뒤 `+165 잎 · +2 꽃가루 · +1 재료` 납품 보상을 받는다.
- Browser Use evidence 또는 blocker: `reports/visual/p0-greenhouse-mist-return-order-v0-20260501.md`
- Screenshot: `reports/visual/p0-greenhouse-mist-return-order-v0-20260501.png`
- N/A 사유: N/A

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: feature branch 변경이며 playable main worktree 정책과 port 5174 설정은 변경하지 않았다.

## 검증

- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

검증 상세:

- Browser Use iab PASS: `qaGreenhouseMist=1` -> `보상 확인` -> `생산 잎 수령` -> `물안개 응축 납품` 완료
- `npm run check:visual -- --grep "물안개 응축"` PASS
- `npm run check:loop` PASS
- `npm run check:content` PASS
- `npm run build` PASS
- `npm run check:ci` PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

- 신규 asset은 만들지 않았고 기존 order crate/production surface를 재사용했다.
- PR checks와 main CI는 PR 생성 후 확인한다.

## 연결된 issue

Closes #235

---

작성 규칙:

- 이 본문은 markdown 파일로 작성한 뒤 `gh pr create/edit --body-file <file>`로 제출한다.
- 셸 인자에 `\n`을 넣어 multi-line 본문을 만들지 않는다. GitHub 화면에 literal `\n`이 보이면 실패다.
- 섹션을 삭제하지 않는다. 해당 없음이면 `N/A 사유:`를 적는다.
- `작업 checklist`는 삭제하지 않는다. 완료되지 않은 항목은 빈 체크박스로 남기고 사유를 적는다.
