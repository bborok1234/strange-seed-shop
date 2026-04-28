# 게임 UI/UX 리서치와 P0 디자인 결정

Status: active
Updated: 2026-04-28
Scope: `이상한 씨앗상회` P0 Game Studio Operating Mode
Issue: #89, #95

## 왜 이 문서가 생겼나

사용자 제공 스크린샷에서 정원 안내 문구, 하이라이트, 하단 패널, seed shop row가 서로 겹치며 밭을 가리는 문제가 확인되었다. 동시에 오른쪽 `asset 26`, `save ready`, `events 8`, `runtime image generation disabled` 패널이 플레이어 화면처럼 보이고, 일부 생명체/씨앗 이미지가 실제 alpha 투명 PNG가 아니라 체커보드/배경이 박힌 RGB PNG로 노출된다.

따라서 P0 목표는 “기능이 동작한다”가 아니라 아래 상태가 되어야 한다.

> 첫 화면 3초 안에 게임 장면으로 읽히고, 플레이어가 밭/생명체/다음 행동을 방해 없이 조작하며, 자동화가 실제 화면 증거로 회귀를 잡는다.

## 리서치 근거

### 1. HUD는 게임 장면을 덮는 대시보드가 아니라 glance 정보여야 한다

Accessible Game Design의 HUD 가이드라인은 HUD를 게임 위에 올라가는 투명 오버레이로 설명하며, HUD 요소는 한눈에 읽히고 명확해야 한다고 정리한다. 특히 HUD의 크기와 배치는 플레이어가 게임을 보면서 이해할 수 있어야 한다.

Source: https://accessiblegamedesign.com/guidelines/HUD.html

프로젝트 결정:

- 정원 기본 화면의 영구 HUD는 재화, 현재 목표, 하단 탭, 즉시 실행 CTA로 제한한다.
- 긴 seed shop 목록, mission list, debug status, 운영 panel은 정원 기본 화면에서 펼치지 않는다.
- 하단 action panel은 playfield를 덮는 카드가 아니라 작고 명확한 action dock이어야 한다.

### 2. Phaser 화면은 viewport 정책을 명시해야 한다

Phaser Scale Manager는 `FIT`, `RESIZE`, `EXPAND` 등 여러 scale mode와 resize event를 제공한다. `RESIZE`는 부모 영역 전체를 채우지만 aspect ratio를 보존하지 않으므로, 모바일/데스크톱에서 “게임 캔버스 기준 비율”을 별도로 정하지 않으면 장면 구성이 쉽게 깨진다.

Source: https://docs.phaser.io/phaser/concepts/scale-manager

프로젝트 결정:

- 모바일 playable viewport는 세로형 game frame으로 고정한다: 360-430px 폭, 780-900px 높이 기준.
- 데스크톱 기본 플레이는 모바일 화면을 왼쪽에 붙여두는 대시보드가 아니라, 중앙 game frame 또는 데스크톱 game canvas 정책 중 하나를 명시한다.
- P0 즉시 안정화는 `모바일 game frame 중앙 정렬 + debug panel 숨김`으로 간다.
- P0 후속 확장은 `desktop canvas layout`을 별도 work item으로 분리한다.

### 3. 반복 가능한 실기 QA는 CLI visual regression이 기본이어야 한다

키워드: Playwright CLI visual regression은 P0의 승인된 회귀 게이트다.

Playwright 공식 문서는 `expect(page).toHaveScreenshot()` 기반 visual comparison을 제공한다. 같은 문서는 OS, headless mode, hardware 등에 따라 rendering 차이가 생길 수 있으므로 baseline을 같은 환경에서 관리해야 한다고 경고한다.

Source: https://playwright.dev/docs/test-snapshots

프로젝트 결정:

- 2026-04-28 사용자 승인에 따라 `@playwright/test`와 Playwright Chromium CLI를 PR/CI gate로 도입한다.
- P0의 첫 visual regression은 pixel baseline보다 먼저 layout regression + screenshot artifact를 고정한다. OS/font 차이로 스냅샷 baseline이 불안정해지기 전까지는 “겹침/스크롤/외부 패널” 같은 실패 조건을 자동 assertion으로 잡는다.
- `npm run check:visual`은 393x852 mobile full tab screen과 1280x900 desktop in-stage split을 검증한다.
- Browser Use가 현재 세션에서 차단될 경우 `Computer Use` 또는 CDP fallback을 사용하되, fallback 사유와 screenshot 경로를 반드시 남긴다.
- PR 본문에는 mobile/desktop before-after screenshot 또는 `N/A — UI 변화 없음`을 필수로 적는다.

