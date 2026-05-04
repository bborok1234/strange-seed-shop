# Critique — Senior Critic

- Axis: `desktop-ui-redesign`
- Persona: Senior Critic (선임 비평가)
- Date: 2026-05-04
- 입력: brief.md + designer.md + art-director.md + engineer.md
- 본 문서는 challenge-only. 대안 제시 0건.

---

## 1. Hidden Assumptions per Proposal

### Designer

- **가정 A1**: "데스크톱 player의 verb 80%는 정원에서 일어난다 / 세션 8~20분."
  - 근거 없음. proposal §6에서 본인이 인정. **그런데 이 가정이 D안 전체 골격(Garden=무대, 나머지=drawer)을 떠받친다.** 가정이 틀리면 안이 통째로 무너진다.
  - **질문**: 데스크톱 player가 idle check-in 위주(2~3분 burst, plot tap 거의 없음)면 "Garden=무대" 전제가 성립하는가? 그 경우 Side Dock의 timer cluster가 primary, Garden Stage가 secondary가 되어야 하는데, 그 안은 D인가 다른 안인가?

- **가정 A2**: "Drawer는 명시적인 닫기 verb를 강제하므로 정원으로 돌아오는 closure가 강하다."
  - 정말? non-blocking overlay인데 닫기를 강제한다? player가 drawer를 열어둔 채로 plot을 tap하면 그건 closure 안 한 상태. 강제 closure 메커니즘이 spec에 없다.
  - **질문**: drawer가 열린 채 plot tap이 가능하다면(§3에서 본인이 그렇게 정의) drawer는 자기 말대로 "명시적 닫기 강제"가 아니다. 그럼 split-pane 거부 근거는 무엇인가?

- **가정 A3**: "5탭 컨셉 유지(brief Non-negotiable #4)는 desktop에서 4-drawer + 1-stage로 풀어도 정신 위배 아님."
  - brief 원문은 "5개 surface 자체는 그대로"이지 "Garden을 surface 목록에서 제외해도 된다"가 아니다. **본인의 해석이 brief 위반에 가깝다.**
  - **질문**: Garden을 nav 목록에서 빼면, 모바일에서 "정원 탭"을 통해 player가 형성한 mental model("정원도 5개 중 하나")이 desktop에서 깨진다. 그 cognitive cost는 어떻게 정당화하나?

### Art Director

- **가정 B1**: "stage region은 art-only zone, React 패널 overlay 금지(eyebrow/chip만 ≤ spacing.3xl 허용)."
  - 그런데 §1에서 "primary 시각 weight 60% = stage" 라고 한다. **art-only인데 player가 시선을 처음 잡는 곳이라면, 거기서 player가 할 수 있는 verb는 무엇인가?** plot tap뿐이다. "art가 호흡하는 비디오 같은 화면" + "tap을 유도하는 게임 화면"은 다른 요구다.
  - **질문**: stage 70% 면적을 art가 점유하면 plot 9칸 grid는 어디에 들어가나? 9칸을 다 펼치면 art가 가려진다. 9칸을 작게 그리면 mobile 414px 대비 desktop 700px의 면적 이득이 사라진다. 어느 쪽인가?

- **가정 B2**: "rail은 mobile→desktop의 shape change지만 'production game 표준'이라 학습 비용보다 hierarchy 이득이 크다."
  - "다른 production game이 그렇다"는 인용은 본 persona 가이드(MUST push back: "다른 게임도 이래") 위반. **inertia 정당화.**
  - **질문**: bottom-tab을 손가락 휴식처로 학습한 player가 desktop에서 좌측 vertical rail로 옮겨갔을 때, 그 행위가 "한 번 학습으로 끝나는가" 아니면 "viewport resize마다 시선 이동 거리가 달라지는가"? 후자라면 학습 비용은 1회가 아니다.

