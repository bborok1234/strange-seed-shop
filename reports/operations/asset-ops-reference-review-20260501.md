# Asset/Ops Reference Review — 2026-05-01

## 목적

사용자가 지정한 외부 skill/ops 레퍼런스를 `$seed-ops` 하네스 강화에 반영한다. 결론은 단순하다. 좋은 운영 시스템은 “좋은 의도”를 프롬프트에 적는 데서 끝나지 않고, command/skill/check/report로 분리해 다음 실행이 같은 기준을 반복하게 만든다.

## 본 레퍼런스

- Gastory: https://github.com/SeokhyunKim/claude-plugins/tree/main/gastory
- Anthropic Skills: https://github.com/anthropics/skills
- Karpathy-inspired guidelines: https://github.com/forrestchang/andrej-karpathy-skills
- Superpowers: https://github.com/obra/superpowers
- gstack: https://github.com/garrytan/gstack
- GSD: https://github.com/gsd-build/get-shit-done
- Matt Pocock skills: https://github.com/mattpocock/skills

## 관찰

1. Gastory는 game asset pipeline을 `/project`, `/style`, `/concept-art`, `/animate`, `/extract-frames`로 나누고, output을 project directory와 metadata sidecar로 남긴다. 우리에게 필요한 교훈은 asset 작업을 “나중에 참고”가 아니라 project-scoped output/evidence로 고정하는 것이다.
2. Anthropic Skills는 각 skill을 독립 폴더와 `SKILL.md`로 둔다. 우리 `$seed-ops`도 문서 조항만으로는 부족하고, drift를 잡는 checker가 같이 있어야 한다.
3. Karpathy-style guidelines의 핵심은 success criteria와 verification loop다. 이번 gate는 “asset/FX를 고려”가 아니라 “어떤 visual/game-feel payoff를 검증할지”로 바꿔야 한다.
4. Superpowers와 gstack은 plan, review, QA, ship 같은 stage를 별도 command/role로 나누고 다음 stage가 이전 산출물을 읽게 한다. 우리 control room도 다음 queue 품질 gate를 live snapshot에 반복 노출해야 한다.
5. GSD는 context rot를 문제로 본다. 같은 이유로 `$seed-ops`의 다음 queue 조건은 사람 기억이나 이전 채팅이 아니라 repo-local check로 보존해야 한다.
6. Matt Pocock skills는 작은 composable skill을 강조한다. 따라서 이번 보강은 거대한 운영 재작성 대신 `check:seed-ops-queue`라는 좁은 gate로 둔다.

## 적용 결정

- `asset/FX` 축은 기존 asset 재사용만으로는 통과하지 않는다.
- 다음 게임 issue plan은 `playfield state`, `HUD affordance`, `sprite/FX`, `order crate visual state`, `reward motion` 중 최소 하나의 concrete visual/game-feel payoff를 명시해야 한다.
- 단순 주문 추가, copy tweak, spacing tweak, test-only 작업은 경쟁작 production gap과 visual payoff가 함께 없으면 queue gate 실패로 본다.
- 이 규칙은 `.codex/skills/seed-ops/SKILL.md`, `docs/PROJECT_COMMANDS.md`, `AGENTS.md`, `docs/ROADMAP.md`, `docs/OPERATOR_CONTROL_ROOM.md`, `scripts/operator-control-room.mjs`, `scripts/check-ops-live.mjs`, `scripts/check-seed-ops-queue-gate.mjs`에 중복 고정한다.

## 검증

- `npm run check:seed-ops-queue`
- `npm run check:project-commands`
- `npm run check:ops-live`
- `npm run check:ci`
