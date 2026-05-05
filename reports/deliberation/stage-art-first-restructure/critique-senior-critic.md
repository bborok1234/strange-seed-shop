# Critique — Senior Critic (선임 비평가)

- Axis: `stage-art-first-restructure`
- Phase 3 (cross-critique). Senior Critic은 proposal 없음 — challenge만.
- Date: 2026-05-04
- 작성 원칙: 침묵이 칭찬. 발언은 모두 challenge. 대안 제시 0.

---

## 0. 메타 — 이번 axis가 풀어야 할 진짜 문제

Cycle 1은 spec § Decisions §1·§4 체크리스트 100% 통과 + 사용자 가치 ~10%로 끝났다. 본 axis brief는 그 갭을 "art-first 패러다임 재설계"로 프레이밍하지만, 그 프레이밍 자체가 잘못됐을 가능성을 셋 다 안 잡았다. **진짜 META 문제는 "spec promises가 implementation에서 quietly 위반된다"이지 "art share 70%가 70%여야 하는데 25%였다"가 아니다.** 본 axis가 또 sharp spec을 생산하면 같은 패턴 반복.

이 META 질문에 셋 중 누구도 정면 답하지 않는다 — Engineer가 가장 가까이 갔지만 (`check:art-share` infra) 그것조차 Cycle 1 회고가 이미 처방한 "Art Director critique gate 자동화"의 부분 재진술이고, **이번에도 그 gate를 spec promise로만 적고 implementation 단계에서 quietly 누락될 가능성을 차단하지 않았다**.

---

## 1. Hidden assumptions per proposal (3 specialists)

### Designer

**가정 D-1 (load-bearing):** "verb 1·2·3을 art 안으로 옮기면 'art가 무대' 감각이 회복된다."

- 노출 질문: **plot tap이 art 위 sprite에서 발생한다는 것이 사용자가 말한 "정원 의미"의 mechanic 원인이라는 근거는?** 사용자 voice("아트팀 역할이 너무 없음")는 **art quality / 노출 면적**에 대한 불만일 수도, **verb 위치**에 대한 불만일 수도 있다. Designer는 후자로 단정. plot tap이 이미 GardenScene 안 sprite 위에서 발생 중인데 사용자는 "정원이 퇴색"이라 했다 — 즉 verb 위치는 이미 art였는데 "art가 안 살아 있다"가 critique. Designer 가정의 evidence 부족.

**가정 D-2:** "L1 in-canvas diegetic UI(plot 위 % badge, 수확 chip)가 본 axis에 들어가야 한다."

- 노출 질문: **L1이 빠지면 사용자 "정원 의미"가 회복 안 된다는 가정의 근거 1줄?** Designer 본인이 Q1에서 "L1 미루면 wallpaper 회귀"라고 했지만, L0(art 75%) + L2(edge whisper) + L3(dock contrast)만으로도 사용자 critique이 풀릴 가능성을 검토 안 함. L1이 핵심이라는 evidence는 본인 1인칭 시뮬레이션뿐.

**가정 D-3:** "starter-panel 폐기는 onboarding modal 1회로 대체 가능."

- 노출 질문: **starter seed 선택이 1회 발생이라는 데이터 출처?** 본인이 "데이터: starter seed 선택은 첫 세션 1회"라고 단언했지만 source 인용 없음. 만약 starter 선택이 reset / re-onboarding flow를 가진다면 modal 1회 대체는 implementation 시 발견되어 PR 분할 깨짐.

### Art Director

**가정 A-1 (load-bearing):** "art share 70% → 75% 강화는 '같은 약속 두 번 안 위반'의 의미."

- 노출 질문: **70% → 75% 차이가 사용자 시각적으로 다르다는 measurable evidence는?** 본인도 self-critique 7-Critic에서 "70% → 75% 차이가 visual에 결정적이지 않음, Director가 깎아도 본 proposal 핵심 안 흔들린다"고 인정. 그러면 **왜 75%인가?** "honest admission" = honest framing이지 measurable 약속 아님. 측정 수치가 motivation이 아니라 emotion이면 본 proposal의 §0 enforcement 계약("형용사로 닫지 않는다") 자체 위반.

