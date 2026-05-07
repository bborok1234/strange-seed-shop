# Phaser v1 Momo carrier and order crate motion

## 요약

Normalized Momo strip을 runtime carrier actor로 연결하고, workbench claim 이후 order crate progression을 화면에서 읽히게 만듭니다.

## Small win

첫 수확 후 Pori만 보이는 상태에서 한 단계 나아가, workbench -> order crate 생산 체인이 Momo carrier motion으로 보입니다.

## 사용자/운영자 가치

플레이어는 상회 생산 체인이 어떻게 이어지는지 그림으로 이해하고, 운영자는 normalized strip asset이 실제 gameplay actor로 연결되는 evidence를 확보합니다.

## Before / After 또는 Visual evidence

- Before: Momo strip은 normalized/preloaded source이고 runtime actor는 Pori 하나입니다.
- After: workbench claim 후 Momo carrier가 order crate task에 등장합니다.

## Playable mode

Phaser app lane을 수정합니다. Merge 후 main playable refresh 대상입니다.

## 검증

- `npm run check:phaser`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API 호출 없음.
- 결제/광고/외부 배포/고객 데이터 없음.

## 남은 위험

- Momo motion은 first carrier task로 제한합니다. Full order delivery/claim economy는 후속 WorkUnit입니다.

## 연결된 issue

- Follow-up to #446

## 작업 checklist

- [ ] Momo carrier state 추가
- [ ] role별 actor spritesheet rendering
- [ ] order crate progress visual evidence
- [ ] checks/visual report
