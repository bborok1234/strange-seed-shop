# Critique — Art Director (Phase 3)

- Axis: `stage-art-first-restructure`
- Persona: Art Director
- Phase 3 (cross-critique)
- Date: 2026-05-04
- 작성 원칙: 시각 hierarchy / token / vocabulary / asset breathing 네 lens로만 비판. cost / verb / 일정 영역 침범 금지.

---

## 1. Disagreement with Designer

Designer proposal은 player-feel을 정확히 짚었지만, 시각 결정에 들어오는 순간 hierarchy·token·vocabulary가 약해진다. 5개 이내로 추린다.

### D-1 — L2 edge ambient ≤ 15% 상한이 visual hierarchy의 2 tier(ambient breath)를 죽인다 (high)

Designer는 "L2가 늘면 cream rectangle이 stage 안으로 다시 들어옴"으로 ≤ 15%를 못 박았는데, 이건 **cream rectangle = visual weight라는 잘못된 등치**다. 본 proposal § 1의 Tier 분배에서 `color.surface.decal.warm` (alpha 0.62) + `radius.decal.leaf` organic shape는 cream rectangle이 아니다 — alpha-aware decal은 면적이 늘어도 art share를 깎지 않는다. ≤ 15% 상한은 면적이 아니라 **alpha 기반 cream-luminance 점유율 ≤ 20%** 로 재정의되어야 hierarchy의 2·3 tier가 함께 산다. Designer 상한대로 가면 next-action eyebrow + creature mini portrait가 stage edge에서 압축돼 col-span으로 표현 못함.

### D-2 — "currency는 dock에만, stage 위 floating cream pill 0개" 결정이 Tier 5 ephemeral motion vocabulary를 끊는다 (high)

Designer는 plot tap reward(+N 잎)를 sprite-안 burst로만 표현하고 currency 숫자는 dock tick으로 분리하라고 했다. 본 proposal § 5의 motion 결정 규칙 Q3("cross-region 발화는 `z.stage.moment` + `gesture.celebrate` 강제")와 충돌한다. plot tap reward가 stage L2에서 발화하고 dock currency cluster가 별도 tick으로 응답하면 **두 motion이 vocabulary 매핑 표 밖에서 disjoint하게 발화** — Cycle 1 brief evidence의 "motion이 vocabulary 없이 단발로 추가" 위반 패턴 그대로다. reward는 stage L2 burst → `z.stage.moment` glow halo → dock currency cluster tick까지 **하나의 `gesture.celebrate` 연속 motion**으로 묶여야 한다.

### D-3 — L1 in-canvas diegetic UI가 art bible의 hand-painted 톤과 충돌할 risk를 Designer가 본인 영역 밖으로 밀어냈다 (medium)

Designer는 "L1이 art bible과 시각 충돌하지 않는다는 가정 — Art Director critique 영역, sprite-friendly font + alpha-aware token 정의해줘야"로 책임을 본 페르소나에 위임했다. 그러나 Designer가 명시한 "plot 위 작은 % badge, 100% reach 시 '수확!' floating chip"은 본 proposal § 6의 신규 자산 우선순위 high 안에 들어 있지 않다 — `decal_action_leaf_frame_001`, `decal_creature_portrait_pad_001`까지만 high. plot 위 % badge는 sprite-안 typographic 표현이 필요한데, 이걸 본 proposal § 4의 `color.surface.decal.glass` (alpha 0.42) decal로 통일할지, 아니면 별도 sprite typographic 어휘를 추가할지 Designer가 결정 외주를 했다. 본인은 **sprite typographic은 별도 axis**로 분리하고 본 axis에서는 L2 edge ambient의 React DOM Inter font로만 표현하자고 push한다.

### D-4 — "stage 안 cream rectangle 픽셀 점유율 ≤ 10%" 약속이 본 proposal의 ≤ 20%보다 강한데, 그 strict가 art bible warm pastel 톤을 위협한다 (medium)

