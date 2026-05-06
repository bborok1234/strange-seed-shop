# WorkUnit — 방패새싹 모모 work idle sprite strip 제작

- ID: `0216`
- Status: planned
- GitHub issue: #413 — https://github.com/bborok1234/strange-seed-shop/issues/413
- Draft PR: pending
- Source feedback: #412 merge/main CI 이후 남은 risk
- Campaign source: P0.5 Idle Core + Creative Rescue
- Game Studio route: `game-studio:game-studio` -> `game-studio:sprite-pipeline` -> `game-studio:game-playtest`

## Goal

`방패새싹 모모` support actor가 accepted raster + CSS relay motion에서 끝나지 않고, 실제 4-frame work idle sprite strip으로 정원 playfield에 합류하게 한다.

## Candidate Issue List

1. **선택: 모모 work idle sprite strip**
   - Player verb: 두 번째 생명체 발견 후 생산 team 확인.
   - Production/progression role: 두 번째 생명체가 production roster에 실제 animated worker로 합류.
   - Screen moment: `?qaResearchExpeditionReady=1` 정원 production scene.
   - Asset/FX: `creature_herb_common_002` reference에서 4-frame transparent work idle strip 생성/정규화/manifest binding.
   - Playtest evidence: Browser Use before/after, sprite preview, focused mobile roster regression, asset provenance/style/normalization gates.
2. **더 큰 방향 점프: 전체 creature worker strip batch**
   - 장점: 모든 수집 생명체가 움직이는 production bar로 상승.
   - 거절: batch generation은 style drift/검수량이 커서 첫 strip 성공과 pipeline 검증 후 진행한다.
3. **추가 UI behavior만 보강**
   - 장점: 빠름.
   - 거절: #412가 이미 raster + relay behavior를 닫았으므로 다음은 실제 sprite frame 품질로 가야 한다.

## Strategic Jump Check

이번 slice는 #412의 남은 위험을 직접 닫는다. 기존 accepted raster를 다시 CSS로 흔드는 것이 아니라, sprite-pipeline 방식으로 모모 고유 work idle strip을 만들고 manifest/runtime binding을 검증한다.

## Reference Teardown

- 경쟁 idle/collection 게임에서 새 worker는 고유 idle/action loop가 있어야 unlock 가치가 커진다.
- 현재 포리는 accepted strip을 재사용해 움직이지만, 모모는 support actor CSS motion에 머문다. 두 번째 생명체 품질 기준을 포리 수준으로 끌어올려야 한다.

## Creative Brief

- Player fun target: “모모가 넓은 잎 방패를 살짝 펼치며 씨앗을 지키는 일꾼처럼 보인다.”
- Core loop role: collection unlock -> animated worker identity -> production team expansion.
- Required source asset: `public/assets/game/creatures/creature_herb_common_002.png`.
- Output asset target: `public/assets/game/sprites/starter/creature_herb_common_002_work_idle_strip.png`.
- Game-feel requirements: 4 frames, bottom-center anchor, transparent PNG, 96px frame 기준, loop 6fps, small-size silhouette readable.

## Game Studio Department Signoff

- 기획팀: 두 번째 생명체가 production team에서 고유 역할을 갖게 한다.
- 리서치팀: worker unlock 이후 고유 motion이 생기는 경쟁작 pattern을 따른다.
- 아트팀: sprite-pipeline workflow로 reference canvas, strip generation, normalization, preview review를 남긴다.
- 개발팀: manifest animation binding과 productionScene support worker animation lookup을 추가한다.
- 검수팀: Browser Use after와 Playwright bounds/asset-id/frame-count assertion을 요구한다.
- 마케팅팀: 외부 게시 없음. 내부 devlog angle은 “모모가 진짜 움직이는 동료가 됨”.
- 고객지원팀: 두 번째 생명체 unlock 가치가 시각적으로 명확해져 progression 혼란을 줄인다.

## Plan

1. Browser Use `iab`로 #412 후 현재 모모 support actor before screenshot을 저장한다.
2. `creature_herb_common_002` reference canvas를 만들고 4-frame work idle strip을 생성한다.
3. strip을 96px frame 기준으로 normalize하고 preview sheet를 저장한다.
4. asset manifest에 `creature_herb_common_002_actor_work_idle_strip`을 추가한다.
5. support worker가 animation binding을 우선 사용하도록 runtime을 확장한다.
6. Browser Use after screenshot과 focused mobile roster regression을 갱신한다.
7. `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-normalization`, `npm run check:art-share`, `npm run build`를 확인한다.
8. draft PR, checks, merge, main CI까지 관찰한다.

## Acceptance Criteria

- [ ] `creature_herb_common_002_actor_work_idle_strip` manifest entry가 있다.
- [ ] support actor는 static raster보다 sprite strip animation을 우선 사용한다.
- [ ] Browser Use after에서 모모 work idle strip이 playfield support actor로 보인다.
- [ ] focused mobile regression이 asset id, frame count, bounds를 검증한다.
- [ ] asset provenance/style/normalization gates가 통과한다.
- [ ] `npm run check:art-share`
- [ ] `npm run build`

## Stop / Blocker Boundaries

- image generation tool unavailable, output file save unavailable, transparent/normalization validation failure는 blocker로 기록한다.
- runtime image generation, 결제, 외부 배포, save migration은 scope 밖이다.
