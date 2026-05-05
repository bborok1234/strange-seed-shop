# Art Director Proposal — garden-respecting-hud-assets

## Visual Hierarchy

1차 시선은 계속 정원 stage와 plot cluster가 잡아야 한다. Cycle A에서 `.garden-panel` 면적은 줄었지만, 현재 `playfield-board-overlay`와 `.playfield-plot-card`는 여전히 단색 크림/흙색 사각형으로 읽혀서 배경보다 UI 패널이 먼저 보인다. 다음 cycle의 시각 목표는 plot card를 “카드”가 아니라 낮은 나무 표지판과 흙 두둑, 잎 장식이 붙은 정원 오브젝트로 전환하는 것이다.

2차 시선은 `.side-dock-next-action` 하나에만 준다. 현재 side dock의 네 카드가 같은 cream rectangle weight를 가져 자원, 다음 행동, 원정, 도감이 같은 loudness로 떠 있다. 다음 행동은 `ui_hud_sun_ribbon_next_action_001` 같은 햇살 리본 asset을 frame으로 쓰고, 자원/도감/원정은 `ui_hud_leaf_chip_cluster_001`와 낮은 잎 divider로 낮춰야 한다.

3차 시선은 rail과 passive metrics다. `.bottom-tabs.is-desktop-rail`은 이미 ambient nav 방향이 맞지만, rail button 자체가 아직 작은 cream slab이므로 active tab만 `ui_hud_leaf_tab_marker_001` decal을 받고 inactive tab은 rail surface에 묻히는 low-contrast leaf stamp가 되어야 한다.

금지할 hierarchy는 “정원 위에 opaque cream surface를 한 번 더 얹는 방식”이다. 새 asset은 패널을 예쁘게 꾸미는 장식이 아니라 패널 경계를 alpha-ready cutout으로 해체해서 stage art가 가장 넓게 호흡하도록 해야 한다.

## Layout Grid Per Viewport

`viewport.mobile`은 현재 단일 stage column과 bottom tabs를 유지하되, garden panel은 `grid.mobile.stage-tray`로 정의한다. plot 영역은 화면 중앙에 붙은 큰 cream sheet가 아니라 greenhouse tray asset 안에 들어간 `plot-marker-stack`이 되어야 하며, bottom action surface는 `grid.mobile.action-ribbon`으로 stage 하단 foliage 위에 놓는다. 모바일에서는 side dock 개념을 만들지 않는다.

`viewport.tablet`은 mobile과 desktop의 중간 stretch가 아니라 `grid.tablet.stage-plus-bottom-sheet`로 분리한다. rail은 유지하지 않고, plot marker는 stage 중앙의 `col.stage-center`에 두며, 자원과 다음 행동은 상단/하단 ribbon 두 줄로만 제한한다. tablet에서 가장 위험한 패턴은 desktop side dock을 좁혀 붙이는 것이다.

`viewport.desktop`은 Cycle A의 3-column 골격을 유지한다: `col.rail`, `col.stage`, `col.dock`. stage 안의 plot cluster는 `stage.anchor.upper-center`에 남기되, dock expanded 상태에서는 `stage.anchor.upper-left-safe`로 이동하는 현재 hotfix 의도를 정식 grid token으로 승격한다. gutter는 `space.stage-breathing`을 쓰고, dock과 stage 사이에는 opaque wall이 아니라 `ui_hud_vine_edge_divider_001` 같은 얇은 alpha edge만 허용한다.

`viewport.wide-desktop`에서는 plot cluster를 더 키우지 않는다. 넓은 화면의 extra space는 plot card 확대가 아니라 background art share와 negative space로 남겨야 하며, dock은 `dock.compact` 이상으로 과도하게 커지지 않아야 한다. wide에서 plot 하나가 거대한 빈 카드로 읽히는 Cycle A known issue를 반복하면 실패다.

## Design Tokens to Introduce