**가정 A-2:** "Paradigm D — Art-Plate Hybrid의 L1/L2/L3 layer 구조가 Cycle 1 위반을 막는다."

- 노출 질문: **Paradigm D는 Cycle 1 spec의 3-region grid + 신규 토큰 23종과 구조적으로 어떻게 다른가?** Cycle 1도 "stage = art-only zone, art ≥ 70%, dock contrast"를 spec에 적었다. 본 proposal은 그 위에 "alpha-aware decal", "cream rectangle 0개", "수치 측정"을 추가했지만, **Cycle 1 spec의 같은 약속이 implementation에서 quietly 위반된 mechanic**을 반복 분석하지 않았다. "이번엔 측정한다"가 메커니즘이라면 Engineer 영역이지 Art Director paradigm 변경 아님.

**가정 A-3:** "신규 token 6종 + 신규 1 gesture(`settle`)이 vocabulary 부풀림이 아니다."

- 노출 질문: **Cycle 1에서 도입한 토큰 23종 중 사용처가 1회뿐인 토큰이 있었는가?** retrospective는 답 안 함. 본 proposal은 그 위에 6종 더 얹는다. **Cycle 1 토큰 사용 audit 없이** "본 axis는 사용처 정확히 명시" 약속만 한다 — 같은 약속을 Cycle 1에서도 했다.

### Engineer

**가정 E-1 (load-bearing, 가장 위험):** "PR-INFRA-1 (`check:art-share` 자동 측정 + CI required check)이 implementation gate를 강제한다."

- 노출 질문: **`check:art-share` 임계값(stageArt ≥ 0.55, cream ≤ 0.30)이 spec.md에서 옮겨오지 않고 PR 본문에 hardcoded되면, 미래 PR 작성자가 임계값을 깎아도 누가 catch하는가?** Engineer 본인이 Open Q3에서 "임계값 source-of-truth 어디?"라고 묻지만 답 자체는 회피. **임계값 자체가 quietly 약화될 수 있는 mechanism**이 본 proposal에 있다 — 같은 META 문제 재발 vector.

**가정 E-2:** "`check:art-share`가 PR-INFRA-1 머지 직후 main에서 fail해야 정상."

- 노출 질문: **fail 상태로 main이 빨간불이 되면 (a) 임계값을 임시 완화하거나 (b) 후속 PR을 묶어 머지하거나 둘 중 하나가 강제됨. 어느 쪽이든 Cycle 1 패턴(checklist 통과 위장) 재발 vector.** 본인이 Open Q5에서 인지했지만 결정 회피. 결정 안 하면 implementation에서 가장 약한 옵션이 자연 선택됨.

**가정 E-3:** "Art Director critique gate를 PR template 체크박스 + reviewer 인간으로 풀 수 있다."

- 노출 질문: **Cycle 1에서 spec § Decisions §1·§4 체크박스가 모든 PR에서 ticked됐고 reviewer가 main thread Director 본인이었다 — 같은 사람이 spec 쓰고 implementation하고 review했기에 violation을 못 잡았다는 게 retrospective 결론.** 본 proposal의 PR template 체크박스 + reviewer는 누가 ticked하는가? Director가 또 자기 자신? 그러면 Cycle 1 mechanism 정확히 그대로.

---

## 2. Premature consensus risks

### PC-1 (가장 위험): "alpha-aware decal / cream rectangle 0개"가 셋 다 너무 쉽게 동의

Designer (L1·L2·L3 layer), Art Director (L1·L2·L3 + Paradigm D), Engineer (cream luminance 측정 ≤ 0.30) — 셋 다 같은 단어를 쓰고 같은 mechanism을 가정한다. **누구도 "alpha-aware decal이 사용자에게 art처럼 보인다"는 가정의 evidence를 제시 안 함.** 사용자 voice는 "패널·UI로 다 뭉갬"인데, **반투명 패널도 "패널"로 인식될 가능성**(특히 Korean text가 그 위에 뜨는 순간)을 셋 다 검토 안 함. 합의가 30분 안에 형성된 의심.

### PC-2: 패러다임 lock-in 패턴 반복

