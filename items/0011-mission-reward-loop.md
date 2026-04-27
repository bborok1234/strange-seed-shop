# Mission reward loop

Status: verified

## 목적

이미 정의된 `missions.json`을 실제 첫 플레이 루프에 연결해, 유저가 첫 행동마다 보상 버튼을 볼 수 있게 한다.

## 범위

- `src/App.tsx`
- `src/types/game.ts`
- `src/lib/persistence.ts`
- `src/lib/content.ts`
- `src/styles.css`
- `scripts/check-game-loop.mjs`

## 완료 조건

- 첫 씨앗 심기, 첫 생명체 수확, 도감 보상 수령, 원정 시작이 미션 진행도를 올린다.
- 완료된 미션은 보상 버튼으로 잎을 지급하고 중복 수령을 막는다.
- 기존 저장 데이터는 `normalizeSave`로 미션 필드를 보완한다.
- 개발 전용 `qaReset=1` 파라미터로 Browser Use 검증을 깨끗한 저장 상태에서 시작할 수 있다.
- `npm run check:loop`와 `npm run check:all`이 통과한다.

## 검증

- `npm run check:loop`
- `npm run check:all`
- Browser Use `iab` backend로 `qaReset=1` 접속 후 첫 씨앗 심기 미션 보상 UI 확인

## 비고

씨앗 구매 미션은 씨앗 상점 구매 루프가 생길 때 연결한다.
