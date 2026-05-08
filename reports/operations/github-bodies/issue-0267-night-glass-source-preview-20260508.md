# 밤유리 source preview bridge

## 문제 / 배경

#501에서 `seed_lunar_002` 수확은 `은빛이끼 루미` reveal과 `밤유리 source` hint까지 이어졌습니다. 하지만 아직 다음 rare route가 화면의 locked/source node로 남지 않아 장기 목표가 텍스트 예고 수준에 머뭅니다.

## 목표

루미 reveal 후 `밤유리 source 보기` player verb를 추가하고, accepted `creature_lunar_rare_001` silhouette와 lock pulse로 D30 rare source preview node를 playfield/HUD에 고정합니다.

## Small win

- 이번 issue가 만들 가장 작은 승리: 루미 발견 뒤 다음 장기 목표인 `밤유리 source`가 action, HUD, playfield marker로 보인다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:web-game-foundations -> game-studio:game-ui-frontend -> game-studio:phaser-2d-game -> game-studio:game-playtest`
- 북극성/플레이어 동사: `밤유리 source 보기`
- Playfield 보호 또는 UI surface 원칙: rare route preview를 별도 dashboard가 아니라 research/expedition 사이 locked node로 표시한다.
- Playtest evidence 계획: Browser Use tool 미노출 시 Playwright fallback으로 mobile 393 screenshot과 telemetry를 저장한다.

## Plan

- 구현 전 작성/검토할 plan artifact: `items/0267-night-glass-source-preview.md`
- 예상 변경 단계: state/action, accepted rare creature silhouette preload/render, checker screenshot/assertion, evidence 문서.
- 검증 계획: `npm run check:phaser`, `npm run check:ci`, `git diff --check`.
- 건드리지 않을 범위: 실제 `seed_rare_001` 구매/재배, 새 image generation, 결제/외부 배포.

## 플레이어 가치 또는 운영사 가치

- 게임 가치: 달방울 source 수확이 다음 rare seed route로 이어져 장기 collection desire를 만든다.
- 운영사 가치: D30 rare source promise가 state, runtime raster binding, screenshot evidence로 검증된다.

## 수용 기준

- [ ] 루미 reveal 후 `밤유리 source 보기` action이 보인다.
- [ ] action 후 `nightGlassSourcePreviewVisible === true`가 된다.
- [ ] HUD/action rail에 `밤유리 source`, `seed_rare_001`, `expedition_night_glass` 또는 동일 의미의 locked route promise가 남는다.
- [ ] Playfield에는 accepted `creature_lunar_rare_001` 기반 rare silhouette/source marker가 보인다.
- [ ] Runtime image generation/API/cache 호출이 없다.
- [ ] `npm run check:phaser`, `npm run check:ci`, `git diff --check`가 통과한다.

## Visual evidence 계획

- Before screenshot: `reports/visual/issue-0500-lunar-source-harvest-reveal/phaser-check-lunar-source-harvested-393.png`
- After screenshot: `reports/visual/issue-0502-night-glass-source-preview/phaser-check-night-glass-source-preview-393.png`
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
