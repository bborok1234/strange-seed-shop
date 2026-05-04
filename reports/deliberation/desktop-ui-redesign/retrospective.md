# Retrospective — desktop-ui-redesign deliberation (Phase b pilot)

- Axis slug: `desktop-ui-redesign`
- Cycle: 1 (pilot — Phase b 첫 dogfooding)
- Date: 2026-05-04
- Approver: 사용자 (승인 — Plan 0001 next phase로 진입)

본 retrospective는 Phase (a) `/studio-deliberate` skill 코드화의 입력 자료. 무엇이 신호였고 무엇이 군더더기였는지 record.

## 무엇이 작동했나

1. **페르소나 voice 분리가 실제로 다른 결과를 만들었다.** Designer는 player-verb 1인칭 분석, Art Director는 토큰 이름·grid 좌표만 사용, Engineer는 줄 수·KB·PR 수로 cost 정량화, Senior Critic은 hidden assumption 호명 — 4 voice가 같은 brief를 4가지 방식으로 분해했다. 페르소나 파일에 "default disagree" 항목을 넣은 것이 echo chamber 방지에 결정적이었다.
2. **Senior Critic이 약속한 일을 했다.** Phase 2를 skip하고 Phase 3에서만 등장하는 설계가 challenge-only 정체성을 강화. "Side Dock 영구 노출" premature consensus 캐치, "5탭 정신" Director must-resolve 질문, brief 자체에 5개 push back — 모두 다른 페르소나가 안 잡았던 것.
3. **세 가지 다른 "Option D"의 naming collision이 표면화됐다.** 만약 Director가 critique 라운드 없이 proposal만 보고 spec을 썼다면 "다들 D 채택"으로 잘못 종합했을 가능성이 매우 높음. Art Director critique 4-1이 명시 호명한 것이 합의 환상 방지의 결정적 순간.
4. **"Decisions Resolved" 섹션이 spec template에서 mandatory였던 것이 load-bearing.** 비워둘 수 없게 강제했기에 10개 substantive disagreement가 모두 명시 결론·이유·loser's concession 형태로 spec에 들어갔다. 평균이나 회피로 도망갈 자리가 없었다.
5. **Brief의 "Out of Scope" 섹션이 specialist의 scope creep을 막았다.** Designer는 새 콘텐츠 추가를 안 했고, Art Director는 신규 일러스트 재생성을 follow-up로 미뤘고, Engineer는 game mechanic 변경을 거부했다. brief가 boundary를 명시하지 않았으면 각자 자기 영역으로 axis가 부풀었을 것.
6. **하네스 중립 source-of-truth 원칙이 자연스럽게 작동했다.** docs/studio/, reports/deliberation/ 안에서만 작업. `.claude/`, `.omc/` 침범 0. 이 원칙이 (a) skill 설계의 basis가 됨.

## 무엇이 군더더기였나

1. **각 proposal의 "Self-check (persona contract)" 체크리스트가 filler.** Designer/Art Director/Engineer 모두 마지막에 "[x] persona contract 준수" 체크박스 5-10개를 적었는데, 이건 spec이나 critique에 영향 0. 페르소나 prompt에서 self-check 요구를 빼도 결과는 같음.
2. **Open Questions가 너무 많았다.** Designer 7개, Art Director 7개, Engineer 9개 — 합치면 23개. Director 합성 단계에서 대부분이 spec의 § Open Questions 또는 후속 axis로 흘러갔지만, 일부는 사실상 같은 질문이거나 답이 자명한 것(예: "Phaser scene이 60fps 유지하는가" — 측정해보면 됨). 페르소나에게 "Open Questions ≤ 5개로 우선순위 정해라" 제약을 거는 게 좋겠음.
3. **Phase 2 proposal에서 Engineer가 cost-only 결론을 박은 것이 cross-domain 침범이었다.** "Option A 권장. 비용 ⅓"는 Engineer 영역이지만, 그게 spec의 default 권고처럼 받아들여질 위험이 있음. Designer critique 2-1에서 정확히 이를 잡았다. 페르소나 prompt에 "Engineer는 권고를 cost-only로 결론짓지 말라" 명시 추가 검토.
4. **Director 페르소나 파일은 본 deliberation에서 거의 안 읽혔다.** main thread가 Director라서 자기 자신 페르소나를 새로 읽을 필요가 없었음. 하지만 (c) 단계에서 Director를 별도 spawn하면 필수가 됨 — 본 retrospective 시점에는 검증 안 됐고 dead code 상태.
5. **Brief의 "사전 옵션 sketch (A/B/C)"가 framing을 lock-in했다는 Critic 4-4 지적이 사실이었다.** 세 specialist 모두 A의 변형으로 수렴. sketch 없이 brief만 던졌을 때 결과가 달라졌을지는 검증 불가. (a) skill에서는 brief 작성 시 "사전 sketch는 optional, 주의 lock-in 효과 명시" 가이드 추가 검토.

