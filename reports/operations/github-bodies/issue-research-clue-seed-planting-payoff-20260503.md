## 요약

P0.5 Idle Core + Creative Rescue 다음 WorkUnit이다. #304가 `새싹 기록법 연구` 완료를 도감 단서/다음 씨앗 목표로 보이게 만들었으므로, 이제 플레이어가 그 단서를 따라 목표 씨앗을 구매하고 심는 순간까지 production payoff로 연결한다.

## Small win

연구 단서를 본 플레이어가 씨앗 탭에서 목표 씨앗을 구매/심기하면, 정원 playfield와 action surface에 `연구 단서 씨앗 심기` 상태가 남아 “단서가 실제 수집 행동으로 이어졌다”를 바로 이해한다.

## 사용자/운영자 가치

- 사용자: 연구 보상이 읽을거리에서 끝나지 않고 다음 생명체를 만나기 위한 씨앗 행동으로 닫힌다.
- 운영자: queue-empty 후에도 P0.5 campaign chain을 계속 밀고, WorkUnit/PR/CI evidence로 production game quality를 전진시킨다.

## Before / After 또는 Visual evidence

- Before: 연구 완료 후 다음 씨앗 목표는 보이지만, 목표 씨앗 구매/심기 순간의 연구 단서 payoff가 약하다.
- After: 목표 씨앗 row, 구매/심기 CTA, garden playfield에 `연구 단서 심기` reward motion/HUD affordance가 보인다.
- Visual evidence target: `reports/visual/issue-306-research-clue-seed-planting-payoff-393.png` 및 Browser Use evidence/blocker.

## Playable mode

- `npm run dev -- --host 127.0.0.1 --port 3000`
- QA state는 기존 `qaResearchComplete=1` 흐름을 우선 사용하고, 필요한 경우 최소 QA helper만 추가한다.

## 검증

- `npm run build`
- focused Playwright: 연구 단서 씨앗 구매/심기 payoff
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

- runtime image generation/API 호출 금지.
- 신규 accepted manifest asset 없음. 이번 WorkUnit은 DOM/CSS reward motion, playfield state, HUD affordance로 제한한다.
- real payment, customer data, external production deployment 없음.

## 남은 위험

- 목표 씨앗 구매/심기 CTA가 이미 여러 surface에 있어 중복 CTA/overflow가 생길 수 있다.
- Browser Use iab가 현재 세션에서 계속 미발견될 수 있다. 이 경우 issue 전용 blocker를 새로 남긴다.

## 연결된 issue

- GitHub issue: #306 https://github.com/bborok1234/strange-seed-shop/issues/306
- Follows #304
- Campaign: P0.5 Idle Core + Creative Rescue
