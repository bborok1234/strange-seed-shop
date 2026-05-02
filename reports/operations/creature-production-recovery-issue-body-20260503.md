# 대표 생명체 stage, 돌보기 반응, 도감 감상면을 production으로 복구

## 요약

로컬 recovery branch에 남아 있는 실제 게임/UI production 변경을 GitHub issue/PR 단위로 되살린다. 목표는 기존 화면이 카드/대시보드처럼 보이는 문제를 줄이고, 대표 생명체 stage, 돌보기 반응, 도감 감상면을 플레이어가 크게 볼 수 있게 만드는 것이다.

## 배경

`stash@{0}`의 `src/App.tsx`, `src/styles.css`, `tests/visual/p0-mobile-game-shell.spec.ts`에는 1,200줄 규모의 production UI/gameplay 변경이 있다. 이 변경은 v2 local campaign ledger상 Keep/Release까지 기록되어 있지만, GitHub WorkUnit/PR로 승격되지 않았으므로 완료 작업으로 볼 수 없다.

## 범위

- 정원 첫 화면의 대표 생명체 stage layer
- `돌보기 -> visible resident reaction -> in-world clue` 흐름
- 도감의 큰 creature memory photo / memory variant / clue focus surface
- 모바일 visual regression 보강
- Browser Use `iab` production evidence 재수집

## 비범위

- 새 asset generation
- manifest 등록
- economy/schema migration
- v2 campaign ledger를 authority로 merge
- harness runner 구현

## 수용 기준

- [ ] production diff가 v3 GitHub issue/PR 범위로 묶인다.
- [ ] 첫 화면에서 대표 생명체가 기존 카드 UI보다 우선 읽힌다.
- [ ] 돌보기 후 pose/FX/clue state가 screenshot에서 확인된다.
- [ ] 도감에서 수집 캐릭터를 큰 비주얼로 감상할 수 있다.
- [ ] Browser Use `iab` evidence가 현재 세션 기준으로 갱신된다.
- [ ] focused visual regression과 `npm run check:ci`가 통과한다.

## 검증

- Browser Use `iab` visual/playtest
- `npm run check:visual`
- `npm run check:ci`

## 연결 evidence

- `reports/operations/local-studio-work-recovery-20260503.md`
- `reports/visual/creature-stage-production-*.png`
- `reports/visual/care-clue-production-*.png`
- `reports/visual/album-appreciation-production-*.png`

