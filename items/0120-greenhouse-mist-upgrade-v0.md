# Greenhouse mist upgrade v0

Status: verified
Work type: game_feature
Owner: agent
Created: 2026-05-01
Updated: 2026-05-01
Scope-risk: narrow
Issue: #232
PR: #233
Branch: `codex/0120-greenhouse-mist-upgrade-v0`

## Intent

`온실 물길 점검` 주문이 재료와 꽃가루 보상을 주지만, 현재는 그 보상이 다음 성장 선택으로 바로 이어지지 않는다. 물길 점검 완료 뒤 `온실 물안개` 강화를 열어 주문 보상이 오프라인 복귀 보너스로 환류되게 만들고, 플레이어가 온실 설비를 계속 키우는 장기 메타를 화면에서 이해하게 한다.

## Game Studio route

- `game-studio:game-studio`: 물길 강화 -> 물길 점검 주문 -> 물안개 강화 -> 복귀 보너스 vertical slice.
- `game-studio:game-ui-frontend`: 모바일 정원 action surface 안에서 새 성장 선택이 playfield와 bottom tabs를 가리지 않게 한다.
- `game-studio:game-playtest`: 모바일 393px에서 첫 actionable screen, 주문 보상, 새 강화 선택, 저장 상태, layout invariant를 screenshot으로 확인한다.

## Reference teardown

- Idle Miner/Egg, Inc.식 idle loop는 생산 시설 보상이 다음 시설 강화로 즉시 이어져야 한다.
- 현재 체인은 온실 설비, 선반, 동선, 물길까지 이어졌지만 `온실 물길 점검` 이후에는 같은 reward loop가 끊긴다.
- 이 작업은 새 시스템을 넓히지 않고, 기존 upgrade choice surface와 order crate/FX를 재사용해 다음 장기 메타 실루엣을 한 단계 더 잇는다.

## Creative brief

`온실 물안개`는 물길 점검 뒤 남은 물방울을 작은 안개 장치로 돌려, 플레이어가 돌아왔을 때 선반 보관 보너스를 더 크게 받는 장면이다. 새 asset 없이 기존 온실/주문/보상 UI를 사용하되, 화면 문구는 `물안개`와 `복귀 보관 +10%`를 분명히 보여준다.

Vertical slice axes:

- `player verb`: 물길 점검 주문 보상 재료와 꽃가루로 `온실 물안개`를 구매한다.
- `production/progression role`: 온실 시설/오프라인 복귀 progression을 강화한다.
- `screen moment`: 물길 점검 완료 직후 정원 action surface의 성장 선택에서 새 upgrade가 보인다.
- `asset/FX`: 신규 asset 없음. 기존 order crate, production reward pulse, upgrade choice surface를 재사용한다.
- `playtest evidence`: 모바일 393px visual gate와 Browser Use 우선 QA 또는 현재 세션 blocker를 남긴다.

## Plan

1. save schema에 `greenhouseMistLevel` 기본값과 normalization을 추가한다.
2. `온실 물길 점검` 완료 뒤 `온실 물안개` upgrade choice를 열고, `재료 1 · 꽃가루 3`을 소비해 오프라인 선반 보너스 +10%를 적용한다.
3. 오프라인 보상 breakdown과 성장 선택 copy에서 `물안개 보관` 상태를 읽히게 한다.
4. QA seed 경로에 물길 점검 완료 상태를 재현하는 flag를 추가한다.
5. 모바일 visual regression과 game loop/content checks를 갱신한다.
6. roadmap/dashboard/control room과 GitHub metadata를 갱신하고 PR/check/main CI evidence를 남긴다.

## Acceptance

- [x] `온실 물길 점검` 완료 뒤 `온실 물안개` 성장 선택이 보인다.
- [x] `재료 1 · 꽃가루 3`으로 구매하면 save의 `greenhouseMistLevel`이 1이 되고 재료/꽃가루가 0이 된다.
- [x] 물안개 완료 뒤 오프라인 복귀 보관 보너스가 기존 선반/정리 보너스보다 +10% 높게 계산된다.
- [x] 모바일 393px에서 playfield, production card, upgrade choice, bottom tabs가 서로 가리지 않고 overflow가 없다.
- [x] `npm run check:ci`가 통과한다.

## Verification

- `npm run check:loop`: PASS
- `npm run check:content`: PASS
- `npm run build`: PASS
- `npm run check:visual -- --grep "온실 물안개"`: PASS
- `npm run check:ci`: PASS
- PR #233 GitHub checks: PASS (`Check automerge eligibility`, `Verify game baseline`)
- Browser Use `iab`: PASS, `reports/visual/p0-greenhouse-mist-upgrade-browser-use-20260501.png`
- Playwright screenshot: `reports/visual/p0-greenhouse-mist-upgrade-v0-20260501.png`
- Draft PR: #233

## Safety

- 신규 runtime image generation 없음.
- 신규 외부 dependency 없음.
- 실제 결제, 로그인, 광고, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 기존 주문/연구/원정 루프의 unlock 순서를 바꾸지 않는다.

## Risks

- action surface에 완료 upgrade가 하나 더 늘어 모바일 밀도가 증가할 수 있다. Visual invariant로 bottom-tab overlap과 hidden overflow를 고정한다.
- 오프라인 보너스가 누적되므로 수치 copy가 과장되지 않게 `+10%` 단위로만 표시한다.
