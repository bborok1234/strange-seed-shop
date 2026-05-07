# 달빛 새싹 발견 확인 research family reveal visual report

Issue: #486
Branch: `codex/v1-lunar-sprout-discovery-confirm`
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

- 달빛 새싹 수확 후 확인 action: `reports/visual/issue-0486-lunar-sprout-discovery-confirm/phaser-check-lunar-sprout-harvested-393.png`
- 달빛 family reveal 확정: `reports/visual/issue-0486-lunar-sprout-discovery-confirm/phaser-check-lunar-family-revealed-393.png`

## 통과한 player-facing claim

- 달빛 새싹 수확 후 action rail에 `발견 확인`이 표시된다.
- `발견 확인` 클릭 후 `researchNextGoalRevealReady=false`, `researchLunarFamilyRevealed=true`가 된다.
- 선택 대상은 `연구 선반`으로 이동한다.
- action rail에는 `달빛 family reveal`과 `다음 연구 목표: 원정 문 단서`가 보인다.
- receipt는 `달빛 새싹 발견 확인 · 달빛 family reveal`을 남긴다.

## Smoke evidence summary

- leaves: `60`
- seeds: `0`
- body/document scroll: 없음, 393x852 viewport에서 scrollHeight가 innerHeight와 같음
- canvas count: `1`
- loaded topology assets: 14/14
- actors: `actor_pori`, `actor_momo`
- research shelf final surface: 달빛 family reveal
- plot_03 final state: `empty`, growth `0`, seed 없음

## 남은 리스크

- dedicated 달빛 family reveal FX/portrait asset은 아직 없다. 현재 환경은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 새 accepted raster asset generation을 진행하지 않았다.
- Browser Use hands-on evidence는 도구 노출 시 별도 QA pass로 보강해야 한다.
