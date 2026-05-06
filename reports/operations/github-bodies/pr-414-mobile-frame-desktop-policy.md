## 요약

- 데스크톱 playable 화면에서 별도 rail/dock 분기를 제거하고 모바일 game frame을 중앙에 강제했습니다.
- 모바일 frame 내부의 plot label backing, plot row 위치, 자동 생산 support actor 배치를 조정했습니다.
- `desktop-art-share` 회귀 테스트를 desktop shell 보존 기준에서 single mobile frame 정책 기준으로 교체했습니다.

## Small win

1280px 이상 데스크톱에서도 깨진 왼쪽 rail / 오른쪽 dock 화면이 나오지 않고, 모바일과 같은 393px 정원 게임 화면이 중앙에 렌더됩니다.

## 사용자/운영자 가치

데스크톱과 모바일을 따로 QA하지 않아도 같은 정원 장면을 검수할 수 있습니다. 사용자 제보처럼 데스크톱만 UI가 무너지는 회귀를 자동으로 차단합니다.

## Before / After 또는 Visual evidence

- After desktop: `reports/visual/issue-414-mobile-frame-desktop-policy/playwright-desktop-1280-after-wait-20260506.png`
- After mobile: `reports/visual/issue-414-mobile-frame-desktop-policy/playwright-mobile-393-after-wait-20260506.png`
- Browser Use blocker 기록: `reports/visual/issue-414-mobile-frame-desktop-policy/README.md`

## Playable mode

- `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`

## 검증

- `npx playwright test tests/visual/desktop-art-share.spec.ts` — 15 passed
- `npx playwright test tests/visual/p0-mobile-game-shell.spec.ts --grep "모바일 정원 (393|360)|모바일 생산 roster|짧은 모바일 브라우저에서도 생산 actor"` — 6 passed
- `npm run build` — pass
- `npm run check:ci` — pass

## 작업 checklist

- [x] Issue/plan artifact 작성
- [x] Game Studio route 기록
- [x] Browser Use `iab` 우선 시도 및 blocker 기록
- [x] Desktop/mobile visual regression 갱신
- [x] Roadmap evidence 갱신

## 안전 범위

UI layout, CSS policy, visual regression만 변경했습니다. save schema, economy, asset manifest, 결제/배포 경로는 변경하지 않았습니다.

## 남은 위험

Browser Use `iab` backend가 이 세션에서 탐지되지 않아 Playwright screenshot이 보조 evidence입니다. 실제 in-app Browser Use 연결은 다음 세션에서 다시 확인해야 합니다.

## 연결된 issue

Closes #414