Designer measurement(L2 edge transparent 가정)는 cream luminance 픽셀 ≤ 10%를 약속한다. 본 proposal § 1은 ≤ 20%다. Designer 수치가 더 strict해서 좋아 보이지만, 10% 안에 들어가려면 L2 decal alpha를 0.42 이하로 더 낮춰야 한다 — 그 순간 `color.surface.decal.warm` (alpha 0.62)가 미달이고 warm pastel의 "온실 햇살" 따뜻함이 시각적으로 사라진다. art bible의 "warm whimsical mood"는 cream pastel tone이 일정 luminance presence를 유지해야 작동한다. **measurement strict ≠ art quality**. Designer 수치는 art bible align과 trade-off를 안 본 채 강화됐다.

### D-5 — 5초 onboarding 시나리오가 motion vocabulary를 새로 발화한다 (low)

Designer 5초 시나리오의 (0~1s) "rail/dock 살짝 entrance, stage 즉시 fill"은 본 proposal § 5의 6 gesture 매핑에 없다. rail/dock entrance가 `gesture.reveal`인지 `gesture.settle`인지 `gesture.chapter`인지 명시 없음. plot sprite (1~2s) "grow-in tween"도 `gesture.ambient` 안 idle loop와 다른 entrance gesture가 필요하다 — vocabulary 추가 없이 "tween"이라고 부르면 또 단발 발화가 된다. 본 proposal §5 Q4의 `settle` 1개 추가만으로는 부족할 수 있고, Designer 시나리오는 motion 결정 규칙 3 질문을 통과 안 한다.

---

## 2. Disagreement with Engineer (cost calculus → 시각 결과 lens)

Engineer proposal은 cost-only 결론 안 박고 평행 제시로 잘 닫았지만, **cost framing 자체가 시각 결과에 미치는 영향**이 5건 있다. cost 평가 거부가 아니라, cost framing이 visual hierarchy를 깎는 lens로 들어오는 지점만 본다.

### E-1 — bundle +12~24KB framing이 Paradigm A를 시각 평가 전에 사실상 reject 위치로 밀어붙인다 (high)

Engineer는 "Designer/Art Director가 A를 선택하면 budget 재협상"이라고 named option을 열어뒀지만, brief soft constraint "+10KB" 위반 명시 + Phaser 한글 글리프 80~200ms freeze risk가 cost 표 안에 함께 묶여 있어 **시각 평가 전에 A는 already 'expensive option'로 framing**된다. 본 proposal § 3은 A를 **typographic hierarchy(currency 숫자 sprite font 깎임) 시각 사유로 거부**했다 — Engineer cost framing과 결론은 같지만, Engineer framing이 먼저 reader 머리에 들어오면 시각 사유가 묻힌다. Director synthesis에서 A 거부 사유는 본 proposal의 "typographic information hierarchy 손상"이 첫째 sentence여야 한다, "bundle +24KB"가 첫째 sentence면 안 된다.

### E-2 — `check:art-share` 임계값 `stageReactPanelCreamRatio <= 0.30`이 본 proposal § 1 약속(≤ 20%)을 30%로 풀어버린다 (high)

Engineer PR-INFRA-1 임계값 표는 "stageReactPanelCreamRatio > 0.30 → fail"이다. 본 proposal § 1 약속은 cream pixels ≤ **20%** + art-only pixels ≥ **75%**다. Engineer 임계값이 spec.md에 그대로 옮겨가면 시각 약속이 implementation gate에서 30%로 quietly 후퇴한다 — Cycle 1 § Decisions §1 위반 패턴(spec text는 강하고 implementation gate는 약함) 정확히 재현. Engineer 본인은 "임계값은 spec.md acceptance에서 옮겨와야"라고 C-2에서 양보했지만, PR-INFRA-1 PR 본문 hardcoded 표 자체가 이미 30% 기준점으로 anchoring 효과 발휘. 본 proposal § 1 수치(≤ 20%, ≥ 75%, ≥ 3:1)가 임계값 source-of-truth로 spec.md § Acceptance에 박혀야 한다.

### E-3 — `check:art-share` 색 sampling이 hex literal(`#fffbe9`, `#fff7d2`)로 작성된다 (high)

