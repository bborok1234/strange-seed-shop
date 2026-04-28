# Agent Operator Control Room Research — 2026-04-28

Status: reference
Issue: #87

## 조사 대상

- ClawSweeper: https://github.com/openclaw/clawsweeper
- ClawSweeper guide: https://clawsweeper.click/
- GitHub Copilot Agents panel / Mission Control: https://github.blog/news-insights/product-news/agents-panel-launch-copilot-coding-agent-tasks-anywhere-on-github/
- GitHub Copilot cloud agent docs: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
- Wiggum Ralph loop: https://wiggum.app/blog/what-is-the-ralph-loop/
- iannuttall/ralph: https://github.com/iannuttall/ralph
- Ralphy: https://ralphy.goshen.fyi/
- AIWG issue-driven/external Ralph: https://github.com/jmagly/aiwg
- Agentic PR studies: arXiv 2509.14745, 2601.15195, 2602.08915

## 핵심 발견

1. ClawSweeper는 dashboard를 queue/review/apply/audit health를 보여주는 운영 표면으로 사용한다.
2. GitHub Mission Control은 task 시작, 진행 상태, session logs, PR jump를 한 곳에 둔다.
3. Ralph 계열은 파일/git 상태를 memory로 삼고, phase isolation과 stale recovery를 중요하게 둔다.
4. Agentic PR 연구는 작은 scope, green CI, 명확한 reviewer engagement가 중요하다고 시사한다.
5. 우리 repo에는 자동 실행 증거는 늘었지만, 사람이 보는 mission board와 playable mode가 부족하다.

## 적용 결정

- `docs/OPERATOR_CONTROL_ROOM.md`를 living contract로 둔다.
- issue/PR 템플릿에 small win, visual evidence, playable mode를 필수화한다.
- `npm run play:main`으로 사람 플레이용 detached `origin/main` worktree를 만든다. Playable mode는 agent branch와 사람 검수 환경을 분리하는 필수 운영 표면이다.
- `npm run check:control-room`으로 control room/템플릿/playable mode 계약을 검증한다.
