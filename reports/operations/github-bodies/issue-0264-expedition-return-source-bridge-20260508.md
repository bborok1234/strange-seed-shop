# 첫 원정 보상 source preview bridge

## 요약

첫 원정 귀환 상자 보상이 `잎 +35`와 receipt에서 끝나지 않도록, 초승달순 씨앗 source preview와 다음 route lock 상태로 이어지는 bridge를 만듭니다.

## Small win

`귀환 상자 열기` 이후 플레이어가 바로 `초승달순 단서 보기`를 눌러 다음 달빛 목표를 확인할 수 있습니다.

## 사용자/운영자 가치

플레이어는 원정 보상이 장기 발견 route로 이어진다는 사실을 화면에서 이해합니다. 운영자는 D7 route가 보상 수령 -> 다음 source preview -> 다음 planting/route 후보로 이어지는 검증 가능한 chain을 확보합니다.

## Before / After 또는 Visual evidence

- Before: 첫 원정 claim 후 `첫 원정 완료 · 다음 달빛 route 실루엣` 문구와 `꽃가루 단서 후보` receipt만 남습니다.
- After: source clue state, `초승달순 단서 보기` action, 다음 route lock HUD/world state, Playwright screenshot evidence를 남깁니다.

## Playable mode

Phaser route. `npm run check:phaser`에서 첫 원정 claim 이후 source preview action까지 자동으로 진행합니다.

## 작업 checklist

- [ ] 첫 원정 source clue state 추가
- [ ] `귀환 상자 열기`가 source clue를 지급
- [ ] `초승달순 단서 보기` action 추가
- [ ] source preview HUD/action rail 추가
- [ ] 원정 문 playfield source/route lock state 추가
- [ ] checker/visual evidence 추가

## 검증

- `npm run check:phaser`
- `npm run check:ci`
- `npm run check:control-room`
- `npm run check:ops-live`
- `npm run check:github-metadata`
- `git diff --check`

## 안전 범위

- Runtime image generation/API/cache 호출 없음.
- 새 결제/광고/외부 배포 없음.
- 실제 `seed_lunar_002` planting unlock은 후속 WorkUnit으로 분리할 수 있습니다.

## 남은 위험

- 새 generated source icon 없이 진행하므로, dedicated seed/source asset plan-prompt가 후속으로 필요할 수 있습니다.
- source preview가 HUD 설명으로만 보이지 않도록 playfield 원정 문 상태와 screenshot evidence가 필요합니다.

## 연결된 issue

Follows #494
Follows PR #495
