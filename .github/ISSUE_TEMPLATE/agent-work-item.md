---
name: Agent work item / 에이전트 작업
about: 에이전트가 수행할 small win 중심 작업을 정의합니다.
title: ""
labels: ""
assignees: ""
---

## 문제 / 배경


## 목표


## Small win

- 이번 issue가 만들 가장 작은 승리:

## Game Studio route

- Umbrella: `game-studio:game-studio` 또는 N/A 사유:
- Specialist route: `game-studio:game-ui-frontend` / `game-studio:game-playtest` / `game-studio:phaser-2d-game` / `game-studio:web-game-foundations` / `game-studio:sprite-pipeline` / N/A 사유:
- 북극성/플레이어 동사:
- Playfield 보호 또는 UI surface 원칙:
- Playtest evidence 계획:

## Plan

- 구현 전 작성/검토할 plan artifact:
- 예상 변경 단계:
- 검증 계획:
- 건드리지 않을 범위:

## 플레이어 가치 또는 운영사 가치

- 게임 가치:
- 운영사 가치:

## 수용 기준

- [ ]

## Visual evidence 계획

- Before screenshot:
- After screenshot:
- Browser Use 우선 QA 계획 또는 N/A 사유:
- N/A 사유:

## Playable mode 영향

- [ ] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port:

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.

## 검증 명령

- 기본 CI gate: `npm run check:ci`
- UI/visual 변경: Browser Use QA + `npm run check:visual`

---

작성 규칙:

- 이 본문은 markdown 파일로 작성한 뒤 `gh issue create/edit --body-file <file>`로 제출한다.
- 셸 인자에 `\n`을 넣어 multi-line 본문을 만들지 않는다. GitHub 화면에 literal `\n`이 보이면 실패다.
- 섹션을 삭제하지 않는다. 해당 없음이면 `N/A 사유:`를 적는다.
- UI/visual issue는 Browser Use 우선 QA 계획을 비워두지 않는다. 막히면 blocker와 fallback을 적는다.
- 게임 기능/UI/에셋/QA issue는 `Game Studio route`를 비워두지 않는다. 해당 없으면 N/A 사유를 적는다.