색 token은 기존 `--surface-panel`, `--color-surface-dock`, `--color-surface-decal-warm`을 직접 늘리지 말고 역할별 token으로 분기한다. 제안 token은 `--hud-surface-leaf-paper`, `--hud-surface-sun-ribbon`, `--hud-surface-soil-marker`, `--hud-ink-primary`, `--hud-ink-muted`, `--hud-border-pressed-leaf`, `--hud-accent-ready-bloom`이다. 값은 art bible의 fresh herb greens, warm leaf yellow, cream highlight, deep greenhouse teal accent에서만 뽑는다.

spacing token은 `--hud-inset-tight`, `--hud-inset-rest`, `--hud-gap-cluster`, `--hud-gap-stage-breathing`을 둔다. card 내부 여백을 임의 수치로 맞추지 말고, plot marker와 dock asset의 transparent padding이 이 token들과 합쳐져 텍스트가 asset 그림자나 잎 장식에 닿지 않도록 해야 한다.

radius token은 새로 키우기보다 asset shape가 맡아야 한다. DOM surface의 radius는 `--radius-control`, `--radius-panel`, `--radius-pill` 중 하나만 쓰고, “잎 모양 모서리”나 “나무 표지판 끝”은 PNG alpha contour에서 해결한다.

elevation token은 `--hud-elevation-resting-leaf`, `--hud-elevation-picked-marker`, `--hud-elevation-next-action` 세 단계만 둔다. 현재 `.playfield-plot-card`와 `.side-dock-card`의 box-shadow가 서로 비슷해서 depth language가 약하므로, plot marker는 stage에 붙은 낮은 그림자, next action은 가장 높은 리본 그림자, passive card는 거의 무그림자로 나눈다.

type token은 `--hud-type-label`, `--hud-type-value`, `--hud-type-action`, `--hud-type-plot-title` 네 단계로 제한한다. dock 카드 안에서 `strong`이 모두 같은 visual weight를 갖는 현재 구조를 끊고, 다음 행동만 `--hud-type-action`을 받는다.

## Motion Vocabulary

모션은 네 동사만 쓴다: `settle`, `nudge`, `bloom`, `drift`. `settle`은 dock/plot marker가 stage 위에 자리 잡을 때 쓰며 기존 `--motion-gesture-settle`의 의미를 확장한다. `nudge`는 다음 행동 ribbon과 ready plot의 짧은 주의 유도이고, `bloom`은 수확/납품 보상처럼 결과가 확정될 때만 쓴다. `drift`는 잎 divider나 vine edge의 ambient motion이며 gameplay action을 대신 설명하지 않는다.

`playfield-action-feedback`, reward pop, order delivery burst가 각각 다른 감각으로 튀는 현재 상태는 정리해야 한다. 새 HUD asset은 sprite/FX strip이 아니라면 움직이지 않고, 움직이는 것은 `fx_leaf_reward_pop_strip`, `fx_order_delivery_burst_001`, 후속 `fx_hud_sun_ribbon_nudge_001` 같은 binding이 있는 strip만 허용한다.

ready state는 색만 밝아지는 것이 아니라 `ui_playfield_plot_marker_ready_001`의 잎 끝 highlight와 `nudge`로 표현한다. disabled/locked state는 opacity 저하보다 “아직 뒤집힌 나무 표지판” silhouette로 읽혀야 한다.

## Asset Composition

첫 asset batch는 HUD frame/decal vocabulary로 좁힌다. 필수 후보는 `ui_playfield_plot_marker_empty_001`, `ui_playfield_plot_marker_ready_001`, `ui_hud_sun_ribbon_next_action_001`, `ui_hud_leaf_chip_resource_001`, `ui_hud_vine_edge_divider_001`, `ui_hud_leaf_tab_marker_001`이다. 모두 transparent PNG이고, text-free이며, manifest category는 `ui_frame` 또는 `ui_decal`로 분리하는 편이 맞다.

