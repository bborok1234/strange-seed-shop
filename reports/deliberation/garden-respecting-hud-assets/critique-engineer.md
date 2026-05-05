# Engineer Critique — garden-respecting-hud-assets

## My disagreements with each other proposal

### Designer Proposal에 대한 이견

Designer의 핵심 방향인 “HUD를 기능 축소가 아니라 정원 사물로 읽히게 한다”에는 동의한다. 다만 `다음 행동`을 첫 세션과 복귀 세션에서 정원 표지판 asset으로 격상하자는 제안은 구현 위치가 명확하지 않으면 Cycle A가 줄인 큰 surface를 되살릴 위험이 있다. 특히 `side-dock-next-action`을 키우거나 plot 주변에 새 prompt ribbon을 추가하는 안은 desktop dock-expanded 상태에서 plot card와 dev/player panel overlap을 다시 만들 수 있으므로, spec은 footprint 상한과 anchor 규칙을 먼저 정해야 한다.

Designer가 제안한 `구매하고 심기` 같은 verb 단축은 UX상 맞지만, 본 axis의 기본 범위가 mechanic/economy 변경이 아니라 HUD asset vocabulary라는 점에서는 위험하다. 현재 flow를 단축하려면 seed 구매, inventory, planting action의 상태 전이를 함께 건드릴 수 있고, 이는 `PlayerSave` 자체를 바꾸지 않더라도 action handler와 validation surface를 넓힌다. Phase 4 spec에서는 이 문구를 “기존 action을 더 잘 노출한다”로 제한하고, 실제 복합 action 신설은 별도 work item으로 분리해야 한다.

Plot marker/frame을 1순위로 둔 점은 맞지만, React overlay에 먼저 적용할지 Phaser canvas로 넘길지 결정하지 않은 채 asset을 생성하면 후속 PR에서 폐기 비용이 생긴다. 이번 cycle은 `GardenPlayfieldHost.tsx`의 DOM button 접근성과 click target을 유지하는 skinning으로 제한해야 하며, `GardenScene.ts` in-canvas diegetic UI는 별도 axis에서 다루는 조건이 필요하다.

### Art Director Proposal에 대한 이견

Art Director의 text-free transparent PNG vocabulary와 alpha contour 방향에는 동의한다. 하지만 `ui_decal` category를 새로 허용하는 선택지는 첫 cycle에서는 반대한다. 현재 `AssetCategory`에는 `ui_frame`이 있고 manifest에는 이미 `category: "ui"`인 기존 항목이 남아 있어, 새 category를 추가하면 visual spec이 아니라 asset typing/checker 정리 PR로 범위가 번진다.

첫 batch 후보 6개는 대체로 구현 가능하지만, `ui_hud_leaf_tab_marker_001`은 우선순위에서 내려야 한다. rail/tab은 플레이어 verb와 직접 연결되지 않고, 이번 brief의 known issue는 plot card cream rectangle, dock card contrast, onboarding entry 약화다. PR1 최소 세트는 plot seedbed frame, ready ribbon, next-action sign/ribbon, resource plaque 또는 chip 4개로 줄이고, vine divider와 tab marker는 asset 품질과 layout evidence가 나온 뒤 추가하는 편이 review 비용이 낮다.

Motion vocabulary의 `settle`, `nudge`, `bloom`, `drift`는 좋은 언어지만 구현 spec에는 더 강한 제한이 필요하다. 새 HUD PNG가 CSS animation으로 계속 drift하거나 ready state마다 nudge하면 React overlay와 Phaser feedback, existing reward FX가 동시에 움직이는 상태가 된다. 첫 cycle에서는 `nudge`를 next-action 또는 ready plot 중 하나로만 제한하고, 새 sprite/FX strip은 만들지 않는 조건을 명시해야 한다.

Art Director가 제안한 viewport token과 grid token은 장기적으로 맞지만, Phase 4 spec에 token 신설을 너무 많이 넣으면 `src/styles.css`의 7천 줄대 responsive block에 산발적으로 값이 늘어날 가능성이 높다. 이번 cycle은 기존 token을 재사용하고, 새 token은 `--hud-*` 중 실제 asset text inset과 elevation에 필요한 최소 3~5개로 제한해야 한다.

## Self-critique of my own proposal

내 제안의 약점은 PR을 너무 보수적으로 쪼개면서 플레이어가 체감하는 “정원물 HUD” payoff를 늦출 수 있다는 점이다. PR1이 asset 생성/등록만 하고 UI 적용이 없으면, 사용자의 핵심 불만인 cream rectangle은 그 PR에서 전혀 줄지 않는다. 따라서 Director가 속도와 체감 payoff를 우선하면 PR1과 PR2를 하나의 vertical slice PR로 묶는 선택도 가능하다.

