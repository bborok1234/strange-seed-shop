## 문제 / 배경

현재 정원 화면은 일부 asset과 sprite가 있어도 화면 위계가 깨져 “정적인 배경 위 카드 UI”처럼 보인다. 사용자가 Browser Use 인앱 브라우저에서 확인한 source-of-truth 화면 기준으로, 밭 위치/label, actor 위치, HUD 밀도, desktop layout, fresh-start progression이 production idle collection tycoon bar를 통과하지 못한다.

## 목표

정원 첫 화면을 모바일 game frame 기준 production scene으로 재구성한다. 데스크톱에서도 중앙 모바일 frame만 보여주고, fresh start에서 즉시 행동 가능하며, gpt-image-2로 만든 plot/HUD/actor/FX asset bundle을 실제 runtime state에 연결한다.

## Small win

첫 정원 화면이 “패널 앱”이 아니라 plot, worker actor, order/production prop, primary action이 함께 보이는 살아있는 정원 장면으로 읽힌다.

## Campaign source of truth

P0.5 Idle Core + Creative Rescue

## Game Studio Department Signoff

- 기획팀: player verb는 `첫 씨앗 심기`, `성장 탭`, `수확`, `생산 잎 수령`, `주문 납품`이다.
- 리서치팀: Cats & Soup actor work scene, Egg Inc. production readability, Neko Atsume simple placement를 축소 적용한다.
- 아트팀: gpt-image-2 default, style bible reference consistency, alpha-ready PNG, manifest binding, small-size review를 요구한다.
- 개발팀: `src/App.tsx`, `src/styles.css`, `src/game/playfield/*`, `assets/source/*`, `public/assets/manifest/assetManifest.json`, `public/assets/game/**`를 우선 범위로 한다.
- 검수팀: Browser Use `iab` before/after, 393/360/desktop frame screenshot, fresh-start playable assertion을 요구한다.
- 마케팅팀: 실제 채널 게시 없이 mock-only devlog angle은 “정원이 실제로 움직이기 시작했다”로 제한한다.
- 고객지원팀: 첫 행동을 못 찾는 confusion을 high severity로 본다.

## Subagent/Team Routing

이번 Codex App pass에서는 native subagent를 사용하지 않는다. asset plan, manifest, runtime layout, Browser Use QA가 같은 write set에 결합되어 있어 leader가 직접 통합한다. 구현 후 Browser Use와 focused checks로 검수한다.

## 플레이어 가치

플레이어가 첫 3초 안에 무엇을 눌러야 하는지 알고, 첫 생명체가 정원 경제에 참여한다는 느낌을 받는다. “얘 귀엽다”에서 “얘가 정원을 실제로 움직인다”로 감정 목표를 확장한다.

## 수용 기준

- 데스크톱 브라우저에서도 중앙 모바일 game frame만 보이고 side rail/dashboard panel이 없다.
- fresh start에서 잎 0이어도 첫 씨앗/밭 행동이 가능하다.
- 정원 중심부가 permanent card에 덮이지 않고 plot/actor/order prop이 먼저 읽힌다.
- worker actor가 최소 48px 이상으로 정원 playfield에 보이고 idle/work/celebrate 중 최소 2개 motion state를 가진다.
- plot label은 plate/ribbon/shadow 처리되어 배경 위 직접 텍스트가 아니다.
- gpt-image-2 generated raster PNG provenance가 남는다.
- sprite/FX asset은 manifest `animation.binding`, frame count, frame size, frame rate를 가진다.
- Browser Use `iab` screenshot evidence가 `reports/visual/issue-0224-garden-production-redesign/`에 저장된다.

## Visual evidence 계획

- Browser Use `iab`: `?qaResearchExpeditionReady=1`
- Browser Use `iab`: fresh start 또는 reset-equivalent QA state
- 393x852 mobile frame screenshot
- 360x800 compact screenshot
- 1280x900 desktop browser 중앙 mobile frame screenshot

## Playable mode 영향

로컬 Vite playable 화면의 shell/layout/asset runtime을 바꾼다. 실제 결제, 외부 배포, 로그인, 런타임 이미지 생성은 범위 밖이다.

## 안전 범위

런타임 image generation 금지. 새 game graphic은 gpt-image-2/OpenAI Images API 또는 허용된 Codex native fallback raster PNG만 accepted manifest asset으로 등록한다. SVG/vector/code-native game graphics는 금지한다.

## 검증 명령

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-normalization`
- `npm run check:asset-alpha`
- `npm run check:p0-ui-ux`
- `npm run check:art-share`
- `npm run build`
