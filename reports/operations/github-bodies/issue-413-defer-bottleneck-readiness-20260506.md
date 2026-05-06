현재 열린 WorkUnit #413은 `방패새싹 모모` work idle sprite strip 작업이며, 캐릭터 animation 품질을 올리는 좋은 후속 작업입니다.

다만 2026-05-06에 `docs/PRODUCTION_SLICE_READINESS.md`가 다음 core gameplay PR의 blocking gate를 `Bottleneck-readable production graph`로 고정했습니다. 이 gate는 `생산 / 보관 / 납품` 3축, 첫 병목 `보관 부족`, 추천 upgrade, 수치+화면 prop 변화, scripted QA+screenshot evidence를 요구합니다.

따라서 #413은 버리는 작업이 아니라 현재 blocking core slice 뒤로 미룹니다. runner가 계속 #413을 우선 선택하면 새 readiness gate를 우회하게 되므로, 이 이슈는 `not planned`로 닫고 새 production graph WorkUnit에서 우선 구현을 진행합니다.

후속 재개 조건:

- `Bottleneck-readable production graph` PR이 merge-ready 기준을 통과한 뒤
- 모모 sprite strip이 `actor/prop/FX` payoff를 보강하는 다음 vertical slice로 다시 열릴 때
- Browser Use 또는 fallback visual evidence를 새 WorkUnit에 다시 연결할 때
