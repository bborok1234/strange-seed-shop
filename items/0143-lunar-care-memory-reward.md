# #282 정원에서 달방울 누누를 돌보면 도감 기억 보상이 움직인다

- 상태: `ready_for_pr`
- GitHub issue: #282 `정원에서 달방울 누누를 돌보면 도감 기억 보상이 움직인다`
- Branch: `codex/0282-lunar-care-memory-reward`
- Game Studio route: `game-studio:game-studio` → `game-studio:game-ui-frontend`, `game-studio:game-playtest`, `browser-use:browser`
- WorkUnit authority: GitHub issue/PR/GateEvent. local campaign ledger, stash, `.omx` state는 권한이 아니라 evidence/cache로만 사용한다.

## Studio Campaign Gate

현재 open GitHub issue/PR queue가 비어 있어 새 Intake WorkUnit #282를 생성했다. 이 작업은 `P0.5 Idle Core + Creative Rescue` 하위 vertical slice이며, #275가 복구한 달빛 resident stage를 “보이는 장면”에서 “행동 → 보상 → 기록” 루프로 승격한다.

## 후보 비교

1. **선택: 달빛 resident 돌보기 → 기억 도장 → 도감 보상 motion**
   - `player verb`: 정원 stage의 `돌보기`/`단서 따라가기`.
   - `production/progression role`: save-backed care memory 또는 one-time reward claim으로 도감 기록/보상 상태가 남는다.
   - `screen moment`: 달방울 누누 발견 후 첫 정원 화면과 도감 탭 상단 memory photo.
   - `asset/FX/game-feel`: reward motion, HUD affordance, album stamp. 신규 manifest asset 없이 DOM/CSS motion으로 구현한다.
   - `playtest evidence`: Browser Use `iab` 우선, blocker 시 current-session blocker와 Playwright fallback screenshot.
2. **큰 방향 점프 후보: 첫 화면 전체를 full playfield-first layout으로 재배치**
   - 보류: #275 직후 stage의 핵심 동사/보상 루프가 비어 있으므로, 큰 레이아웃 재배치 전에 “캐릭터를 돌보면 무엇이 남는가”를 검증해야 한다.
3. **asset/FX 후보: 달방울 누누 idle/care sprite strip 신규 제작**
   - 보류: 신규 game graphics asset은 `gpt-game-asset-plan -> prompt -> generate -> review` 또는 gpt-image-2 provenance가 필요하다. 이번 blocker는 새 그림이 아니라 player verb가 저장/보상으로 이어지지 않는 점이다.

## Strategic Jump Check

선택 후보는 직전 issue에서 이어지는 작은 기능처럼 보일 수 있지만, 실제 production blocker는 “보이는 resident가 플레이어 행동/진행을 만들지 못함”이다. 이는 경쟁작 idle game의 즉시 feedback/reward cadence와 첫 5분 fun rubric의 `attachment`, `first_5m_clarity`를 동시에 막는다. 전체 레이아웃 점프나 신규 asset 제작 전에 이 동사-보상 루프를 고정해야 이후 더 큰 production investment의 효과를 측정할 수 있다.

## Reference teardown

- Egg, Inc./Idle Miner류 idle loop는 캐릭터/작업자/설비를 탭하면 즉시 숫자, badge, sparkle, 저장된 upgrade/reward 상태가 남는다.
- 현재 #275 stage는 달방울 누누가 크게 보이고 반응하지만, `돌보기`가 local state만 올려 새 save/도감/보상 상태를 만들지 않는다.
- 목표는 새 시스템 설명을 늘리는 것이 아니라, 이미 보이는 누누 stage에 작은 one-time 기억 보상과 도감 stamp를 붙여 “방금 돌본 결과”를 남기는 것이다.

## Creative brief

- 화면 감정: 누누를 쓰다듬으면 작은 달빛 도장이 `톡` 찍히고, 잎/기억 보상이 stage 안에서 떠오른다.
- 도감 감상: memory photo에 “누누 돌봄 도장” 또는 “오늘 돌본 기록”이 reward grid보다 먼저 보인다.
- 아트 방향: 신규 raster asset 없음. existing creature/seed asset을 그대로 두고 CSS shimmer/stamp/motion으로만 표현한다. accepted manifest game asset을 새로 만들지 않는다.

## Game Studio Department Signoff

- 기획팀: player verb는 `돌보기`; progression role은 one-time care memory/reward; screen moment는 달방울 누누 발견 후 첫 정원/도감 상단이다.
- 리서치팀: 경쟁작 production gap은 “캐릭터를 눌렀는데 저장되는 보상/진행이 없음”이다. 큰 레이아웃 점프와 신규 sprite strip은 후속 후보로 보류한다.
- 아트팀: 신규 gpt-image/gpt-image-2 asset 생성 없음. CSS reward motion/stamp만 사용하며, 새 accepted manifest asset을 등록하지 않는다.
- 개발팀: `PlayerSave` normalize/type 확장, `App.tsx` stage/album state mutation, `styles.css` motion, visual test만 다룬다.
- 검수팀: Browser Use `iab`를 먼저 시도한다. Node REPL `js`가 다시 미노출이면 current-session blocker와 Playwright screenshot fallback을 남긴다.
- 마케팅팀: mock-only player-facing promise다. 실채널/광고/결제 없음.
- 고객지원팀: 중복 보상/저장 누락이 혼란 포인트이므로 동일 save에서 reward가 한 번만 지급되고 완료 상태가 보이는지 검증한다.

