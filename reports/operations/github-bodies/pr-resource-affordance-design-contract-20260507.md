## 요약
- `구매 25`처럼 재화 단위와 현재 보유량이 빠진 경제 CTA를 기획 결함으로 명시했습니다.
- `docs/DESIGN.md`와 `docs/IDLE_CORE_PRODUCTION_SPEC.md`에 Cost, Balance, Result, Blocker 4요소를 모든 구매/강화/연구/원정/심기 CTA의 acceptance로 추가했습니다.

## Small win
- 전체 UI를 갈아엎을 때 같은 결함이 반복되지 않도록 기획팀 승인 기준에 “가격 숫자만 있는 UI는 production bar 실패”를 박았습니다.

## 사용자/운영자 가치
- 플레이어는 버튼을 누르기 전 어떤 재화를 얼마나 쓰고, 현재 감당 가능한지, 누르면 무엇이 바뀌는지 알 수 있어야 합니다.
- 운영자는 향후 씨앗/상점/강화 리디자인에서 감각적 polish보다 먼저 경제 정보 설계가 맞는지 검수할 수 있습니다.

## Before / After 또는 Visual evidence
- N/A — 문서/기획 기준 변경입니다.
- 적용 기준 예시: `25 잎 · 보유 72 잎`, `구매하고 심기`, `13 잎 부족`, `보관 12 -> 24`.

## Playable mode
- N/A — runtime UI 변경 없음.

## 검증
- [x] `npm run check:docs`
- [x] `npm run check:p0-ui-ux`
- [x] `git diff --check`

## 안전 범위
- 문서 기준 변경만 포함합니다.
- runtime image generation, 결제, 실채널, 고객 데이터 변경 없음.

## 남은 위험
- 실제 씨앗/상점 UI에는 아직 이 기준이 전면 적용되지 않았습니다. 다음 UI 리디자인 WorkUnit에서 구현 acceptance로 반영해야 합니다.

## 연결된 issue
- Local user-reported planning defect

## 작업 checklist
- [x] Design contract 업데이트
- [x] Core production spec 업데이트
- [x] Local docs/UI contract checks
- [ ] GitHub checks 확인
