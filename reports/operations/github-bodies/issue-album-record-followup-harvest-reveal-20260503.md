## GitHub authority

- Issue: #320 https://github.com/bborok1234/strange-seed-shop/issues/320
- Branch: `codex/0320-album-record-followup-harvest-reveal`
- Plan artifact: `items/0162-album-record-followup-harvest-reveal.md`

## 문제 / 배경

#318이 새 기록 후속 재배 성장 중 `후속 성장 중`/`수확 예고`를 보여주게 만들었지만, ready 상태에서 실제 수확을 누르는 순간이 아직 새 생명체 발견 payoff로 충분히 닫히는지 별도 WorkUnit으로 검증/강화되지 않았다. 플레이어가 다음 씨앗을 심고 성장시킨 뒤 수확 버튼을 누를 때 “예고했던 아이를 진짜 만났다”가 즉시 보여야 한다.

## 목표

`새 기록 후속 재배` source plot이 ready → harvest로 넘어갈 때 playfield/reveal/action surface가 다음 생명체 발견, 새 기록 후속 수확, 도감 저장 CTA를 한 화면 흐름으로 보여주게 만든다.

## Small win

새 기록 다음 씨앗을 끝까지 키워 수확하면 “젤리콩 통통을 정말 만났다”가 reveal/도감 저장 CTA로 바로 이어진다.

## Campaign source of truth

- P0.5 Idle Core + Creative Rescue
- Follows #318: 새 기록 후속 성장 중 수확 예고 → 실제 수확 reveal payoff

## Studio Campaign Gate

- Player verb: `새 기록 후속 씨앗 수확하기`
- Production/progression role: 후속 재배 성장 완료 → ready 밭 수확 → 새 생명체 발견 → 도감 저장
- Screen moment: #318 garden `새 기록 후속 재배` 성장 예고 상태에서 ready plot의 수확 버튼을 누른 직후
- Concrete visual/game-feel payoff: `새 기록 후속 수확` playfield feedback/reward motion, next creature reveal, 도감 저장 CTA, bottom-tab/overflow-safe mobile screenshot
- Competition production gap: collection idle games는 target planting/growth preview 이후 실제 harvest/reveal 순간에 target reward를 크게 확인시킨다. 성장 예고만 있고 수확 payoff가 평범한 reveal로 끝나는 대안은 reject한다.
- Playtest evidence: Browser Use iab 우선, blocker 시 issue 전용 blocker + 393px Playwright screenshot/layout invariant.

## Game Studio Department Signoff

- 기획팀: 수확 verb가 “하나만 더 키워볼까?”의 payoff다. 성장 예고가 실제 발견으로 닫혀야 한다.
- 리서치팀: target reward preview 뒤 harvest reveal confirmation은 경쟁작 수집 루프의 핵심이다.
- 아트팀: 신규 accepted manifest asset 없이 existing creature portrait/plot visuals, DOM/CSS reveal treatment, reward motion으로 제한한다. 새 FX가 필요하면 별도 provenance WorkUnit으로 분리한다.
- 개발팀: `src/App.tsx`, `src/game/playfield/*`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts` 중심의 좁은 tranche.
- 검수팀: Browser Use iab current-session 시도, 393px screenshot, reveal/action surface/bottom-tab invariant 필수.
- 마케팅팀: mock-only promise. 외부 채널/실결제 없음.
- 고객지원팀: “예고와 수확이 연결됐나요?” 혼란을 reveal copy/CTA로 줄인다.

## Subagent/Team Routing

- 단일 React/CSS/playfield feedback/visual regression tranche라 Codex native subagents/team mode는 기본 미사용.
- 독립 분리 기준: Phaser reward motion 변경이 커지면 runtime worker, Browser Use 복구가 필요하면 QA/verifier subtask, 새 FX asset이 필요하면 asset pipeline subtask로 분리.

## 사용자/운영자 가치

- 사용자: 새 기록 다음 씨앗을 심고 성장시킨 노력이 실제 새 생명체 발견으로 보상된다.
- 운영자: #314→#316→#318로 이어진 도감 새 기록 후속 루프를 harvest/reveal checkpoint까지 GitHub-authoritative evidence로 닫는다.

## 수용 기준

- [x] `album_record_next_seed` source plot을 ready 상태로 만든 뒤 수확하면 reveal/action feedback이 다음 생명체 이름과 `새 기록 후속 수확` 또는 동등한 payoff copy를 보여준다.
- [x] reveal 또는 action surface가 도감 저장 CTA를 명확히 보여주며, 성장 예고와 같은 target creature 이름이 유지된다.
- [x] 신규 accepted manifest asset 없이 existing visuals + DOM/CSS/playfield feedback/reward motion으로 구현하고 runtime image generation/API를 호출하지 않는다.
- [x] 393px 모바일에서 reveal/action surface/bottom tab이 겹치지 않고 overflow를 만들지 않는다.
- [x] Browser Use iab current-session 시도 evidence 또는 blocker, focused Playwright screenshot, `npm run check:visual`, `npm run check:ci`가 남는다.

## Visual evidence

- Browser Use iab target: 연구 단서 수확 → 도감 기록 CTA → 다음 씨앗 CTA → 구매/심기 → 정원 `새 기록 후속 재배` → 성장 완료 → 수확 → reveal/도감 저장 CTA.
- Browser Use blocker: `reports/visual/browser-use-blocker-0320-20260503.md` — 현재 세션 iab backend discovery 실패.
- Fallback screenshot: `reports/visual/issue-320-album-record-followup-harvest-reveal-393.png`.
- Layout invariant: 393px 모바일에서 reveal/action surface가 viewport 안에 들어오고, 도감 저장 후 garden production scene과 bottom tab이 겹치지 않음.

## Playable mode 영향

- Local dev: `npm run dev -- --host 127.0.0.1 --port 3000`
- Stable main playable mirror는 `npm run play:main` + port 5174 계약 유지.

## 안전 범위

- runtime image generation/API 호출 없음.
- 신규 accepted manifest asset 없음. existing visuals, DOM/CSS/playfield feedback, reward motion만 허용.
- real payment, customer data, external production deployment 없음.

## 검증 명령

- `npm run build` — pass
- focused Playwright: `npx playwright test --config playwright.config.ts --grep "새 기록 후속 수확|후속 재배 수확|새 생명체 발견"` — 1 passed
- `npm run check:visual` — 63 passed
- `npm run check:ci` — pass
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`

## Implementation result

- `AlbumRecordHarvestReceipt`가 후속 재배 수확 직전 seed/creature snapshot을 보존한다.
- Harvest reveal은 `새 기록 후속 생명체 발견`, `예고했던 새 생명체 수확`, `새 기록 후속 수확` receipt, `도감에 기록하기` CTA를 보여준다.
- 도감 저장 뒤 garden production scene은 `새 기록 후속 수확 · 젤리콩 통통 도감 기록`으로 예고와 실제 발견을 이어준다.
