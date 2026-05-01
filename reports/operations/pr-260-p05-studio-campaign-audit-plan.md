# PR #260 P0.5 Studio Campaign Audit Plan

## 요약

Issue #260 `P0.5 studio campaign audit`의 plan-first artifact를 main에 올린다. 다른 세션이 main에서 `$seed-ops`를 시작해도 다음 active issue와 campaign gate를 바로 읽을 수 있게 만드는 closeout/continuation 정리다.

## Small win

다음 작업이 특정 feature branch에만 남지 않고 main의 `items/0130-p05-studio-campaign-audit.md`, ROADMAP, control room, heartbeat에 연결된다.

## Plan-first evidence

- Issue #260
- `items/0130-p05-studio-campaign-audit.md`
- `docs/ROADMAP.md`
- `docs/OPERATOR_CONTROL_ROOM.md`

## 사용자/운영자 가치

다른 세션이 main에서 시작해도 “다음에는 무엇을 해야 하는가?”를 추측하지 않고, P0.5 campaign audit부터 이어간다. #260은 완료 이슈가 아니라 다음 active issue다.

## Before / After 또는 Visual evidence

N/A — plan artifact/운영 문서 변경이며 UI 런타임 변화 없음.

## Playable mode

N/A — 게임 런타임 변경 없음.

## 검증

- `npm run check:seed-ops-queue`
- `npm run check:ops-live`
- `npm run check:dashboard`

## 작업 checklist

- [x] Plan-first artifact 작성
- [x] Game Studio Department Signoff 포함
- [x] Subagent/Team Routing 포함
- [x] Browser Use 우선 QA 또는 blocker: N/A, plan artifact only
- [x] 문서/roadmap/dashboard/report 갱신
- [x] GitHub evidence 갱신

## 안전 범위

문서와 운영 plan artifact만 수정한다. 게임 runtime, save data, 결제, 로그인, 외부 배포, 실채널 GTM은 건드리지 않는다.

## 남은 위험

#260은 이 PR로 닫지 않는다. 이 PR은 다음 active issue plan을 main에 노출하는 작업이고, #260의 실제 감사/선정은 다음 `$seed-ops` loop에서 진행한다.

## 연결된 issue

Refs #260
