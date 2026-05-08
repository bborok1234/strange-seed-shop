# 밤유리 source planting loop visual report

## 요약

- WorkUnit: `items/0272-night-glass-source-planting-loop.md`
- Issue: #512
- Branch: `codex/v1-night-glass-source-planting-loop`
- 검증 경로: Browser Use 우선 시도 실패 기록 + Playwright fallback

## 증거

- `npm run build:phaser`: 통과
- `npm run check:phaser`: 통과
- 최종 스크린샷: `reports/visual/issue-0512-night-glass-source-planting-loop/phaser-check-night-glass-planted-393.png`
- Plant action 스크린샷: `reports/visual/issue-0512-night-glass-source-planting-loop/phaser-check-night-glass-plant-action-393.png`

## 관찰

- `seed_rare_001 source 획득` 이후 빈 밭 선택 시 `밤유리 심기` action이 나타난다.
- `밤유리 심기` 후 HUD objective는 `밤유리 재배 중 · rare source 성장`으로 전환된다.
- telemetry는 `nightGlassSourceSeedAvailable=false`, `nightGlassSourceSeedPlanted=true`, plot `seedId=seed_rare_001`, `growth=24`, `state=planted`를 남긴다.
- plot 위에 `seed_rare_001_icon` overlay와 `밤유리` chip이 표시되어 일반 말랑잎 씨앗과 구분된다.

## 리스크

- 하단 action surface가 긴 progression receipt를 많이 담아 밀도가 높다. 이번 slice는 planting/growing bridge를 닫는 범위이며, harvest/reveal slice에서 rare sprout/FX와 HUD 밀도 정리를 별도 WorkUnit으로 다루는 편이 낫다.
