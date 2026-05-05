# Senior Critic Critique — garden-respecting-hud-assets

## 다른 제안에 대한 내 이견

### Designer 제안에 대한 이견

Designer는 “첫 30초 행동 명확성”을 말하지만, raster plot marker와 signpost가 실제로 첫 행동을 더 명확하게 만든다는 근거를 제시하지 않았다. 당신은 “정원물처럼 보이면 누를 곳도 명확해진다”고 가정한다. 그 가정이 틀리면 이 제안은 cream rectangle을 예쁜 물건으로 바꿨을 뿐이고, 첫 씨앗 선택 진입점 약화는 그대로 남는다.

또 하나. `구매하고 심기` 같은 verb 단축은 본 axis의 out-of-scope인 flow/interaction 변경으로 넘어갈 수 있다. asset-first axis에서 클릭 경로를 줄이겠다고 말하려면, 어느 동작은 UI skin이고 어느 동작은 product behavior 변경인지 경계가 필요하다. 지금 제안은 그 경계를 흐린다.

Designer는 resource HUD를 항상 visible로 둬야 한다고 주장하지만, visible해야 한다는 말만 있고 “얼마나 커야 하는가”, “모바일에서 어떤 정보가 밀려나야 하는가”, “다음 행동과 resource 중 충돌하면 무엇을 버리는가”가 없다. trade-off가 없으면 hierarchy가 아니다.

### Art Director 제안에 대한 이견

Art Director는 asset silhouette, alpha cutout, token, motion vocabulary를 한 번에 제안한다. 범위가 너무 넓다. `ui_playfield_plot_marker_empty_001`, `ui_playfield_plot_marker_ready_001`, `ui_hud_sun_ribbon_next_action_001`, `ui_hud_leaf_chip_resource_001`, `ui_hud_vine_edge_divider_001`, `ui_hud_leaf_tab_marker_001`를 한 batch로 만들면 “정원물 언어”를 검증하는 게 아니라 취향 묶음을 검증하게 된다.

당신은 PNG contour가 DOM rectangle의 문제를 해결한다고 가정한다. 하지만 현재 `GardenPlotCard`는 버튼 안에 index, source icon, label, state, mound가 들어간 DOM 구조이고, side dock은 `article.side-dock-card`들이다. PNG를 배경으로 깔아도 기존 padding, hit target, text block, shadow, fallback fill이 남으면 사각형 언어는 계속 보인다. asset shape가 문제를 해결한다는 말은 구현 surface와 CSS fallback까지 같이 지정할 때만 성립한다.

motion vocabulary도 아직 답이 아니다. `nudge`, `bloom`, `drift`를 늘리면 첫 행동이 선명해지는가, 아니면 작은 장식들이 계속 시선을 흔드는가? “움직이는 것은 binding이 있는 strip만 허용”이라는 제한은 좋지만, 어느 상태가 motion을 받을 자격이 있는지 검증 기준이 없다.

### Engineer 제안에 대한 이견

Engineer의 PR 분해는 안전해 보이지만, 첫 PR을 asset-only로 두는 결정은 검증 불가능한 자산을 먼저 생산하는 위험을 만든다. 화면에 얹지 않은 HUD PNG 6~8개가 통과할 수 있는 검사는 provenance, style, alpha뿐이다. 이 axis의 실패 조건은 “asset 파일 품질”이 아니라 “정원 화면에서 여전히 패널처럼 보임”이다.

`ui_frame`으로 category 변경을 피하자는 제안도 그냥 안전한 게 아니다. 현재 `AssetCategory` union에는 `"ui_frame"`은 있지만 `"ui"`는 없고, manifest의 `ui_order_crate_leaf_001.category`는 `"ui"`다. 이 불일치를 본 axis에서 회피하면 새 HUD 자산은 통과해도 기존 UI 자산 precedent가 계속 깨진 상태로 남는다. 회피할 거면 “이번 spec은 기존 mismatch를 harness defect로 분리한다”까지 결정해야 한다.

