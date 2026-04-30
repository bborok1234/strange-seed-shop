# Greenhouse facility unlock v0

Status: done
Branch: `codex/0109-greenhouse-facility-unlock-v0`
Issue: #200
PR: #201
Main CI: `25150219782`

## Context

#197에서 원정 보상 `재료`가 정원 `작업대 강화`와 생산률 상승으로 이어졌다. 하지만 강화 완료 뒤 다음 장기 목표는 여전히 연구/주문 카드 중심이고, “온실을 설비로 키운다”는 idle tycoon 확장감이 약하다. 다음 vertical slice는 작업대 강화 후 정원 action surface에 첫 온실 설비 목표를 보여, 생산/주문/원정 재료가 시설 확장 실루엣으로 이어지게 만든다.

## Game Studio route

- `game-studio:game-studio`: 작업대 강화 -> 온실 설비 목표 -> 장기 성장 실루엣 vertical slice.
- `game-studio:web-game-foundations`: saveable facility progression을 추가하되 생산 계산과 UI state boundary를 분리한다.
- `game-studio:game-ui-frontend`: 정원 action surface에 설비 목표를 넣되 playfield와 bottom tabs를 가리지 않는다.
- `game-studio:game-playtest`: Browser Use와 visual test로 작업대 강화 후 설비 카드가 보이고 overflow가 없는지 검증한다.

## Vertical slice scoring

- `player verb`: 강화된 정원에서 첫 온실 설비 목표를 확인하고 해금한다.
- `production/progression role`: 업그레이드 선택이 더 큰 온실 시설 progression으로 이어진다.
- `screen moment`: 작업대 강화 완료 후 정원 다음 성장 선택에 `온실 설비` 목표가 등장한다.
- `asset/FX`: 기존 order crate/research icon 언어를 재사용하고, 필요 시 시설 placeholder는 CSS/기존 asset으로 처리한다. 신규 asset 생성 없음.
- `playtest evidence`: Browser Use `iab`, focused visual, full visual, CI.

## Plan

1. 현재 save/progression 구조에서 설비 상태를 최소 필드로 추가할 수 있는지 확인한다.
2. 작업대 강화 완료 후에만 `온실 설비` 선택지를 보여준다.
3. 설비 해금은 과한 새 시스템이 아니라 첫 production bar에 장기 메타 실루엣을 더하는 narrow slice로 제한한다.
4. 모바일 393px과 짧은 viewport에서 기존 roster/ready/action surface overflow를 깨지 않게 한다.
5. Browser Use evidence와 visual regression을 추가한다.
6. roadmap/dashboard/GitHub evidence를 갱신한다.

## Acceptance

- [x] 작업대 강화 완료 후 정원 action surface에 `온실 설비` 목표가 등장한다.
- [x] 설비 목표는 재료/잎 등 현재 production loop 자원과 연결된다.
- [x] 설비 해금 또는 준비 상태가 save에 남고 reload 후 유지된다.
- [x] 모바일 393px과 짧은 viewport에서 body scroll, bottom tab overlap, visible child overflow가 없다.
- [x] Browser Use `iab`, focused visual, full visual, CI가 통과한다.

## Evidence

- Browser Use `iab`: `reports/visual/p0-greenhouse-facility-unlock-browser-use-20260430.png`
- Visual report: `reports/visual/p0-greenhouse-facility-unlock-v0-20260430.md`
- Focused visual: `npm run check:visual -- --grep "온실 설비"` PASS
- Full visual: `npm run check:visual` PASS, 34 passed
- CI: `npm run check:ci` PASS
- PR checks: PR #201 `Verify game baseline` PASS, `Check automerge eligibility` PASS
- Merge: PR #201 squash merge `b1686b9707bb1fbb4f882eb1da33c0a421c727fc`
- Main CI: `25150219782` PASS

## Risks

- action surface가 다시 과밀해질 수 있다. 설비 목표는 작업대 강화 이후에만 표시하고, 기존 roster/ready compact gate를 함께 검증한다.
- 새 장기 메타가 Phase 0 범위를 과도하게 넓힐 수 있다. 첫 설비 한 단계와 화면 실루엣으로 제한한다.