- **가정 B3**: "motion duration 4단(120/220/420/880ms) + easing 3종이면 region transition vocabulary로 충분하다."
  - 게임 motion이 더 다양하다는 critic 예상 공격에 "본 axis는 region transition만"이라고 답했지만, 이미 §4에서 ambient(seed-breathe), state change(reward-pop), entry/exit(rail item) 모두 vocabulary 안에 끌어왔다. **vocabulary 범위가 점점 넓어지는데 단 4 named gesture로 게임 전체 motion을 lock하면 후속 polish가 매번 vocabulary와 충돌한다.**
  - **질문**: vocabulary 외 motion이 발생하면 그건 "위반"인가 "vocabulary 확장"인가? 확장이면 vocabulary는 implicit하게 무한 — 결국 vocabulary가 아니다.

### Engineer

- **가정 C1**: "Option A는 비용 ⅓, 모바일 회귀 risk 최소, save 영향 0."
  - 비용 추정의 baseline이 없다. "추정 ~350~490줄" / "5~6 PR" — **이 숫자의 근거가 본인의 직감 외에 무엇인가?** 22개 micro-polish PR의 평균 줄수·평균 회귀 빈도와 비교한 데이터 0건.
  - **질문**: A를 5~6 PR로 분할 시, 각 PR 사이 main에 다른 polish PR이 merge되면 conflict가 누적된다. 22 PR/month 속도로 main이 움직이는 환경에서 desktop layout PR 5~6개를 직렬로 끼워 넣을 때 conflict 비용은 산정에 들어갔는가?

- **가정 C2**: "Phaser scene boundary 무수정 — `scale.mode = RESIZE`로 resize listener가 자동 처리."
  - "자동 처리"는 코드 레벨 truth지 *gameplay 레벨 truth가 아니다*. plot 9칸 grid layout을 GardenScene이 viewport 폭에 따라 어떻게 재배치하는지 logic이 scene 안에 hardcoded일 수 있다 — 그 경우 컨테이너만 키우면 plot이 좌상단에 몰려 빈 캔버스가 다시 생긴다 (=brief의 "70% 빈 cream" 문제 재발).
  - **질문**: Phaser scene 내부의 plot grid logic이 viewport 폭에 비례해서 펼쳐지는가, 아니면 mobile portrait 비율 가정으로 hardcoded인가? 후자라면 brief 성공 조건 "정원 영역이 desktop 폭 ≥ 60% 점유" 달성에 scene boundary 위반 없이는 불가능할 수 있다.

- **가정 C3**: "Option C는 'GardenScene 내부 mechanic 변경 금지' 위반 가능성 매우 큼 → 거부."
  - "위반 가능성 매우 큼"으로 거부했지만 *위반인지 아닌지를 확정하지 않았다.* in-canvas HUD가 mechanic 변경인가, 단순 추가 layer인가? Phaser는 scene 위에 별도 container를 쌓는 게 일반적이다.
  - **질문**: C를 "axis 범위 외"로 declare하는 건 engineer 권한인가, 아니면 director 결정인가? engineer의 cost estimate가 axis scope를 사실상 결정짓는 구조면 그건 process 문제다.

---

## 2. Premature Consensus Risks

세 안이 다음 지점에서 너무 빨리 합의에 가까워졌다 — 누구도 challenge 안 함:

### 합의-위험-1: "Side Dock(우측 ~22~25%)이 영구 노출되어야 한다"

- Designer §1-B, Art Director §1 dock 25%, Engineer Option A "side dock" — 셋 다 dock의 *존재* 자체는 동의.
- **누구도 묻지 않은 것**: "왜 dock인가? floating chip cluster나 stage 내부 corner overlay가 아닌 이유는?" Art Director는 art-hiding stacking을 이유로 들지만, dock이 *영구 cream surface로 art 옆에 고정되어 있는 것이* art bible과 정합한다는 근거는 어디에도 없다. cream 매트가 viewport 70%를 점유한다는 brief 비판이 dock으로 cream 매트를 22% 영구 점유로 *고정하는* 안에는 적용되지 않는가?
- **합의가 빠른 이유**: 셋 다 모바일의 top-bar HUD를 어디로 옮겨야 한다는 강박이 있어서, "옮긴다"의 first-best target이 dock이라고 무비판 수렴.

