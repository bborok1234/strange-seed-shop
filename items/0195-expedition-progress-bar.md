# WorkUnit #384 — 원정 진행 중 expedition tab에 progress bar + leaf-trail motion을 추가한다

## GitHub authority

- GitHub issue: #384 https://github.com/bborok1234/strange-seed-shop/issues/384
- Branch: `codex/0195-expedition-progress-bar`
- Status: plan-first

## Plan

1. expedition tab JSX에 `expedition-progress-bar` 컴포넌트 추가:
   - `progressPercent = ((duration - remaining) / duration) * 100` (이미 `expeditionRemainingSeconds` 보유, `activeExpeditionDefinition.durationSeconds` 보유).
   - 완료 시 100% 클램프.
2. styled `<div>`로 외부 track + 내부 fill (width: %, transition).
3. fill 위에 `expedition-leaf-trail` keyframe — 작은 leaf glyph가 좌→우로 흐르는 미묘한 ambient motion.
4. >=90% 진행 시 fill 색조를 lunar/golden gradient로 전환.
5. aria-label로 진행률 발화: `원정 진행률 X%`.
6. `npm run build` + mirror gates 통과.

## 수용 기준

- [ ] activeExpedition 진행 중일 때 progress bar 노출 (claim 버튼 위 또는 expedition-progress-note 위).
- [ ] expedition 완료 도달 시 100% 표시.
- [ ] 90% 이상에서 color cue 전환.
- [ ] aria-label로 % 진행률 노출.
- [ ] leaf-trail ambient motion 적용.

## 검증 명령

- `npm run build`
- mirror gates (5개)

## 리스크

- 393px mobile에서 expedition card layout overflow — 다른 요소와 margin/gap 안전 확인.
- progress 계산 NaN/Infinity — durationSeconds 0인 경우 가드.

## Game Studio route

- visible gameplay (expedition tab idle moment) — Browser Use iab attempt or blocker.

## Subagent/Team Routing

- 기본 solo execution.
