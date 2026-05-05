## 요약

첫 발견 creature인 `말랑잎 포리`가 production playfield에서 정적인 PNG만 쓰지 않고, accepted sprite strip을 재생하는 actor surface로 보이게 했습니다. 새 image generation 없이 기존 `creature_herb_common_ready_strip` provenance를 actor work-idle binding으로 alias하고, Browser Use `iab`와 desktop/mobile visual regression으로 확인했습니다.

## Small win

- 이번 PR이 만든 가장 작은 승리: 정원 자동 생산 장면의 첫 creature가 sprite-strip frame animation으로 움직입니다.

## Plan-first evidence

- Plan artifact: `items/0212-creature-actor-motion-v0.md`
- Plan에서 벗어난 변경이 있다면 이유: 신규 asset generation 대신 기존 accepted strip provenance alias를 사용했습니다. v0 목적은 “생성”보다 “도감 밖 playfield actor motion” 연결이었고, 기존 strip이 이미 4-frame accepted PNG로 존재했습니다.

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:sprite-pipeline` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`
- 적용한 playfield/HUD/playtest 기준: sprite/FX provenance, animation binding, playfield obstruction, Browser Use hands-on QA, mobile bottom panel overlap.
- Game Studio route에서 벗어난 변경이 있다면 이유: 없음.

## 작업 checklist

- [x] Plan artifact의 수용 기준을 모두 확인했다.
- [x] 게임 기능/UI/에셋/QA 변경이면 Game Studio route를 기록했다.
- [x] UI/HUD 변경이면 `game-studio:game-ui-frontend` 기준으로 playfield 보호와 persistent HUD 밀도를 확인했다.
- [x] 게임 화면 QA이면 `game-studio:game-playtest` 기준으로 첫 actionable screen, main verbs, HUD readability, playfield obstruction을 확인했다.
- [x] UI/visual 변경이면 Browser Use 우선 QA를 시도하고 evidence 또는 blocker를 남겼다.
- [x] 필요한 문서/roadmap/dashboard/report를 갱신했다.
- [x] GitHub issue/PR/comment evidence를 축약 없이 남겼다.
- [x] all merge-blocking evidence must be in the original PR before merge/close.
- [x] post-merge main CI is observation-only; do not create a post-merge closeout PR or main-targeted closeout commit.

## 사용자/운영자 가치

- 게임 가치: 첫 creature가 도감 카드 밖 정원 화면에서 살아 움직이는 actor로 읽힙니다.
- 운영사 가치: “static한 그림뿐”이라는 품질 문제를 별도 WorkUnit으로 추적하고, 기존 asset provenance를 훼손하지 않는 방식으로 개선했습니다.

## Before / After 또는 Visual evidence

- Before: production actor는 static work PNG + CSS bob 수준이라 sprite-sheet actor evidence가 없었습니다.
- After: `.playfield-production-actor-sprite`가 `creature_herb_common_001_actor_work_idle_strip`을 재생합니다.
- Browser Use evidence 또는 blocker: `reports/visual/issue-405-creature-actor-motion-v0-20260505.md`
- Screenshot: `reports/visual/issue-405-creature-actor-motion-v0-browser-use-20260505.png`
- N/A 사유: 없음.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR이 사람 플레이 환경을 막지 않는 이유: save schema, runtime image generation, external service, payment, deployment 경로를 건드리지 않고 accepted sprite strip runtime binding만 추가했습니다.

## 검증

- [x] `npm run check:asset-provenance` PASS
- [x] `npm run check:asset-style` PASS
- [x] `npm run check:art-share` PASS, 21 passed
- [x] Focused mobile actor/action surface regression PASS, 1 passed
- [x] Browser Use `iab` actor sprite check PASS
- [x] `npm run check:ci` PASS
- [x] UI/visual 변경이면 Browser Use QA와 `npm run check:visual` 또는 명시 blocker + fallback PASS

## 안전 범위

- [x] 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- [x] `ENABLE_AGENT_AUTOMERGE` 변경 없음
- [x] Branch protection 우회 없음

## 남은 위험

v0는 첫 herb creature actor만 다룹니다. 다른 creature의 고유 sprite strip, richer state transition, interaction behavior는 후속 WorkUnit으로 확장해야 합니다.

## 연결된 issue

Closes #405
