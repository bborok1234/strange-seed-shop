# 게임 디자인 기준

Status: active
Updated: 2026-05-06
Scope: `이상한 씨앗상회` P0.5 이후 UI/UX, 화면 구조, 상호작용, 검수 기준
Game Studio route: `game-studio:game-studio` -> `game-studio:game-ui-frontend` -> `game-studio:game-playtest`

## 목적

이 문서는 `이상한 씨앗상회`의 화면을 판단하는 상위 기준이다. `docs/DESIGN_SYSTEM.md`가 토큰, 컴포넌트 사용, Phase 0 UI 위생 기준을 다룬다면, 이 문서는 더 앞단의 질문에 답한다.

- 이 화면이 게임 장면으로 읽히는가?
- 플레이어가 지금 할 행동을 바로 알 수 있는가?
- 생명체가 도감 아이콘이 아니라 정원 actor로 느껴지는가?
- UI가 배경과 에셋을 가리지 않고 플레이필드를 보호하는가?
- 첫 5분 안에 “얘 귀엽다. 하나만 더 키워볼까?”와 “이 정원이 실제로 움직인다”가 동시에 오는가?

`docs/ART_HUD_PRODUCTION_SPEC.md`는 이 기준을 정원/생산 화면에 적용하는 제작 규격이다.

## 제품 정체성

`이상한 씨앗상회`는 브라우저 우선 idle collection tycoon이다. 플레이어는 이상한 씨앗을 키워 이름 있는 식물 생명체를 얻고, 그 생명체들이 정원 생산, 주문, 연구, 원정에 참여하는 모습을 본다.

한 화면의 목표는 예쁜 UI를 보여주는 것이 아니라 아래 흐름을 끊기지 않게 만드는 것이다.

```text
씨앗 선택 -> 심기 -> 탭/기다림 -> 수확 -> 생명체 소유
-> 생명체가 정원에서 일함 -> 생산/주문/연구/원정 목표
-> 다음 씨앗과 다음 생명체 기대
```

## 레퍼런스에서 가져올 원칙

이 문서의 경쟁작 판단은 2026-05-06 기준 공식 스토어/Steam 표면을 확인한 내용에 기반한다.