Cycle 1에서 brief sketch A/B/C가 framing을 lock-in했다는 retrospective 인정. 본 brief sketch도 A/B/C 그대로. **Designer는 "Hybrid 변형(5-layer)", Art Director는 "Paradigm D = 변형된 Hybrid", Engineer는 cost 평행 제시.** 셋 다 sketch C(Hybrid)를 base로 출발 — 같은 lock-in 패턴 반복. 누구도 "지금 sketch 자체를 거부하고 다른 axis로 reframe해야 한다"고 안 함.

### PC-3: "측정 수치 추가하면 풀린다"는 합의

Designer: "stage 안 React panel ≤ 15%", Art Director: "art ≥ 75%, cream ≤ 20%, contrast ≥ 3:1", Engineer: "stageArtPixelRatio ≥ 0.55 / dockContrastRatio ≥ 3.0". 셋 다 측정 수치 추가가 mechanism이라고 합의. **Cycle 1도 spec § Acceptance Criteria에 수치를 적었다** ("stage region 빈 cream ≤ viewport 25%"). 그 수치가 implementation에서 측정 안 된 게 문제였지 수치 부재가 문제 아님. **수치 추가만으로 같은 패턴 회피된다고 합의된 점**이 premature consensus.

### PC-4: GardenScene 변경 금지 boundary

브리프 Non-negotiable §4 + 셋 다 boundary 수용. **누구도 "GardenScene 내부 plot grid anchor 미수정 상태에서 stage가 art-first로 가도 plot이 좌상단 50%에 박혀 사용자 critique 회복 안 된다"는 risk를 본 axis 안에서 차단할 결정으로 push 안 함.** Designer Q3, Engineer Q1에서 미루기로 합의. brief 위반 evidence 5개 중 마지막 항목("plot 1개가 stage 좌상단 ~50%로 박힘")을 별도 axis로 미룬 시점에서, 본 axis가 ship되어도 사용자 critique이 회복 안 될 가능성 높음 — 셋 다 그 risk를 acceptance로 처리.

---

## 3. Inertia / precedent justifications

### IP-1: "Cycle 1의 grid 골격은 유지" (brief Non-negotiable §1)

- brief가 그렇게 lock한 것 자체가 정당화 부재의 inertia. **Cycle 1의 3-region grid가 작동했다는 evidence가 어디 있나?** 사용자 critique은 "정원 의미 퇴색 / UI 패널로 다 뭉갬"이지 "grid 좋다"가 아니다. grid가 그대로인 채 안의 콘텐츠만 바꾸는 것이 정답이라는 근거는 brief의 "non-negotiable"이라는 단어뿐.
- 셋 다 Non-negotiable §1을 challenge 안 함. Designer는 "L0~L4 layer composition", Art Director는 "Paradigm D in same grid", Engineer는 "패러다임 무관 공통 PR-INFRA"로 grid 안에서만 작업. **grid 자체가 art 회복의 obstacle일 가능성을 누구도 challenge 안 함.**

### IP-2: "같은 약속 두 번 위반 안 한다"는 motivation으로 art ≥ 75% 강화

- Art Director가 명시적으로 "신뢰가 회복 안 된다는 honest admission" 근거로 70% → 75% 강화. **이건 reasoning이 아니라 emotion.** 본인 §0에서 "형용사로 닫지 않는다"고 말한 직후 §1에서 emotion으로 수치를 결정 — self-contradiction.

### IP-3: "starter-panel 폐기"가 셋 다 합의

- 셋 다 cream 띠 폐기 = art 회복으로 가정. **starter-panel이 왜 거기 있었는가?** 첫 세션 onboarding의 verb hint anchor였다. 폐기 후 onboarding modal 1회 대체 (Designer)가 verb hint를 제공한다는 가정인데, **modal은 닫히는 순간 사라진다 — verb hint를 다시 보고 싶은 player를 위한 영구 anchor 부재**. inertia로 폐기 결정.

---

## 4. Brief-level challenges

### BL-1 (가장 큰 challenge): brief가 또 spec 생산 axis로 프레이밍됐다

