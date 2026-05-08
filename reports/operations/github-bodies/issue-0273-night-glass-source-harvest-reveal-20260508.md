# 밤유리 source harvest reveal

## 요약

#512가 `seed_rare_001 source`를 빈 밭 `밤유리 심기`로 연결했으므로, 이번 issue는 심은 밤유리 source를 `돌보기 -> 밤유리 수확 -> creature_lunar_rare_001 reveal` payoff로 닫는다.

## Small win

플레이어가 rare source를 심은 뒤 실제 새 rare creature 발견까지 확인한다.

## 사용자/운영자 가치

- 사용자: `밤유리 심기`가 단순 상태 변화가 아니라 새 rare creature reveal로 이어진다는 보상을 본다.
- 운영자: v1 rare route가 preview/acquisition/planting에서 멈추지 않고 harvest/reveal evidence까지 확장된다.

## Before / After 또는 Visual evidence

- Before: PR #513 이후 `seed_rare_001`은 planted/growing 상태까지만 검증된다.
- After 목표: ready screenshot, `밤유리 수확` action, `밤유리 오로 발견` reveal screenshot/telemetry를 남긴다.
- Planned visual evidence: `reports/visual/issue-0514-night-glass-source-harvest-reveal/`

## Playable mode

- 대상 app: `npm run dev:phaser`
- 경로: #513 smoke path 이후 `seed_rare_001` plot을 돌보고 `밤유리 수확`을 클릭한다.

## 검증

- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Phaser local state/action/render/checker만 변경한다.
- 새 runtime image generation/API/cache 호출 없음.
- 실결제/광고/외부 채널 없음.

## 남은 위험

- 기존 `fx_night_glass_source_unlock_strip_v1`를 harvest reveal binding으로 재사용한다. visual payoff가 약하면 dedicated reveal FX generation WorkUnit을 후속으로 분리한다.

## 작업 checklist

- [x] Plan-first artifact: `items/0273-night-glass-source-harvest-reveal.md`
- [x] Game Studio route 기록
- [ ] Phaser state/action/HUD/render 연결
- [ ] Playwright screenshot/telemetry 회귀 추가
- [ ] Browser Use blocker 또는 hands-on evidence 기록
- [ ] Local verification 통과

## 연결된 issue

Follow-up to #512 / PR #513.
