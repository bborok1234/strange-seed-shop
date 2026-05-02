## 요약

- 달방울 누누 stage의 `돌보기`를 save-backed one-time care memory reward로 연결했습니다.
- `care_lunar_nunu_001` 수령 시 +18 잎이 한 번만 지급되고, 이후 stage CTA는 `도감 기록 보기`로 바뀝니다.
- 도감 memory photo에 `누누 돌봄 도장`과 `도감 돌봄 기억 도장`을 추가해 보상표보다 먼저 돌봄 기록을 보여줍니다.

## Small win

정원 첫 화면에서 누누를 돌보면 작은 달빛 보상 motion이 뜨고, 방금 돌본 기록이 도감 사진에 남아 “얘를 돌봤다”는 감정이 progression으로 저장됩니다.

## Plan-first evidence

- GitHub issue: #282
- Plan artifact: `items/0143-lunar-care-memory-reward.md`
- Issue body mirror: `reports/operations/issue-282-body-20260503.md`
- Candidate comparison, Strategic Jump Check, Game Studio route, Department Signoff, Subagent/Team Routing 기록 완료

## 사용자/운영자 가치

- 사용자: 보이는 resident를 눌렀을 때 실제 보상/기록이 남아 첫 5분 attachment와 다음 행동 clarity가 좋아집니다.
- 운영자: #275에서 복구한 stage가 단순 장식으로 끝나는 회귀를 save schema, visual regression, GitHub WorkUnit evidence로 막습니다.

## Before / After 또는 Visual evidence

- Before: `돌보기`는 React local state만 바꿔 저장되는 보상/도감 기록이 없었습니다.
- After:
  - `reports/visual/lunar-care-memory-reward-20260503.png`
  - `reports/visual/lunar-care-album-stamp-20260503.png`
- Browser Use current-session blocker: `reports/visual/browser-use-blocker-0282-20260503.md`
- Playtest report: `reports/visual/0282-lunar-care-memory-reward-playtest-20260503.md`

## Playable mode

- 사람 확인용 stable main worktree는 기존 계약대로 `npm run play:main` 후 `../strange-seed-shop-play`에서 port 5174로 실행합니다.
- 이 PR의 직접 확인 URL: `/?qaLunarOrderReady=1&qaReset=1`
- 동작 순서: `돌보기` → `달빛 돌보기 기억 보상` 확인 → `도감 기록 보기` → 도감 `누누 돌봄 도장` 확인

## Game Studio route

- Umbrella: `game-studio:game-studio`
- Specialist: `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `browser-use:browser`
- Browser Use `iab`: current session에서 Node REPL `js` tool이 노출되지 않아 blocker를 기록하고 Playwright fallback screenshot을 사용했습니다.

## 작업 checklist

- [x] Plan-first artifact 작성
- [x] Game Studio route 기록
- [x] Save-backed care memory/reward 구현
- [x] Stage reward motion/HUD affordance 구현
- [x] Album memory stamp 구현
- [x] 중복 지급 방지 regression 추가
- [x] Browser Use current-session blocker 기록
- [x] Focused visual regression 통과
- [x] Full visual regression 통과
- [x] `npm run check:ci` 통과
- [ ] GitHub checks 확인
- [ ] Merge 후 main CI 관찰

## 검증

- `npm run check:visual -- --grep "돌보기|기억 도장|care reward"` → 1 passed
- `npm run check:visual -- --grep "creature stage|도감은 보상표|달빛 보호 주문|돌보기|기억 도장|care reward"` → 4 passed
- `npm run check:visual` → 53 passed (4.8m)
- `npm run check:ci` → passed

## 안전 범위

- 신규 accepted manifest asset 없음
- runtime image generation/API 호출 없음
- economy 대규모 튜닝 없음; +18 잎 one-time reward로 제한
- 결제/광고/고객 데이터/외부 배포 없음
- v2 local campaign ledger authority 사용 없음

## 남은 위험

- Browser Use `iab` hands-on QA는 current session에서 Node REPL `js` 미노출로 막혀 Playwright fallback을 사용했습니다.
- care memory save field는 v2 normalize로 기본값을 채우지만, 향후 care memory가 늘어나면 별도 content config로 분리할 수 있습니다.

## 연결된 issue

Closes #282
