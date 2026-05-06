## 문제 / 배경

사용자 제보 화면에서 데스크톱 정원은 별도 rail/dock shell 때문에 실제 게임 화면이 깨졌습니다. 모바일 정원은 더 나은 기준이지만 밭 marker 위치, 텍스트 가독성, 자동 생산 actor 배치가 아직 불안정합니다.

## 목표

데스크톱 브라우저에서도 모바일 세로 game frame을 중앙에 강제해 단일 UI/UX 기준으로 운영하고, 모바일 frame 내부의 plot/production 배치를 정리합니다.

## Small win

1280px 이상 데스크톱에서도 깨진 rail/dock 화면 대신 모바일 정원 화면 하나만 중앙에 보입니다.

## Campaign source of truth

P0.5 Idle Core + Creative Rescue / Mobile-desktop viewport policy.

## Game Studio Department Signoff

- 기획팀: 첫 화면에서 바로 정원/생산/밭 상태를 읽게 한다.
- 리서치팀: 경쟁작 idle mobile game처럼 세로 frame을 우선하고 desktop은 wrapper로 처리한다.
- 아트팀: 배경 art를 별도 dock/panel로 잘라먹지 않는다.
- 개발팀: desktop shell branch를 축소하고 single frame CSS/React 정책으로 회귀를 막는다.
- 검수팀: Browser Use 우선, 실패 시 blocker 기록 + Playwright screenshot/regression.
- 마케팅팀: 실제 채널/결제 변화 없음.
- 고객지원팀: 데스크톱 첫 화면에서 “뭘 눌러야 하는지 없음” 혼란을 줄인다.

## Subagent/Team Routing

단일 React/CSS/test slice라 Codex 단독 처리. 병렬 subagent보다 Browser Use/visual regression loop가 병목이다.

## 수용 기준

- desktop viewport에서 `.desktop-shell`이 모바일 frame 폭으로 제한된다.
- desktop rail/dock이 보이지 않는다.
- desktop에서도 5개 bottom tabs가 모바일과 같은 frame 하단에 있다.
- `qaResearchExpeditionReady=1`에서 production lane/plot row/action surface가 겹치지 않는다.
- mobile 393/360에서 plot label과 support actor 배치가 읽힌다.

## Visual evidence 계획

- Browser Use `iab` before/after screenshot을 `reports/visual/issue-desktop-mobile-frame-unification/`에 저장한다.
- Browser Use 연결 실패 시 blocker를 같은 report에 남기고 Playwright screenshot을 보조 evidence로 남긴다.

## Playable mode 영향

로컬 playable URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`

## 안전 범위

UI layout/test만 변경. 경제/save/asset manifest 변경 없음.

## 검증 명령

- `npx playwright test tests/visual/desktop-art-share.spec.ts`
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 정원 393|모바일 정원 360|research expedition ready|생산 roster"`
- `npm run build`

