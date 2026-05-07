# 달빛 family reveal 원정 문 preview route visual report

Issue: #488
Branch: `codex/v1-expedition-gate-preview-route`
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

- 달빛 family reveal 후 원정 action: `reports/visual/issue-0488-expedition-gate-preview-route/phaser-check-lunar-family-revealed-393.png`
- 원정 문 preview 확정: `reports/visual/issue-0488-expedition-gate-preview-route/phaser-check-expedition-gate-preview-393.png`

## 통과한 player-facing claim

- 달빛 family reveal 후 action rail에 `원정 문 단서 보기`가 표시된다.
- 클릭 후 `expeditionGatePreviewVisible=true`가 된다.
- `facility_expedition_gate`가 preview slot/facility state로 남는다.
- 선택 대상은 `원정 문`으로 이동한다.
- action rail에는 `원정 문 preview`와 `D7 route 잠금`이 보인다.
- receipt는 `원정 문 단서 확인 · preview route 표시`를 남긴다.

## Smoke evidence summary

- leaves: `60`
- seeds: `0`
- body/document scroll: 없음, 393x852 viewport에서 scrollHeight가 innerHeight와 같음
- canvas count: `1`
- loaded topology assets: 14/14
- actors: `actor_pori`, `actor_momo`
- preview slots: `facility_order_crate`, `facility_research_shelf`, `facility_expedition_gate`
- expedition gate final state: `kind=expedition_gate`, `visualState=preview`

## 남은 리스크

- dedicated expedition gate raster/return crate FX asset은 아직 없다. 현재 환경은 `OPENAI_API_KEY`와 `SEED_ASSET_IMAGE_MODEL`이 없어 새 accepted raster asset generation을 진행하지 않았다.
- 실제 expedition timer/return/reward는 후속 WorkUnit이다.
- Browser Use hands-on evidence는 도구 노출 시 별도 QA pass로 보강해야 한다.
