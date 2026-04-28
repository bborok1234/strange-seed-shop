# PR 자동화 정책

## 목적

이 저장소는 사람이 매번 수동으로 점검하지 않아도 작은 작업 단위가 검증, 보고, 병합 준비까지 도달하는 구조를 실험한다.

초기 단계의 목표는 완전 자동 머지가 아니라, 자동화가 적용해도 되는 PR의 조건을 보수적으로 좁히고 그 조건을 코드와 문서로 남기는 것이다.

## 현재 구성

- `.github/workflows/ci.yml`: PR과 `main` push에서 전체 프로젝트 검증을 실행한다.
- `.github/workflows/agent-automerge.yml`: PR이 자동 머지 후보인지 확인하고, 저장소 변수가 켜진 경우에만 GitHub native auto-merge를 요청한다. 후보 판정 직전에 `gh pr view`로 현재 PR label을 다시 읽어, PR 생성 직후 label 이벤트 순서 차이로 후보 판정이 실패하지 않게 한다. Draft PR 또는 `agent-automerge` label이 없는 PR은 자동 머지만 의도적으로 skip하고 전체 검증은 계속 실행한다.
- `scripts/check-automerge-readiness.mjs`: 자동 머지 후보 조건을 로컬에서도 검증할 수 있게 만든다.
- `docs/AUTOMERGE_GOVERNANCE.md`: Branch protection, required checks, 저장소 변수 운영 조건을 정의한다.
- `scripts/check-governance.mjs`: 자동 머지 운영 정책과 workflow 핵심 문구가 유지되는지 확인한다.

## 자동 머지 후보 조건

모든 조건을 만족해야 한다.

- 이벤트가 `pull_request`다.
- base branch가 `main`이다.
- fork PR이 아니다.
- PR label에 `agent-automerge`가 있다.
- head branch가 `codex/` 또는 `agent/`로 시작한다.
- PR이 draft가 아니다.
- `npm run check:all`이 통과한다.
- 저장소 변수 `ENABLE_AGENT_AUTOMERGE`가 `true`다.

## 안전 장치

`ENABLE_AGENT_AUTOMERGE`가 설정되지 않으면 자동 병합 단계는 실행되지 않는다. `agent-automerge` label이 없거나 draft인 PR은 자동 머지 후보가 아니므로 eligibility 실패가 아니라 skip으로 기록한다. 따라서 이 워크플로는 기본 상태에서 후보 분류와 검증만 수행한다.

자동 머지는 GitHub native auto-merge 요청으로 제한한다. 즉시 강제 병합하지 않고, 브랜치 보호 규칙과 필수 체크가 있다면 그 규칙을 따른다.

## Branch protection과 required checks

저장소 변수 `ENABLE_AGENT_AUTOMERGE`를 켜기 전에 `main` Branch protection을 먼저 설정한다.

권장 required checks:

- `Verify game baseline`
- `Check automerge eligibility`

브랜치 보호 없이 `ENABLE_AGENT_AUTOMERGE`를 켜면 auto-merge 요청이 사실상 즉시 병합으로 이어질 수 있다. 따라서 자동 머지 활성화는 `docs/AUTOMERGE_GOVERNANCE.md`의 중단 조건과 저장소 변수 운영 기준을 따른다.

## 로컬 검증

일반 검증:

```bash
npm run check:all
```

정책 점검:

```bash
npm run check:governance
```

자동 머지 후보 판정 예시:

```bash
GITHUB_EVENT_NAME=pull_request \
PR_HEAD_REF=codex/example \
PR_BASE_REF=main \
PR_IS_FORK=false \
PR_LABELS=agent-automerge \
npm run check:automerge
```

## 다음 단계

- `items/` 작업 기록과 PR을 연결한다.
- 자동 머지 실행 결과를 `reports/audits/`에 남긴다.
- 브랜치 보호 규칙과 required checks를 GitHub 설정에서 명시한다.
- `ENABLE_AGENT_AUTOMERGE`를 켜는 경우 audit report에 변경 시각과 이유를 남긴다.
