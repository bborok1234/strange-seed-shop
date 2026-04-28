# 플레이테스트 intake sample: 첫 수확 애착 루프

Date: 2026-04-28
Source: internal-playtest
Privacy: none
Severity: medium
Product axis: first_5m_clarity, cuteness, collection_desire, comeback_hook, confusion
Related issue: #36
Duplicate links: none

## Context

Issue #34에서 첫 수확 생명체에 성격/취향/인사말이 추가된 뒤, 첫 5분 감정 목표를 같은 기준으로 평가하기 위한 샘플 intake다. 실제 고객 데이터나 외부 채널은 사용하지 않았다.

## Observation

- 첫 수확 reveal의 인사말은 생명체가 단순 보상보다 소유 대상처럼 느껴지게 만든다.
- 첫 생명체 카드의 성격/좋아하는 것 문구는 도감 보상 버튼으로 이어지는 이유를 강화한다.
- 다음 세션에서는 도감 탭에서 undiscovered silhouette 또는 “다음에 만날 아이” 힌트가 필요할 수 있다.

## Evidence

- Screenshot: `reports/visual/creature-attachment-reveal-20260428.png`
- Screenshot: `reports/visual/creature-attachment-ownership-20260428.png`
- PR: #35
- Issue: #34

## Fun rubric scores

| Rubric | Score | Evidence |
| --- | ---: | --- |
| first_5m_clarity | 4 | 다음 행동 카드와 첫 수확 reveal이 이어진다. |
| cuteness | 5 | 생명체 이름, 성격, 인사말이 함께 보인다. |
| collection_desire | 4 | 도감 카드에 성격이 노출되어 다음 생명체 기대가 생긴다. |
| comeback_hook | 3 | 오프라인 보상과 연결은 유지되지만 새 문구가 직접 강화하지는 않는다. |
| confusion | 2 | 문구는 늘었지만 필수 행동 CTA는 유지된다. |

## Recommended next item

- 도감 미발견 슬롯에 “다음에 만날 아이” silhouette/hint를 추가하는 game_content 또는 game_feature item을 검토한다.

## Apply boundary

- No payment
- No login/account
- No ads SDK
- No external navigation
- No runtime image generation
- No real customer data
