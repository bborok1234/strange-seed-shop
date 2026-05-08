## 요약

첫 원정 route의 dedicated raster 후보인 원정 문, 귀환 상자, 귀환 보상 FX strip을 asset plan/prompt에 추가한다.

## Small win

다음 WorkUnit이 product decision 없이 원정 문/귀환 상자 PNG 생성을 시작할 수 있다.

## 사용자/운영자 가치

사용자는 후속 runtime에서 원정과 주문 상자를 시각적으로 구분하게 된다. 운영자는 asset id, output path, frame metadata, prompt acceptance를 checker로 검증할 수 있다.

## Before / After 또는 Visual evidence

Before: #491 첫 원정 route는 기존 order crate stand-in을 사용한다.

After: `assets/source/asset_plan.json`과 `assets/source/asset_prompts.json`에 dedicated expedition asset 3개가 generation-ready 상태로 추가된다.

Browser Use: 이번 PR은 plan/prompt JSON 단계라 hands-on visual QA 대상이 아니다. 생성/통합 WorkUnit에서 Browser Use 또는 current blocker + Playwright evidence를 요구한다.

## Playable mode

main playable worktree 계약은 유지한다. 이번 변경은 runtime 동작을 바꾸지 않는 asset pipeline 준비 작업이다.

## 검증

- [ ] `npm run check:topology-asset-plan`
- [ ] `npm run check:asset-provenance`
- [ ] `npm run check:asset-style`
- [ ] `npm run check:ci`
- [ ] `npm run check:github-metadata`
- [ ] `git diff --check`

## 안전 범위

- runtime image generation/API/cache 호출 없음
- PNG 생성 없음
- accepted manifest entry 추가 없음
- 결제/광고/외부 배포/고객 데이터 변경 없음
- asset plan/prompt JSON과 운영 evidence 문서만 변경

## 남은 위험

실제 raster generation, review, manifest integration, Phaser binding은 후속 WorkUnit이 필요하다.
