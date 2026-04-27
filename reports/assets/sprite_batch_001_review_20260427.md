# sprite_batch_001 asset review — 2026-04-27

## 결론

6개 starter sprite/fx strip을 `accepted`로 등록한다. 모든 파일은 workspace에 저장된 정적 PNG이며 runtime image generation을 사용하지 않는다.

## 검수 대상

| asset id | frames | size | frame rate | repeat | 판정 |
| --- | ---: | --- | ---: | ---: | --- |
| `seed_herb_001_idle_strip` | 4 | 384x96 | 6 | -1 | accepted |
| `seed_herb_001_tap_strip` | 4 | 384x96 | 12 | 0 | accepted |
| `sprout_herb_001_grow_strip` | 6 | 576x96 | 8 | -1 | accepted |
| `creature_herb_common_ready_strip` | 4 | 384x96 | 6 | -1 | accepted |
| `fx_harvest_sparkle_strip` | 6 | 576x96 | 12 | 0 | accepted |
| `fx_leaf_reward_pop_strip` | 5 | 480x96 | 12 | 0 | accepted |

## Animation-specific checks

- 파일 존재, snake_case id, manifest path 일치: 통과
- no text/watermark/logo: 통과
- Herb/greenhouse family visual consistency: 통과
- 동일 frame cell 크기와 strict slicing: 통과
- 프레임 anchor/scale 안정성: starter/fx spike 용도로 통과
- idle/grow/ready loop 튐 위험: 낮음. grow strip은 단계 progression이 있어 loop 시 마지막→첫 프레임 점프가 보이지만 첫 batch 검증 목적상 허용한다.
- tap/harvest/reward one-shot readability: 통과
- 96px silhouette readability: 통과
- runtime-generation separation: `runtime_generation_allowed=false`, 앱 runtime은 manifest와 workspace PNG만 load한다.

## Blocker / follow-up

Codex native image generation 결과를 이 실행 환경에서 파일로 직접 저장하는 경로가 확인되지 않았다. 이번 batch는 Phaser slicing contract 검증을 우선해 deterministic static PNG strip으로 고정했다. 후속 item에서는 생성형 산출물을 normalization/check script에 넣는 production asset path를 확정한다.
