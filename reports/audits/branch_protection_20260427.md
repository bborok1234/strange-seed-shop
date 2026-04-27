# Branch Protection Audit - 2026-04-27

Status: warn

## 범위

GitHub `main` branch의 Branch protection 상태를 조회해, `ENABLE_AGENT_AUTOMERGE` 활성화 전제 조건이 충족되어 있는지 확인했다.

## 조회 결과

명령:

```bash
gh api repos/bborok1234/strange-seed-shop/branches/main --jq '{name: .name, protected: .protected, protection_url: .protection_url}'
```

결과:

```json
{
  "name": "main",
  "protected": false,
  "protection_url": "https://api.github.com/repos/bborok1234/strange-seed-shop/branches/main/protection"
}
```

보호 설정 endpoint 조회:

```bash
gh api repos/bborok1234/strange-seed-shop/branches/main/protection --silent
```

결과:

```text
HTTP 403: Upgrade to GitHub Pro or make this repository public to enable this feature.
```

## 판단

- `main`은 현재 `protected: false`다.
- required checks는 GitHub Branch protection으로 강제되지 않는다.
- private repository에서 Branch protection 기능 접근이 현재 제한되어 있다.
- `ENABLE_AGENT_AUTOMERGE`를 켜면 Branch protection 없이 auto-merge 요청이 즉시 병합에 가까운 동작을 할 수 있다.

## required checks 목표

`ENABLE_AGENT_AUTOMERGE`를 켜기 전 아래 required checks가 강제되어야 한다.

- `Verify game baseline`
- `Check automerge eligibility`

## 다음 조치

- GitHub 플랜 또는 repository 공개 여부를 결정한다.
- Branch protection을 사용할 수 있게 된 뒤 `main`에 required checks를 설정한다.
- 설정 후 이 audit report를 `pass`로 갱신한다.
- 그 전까지 `ENABLE_AGENT_AUTOMERGE`는 꺼진 상태를 유지한다.
