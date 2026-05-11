## 요약

#516은 #515의 `밤유리 오로 발견`이 reveal marker와 HUD 문구에서 멈추지 않도록, accepted `creature_lunar_rare_001`을 `actor_oro` playfield actor로 승격하고 `expedition_moon_fence_locked` 다음 route preview를 연결합니다.

## Small win

플레이어가 밤유리 source를 수확한 직후 `밤유리 오로 합류` actor marker와 `월정 문` 다음 route 단서가 같은 화면에 남습니다.

## 사용자/운영자 가치

- 사용자: 희귀 발견이 “끝난 카드”가 아니라 새 동료와 다음 지역 목표로 이어집니다.
- 운영자: 밤유리 rare route가 harvest/reveal 이후 actor handoff까지 검증되어 다음 dedicated actor sprite/FX 또는 expedition route slice를 근거 있게 고를 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #515 이후 `밤유리 오로 발견`은 accepted rare creature marker와 HUD receipt에 머물렀고, 정원 actor나 다음 route affordance는 없었습니다.
- After: `actor_oro`가 정원 playfield에 합류하고, HUD/action rail에 `밤유리 오로 합류 · creature_lunar_rare_001 · expedition_moon_fence_locked` 및 `월정 문 단서`가 표시됩니다.
- Handoff screenshot: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/phaser-check-night-glass-oro-handoff-393.png`
- Visual report: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/visual-report-20260511.md`
- Browser Use blocker: `reports/visual/issue-0516-night-glass-oro-actor-route-handoff/browser-use-blocker-20260511.md`

## Playable mode

- 대상 app: `npm run dev:phaser`
- 직접 확인 흐름: starter loop -> storage/research/expedition -> 초승달순 source harvest -> 밤유리 source 보기 -> 밤유리 조사 보내기 -> 밤유리 귀환 상자 열기 -> 빈 밭 `밤유리 심기` -> `돌보기` -> `밤유리 수확` -> `밤유리 오로 합류`

## 검증

- `npm run build:phaser`
- `npm run check:phaser`
- `npm run check:content`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`

## 안전 범위

- Phaser local state/action/render/checker와 운영 evidence 문서만 변경합니다.
- 새 runtime image generation/API/cache 호출은 없습니다.
- 새 accepted manifest asset은 추가하지 않고 기존 `creature_lunar_rare_001` raster와 `fx_night_glass_source_unlock_strip_v1`을 actor handoff에 재사용합니다.

## 남은 위험

- 전용 `actor_oro_explorer_strip_v1`이 아직 없어 actor animation richness는 제한적입니다. 후속 asset WorkUnit에서 plan-prompt-generate-review로 다루는 편이 낫습니다.
- 하단 HUD/action rail은 장기 progression surface가 누적되어 밀도가 높습니다.
- Browser Use `iab` callable이 현재 tool surface에 없어 Playwright fallback screenshot/telemetry로 대체했습니다.

## 작업 checklist

- [x] Plan-first artifact 갱신: `items/0274-night-glass-oro-actor-route-handoff.md`
- [x] Game Studio route 기록
- [x] Phaser state/action/HUD/render 연결
- [x] Actor/route telemetry 회귀 추가
- [x] Playwright screenshot/telemetry 회귀 추가
- [x] Browser Use blocker 기록
- [x] Local verification 통과

## 연결된 issue

Closes #516
