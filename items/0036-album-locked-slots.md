# Album locked slots and collection clues v0

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_feature
Issue: #54
Branch: `codex/album-locked-slots`

## Intent

도감이 발견한 생명체만 보여주면 수집해야 할 남은 목표가 약하다. 미발견 슬롯, rarity/family 단서, 관련 씨앗 힌트를 보여줘 플레이어가 “다음 칸을 채우고 싶다”고 느끼게 한다.

## Acceptance Criteria

- 도감 탭이 전체 생명체 수 대비 발견 수를 보여준다.
- 발견한 생명체는 기존처럼 이름/성격/asset을 보여준다.
- 미발견 생명체는 silhouette/`???`, rarity/family 단서, 관련 씨앗 힌트, `미발견 슬롯` 배지를 보여준다.
- `qaTab=album`은 local dev에서만 visual QA용 탭 진입을 재현한다.
- `npm run check:loop`가 locked album slot UI 문구와 전체/발견 count를 검증한다.
- `npm run check:all`이 통과한다.
- 모바일/데스크톱 visual evidence가 `reports/visual/`에 저장된다.

## Evidence

- Issue #54: https://github.com/bborok1234/strange-seed-shop/issues/54
- Context snapshot: `.omx/context/album-locked-slots-20260428T052000Z.md`
- Mobile evidence: `reports/visual/album-locked-slots-mobile-20260428.png`
- Desktop evidence: `reports/visual/album-locked-slots-desktop-20260428.png`
- Browser Use first attempt: skill read; Node REPL `js` tool still unavailable in this environment, so accepted CDP fallback capture was used.
- Local check: `npm run check:loop` PASS
- Local build: `npm run build` PASS
- Local check: `npm run check:all` PASS
- Visual verdict: PASS score 92 (`.omx/state/album-locked-slots/ralph-progress.json`)
- Architect verification: APPROVED
- PR: pending

## Proposed Plan

1. 도감 탭을 전체 생명체 grid로 바꾸고 발견/미발견 상태를 분기한다.
2. 미발견 슬롯에 silhouette, rarity/family, source seed hint를 표시한다.
3. local-only `qaTab=album`을 추가해 visual QA가 도감 탭을 바로 재현하게 한다.
4. `check-game-loop`에 locked slot 문구/count 검증을 추가한다.
5. 모바일/데스크톱 visual evidence와 로컬 검증을 남긴다.

## Apply Conditions

- save schema를 변경하지 않는다.
- runtime image generation, external navigation, 결제/로그인/ads SDK를 추가하지 않는다.
- 실제 고객 데이터, credential, 실채널 GTM을 건드리지 않는다.
- 새 dependency를 추가하지 않는다.

## Verification

- `npm run check:loop`
- `npm run check:all`
- Visual: `reports/visual/album-locked-slots-mobile-20260428.png`, `reports/visual/album-locked-slots-desktop-20260428.png`
- GitHub PR checks: `Verify game baseline`, `Check automerge eligibility`
