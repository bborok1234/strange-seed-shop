# GTM mock lane

이 폴더는 에이전트 네이티브 운영사가 실제 외부 채널을 사용하기 전에 GTM 초안을 proposal로만 남기는 안전한 lane이다. 현재 단계의 산출물은 devlog, release note, community post, landing copy 같은 **mock proposal**이며, 실제 게시/발송/광고/스토어 수정은 하지 않는다.

## 허용 행동

- 변경된 게임 기능을 바탕으로 devlog draft 작성
- release note proposal 작성
- community post proposal 작성
- playtest report나 PR을 근거로 메시지 초안 작성
- approval checklist 작성
- human review가 필요한 위험 표시

## 금지 행동

- 실제 SNS, 커뮤니티, 이메일, 광고, 앱/웹 스토어, 랜딩 페이지에 게시하거나 수정하기
- 댓글, DM, 이메일 자동 발송
- 광고비 집행 또는 캠페인 생성
- credential, API key, session token 사용
- 고객 개인정보/비공개 피드백 원문 커밋
- 결제, 로그인/account, ads SDK, runtime image generation 추가

## Approval gate

실채널 action은 아래 조건을 모두 만족하기 전까지 금지한다.

1. 관련 `items/*.md`가 `gtm_mock` 또는 `feedback` work type으로 존재한다.
2. `reports/gtm/*.md` proposal이 있고, 실제 게시 대상/문구/리스크가 분리되어 있다.
3. 개인정보/credential/브랜드 리스크 검토가 완료되어 있다.
4. 사람이 “이 채널에 이 문구로 게시/발송해도 된다”고 명시 승인했다.
5. 게시 후 증거와 rollback/수정 계획을 남길 위치가 정해져 있다.

## Mock proposal 필수 필드

- `Status: mock-proposal`
- `Source evidence`
- `Audience`
- `Draft type`
- `Draft copy`
- `Do-not-publish boundary`
- `Approval needed`
- `Risk notes`
- `Recommended next item`
