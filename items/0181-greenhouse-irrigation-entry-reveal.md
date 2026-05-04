# WorkUnit #358 — 온실 물길 점검 직후 production card에 "물길 점검 완료" reveal motion으로 chain handoff arc symmetry를 닫는다

## GitHub authority

- GitHub issue: #358 https://github.com/bborok1234/strange-seed-shop/issues/358
- Branch: `codex/0181-greenhouse-irrigation-entry-reveal`
- Campaign source of truth: P0.5 Idle Core + Creative Rescue
- Runner decision: `production-game-intake-required` after #356 main CI `25304474960` success and queue empty
- Status: plan-first

## 문제 / 배경

#346(facility entry reveal), #352(storage entry reveal)는 facility/storage upgrade의 unlock moment를 reveal motion으로 마무리했다. 그러나 같은 chain의 다음 단계인 `buyGreenhouseIrrigation`은 silent 상태 변화로만 끝나고 있다. irrigation은 `+15%` production rate boost를 추가하므로 readability 관점에서도 큰 의미인데, click moment가 시각적 반응 없이 흘러간다.

또한 #354(rate breakdown chip strip) + #356(chip activation pulse) 인프라 위에서 irrigation 활성 시 새 chip("물길 +15%")이 등장하면서 pulse motion이 자연스럽게 작동해야 한다. 즉, irrigation entry reveal + chip pulse가 합쳐져 player에게 한 호흡 unlock moment가 된다.

## 목표

`buyGreenhouseIrrigation` 성공 직후 production card에 "물길 점검 완료" 2.0초 reveal motion + 동시에 chip strip의 신규 "물길 +15%" chip이 1.6s pulse 발사. 두 motion이 자연스러운 transition을 만든다.

## Small win

irrigation upgrade click → 정원 rate가 +15% 가속되는 unlock moment가 production card receipt + chip strip pulse로 한 화면에 마무리된다.

## Plan

1. `src/App.tsx`에 `GreenhouseIrrigationEntryReceipt { id; nextOrderTitle; bonusPercent }` interface + `useState` 추가.
2. `buyGreenhouseIrrigation`에 `canBuild` precheck + 성공 시 receipt fire (2_000ms timeout) + `trackEvent("greenhouse_irrigation_entry_revealed", ...)`.
3. production card className에 `greenhouseIrrigationEntryReceipt ? "has-greenhouse-irrigation-entry-receipt" : ""` 추가.
4. production card 내부 `.greenhouse-storage-entry-receipt` 직후에 `.greenhouse-irrigation-entry-receipt` 렌더 (chip "물길 점검 완료", strong "물길 점검 완료", span "다음 주문: {nextOrderTitle} 시작", small "자동 생산 +{bonusPercent}% 적용").
5. `src/styles.css`에 `.greenhouse-irrigation-entry-receipt` + chip + facility-entry keyframe 재사용.
6. focused checks → issue/PR body-file/evidence mirror → branch push → PR create/watch/merge → main CI observation.

## 수용 기준

- [ ] `buyGreenhouseIrrigation` 성공 직후 `.greenhouse-irrigation-entry-receipt`가 production card에 등장한다.
- [ ] receipt 카피는 strong "물길 점검 완료", span "다음 주문: {nextOrderTitle} 시작", small "자동 생산 +15% 적용"이다.
- [ ] receipt는 약 2초 후 자동 unmount.
- [ ] 신규 accepted manifest asset 없이 existing icon + DOM/CSS state + sparkle keyframe(facility 재사용)만 사용.
- [ ] focused regression(build) + check:visual + check:ci 통과.

## 검증 명령

- `npm run build`
- `npx playwright test --config playwright.config.ts --grep "작업대 강화는 첫 온실 설비 목표로 이어진다"` (회귀 보장)
- `npm run check:ci` 외 mirror gates

## 리스크

- buyGreenhouseIrrigation은 RouteSupply order completion + materials + pollen 모두 갖춰야 trigger. 기본 player flow에서 도달까지 단계가 많아 자동화 regression 추가가 비싸다. build/render 안정성과 기존 facility/storage entry 테스트가 통과하면 패턴 일관성으로 충분히 검증된다.
- Browser Use iab는 current-session 미발견이 예상되므로 issue 전용 blocker를 새로 기록한다.

## Subagent/Team Routing

- 기본은 solo execution.
