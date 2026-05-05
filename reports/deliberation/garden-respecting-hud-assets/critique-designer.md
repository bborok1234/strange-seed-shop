# Designer Critique — garden-respecting-hud-assets

## My disagreements with each other proposal

### Art Director proposal에 대한 이견

Art Director의 큰 방향, 즉 cream rectangle을 PNG alpha contour와 정원 오브젝트 언어로 해체하자는 판단에는 동의한다. 다만 내가 플레이어라면 첫 30초에 rail button의 leaf marker나 viewport별 token 체계보다 “지금 어느 밭을 누르면 시작되는가”를 먼저 알아야 한다. 그래서 첫 asset batch에 `ui_hud_leaf_tab_marker_001`, `ui_hud_vine_edge_divider_001`가 들어가는 우선순위에는 반대한다. 이 둘은 분위기에는 기여하지만, 첫 수확과 다음 씨앗 선택 loop를 직접 닫지 않는다.

`side-dock-next-action` 하나만 2차 시선으로 두자는 제안도 fresh save에서는 약하다. Cycle A 이후 starter-panel이 숨겨진 상태라면, 첫 씨앗 행동은 dock 안의 리본만으로는 “정원에서 바로 할 일”로 읽히지 않을 수 있다. next-action은 dock의 sun ribbon으로만 고정하기보다, fresh save와 ready plot 상태에서는 plot-adjacent signpost 또는 plot marker 내부의 한 줄 행동으로 승격되어야 한다. 왜냐하면 첫 행동의 위치가 dock이면 플레이어는 정원을 보는 대신 패널을 읽기 시작하고, 본 axis가 해결하려는 “정원보다 HUD가 먼저 보임”을 다시 만들 수 있기 때문이다.

Motion vocabulary를 `settle`, `nudge`, `bloom`, `drift`로 제한하는 것은 좋지만, `nudge`가 starter clarity를 대신한다고 보면 반대한다. 플레이어가 무엇을 해야 하는지 모르는 상태에서 움직이는 리본은 관심은 끌어도 verb를 설명하지 못한다. “톡톡 성장”, “수확”, “납품”처럼 현재 가능한 단일 verb가 텍스트와 위치로 먼저 닫히고, motion은 그 다음 강조여야 한다.

tablet/wide desktop grid와 token 제안은 훌륭한 미술 시스템 초안이지만, 이번 axis의 첫 구현 cycle에는 과하다. 화면별 grid를 먼저 설계하면 실제로는 player journey가 아니라 layout system이 주인공이 된다. Director synthesis에서는 Art Director의 vocabulary 중 plot marker, next-action signpost, resource holder처럼 verb에 직접 붙는 것만 첫 vertical slice로 채택하고, rail/tablet/wide token 확장은 후속으로 미루는 편이 맞다.

### Engineer proposal에 대한 이견

Engineer의 save migration 금지, manifest 기반 정적 raster slot, performance budget은 이 axis의 안전장치로 필요하다. 그러나 PR 순서에는 이견이 있다. PR1을 asset vocabulary 생성/등록만으로 끝내면, 실제 화면에서 플레이어가 “밭을 누르고 보상을 받는다”를 더 잘 이해하는지 검증하지 못한 채 asset을 accepted 상태로 굳힐 위험이 있다. 최소한 첫 batch의 acceptance에는 mock integration screenshot 또는 throwaway preview report가 붙어야 한다.

PR2를 side dock resource/next-action skin으로 두고 PR3에서 plot card seedbed frame을 적용하는 순서도 Designer 관점에서는 뒤집는 편이 낫다. 현재 문제의 가장 큰 체감은 정원 중앙에서 plot card가 카드처럼 읽히는 것이고, 첫 5분 loop의 primary verb도 plot에서 시작한다. side dock이 먼저 정원물처럼 바뀌면 보기에는 좋아지지만, 내가 처음 켰을 때 “어디를 눌러 키우나”는 여전히 약할 수 있다. 따라서 첫 UI 적용 PR은 plot marker/frame + ready ribbon + 최소 next-action bridge가 되어야 하고, resource plaque는 그 다음이어도 된다.

onboarding hot-state를 PR4로 미루는 것도 반대한다. brief의 known issue에 “첫 세션 onboarding 진입점 약화”가 이미 적혀 있으므로, 이것은 후속 polish가 아니라 axis 성공 조건이다. 첫 세션에서 다음 행동이 작은 chip으로 묻히면 HUD asset을 도입해도 player verb는 회복되지 않는다.

검증을 PR5의 checker hardening/evidence package로 분리하는 것도 위험하다. visual regression check 자체를 별도 PR로 강화하는 것은 가능하지만, PR2와 PR3 각각에는 Browser Use screenshot evidence와 geometry guard가 함께 있어야 한다. 특히 dock expanded 상태에서 plot card가 가려지는 Cycle A measurement gap은 “나중에 evidence PR에서 잡자”가 아니라 asset 적용 PR의 merge gate여야 한다.

