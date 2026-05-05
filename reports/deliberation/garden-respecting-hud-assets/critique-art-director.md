# Art Director Critique — garden-respecting-hud-assets

## My disagreements with each other proposal

### Designer proposal

Designer 제안의 가장 강한 점은 HUD asset을 장식이 아니라 `첫 씨앗 심기`, `톡톡 성장`, `수확`, `납품`의 player verb를 보이게 하는 장치로 정의했다는 것이다. 다만 시각 hierarchy 관점에서는 next-action signpost를 “첫 세션과 복귀 세션에서 격상”한다는 방향이 footprint 확대로 오해될 위험이 있다. 격상은 면적이 아니라 silhouette, contrast, motion priority로 해야 한다. 즉 `side-dock-next-action`이나 plot-adjacent prompt가 큰 cream panel로 커지는 순간, 정원 stage는 다시 UI 뒤로 밀린다.

두 번째 disagreement는 asset sequencing에서 plot marker, next-action, resource holder, order crate, dock decal을 모두 같은 cycle의 자연스러운 연쇄처럼 다루는 점이다. 플레이어 verb 기준으로는 맞지만, 시각 언어 기준으로는 먼저 공통 contour vocabulary를 잠가야 한다. `wood marker`, `sun ribbon`, `pressed leaf chip`, `vine edge`가 같은 art bible에서 온 물체처럼 보이지 않으면 각 asset은 따로 귀엽지만 화면은 collage가 된다.

세 번째로, resource holder를 “잎 바구니, 꽃가루 병, 재료 상자”로 구체화한 것은 좋지만, 자원 HUD가 항상 visible해야 한다는 조건이 visual loudness까지 항상 높아야 한다는 뜻은 아니다. 자원은 `hud.elevation.resting-leaf`와 `hud.type.value`에 묶고, reward motion의 도착점일 때만 잠깐 `bloom`을 받아야 한다. 평상시 자원 holder가 next-action ribbon과 같은 saturation이나 shadow를 받으면 L1/L3 hierarchy가 무너진다.

### Engineer proposal

Engineer 제안은 save schema를 건드리지 않고 manifest 기반 정적 raster slot으로 제한한 점에서 visual scope를 보호한다. 그러나 첫 PR에서 새 category를 피하고 `ui_frame` 중심으로만 가자는 방향은 장기적인 시각 언어를 흐릴 수 있다. `ui_frame`이 모든 HUD cutout, divider, plaque, marker를 삼키면 art bible에서 중요한 차이인 frame과 decal, state marker의 역할이 manifest 단계에서 사라진다. 첫 구현 편의 때문에 category를 늦추더라도 spec에는 `ui_decal` 또는 동등한 역할 token을 명확히 남겨야 한다.

두 번째 disagreement는 asset slot 이름이 기술 인터페이스 기준으로만 정리되어 있어, 실제 화면에서 어떤 contour와 negative space를 가져야 하는지 약하다. 예를 들어 `ui_hud_resource_plaque_001`는 plaque라는 단어만으로는 잎 chip인지 나무 명패인지 유리 병 받침인지 결정되지 않는다. Art Direction spec에는 slot마다 `shape language`, `transparent padding`, `text safe zone`, `allowed elevation`이 같이 붙어야 한다.

세 번째로, PR 분리는 구현 리스크를 낮추지만 시각 QA를 PR 후반으로 미루면 asset-only batch가 실제 화면에서 cream rectangle을 줄이는지 알 수 없다. asset 생성/등록 단계에서도 screenshot mock 또는 fixture composition으로 `asset-readability.medium-surface`, `text-safe-zone`, `cream-surface-replacement`를 확인해야 한다. PNG가 아름답게 나와도 DOM 위에 얹었을 때 rectangle을 숨기지 못하면 본 axis는 실패다.

네 번째 disagreement는 신규 HUD PNG 총량과 기준 해상도만으로 성능·품질 균형을 보려는 점이다. 아트 디렉터 관점에서 더 중요한 것은 크기보다 asset의 alpha contour가 텍스트와 stage art를 얼마나 방해하지 않는가이다. 동일한 예산 안에서도 장식 잎이 text safe zone을 침범하거나, 그림자가 `hud.elevation.next-action`과 `hud.elevation.resting-leaf`를 구분하지 못하면 사용자는 여전히 cream card와 장식 스티커만 본다.

## Self-critique of my own proposal

내 proposal의 가장 큰 약점은 visual vocabulary를 넓게 정의하면서도 첫 vertical slice에서 무엇을 반드시 잘라낼지 충분히 단호하지 않았다는 점이다. `ui_playfield_plot_marker_empty_001`, `ui_playfield_plot_marker_ready_001`, `ui_hud_sun_ribbon_next_action_001`, `ui_hud_leaf_chip_resource_001`, `ui_hud_vine_edge_divider_001`, `ui_hud_leaf_tab_marker_001`를 모두 필수 후보로 두면, 실제 spec synthesis에서 “다 만들자”로 흐를 수 있다.