## Subagent/Team Routing

- 이미 `omx explore`로 #275 이후 lunar stage/care/album hook을 read-only 매핑했다.
- 구현 slice는 `src/App.tsx`, `src/styles.css`, `src/types/game.ts`, `src/lib/persistence.ts`, visual test에 강하게 결합되어 있어 본 agent가 직접 구현한다.
- Browser Use/playtest 단계에서 tool 노출이 복구되면 `browser-use:browser` evidence를 우선 수집한다. 별도 team mode는 현재 write scope가 작고 공유 파일 conflict 가능성이 높아 사용하지 않는다.

## Plan

1. Save schema에 lunar care memory/reward 상태를 작게 추가하고 `normalizeSave` 기본값을 보강한다.
2. 달방울 누누 stage의 `돌보기` 동작을 one-time memory reward mutation으로 연결한다.
3. 정원 stage에 reward motion/HUD affordance와 수령 완료 상태를 추가한다.
4. 도감 memory photo에 care stamp/기록 상태를 추가하고 reward grid보다 먼저 보이게 유지한다.
5. 모바일 visual regression을 추가해 중복 지급 방지, stage clipping, album stamp 위치를 검증한다.
6. Browser Use `iab` QA를 시도하고, 막히면 current-session blocker와 Playwright fallback screenshot/report를 남긴다.
7. `docs/ROADMAP.md`, `docs/DASHBOARD.md`, `docs/OPERATOR_CONTROL_ROOM.md`, issue/PR body/GateEvent를 갱신한다.

## 수용 기준

- [x] `돌보기`가 로컬 React state만 바꾸지 않고 save-backed care memory 또는 one-time reward 상태를 남긴다.
- [x] 정원 첫 화면에서 care reward motion/도장/HUD affordance가 하단 탭이나 다음 행동 카드에 가리지 않고 보인다.
- [x] 도감 memory photo가 돌봄 기록/도장을 보상표보다 먼저 보여준다.
- [x] 동일 save에서 이미 수령한 care reward는 중복 지급되지 않고, UI가 수령 완료 상태로 바뀐다.
- [x] 신규 accepted manifest asset 없이 구현하고 runtime image generation을 추가하지 않는다.
- [x] Browser Use `iab` current-session evidence 또는 blocker + Playwright fallback screenshot을 남긴다.
- [x] focused visual regression과 `npm run check:ci`가 통과한다.

## 검증 명령

- Browser Use `iab` visual/playtest
- `npm run check:visual -- --grep "돌보기|기억 도장|care reward"`
- `npm run check:visual`
- `npm run check:ci`

## 리스크와 롤백

- Save schema 확장 누락: `normalizeSave`와 QA save fixture를 함께 수정한다.
- 모바일 overflow: stage reward UI는 기존 `.creature-stage-focus` 안에서 compact하게 배치하고 layout invariant를 visual test에 추가한다.
- 경제 흔들림: reward는 small one-time bonus로 제한하고 반복 지급을 막는다.
- 롤백: 새 save field와 stage/album care UI를 제거하면 #275 stage baseline으로 되돌아간다.

## 구현 결과

- `PlayerSave.claimedCareMemoryIds`를 추가하고 `normalizeSave` 기본값을 보강했다.
- 달방울 누누 stage의 `돌보기`가 `care_lunar_nunu_001` one-time reward(+18 잎)를 저장하고, 중복 클릭 시 도감 기록 보기로 전환된다.
- stage 안에 `달빛 돌보기 기억 보상` reward motion/HUD affordance를 추가했다.
- 도감 memory photo에 `누누 돌봄 도장`과 `도감 돌봄 기억 도장`을 추가했다.
- 신규 accepted manifest game asset 또는 runtime image generation은 추가하지 않았다.

## 검증 결과

- `npm run check:visual -- --grep "돌보기|기억 도장|care reward"` → 1 passed
- `npm run check:visual -- --grep "creature stage|도감은 보상표|달빛 보호 주문|돌보기|기억 도장|care reward"` → 4 passed
- `npm run check:visual` → 53 passed (4.8m)
- `npm run check:ci` → passed
- Browser Use `iab`: current-session Node REPL `js` tool 미노출 blocker 기록

## Visual evidence

- `reports/visual/browser-use-blocker-0282-20260503.md`
- `reports/visual/0282-lunar-care-memory-reward-playtest-20260503.md`
- `reports/visual/lunar-care-memory-reward-20260503.png`
- `reports/visual/lunar-care-album-stamp-20260503.png`
