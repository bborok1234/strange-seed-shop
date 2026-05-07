# Issue #436 Browser Use Smoke

## Scope

기존 React playable을 root에서 `apps/legacy-react-playable/`로 이동하고, 신규 Phaser app을 `apps/seed-garden-phaser/`로 만든 뒤 in-app Browser Use `iab`로 두 lane의 dev server를 확인했다.

## Legacy React Playable

- Command: `npm run dev:legacy -- --host 127.0.0.1 --port 4173`
- URL: `http://127.0.0.1:4173/?qaReset=1`
- Browser Use session: `🔎 legacy boundary smoke`
- Result: page title `이상한 씨앗상회`, `말랑잎 씨앗 무료로 심기` button count `1`
- Screenshot: `reports/visual/issue-0436-boundary-split/browser-use-legacy-smoke-20260507.png`

## Phaser Scaffold

- Command: `npm run dev:phaser -- --host 127.0.0.1 --port 4175`
- URL: `http://127.0.0.1:4175/`
- Browser Use session: `🔎 phaser boundary smoke`
- Result: page title `이상한 씨앗상회 Phaser Garden`, canvas count `1`
- Screenshot: `reports/visual/issue-0436-boundary-split/browser-use-phaser-scaffold-20260507.png`

## Notes

`tab.dev.logs()` still returned older retained `http://127.0.0.1:4173` Phaser asset loader errors from the previous legacy page session. The current Phaser scaffold rendered a canvas successfully in the in-app browser.