Engineer 측정 스크립트 description에 "cream(#fffbe9, #fff7d2, rgba(255,252,232,*)) 픽셀 % 측정"이 그대로 적혔다. 본 페르소나 MUST push back 항목 중 하나가 "색·spacing·motion에 token 없이 hex/px 직접 박힌 spec." 측정 스크립트가 token 우회해서 hex를 hardcode하면 token rename axis(별도 미뤄둔 약속) 진행 시 측정 스크립트가 silently break. 측정은 **token 이름 (`color.surface.dock.warm`, `color.surface.decal.warm`)을 CSS custom property로 resolve해서 RGB sampling**해야 하고, hex literal은 fail 사유다.

### E-4 — Frame-overlay(B)의 cost가 가장 작다는 framing이 시각적으로 가장 약한 안을 Director에게 push할 risk (medium)

Engineer cost 표에서 B는 +4~9KB로 가장 작고 4 PR로 짧다. 본 proposal § 3은 B를 **"frame border만 두르고 안은 cream rectangle 그대로 — art share 측정 미달"** 시각 사유로 거부했다. Engineer cost framing이 그대로 Director에게 들어가면 "비용이 작으니 B"가 시각 결정을 우회할 risk. Engineer가 명시적으로 "design intent 무단 깎음 0건"이라 닫았지만, cost 평행 제시 표 자체가 implicit ranking 효과 — B가 표 가장 짧은 줄로 등장. Director synthesis에서 B 거부 시 시각 사유가 먼저, cost 평행은 그 다음이어야 한다.

### E-5 — `desktop-shell` width cap = `min(1180px, calc(100vw - 48px))` 측정 baseline 질문이 art share 약속의 분모를 흔든다 (medium)

Engineer Open Q2는 measurement ROI를 viewport(1920) 기준인지 shell(1180) 기준인지 spec.md에서 결정하라고 했다. 본 proposal § 1 약속은 "1920×1180 viewport"라고 적었다. 두 baseline은 art share %를 크게 다르게 만든다 — viewport 기준이면 양옆 cream margin이 분모에 들어가서 art %가 깎이고, shell 기준이면 stage region 안 art share만 측정. 본 페르소나 입장: **shell 기준 측정 + 양옆 margin은 별도 art zone 약속(brief Q1 신규 widescreen 자산 추가)**으로 분리. shell 안 art ≥ 75% 약속 + shell 외부 margin은 별 axis로 미루는 것이 시각 약속의 정합성을 지킨다.

---

## 3. Self-critique (본 proposal 자기 시각 risk)

5개 이내, 본인만 볼 수 있는 시각 약점.

### S-1 — `radius.decal.leaf` organic asymmetric shape가 viewport·browser별 hand-painted 톤을 유지 못할 risk (high)

본 proposal § 4는 `60% 40% 64% 36% / 50% 60% 40% 50%` percentage radius로 organic leaf shape를 정의했다. percentage radius는 element 폭·높이에 비례 — stage L3 decal이 viewport 폭에 따라 width가 변하면 leaf shape의 visual asymmetry가 비례 변형되어 매 viewport마다 다른 leaf 모양이 그려진다. art bible의 "hand-painted soft rounded silhouettes"는 일관된 silhouette을 전제로 하는데 percentage radius는 일관성을 깬다. § 8 Q5에 SVG mask 격상을 future axis로 미뤘지만, 본 axis 안에서 organic shape가 여러 viewport에서 art bible과 misalign하면 cream rectangle 폐기 약속만 지킨 채 art quality 약속을 흔든다. mitigation: viewport-stable한 **`clamp(160px, 14vw, 240px)` width 박힌 fixed-aspect decal**로 § 4 token 재정의 필요.

### S-2 — L1 background plate `background-size: cover` 결정이 1920×1180에서 일러스트 cropping을 강제한다 (high)