다만 그 경우에도 범위는 `next-action sign + resource plaque` 또는 `plot seedbed frame + ready ribbon` 중 하나의 화면 순간으로 닫아야 한다. asset 6~8개 전체 생성과 side dock, plot, feedback, rail 적용을 한 PR에 묶는 안은 여전히 반대한다. 내 제안은 rollback과 원인 분리를 우선한 것이므로, “첫 스크린샷 payoff”를 더 앞당기는 압축안을 Director가 명시적으로 선택할 수 있게 보완되어야 한다.

또 하나의 약점은 asset 크기 예산을 제안했지만, 실제 PNG 해상도와 alpha padding 규칙을 Art Director가 결정하기 전에는 150KB/개, 총 900KB 예산이 가정값이라는 점이다. 이 수치는 blocker가 아니라 초기 budget으로 두고, 생성 결과가 작게 읽히지 않으면 512px 계열에서 한 번 재검토해야 한다.

## Cross-cutting risks

1. **asset-first와 layout-first의 순서 충돌**: Designer와 Art Director는 plot marker를 가장 큰 payoff로 본다. 그러나 plot card는 `GardenPlayfieldHost.tsx`의 button, aria, disabled state, progress text, desktop dock-expanded hotfix와 직접 맞물린다. 다음 행동/resource dock skin보다 회귀 표면이 넓으므로, plot marker를 먼저 할 경우 Browser Use screenshot과 geometry gate가 필수다.

2. **category 확장이 품질 검증과 섞일 위험**: Art Director의 `ui_decal` 제안은 장기 언어로는 타당하지만, 이번 axis에서 새 category를 열면 `src/types/game.ts`, manifest convention, asset checker를 같이 손봐야 한다. HUD vocabulary 결정과 checker migration을 같은 PR에 넣으면 실패 원인이 asset 품질인지 schema 변경인지 분리되지 않는다.

3. **“다음 행동 강화”가 새 mechanic으로 번질 위험**: Designer의 verb 단축 요구는 첫 30초 clarity를 살리지만, action 자체를 통합하면 UI asset cycle이 gameplay flow 변경으로 커진다. Phase 4 spec은 새 CTA 문구와 visual prominence까지만 결정하고, 복합 action 신설은 out-of-scope로 남겨야 한다.

4. **motion budget 과다 사용 위험**: Designer는 ready/harvest clarity를 원하고 Art Director는 nudge/bloom/drift vocabulary를 제안한다. 둘을 모두 받아들이면 dock, plot, feedback, reward FX가 동시에 attention을 요구할 수 있다. 첫 implementation은 정적 PNG + 기존 CSS/FX 재사용으로 제한하고, 새 motion binding은 하나만 선택해야 한다.

5. **검증 명령 이름과 증거 수준의 혼선**: brief에는 alpha 품질 계열 검증을 언급하고 실제 `package.json`에는 `check:asset-alpha`가 존재한다. spec은 정확한 명령을 `npm run check:asset-alpha`로 고정해야 한다. 또한 DOM에 asset layer가 있다는 assertion만으로는 부족하고, desktop art-share, dock-expanded overlap, mobile bottom-tab overlap, screenshot상 garden object readability를 함께 증거로 남겨야 한다.

6. **cream rectangle 제거가 가독성 손실로 바뀔 위험**: 세 제안 모두 opaque cream surface를 줄이는 데 동의한다. 하지만 transparent PNG contour가 텍스트 inset을 침범하거나 contrast를 낮추면 첫 세션 clarity가 악화된다. asset은 text-free여야 하고, DOM text 영역은 stable padding token과 fallback background를 가져야 한다.

7. **Cycle B in-canvas UI와의 중복 위험**: Designer와 Art Director 모두 plot marker를 diegetic object로 보고, Engineer 제안은 DOM overlay skinning을 선호한다. 이 둘은 충돌하지 않게 naming과 asset slot을 잡아야 한다. 이번 spec은 “DOM overlay에 먼저 적용하되, asset id와 state vocabulary는 후속 in-canvas 전환에서도 재사용 가능해야 한다”는 경계가 필요하다.

## Engineer conclusion

이 axis는 **조건부로 구현 가능**하다. 조건은 첫 cycle에서 save schema와 Phaser scene을 건드리지 않고, `ui_frame` 중심의 manifest asset slot으로 시작하며, 새 motion과 새 category를 defer하는 것이다. Director synthesis에서는 `plot-first`와 `dock-next-action-first` 중 하나를 첫 vertical slice로 선택해야 하고, 선택한 slice는 Browser Use screenshot evidence와 `npm run check:asset-provenance`, `npm run check:asset-style`, `npm run check:asset-normalization`, `npm run check:asset-alpha`, `npm run check:art-share`, `npm run check:p0-ui-ux`, `npm run build`로 검증해야 한다.
