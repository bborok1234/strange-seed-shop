# 생명체 애착 문구 v0

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_content
Issue: #34
PR: #35

## Intent

첫 수확이 단순 재화 지급으로 끝나지 않고, 이름 있는 생명체를 “소유했다”는 감정으로 이어지게 만든다. 생명체별 성격, 좋아하는 것, 인사말을 로컬 콘텐츠로 고정하고 첫 수확 reveal, 첫 생명체 카드, 도감에서 노출해 북극성 A의 “얘 귀엽다. 하나만 더 키워볼까?” 감정 목표를 강화한다.

## Acceptance Criteria

- `CreatureDefinition`과 `src/data/creatures.json`에 `personality`, `favoriteThing`, `greeting`이 비어 있지 않게 추가된다.
- 첫 수확 reveal은 생명체 인사말을 보여준다.
- 첫 생명체 소유 카드는 성격과 좋아하는 것을 보여준다.
- 도감 카드는 이름만이 아니라 role/성격 요약도 보여준다.
- `scripts/check-content.mjs`와 `scripts/check-game-loop.mjs`가 첫 생명체 애착 문구를 검증한다.
- `npm run check:all`이 통과한다.

## Evidence

- Issue #34: https://github.com/bborok1234/strange-seed-shop/issues/34
- PR #35: https://github.com/bborok1234/strange-seed-shop/pull/35
- `npm run check:content` PASS — 첫 생명체 `personality`, `favoriteThing`, `greeting` 포함
- `npm run check:loop` PASS — firstLoopSequence 유지, firstCreatureAttachment 출력 확인
- `npm run check:all` PASS — content, loop, economy, docs, apply, dashboard, browser-qa, sprite-batch, operator, governance, audit, build
- Browser Use 우선 시도 후 JS REPL import 제약으로 CDP fallback 사용: `reports/visual/creature-attachment-browser-use-fallback-20260428.md`
- Harvest reveal 캡처: `reports/visual/creature-attachment-reveal-20260428.png`
- Ownership/첫 5분 상태 캡처: `reports/visual/creature-attachment-ownership-20260428.png`

## Proposed Plan

1. 생명체 schema와 JSON에 애착 문구 필드를 추가한다.
2. harvest reveal, ownership card, album card에 문구를 배치한다.
3. 콘텐츠/첫 루프 검증 스크립트에 필드 누락 방지 조건을 추가한다.
4. 로드맵/대시보드/heartbeat를 갱신하고 PR을 만든다.

## Apply Conditions

- Phase 0 금지 영역(결제, 로그인, 광고 SDK, 외부 이동, 런타임 이미지 생성)을 건드리지 않는다.
- 저장 구조 migration 없이 기존 save와 호환되는 정적 content/UI 표시 범위로 제한한다.
- Phaser playfield runtime boundary를 변경하지 않는다.

## Verification

- `npm run check:content`
- `npm run check:loop`
- `npm run check:all`
- 가능하면 Browser Use 기반 시각 확인, 불가하면 fallback 사유와 캡처 경로 기록