또한 “Phaser scene 자체는 건드리지 않는다”는 원칙은 구현 리스크를 줄이지만, plot card를 계속 React overlay로 둔다는 말이다. 그러면 Designer와 Art Director가 말한 “playfield 사물”은 실제로는 canvas 위 DOM 버튼이다. 이 불일치를 Director가 열어 둔 채 spec을 쓰면 Cycle B in-canvas diegetic UI와 다시 충돌한다.

## 내 자기비판

나는 Phase 2 제안을 쓰지 않았기 때문에, 내가 놓친 hidden assumption은 이것이다. “Senior Critic이 대안을 내지 않으면 specialists가 충분히 구체적인 trade-off를 스스로 표면화할 것이다.” 실제로 세 제안은 빠르게 같은 방향으로 수렴했고, 가장 중요한 반대축인 “새 asset을 만들기 전에 기존 DOM surface를 얼마나 제거해야 하는가”가 독립 제안으로 나오지 않았다.

## 여러 제안을 함께 볼 때 드러나는 교차 리스크

첫째, 세 제안 모두 “새 raster HUD asset vocabulary가 필요하다”에 너무 빨리 동의했다. 사용자의 불만은 asset 부족일 수도 있지만, 더 정확히는 “정원 art 위에 UI 패널이 우선권을 갖는다”이다. asset을 추가해도 기존 rectangle surface를 유지하면 실패한다.

둘째, acceptance가 약하다. `check:asset-*`, `check:art-share`, `check:p0-ui-ux`는 필요하지만 충분하지 않다. 이 axis에는 최소한 fresh desktop 첫 30초, loaded desktop, seeds tab dock-expanded, mobile 393x852에서 “plot card와 next action이 정원 사물로 읽히는가”를 screenshot 기준으로 판단하는 별도 실패 문장이 필요하다.

셋째, asset sequencing이 아직 결정이 아니다. Designer는 plot marker부터, Art Director는 plot + next-action + resource + divider + rail vocabulary를 묶고, Engineer는 asset-only PR 뒤 side dock, plot, feedback으로 나눈다. Director가 “PR1 최소 asset 4종” 같은 타협문을 쓰면 평균내기다. 먼저 고를 화면 순간은 하나여야 한다.

넷째, mobile을 보존한다고 말하지만 mobile에서 무엇을 바꿀지는 거의 없다. 그런데 첫 세션 진입점 약화는 desktop dock 문제만이 아니다. 모바일에서 bottom tabs와 action surface가 이미 빡빡하다면, next-action ribbon을 공유한다는 말은 바로 overlap 리스크다.

다섯째, 버릴 기준이 없다. generated HUD asset이 작게 보면 장식인지 기능인지 안 읽히거나, text-safe area를 침범하거나, existing art bible과 충돌하면 폐기해야 한다. 지금 제안들은 생성 순서와 적용 순서는 말하지만, 어떤 결과를 과감히 reject할지 말하지 않는다.

여섯째, 첫 구현 cycle의 성공 기준이 “정원 느낌”으로 남아 있다. 이 표현은 너무 부드럽다. 더 날카로운 기준은 “기존 cream rectangle surface의 시각 주도권이 plot/next-action 중 최소 하나에서 사라졌는가”다. 이 문장이 spec에 없으면 이번 axis는 polish로 후퇴한다.

## Director에게 요구하는 결정

1. 첫 적용 순간을 하나로 고르라: plot card인가, next-action인가, side dock resource인가. 셋 다 첫 cycle이라고 쓰면 결정 회피다.
2. 새 PNG를 얹는 것과 기존 cream DOM surface를 제거하는 것의 관계를 명시하라. 배경 이미지 추가만으로는 본 axis의 답이 아니다.
3. asset-only PR을 허용한다면, 그 PR의 산출물이 화면 통합 전 폐기될 수 있다는 reject gate를 써라.
4. `ui_order_crate_leaf_001.category = "ui"` 불일치를 이번 axis에서 분리할지 고칠지 결정하라. 그냥 모른 척하면 manifest vocabulary 논의가 약해진다.
5. Phase 4 spec의 Decisions Resolved에는 최소 두 갈등을 이름 붙여라: `plot-first vs dock-first`, `ui_frame 회피 vs category 정리`, `DOM overlay 유지 vs in-canvas 이관` 중 둘 이상이 필요하다.