plot marker asset은 current `playfield-plot-card`의 배경 대체가 아니라 card rectangle을 깨는 시각적 주체가 되어야 한다. DOM button은 접근성과 텍스트를 유지하되, 배경은 PNG marker, mound는 PNG 또는 existing mound tokenized layer, progress는 wood groove 안에 들어간 `plot-growth-groove`로 보이게 한다.

side dock asset은 큰 frame 하나로 전체 dock을 덮지 않는다. dock 전체를 새 panel art로 만들면 Cycle A가 되돌린 “HUD가 garden을 가림” 문제가 재발한다. resource chip, next-action ribbon, section divider처럼 작은 cutout들이 dock surface를 정원물로 바꾸는 방식을 택한다.

rail asset은 navigation을 주인공으로 만들면 안 된다. active tab marker 하나와 작은 pressed-leaf badge만 만들고, inactive tab은 DOM surface와 text contrast로 충분하다.

기존 `ui_album_card_frame_001`은 앨범 카드 전용 precedent로 남긴다. 이를 HUD frame으로 재사용하면 album/field language가 섞이므로, 새 HUD vocabulary는 greenhouse wood, pressed leaf, sun ribbon, vine edge를 중심으로 독립해야 한다. `ui_order_crate_leaf_001`은 crate payoff precedent로만 참조하고, dock 카드 frame으로 확대 사용하지 않는다.

## Disagreements I Anticipate

Designer가 다음 행동을 더 크게 보이게 하자고 주장할 가능성이 있다. 동의 조건은 visual weight가 커지는 대신 footprint가 커지지 않는 것이다. 즉 큰 cream card가 아니라 sun ribbon silhouette와 `nudge` motion으로 primary action을 만드는 쪽이어야 한다.

Engineer가 PNG asset 수를 줄이기 위해 CSS gradient/frame만으로 처리하자고 할 가능성이 있다. 이 axis의 핵심은 cream rectangle의 시각 언어를 raster art vocabulary로 바꾸는 것이므로, CSS-only polish는 본 축의 답이 아니다. 단, DOM text/accessibility와 responsive sizing은 CSS가 유지해야 한다.

Director가 Cycle B in-canvas diegetic UI까지 한 번에 묶으려 할 수 있다. 본 제안은 Cycle B 전체 구현이 아니라 HUD surface vocabulary와 plot marker entry point를 먼저 정하는 것이다. in-canvas 전환은 이 asset naming과 motion vocabulary를 재사용할 수 있어야 하지만, 이번 axis가 전체 playfield architecture를 결정해서는 안 된다.

Senior Critic은 새 asset이 장식만 늘리고 정보 명확성을 해칠 위험을 지적할 것이다. 그 지적은 맞다. 그래서 모든 asset은 text-free contour, `asset-readability.small-icon`, `asset-readability.medium-icon`, 실제 screenshot integration, art-share-gate 유지라는 검증을 통과해야 하며, 장식 leaf가 텍스트 영역을 침범하면 폐기한다.

## Open Questions

1. `ui_decal` category를 manifest에 새로 허용할 것인가, 아니면 HUD cutout도 일단 `ui_frame`으로 묶을 것인가?
2. plot marker empty/ready/locked를 별도 PNG로 둘 것인가, base marker 하나와 CSS/tokenized state layer로 조합할 것인가?
3. next action ribbon은 dock 전용으로 시작할 것인가, 모바일 bottom action surface까지 같은 asset family를 공유할 것인가?
4. dock expanded player panel의 large cream sheet에도 vine edge divider를 적용할 것인가, 아니면 본 axis는 compact side dock과 garden-stage HUD에만 한정할 것인가?
5. HUD asset batch의 visual QA 기준은 기존 art-share-gate에 “cream rectangle ratio”만 추가하면 충분한가, 아니면 screenshot review checklist에 “garden object readability” 항목을 별도로 둬야 하는가?