| Reference | 배울 점 | 그대로 가져오면 안 되는 점 |
| --- | --- | --- |
| [Cats & Soup](https://apps.apple.com/us/app/cats-soup-relaxing-cozy-games/id1581431235) | 캐릭터가 시설에서 일하고, 꾸미기/이름/소리/휴식 모션이 수집 애착을 만든다. idle 중에도 자원이 쌓인다는 약속이 분명하다. | 광고/패키지/이벤트 밀도를 P0에 끌어오면 첫 루프가 흐려진다. |
| [Neko Atsume 2](https://apps.apple.com/us/app/neko-atsume-2/id6499131935) | 배치하고 기다리면 방문자가 생기고, 도감이 방문 기록을 소유감으로 바꾼다. 조작은 극도로 단순하다. | 정원 생산/주문이 필요한 이 게임을 완전 관찰형으로 만들면 tycoon 축이 사라진다. |
| [Animal Restaurant](https://apps.apple.com/us/app/animal-restaurant/id1460564684) | 손님, 직원, 레시피, 가구, 편지, 이벤트가 한 세계관으로 묶인다. 화면의 작은 prop이 장기 수집 목표가 된다. | 너무 많은 메뉴와 이벤트를 한 번에 보여주면 현재 P0.5의 첫 화면 명확성이 무너진다. |
| [Garden Galaxy](https://store.steampowered.com/app/1970460/Garden_Galaxy/) | 수집한 오브젝트를 배치하며 자신만의 정원을 만든다는 소유감이 강하다. idle 방문자와 랜덤 드롭이 장식 수집 루프를 만든다. | 샌드박스 자유도를 먼저 열면 씨앗 성장, 생명체 역할, 주문 loop가 약해진다. |
| [CookieRun: Kingdom](https://apps.apple.com/us/app/cookierun-kingdom/id1509450845) | 캐릭터 IP, 생산 건물, 재료 제작, 장식이 한 공간에 공존한다. 왕국이 메뉴가 아니라 살아있는 hub다. | 전투/RPG/소셜 규모는 P0 범위 밖이다. UI 밀도만 가져오면 실패한다. |
| [Pikmin Bloom](https://apps.apple.com/us/app/pikmin-bloom/id1556357398) | 수집 대상이 플레이어의 외부 행동과 연결되고, 닫혀 있어도 진행된다는 기대를 만든다. | 위치/건강 권한 기반 loop는 현재 제품 범위 밖이다. |

## 디자인 원칙

### 1. 첫 화면은 정적 그림이 아니라 살아있는 정원이어야 한다

첫 화면 3초 안에 최소 아래 4개가 읽혀야 한다.

- 현재 작업 중인 생명체 actor
- 생산 또는 주문 진행 상태
- 지금 누를 수 있는 하나의 주요 행동
- 다음 해금 또는 다음 생명체의 단서

배경 이미지는 무대다. UI 패널이 무대를 가리면 실패다. 에셋을 만들었는데 화면에서 보이지 않거나, 너무 작거나, 텍스트에 눌리면 asset integration 실패로 본다.

### 2. UI는 정보를 설명하지 말고 행동을 열어야 한다

정원 기본 화면에서 허용되는 텍스트는 짧은 목표, 재화, 버튼 동사, actor/plot label 정도다. 긴 설명, 시스템 해설, 목록, 로그, 디버그 정보는 별도 탭이나 검수 모드로 보낸다.

좋은 CTA:

- `수확`
- `생산 잎 수령`
- `주문 납품`
- `연구 시작`
- `원정 보내기`
- `씨앗 심기`

나쁜 CTA:

- `확인`
- `다음`
- `완료`
- `정보 보기`
- `진행하기`

### 3. 생명체는 reward icon이 아니라 worker actor다

주요 생명체는 최소 3곳에서 일관되게 보여야 한다.

- reveal/도감: 이름 있는 소유 대상
- 정원: 생산/주문/연구/원정 중 하나의 역할을 가진 actor
- 결과 화면: 보상, 기억, 버프, 단서의 출처

도감에만 존재하는 생명체는 production bar를 통과하지 못한다.

### 4. 모바일 game frame을 기본 제품 화면으로 삼는다

P0.5 기준 제품 화면은 세로 모바일 frame이다. 데스크톱 브라우저에서도 별도 desktop canvas 정책이 생기기 전까지 같은 모바일 frame을 중앙에 보여준다.

기본 frame:

- target width: 393px
- supported width: 360-430px
- target height: 852px
- supported height: 740-900px

데스크톱 전용 rail, side dock, 외부 dashboard column은 P0.5 기본 playable에서 금지한다. 데스크톱 확장은 별도 spec과 visual QA가 있을 때만 다시 연다.

### 5. 하단 탭은 top-level destination이다

하단 탭은 5개를 넘기지 않는다.

- 정원
- 씨앗
- 도감
- 원정
- 상점

탭은 modal, half sheet, 떠 있는 카드가 아니다. 각 탭은 같은 game frame 안의 독립 화면이어야 한다. 정원 위에 씨앗/도감/상점 카드가 겹쳐 보이면 실패다.

### 6. HUD는 glance 정보만 남긴다

게임 HUD는 화면을 설명하는 panel이 아니라, 플레이 중 흘깃 봐도 판단 가능한 정보다. [Accessible Game Design의 HUD 원칙](https://accessiblegamedesign.com/guidelines/HUD.html)처럼 중요한 정보는 gameplay를 보면서 읽혀야 한다.

영구 HUD 예산:

- top brand/objective: 1개 cluster
- resource pills: 최대 3개
- center playfield overlay: plot/actor label만 허용
- bottom action: 현재 행동과 다음 선택만 허용
- body list: 정원 기본 화면에서는 금지

### 7. 모션은 장식이 아니라 상태 변화의 증거다

상시 흔들리는 화면은 싸구려로 보인다. 대신 상태 변화마다 짧고 명확한 motion을 준다.

- 씨앗 성장 중: 느린 호흡
- 생산 tick: 작은 leaf trail 또는 worker action
- 수확 가능: 약한 glow
- 수확/납품: 짧은 pop, resource flight, receipt
- actor 합류: playfield 입장 또는 자리 잡기

첫 화면에는 최소 2개 이상의 살아있는 motion source가 있어야 한다. 예: 생산 actor idle/work + plot ready pulse.

## 화면별 기준

### 정원

정원은 제품의 메인 무대다. 기본 화면에서 플레이어가 아무것도 할 수 없으면 가장 높은 severity의 실패다.

정원 필수 요소:

- 첫 세션 즉시 가능한 행동
- 최소 1개의 plot 또는 seed interaction
- 현재 생산/주문 상태
- 생명체 actor 또는 다음 생명체 단서
- 하단 탭

정원 금지 요소:

- 화면 절반 이상을 차지하는 영구 패널
- 배경과 같은 질감 위의 unframed text
- UI가 plot label 또는 actor를 가리는 배치
- 첫 행동이 탭 밖에 숨어 있는 구조

### 씨앗

씨앗 화면은 shop list가 아니라 다음 생명체 기대를 만드는 화면이다. 각 씨앗 row는 가격보다 먼저 “무엇을 만날 수 있는지”를 보여줘야 한다.

필수 요소:

- 구매 가능/보유/부족 사유
- 예상 성장 시간
- 연결된 생명체 단서
- 정원으로 돌아가는 심기 행동

### 도감

도감은 결과 보관함이 아니라 다음 수집 목표를 만드는 화면이다.

필수 요소:

- 발견 수/전체 수
- 미발견 silhouette
- 발견 생명체의 역할과 기억
- 다음 목표 CTA

### 원정

원정은 장기 메타의 실루엣이다. 시작 전에도 보상과 필요 조건이 읽혀야 한다.

필수 요소:

- 필요한 생명체/단서
- 걸리는 시간
- 예상 보상
- 진행/완료 상태

### 상점

Phase 0 상점은 mock/click-intent 표면이다. 실제 결제, checkout, 계정, 외부 이동은 금지한다.

## 검수 기준

새 UI/UX 작업은 아래 질문에 답해야 한다.

1. 이 화면에서 플레이어가 3초 안에 할 일을 알 수 있는가?
2. 정원 중심부와 하단 중심부가 영구 UI에 막히지 않는가?
3. 생명체가 최소 하나의 gameplay role로 화면에 존재하는가?
4. 배경/asset/label/text가 서로 싸우지 않는가?
5. 360px, 393px, desktop browser frame에서 같은 제품 경험으로 보이는가?
6. 수확, 납품, 생산 수령, 연구, 원정 같은 상태 변화가 motion/FX/receipt로 남는가?
7. 긴 설명 없이도 다음 목표가 보이는가?

하나라도 `아니오`면 production-ready가 아니다.

## 문서 위계

- `docs/NORTH_STAR.md`: 왜 이 게임을 만드는가
- `docs/DESIGN.md`: 어떤 게임 화면을 좋은 화면으로 볼 것인가
- `docs/ART_HUD_PRODUCTION_SPEC.md`: 정원/생산 화면을 어떻게 제작하고 검수할 것인가
- `docs/IDLE_CORE_PRODUCTION_SPEC.md`: 어떤 idle core loop와 progression을 좋은 게임성으로 볼 것인가
- `docs/DESIGN_SYSTEM.md`: 어떤 컴포넌트/토큰/위생 규칙을 쓸 것인가
- `docs/GAME_UI_UX_RESEARCH_20260428.md`: P0 UI rescue의 근거와 과거 결정
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`: idle core vertical slice 제작 방식