- Cycle 1 회고는 명시적으로 "**spec sharpness ≠ implementation sufficiency**"를 학습으로 적었다. 본 brief는 그 학습을 인용("이 axis는 이 메모리의 첫 enforcement 케이스") 하지만, **brief의 출력 자체가 또 다른 spec.md**다. 같은 패턴.
- **다른 shape 가능성:** brief가 "spec을 생산하는 axis"가 아니라 "Cycle 1의 5 PR을 사용자가 쓸 만한 화면이 될 때까지 art-first audit + 즉시 fix하는 implementation-only axis"로 reframe됐다면 META 문제(spec → implementation gap)에 정면 답한 것. brief는 deliberation workflow에 갇혀 같은 prophylactic만 처방.
- **노출 질문:** 본 axis spec.md가 ship된 후 사용자가 또 "정원 의미 퇴색"이라고 하면, 그것은 **본 axis spec의 실패인가, implementation의 실패인가?** 둘 다라면 deliberation workflow 자체가 의심돼야 함.

### BL-2: "Hard verification gates"가 brief에 적혔지만 enforcement 메커니즘 부재

- brief Constraints "Hard verification gates": "playwright screenshot 측정 + Art Director critique pass spawn 필수". **누가 이 gate를 강제하는가?** brief가 spec.md 작성자(Director)에게 약속을 시킬 뿐, spec → PR → main 머지 path 어느 단계에서 자동 fail이 발생하는지 brief 단계에서 정의 안 됨. Engineer proposal이 PR-INFRA-1로 그 일부를 풀려 하지만, **본 axis 안 PR이 PR-INFRA-1을 머지 안 하면 어떻게 되는가?** 본인 결정이 본인 enforcement인 closed loop.

### BL-3: "측정 가능한 위반" 표가 단일 viewport 1920×1180에서만 추출됐다

- brief Current State 표는 1920×1180 evidence만. 데스크톱 player의 viewport 분포 데이터 0 (Cycle 1 spec § Decisions §6에서 가정 명시했지만 검증 0). **본 axis가 풀려는 문제가 1920 viewport만의 문제인지, 데스크톱 일반 문제인지 brief가 답 안 함.** 1280, 1600, 1920 모두에서 같은 위반 패턴인지 audit 없이 axis 시작.

### BL-4: 사용자 critique evidence가 1명·2회 voice

- "정원 의미 퇴색" voice는 사용자 1명, 2026-05-04/05 2회. 데스크톱 player 표본 1명. **이 1명 voice가 본 axis의 success criteria의 sole evidence**다. 1명이 다음에 "이번엔 진짜 정원이다"라고 해도 그게 design success인지, 1명 voice의 무게가 그만큼인지 brief 단계에서 검토 안 됨. Cycle 1 retrospective의 "데스크톱 telemetry 0" 학습 그대로.

---

## 5. Self-critique (내가 challenge 못 한 hidden assumption)

내가 본 critique 라운드에서 잡지 못한 가장 큰 가정 1개:

**셋 다 "Cycle 1 implementation을 누가 한 사람이었는가"를 분석하지 않았다 — 그리고 나도 그것을 정면 호명 안 함.**

retrospective는 "main thread Director가 spec 쓰고, main thread가 Engineer로 implementation하고, main thread가 reviewer였다"는 mechanism을 학습으로 적었다. 본 axis 셋 다 그 mechanism이 본 axis에서 어떻게 다를지 답 안 함. **동일 main thread가 본 axis spec.md를 쓰고, 동일 main thread가 implementation하고, 동일 main thread가 reviewer가 될 가능성이 가장 높음** — 그러면 Cycle 1 mechanism 정확 재현.

내가 이 점을 본 critique 본문에서 1회 언급(가정 E-3)했지만, 이걸 **모든 specialist의 가정 위에 얹는 메타 가정**으로 강조 안 했다. spec promise가 깨진 것은 art share 측정 부재가 아니라 reviewer의 독립성 부재 — 이걸 본 axis가 spec.md로 풀 수 없음을 셋 다, 그리고 나도 충분히 호명 안 함.

또한: 내가 본 round에서 Engineer proposal의 "★ critique gate 자동화" 강조를 **인정만 하고 push back 안 함**. 그것이 META 문제의 부분 답이지만, "PR template 체크박스를 누가 ticked하나"가 정확히 같은 self-validation 문제라는 점을 §1 E-3에서만 한 번 언급. 더 강하게 호명할 자리였음.

