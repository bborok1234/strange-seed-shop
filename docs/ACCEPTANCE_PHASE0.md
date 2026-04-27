# Phase 0 수용 기준 체크리스트

## 제품 루프

- [x] 스타터 씨앗 3개가 존재한다.
- [x] 첫 씨앗 성장 시간은 90초 이하다.
- [x] 첫 씨앗은 생명체 pool을 가진다.
- [x] 첫 수확과 첫 도감 보상으로 첫 업그레이드를 구매할 수 있다.
- [x] 첫 원정은 10분 이하다.
- [x] 오프라인 보상 계산이 localStorage 저장값을 기준으로 동작한다.

## 에셋

- [x] manifest에 20개 에셋이 등록되어 있다.
- [x] manifest 경로가 모두 workspace의 실제 파일을 가리킨다.
- [x] 런타임 이미지 생성 의존성이 없다.

## 분석 이벤트

- [x] `session_start`
- [x] `starter_seed_selected`
- [x] `seed_planted`
- [x] `growth_tapped`
- [x] `creature_harvested`
- [x] `album_reward_claimed`
- [x] `upgrade_purchased`
- [x] `expedition_started`
- [x] `expedition_claimed`
- [x] `offline_reward_claimed`

## 검증 명령

```bash
npm run check:content
npm run check:loop
npm run simulate:economy
npm run build
```

## 브라우저/시각 QA

- [x] Browser Use 플러그인으로 로컬 앱 접속 확인
- [x] 모바일 폭에서 초기 화면 스크린샷 저장
- [x] 실제 클릭 플로우로 첫 수확까지 진행
- [x] 실제 클릭 플로우로 첫 원정 시작까지 진행
- [x] 360px 모바일 viewport에서 모든 주요 상태의 텍스트 잘림이 없는지 확인
- [x] 오프라인 복귀 흐름을 브라우저에서 확인
