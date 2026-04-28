# Asset export and strip normalization path

Status: in_progress
Owner: agent
Created: 2026-04-28
Updated: 2026-04-28
Scope-risk: narrow
Work type: game_content
Issue: #22
PR: #41

## Intent

다음 production sprite batch에서 Codex native image generation 산출물을 workspace raw file로 보존하고, 96x96 frame grid strip으로 정규화한 뒤 manifest/checker까지 재현 가능하게 연결한다. 이번 작업은 실제 새 이미지를 생성하지 않고, 경로·provenance·검증 gate를 확정한다.

## Acceptance Criteria

- `reports/assets/asset_export_normalization_20260428.md`가 export -> normalization -> manifest -> checker 절차를 설명한다.
- `assets/source/sprite_normalization_provenance.example.json`가 raw output, selected output, frame sources, normalized strip, manifest id를 추적하는 template을 제공한다.
- `scripts/check-asset-normalization.mjs`와 `npm run check:asset-normalization`이 runbook/template/current strip slicing을 검증한다.
- `npm run check:all`이 asset normalization 검증을 포함해 통과한다.
- runtime image generation은 계속 금지된다.

## Evidence

- Issue #22: https://github.com/bborok1234/strange-seed-shop/issues/22
- PR #41: https://github.com/bborok1234/strange-seed-shop/pull/41
- `npm run check:asset-normalization` PASS — runbook/template/current 6 sprite strips verified
- `npm run check:all` PASS — asset normalization gate included in full baseline

## Proposed Plan

1. Codex native output을 workspace raw file로 저장하는 golden path를 문서화한다.
2. 96x96 frame grid normalization checklist와 strict slicing formula를 문서화한다.
3. provenance template과 checker를 추가한다.
4. `check:all`, roadmap, dashboard에 gate를 연결한다.

## Apply Conditions

- 실제 이미지 생성/재생성은 수행하지 않는다.
- runtime image generation, custom SDK image runner, external cache runtime fetch를 추가하지 않는다.
- 기존 accepted asset 파일은 변경하지 않는다.

## Verification

- `npm run check:asset-normalization`
- `npm run check:all`
