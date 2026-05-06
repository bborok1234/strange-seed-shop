## 요약

`방패새싹 모모` support actor를 accepted raster + CSS relay motion에서 실제 4-frame work idle sprite strip으로 끌어올리는 WorkUnit입니다.

GitHub issue: #413 — https://github.com/bborok1234/strange-seed-shop/issues/413

## Small win

두 번째 생명체가 포리처럼 playfield에서 고유 work idle animation을 갖게 됩니다.

## 사용자/운영자 가치

사용자가 지적한 “캐릭터가 정적인 그림처럼만 있다”는 문제를 다음 단계로 직접 다룹니다. #412가 모모를 playfield에 합류시켰다면, 이번 WorkUnit은 모모가 실제 sprite strip으로 움직이게 하는 품질 상승입니다.

## Before / After 또는 Visual evidence

- Before Browser Use `iab`: pending
- Sprite preview: pending
- After Browser Use `iab`: pending

## Playable mode

- URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`

## 작업 checklist

- [x] WorkUnit plan artifact 작성: `items/0216-momo-work-idle-sprite-strip.md`
- [x] Game Studio route 기록
- [x] GitHub issue #413 생성
- [ ] sprite-pipeline reference canvas/strip/normalization/preview evidence
- [ ] manifest animation binding 추가
- [ ] runtime support worker animation 우선 사용
- [ ] Browser Use before/after evidence 저장
- [ ] focused mobile regression 보강

## 검증

- Pending.

## 안전 범위

runtime image generation, payment, external deployment, save migration은 하지 않습니다. project-bound static raster sprite asset만 추가합니다.
