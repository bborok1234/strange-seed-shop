# 아트/HUD 프로덕션 제작 규격

Status: active
Updated: 2026-05-06
Scope: P0.5 정원, 자동 생산, 주문, 연구/원정 bridge 화면
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`
Source design: `docs/DESIGN.md`

## 목적

이 문서는 정원 화면을 production급 idle collection tycoon 장면으로 만들기 위한 제작 규격이다. 목표는 UI를 더 예쁘게 칠하는 것이 아니라, 화면만 보고도 아래 사실이 읽히게 만드는 것이다.

```text
이 정원에는 이름 있는 생명체가 있고,
그 생명체가 일을 하고 있으며,
자원과 주문이 움직이고,
플레이어는 지금 바로 하나의 행동을 할 수 있고,
다음 생명체/연구/원정 목표가 기다린다.
```

## 경쟁작 기준 Production Bar

| Reference | 관찰한 production 장점 | 이 프로젝트의 적용 |
| --- | --- | --- |
| [Cats & Soup](https://apps.apple.com/us/app/cats-soup-relaxing-cozy-games/id1581431235) | 시설마다 캐릭터가 일하고, idle 중 자원을 모으며, 꾸미기/의상/이름이 애착을 만든다. | 생명체는 plot 주변 또는 생산 카드 안에서 실제 worker로 움직여야 한다. |
| [Neko Atsume 2](https://apps.apple.com/us/app/neko-atsume-2/id6499131935) | 배치 -> 대기 -> 방문 -> 도감 기록의 단순함이 강하다. | 씨앗/plot/단서 배치는 복잡한 설명보다 결과 기대를 앞세운다. |
| [Animal Restaurant](https://apps.apple.com/us/app/animal-restaurant/id1460564684) | 손님, 직원, 레시피, 가구, 편지가 하나의 장소 경험으로 이어진다. | 주문 crate, 연구 노트, 원정 단서 같은 prop은 숫자 상태가 아니라 세계 안의 물건으로 남긴다. |
| [Garden Galaxy](https://store.steampowered.com/app/1970460/Garden_Galaxy/) | 수집한 오브젝트를 정원에 배치하는 소유감이 강하다. | 향후 장식/시설은 gameplay prop과 visual prop을 겸해야 한다. |
| [CookieRun: Kingdom](https://apps.apple.com/us/app/cookierun-kingdom/id1509450845) | 생산 건물, 캐릭터, 재료 제작, 꾸미기가 한 hub에 섞인다. | 정원은 메뉴 모음이 아니라 생산 hub다. |
| [Pikmin Bloom](https://apps.apple.com/us/app/pikmin-bloom/id1556357398) | 닫혀 있는 동안에도 진행된다는 기대와 수집 대상의 다양성이 재방문 이유가 된다. | 오프라인 보상은 숫자 modal이 아니라 정원 prop/actor 상태로 돌아와야 한다. |

## 화면 구성 원칙

### 1. 모바일 frame이 기준이다

P0.5에서 desktop browser는 모바일 frame을 중앙에 보여준다. 별도 desktop canvas가 다시 열리기 전까지 desktop-only rail, side dock, 외부 panel은 production-ready로 보지 않는다.

기준 viewport:

| Viewport | 용도 | 통과 기준 |
| --- | --- | --- |
| 393 x 852 | 기본 모바일 frame | 모든 주요 행동, plot, actor, bottom tabs가 한 frame 안에서 읽힘 |
| 360 x 800 | 작은 모바일 회귀 | 버튼 텍스트와 action card가 잘리지 않음 |
| 1280 x 900 | 데스크톱 브라우저 | 중앙 모바일 frame이 유지되고 외부 dashboard UI가 없음 |

### 2. HUD 예산

영구 HUD가 화면을 설명하려 들면 실패다.

| Layer | 허용 | 금지 |
| --- | --- | --- |
| Top title | 브랜드명, 현재 objective 1줄 | 긴 tutorial, 여러 줄 설명 |
| Resource | 잎/꽃가루/재료 최대 3개 pill | resource card grid, debug counters |
| Playfield | plot marker, actor, 짧은 status plate | unframed long text, overlapping label |
| Action surface | 현재 primary verb, 다음 성장 선택 2-4개 | 스크롤 목록, log, full dashboard |
| Bottom nav | 5개 top-level 탭 | 6개 이상, scrollable nav |

권장 화면 점유율:

- 배경/플레이필드 가시 영역: 최소 55%
- 영구 top HUD: 최대 16%
- bottom nav: 최대 12%
- action surface: 필요 시 최대 30%, 평상시는 22% 이하
- center playfield overlay: plot/actor 외 장문 text 금지

### 3. Playfield layer stack

정원 장면은 아래 순서로 쌓는다.

```text
background art
-> environmental shade/lighting
-> floor/usable play area
-> plot art assets
-> seed/creature/order/research props
-> short label plates
-> transient FX
-> DOM HUD/action/bottom nav
```

DOM text가 상세한 배경 위에 직접 올라가면 안 된다. plot 이름, empty/ready 상태, actor 이름은 반드시 plate, shadow, rim, 또는 ribbon을 가진다.

### 4. Plot 배치

plot은 배경의 중심 장식이 아니라 플레이어가 조작할 수 있는 대상이다.

기준:

- 첫 plot은 정원 floor의 상단 선반/서랍 위가 아니라 실제 바닥 play area에 있어야 한다.
- 두 plot 이상일 때는 가로로 늘어놓되, label과 actor가 서로 겹치지 않아야 한다.
- plot label은 plot 중앙을 덮지 말고 하단 안쪽 plate 또는 plot 바로 아래 plate로 분리한다.
- 빈 자리 text는 `빈 자리` 1개만 허용한다. 같은 plot에 `+`, `빈 자리`, 긴 안내가 동시에 있으면 실패다.
- ready plot은 text보다 시각 상태가 먼저 읽혀야 한다. ribbon/glow/seed state를 우선한다.

### 5. Actor 배치

생명체 actor는 도감 이미지의 축소판이 아니라 일하는 주체다.

기준:

- 첫 worker는 첫 화면에서 최소 48px 이상으로 식별 가능해야 한다.
- actor가 생산 카드에 들어갈 때도 얼굴/몸 silhouette이 잘리지 않아야 한다.
- actor와 plot label이 겹치면 actor 우선, label은 plate를 이동한다.
- support actor는 주 actor보다 작아도 되지만, 역할이 보이는 위치에 있어야 한다.
- 떠다니는 actor는 배경과 관계없는 임의 좌표에 놓지 않는다. plot, crate, workbench, action surface 중 하나에 anchor를 가진다.

필수 actor state:

| State | 용도 |
| --- | --- |
| idle | 정원에 존재감을 남김 |
| work | 자동 생산/주문/연구 도움 |
| celebrate | 수확/납품/보상 순간 |
| tired/rest | 향후 offline/boost/관리 상태 |
| portrait | reveal/도감/card |
| small icon | HUD chip, roster |

### 6. Label/readability

텍스트는 asset을 설명하는 보조물이지 asset을 대신하는 본체가 아니다.

기준:

- detailed background 위 직접 텍스트 금지
- plot/actor label은 1-2줄까지만 허용
- 가장 긴 한국어 단어가 360px viewport에서 부모 밖으로 나가면 실패
- label plate는 텍스트보다 최소 8px 넓은 padding을 가진다
- 배경과 유사한 녹색 텍스트만으로 상태를 구분하지 않는다
- bold weight를 남발하지 않는다. 제목/CTA/숫자만 강하게 둔다

### 7. Motion/FX

첫 화면은 정적인 일러스트가 아니라 game state가 움직이는 장면이어야 한다.

필수 motion source:

- production actor idle/work loop
- plot growth/ready state pulse
- resource claim 또는 order delivery reward motion

상태 변화별 motion:

| Moment | Required feedback |
| --- | --- |
| tap growth | plot bounce, progress spark, short number |
| harvest ready | soft glow, ready ribbon, CTA change |
| harvest | creature pop/reveal, reward burst |
| production claim | worker action, leaf trail, resource delta |
| order delivery | crate seal/dispatch, reward receipt |
| research complete | note stamp, album clue movement |
| expedition ready | map/marker pulse, reward crate |

`prefers-reduced-motion`에서는 반복 pulse와 장식 loop를 줄이되, 상태 변화 feedback 자체는 다른 방식으로 남긴다.

## 화면별 제작 규격

### Fresh start

통과 기준:

- 시작 즉시 가능한 seed/plot 행동이 있다.
- 잎이 0이어도 막히지 않는다.
- 첫 seed 선택 또는 심기 CTA가 bottom action surface에서 보인다.
- 첫 plot은 실제 조작 대상처럼 보인다.

실패 예:

- 시작 화면에 아무 행동도 없고 씨앗 구매도 불가능하다.
- 빈 plot만 있고 어떻게 진행하는지 알 수 없다.
- 배경 일러스트만 있고 gameplay prop이 없다.

### Growing

통과 기준:

- 성장률 또는 남은 시간이 plot 상태로 보인다.
- tap이 가능한 경우 tap feedback이 있다.
- 다음 상태가 수확임을 예고한다.

### Ready / harvest

통과 기준:

- 수확 가능 상태가 text 없이도 보인다.
- CTA는 `수확`이다.
- 수확 후 reveal, 도감, 생산 actor 합류 중 하나로 이어진다.

### Production

통과 기준:

- worker actor가 생산 중임을 보여준다.
- 분당 생산량은 top resource보다 action/production card에서 더 의미 있게 읽힌다.
- `생산 잎 수령`은 숫자 변화와 leaf motion을 동반한다.

### Order

통과 기준:

- order crate가 세계 안의 prop으로 보인다.
- 진행률, 필요량, 보상이 한 덩어리로 읽힌다.
- 납품 완료 후 crate/receipt/reward state가 남는다.

### Research / expedition bridge

통과 기준:

- 연구 완료가 추상 badge가 아니라 note/clue prop으로 보인다.
- 원정 준비는 탭 badge만이 아니라 정원/도감/원정 중 적어도 한 곳에서 연결된다.

## QA/검수 프로토콜

UI/visual implementation PR은 아래 evidence를 남긴다.

1. Browser Use `iab`로 현재 in-app browser에서 실제 화면 확인 또는 blocker 기록
2. Playwright mobile 393 screenshot
3. Playwright mobile 360 또는 짧은 높이 screenshot
4. Playwright desktop 1280 screenshot
5. no body scroll, no bottom tab overlap, no clipped text assertion
6. actor/plot/order/reward 중 최소 2개 visual state screenshot

문서-only 변경은 Browser Use evidence가 없어도 되지만, 이 문서를 적용하는 화면 구현은 Browser Use 우선 검수를 생략할 수 없다.

## Production-ready 판정

아래 항목이 모두 통과해야 한다.

- 첫 화면에서 gameplay verb가 3초 안에 보인다.
- 배경 asset의 핵심 영역을 영구 panel이 가리지 않는다.
- actor, plot, order/research prop 중 최소 2개가 화면에서 gameplay state로 읽힌다.
- label은 plate/ribbon/shadow 등 가독성 처리가 있다.
- 모바일과 데스크톱 브라우저가 같은 모바일 game frame 경험을 공유한다.
- 수확/생산/주문/연구/원정 중 적어도 하나의 상태 변화가 motion/FX/receipt로 남는다.
- 검수 스크린샷에서 “정적인 그림”이 아니라 “진행 중인 게임 장면”으로 읽힌다.

## 금지 패턴

- 배경을 거의 전부 덮는 영구 카드/패널
- 플레이필드 중앙에 긴 설명 카드
- actor 없는 생산 수치 card
- 도감에만 존재하는 생명체
- unframed text를 상세 배경 위에 직접 배치
- plot marker와 label, actor가 한 점에 겹치는 배치
- desktop 전용 side rail/dock을 다시 기본 playable에 노출
- SVG/vector/code-native drawing을 accepted game asset처럼 취급
- runtime image generation