## Persona signal ranking (Director 합성 시 가장 영향)

| Rank | Persona | 이유 |
|---|---|---|
| 1 | **Senior Critic** | premature consensus 3건 캐치, brief 5개 push back, Director must-resolve Q1/Q2/Q3가 spec § Decisions Resolved의 골격 형성. 본 안의 가장 큰 honest admission(데스크톱 세션 가정 데이터 0)이 Critic 없이는 표면화 안 됐을 가능성. |
| 2 | **Art Director** | 토큰 system 진단(raw px 1664회 vs token 93회), 3-region grid 골격, motion vocabulary 5-gesture 합의, naming collision 호명, dock 가변 확장 concession 제안. spec § Layout / § Tokens / § Motion이 거의 Art proposal에서 옴. |
| 3 | **Designer** | "Garden = 무대" 핵심 명제가 spec § Decisions §1의 결정적 결론, drawer 거부에 대한 honest concession(closure 약화 우려), 자원 0/0/0 onboarding 우려가 chip hot-state 결정으로 흡수. 단 cost 의식 부족으로 일부 우려가 별도 axis로 미뤄짐. |
| 4 | **Engineer** | cost 정량화(줄 수, PR 수, KB)로 § Cycle 분할 / § Risks / § Implementation Sequence를 grounded. 단 cost-only 결론 박기 + Option C "axis 범위 외" 단언이 Critic의 brief-level critique 대상이 됨. self-critique 3-1·3-2가 매우 honest해서 spec의 PR 분해 신뢰도 강화. |

**참고:** Director(main thread)는 ranking 대상 아님. Director는 합성자라 signal 생산자가 아님.

## Director 합성에서 가장 어려웠던 것

1. **Stage = Garden 전용 vs 5 surface 교체 zone (§1).** Designer/Art Director가 정면 충돌. 한쪽 손을 들어야 했음 — 평균 답 없음. Designer의 player-verb 분석을 채택했지만, Art가 §6에서 본인 안의 self-contradiction("art-only zone"인데 "stage 갈아끼움")을 만들었기에 결정 가능했음. 만약 Art가 self-consistent했다면 더 어려웠을 것.
2. **Drawer vs dock 가변 확장 (§3).** Designer가 강하게 주장한 핵심 모델인데 거부. 부담스러움. 하지만 Art의 concession 5-1.1이 Designer의 verb 의도를 보존하는 길을 제시했고, Engineer critique 1-1의 cost 우려가 결정 보강. concession 채택형 결정.
3. **데스크톱 세션 가정을 (a)/(b)/(c) 어느 쪽으로 답할지 (§6).** Critic Q1이 명시 강제했지만 답 자체는 Director 판단. (a) "명시+위임"을 선택한 것은 axis 머지를 1주 지연시키는 (b)가 부담이고, (c)는 stage 정신을 약화시키기 때문 — 이 reasoning이 spec에 명시됐는지 본 retrospective에서 재확인 필요(예).
4. **Brief 자체 약점 인정 (§10) — 자기 비판.** Director 본인이 쓴 brief의 약점을 spec에 적는 것이 어색했음. 하지만 Critic의 brief-level critique을 무시하고 넘어가면 다음 deliberation에서 같은 brief 약점이 재발할 가능성. 명시 인정 채택. 페르소나 prompt에 "Director는 자기 brief에 대한 critique을 흡수해야 한다" 명시 추가 검토.

