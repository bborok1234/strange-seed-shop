## 요약

#514는 #513의 `seed_rare_001` planted 상태가 재배 payoff 없이 멈추지 않도록 `돌보기 -> 밤유리 수확 -> creature_lunar_rare_001 reveal`을 Phaser playable loop에 연결합니다.

## Small win

플레이어가 밤유리 source를 심은 뒤 돌보고 수확하면 `밤유리 오로 발견` marker, HUD, receipt, telemetry가 한 화면에서 닫힙니다.

## 사용자/운영자 가치

- 사용자: 희귀 source를 심은 기대가 새 rare creature 발견으로 회수됩니다.
- 운영자: 밤유리 route가 preview/acquisition/planting에서 harvest/reveal까지 이어져 다음 rare route 또는 dedicated reveal FX 후보를 근거 있게 고를 수 있습니다.

## Before / After 또는 Visual evidence

- Before: #513 이후 `seed_rare_001`은 planted/growing 상태까지만 있고, ready harvest action과 rare creature reveal payoff가 없었습니다.
- After: ready plot에 `밤유리 수확`이 표시되고, 수확 후 `밤유리 오로 발견 · creature_lunar_rare_001` HUD와 accepted rare creature marker가 보입니다.
- Ready: `reports/visual/issue-0514-night-glass-source-harvest-reveal/phaser-check-night-glass-ready-393.png`
- Revealed: `reports/visual/issue-0514-night-glass-source-harvest-reveal/phaser-check-night-glass-revealed-393.png`
- Visual report: `reports/visual/issue-0514-night-glass-source-harvest-reveal/visual-report-20260508.md`
- Browser Use blocker: `reports/visual/issue-0514-night-glass-source-harvest-reveal/browser-use-blocker-20260508.md`

## Playable mode

- 대상 app: `npm run dev:phaser`
- 직접 확인 흐름: starter loop -> storage/research/expedition -> 초승달순 source harvest -> 밤유리 source 보기 -> 밤유리 조사 보내기 -> 밤유리 귀환 상자 열기 -> 빈 밭 `밤유리 심기` -> `돌보기` -> `밤유리 수확`

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
- 새 accepted manifest asset은 추가하지 않고 기존 `creature_lunar_rare_001`과 `fx_night_glass_source_unlock_strip_v1`을 reveal payoff에 재사용합니다.

## 남은 위험

- 하단 action surface가 장기 progression receipt와 goal surface를 많이 담아 밀도가 높습니다. HUD density pass는 후속 WorkUnit에서 별도 acceptance로 다루는 편이 낫습니다.
- 기존 night-glass FX strip 재사용이 production reveal로 약하면 dedicated `fx_night_glass_harvest_reveal_strip_v1` plan-prompt-generate-review WorkUnit을 열어야 합니다.
- Browser Use `iab` callable이 현재 tool surface에 없어 Playwright fallback으로 대체했습니다.

## 작업 checklist

- [x] Plan-first artifact 갱신: `items/0273-night-glass-source-harvest-reveal.md`
- [x] Game Studio route 기록
- [x] Phaser state/action/HUD/render 연결
- [x] Playwright screenshot/telemetry 회귀 추가
- [x] Browser Use blocker 기록
- [x] Local verification 통과

## 연결된 issue

Closes #514
