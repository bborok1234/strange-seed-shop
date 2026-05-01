# P0.5 studio campaign audit

## 요약

Issue #260의 P0.5 campaign audit를 완료하고, 다음 implementation tranche를 `Lunar harvest creature payoff v0`로 고정한다. 추가로 `$seed-ops`가 Codex App PR publication confirmation boundary에서 final로 멈추지 않도록 운영 계약과 checker를 보강한다.

## Small win

`달방울 씨앗` 수확 이후의 production gap을 “달방울 누누가 정원 actor로 일하는 장면이 약하다”로 좁히고, 다음 plan artifact `items/0132-lunar-harvest-creature-payoff-v0.md`를 남겼다.

운영사 측 small win은 PR/issue/comment 게시가 action-time confirmation을 요구해도 `This is not a terminal stop`으로 처리하고, `do not send final just to ask for PR creation`을 checker가 잡게 만든 것이다.

## Plan-first evidence

- `items/0130-p05-studio-campaign-audit.md`
- `reports/operations/p05-studio-campaign-audit-20260501.md`
- `items/0132-lunar-harvest-creature-payoff-v0.md`
- `items/0133-seed-ops-pr-publication-confirmation-boundary.md`
- `reports/operations/seed-ops-pr-publication-confirmation-boundary-20260501.md`
- `docs/ROADMAP.md`
- `docs/OPERATOR_CONTROL_ROOM.md`

## 사용자/운영자 가치

플레이어 관점에서는 다음 작업이 단순 기능 추가가 아니라 `온실 단서 -> 달방울 씨앗 -> 달방울 누누`의 수집/생산 감정 payoff를 강화한다. 운영자 관점에서는 campaign gate가 실제로 부서별 audit, Browser Use evidence, 다음 tranche plan으로 이어졌음을 증명한다.

운영자 관점에서 이번 corrective fix는 `$seed-ops`의 pending external-publication gate를 종료가 아니라 continuation checkpoint로 취급하게 만든다.

## Before / After 또는 Visual evidence

- Before/current source planting: `reports/visual/p05-campaign-audit-greenhouse-lunar-plant-browser-use-20260501.png`
- Ready harvest: `reports/visual/p05-campaign-audit-lunar-ready-harvest-browser-use-20260501.png`
- Harvest reveal: `reports/visual/p05-campaign-audit-lunar-harvest-reveal-browser-use-20260501.png`

## Playable mode

런타임 코드는 변경하지 않았다. 사람 플레이는 main worktree 기준으로 유지한다.

- `npm run play:main`
- `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`

## 검증

- `npm run check:seed-ops-queue` pass
- `npm run check:ops-live` pass
- `npm run check:dashboard` pass
- `npm run check:ci` pass
- `npm run check:visual` pass, 49 tests. 첫 sandbox 실행은 `127.0.0.1:4173` 포트 바인딩 권한으로 실패했고, 승인 경로 재실행은 통과했다.
- PR publication confirmation boundary corrective checks: `npm run check:seed-ops-queue` pass, `npm run check:ops-live` pass, `npm run check:dashboard` pass, `npm run check:ci` pass.

## 작업 checklist

- [x] Plan-first artifact 작성
- [x] Game Studio route 기록
- [x] Browser Use 우선 QA 또는 blocker 기록
- [x] 문서/roadmap/dashboard/report 갱신
- [x] GitHub evidence 갱신 준비
- [x] PR publication confirmation boundary 기록

## 안전 범위

문서, 운영 보고서, Browser Use evidence, 다음 plan artifact만 변경한다. 게임 runtime, save schema, 결제, 로그인, 외부 배포, 고객 데이터, 실채널 GTM은 건드리지 않는다.

## 남은 위험

- gpt-image-2 organization verification blocker가 다음 asset tranche에서도 반복될 수 있다.
- 다음 issue는 실제 asset/FX 생성과 manifest integration을 포함하므로 `gpt-image-2` default/Codex native fallback provenance를 새로 남겨야 한다.
- 첫 5분 전체 playtest rubric은 lunar payoff 구현 후 별도 evidence로 다시 남겨야 한다.
- Codex App에서 실제 draft PR publication은 action-time confirmation 경계를 통과해야 한다. 이 경계는 terminal stop이 아니라 `reports/operations/seed-ops-pr-publication-confirmation-boundary-20260501.md`에 기록된 pending external-publication gate다.

## 연결된 issue

Closes #260