## 시간 / 토큰 비용

- Phase 1 brief: 작성 ~10분 main thread.
- Phase 2 (3 parallel agents): 동시 실행, 가장 긴 agent ~250s. 총 token ~180K (3 agent 합산).
- Phase 3 (4 parallel agents): 동시 실행, 가장 긴 agent ~210s. 총 token ~250K (4 agent 합산).
- Phase 4 Director synthesis: main thread, ~15분 작성 + 7 file Read 1회.
- Phase 5 user gate: 사용자 응답 대기.
- Phase 6 retrospective: 본 문서 ~10분.
- **추정 총 wall clock ~1시간** (사용자 검토 시간 제외) — manual workflow치고 매우 효율적. (a) skill로 코드화하면 main thread 타이핑이 줄어 ~45분으로 단축 가능 추정.

## (a) /studio-deliberate skill에 codify할 것

1. **Phase 2: 3 specialists 병렬 spawn.** Designer / Art Director / Engineer. Senior Critic은 skip. 페르소나 파일은 `docs/studio/personas/<role>.md`를 agent가 Read로 로드 (skill에 inline 안 함).
2. **Phase 3: 4 parallel critique.** Designer / Art Director / Engineer 재투입 + Senior Critic 첫 등장. 각자 본인 proposal + 다른 페르소나 proposal + 본인 페르소나 파일을 Read.
3. **Phase 4: skill 종료, Director synthesis는 caller(main thread) 책임.** skill은 artifact 경로만 return. spec.md를 skill이 쓰면 Director 인격이 인공지능에게 위임되는 위험.
4. **Heartbeat 엔트리 자동 작성.** `reports/operations/operator-heartbeat-*.jsonl`에 phase 진입/종료 마킹.
5. **Slug 검증 + 디렉토리 생성.** `reports/deliberation/<slug>/{proposals/,critique-*.md,brief.md,spec.md,retrospective.md}` 구조.
6. **에러 처리: 페르소나 파일 누락 시 명시 reject** — skill은 source-of-truth를 듣는 adapter, 정의 안 된 페르소나로 fall through 금지.

## (a)에서 dropped 또는 변경할 것 (군더더기 제거)

- 페르소나 prompt의 "Self-check 체크리스트" 요구 삭제 — 결과에 영향 0.
- Open Questions 개수 제약 도입 (≤ 5개, 우선순위 정렬).
- Engineer 페르소나 prompt에 "cost-only 결론 박지 말라, design persona 없으면 결정 보류" 명시.
- Brief 작성 시 "사전 옵션 sketch는 optional, lock-in 효과 명시" 가이드.
- Director 페르소나 파일은 retain (Phase c에서 별도 Director agent spawn 시 사용) but Phase a/b에서는 main thread가 그 역할을 한다고 workflow doc에 명시.

## (b) → (a) 전이 권고

- 본 axis (`desktop-ui-redesign`)는 (a) skill의 첫 dogfooding axis로 사용 안 함. 너무 큰 axis(layout 골격)라서 skill 안정성 검증에 risk. (a) skill은 더 작은 후속 axis(예: `desktop-token-migration` 또는 `mission-ux-visibility`)로 첫 검증.
- (a) skill 안정 후 본 axis (`desktop-ui-redesign`)의 Cycle 1 implementation은 ralph 또는 team 워크플로우로 진행 — deliberation 워크플로우가 아님.

## Plan 0001 trajectory 업데이트

- Phase (b) ✅ 완료 (본 retrospective 작성으로 closure).
- Phase (a) → 다음: `/studio-deliberate` skill 작성 + 작은 axis로 dogfood.
- Phase (c) → (a)가 3+ axis 거친 후. 본 retrospective의 "Persona signal ranking" + "Director 합성 어려움"이 (c)의 KPI/veto/seniority 정의 입력 자료가 됨.
