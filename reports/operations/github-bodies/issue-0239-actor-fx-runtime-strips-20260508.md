# Phaser v1 actor and FX runtime strip normalization

## 요약

#442에서 생성한 actor/FX source candidates를 strict runtime spritesheet/FX strip으로 정규화하고 Phaser board에 연결합니다.

## Small win

첫 수확 후 포리가 placeholder shape가 아니라 generated actor strip으로 움직이고, care/harvest feedback이 generated FX로 보입니다.

## 사용자/운영자 가치

플레이어는 정원 actor와 tap 결과를 더 즉각적으로 이해하고, 운영자는 source candidate -> normalized strip -> runtime evidence 경로를 검증할 수 있습니다.

## Before / After 또는 Visual evidence

- Before: actor/FX 후보는 1024x1024 source candidate이고 Phaser runtime actor는 shape placeholder입니다.
- After: normalized strip contact sheet와 Phaser screenshot evidence가 남습니다.

## Playable mode

Phaser app lane을 수정합니다. Merge 후 main playable refresh 대상입니다.

## 검증

- `npm run check:phaser`
- `npm run check:asset-provenance`
- `npm run check:asset-style`
- `npm run check:asset-alpha`
- `npm run check:ci`

## 안전 범위

- Runtime image generation/API 호출 없음.
- 결제/광고/외부 배포/고객 데이터 없음.
- Momo strip은 품질 또는 시간에 따라 normalized source만 남기고 runtime actor 연결은 Pori 우선으로 제한할 수 있습니다.

## 남은 위험

- Source candidate가 strict frame extraction에 부적합하면 normalized output이 작게 보일 수 있습니다. 이 경우 blocker report와 regeneration follow-up으로 분리합니다.

## 연결된 issue

- Follow-up to #444

## 작업 checklist

- [ ] actor/FX alpha cleanup
- [ ] strict strip normalization
- [ ] Phaser runtime actor/FX 연결
- [ ] visual evidence 저장
- [ ] roadmap/control room/dashboard/heartbeat 갱신
