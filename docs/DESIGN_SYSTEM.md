# 디자인 시스템

Status: draft
Updated: 2026-04-28
Scope: Phase 0 browser game UI

## 목적

이 문서는 `이상한 씨앗상회` Phase 0 화면을 일관되게 확장하기 위한 사용 규칙이다. 토큰 목록보다 먼저, 작업자가 어떤 UI 결정을 해도 되는지와 어떤 불변을 지켜야 하는지를 정의한다.

Phase 0 UI는 첫 플레이 루프를 더 빠르게 이해시키기 위한 작업이며, 새 기능, 실제 결제, 런타임 이미지 생성을 포함하지 않는다.

게임 UI 판단은 `game-studio:game-ui-frontend`의 원칙을 따른다. 이 프로젝트의 화면은 일반 앱 대시보드가 아니라 플레이필드를 보호하는 브라우저 게임 HUD여야 한다.


## P0 Game Screen Policy — 2026-04-28

`docs/GAME_UI_UX_RESEARCH_20260428.md`가 P0 UI/UX rescue의 현재 근거 문서다. 이 정책은 기존 디자인 시스템보다 우선하는 실행 규칙이다.

- 정원 기본 화면은 Phaser playfield를 가장 큰 시각 영역으로 보호한다. React DOM은 HUD와 즉시 행동 dock만 맡는다.
- seed shop 목록, 미션 목록, debug status, 운영 panel은 정원 기본 화면에 펼치지 않는다. 해당 정보는 씨앗/도감/원정/상점/debug surface로 이동한다.
- 플레이어 기본 모드에서 `asset count`, `save ready`, `event count`, `runtime image generation disabled` 같은 개발 정보는 보이지 않아야 한다. 필요하면 debug mode에서만 표시한다.
- 모바일은 세로 game frame 기준으로, 데스크톱은 중앙 game frame 또는 명시된 desktop canvas 기준으로 검증한다. 임시 대시보드형 오른쪽 패널은 playable 기본값이 아니다.
- 모바일 하단 탭은 정원 위에 떠 있는 half overlay가 아니라 full tab screen이다. 탭 전환 시 body/document scroll은 금지하고, 긴 도감/씨앗 목록만 탭 screen 내부에서 스크롤한다.
- 데스크톱 탭 상세는 외부 dashboard column이 아니라 `.garden-stage` 내부 split surface로만 표시한다.
- Playwright CLI gate(`npm run check:visual`)가 393x852 mobile과 1280x900 desktop에서 겹침/스크롤/외부 패널 회귀를 잡아야 한다.
- UI 변경 PR은 mobile + desktop visual evidence를 남기거나 `N/A — UI 변화 없음` 사유를 적는다.
- 캐릭터/씨앗/icon/fx 에셋은 투명 배경이 기본이다. 배경이 필요한 image는 background/shop card처럼 category로 예외를 선언한다.

## 사용 규칙

### 첫 화면은 게임이어야 한다

- 앱 진입 시 마케팅 랜딩이 아니라 정원 화면을 보여준다.
- 첫 세션 루프는 유지한다: 스타터 선택 -> 심기 -> 탭 성장 -> 수확 -> 이름 있는 생명체 소유 -> 도감 보상 -> 두 번째 밭/다음 수집 목표.
- 핵심 CTA는 현재 목표와 직접 연결되어야 한다.
- 설명 문구는 플레이를 대신하지 않아야 한다.

### 모바일 우선으로 배치한다

- 360px 폭에서 하단 탭 5개가 모두 보여야 한다.
- 360px 폭에서 현재 탭의 핵심 CTA가 가로 스크롤 없이 화면 안에 있어야 한다.
- 393x852 기준 도감/씨앗/원정/상점 탭은 하단 nav를 제외한 viewport 안에 고정되어야 하며, 본문 전체가 body scroll을 만들면 실패다.
- 버튼 텍스트는 줄바꿈이 생겨도 부모 밖으로 넘치지 않아야 한다.
- 고정 하단 탭은 본문 CTA를 가리지 않아야 한다.
- 모바일 정원 탭은 360x800/360x900에서 한 화면 안에 갇혀 있어야 한다.
- 정원 핵심 루프는 세로 스크롤 없이 완료되어야 한다.
- 스크롤은 씨앗, 도감, 상점 같은 보조 목록 탭 screen 내부에서만 허용한다.

### 데스크톱은 정보 밀도를 높인다

- 1280px 폭에서 정원, 상태 정보, 현재 탭 패널이 한 화면에서 스캔 가능해야 한다.
- 데스크톱 전용 장식보다 반복 조작의 명확성을 우선한다.
- 카드 중첩을 피하고, 화면 영역은 명확한 섹션으로 나눈다.

### 플레이필드를 보호한다

- 정원 중앙과 하단 중앙은 씨앗/밭/수확 피드백을 위해 비워둔다.
- 영구 HUD는 현재 재화, 다음 행동, 하단 탭으로 제한한다.
- 미션, 로그, 긴 설명, 상점 상세는 기본 정원 화면에 펼쳐두지 않는다.
- 영구 UI가 모바일 viewport 대부분을 덮으면 실패다.
- 첫 화면은 몇 초 안에 플레이 가능해야 하며, 읽어야 할 패널을 먼저 요구하지 않는다.

### 하단 탭은 5개 고정이다

탭은 Phase 0 기준 다음 5개를 유지한다.

- 정원
- 씨앗
- 도감
- 원정
- 상점

각 탭은 선택 상태를 시각적으로 표시해야 하며, 탭 전환은 저장 데이터 구조를 바꾸지 않는다.

### 각 탭에는 핵심 CTA가 있어야 한다