본 proposal § 3 Paradigm D 정의 안 L1은 `background-size: cover; background-position: center bottom`이다. § 8 Q1에 "신규 widescreen 배경판 자산 없으면 양옆이 단색 cream"이라 명시했지만, **자산 추가가 본 axis 안에서 일어나지 않으면 cover crop가 일러스트 상단(천장 등 art bible의 핵심 시각 요소)을 잘라낸다.** § 1 measurement art ≥ 75%가 통과해도 시각적으로는 잘린 일러스트가 stage를 채우는 결과 — paradigm 약속 measurement 통과인데 art quality 후퇴. 본 axis Phase 4 Director synthesis에서 widescreen 자산 추가가 Engineer cost framing 때문에 cut되면, 본 proposal § 3은 약속 자체가 measurable하게는 지켜지지만 visual하게는 미달.

### S-3 — `gesture.settle` 신규 1 gesture 추가가 6 gesture vocabulary에 미치는 부하를 본인이 낙관 (medium)

§ 4·§ 5 신규 `gesture.settle` (420ms × emphasized) 추가는 brief § Decisions §5 정신 align이라 적었지만, 5 → 6 gesture 확장은 **vocabulary 결정 규칙 § 5의 3 질문 표를 함께 늘린다**. Engineer가 Q4에서 "vocabulary 1개 추가도 cost"라고 push할 가능성을 본 proposal § 7에서 "추가 유지"로 닫았지만, 시각적으로 `gesture.settle`과 `gesture.reveal`의 차이(420ms emphasized vs 420ms entrance)가 player 시각에 구분되는지 본인이 user testing 없이 단언했다. 차이가 안 보이면 vocabulary 부풀림만 남고 motion 어휘 일관성은 그대로 — 차라리 `gesture.reveal`의 sub-variant `reveal.settle`로 묶는 게 vocabulary 부담 작다.

### S-4 — § 1 contrast 약속 "Tier 1 ↔ Tier 2 luminance ≥ 1.6:1"이 hand-painted plate 위 sprite를 지나치게 띄울 risk (medium)

§ 1의 contrast 약속 1.6:1은 sprite가 배경에서 떠올라 Tier 1을 보장하기 위한 수치지만, hand-painted greenhouse plate는 자체가 mid-luminance warm pastel — sprite가 1.6:1로 떠오르면 sprite outline이 sticker처럼 도드라져서 art bible "soft rounded silhouettes"의 부드러운 통합감을 깬다. WCAG 텍스트 4.5:1과 다른 영역(sprite ↔ painted background)이라 1.6:1 근거가 약한데, 본 proposal § 1 표에서 fixed number로 박혔다. spec phase에서 measurement 통과를 위해 sprite outline halo (`color.outline.sprite.glow` 4px halo)가 항상 켜지면 hand-painted 톤이 게임 sprite 톤으로 격하될 risk.

### S-5 — § 6 신규 자산 4종 제안이 art bible 유지 책임을 본 proposal 안에서 닫지 못함 (low)

§ 6은 `decal_action_leaf_frame_001` 등 신규 자산 4종을 priority high/medium/low로 제안했지만, **그 자산들이 art bible의 "cute-strange greenhouse, soft rounded silhouettes, warm whimsical mood"와 align한다는 검증 절차**를 본 proposal 안에 안 적었다. Engineer A-2에서 `check:asset-style` 게이트를 언급했지만 그 게이트 통과만으로 art bible align 보장 어려움. 본 proposal § 9 enforcement contract 5 gate 안에 "신규 자산 art bible critique pass"가 없다 — 6 번째 gate로 추가했어야 함.

---

## 4. Cross-cutting risks (여러 proposal을 함께 읽어야 보이는 시각 risk)

다른 페르소나 1명만 봐서는 안 보이는 시각 risk만 5개 이내.

### X-1 — 세 proposal이 모두 measurement strict를 강조하지만 measurement passes ≠ art quality (highest)

Designer ≤ 10%, Engineer ≤ 30%, 본 proposal ≤ 20%. 셋 다 다른 수치인데 모두 "measurement 통과 = paradigm 약속 지켜짐"으로 읽힌다. **measurement는 cream pixel 점유율만 본다 — art bible align (warm whimsical, hand-painted 톤), 시각 hierarchy 시선 anchor 순서, motion vocabulary 일관성은 측정 안 됨.** Cycle 1 회고가 "체크리스트 100%, 사용자 가치 10%" 였는데 본 axis는 measurement 추가로 그 패턴을 strengthen하지 deviance 안 한다. measurement 통과 후 **사용자 시각 검증 gate** (본 proposal § 9 gate 5)가 model의 정성 평가가 아니라 사용자 직접 시각 검증으로 닫혀야 하는 이유.

