## 문제

원정 진행 중일 때 expedition tab은 텍스트만 보여준다 — `"원정 진행 중"` + `"5분 남음 · 돌아오면 보상 수령"`. 시각적 progress bar가 없어 player가 "얼마나 가까이 왔지?"를 텍스트로만 추론해야 한다.

## 비교

다른 progression 표시(주문 진행도, mission progress)는 모두 `<progress>` element 또는 progress 카드를 시각화한다. 원정 진행은 그 surface가 빠져 있다.

## 목표

원정 진행 중 expedition tab에 progress bar를 추가:

- duration 대비 elapsed 비율을 시각화 (0~100%).
- ambient leaf-trail keyframe으로 "정원 생명체가 일하고 있다"는 미세 motion 추가.
- 완료 직전(>=90%)에는 색조가 lunar/golden으로 미묘하게 변해 "곧 도착" 신호.

## 수용 기준

- [ ] `save.activeExpedition` 활성 시 progress bar 표시.
- [ ] expedition 완료 시 bar 100%.
- [ ] aria-label/value 적절.
- [ ] 시각 동작: leaf-trail keyframe ambient motion.
- [ ] >=90% 진행 시 색 변화로 "곧 도착" cue.

## 게임 북극성 정렬

`game_feel` rubric: 탭/수확/납품 외에 **idle wait moment**에도 즉시 시각 feedback. `production_readability`: 원정이라는 진행 layer가 화면에서 진행도 bar로 보임 — "다음 보상까지의 시간"을 한눈에.