### 합의-위험-2: "Option C(in-canvas overlay) 거부"

- 셋 다 거부. Designer = scene boundary 위반, Art = canvas sharp pixel과 React smooth overlay 시각 충돌, Engineer = mechanic 변경 risk.
- **누구도 진지하게 검증 안 함**: in-canvas overlay가 정말 mechanic 변경인가? Phaser DOM container layer를 쓰면 React smooth overlay와 scene이 공존 가능하다 (Phaser 공식 패턴). 셋이 빠르게 거부하면서 brief의 sketch 옵션 C를 *실제로 prototype해 본 사람 0명*.
- **합의가 빠른 이유**: 셋 다 자기 영역 변경 비용이 큰 안을 본능적으로 회피. critic이 brake 안 걸면 C는 검토 없이 매장된다.

### 합의-위험-3: "5탭 surface는 어떤 형태로든 살아남는다"

- brief Non-negotiable #4가 강제하기 때문에 모든 안이 5탭을 보존. **그런데 brief의 이 제약 자체가 정당한가?** "감성 도감 게임"에서 5개 surface가 정말 동등 가치인가? shop이 다른 4개와 동등한 surface로 영구 노출되는 게 dark pattern 우려를 키우는데(Designer §4에서 본인도 지적), 그럼 surface 4개로 줄이는 옵션은 왜 검토 안 했나?
- **합의가 빠른 이유**: brief가 못 박아서. 모두 brief에 순응. 누구도 brief 자체에 push back 안 함.

### 합의-위험-4: "데스크톱 redesign이 지금 시급하다"

- Designer Open Question #2에서 본인이 묻는다 — "데스크톱 점유율이 1%면 axis 자체가 priority 낮음." Engineer는 5~6 PR + spike 2시간을 가정. Art Director는 token 마이그레이션·asset 재생성까지 후속 axis로 떠넘김.
- **누구도 답을 요구 안 함**: 데스크톱 점유율 데이터 없이 5~6 PR을 시작하면, 데이터가 1%로 나온 순간 sunk cost가 된다. brief는 "사용자가 process critique을 동시에 한 시점이라 deliberation workflow의 첫 dogfooding 케이스로 가장 적합"이라고 정당화하는데, **dogfooding 가치 ≠ player impact 가치**.

---

## 3. Inertia / Precedent Justifications

명시적으로 호명한다:

| 위치 | 인용 | 위반 유형 |
|---|---|---|
| Designer §3 | "Persona 룰 충족: 모든 region 단일 verb가 ≤ 3 tap." | "이전 룰을 충족했다"가 verb design의 정당화로 사용됨 — 룰 자체의 적합성 검증 없음. |
| Art Director §6 vs Critic 예상 공격 응답 | "viewport별 navigation 형태 분기는 production game 표준 (mobile bottom-tab, desktop side-rail)." | **"다른 게임도 이래" 정당화.** persona 가이드 명시 위반. |
| Art Director §3 spacing.* | "8pt scale을 위해 `--space-5`(20px) 누락 정정 = 도입 안 함." | 8pt scale은 외부 convention. "convention이 그렇다"가 spacing 결정의 근거 — 우리 게임의 시각 요구가 8pt에 정합한다는 검증 0건. |
| Engineer §1 | "각 PR 모두 ≤ 5 파일 / ≤ 500줄 권장 충족." | brief soft constraint를 정당화로 사용 — 실제로 이 분할이 *quality*를 높이는지(아니면 그냥 PR 숫자를 늘리는지) 검증 0건. |
| Engineer 최종 권고 | "Option A 권장. 이유: 비용 ⅓ 수준 ... 5~6 PR로 분할 가능." | **"구현이 쉽다" 정당화.** persona 가이드 명시 위반. user impact 측정 0건 상태에서 implementation cost가 결정 driver가 됨. |
| Designer §6 Open Q #3 | "lunar care reveal / 3rd merchant arc 같은 future content가 어느 region에 들어가는지 미정 ... 본 안에서는 region만 확보." | 미래 unspecified content를 위해 region을 미리 비워둠 — YAGNI 위반. |