### X-2 — 세 proposal 모두 dock cluster의 카드 stacking을 별도 어휘 없이 dock 안 packing으로 가정 (high)

Designer는 dock 4 카드 유지, Engineer는 dock contrast ≥ 3:1 측정만, 본 proposal § 2는 "dock 내부 카드들은 외곽선 없이 spacing으로만 구분"이라 적었지만 **dock 안 4 cluster 사이 visual hierarchy(어떤 카드가 primary anchor인가)** 는 세 proposal 모두 명시 안 함. dock 배경이 stage cream과 contrast 3:1을 회복해도 dock 안 4 카드가 동일 weight로 stack되면 player 시선이 dock 안에서 또 hierarchy 없이 헤맨다. 이전 axis spec § Decisions §4 "dock 4 cluster spike hierarchy" 위반의 직접 재현 risk.

### X-3 — 세 proposal이 모두 reward L4 / Tier 5 ephemeral motion의 cross-region 발화 정책을 follow-up axis로 미룬다 (high)

Designer Q5, 본 proposal Q3 모두 `cross-region-moment-elevation`을 별도 axis 약속으로 인용. Engineer는 measurement 대상 아님 명시. 그런데 본 axis가 stage = art-only로 가면 reward는 art 한복판에서 발화 — dock currency tick과 stage burst가 **두 region에서 동시 발화**한다. 후속 axis에 미뤄도 되지만, 본 axis Cycle 1에서 reward 발화 시 cream 패널이 stage 위에 잠시라도 등장하면 art-share measurement는 momentary로 통과해도 사용자 시각에는 "cream rectangle 다시 등장" 인상. **본 axis 안에서 ephemeral moment가 alpha-aware 약속을 위반 안 한다는 1 sentence enforcement** 가 spec § Acceptance Criteria에 들어가야 한다.

### X-4 — 세 proposal이 모두 mobile 회귀 0을 non-negotiable로 적었지만 desktop의 신규 token이 mobile에서 silently 작동하는 경로를 명시 안 함 (medium)

본 proposal § 4 Modify 표에 `--surface-panel`은 mobile 유지 + desktop L3에서 `color.surface.decal.warm` 사용으로 분기 적었지만, Designer·Engineer는 mobile 분기 명시 없음. CSS custom property는 viewport에 무관하게 cascade — `color.surface.decal.warm`을 `:root`에 정의하면 mobile에서도 cascade되어 mobile snapshot에 영향 가능. **신규 6 token + 1 gesture가 mobile @media query 밖에 어떻게 정의되는지** 세 proposal 모두 silent. desktop @media block 안에 token 정의가 들어가야 mobile snapshot 회귀 0 보장.

### X-5 — 세 proposal이 모두 stage L1 일러스트의 day↔night transition을 가정만 하고 motion 어휘에 anchor 안 함 (medium)

본 proposal § 5는 `gesture.chapter`를 "merchant chapter 전환, stage L1 day↔night transition"으로 매핑했지만, Designer·Engineer 어디에도 day↔night transition trigger·duration·side effect 명시 없음. 세 proposal 합치면 stage L1 배경판이 시간대별로 바뀌는데 **그 transition이 player verb 1·2·3을 잠시 가리는지, ambient overlay인지** 결정 없음. 본 axis 안에서 day↔night가 발화하지 않을 수 있지만, 발화 가능 경로가 spec에 적혀 있으면 implementation에서 또 단발 발화가 될 risk. 명시적 "본 axis 범위 밖" 또는 "L1 transition은 `gesture.chapter` 880ms cross-fade로 강제"로 닫아야 한다.

---

## 5. Concessions (본인이 양보 가능한 시각 결정)

다른 페르소나 disagreement에 대한 honest 양보 5개 이내.

