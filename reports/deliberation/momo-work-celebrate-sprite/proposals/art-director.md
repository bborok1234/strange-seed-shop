# Art Director Proposal — 모모 Work/Celebrate Sprite

## Visual Hierarchy

모모는 생산 카드 안의 원형 초상이나 장식 아이콘이 아니라, 정원 playfield에서 포리 옆에 붙어 일하는 두 번째 actor로 읽혀야 한다. 현재 `creature_herb_common_002`는 manifest상 `album_card` 초상만 있고, 생산 장면에서는 정적 support portrait로 축소되어 “작업 중인 동료”보다 “카드에서 잘라온 그림”처럼 보인다. 이번 축의 primary visual target은 `자동 생산` 영역에서 모모의 잎 방패 silhouette이 48px 이상으로 보이고, work loop의 흔들림과 celebrate burst가 포리와 다른 성격을 갖는 것이다.

시선 순서는 `title/objective -> resource pill -> workstage actor pair -> plot -> bottom action`이어야 한다. 모모 sprite는 resource/HUD보다 강하게 튀면 안 되지만, 생산 카드 내부에 묻혀 배경 장식처럼 사라져도 안 된다. support actor 크기는 포리 대비 `scale.actor.support` 수준으로 두되, 얼굴/잎 방패가 절대 원형 mask에 잘리지 않아야 한다.

## Layout Grid Per Viewport

P0.5 기준은 모바일 frame이다. 데스크톱 브라우저에서도 별도 side rail이 아니라 중앙 모바일 frame 안에서 같은 위치 관계가 유지되어야 하며, 모모는 floating arbitrary 좌표가 아니라 `workstage.slot.support-2` 또는 `plot.cluster.right-support`에 anchor를 가져야 한다.

권장 anchor는 workstage 카드 왼쪽의 원형 mask가 아니라, 카드 하단 edge와 playfield floor 사이의 작은 발판이다. `workstage.actor.primary`에는 포리, `workstage.actor.support`에는 모모를 두고 두 actor 사이에 leaf tick FX가 지나가게 하면 “둘이 함께 생산 중”이라는 hierarchy가 생긴다. 모모가 plot 위로 직접 떠 있을 경우 plot label과 충돌하므로 금지한다.

## Design Tokens To Introduce

- `scale.actor.primary`: 첫 worker 64-72px visual box.
- `scale.actor.support`: support worker 54-60px visual box, 최소 48px 이하 금지.
- `motion.actor.workLoop`: 900-1100ms, ease-in-out, 반복 가능.
- `motion.actor.celebratePop`: 420-560ms, ease-out-back 계열, 반복 금지.
- `fx.leafShield.glint`: 방패 잎 외곽의 1회성 highlight, green-on-green만 쓰지 말고 pale yellow rim을 섞는다.
- `layer.actor`: plot art 위, label plate 아래가 아니라 label plate와 분리된 actor layer.
- `layer.transientFx`: actor 위, DOM HUD 아래.

색은 기존 warm pastel greenhouse palette를 유지한다. 모모의 방패 잎은 포리의 둥근 새싹 silhouette과 구분되도록 더 넓은 leaf shield shape와 살짝 진한 sage rim을 쓰고, celebrate에서는 hard neon이 아니라 honey yellow sparkle과 soft mint afterimage로 보상감을 만든다.

## Motion Vocabulary

### Work Loop

신규 asset: `sprite_creature_herb_common_002_work_strip`.

- 형식: transparent PNG sprite sheet.
- canvas: 576x96, frame 6개, 각 frame 96x96.
- frame rate: 10fps.
- repeat: loop.
- binding: `target=actor`, `slot=work`, `creatureIds=["creature_herb_common_002"]`.
- silhouette rule: 방패 잎, 얼굴, 짧은 다리가 64px 표시에서도 읽혀야 한다.
- action language: 잎 방패를 앞으로 살짝 밀어 leaf tick을 막거나 모으는 “수호자/보조 생산자” 동작.