아트 방향상 더 안전한 최소 단위는 `plot marker family`와 `next-action ribbon family`를 먼저 lock하는 것이다. resource chip과 rail marker는 그 두 family의 contour, color, elevation language가 화면에서 통과한 뒤 확장해도 늦지 않다. 특히 rail은 ambient navigation이어야 하므로, 여기까지 첫 batch에 넣으면 정원 stage보다 nav polish가 먼저 보일 위험이 있다.

두 번째 self-critique는 `ui_decal` category를 제안하면서 Engineer가 지적한 checker·manifest 확장 부담을 충분히 다루지 않았다는 점이다. visual taxonomy는 필요하지만, 첫 PR에서 category 확장이 asset 품질 검증과 섞여 spec을 흐릴 수 있다. Director가 보수적으로 결정한다면 manifest category는 일단 기존 범위에 두되, spec의 design taxonomy와 asset tags에서 `decal`, `frame`, `state-marker` 역할을 강제하는 절충이 가능하다.

세 번째 self-critique는 motion vocabulary를 선명하게 정의했지만, `nudge`와 `bloom`의 사용 조건을 screenshot evidence로 검증할 방법을 충분히 말하지 않았다는 점이다. motion은 말로는 정돈되어 보여도 실제 화면에서는 주의 끌기 경쟁이 생긴다. spec에는 `nudge`는 한 화면에 하나의 primary actionable object만, `bloom`은 reward confirmation 순간만이라는 제한이 필요하다.

## Cross-cutting risks

첫 번째 cross-cutting risk는 세 제안이 모두 asset-first에는 동의하지만, “정원물처럼 보인다”의 판정 기준이 아직 다르다는 점이다. Designer는 verb clarity, Engineer는 static asset slot과 검증 명령, Art Director는 contour·hierarchy·motion vocabulary를 본다. Director spec은 이 셋을 묶어 `garden object readability`를 acceptance로 정의해야 한다. 예: stage screenshot에서 plot marker와 next-action이 카드가 아니라 정원 사물로 읽히고, L0 stage art가 L1 action보다 먼저 호흡하며, L3 resource가 focal point가 되지 않는다.

두 번째 risk는 next-action 회복과 art-share 보존이 서로 충돌할 수 있다는 점이다. Designer가 요구하는 첫 세션 clarity는 필요하지만, 이를 큰 signboard surface로 풀면 Cycle A에서 줄인 obstruction이 돌아온다. 해결 기준은 `larger presence, same or smaller footprint`여야 한다. silhouette, alpha contour, `nudge` motion, stage-adjacent placement로 시선을 만들고 opaque 면적은 늘리지 않는다.

세 번째 risk는 plot card를 DOM overlay에 남기는 동안, raster marker가 실제 playfield 사물이 아니라 카드 위 배경 이미지처럼 보일 수 있다는 점이다. 이 경우 `ui_playfield_plot_marker_ready_001` 같은 asset을 넣어도 cream rectangle이 “그림 붙은 카드”가 된다. plot marker에는 DOM text safe zone과 별도로 stage에 붙는 낮은 shadow, soil groove, transparent edge가 필요하고, surface fill은 `hud-surface-soil-marker` 이상으로 커지면 안 된다.

네 번째 risk는 asset family가 서로 다른 precedent를 섞는 것이다. `ui_album_card_frame_001`의 앨범 프레임, `ui_order_crate_leaf_001`의 주문 상자, 새 HUD ribbon이 한 화면에서 같은 frame language로 오해되면 album, order, field의 역할 구분이 무너진다. order crate는 shipment payoff precedent로만 쓰고, HUD는 greenhouse wood, pressed leaf, sun ribbon, vine edge로 독립된 family를 가져야 한다.

다섯 번째 risk는 token discipline이 implementation convenience에 밀리는 것이다. Engineer proposal은 파일 경계와 fallback을 잘 잡았지만, CSS 적용 단계에서 hardcoded surface, shadow, radius가 늘면 asset이 들어가도 visual system은 더 흐려진다. spec은 새 hex·px 직접 추가를 금지하고 `hud.surface`, `hud.elevation`, `hud.type`, `hud.motion` 역할 token 없이는 UI 적용 PR이 통과하지 못하게 해야 한다.

여섯 번째 risk는 asset 검증이 provenance와 alpha 품질에 머무르고 실제 screen hierarchy를 보지 못하는 것이다. `check:asset-provenance`, `check:asset-style`, `check:asset-normalization`, `check:asset-alpha`는 필요한 gate지만 충분하지 않다. Phase 4 spec에는 Browser Use 또는 screenshot evidence에서 desktop 기본, dock-expanded, mobile garden 상태를 보고 `cream rectangle reduction`, `text safe zone`, `bottom tab non-overlap`, `garden object readability`를 확인하는 visual acceptance가 들어가야 한다.