**모두 challenge**: 위 6개 정당화 중 어느 하나도 player impact 데이터·사용성 테스트·실제 prototype 검증으로 뒷받침되지 않는다. 전부 convention·이전 결정·구현 편의·미래 가정에 기댐.

---

## 4. Brief-level Challenges

Director의 brief 자체에 push back 한다. critic은 director에게도 brake를 건다.

### Brief 약점 4-1: 단일 사용자 스크린샷이 redesign의 evidence

- brief "Current State"는 *2026-05-04 사용자 스크린샷 1장*에 전적으로 의존. 1920×1180 viewport 1개 사례.
- **질문 to Director**: 이 스크린샷이 *worst case*인가 *typical case*인가? player 다수가 1366×768(노트북 표준)에서 본다면 brief의 모든 수치(viewport 70% 빈, dock col-span-3 = 270~432px)가 다르게 적용된다. 1장 스크린샷으로 axis 시작은 weak premise.

### Brief 약점 4-2: "production game quality" 가 정의되지 않은 채 success 조건으로 등장

- brief "Why This Axis Now": "production game quality에 한참 못 미침." Success: "production game quality bar로 전진."
- **질문 to Director**: production game quality의 측정 기준이 무엇인가? 만약 "내가 보기에 부족"이 기준이면 spec.md의 acceptance criteria가 director의 주관적 판단으로 결정됨 — 그건 deliberation의 의미를 약화시킴.

### Brief 약점 4-3: "5탭 컨셉 유지" Non-negotiable의 정당화 부재

- 5탭이 왜 non-negotiable인가? brief는 이유를 안 적었다. 모바일 호환 때문이라면 desktop은 4탭이어도 모바일 호환 깨지지 않는다(Designer가 그렇게 풀었다). 그럼 무엇이 non-negotiable로 만드는가?
- **질문 to Director**: shop을 dark pattern 우려로 다른 4개와 분리할 수 있는가? 못 한다면 그 결정의 근거를 spec.md에 명시할 의무가 director에게 있다.

### Brief 약점 4-4: 옵션 A/B/C 사전 sketch가 framing을 lock-in

- "specialist는 자유롭게 거부 가능"이라고 적었지만 실제로 designer/art/engineer 셋 다 A 변형으로 수렴. **sketch가 anchor 효과를 발휘**.
- **질문 to Director**: sketch 없이 specialist에게 brief만 던졌을 때 같은 결론에 도달한다고 확신하는가? sketch가 사고를 narrow했다는 자기 검증을 spec.md에 적었는가?

### Brief 약점 4-5: "후속 polish PR이 layout 위에 쌓이고 있어서 layout 결정을 미룰수록 회귀 비용 누적"

- 정말? 22개 polish PR 중 *layout이 바뀌면 깨질* PR이 몇 개인지 count되었나? brief에 그 수치 없음.
- **질문 to Director**: 회귀 비용이 누적된다는 주장의 quantification은? "그럴 것 같다"면 axis priority 자체가 직감.

---

## 5. Self-critique

내가 challenge 못 한 것 / 흘려보낸 hidden assumption:

- **본 critique는 세 proposal이 "data 없이 결정한다"고 비판하면서, "그럼 data 수집 axis가 layout axis보다 먼저 와야 한다"의 함의는 끝까지 추궁 안 했다.** 즉 "이 axis가 지금 시점에 deliberation 대상으로 정당한가"를 brief 수준에서 질문했지만, "그럼 어떻게 해야 하는가"의 함의(예: telemetry/analytics axis 선결)는 critic 영역이 아니라며 접었다. 그러나 그 접음이 *결국 director에게 "어쨌든 진행"의 free pass를 줄 가능성을 자각 못 했다.* critic의 silence가 아니라 critic의 "자기 영역 아님" 회피였다. 이 회피가 본 critique의 빈 자리.

