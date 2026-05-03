## 요약

- 첫 주문이 `12/12` ready가 된 순간 주문 카드에 `출하 준비`와 `상자 봉인 완료 · 납품하면 보상 수거` 상태를 보여준다.
- `주문 납품` 직후 `상자 출하 완료` receipt, reward 수거 문구, 다음 주문 title, playfield order crate `first-dispatched` variant를 한 장면에 연결한다.
- #296 구현 중 발견한 v3 foreground operator CLI flag 회귀도 sidecar로 보정했다. 현재 Codex CLI command는 unsupported `--ask-for-approval` 대신 `-c approval_policy="never" --sandbox danger-full-access`를 생성하고 checker가 막는다.

## Small win

첫 주문 납품이 단순 버튼/숫자 완료가 아니라 “상자가 출하되고 보상이 수거됐다”는 production idle game payoff로 읽힌다.

## 사용자/운영자 가치

- 사용자 가치: 첫 5분 안의 `자동 생산 → 첫 주문 ready → 납품 → 보상 → 다음 주문` 흐름이 한 화면에서 감각적으로 이어진다.
- 운영자 가치: #296은 GitHub-authoritative WorkUnit으로 plan-first, Browser Use current-session blocker, Playwright fallback screenshot, full visual/CI evidence를 남긴다.
- 하네스 가치: Studio Harness v3 foreground operator가 현재 CLI에서 실행 불가능한 flag를 계속 안내하지 않도록 checker가 회귀를 잡는다.

## Before / After 또는 Visual evidence

- Before: 첫 주문 ready 상태가 `12/12 잎 납품 준비` 텍스트와 버튼 중심으로만 읽혀 order crate 출하/payoff가 약했다.
- After: 첫 주문 ready 상태는 `12/12 잎 · 출하 준비`, `상자 봉인 완료 · 납품하면 보상 수거`, `.order-progress-ready` 상태로 강조된다.
- After: 납품 직후 `상자 출하 완료`, `+18 잎 · +1 꽃가루 수거`, `다음 주문: 연구 준비 잎 묶음`, playfield `첫 주문 상자 출하 / 보상 수거 완료`가 보인다.
- Screenshot evidence: `reports/visual/issue-296-order-crate-dispatch-reward-motion-393.png`
- Browser Use current-session blocker: `reports/visual/browser-use-blocker-0296-20260503.md`

## Playable mode

- 안정 main 플레이 준비: `npm run play:main`
- stable main serve: `cd ../strange-seed-shop-play && npm run dev -- --host 127.0.0.1 --port 5174`
- 이 PR 변경 확인은 feature branch에서 Vite dev/preview와 Playwright 393px viewport로 수행했다.

## 검증

- [x] `npm run build` → pass
- [x] Focused regression: `npx playwright test --config playwright.config.ts --grep "자동 생산과 첫 주문|온실 설비|온실 확장 준비|동선 순환|물길 점검|물안개 응축"` → 8 passed
- [x] `npm run check:visual` → 55 passed
- [x] `npm run check:ci` → pass
- [x] `npm run check:studio-v3-operator` → pass
- [x] Browser Use `iab` current-session attempt recorded; iab backend discovery failed, Playwright fallback screenshot/regression used.

## 안전 범위

- 실제 결제, 로그인/account, ads SDK, 외부 배포, 고객 데이터, credential, 실채널 GTM 없음.
- 새 accepted manifest game asset 없음. 기존 order crate asset과 DOM/CSS state/motion만 사용한다.
- `$seed-ops`를 Studio Harness v3 entrypoint로 호출하거나 복구하지 않는다.
- `출하 준비` copy는 첫 주문 ready 상태에만 제한했다. 후속 온실 주문은 기존 `납품 준비` 문구를 유지한다.

## 남은 위험

- 현재 Codex App 세션에서 Browser Use `iab` backend가 발견되지 않았다. `node_repl js`는 노출됐고 `browser-client.mjs` 존재와 bootstrap 실패 지점을 기록했다.
- `orderDeliveryReceipt`는 1.8초 transient state다. Playwright regression이 receipt 표시와 자동 제거를 고정한다.
- v3 operator CLI flag 보정은 #296 sidecar harness fix다. 별도 사용자-visible gameplay 변화는 없지만 `check:studio-v3-operator`의 현재 CLI 계약을 맞춘다.

## 연결된 issue

Closes #296

## 작업 checklist

- [x] Plan artifact 작성: `items/0150-order-crate-dispatch-reward-motion.md`
- [x] Game Studio route 기록: `game-studio:game-studio` → `game-studio:game-ui-frontend` + `game-studio:game-playtest`
- [x] 첫 주문 ready/dispatch/reward motion 구현
- [x] 모바일 overflow/bottom-tab overlap regression 추가
- [x] Browser Use current-session 시도와 blocker 기록
- [x] Full visual/CI 검증
- [x] Roadmap/dashboard/control room evidence mirror 갱신
