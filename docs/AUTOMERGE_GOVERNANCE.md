# 자동 머지 운영 거버넌스

## 목적

이 문서는 에이전트가 만든 PR을 자동으로 병합할 때의 운영 조건을 고정한다. 목표는 속도를 높이는 것이 아니라, 자동화가 사람의 개입 없이 반복되더라도 실패 범위와 중단 조건이 명확한 상태를 유지하는 것이다.

## 현재 운영 모드

현재 기본 모드는 `검증 자동화 + 수동/명시 승인 기반 병합`이다.

`Agent Automerge Trial` workflow는 PR이 자동 머지 후보인지 판정하고 전체 검증을 실행한다. Draft PR 또는 `agent-automerge` label이 없는 PR은 자동 머지 후보가 아니므로 후보 판정 실패로 PR을 빨갛게 만들지 않고, `Automerge is intentionally skipped`를 기록한 뒤 전체 검증만 수행한다. 실제 GitHub native auto-merge 요청은 저장소 변수 `ENABLE_AGENT_AUTOMERGE`가 `true`일 때만 실행된다.

후보 판정은 pull request 이벤트 페이로드의 label 목록에만 의존하지 않는다. workflow는 체크 직전에 `gh pr view`로 현재 PR label을 다시 읽어, PR 생성 직후 label 적용 순서 차이 때문에 `agent-automerge`가 누락되어 보이는 실패를 줄인다.

2026-04-27 audit 기준으로 `main`은 `protected: false`이며, private repository의 Branch protection endpoint는 `HTTP 403`을 반환했다. 따라서 `ENABLE_AGENT_AUTOMERGE`는 계속 꺼진 상태를 유지한다.

## Branch protection

`main`에는 아래 required checks를 요구하는 Branch protection을 권장한다.

| Required check | 출처 |
| --- | --- |
| `Verify game baseline` | `.github/workflows/ci.yml` |
| `Check automerge eligibility` | `.github/workflows/agent-automerge.yml` |

브랜치 보호가 없다면 `gh pr merge --auto`가 사실상 즉시 병합될 수 있다. 따라서 `ENABLE_AGENT_AUTOMERGE`를 켜기 전에 Branch protection과 required checks를 먼저 확인한다.

## 자동 머지 후보 조건

모든 조건이 맞아야 한다.

- base branch가 `main`이다.
- fork PR이 아니다.
- PR이 draft가 아니다.
- PR label에 `agent-automerge`가 있다. label이 없으면 자동 머지만 skip하고 전체 검증은 계속 통과/실패를 보고한다.
- head branch가 `codex/` 또는 `agent/`로 시작한다.
- `npm run check:automerge`가 통과한다.
- `npm run check:all`이 통과한다.
- 저장소 변수 `ENABLE_AGENT_AUTOMERGE`가 `true`다.

## 중단 조건

아래 조건에서는 자동 머지 후보가 아니며, agent는 병합을 시도하지 않는다.

- 제품 결제, 계정, 권한, credential, 실제 사용자 데이터와 관련된 변경
- `Scope-risk: broad`
- 테스트 또는 visual evidence 없이 UI를 바꾸는 변경
- `main`이 아닌 base branch
- fork PR
- label이 없거나 branch prefix가 맞지 않는 PR
- 실패한 check를 우회해야만 병합 가능한 PR

## 저장소 변수 운영

`ENABLE_AGENT_AUTOMERGE`는 기본적으로 꺼져 있어야 한다.

켜기 전 확인:

1. Branch protection이 `main`에 적용되어 있다.
2. required checks가 `Verify game baseline`, `Check automerge eligibility`를 포함한다.
3. 실패한 PR에서 auto-merge가 요청되지 않는지 테스트한다.
4. audit report에 변경 시각과 이유를 기록한다.

끄는 기준:

- CI가 불안정하다.
- 자동 머지 후보 판정이 잘못된 PR을 통과시킨다.
- 에이전트가 scope-risk를 낮게 잘못 분류했다.
- GitHub Actions 권한이나 브랜치 보호 설정이 변경됐다.

## 운영 명령

로컬 후보 판정:

```bash
GITHUB_EVENT_NAME=pull_request \
PR_HEAD_REF=codex/example \
PR_BASE_REF=main \
PR_IS_FORK=false \
PR_LABELS=agent-automerge \
npm run check:automerge
```

정책 문서/워크플로 점검:

```bash
npm run check:governance
```

전체 점검:

```bash
npm run check:all
```