---

## 6. Director, do not skip these

다음 3개 질문은 spec.md "Decisions Resolved"에 명시 결론 + 이유 + loser's concession 형태로 들어가야 함. 비워두면 본 axis는 Cycle 1 패턴 재현.

### Q1 (★ implementation enforcement — 가장 skip 못함)

**본 axis spec.md가 ship된 후 PR을 머지하는 reviewer는 누구인가? main thread Director 본인이 reviewer일 경우, Cycle 1의 self-validation 실패 mechanism이 어떻게 다르게 작동하는가?**

- 옵션 (a): 별도 spawn agent (Art Director critique pass)가 PR 머지 전 mandatory comment + sign-off. 자동화 path 명시.
- 옵션 (b): 사용자 (human reviewer)가 모든 art-first PR의 screenshot을 본 후에만 머지. 사용자 throughput 비용 인정.
- 옵션 (c): main thread가 reviewer로 계속하되 spec.md에 "self-validation 인정, Cycle 1과 같은 실패 risk 인정" 명시.
- (c) 채택은 honest하지만 본 axis META 문제 회피. (a)/(b) 중 하나가 spec § Decisions에 결정 + path 명시.

### Q2 (★ implementation enforcement — 임계값 source-of-truth)

**`check:art-share` (Engineer PR-INFRA-1)의 임계값(stageArt ≥ 0.55, cream ≤ 0.30, contrast ≥ 3.0)은 어디가 source-of-truth인가? 미래 PR 작성자가 임계값을 깎으려 할 때 누가 어떻게 차단하는가?**

- spec.md "Acceptance Criteria"에 임계값을 적고 PR-INFRA-1이 그 값을 import / mirror하는 구조여야 spec → infra 동기화.
- 임계값이 PR 본문 hardcoded면 미래 PR이 PR-INFRA-1 자체를 수정해서 임계값 깎을 수 있음. 그 PR을 누가 reject하는가? Q1과 직결.
- **본 질문에 답 안 하면 PR-INFRA-1은 cosmetic gate**. 측정은 하지만 측정값이 quietly 변경 가능 = Cycle 1 실패 mechanism 재현.

### Q3 (axis shape — META reframe)

**본 axis가 또 spec.md를 생산하는 deliberation axis로 가는가, 아니면 brief가 reframe되어 "Cycle 1 5 PR audit + 사용자 시각 검증 통과까지 즉시 fix"하는 implementation-only axis가 되는가?**

- 전자: deliberation workflow 패턴 유지, spec sharpness가 또 implementation 단계에서 quietly 위반될 risk 인정.
- 후자: brief 자체를 다시 작성, spec.md skip, PR-only cycle. deliberation workflow를 본 axis에 적용 안 한다는 결정.
- Cycle 1 학습("spec promises don't auto-enforce")이 본 axis에 적용된다면 후자 가능성 검토 필요. 셋 다 전자 가정으로 proposal 작성 — Director가 그 가정 자체를 challenge할 마지막 자리.

---

## Closing — 4 sentence summary

가장 큰 hidden assumption은 셋 다 공유: **"alpha-aware decal / 측정 수치 추가가 사용자가 말한 '정원 의미'를 회복시킨다"** — 사용자 1명·2회 voice를 mechanism으로 단정하고 evidence 부족. 가장 강한 premature consensus risk는 **"측정 수치 추가만으로 Cycle 1 패턴 회피된다는 합의"** — Cycle 1도 acceptance criteria에 수치 적었다, 측정 부재가 문제였지 수치 부재 아님. Director가 skip할 수 없는 1개 질문은 **"본 axis PR을 머지하는 reviewer는 누구이며, main thread Director 본인이 reviewer일 경우 Cycle 1 self-validation 실패 mechanism이 어떻게 다르게 작동하는가"** — 이 답이 spec.md에 명시 안 되면 본 axis는 Cycle 1 정확 재현. 본 axis가 spec.md를 또 생산하는 axis인지, 아니면 implementation-only audit axis로 reframe되어야 하는지 brief 단계에서 결정 안 된 점이 deliberation workflow 자체에 대한 가장 무거운 challenge.