포리의 work loop가 통통 튀는 수집가라면, 모모는 shield sway와 작은 footstep으로 차별화한다. 움직임은 좌우 stripe나 배경 뒤 원형 halo로 처리하지 않는다. static portrait를 원형 mask 안에서 흔드는 방식은 현 문제를 반복하므로 금지한다.

### Celebrate Burst

신규 asset: `sprite_creature_herb_common_002_celebrate_strip`.

- 형식: transparent PNG sprite sheet.
- canvas: 576x96, frame 6개, 각 frame 96x96.
- frame rate: 12fps.
- repeat: 0.
- binding: `target=actor`, `slot=celebrate`, `creatureIds=["creature_herb_common_002"]`.
- trigger: production claim, order reward, support worker unlock/assignment confirmation.
- FX language: leaf shield opens like a tiny fan, honey yellow glint 2-3개, leaf crumb burst 3-5개.

celebrate는 화면 중앙을 덮는 reward card가 아니라 actor 주변의 짧은 burst여야 한다. reward receipt가 필요하면 별도 DOM 카드가 아니라 leaf trail/floating number와 함께 짧게 지나가야 하며, bottom action surface를 가리면 실패다.

## Asset Composition

모모 sprite는 기존 `creature_herb_common_002` 초상을 source reference로 삼되, 그대로 축소하지 않는다. 초상에서 따올 것은 broad leaf shield motif, rounded friendly face, common herb palette이고, 생산 actor에서는 outline thickness와 pose를 96px sprite 기준으로 다시 설계한다. 알파 배경은 완전 투명이어야 하며, 흰색 matte/checkerboard 노출은 실패다.

생성 prompt에는 아래 제약이 반드시 들어가야 한다.

- hand-painted cozy greenhouse game sprite, transparent background.
- six-frame horizontal strip, consistent character scale and anchor.
- no text, no UI frame, no circular badge, no white background.
- readable at 48-64px, broad leaf shield silhouette.
- warm pastel lighting, soft sage rim, honey sparkle only for celebrate.

manifest에는 `gpt-image-2` 또는 Codex native image generation provenance를 남기고, `sourceAssetIds=["creature_herb_common_002"]`, `screen_moment:production_garden`, `player_verb:watch_auto_production`, `screen_moment:production_claim`, `player_verb:claim_reward` tag를 붙인다. asset review는 작은 크기 판독성, alpha, frame consistency, source creature identity를 봐야 한다.

## Disagreements I Anticipate

Engineer가 “이미 CSS bob이나 기존 portrait pulse로 충분하다”고 줄이면 반대한다. 이번 문제는 움직임의 유무가 아니라 캐릭터가 독립 actor로 보이는가의 문제라서, portrait pulse는 static portrait/circle problem을 해결하지 못한다.

Designer가 이 작업을 새 보상 시스템이나 주문 chain까지 확장하려 하면 반대한다. 이번 visual slice의 목표는 모모가 현재 생산 roster 안에서 살아 움직이게 만드는 것이며, player verb는 `watch_auto_production`과 `claim_reward`로 충분히 닫힌다.

Director가 전체 creature animation bible을 동시에 요구하면 반대한다. 먼저 두 번째 생명체 1종의 work/celebrate strip을 production path에 통과시켜 motion vocabulary와 manifest contract를 검증해야 한다.

## Open Questions

- 모모 celebrate trigger를 production claim에만 묶을지, 자동 생산 cap이 찼을 때 짧은 idle celebrate도 허용할지 Engineer가 runtime state로 결정해야 한다.
- support worker가 2명 이상일 때 `workstage.actor.support` slot을 순차 배치할지, carousel처럼 한 명만 대표 노출할지 Designer와 Engineer가 합의해야 한다.
- 이번 PR에서 실제 gpt-image-2 생성까지 포함할지, 먼저 prompt/manifest contract와 runtime binding을 잡고 asset generation을 별도 issue로 뺄지는 비용과 API 접근 상태 확인 후 정해야 한다.
