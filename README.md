# 이상한 씨앗상회

AI Agent가 스스로 게임을 만들고 운영하는 방식을 실험하는 브라우저 게임 프로젝트입니다.

이 저장소는 두 가지 목표를 동시에 다룹니다.

1. **이상한 씨앗상회**: 이상한 씨앗을 키워 이름 있는 식물 생명체를 수집하고, 생명체가 정원 생산과 주문 처리에 참여하는 idle collection tycoon 게임
2. **에이전트 네이티브 게임 스튜디오**: 사람이 매번 지시하지 않아도 AI Agent가 이슈를 고르고, 계획을 쓰고, 구현하고, 검증하고, PR evidence를 남기는 자율 개발/운영 시스템

핵심은 “AI 코딩 도구로 코드를 조금 더 빨리 짜는 프로젝트”가 아니라, **AI Agent를 개발 프로세스의 실행 주체로 두면 제품 개발 속도와 운영 방식이 어떻게 달라지는지**를 실제 게임 레포에서 검증하는 것입니다.

## 프로젝트 요약

- `이상한 씨앗상회`는 React/Vite/TypeScript와 Phaser 2D를 사용한 브라우저 우선 idle collection game입니다.
- 게임은 씨앗 선택, 성장, 수확, 도감, 생산, 주문, 업그레이드, 연구, 원정 teaser, 오프라인 보상으로 이어지는 P0.5 idle tycoon 루프를 갖습니다.
- 현재 북극성은 귀여운 첫 수집 감정에서 한 단계 더 나아가, “이 아이가 정원을 실제로 움직이네. 다음 주문/업그레이드/생명체까지 보고 싶다.”라는 생산/진행 감각을 만드는 것입니다.
- 운영사 레이어는 Codex/OMX 기반 에이전트가 work item, roadmap, QA report, PR evidence, CI gate를 남기며 반복 작업을 수행하도록 설계되어 있습니다.
- 런타임에서는 이미지 생성 API를 호출하지 않고, 정적 에셋 생성/검수/manifest 등록 과정을 별도 파이프라인으로 분리합니다.

## 현재 구현 범위

현재 저장소에는 다음이 포함되어 있습니다.

- React/Vite 기반 게임 앱
- Phaser 2D garden playfield
- 씨앗 심기, 성장, 탭 가속, 수확, 도감, 생산 tick, 주문 납품, 업그레이드, 연구/원정 연결 루프
- localStorage 기반 저장/오프라인 보상
- 정적 게임 에셋 manifest와 asset QA 문서
- Playwright/Browser QA 중심의 visual evidence 체계
- 자율 운영을 위한 work item, roadmap, dashboard, heartbeat, watchdog, PR/CI evidence 문서 체계

## 기술 스택

- **Frontend**: React, TypeScript, Vite
- **Game runtime**: Phaser 2D
- **Automation**: Node.js scripts, npm verification pipeline
- **QA**: Playwright, Browser Use 중심 visual QA 문서화
- **Agent operations**: Codex/OMX workflow, markdown work items, roadmap, dashboard, reports
- **Assets**: 사전 생성 정적 이미지, manifest 기반 로딩

## 실행

```bash
npm install
npm run dev
```

브라우저에서 Vite dev server 주소를 열면 게임을 확인할 수 있습니다.

## 검증

```bash
npm run check:ci
npm run check:visual
```

`check:ci`는 콘텐츠, 게임 루프, 경제 시뮬레이션, 문서 인덱스, 운영 규칙, 빌드를 포함한 기본 gate입니다. `check:visual`은 화면 회귀와 게임 UI evidence를 보강하는 로컬 QA gate입니다.

## 문서

- [북극성](docs/NORTH_STAR.md): 게임과 에이전트 네이티브 운영사의 공통 목적
- [Phase 0 PRD](docs/PRD_PHASE0.md): 게임 제품 요구사항
- [Roadmap](docs/ROADMAP.md): 현재 마일스톤과 완료 evidence
- [Project Commands](docs/PROJECT_COMMANDS.md): `$seed-ops`, `$seed-brief`, `$seed-design`, `$seed-qa`, `$seed-play`
- [Autonomous Operating Model](docs/AUTONOMOUS_PROJECT_OPERATING_MODEL.md): 에이전트 운영사 실행 모델

## 프로젝트 관점

이 프로젝트의 기준은 단순한 데모 완성이 아닙니다.

- 플레이어 기준: 첫 5분 안에 “얘 귀엽다. 하나만 더 키워볼까?”를 만들고, P0.5에서는 “이 아이가 정원을 실제로 움직이네. 다음 주문/업그레이드/생명체까지 보고 싶다.”로 확장한다.
- 개발/운영 기준: 에이전트가 제품 방향을 읽고, 작은 단위로 구현하고, 검증 evidence를 남기고, 다음 작업으로 이어간다.

게임이 좋아지지 않으면 AI 자동화 데모에 그치고, 자동화가 좋아지지 않으면 평범한 게임 프로젝트에 머뭅니다. 이 저장소는 그 둘을 함께 밀어 올리는 실험입니다.
