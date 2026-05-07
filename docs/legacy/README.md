# Legacy / Reference Lane

이 디렉터리는 기존 React playable과 P0/P0.5 rescue 문서를 reference로 분류한다. 신규 Phaser greenfield의 active spec이 아니다.

## Code

- `apps/legacy-react-playable/`: 기존 React/Vite playable
- `npm run dev:legacy`: legacy app 개발 서버
- `npm run build:legacy`: legacy app build
- `npm run check:legacy`: legacy content/loop/economy/build gate

## Reference Docs

아래 문서는 기존 playable의 경험과 실패/개선 기록으로 유지한다. Phaser WorkUnit이 이 문서를 참고할 수는 있지만, `docs/phaser/*`에서 명시적으로 import하지 않는 한 active spec으로 취급하지 않는다.

- `docs/DESIGN.md`
- `docs/ART_HUD_PRODUCTION_SPEC.md`
- `docs/IDLE_CORE_PRODUCTION_SPEC.md`
- `docs/IDLE_CORE_CREATIVE_GUIDE.md`
- `docs/GAME_UI_UX_RESEARCH_20260428.md`
- 기존 `reports/visual/*`

## Rule

신규 gameplay 구현은 root `src/` 또는 legacy 문서만 읽고 시작하면 안 된다. `apps/seed-garden-phaser/`와 `docs/phaser/*`를 active source로 확인해야 한다.
