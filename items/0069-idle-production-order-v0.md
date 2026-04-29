# Idle production + order v0

Status: done
Work type: game_feature
Issue: #121
Owner: agent
Created: 2026-04-29
Updated: 2026-04-29
Scope-risk: moderate

## Intent

P0.5 idle core creative rescue의 첫 구현 slice로, 첫 생명체가 도감 보상 카드에 머무르지 않고 정원 경제에 참여하게 만든다. 플레이어는 수확한 생명체가 잎을 천천히 만들어내는 것을 보고, 짧은 주문/의뢰에 납품해 다음 행동과 보상을 얻는다.

## Small win

첫 수확 이후 정원 화면에 자동 생산 tick과 첫 주문 progress가 보이며, 플레이어가 생산된 잎을 수령하고 첫 주문을 납품할 수 있다.

## Player Fun Target

첫 5분 안에 “내가 얻은 아이가 정원을 일하게 만들고 있다”는 소유감과 생산 엔진 감각을 만든다.

## Core Loop Role

- 생산: 발견한 생명체가 자동 잎 생산을 만든다.
- 주문: 짧은 납품 목표가 다음 행동을 제시한다.
- 수집: 더 많은 생명체가 생산력과 주문 진행에 의미를 가진다.

## Plan

1. 저장 스키마에 idle production/order 상태를 좁게 추가한다.
2. 기존 harvest/album 흐름 이후 발견한 생명체 수를 기준으로 production rate와 pending 생산 잎을 계산한다.
3. 정원 HUD에 생산 tick, pending 수령 CTA, 첫 주문 progress를 노출한다.
4. 첫 주문 납품 액션을 추가하고 보상은 잎/꽃가루만 지급한다.
5. Phaser playfield에는 큰 구조 변경 없이 생산 상태를 작은 텍스트/배지로 전달한다.
6. `check:content`, `check:loop`, `simulate:economy`, `check:visual`, `build`를 통과시키고 visual evidence를 남긴다.
7. 작업 종료 전 `docs/ROADMAP.md`, `docs/DASHBOARD.md`, 이 item의 evidence를 갱신한다.

## Acceptance Criteria

- 첫 생명체 수확 뒤 자동 생산 rate가 0보다 커지고 화면에서 읽힌다.
- pending 생산 잎은 수령 전까지 별도 상태로 쌓이며 기존 오프라인 보상과 중복 지급되지 않는다.
- 첫 주문은 progress, 요구량, 보상, 납품 가능 상태를 보여준다.
- 납품 시 보상이 지급되고 주문 완료 상태가 저장된다.
- 모바일 visual test에서 정원 HUD/playfield/하단 탭이 겹치지 않는다.
- 런타임 이미지 생성, 결제, 로그인, 광고, 외부 배포를 추가하지 않는다.

## Verification

- `npm run check:content`
- `npm run check:loop`
- `npm run simulate:economy`
- `npm run check:visual`
- `npm run build`
- `npm run update:dashboard`
- `npm run check:dashboard`

## Risks

- 자동 생산이 기존 오프라인 보상과 이중 집계될 수 있다. 이번 slice에서는 pending 생산 잎을 별도 상태로 두고, 오프라인 계산식은 건드리지 않는다.
- 주문과 기존 mission이 의미상 겹칠 수 있다. 이번 slice는 첫 주문 1개만 고정해 별도 도메인으로 시작하고, daily/tutorial mission 개편은 후속으로 둔다.
- Playfield 텍스트가 모바일에서 시각 잡음을 만들 수 있다. 필요한 경우 Phaser 표시는 최소 배지로 제한하고 React HUD에서 핵심 정보를 보여준다.

## Apply Conditions

- 결제, 로그인, 광고, 외부 배포, 고객 데이터, 실채널 GTM은 건드리지 않는다.
- 새 npm dependency를 추가하지 않는다.
- 에셋 생성은 이번 issue의 필수 범위가 아니다. 필요한 asset batch는 후속 issue로 분리한다.

## Evidence

- Issue: #121
- PR: #122
- Merge commit: `4160a4424e39175132098946169313a7c94c6373`
- Main CI: `25090571222` — pass
- Branch: `codex/0069-idle-production-order-v0`
- Visual evidence: `reports/visual/p0-idle-production-order-v0-20260429.md`
- Verification:
  - `npm run check:content` — pass
  - `npm run check:loop` — pass
  - `npm run simulate:economy` — pass
  - `npm run build` — pass
  - `npm run check:visual` — pass, 13 tests
  - `npm run check:all` — pass
