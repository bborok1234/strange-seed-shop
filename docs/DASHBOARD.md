# 프로젝트 대시보드

Updated: 2026-05-03

> 이 파일은 `npm run update:dashboard`로 갱신한다. 수동 편집 후에는 `npm run check:dashboard`가 실패할 수 있다.

## 현재 상태

| 영역 | 상태 | 증거 |
| --- | --- | --- |
| 공통 북극성 | verified | `docs/NORTH_STAR.md` |
| Phase 0 제품 루프 | verified | `npm run check:loop` |
| 정적 에셋 파이프라인 | verified | `public/assets/manifest/assetManifest.json` |
| 경제 검증 | verified | `npm run simulate:economy` |
| 브라우저 QA | done | `reports/visual/browser_use_qa_20260427.md` |
| PR 자동 검증 | verified | PR #1, PR #2 |
| Apply gate | verified | `npm run check:apply` |
| 대시보드 자동 갱신 | review | `npm run update:dashboard`, `npm run check:dashboard` |
| 자동 머지 거버넌스 | review | `npm run check:governance` |
| PR 자동화 audit | review | `npm run check:audit` |
| Branch protection audit | done | `reports/audits/branch_protection_20260427.md` |
| PR audit 생성기 | review | `npm run update:pr-audit` |
| Browser Use QA gate | review | `npm run check:browser-qa` |
| 운영사 v0 | review | `npm run check:operator` |
| 운영사 watchdog | review | `npm run operator:watchdog` |
| 운영사 trial dry-run | review | `npm run operator:trial:dry-run` |
| 운영사 2h readiness | review | `npm run operator:trial:readiness` |
| 운영 상황판 | review | `docs/OPERATOR_CONTROL_ROOM.md`, `npm run check:control-room`, `npm run check:ops-live`, `npm run check:seed-ops-queue` |
| 운영 루프 지속성 | done | Issue #115, `npm run check:operator` |
| 프로젝트 명령어 | done | `docs/PROJECT_COMMANDS.md`, `npm run check:project-commands` |
| 사람 플레이 모드 | verified | `npm run play:main`, port 5174 |
| Sprite batch QA gate | review | `npm run check:sprite-batch` |
| 플레이테스트 intake | review | `npm run check:playtest-intake` |
| GTM mock lane | review | `npm run check:gtm-mock` |
| Asset normalization | review | `npm run check:asset-normalization` |

## 로드맵 요약

| 상태 | 개수 |
| --- | ---: |
| done | 114 |
| review | 65 |
| todo | 2 |
| blocked | 0 |

## 다음 작업

1. `docs/ROADMAP.md`의 Current Next Action과 `docs/OPERATOR_CONTROL_ROOM.md`의 active mission/small win/evidence/playable mode를 먼저 확인한다.
2. 장시간 운영모드에서는 완료 보고를 세션 종료가 아니라 checkpoint로 취급하고, stop rule이 없으면 다음 production vertical slice 후보를 plan-first로 선택한다.
3. 사람이 게임을 확인해야 하면 `npm run play:main` 후 `../strange-seed-shop-play`에서 port 5174로 실행한다.
4. 24h dry run은 heartbeat/watchdog/continuation gate가 green이고 main CI가 green인 뒤 시작한다.

## 검증 상태

| 명령 | 상태 |
| --- | --- |
| `npm run check:content` | tracked |
| `npm run check:loop` | tracked |
| `npm run simulate:economy` | tracked |
| `npm run check:docs` | tracked |
| `npm run check:apply` | tracked |
| `npm run check:dashboard` | tracked |
| `npm run check:browser-qa` | tracked |
| `npm run check:sprite-batch` | tracked |
| `npm run check:asset-normalization` | tracked |
| `npm run check:playtest-intake` | tracked |
| `npm run check:gtm-mock` | tracked |
| `npm run check:control-room` | tracked |
| `npm run check:ops-live` | tracked |
| `npm run check:seed-ops-queue` | tracked |
| `npm run check:project-commands` | tracked |
| `npm run check:operator` | tracked |
| `npm run check:governance` | tracked |
| `npm run check:audit` | tracked |
| `npm run build` | tracked |

## 열린 위험

- `main` Branch protection은 2026-04-28 기준 활성이고 required checks를 강제한다. `ENABLE_AGENT_AUTOMERGE` 활성화는 별도 운영 결정으로 유지한다.
- Browser Use QA는 Phase 0 기준을 통과했지만, 신규 UI가 생기면 같은 캡처 절차로 갱신해야 한다.
- 대시보드는 자동 생성되지만 검증 결과 자체를 실행해 저장하지는 않는다.
- 운영 상황판은 살아있는 snapshot이므로 장시간 run 시작/종료/PR 전후에 `npm run operator:control-room -- --output docs/OPERATOR_CONTROL_ROOM.md`, `npm run check:ops-live`, `npm run check:seed-ops-queue`로 갱신/검증한다.
