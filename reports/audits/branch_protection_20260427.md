# Branch Protection Audit - 2026-04-27 / 2026-04-28

Status: pass

## 범위

GitHub `main` branch의 Branch protection 상태를 조회해, `ENABLE_AGENT_AUTOMERGE` 활성화 전제 조건 중 required checks 강제가 충족되어 있는지 확인했다.

## 2026-04-27 이전 조회 결과

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

## 2026-04-28 조치

사용자 승인 후 repository visibility를 `PRIVATE`에서 `PUBLIC`으로 변경했다.

사전 secret 빠른 스캔:

```bash
git ls-files | rg -i '(^|/)(\.env|env\.|.*secret.*|.*credential.*|.*token.*|id_rsa|id_ed25519|\.pem|\.p12|\.key|service-account|google-credentials|firebase|supabase|stripe|openai|anthropic|gemini)'
git grep -n -I -E '(gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|BEGIN (RSA |OPENSSH |EC |DSA |PRIVATE )?PRIVATE KEY|STRIPE_(SECRET|LIVE)|SUPABASE_(SERVICE_ROLE|JWT)|ANTHROPIC_API_KEY|OPENAI_API_KEY|GEMINI_API_KEY|GOOGLE_APPLICATION_CREDENTIALS)' -- . ':!package-lock.json' ':!pnpm-lock.yaml'
```

결과: tracked 파일과 고신호 history 패턴에서 명백한 credential/token 없음.

Visibility 확인:

```json
{"isPrivate":false,"nameWithOwner":"bborok1234/strange-seed-shop","visibility":"PUBLIC"}
```

Secret scanning 상태:

```json
{
  "secret_scanning": {"status":"enabled"},
  "secret_scanning_push_protection": {"status":"enabled"}
}
```

## 2026-04-28 Branch protection 설정

요청:

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Verify game baseline",
      "Check automerge eligibility"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

검증 결과:

```json
{
  "name": "main",
  "protected": true,
  "protection_url": "https://api.github.com/repos/bborok1234/strange-seed-shop/branches/main/protection"
}
```

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Verify game baseline",
      "Check automerge eligibility"
    ]
  },
  "enforce_admins": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_pull_request_reviews": null
}
```

## required checks

`main`은 아래 required checks를 강제한다.

- `Verify game baseline`
- `Check automerge eligibility`

## 판단

- `main`은 현재 `protected: true`다.
- required checks는 GitHub Branch protection으로 강제된다.
- stale branch는 strict status checks 때문에 최신 base로 검증되어야 한다.
- force push와 branch deletion은 허용되지 않는다.
- Secret scanning과 push protection은 enabled 상태다.

## 남은 운영 조건

Branch protection 전제 조건은 충족되었지만, 자동 머지 활성화는 별도 단계다.

- `ENABLE_AGENT_AUTOMERGE` 저장소 변수 설정 여부는 별도로 결정한다.
- 자동 머지 후보 PR은 여전히 non-draft, `agent-automerge` label, allowed branch prefix, green checks를 만족해야 한다.
- 실제 결제, credential, production user data, external deployment 변경은 자동 머지 후보에서 제외한다.
