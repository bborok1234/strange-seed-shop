# Legacy React Playable

이 앱은 기존 React/Vite 기반 `이상한 씨앗상회` playable이다. 신규 Phaser greenfield의 active source가 아니라, 사람이 계속 확인할 수 있는 legacy/reference baseline이다.

## 역할

- 기존 P0/P0.5 idle collection loop 보존
- 기존 Playwright visual regression과 사람 플레이 모드 유지
- 신규 Phaser 작업이 비교할 수 있는 reference playable 제공

## 실행

```bash
npm run dev:legacy
npm run build:legacy
npm run check:legacy
```

root `npm run dev`와 `npm run preview`는 호환성을 위해 이 legacy app을 가리킨다. 신규 gameplay 구현은 `apps/seed-garden-phaser/`에서 시작한다.
