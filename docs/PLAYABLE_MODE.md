# Playable Mode / 사람 플레이 모드

Status: v0
Owner: agent
Last updated: 2026-04-28

## 목적

Agent가 장시간 feature branch에서 작업 중이어도 사람은 언제든 안정적인 `main` 기준 게임을 실행하고 직접 확인할 수 있어야 한다.

## 빠른 실행

```bash
npm run play:main
# dependencies가 없으면 한 번만:
npm run play:main:install
cd ../strange-seed-shop-play
npm run dev -- --host 127.0.0.1 --port 5174
```

브라우저에서 `http://127.0.0.1:5174`를 연다.

## 작동 방식

`npm run play:main`은 sibling worktree `../strange-seed-shop-play`를 준비한다.

- 기준: `origin/main`
- checkout 방식: detached HEAD
- 기본 포트: `5174`
- 목적: agent 작업 branch와 사람 플레이 환경 분리

## 안전 규칙

- 기존 플레이용 worktree가 dirty이면 기본 동작은 중단이다.
- 강제 초기화는 `--force`를 명시적으로 줄 때만 허용한다.
- dependency install은 자동으로 하지 않는다. 필요하면 플레이용 worktree 안에서 `npm install` 또는 `npm ci`를 실행한다.
- agent는 사람이 플레이 중인 port `5174`를 사용하지 않는다.

## 명령 옵션

```bash
node scripts/prepare-playable-main.mjs --path ../strange-seed-shop-play --port 5174
node scripts/prepare-playable-main.mjs --check
node scripts/prepare-playable-main.mjs --install
node scripts/prepare-playable-main.mjs --serve
```

- `--check`: worktree를 만들지 않고 계약과 출력만 검증한다.
- `--serve`: 준비 후 플레이용 worktree에서 dev server를 실행한다.
- `--force`: dirty 플레이용 worktree를 `origin/main`으로 되돌린다. 사람 작업이 날아갈 수 있으므로 기본 금지다.

## PR/Issue에 남길 내용

UI/게임 변경 PR은 다음을 남긴다.

- main playable command
- after screenshot 링크
- before screenshot 또는 N/A 사유
- 확인 viewport
- 사람이 직접 확인할 URL/port
