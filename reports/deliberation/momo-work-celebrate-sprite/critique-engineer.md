# Engineer Critique — 모모 Work/Celebrate Sprite

## 결론

이 spec은 구현 가능하지만, `supportWorkers`를 정적 asset list로 둔 채 CSS motion만 얹으면 실패한다. 이번 축의 기술 성공 조건은 모모가 accepted sprite strip + manifest animation binding + view model support-worker animation contract + visible QA evidence를 모두 통과하는 것이다. 단, celebrate를 완전한 one-shot state machine으로 한 PR 안에 넣는 것은 timer/useEffect와 receipt 상태 결합 위험이 있어 범위를 조심해야 한다.

## Blocking Concerns

1. `supportWorkers` 런타임 계약이 아직 animation을 담지 않는다. 현재 `src/game/playfield/types.ts`의 support worker는 `assetPath`만 가지고, `src/game/playfield/GardenPlayfieldHost.tsx`도 support worker를 `<img>`로만 렌더링한다. `src/App.tsx`의 support worker map에서 creature별 work/celebrate strip을 resolve하지 않으면 manifest에 asset을 추가해도 화면은 바뀌지 않는다.

2. manifest 계약이 느슨하면 asset provenance는 통과해도 gameplay binding은 회귀를 못 잡는다. 모모 work/celebrate strip은 `category=sprite_strip`, `status=accepted`, `animation.kind=spritesheet`, `frames=6`, `frameWidth=96`, `frameHeight=96`, `binding.target=actor`, `binding.creatureIds=["creature_herb_common_002"]`, `binding.slot=work|celebrate`까지 고정해야 한다. 단순 `tags`나 `notes`만으로는 runtime lookup과 테스트가 같은 계약을 보지 못한다.

3. celebrate one-shot을 이번 PR에서 완전 구현하려면 side-effect 관리가 새 리스크가 된다. `productionClaimReceipt`, `orderDeliveryReceipt`, `researchCompleteActive` 같은 receipt 상태는 이미 `src/App.tsx`에서 여러 갈래로 계산되고 있어, actor-local one-shot timer를 급하게 붙이면 stale animation, 반복 재생, reduced-motion 누락, 테스트 flake가 생길 수 있다. celebrate strip은 accepted asset과 `data-celebrate-animation-asset`까지 노출하되, 실제 one-shot trigger는 production claim 또는 order receipt 1개로 제한해야 한다.

## Self-Critique

내 Phase 2 제안은 work loop를 우선하고 celebrate 재생을 다음 PR로 미루는 쪽에 가까웠다. 그러나 사용자가 지적한 “캐릭터가 움직이지 않는다”는 문제는 work loop만으로는 절반만 해결되므로, 최소한 claim/order 순간에 celebrate asset이 실제 화면 상태나 data hook으로 관찰되는 수용 기준은 이번 PR 안에 있어야 한다.

## Must-Have Acceptance Criteria

1. `qaResearchExpeditionReady=1`에서 `data-worker-id="creature_herb_common_002"` support actor가 `data-worker-role="support"`, `data-animation-asset="sprite_creature_herb_common_002_work_strip"`, `data-frame-count="6"`를 가진다. fallback static portrait는 runtime continuity용이며 이 조건을 대체할 수 없다.

2. 모모 work/celebrate PNG는 accepted raster sprite strip으로 manifest에 등록되고, asset 검증은 `check:asset-normalization`, `check:asset-provenance`, `check:asset-style`, `check:asset-alpha`를 통과한다. 생성 provenance는 `gpt-image-2` 또는 Codex native image generation 중 실제 사용 경로를 기록해야 하며, SVG/vector/code-native 대체물은 허용하지 않는다.

3. Browser Use `iab` evidence는 같은 URL에서 before/after를 남기고, 393x852 및 desktop-centered mobile frame에서 모모 actor가 plot label, order target, bottom tabs, production card와 겹치지 않음을 눈으로 확인해야 한다. Playwright는 DOM binding과 bounding box 회귀를 잡는 보조 게이트이고, visible QA를 대체하지 않는다.

## Compromise Recommendation

한 PR 범위는 “모모 work loop 실제 표시 + celebrate strip accepted manifest + claim/order 중 하나의 관찰 가능한 celebrate hook”으로 닫는 것이 적절하다. Designer/Art Director가 원하는 완전한 보상 state machine은 목표로 유지하되, 이번 PR에서는 `supportWorkers` animation contract와 asset pipeline을 먼저 확정해 다음 생명체에도 반복 가능한 길을 만든다. 이렇게 하면 화면 payoff는 생기고, React side-effect와 receipt orchestration은 과도하게 키우지 않는다.

## Browser Use Evidence Plan

- 시작 URL: `http://127.0.0.1:4173/?qaResearchExpeditionReady=1`.
- 저장 경로: `reports/visual/issue-0228-momo-work-celebrate-sprite/`.
- 캡처 1: 기존 상태 또는 PR 전 상태에서 모모가 static support portrait로 보이는 장면.
- 캡처 2: PR 후 393x852에서 모모 work strip이 support actor로 보이는 장면.
- 캡처 3: production claim 또는 order reward 직후 `data-celebrate-animation-asset`가 노출되고, 모모/FX가 playfield 안에서 잘리지 않는 장면.
- Browser Use finding은 “모모가 포리와 별개의 작업자 actor로 읽히는가”, “정적 초상 pulse로 보이지 않는가”, “텍스트와 bottom tabs를 가리지 않는가” 세 문장으로 남긴다.
