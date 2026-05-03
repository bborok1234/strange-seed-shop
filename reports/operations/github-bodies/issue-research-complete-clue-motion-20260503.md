## 요약

P0.5 Idle Core + Creative Rescue 다음 WorkUnit이다. 두 번째 주문 보상으로 열린 `새싹 기록법 연구`를 완료하는 순간이 현재는 다음 진행 텍스트로만 읽히기 쉬우므로, 연구 완료 보상이 `도감 단서 기록` reward motion과 playfield/HUD 상태로 이어지게 만든다.

## Small win

플레이어가 `새싹 기록법 연구`를 누르면 “연구가 끝났다”가 아니라 “단서가 도감에 꽂혔고 다음 씨앗/생명체 목표가 열렸다”를 393px 모바일 첫 화면에서 즉시 본다.

## 사용자/운영자 가치

- 사용자: 주문 → 연구 → 도감/다음 씨앗 목표의 progression chain이 한 장면에서 이해된다.
- 운영자: queue-empty 후 선택한 작업이 작은 copy tweak이 아니라 `player verb + production/progression role + screen moment + reward motion + playtest evidence`를 갖춘 production vertical slice임을 GitHub issue/PR/CI evidence로 남긴다.

## Before / After 또는 Visual evidence

- Before: 연구 버튼 활성화까지는 #302에서 보이지만, 연구 완료 순간의 보상이 도감 단서/다음 목표로 움직이는 production payoff가 약하다.
- After: 연구 완료 직후 action surface와 playfield에 `도감 단서 기록`, `다음 씨앗 목표`, `연구 노트 저장` 상태가 보이고, 하단 탭과 겹치지 않는 모바일 screenshot evidence를 남긴다.
- Visual evidence target: `reports/visual/issue-304-research-complete-clue-motion-393.png` 및 Browser Use blocker/evidence.

## Playable mode

- `npm run dev -- --host 127.0.0.1 --port 3000`
- QA deep link/state는 구현 중 기존 visual test fixture를 재사용하거나 필요한 최소 QA helper만 추가한다.

## 검증

- `npm run build`
- focused Playwright: 연구 완료 보상 motion/overflow regression
- `npm run check:visual`
- `npm run check:ci`
- `npm run update:dashboard`
- `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`
- `npm run check:dashboard`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `npm run check:seed-ops-queue`
- `npm run check:closed-workunit-mirrors`

## 안전 범위

- real payment, customer data, external production deployment 없음.
- runtime image generation/API 호출 금지.
- 신규 accepted manifest asset은 만들지 않는다. 이번 축은 DOM/CSS reward motion, playfield state, HUD affordance이며 새 raster asset이 필요해지면 별도 asset plan/prompt/generate/review gate로 분리한다.

## 남은 위험

- Browser Use iab가 현재 Codex 세션에서 발견되지 않을 수 있다. 이 경우 이번 issue 전용 blocker를 `reports/visual/`에 새로 남기고 Playwright screenshot을 regression gate로 사용한다.
- 연구 완료 receipt와 기존 주문/생산 receipt가 동시에 떠서 모바일 action surface overflow가 생길 수 있다.

## 연결된 issue

- GitHub issue: #304 https://github.com/bborok1234/strange-seed-shop/issues/304
- Follows #302
- Campaign: P0.5 Idle Core + Creative Rescue