`ui_frame` category로 새 HUD asset을 우회 등록하자는 제안은 단기 안전성은 이해하지만, Designer 관점에서는 asset 역할이 흐려질 수 있다. plot marker, next-action sign, resource holder는 모두 player verb와 정보 hierarchy가 다른데 전부 `ui_frame`으로 묶이면 후속 스펙에서 “무엇이 행동 표지이고 무엇이 장식인가”가 약해진다. 첫 PR에서 새 category를 만들지 않더라도, manifest tags나 spec terminology에는 `plot-marker`, `action-signpost`, `resource-holder`, `decorative-divider`를 명확히 남겨야 한다.

## Self-critique of my own proposal

내 제안의 약점은 plot marker/frame을 너무 강한 1순위로 둔 나머지, resource holder와 order crate가 reward loop의 도착점이라는 사실을 충분히 acceptance로 못 박지 않았다는 점이다. 내가 수확을 눌렀을 때 잎이 어디로 들어갔는지 보이지 않으면, plot card가 정원물처럼 보여도 idle/tycoon loop는 닫히지 않는다. 따라서 Director synthesis에서는 “plot marker 먼저”를 유지하되, 같은 첫 vertical slice 안에 최소 하나의 reward destination anchor, 예를 들면 잎 바구니 resource holder 또는 order crate state, 를 포함해야 한다.

또 하나의 약점은 `구매하고 심기`처럼 tap 수를 줄이는 표현을 제안하면서, 이번 axis가 economy/save schema 변경을 범위 밖으로 둔다는 제약을 더 강하게 표시하지 않은 것이다. 이 문장은 플레이어 흐름 관점의 이상적인 bridge였지만, 구현 spec에서는 기존 구매/심기 규칙을 바꾸지 않고 CTA 문구와 navigation 비용만 줄이는 수준으로 제한되어야 한다. mechanic 변경처럼 읽히면 Engineer가 맞게 반대할 것이다.

모바일과 tablet에 대한 내 제안도 충분히 구체적이지 않았다. 첫 30초 clarity를 말했지만, 모바일에서는 side dock이 없고 bottom tabs overlap이 핵심 실패 모드이므로 next-action signpost의 위치와 높이 제한을 별도로 써야 했다. Director가 spec을 쓸 때는 desktop plot-adjacent signpost와 mobile bottom action ribbon을 같은 asset family로 묶되, 모바일에서는 body scroll 없음과 bottom tab overlap 없음이 player verb보다 먼저 깨지지 않게 해야 한다.

## Cross-cutting risks

세 제안을 함께 읽으면 가장 큰 위험은 “정원물처럼 보이는 HUD”와 “정원에서 바로 하는 행동”이 분리되는 것이다. Art Director는 asset vocabulary와 visual hierarchy를 넓게 잡고, Engineer는 안전한 PR 분리를 제안하지만, 이 둘이 결합되면 첫 cycle이 예쁜 decal과 asset 등록으로 끝나고 정작 player verb가 좋아졌는지는 늦게 확인될 수 있다. 이번 axis의 spec은 asset 목록이 아니라 `fresh save -> 첫 씨앗/plot 행동 -> ready harvest -> reward destination`의 짧은 화면 순간을 기준으로 asset을 고정해야 한다.

두 번째 위험은 category와 naming이 장식 중심으로 굳어지는 것이다. `leaf tab marker`, `vine divider`, `feedback sun pill` 같은 이름은 만들기 쉽지만, 플레이어 행동을 닫는지 애매하다. asset plan에는 각 PNG마다 `screen_moment`, `player_verb`, `state_binding`, `must_not_obscure`를 남겨야 한다. 그렇지 않으면 runtime에서 쓰이지 않는 예쁜 UI 조각만 늘어난다.

세 번째 위험은 art-share-gate를 보존한다는 명분으로 next-action을 너무 작게 만드는 것이다. Cycle A의 목표가 정원 면적 회복이었다면, 이번 axis의 목표는 그 정원 안에서 할 일을 알게 하는 것이다. footprint를 키우지 않는 것은 맞지만, hit target과 reading priority까지 낮추면 첫 세션 onboarding 진입점 약화가 해결되지 않는다.

네 번째 위험은 evidence가 DOM presence로 축소되는 것이다. 세 제안 모두 screenshot integration을 언급하지만, 실제 merge gate가 “asset layer exists” 정도로 끝나면 cream rectangle 체감은 남을 수 있다. 검증은 fresh save, loaded ready plot, desktop dock-expanded, mobile garden 상태에서 스크린샷으로 “plot card가 카드가 아니라 밭 사물처럼 읽히는가”, “다음 행동이 하나의 verb로 읽히는가”, “자원 숫자가 reward destination으로 보이는가”를 확인해야 한다.

마지막 위험은 Cycle B in-canvas diegetic UI와의 경계다. 이번 axis가 DOM HUD skin으로 끝나는 것은 맞지만, plot marker와 next-action signpost가 나중에 canvas 안으로 이동할 수 없는 이름과 크기로 만들어지면 후속 전환 비용이 커진다. 첫 spec은 DOM 적용을 선택하더라도 asset family를 `playfield-object-like HUD`로 정의해, 후속 diegetic UI가 같은 vocabulary를 재사용할 수 있게 해야 한다.