### C-1 — Designer L2 ≤ 15% 상한과 본 proposal § 1 ≤ 20% cream luminance 사이는 ≤ 18% 정도로 협상 가능 (medium 양보)

D-1에서 Designer ≤ 15% 면적 상한을 거부했지만, **alpha-aware decal 측정 정의가 spec § Acceptance에 정확히 들어가면** 면적 ≤ 15% 상한 자체는 받아들일 수 있다. 핵심은 "면적 ≤ 15%인데 그 면적의 콘텐츠가 alpha 0.62 + organic shape이면 art breath 살아남"이 spec text로 닫히는 것. cream luminance 점유율과 React panel 면적은 별개 measurement — 두 measurement를 둘 다 통과시키면 본 proposal 약속과 Designer 약속 양립 가능.

### C-2 — § 1 art share ≥ 75% → ≥ 70% 후퇴 가능 (high 양보)

본 proposal § 7에서 Senior Critic이 잡을 만한 risk로 본인이 이미 인정 — "75% 근거는 honest admission, 70% → 75% 차이가 visual에 결정적 아님". Director가 brief 약속(70%) 그대로 가도 본 proposal 핵심 layer 분리 (L1/L2/L3) + alpha-aware enforcement는 흔들리지 않는다. Engineer measurement 임계값 0.55(stageArtBackgroundPixelRatio) 표가 그대로 spec에 옮겨가면 본 proposal 75%가 무너지므로, 70% 또는 75% 둘 중 하나를 spec § Acceptance에 source-of-truth로 박는 결정만 Director가 하면 된다.

### C-3 — Engineer Frame-overlay(B) cost-framing이 시각 사유 없이 Director에게 push되지 않는다는 약속을 받으면 cost 평행 제시 OK (medium 양보)

E-4에서 본 proposal이 B framing risk를 지적했지만, **Engineer cost 표가 시각 사유 표 다음에 등장하는 spec 구조** (시각 평가 → cost 평가 → 결정)가 보장되면 cost 평행 제시 자체는 받아들일 수 있다. spec.md § Decisions Resolved 안 paradigm 결정 entry가 "시각 사유: ..., cost trade-off: ..., 결정: ..." 순서로 적히면 framing risk 해소.

### C-4 — Designer L1 in-canvas diegetic UI(plot 위 % badge 등)를 본 axis 안 ship에 시각 동의 (medium 양보)

Designer Q1에서 L1 ship을 본 axis 필수로 push했고, D-3에서 본 proposal이 "별도 axis 분리" 입장이라 적었다. 그러나 Designer가 강하게 push하고 sprite typographic font가 `creature_*` sprite 톤과 align 가능하면, **본 axis 안 ship 동의 가능**. 단 조건: (a) plot 위 % badge가 React DOM Inter font로 stage L3 decal 안에 들어가는 형태(canvas overlay로 좌표 동기화), (b) sprite-안 typographic은 "수확!" chip같은 모먼트 1종으로만 제한. 두 조건 충족 시 art bible 충돌 risk 낮춤.

### C-5 — § 4 신규 motion gesture `settle` 추가는 `gesture.reveal.settle` sub-variant로 격하 가능 (low 양보)

S-3 self-critique에서 본인이 인정한 vocabulary 부풀림 risk 그대로. Engineer가 vocabulary 1 gesture 추가도 cost로 push하면 **`reveal` 안 sub-variant** (`reveal.entrance` 420ms entrance / `reveal.settle` 420ms emphasized)로 묶어서 5 gesture vocabulary 유지 가능. 시각 결과는 거의 동일.

---

## 6. References

- 본 proposal: `reports/deliberation/stage-art-first-restructure/proposals/art-director.md`
- Designer proposal: `reports/deliberation/stage-art-first-restructure/proposals/designer.md`
- Engineer proposal: `reports/deliberation/stage-art-first-restructure/proposals/engineer.md`
- Brief: `reports/deliberation/stage-art-first-restructure/brief.md`
- Persona: `docs/studio/personas/art-director.md`
- Workflow: `docs/studio/DELIBERATION_WORKFLOW.md`
