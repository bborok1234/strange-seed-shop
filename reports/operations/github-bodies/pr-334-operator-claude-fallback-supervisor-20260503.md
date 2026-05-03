## 요약

- `scripts/studio-v3-operator.mjs --supervisor`가 Codex `rate-limit`/`usage-limit`/`status: 429`/idle stall에 닿으면 자식 프로세스를 안전 종료하고, cooldown 동안 Claude CLI 백엔드로 폴백한다. cooldown 만료 후 Codex 시도가 재개된다.
- 신규 CLI 옵션: `--backend codex|omx|claude`, `--fallback claude|none`, `--idle-timeout-minutes`(기본 10), `--codex-cooldown-minutes`(기본 60).
- supervisor state schema 확장: `backend_used`, `via`, `codex_cooldown_until`, `last_trigger`, `last_trigger_at`.

## Small win

24h 운영자가 사용자 호출 없이 Codex 한쪽 limit/idle을 자기 회복으로 넘긴다.

## 사용자/운영자 가치

- 사용자: AI 네이티브 게임 운영사가 24h 약속을 사람 개입 없이 더 자주 지킨다.
- 운영자: cooldown/리커버리 텔레메트리가 state/report에 즉시 보여 stuck 진단이 쉬워진다.

## Before / After 또는 Visual evidence

- N/A — UI 변화 없음. 운영사 인프라 변경.
- 대신 doctor JSON, foreground/detached command, supervisor state schema 예시는 plan artifact `items/0169-operator-claude-fallback-supervisor.md`와 issue #334 본문에 첨부했다.
- regenerated `reports/operations/studio-v3-operator-20260503.md`가 Backend/Fallback/Idle timeout/Codex cooldown 필드를 표면화한다.

## Playable mode

- 영향 없음. 게임 런타임/에셋/스토어 변경 없음. `npm run play:main`/포트 5174 계약 그대로.

## 검증

- `node --check scripts/studio-v3-operator.mjs`
- `node scripts/studio-v3-operator.mjs --doctor --print-command --backend codex`
- `npm run check:studio-v3-operator`
- `npm run check:operator`
- `npm run check:ops-live`
- `npm run check:ci`

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음.
- real payment, customer data, external production deployment 없음.
- destructive git/GitHub 명령 없음. 분기 보호 우회 없음.
- Claude 백엔드는 사용자 로컬 `claude` CLI에만 의존. 외부 결제/계정 자동화 없음.

## 남은 위험

- Codex limit 메시지 텍스트가 미래에 바뀌면 정규식 패턴이 stale될 수 있다. 패턴은 흔한 표현 다수를 OR로 묶어 broad하게 유지한다.
- idle-timeout이 비정상적으로 짧게 설정되면 정상 long-running 작업도 강제 종료될 수 있다. 기본 10분은 v3 운영자 prompt가 한 iteration에서 일반적으로 stdio를 자주 뱉는다는 가정이다.
- Claude 백엔드도 동일 한도에 닿을 때의 다중 backend health-check는 후속 WorkUnit으로 분리한다.

## 연결된 issue

Closes #334
