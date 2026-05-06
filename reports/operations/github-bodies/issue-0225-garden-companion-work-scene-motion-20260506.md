## 문제 / 배경

#423으로 데스크톱 중앙 모바일 frame, 첫 씨앗 무료 심기, plot/HUD asset 연결, raw strip artifact 응급 수정은 끝났습니다. 하지만 production-ready 정원은 아직 `정원 동료 2명 작업 중` 카드와 작은 pose 중심으로 읽혀, 사용자가 기대한 경쟁작 수준의 “캐릭터가 정원에서 일하는 장면”으로는 부족합니다.

## 목표

정원 첫 viewport에서 말랑잎 포리와 방패새싹 모모가 카드 안 아이콘이 아니라 plot/crate/workbench에 anchor된 worker actor로 보이게 만들고, 생산 motion이 worker에서 resource/order target으로 이어지게 합니다.

## Small win

`?qaResearchExpeditionReady=1` 화면에서 사용자가 패널을 읽기 전에 “동료 둘이 정원에서 일하고 있다”를 볼 수 있습니다.

## Campaign source of truth

P0.5 Idle Core + Creative Rescue. `docs/DESIGN.md`, `docs/ART_HUD_PRODUCTION_SPEC.md`, `docs/IDLE_CORE_PRODUCTION_SPEC.md` 기준을 따릅니다.

## Game Studio Department Signoff

- 기획팀: 자동 생산/주문 준비가 player verb와 연결되어야 합니다.
- 리서치팀: Cats & Soup의 character-at-station, Egg, Inc.의 visible production flow를 축소 적용합니다.
- 아트팀: actor scale/anchor/label/FX path가 393x852에서 읽혀야 하며, 신규 accepted asset은 gpt-image-2/Codex provenance가 필요합니다.
- 개발팀: runtime image generation 없이 manifest/static asset/CSS/React로 구현합니다.
- 검수팀: Browser Use `iab` before/after 증거가 필수입니다.
- 마케팅팀: 실제 외부 채널/결제/광고 없음.
- 고객지원팀: “숫자는 보이는데 누가 일하는지 모르겠다”는 첫 5분 혼란을 줄입니다.

## Subagent / Team Routing

초기 구현은 단일 lane으로 진행합니다. 수정 범위가 `src/App.tsx`, `src/game/playfield/GardenPlayfieldHost.tsx`, `src/styles.css` 및 필요 시 manifest/assets에 집중되어 병렬 편집보다 충돌 위험이 큽니다.

## 수용 기준

- `?qaResearchExpeditionReady=1` 첫 viewport에서 companion work actor 2명이 plot/crate/workbench에 anchor되어 보입니다.
- raw horizontal sprite strip이나 원형 helper badge artifact가 보이지 않습니다.
- worker -> resource/order target으로 이어지는 production motion path가 하나 이상 보입니다.
- 393x852와 desktop central mobile frame에서 top HUD/action/plot label이 actor와 충돌하지 않습니다.
- 신규 accepted asset이 있으면 provenance/manifest/animation/style/alpha/normalization gate가 통과합니다.
- Browser Use before/after evidence와 focused visual regression이 남습니다.

## Visual evidence 계획

`reports/visual/issue-0225-garden-companion-work-scene-motion/`에 Browser Use before/after screenshot과 playtest note를 남깁니다.

## Playable mode 영향

main playable mode의 runtime image generation, 결제, 로그인, 외부 배포를 건드리지 않습니다.

## 안전 범위

실제 결제, ads SDK, 계정, credential, 외부 production 배포, 고객 데이터 없음.

## 검증 명령

```bash
npm run check:p0-ui-ux
npm run check:art-share
npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --config playwright.config.ts -g "production garden visual composition|정원 동료|actor|raw strip"
npm run build
npm run check:ci
```
