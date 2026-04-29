# Production garden UI v0

Status: done
Work type: game_feature
Issue: #123
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: moderate

## Intent

P0.5 idle core creative rescue의 두 번째 구현 slice다. #121에서 자동 생산과 첫 주문은 기능적으로 연결되었지만, 정원 첫 화면은 아직 플레이필드와 하단 패널이 분리된 카드처럼 읽힐 수 있다. 이번 작업은 같은 기능을 유지하면서 첫 화면을 "생산 엔진이 보이는 정원"으로 읽히게 만든다.

## Small win

모바일 정원에서 플레이어가 한눈에 생명체 작업 상태, 생산 대기 잎, 주문 진행, 다음 수집 목표를 읽고 바로 수령/납품/씨앗 행동으로 이어질 수 있다.

## Player Fun Target

첫 수확 이후 "내 정원이 돌아가고 있다"는 느낌을 강화하고, 다음 주문/씨앗/생명체가 기다린다는 진행감을 만든다.

## Plan

1. #121 merge evidence를 로컬 item/roadmap에 닫힌 상태로 반영한다.
2. 정원 action panel을 생산 엔진 우선 정보 구조로 정리한다.
3. 생산 card와 다음 수집 목표가 모바일에서 경쟁하지 않도록 card 밀도와 우선순위를 조정한다.
4. Phaser playfield의 생산/주문 배지가 plot과 겹치지 않게 상단 engine strip으로 정리한다.
5. `qaProductionReady=1` visual gate를 360/393 모바일에서 확인하도록 확장한다.
6. `check:visual`, `check:all`과 visual evidence를 갱신한다.
7. PR/CI/main CI까지 확인한 뒤 다음 P0.5 issue를 선택한다.

## Acceptance Criteria

- 정원 첫 화면에서 생산 rate, pending 생산 잎, 주문 진행이 CTA와 함께 보인다.
- 모바일 393px와 360px에서 production/order UI가 bottom nav와 겹치지 않는다.
- 다음 수집 목표와 생산/주문 카드가 한 화면에서 서로 밀어내지 않는다.
- #121 완료 evidence가 item/roadmap에 반영된다.
- 런타임 이미지 생성, 결제, 로그인, 광고, 외부 배포를 추가하지 않는다.

## Verification

- `npm run check:visual`
- `npm run check:all`
- `npm run update:dashboard`
- `npm run check:dashboard`

## Risks

- UI 밀도를 높이다가 첫 화면이 다시 dashboard처럼 보일 수 있다. 이번 작업은 정보량을 늘리기보다 우선순위와 배치를 줄이는 방향을 우선한다.
- 새 asset 없이 UI만 조정하면 생산 엔진 감각이 제한된다. creature work/celebrate, order crate, reward FX는 후속 asset batch issue로 남긴다.

## Apply Conditions

- 새 dependency를 추가하지 않는다.
- 실제 결제/광고/로그인/외부 배포/런타임 이미지 생성은 금지한다.
- 저장 스키마 의미 변경은 #121의 `idleProduction` 범위를 넘기지 않는다.

## Evidence

- Issue: #123
- PR: #124
- Merge commit: `f0a0ac730d17d10178d605d614f041e686c7b507`
- Main CI: `25090930573` — pass
- Branch: `codex/0070-production-garden-ui-v0`
- Visual evidence: `reports/visual/p0-production-garden-ui-v0-20260429.md`
- Verification:
  - `npm run check:loop` — pass
  - `npm run build` — pass
  - `npm run check:visual` — pass, 13 tests
  - `npm run check:all` — pass
