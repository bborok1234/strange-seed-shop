# Phase 0 PRD: 이상한 씨앗상회

## 1. Product Intent

`이상한 씨앗상회` Phase 0는 상업용 방치형 웹게임의 첫 검증판이다. 목표는 큰 라이브서비스를 만드는 것이 아니라, 유저가 첫 세션에서 씨앗을 키우고, 첫 생명체를 소유하고, 오프라인 보상을 받기 위해 다시 돌아오는지 확인하는 것이다.

Phase 0는 다음 세 가지 질문에 답해야 한다.

1. 첫 90초 안에 "한 번 더 누르고 싶다"는 감각이 생기는가?
2. 첫 복귀 때 오프라인 보상이 충분히 명확하고 기분 좋은가?
3. 상점/편의/꾸미기 표면이 결제 의도 클릭을 만들 수 있는가?

## 2. Non-Goals

Phase 0에서는 다음을 만들지 않는다.

- 실제 결제
- 실제 광고 SDK
- WebSocket 실시간 이벤트
- 거래, 랭킹, 길드, 채팅
- 랜덤박스 또는 확률형 뽑기
- 시즌 패스 실제 보상 트랙
- 풀 관리자 페이지
- 런타임 이미지 생성

## 3. Target Player

기본 타깃은 모바일 브라우저에서 짧게 접속하는 캐주얼 유저다.

- 하루 여러 번 30초에서 3분씩 접속
- 수확, 성장, 도감 완성, 꾸미기 보상에 반응
- 복잡한 전투보다 명확한 숫자 증가와 귀여운 소유감 선호
- 한국어 우선 UX로 시작하되, 텍스트 구조는 이후 글로벌 현지화 가능하게 유지

## 4. Core Promise

플레이어는 작은 온실에서 이상한 씨앗을 키워 생명체를 수집한다. 생명체는 정원에 전시되거나 짧은 탐험에 보내져 재료를 가져온다. 게임을 꺼도 성장과 보상은 쌓이고, 돌아오면 바로 수확과 업그레이드를 할 수 있다.

## 5. Phase 0 Scope

### Content

- Seed families: 3
  - Herb
  - Candy
  - Lunar
- Seeds: 12
- Creature outcomes: 24
- Plots: 1 starting plot, 9 max plots
- Expeditions: 1 zone, 3 mission durations
- Decor: 6 preview-only decor items
- Album milestones: 8
- Tutorial missions: 7
- Daily missions: 6 rotating definitions, 3 active per day

### Systems

- Plant seed
- Tap growth acceleration
- Timer-based growth
- Harvest
- Duplicate merge
- Offline reward claim, capped at 8 hours in design but Phase 0 config may start at 4 hours
- Simple expedition assignment
- Collection album
- Shop mock surfaces
- Local analytics event log
- Config-driven content tables

### Data-Driven Content

Phase 0 content must be loaded from local typed config files. A new seed should be addable by config plus asset manifest without changing game logic.

Required config groups:

- `seed`
- `creature`
- `growthCurve`
- `rewardTable`
- `expedition`
- `mission`
- `shopSurface`
- `assetManifest`

## 6. First Session Flow

### 0:00-0:20: Start

The player lands directly in the greenhouse. No marketing landing page. The first visible surface is the playable garden with one empty plot and a shopkeeper prompt.

Required actions:

- Show one empty plot.
- Show three starter seed options.
- Player chooses one seed.

Success condition:

- Starter seed selected within 20 seconds in internal test.

### 0:20-1:30: First Creature

The player plants the seed, taps to accelerate growth, and harvests the first creature.

Rules:

- First seed growth time should be 20-30 seconds before tapping.
- Tapping should visibly reduce remaining growth.
- First harvest should always produce a named creature, not only currency.

Success condition:

- First creature acquired under 90 seconds.

### 1:30-3:00: Ownership

The player names or accepts a generated name for the first creature. It appears in the greenhouse and album.

Rules:

- Naming can be skipped with a default name.
- Album reward is granted immediately.
- Player sees the creature's family and role.

