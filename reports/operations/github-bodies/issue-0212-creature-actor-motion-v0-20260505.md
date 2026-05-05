# 정원 creature actor motion v0

## 요약

#404는 밭 marker 위치, fresh start deadlock, safe-zone text, first-pass idle motion을 닫았다. 하지만 사용자가 지적한 핵심 품질 문제 중 “캐릭터가 도감에만 있고 게임 화면은 정적”인 문제는 아직 남아 있다. 이번 WorkUnit은 첫 발견 creature가 playfield에서 살아 움직이는 actor로 보이게 하는 v0 production slice다.

## Small win

첫 수확 후 named creature 하나가 정원 바닥에서 idle/blink/hop frame animation으로 보인다.

## Plan-first evidence

- Plan artifact: `items/0212-creature-actor-motion-v0.md`
- Source PR: #404
- Source issue: #403

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist route: `game-studio:sprite-pipeline` -> `game-studio:phaser-2d-game` -> `game-studio:game-playtest`
- 적용할 기준: sprite/FX provenance, animation binding, playfield obstruction, Browser Use hands-on QA, mobile bottom panel overlap.

## 사용자/운영자 가치

- 게임 가치: 수집한 생명체가 도감 보상 이미지가 아니라 정원에 실제로 있는 actor로 읽힌다.
- 운영사 가치: “정적인 그림만 있다”는 production blocker를 별도 WorkUnit으로 분리해 완료/미완료를 정확히 추적한다.

## Before / After 또는 Visual evidence

- Before: #404 기준으로 actor는 CSS idle loop만 있고, sprite-sheet 기반 state/motion evidence는 없다.
- After 목표: 첫 발견 creature actor가 playfield에 frame animation으로 나타나고 Browser Use screenshot/report가 남는다.
- Browser Use evidence 또는 blocker: 구현 PR에서 `reports/visual/`에 남긴다.

## Playable mode

- main 실행 명령: `npm run play:main` 후 필요 시 `npm run play:main:install`, 그리고 `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 issue가 사람 플레이 환경을 막지 않는 이유: runtime image generation, save migration, 외부 배포 없이 local gameplay actor presentation만 다룬다.

## 검증

- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:art-share`
- Focused actor motion visual regression
- Browser Use `iab`
- `npm run check:ci`

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음
- Runtime image generation 없음
- Branch protection 우회 없음

## 남은 위험

v0는 첫 creature actor 하나에 집중한다. 모든 creature roster의 고유 animation, richer interaction, full sprite pipeline은 후속 WorkUnit으로 확장한다.
