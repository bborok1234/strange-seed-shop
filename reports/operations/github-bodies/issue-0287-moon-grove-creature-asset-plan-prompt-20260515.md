## 문제 / 배경

#540/#541은 `월정 숲 새벽이끼` discovery reveal을 만들었지만 전용 creature portrait/actor/sprite가 없어 reveal 감정이 source badge와 FX에 머문다.

## 목표

월정 숲 dedicated creature/actor/FX를 이미지 생성 가능한 plan/prompt batch로 고정한다.

## Small win

후속 generation/review WorkUnit이 바로 `creature_moon_grove_001`, idle/work actor strips, discovery bloom FX를 만들 수 있다.

## Campaign source of truth

- `docs/NORTH_STAR.md`
- `docs/GAME_BIBLE.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `items/0287-moon-grove-creature-asset-plan-prompt.md`

## Game Studio Department Signoff

- 기획팀: named creature/actor payoff 준비.
- 리서치팀: rare discovery가 텍스트 surface에 머무는 production gap 해소.
- 아트팀: raster portrait, actor strips, reveal FX strip plan/prompt.
- 개발팀: runtime binding은 generation/review 이후로 분리.
- 검수팀: JSON/checker 검증 중심. visual runtime QA는 후속 WorkUnit.
- 마케팅팀: 외부 채널/실결제/광고 없음.
- 고객지원팀: 후속 playable에서 discovery 의미를 creature/actor로 이해할 수 있게 함.

## Subagent/Team Routing

Solo execute. JSON plan/prompt와 운영 문서 변경으로 범위가 좁다.

## 플레이어 가치

월정 숲 discovery가 이름 있는 생명체와 정원 actor로 확장될 준비를 만든다.

## 수용 기준

- `assets/source/asset_plan.json`에 월정 숲 creature/actor/FX 4개가 추가된다.
- `assets/source/asset_prompts.json`에 동일 asset_id 4개가 추가된다.
- actor/FX strip은 frame count/size/fps/animation.binding을 가진다.
- SVG/vector/code-native output과 runtime generation을 금지한다.
- `npm run check:topology-asset-plan`, `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:ci`, `git diff --check`가 통과한다.

## Visual evidence 계획

이번 PR은 plan/prompt only이므로 runtime screenshot은 `N/A - UI 변화 없음`. Generation/review WorkUnit에서 contact sheet와 small-size visual review를 남긴다.

## Playable mode 영향

없음. Runtime binding은 후속 generation/review 이후 별도 WorkUnit.

## 안전 범위

이미지 생성, 결제, 광고, 고객 데이터, 외부 배포 없음. Static asset plan/prompt만 변경한다.

## 검증 명령

- `npm run check:topology-asset-plan`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:ci`
- `git diff --check`
