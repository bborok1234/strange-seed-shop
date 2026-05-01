## 요약

Issue #251의 `달빛 온실 조사` 보상 수령 흐름에서 온실/응축기 source가 사라지지 않도록 `activeExpedition.source`와 `lunarRewardSource`를 저장하고, reward card/씨앗/도감 목표 surface에 같은 source badge를 노출했습니다.

## Small win

- `원정 보상 받기` 직후 `응축기에서 회수한 온실 단서`가 `달방울 씨앗` / `달방울 누누` 다음 목표와 함께 보입니다.

## 사용자/운영자 가치

- 사용자 가치: 온실 production chain의 결과가 lunar collection progression으로 돌아오는 payoff를 보상 화면에서 즉시 이해할 수 있습니다.
- 운영자 가치: `player verb + progression role + screen moment + asset/FX + playtest evidence`를 갖춘 vertical slice로 Issue #251을 닫을 수 있습니다.

## Before / After 또는 Visual evidence

- Before: `reports/visual/p0-greenhouse-lunar-clue-expedition-20260501.md`
- After report: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-20260501.md`
- Browser Use claim: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-claim-20260501.png`
- Browser Use seeds: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-seeds-20260501.png`
- Browser Use album: `reports/visual/p0-greenhouse-lunar-reward-source-bridge-browser-use-album-20260501.png`

## Playable mode

- Local QA URL: `http://127.0.0.1:5173/?qaGreenhouseLunarClaimReady=1&qaTab=expedition&qaReset=1`
- Stable main playable mode는 이 PR에서 변경하지 않았습니다.

## 검증

- [x] Browser Use `iab`: claim/seeds/album 화면 확인
- [x] `npm run check:visual -- --grep "달빛 온실 조사 보상"`
- [x] `npm run check:ci`

## 작업 checklist

- [x] `items/0127-greenhouse-lunar-reward-source-bridge-v0.md` plan-first artifact 작성
- [x] Game Studio route 기록
- [x] source persistence와 UI reward/source badge 구현
- [x] deterministic QA fixture 추가
- [x] 모바일 visual regression 추가
- [x] Browser Use evidence 저장
- [x] roadmap/dashboard/control room/heartbeat 갱신

## 안전 범위

- 신규 bitmap asset 생성 없음.
- 실제 결제, 광고, 로그인, 외부 배포, 고객 데이터 없음.
- 기존 `moon_hint` 보상 수치 변경 없음.

## 남은 위험

- 원격 PR checks와 merge 후 main CI는 PR 생성 후 확인 예정입니다.

## 연결된 issue

Closes #251
