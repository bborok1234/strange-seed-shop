# 달빛 새싹 수확 다음 발견 reveal visual report

Issue: #484
Branch: `codex/v1-lunar-sprout-growth-reveal`
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`
Generated: 2026-05-08

## Browser Use blocker

현재 Codex 세션에는 Browser Use `iab` 실행 도구가 노출되지 않았다. 프로젝트 계약에 따라 blocker를 기록하고, repo의 반복 가능한 Playwright smoke gate인 `npm run check:phaser`를 fallback visual QA로 사용했다.

## 검증 명령

```bash
npm run check:phaser
```

결과: pass

## 핵심 evidence

- 목표 씨앗 심기 후 상태: `reports/visual/issue-0484-lunar-sprout-growth-reveal/phaser-check-next-goal-seed-planted-393.png`
- 달빛 새싹 수확 준비: `reports/visual/issue-0484-lunar-sprout-growth-reveal/phaser-check-lunar-sprout-ready-393.png`
- 달빛 새싹 수확 후 reveal-ready: `reports/visual/issue-0484-lunar-sprout-growth-reveal/phaser-check-lunar-sprout-harvested-393.png`

## 통과한 player-facing claim

- `seed_lunar_sprout_001`은 두 번 `돌보기` 후 `ready` 상태가 된다.
- `수확` 후 plot_03은 empty로 돌아가고 `researchNextGoalSeedHarvested=true`, `researchNextGoalRevealReady=true`가 된다.
- objective는 `달빛 새싹 발견 준비 · 다음 씨앗 family reveal 대기`로 바뀐다.
- action rail에는 `달빛 새싹 수확됨`과 `다음 발견 준비 완료`가 보인다.
- receipt는 `달빛 새싹 수확 · 다음 발견 준비 · 잎 +22`를 남긴다.

## Smoke evidence summary

- leaves: `60`
- seeds: `0`
- body/document scroll: 없음, 393x852 viewport에서 scrollHeight가 innerHeight와 같음
- canvas count: `1`
- loaded topology assets: 14/14
- actors: `actor_pori`, `actor_momo`
- plot_03 final state: `empty`, growth `0`, seed 없음
- storage/research shelf 기존 progression: 유지

## 남은 리스크

- dedicated 달빛 새싹 reveal FX/portrait asset은 아직 없다. 현재 환경은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 새 accepted raster asset generation을 진행하지 않았다.
- Browser Use hands-on evidence는 도구 노출 시 별도 QA pass로 보강해야 한다.