### 4. 터치 대상은 최소 크기와 안전 영역을 보장해야 한다

Google Android Accessibility Help는 클릭/터치 가능한 요소가 신뢰성 있게 조작되도록 최소 48dp 정도의 크기를 권장한다.

Source: https://support.google.com/accessibility/android/answer/7101858

프로젝트 결정:

- 주요 CTA와 하단 탭은 44-48px에 가까운 실제 터치 영역을 유지한다.
- 텍스트가 줄바꿈되어도 버튼 밖으로 밀리지 않아야 한다.
- 조작 가능한 밭/수확 오브젝트는 DOM panel보다 우선적인 touch target이어야 한다.

### 5. 캐릭터/아이콘 에셋은 alpha channel이 있는 PNG여야 한다

Adobe Stock의 투명 PNG 가이드라인은 투명 배경 PNG를 utility asset으로 다루며, 체커보드나 색 배경을 투명도 표시처럼 넣지 말라고 경고한다. PNG 스펙도 alpha channel을 per-pixel transparency 정보로 다룬다.

Sources:
- https://helpx.adobe.com/stock/contributor/help/png-with-transparency.html
- https://www.libpng.org/pub/png/spec/1.2/png-1.2.pdf

프로젝트 결정:

- `creature`, `seed icon`, `ui cutout`, `fx` asset은 manifest에서 alpha 필요 category로 분류한다.
- alpha가 없거나 checkerboard/solid matte가 가장자리에 남은 asset은 `accepted`가 아니라 `needs_cutout` 또는 `accepted_with_background_exception`처럼 명시한다.
- 배경 자체인 greenhouse image와 shop card image는 예외로 둔다.
- 지금 확인된 `creature_herb_common_001.png`, `seed_herb_001_icon.png` 같은 RGB PNG는 후속 cutout/remaster 대상이다.

## P0 디자인 원칙

1. **Playfield first**: 정원 화면에서 가장 넓고 높은 대비를 가진 영역은 Phaser playfield여야 한다.
2. **One immediate action**: 정원 기본 화면에는 지금 할 수 있는 행동 하나가 가장 명확해야 한다.
3. **Secondary lists live in tabs**: seed shop, album list, mission list, shop mock은 정원 위 half overlay가 아니라 각 탭 screen으로 이동한다. 모바일에서 탭 화면은 body scroll 없이 한 viewport 안에 고정되고 긴 목록만 내부 스크롤한다.
4. **Debug is not player UI**: asset count, save state, event count, runtime-generation 상태는 debug mode에서만 보인다.
5. **Mobile and desktop are separate display modes**: 모바일은 세로 game frame, 데스크톱은 중앙 game frame 또는 별도 canvas 비율로 설계한다.
6. **Evidence or it did not happen**: UI/게임 변경은 mobile + desktop screenshot, layout checker, asset checker 중 필요한 증거를 남긴다.
7. **No runtime image generation**: 미려한 에셋이 필요해도 런타임 생성은 금지하고, Codex native image generation은 사전 제작 pipeline에서만 사용한다.

## P0 완료 조건

- 정원 첫 화면에서 안내 문구/하이라이트/패널이 밭을 가리지 않는다.
- 오른쪽 debug panel은 기본 playable 화면에서 보이지 않는다.
- 360x800, 390x844, 1280x900 중 최소 2개 viewport에서 screenshot evidence가 남는다.
- `npm run check:all`에 P0 layout/asset quality gate와 `npm run check:visual` Playwright gate가 포함된다.
- alpha가 필요한 asset의 현재 실패/예외 목록이 명시되고, 새 에셋은 checker를 통과해야 한다.
- PR마다 사용자가 바로 이해할 수 있는 small win, screenshot, verification output이 연결된다.

## 후속 리서치/제작 후보

- Codex native image generation으로 transparent cutout 재생성 batch를 만들되, `gpt-game-asset-plan/prompt/generate/review` 순서를 지킨다.
- Playwright CLI visual/layout regression은 Issue #95부터 `tests/visual/*.spec.ts`로 운영한다. Pixel snapshot baseline은 CI 환경 안정화 후 추가한다.
- 데스크톱 전용 canvas layout은 P0 안정화 후 별도 milestone로 진행한다.
