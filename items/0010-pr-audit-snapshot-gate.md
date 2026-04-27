# PR audit snapshot gate

Status: verified

## 목적

PR audit를 갱신하는 PR이 자기 자신을 다시 audit해야 하는 무한 갱신 루프를 방지한다.

## 범위

- `scripts/check-audit-reports.mjs`
- `scripts/update-pr-automation-audit.mjs`
- `reports/audits/pr_automation_20260427.md`
- `docs/ROADMAP.md`

## 완료 조건

- PR audit report가 생성 시점의 스냅샷임을 명시한다.
- `check:audit`가 고정된 PR 총수를 요구하지 않고 report 내부의 행 수와 카운트 일치 여부를 검증한다.
- audit 갱신 PR 자체를 다시 audit해야 하는 루프를 만들지 않는다.

## 검증

- `npm run check:audit`
- `npm run check:all`

## 비고

신규 기능 PR 또는 운영상 중요한 PR 묶음을 audit에 반영해야 할 때만 `npm run update:pr-audit`를 실행한다.