- 추가 자각: 모바일 invariant("모바일 변화 0")가 *정말 invariant인가*도 검증 안 했다. 데스크톱 token 도입(Art Director §3)이 점진 마이그레이션을 통해 결국 모바일에 영향. "지금은 안 건드린다"가 1년 후 "어쩌다 보니 건드렸다"가 되는 패턴은 본 studio의 22 PR 이력에서 흔하다. 이 invariant가 spec.md 단계에서 *어떻게 enforce되는가*를 질문하지 못함.

---

## 6. Director, do not skip these

다음 3개 질문은 spec.md의 **"Decisions Resolved"** 섹션에 명시적 답이 있어야 한다. 답 없이 spec.md를 닫으면 본 deliberation은 미완.

### Q1. 데스크톱 player의 세션 패턴 가정을 spec.md가 어떻게 책임지는가?

- Designer는 "active 8~20분, verb 80% Garden"을 *가정*했다. Art·Engineer는 그 가정을 받아서 region 비율을 짰다. 이 가정이 틀리면 안 전체가 흔들린다.
- spec.md는 다음 중 하나로 답해야 한다:
  - (a) 가정을 명시하고 검증을 다음 axis(telemetry)에 위임 — 위임 시 *가정이 틀릴 경우 어느 region이 바뀌는가*를 미리 적어둘 것.
  - (b) ship 전 1주일 dogfooding으로 가정 검증 — 검증 방법·통과 기준을 적을 것.
  - (c) 가정 자체를 거부하고 "데스크톱 patterns 미상" 전제로 region 비율을 보수적으로 조정.
- 어느 쪽이든 *명시*. "가정이 깔린 채로" spec 통과 금지.

### Q2. brief Non-negotiable #4 "5탭 컨셉 유지"의 정신은 정확히 무엇인가?

- "5 surface 동등 보존"인가, "5탭 nav UI 보존"인가, "shop을 다른 4개와 동등하게 영구 노출"인가?
- Designer는 Garden을 nav 목록에서 빼고 4-drawer + 1-stage로 풀었다. 이게 brief 위반이라면 D안 자체가 무너진다. 위반이 아니라면 *왜 아닌지*의 명시적 reasoning을 spec에 적을 것.
- Art Director는 5탭을 vertical rail로 유지. Engineer는 A는 rail, B는 region 분산. **세 안이 5탭에 대한 해석이 다르다.** director가 결정 안 하고 spec.md에 적지 않으면 PR 단계에서 다시 분쟁.

### Q3. Option C(in-canvas overlay)를 prototype 없이 거부한 결정의 근거는?

- 셋 다 거부했지만 prototype 0건. "위반 가능성 매우 큼"·"시각 충돌"·"art-hiding 재발"은 모두 *추정*.
- spec.md는 다음 중 하나로 답해야 한다:
  - (a) C를 *명시적으로* reject하고 reject 근거 1~2문장을 적을 것 (감으로가 아니라).
  - (b) C를 1~2일 prototype 후 reject할지 결정.
  - (c) C를 future axis로 보류하고 그 axis 진입 조건을 명시.
- 셋의 본능적 회피를 그대로 spec.md에 흡수하면 그건 deliberation 아니라 echo.

---

## Summary (≤ 4 sentences)

가장 큰 hidden assumption은 Designer의 "데스크톱 verb 80%는 Garden, 세션 8~20분" — 이 가정 위에 세 proposal의 region 비율이 모두 얹혔지만 데이터 0건으로 검증 불가. 가장 강한 premature consensus는 "Side Dock 영구 노출"이 셋 다 무비판 수렴이며, dock이 cream 매트를 22% *영구 점유로 고정*하는 안이 brief의 "viewport 70% 빈 cream" 비판과 어떻게 양립하는지 누구도 묻지 않았다. Director가 절대 건너뛸 수 없는 질문은 "5탭 컨셉 유지" Non-negotiable의 정확한 정신을 spec.md에 명시하는 것 — 세 안이 5탭을 다 다르게 해석하고 있어서 director가 침묵하면 PR 단계에서 분쟁이 재발한다. 본 critique 자체의 빈자리: "데이터 없이 결정한다"는 비판이 결국 director에게 free pass를 주는 모순을 끝까지 추궁 못 한 것.
