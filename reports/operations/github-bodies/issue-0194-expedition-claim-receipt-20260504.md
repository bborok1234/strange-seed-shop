## 문제

`claimExpedition`(src/App.tsx:1822)은 보상 수령 시 leaves/materials를 그저 더하고 `triggerRewardPulse()`만 호출한다. 받은 보상의 가치가 화면에 receipt로 surfaced되지 않아 player의 expedition return moment가 vague하다.

## 비교

`claimProductionLeaves`는 `ProductionClaimReceipt`(App.tsx:67) — leaves/orderTitle/orderProgress/orderRequired를 1.7s setTimeout으로 보여준다. 같은 패턴이 expedition return moment에는 없다.

## 목표

원정 보상 수령 시 `ExpeditionClaimReceipt` 셀러브레이션 카드를 expedition tab에 5초 노출:

- expedition title
- 받은 leaves (+N)
- 받은 materials (+N)
- 첫 research expedition 완료 시 lunar seed 해금명

## 수용 기준

- [ ] `원정 보상 받기` 클릭 직후 receipt 카드 표시 (5초 노출).
- [ ] receipt에 expedition title + leaves chip + materials chip.
- [ ] research expedition 처음 완료 시 lunar seed 해금명 chip.
- [ ] 5초 후 자동 dismiss.
- [ ] 다른 receipt 발화 시 cleared.

## 게임 북극성 정렬

`game_feel` rubric: 탭/수확/납품 순간에 즉시 시각/수치 feedback. `production_readability`: 다음 행동(달빛 씨앗 보러가기)으로의 흐름 강화.
