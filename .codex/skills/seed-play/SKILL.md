---
name: seed-play
description: 이상한 씨앗상회 프로젝트 전용 사람 플레이 준비 모드. 사용자가 `$seed-play`, 게임 실행해볼 수 있게, playable main, 내가 확인할 수 있게 해줘라고 요청할 때 사용한다. agent 작업 branch와 별도로 main playable worktree/port를 준비한다.
---

# Seed Play

## Purpose

사용자가 에이전트 작업 중에도 안정적인 main 게임을 직접 실행하고 확인할 수 있게 한다.

## Workflow

- 기본 확인: `npm run play:main -- --check`
- 필요 시 준비: `npm run play:main`
- 필요 시 설치/서브: `npm run play:main:serve`
- 기본 playable worktree: `../strange-seed-shop-play`
- 기본 port: `5174`

## Guardrails

- 이 모드는 제품 코드 구현이 아니라 실행 준비다.
- agent 작업 branch를 사람이 플레이하는 main worktree와 섞지 않는다.
- 실패하면 필요한 명령, 로그, 현재 blocker를 짧게 보고한다.
