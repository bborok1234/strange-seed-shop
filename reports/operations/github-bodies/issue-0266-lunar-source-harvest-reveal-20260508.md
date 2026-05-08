# 초승달순 source harvest reveal bridge

## 문제 / 배경

#499에서 첫 원정 보상 source는 `초승달순 심기`와 `seed_lunar_002` planted state까지 이어졌습니다. 하지만 v1 smoke path에서는 planted state에서 멈추고 달방울 family creature reveal이나 다음 rare route promise가 없습니다.

## 목표

`seed_lunar_002`를 player action으로 ready/harvest까지 진행시키고, accepted lunar creature raster와 lunar harvest FX binding으로 보상 순간을 남깁니다.

## Small win

- 이번 issue가 만들 가장 작은 승리: 원정 보상으로 심은 초승달순 씨앗을 수확해 달방울 생명체 reveal과 다음 rare route hint를 본다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- 북극성/플레이어 동사: `초승달순 수확`
- Playfield 보호 또는 UI surface 원칙: plot harvest state, lunar creature/FX payoff, HUD source surface를 한 화면에 남긴다.
- Playtest evidence 계획: Browser Use tool 미노출 시 Playwright fallback으로 mobile 393 screenshot과 telemetry를 저장한다.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0266-lunar-source-harvest-reveal.md`
- 예상 변경 단계: state/action, accepted creature/FX preload/render, checker screenshot/assertion, evidence 문서.
- 검증 계획: `npm run check:phaser`, `npm run check:ci`, `git diff --check`.
- 건드리지 않을 범위: 실제 650잎 구매, 22분 real-time 성장, 새 image generation, 결제/외부 배포.

## 플레이어 가치 또는 운영사 가치

- 게임 가치: 첫 원정 보상 씨앗이 심기에서 끝나지 않고 달방울 생명체와 다음 rare route 욕구로 이어진다.
- 운영사 가치: `seed_lunar_002` D7 source loop가 state, runtime raster/FX binding, screenshot evidence로 검증된다.

## 수용 기준

- [ ] `seed_lunar_002` planted plot은 player action으로 ready 상태까지 진행된다.
- [ ] ready plot에서 `초승달순 수확` action이 보인다.
- [ ] action 후 `lunarSourceSeedHarvested === true`, `lunarSourceCreatureRevealed === true`가 된다.
- [ ] accepted lunar creature raster asset과 lunar harvest FX binding이 runtime에서 보인다.
- [ ] 다음 route/rare source promise가 objective 또는 HUD surface에 남는다.
- [ ] `npm run check:phaser`, `npm run check:ci`, `git diff --check`가 통과한다.

## Visual evidence 계획

- Before screenshot: `reports/visual/issue-0498-lunar-source-planting-loop/phaser-check-lunar-source-planted-393.png`
- After screenshot: `reports/visual/issue-0500-lunar-source-harvest-reveal/phaser-check-lunar-source-harvested-393.png`
- Browser Use 우선 QA 계획 또는 N/A 사유: Browser Use plugin tool이 노출되면 iab로 확인한다. 현재 세션에서 미노출이면 visual report에 blocker를 기록하고 Playwright fallback을 사용한다.
- N/A 사유: N/A.

## Playable mode 영향

- [x] 사람이 `npm run play:main`으로 main 게임을 계속 실행할 수 있다.
- 변경 확인 URL/port: local Phaser smoke는 `127.0.0.1:4183`, stable playable main은 `127.0.0.1:5174`.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- Branch protection 우회 없음.
- Runtime image generation/API/cache 호출 없음.

## 검증 명령

- 기본 CI gate: `npm run check:ci`
- UI/visual 변경: Browser Use QA 또는 blocker + Playwright fallback, `npm run check:phaser`

---

작성 규칙 준수: 이 본문은 `--body-file`로 제출한다.