Success condition:

- Player understands that creatures are collectibles, not just output icons.

### 3:00-5:00: First Upgrade

The player uses leaves to buy a second seed, improve the first plot, or unlock a second plot.

Rules:

- At least one meaningful upgrade must be reachable without waiting.
- Upgrade effect must be visible in the UI.

Success condition:

- First meaningful upgrade under 5 minutes.

### 5:00-10:00: First Return Hook

The game introduces expedition and offline reward.

Rules:

- First expedition is a short 5-minute tutorial expedition.
- Player can assign the first creature.
- UI states that rewards will continue while away.

Success condition:

- Player can leave and return to claim a clear reward.

## 7. First Comeback Flow

Trigger after at least 15 minutes away.

Comeback modal must show:

- Time away
- Leaves earned
- Pollen or material earned, if any
- Growth completed
- One recommended next action

The modal must not immediately show a payment prompt. Shop mock can appear after the reward is accepted.

Success condition:

- Player can claim and spend comeback rewards in under 30 seconds.

## 8. Screens

### Garden

Primary screen. Shows plots, active growth timers, harvestable state, and quick actions.

Required UI:

- Plot grid
- Seed inventory shortcut
- Harvest all button when available
- Current currencies
- Next goal strip

### Seed Shop

Lists available seeds. Phase 0 uses soft currency only.

Required UI:

- Family filter
- Price
- Growth time
- Possible outcome hint

### Album

Shows discovered creatures and family progress.

Required UI:

- Discovered/undiscovered cards
- Milestone reward bar
- Creature detail

### Expedition

Assigns creatures to timed missions.

Required UI:

- One active slot
- Creature picker
- Reward preview
- Remaining time

### Upgrade

Shows plot and growth upgrades.

Required UI:

- Plot upgrade
- Tap power upgrade
- Offline cap upgrade preview
- Locked research teaser

### Shop Mock

Tracks purchase intent without charging.

Required UI:

- Starter pack mock
- Monthly greenhouse license mock
- Cosmetic decor bundle mock
- Plot/storage expansion mock
- "Notify me / 관심 있음" or click tracking CTA

## 9. Monetization Validation

Phase 0 monetization is click-intent only.

Track:

- Shop view
- Product card view
- Product CTA click
- Modal close
- Return to game after shop close

Products:

- Starter Merchant Pack
- Monthly Greenhouse License
- Greenhouse Decor Bundle
- Plot Expansion

No real payment, no checkout, no stored payment data.

## 10. Analytics

Required events:

- `session_start`
- `starter_seed_selected`
- `seed_planted`
- `growth_tapped`
- `creature_harvested`
- `creature_named`
- `album_reward_claimed`
- `upgrade_purchased`
- `expedition_started`
- `expedition_claimed`
- `offline_reward_claimed`
- `shop_viewed`
- `shop_item_clicked`
- `config_version_loaded`

Each event should include:

- anonymous player id
- session id
- timestamp
- config version
- current player age in seconds
- relevant entity id

## 11. Acceptance Criteria

- First creature acquired under 90 seconds.
- First meaningful upgrade acquired under 5 minutes.
- First expedition can be started within 10 minutes.
- Offline reward works for 15-minute and cap-length absence.
- A seed can be added by config and asset manifest without changing game logic.
- Runtime gameplay contains no image generation calls.
- Shop mock records view and click events.
- Phase 0 can be completed solo in a browser without login.

## 12. Autonomous Project Hooks

Phase 0 should be designed so future agents can manage the project without constant human direction.

Required artifacts:

- `docs/PRD_PHASE0.md`: product contract
- `docs/ECONOMY_PHASE0.md`: economy contract
- `docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md`: bot/agent operating model
- `.codex/skills/gpt-game-asset-*`: asset production workflow
- future `items/` or `tasks/` records for agent-readable work items

The project should follow a ClawSweeper-inspired two-lane model:

- Review lane proposes changes and creates evidence-backed reports.
- Apply lane mutates files only when the proposal is still valid and acceptance criteria are clear.