- 정원: 심기, 수확, 이름 있는 생명체 소유 확인, 도감 보상, 두 번째 밭 열기 중 현재 가능한 행동
- 씨앗: 구매 또는 보유 씨앗 확인
- 도감: 보상 상태 또는 발견 생명체 확인
- 원정: 원정 시작 또는 원정 보상 받기
- 상점: mock 관심 CTA

CTA가 비활성일 때는 이유가 화면 문맥에서 추론 가능해야 한다.

### 상점은 mock 표면이다

- 첫 생명체 소유 전에는 상점이 첫 화면의 focal point가 되면 안 된다.
- 상점 CTA는 `shop_surface_clicked` event만 기록한다.
- 실제 결제, 외부 이동, 계정 생성, 로그인, 결제 SDK, 광고 SDK를 추가하지 않는다.
- `shop_surfaces.json`의 mock surface를 표시하되 콘텐츠 schema는 변경하지 않는다.
- 사용자에게 `mock` 원문을 그대로 노출하지 않는다. "미리보기", "관심 확인", "실제 결제 없음"처럼 의도를 설명하는 카피를 사용한다.

### 데이터 계약은 UI 정리 중 바꾸지 않는다

다음은 Milestone 3.5에서 불변이다.

- localStorage 저장 key와 저장 데이터 구조
- `PlayerSave` 호환성
- 콘텐츠 JSON schema
- analytics event 이름
- 기존 첫 세션 루프의 순서와 보상 흐름(이름 있는 생명체 소유 -> 도감 보상 -> 두 번째 밭 포함)

## 시각 규칙

- 주요 행동 버튼은 한 화면에서 가장 높은 대비를 가진다.
- 보조 행동은 주요 행동보다 낮은 대비를 사용한다.
- 정보 배지는 작은 크기로 유지하되 줄바꿈 시 겹치지 않아야 한다.
- 카드 반경은 8px 안팎으로 제한한다.
- 동일한 색상 계열만으로 화면 전체를 구성하지 않는다.
- 텍스트는 부모 영역을 넘치지 않아야 한다.
- 카드 안에 다시 카드처럼 보이는 중첩 구조를 만들지 않는다.

## 모션 규칙

애니메이션은 장식이 아니라 게임 피드백이다. 씨앗이 자라는 컨셉이므로 화면은 약하게 살아 있어야 하지만, 모든 요소가 계속 움직이면 피로하고 싸구려로 보인다.

허용 모션:

- 성장 중 씨앗/새싹의 느린 호흡 모션
- 밭 탭 시 짧은 bounce 또는 진행률 반응
- 수확 가능 상태의 은은한 glow 또는 pulse
- 수확 순간의 pop-in, 짧은 보상 숫자 reveal
- 하단 탭/상태 전환의 짧은 transition

금지 모션:

- 모든 카드나 버튼의 상시 반복 흔들림
- 핵심 CTA보다 강한 배경 장식 모션
- 정원 조작을 방해하는 큰 입자 효과
- reduced-motion 환경에서 필수 피드백이 아닌 애니메이션 강제

구현 시 `prefers-reduced-motion`을 존중한다. reduced-motion에서는 성장 호흡, 반복 pulse, 장식 transition을 줄이거나 끈다.

## 토큰 초안

### Color Roles

- `surface-base`: 앱 배경
- `surface-panel`: 정원/탭 패널 배경
- `surface-raised`: 반복 카드
- `text-primary`: 주요 텍스트
- `text-muted`: 보조 텍스트
- `action-primary`: 핵심 CTA
- `action-secondary`: 보조 CTA
- `border-subtle`: 패널 경계
- `state-ready`: 수확/수령 가능
- `state-disabled`: 비활성

### Spacing

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px

### Radius

- `radius-control`: 8px
- `radius-panel`: 8px
- `radius-pill`: 999px

### Typography

- 화면 제목은 모바일에서 과도하게 커지지 않는다.
- 버튼 글자는 360px 폭에서도 부모 안에 들어와야 한다.
- letter-spacing은 기본값을 유지한다.
- viewport width 기반 font-size를 사용하지 않는다.

## 정적 에셋 후보

`gpt-image-2`는 런타임 호출 금지다. 필요한 경우 아래 정적 후보를 사전 제작 대상으로 정의한다.

- 온실 첫 화면 배경 보강 1종
- 스타터 상인팩 카드 이미지 1종
- 월간 온실권 mock 카드 이미지 1종
- 빈 밭/활성 밭/잠긴 밭 상태 보조 아이콘 후보

## QA 기준

완료 판정에는 다음 증거가 필요하다.

- Browser Use/CDP로 첫 세션 루프 재확인: starter seed -> plant -> tap growth -> harvest -> named creature ownership -> album reward -> second plot/next collection goal
- Browser Use로 하단 5개 탭 전환 확인
- Browser Use로 mock 상점 CTA 클릭 후 `shop_surface_clicked`만 기록되는지 확인
- Browser Use 또는 CDP 캡처로 모바일 정원 탭이 360x800/360x900에서 핵심 루프 세로 스크롤을 요구하지 않는지 확인
- 360px viewport 캡처
- 1280px viewport 캡처
- `docs/README.md`, `docs/ROADMAP.md`, `docs/BROWSER_QA.md` 또는 visual report에 증거 파일 링크

## 금지

- 실제 결제, checkout, 결제 정보 입력, 결제 SDK
- 로그인, 계정 생성, credential 입력
- 외부 링크 이동으로 이어지는 상점 CTA
- 런타임 이미지 생성
- 저장 데이터 구조 변경
- 콘텐츠 JSON schema 변경
- analytics event 이름 변경
- 랜딩 페이지화
- 중첩 카드 남용
