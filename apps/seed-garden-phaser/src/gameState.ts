export type SlotKind = "plot" | "facility" | "decor";
export type UnlockState = "unlocked" | "preview" | "locked";
export type PlotState = "empty" | "planted" | "growing" | "ready";
export type FacilityKind = "workbench" | "order_crate" | "storage" | "research_shelf" | "expedition_gate";
export type ActorRole = "caretaker" | "carrier";
export type ExpeditionState = "locked" | "ready" | "traveling" | "returned" | "claimed";

export const THIRD_PLOT_UNLOCK_COST = 60;
export const STORAGE_BASKET_UNLOCK_COST = 80;
export const LUNAR_SOURCE_SEED_ID = "seed_lunar_002";
export const NEXT_EXPEDITION_ROUTE_PREVIEW_ID = "expedition_moon_fence_locked";

export interface BoardSlot {
  id: string;
  kind: SlotKind;
  label: string;
  x: number;
  y: number;
  depth: number;
  scale: number;
  unlockState: UnlockState;
  allowedEntityKinds: string[];
}

export interface PlotEntity {
  id: string;
  slotId: string;
  state: PlotState;
  seedId?: string;
  growth: number;
  careCount: number;
}

export interface FacilityEntity {
  id: string;
  slotId: string;
  kind: FacilityKind;
  level: number;
  visualState: "active" | "preview" | "locked";
  progress: number;
}

export interface ActorEntity {
  id: string;
  name: string;
  role: ActorRole;
  slotId: string;
  targetSlotId: string;
  task: "care_plot" | "carry_leaves" | "expedition" | "idle";
}

export interface GardenState {
  selectedSlotId: string;
  resources: {
    leaves: number;
    starterSeeds: number;
  };
  objective: string;
  slots: BoardSlot[];
  plots: PlotEntity[];
  facilities: FacilityEntity[];
  actors: ActorEntity[];
  receipts: string[];
  completedDeliveries: number;
  storageCapacity: number;
  storedLeaves: number;
  researchShelfPreviewSeen: boolean;
  researchClueSeedAvailable: boolean;
  researchClueSeedPlanted: boolean;
  researchClueHarvested: boolean;
  researchClueRecordReady: boolean;
  researchClueAlbumRecorded: boolean;
  researchClueGoalSurfaceVisible: boolean;
  researchNextGoalSeedAvailable: boolean;
  researchNextGoalSeedClaimed: boolean;
  researchNextGoalSeedPlanted: boolean;
  researchNextGoalSeedHarvested: boolean;
  researchNextGoalRevealReady: boolean;
  researchLunarFamilyRevealed: boolean;
  expeditionGatePreviewVisible: boolean;
  expeditionState: ExpeditionState;
  activeExpeditionRouteId?: string;
  expeditionRewardLeaves: number;
  expeditionSourceClueAvailable: boolean;
  expeditionSourcePreviewVisible: boolean;
  nextExpeditionRoutePreviewId?: string;
  lunarSourceSeedId?: string;
  lunarSourceSeedAvailable: boolean;
  lunarSourceSeedPlanted: boolean;
  lunarSourceSeedHarvested: boolean;
}

export const boardSlots: BoardSlot[] = [
  {
    id: "plot_01",
    kind: "plot",
    label: "1번 햇살 밭",
    x: 132,
    y: 344,
    depth: 20,
    scale: 1,
    unlockState: "unlocked",
    allowedEntityKinds: ["plot"]
  },
  {
    id: "plot_02",
    kind: "plot",
    label: "2번 빈 밭",
    x: 262,
    y: 396,
    depth: 22,
    scale: 0.96,
    unlockState: "unlocked",
    allowedEntityKinds: ["plot"]
  },
  {
    id: "plot_03",
    kind: "plot",
    label: "3번 확장 자리",
    x: 204,
    y: 546,
    depth: 28,
    scale: 0.92,
    unlockState: "preview",
    allowedEntityKinds: ["plot"]
  },
  {
    id: "facility_workbench",
    kind: "facility",
    label: "상회 작업대",
    x: 112,
    y: 612,
    depth: 35,
    scale: 1,
    unlockState: "unlocked",
    allowedEntityKinds: ["facility"]
  },
  {
    id: "facility_order_crate",
    kind: "facility",
    label: "주문 상자",
    x: 284,
    y: 606,
    depth: 36,
    scale: 0.94,
    unlockState: "preview",
    allowedEntityKinds: ["facility"]
  },
  {
    id: "facility_storage",
    kind: "facility",
    label: "보관 바구니",
    x: 304,
    y: 502,
    depth: 27,
    scale: 0.86,
    unlockState: "locked",
    allowedEntityKinds: ["facility"]
  },
  {
    id: "facility_research_shelf",
    kind: "facility",
    label: "연구 선반",
    x: 80,
    y: 500,
    depth: 26,
    scale: 0.78,
    unlockState: "locked",
    allowedEntityKinds: ["facility"]
  },
  {
    id: "facility_expedition_gate",
    kind: "facility",
    label: "원정 문",
    x: 334,
    y: 388,
    depth: 25,
    scale: 0.72,
    unlockState: "locked",
    allowedEntityKinds: ["facility"]
  }
];

export function createGardenState(): GardenState {
  return {
    selectedSlotId: "plot_01",
    resources: {
      leaves: 0,
      starterSeeds: 1
    },
    objective: "빈 밭에 무료 말랑잎 씨앗을 심기",
    slots: boardSlots,
    plots: [
      {
        id: "plot_entity_01",
        slotId: "plot_01",
        state: "empty",
        growth: 0,
        careCount: 0
      },
      {
        id: "plot_entity_02",
        slotId: "plot_02",
        state: "empty",
        growth: 0,
        careCount: 0
      }
    ],
    facilities: [
      {
        id: "facility_workbench_entity",
        slotId: "facility_workbench",
        kind: "workbench",
        level: 1,
        visualState: "active",
        progress: 0
      },
      {
        id: "facility_order_crate_entity",
        slotId: "facility_order_crate",
        kind: "order_crate",
        level: 0,
        visualState: "preview",
        progress: 0
      },
      {
        id: "facility_storage_entity",
        slotId: "facility_storage",
        kind: "storage",
        level: 0,
        visualState: "locked",
        progress: 0
      },
      {
        id: "facility_research_shelf_entity",
        slotId: "facility_research_shelf",
        kind: "research_shelf",
        level: 0,
        visualState: "locked",
        progress: 0
      },
      {
        id: "facility_expedition_gate_entity",
        slotId: "facility_expedition_gate",
        kind: "expedition_gate",
        level: 0,
        visualState: "locked",
        progress: 0
      }
    ],
    actors: [],
    receipts: [],
    completedDeliveries: 0,
    storageCapacity: 12,
    storedLeaves: 0,
    researchShelfPreviewSeen: false,
    researchClueSeedAvailable: false,
    researchClueSeedPlanted: false,
    researchClueHarvested: false,
    researchClueRecordReady: false,
    researchClueAlbumRecorded: false,
    researchClueGoalSurfaceVisible: false,
    researchNextGoalSeedAvailable: false,
    researchNextGoalSeedClaimed: false,
    researchNextGoalSeedPlanted: false,
    researchNextGoalSeedHarvested: false,
    researchNextGoalRevealReady: false,
    researchLunarFamilyRevealed: false,
    expeditionGatePreviewVisible: false,
    expeditionState: "locked",
    activeExpeditionRouteId: undefined,
    expeditionRewardLeaves: 0,
    expeditionSourceClueAvailable: false,
    expeditionSourcePreviewVisible: false,
    nextExpeditionRoutePreviewId: undefined,
    lunarSourceSeedId: undefined,
    lunarSourceSeedAvailable: false,
    lunarSourceSeedPlanted: false,
    lunarSourceSeedHarvested: false
  };
}

export function getSlot(state: GardenState, slotId: string): BoardSlot {
  const slot = state.slots.find((candidate) => candidate.id === slotId);
  if (!slot) {
    throw new Error(`Unknown board slot: ${slotId}`);
  }
  return slot;
}

export function getPlotBySlot(state: GardenState, slotId: string): PlotEntity | undefined {
  return state.plots.find((plot) => plot.slotId === slotId);
}

export function getFacilityBySlot(state: GardenState, slotId: string): FacilityEntity | undefined {
  return state.facilities.find((facility) => facility.slotId === slotId);
}

export function selectSlot(state: GardenState, slotId: string): void {
  const slot = getSlot(state, slotId);
  state.selectedSlotId = slot.id;
  const facility = getFacilityBySlot(state, slotId);
  if (facility?.kind === "storage") {
    if (slot.unlockState === "unlocked") {
      state.objective = `오프라인 보관 ${state.storedLeaves}/${state.storageCapacity}`;
    } else if (state.completedDeliveries >= 2) {
      state.objective =
        state.resources.leaves >= STORAGE_BASKET_UNLOCK_COST
          ? `${STORAGE_BASKET_UNLOCK_COST}잎으로 보관 바구니 정리하기`
          : `보관 바구니 정리까지 잎 ${STORAGE_BASKET_UNLOCK_COST - state.resources.leaves}개 부족`;
    } else {
      state.objective = "두 번째 주문 납품 후 보관 바구니 정리";
    }
    return;
  }
  if (facility?.kind === "order_crate") {
    if (facility.progress >= 100) {
      state.objective = "주문 상자를 납품해 첫 상회 보상을 받기";
    } else if (facility.progress > 0) {
      state.objective = `주문 상자 준비 ${facility.progress}% - 작업대 수령으로 채우기`;
    } else {
      state.objective = "작업대 생산을 모아 주문 상자를 채우기";
    }
    return;
  }
  if (facility?.kind === "research_shelf") {
    state.objective = state.researchLunarFamilyRevealed
      ? state.expeditionGatePreviewVisible
        ? "원정 문 preview 확인됨 · D7 원정 route 잠금"
        : "달빛 family reveal 완료 · 다음 연구 목표: 원정 문 단서"
      : slot.unlockState === "preview"
        ? "연구 선반 살펴보기 · 다음 씨앗 단서"
        : "오프라인 보상 회수 후 연구 선반 preview";
    return;
  }
  if (facility?.kind === "expedition_gate") {
    if (state.expeditionState === "ready") {
      state.objective = "원정 문 준비 · 뒷마당 틈새길 tutorial route";
    } else if (state.expeditionState === "traveling") {
      state.objective = "뒷마당 틈새길 원정 중 · 귀환 상자 대기";
    } else if (state.expeditionState === "returned") {
      state.objective = "귀환 상자 도착 · 보상 열기";
    } else if (state.expeditionState === "claimed") {
      state.objective = state.expeditionSourcePreviewVisible
        ? "초승달순 씨앗 source 발견 · 다음 route: 달빛 울타리 잠김"
        : "첫 원정 완료 · 초승달순 source 단서 확인";
    } else {
      state.objective =
        slot.unlockState === "preview"
          ? "원정 문 preview · D7 원정 route 잠금"
          : "달빛 family reveal 후 원정 문 단서";
    }
    return;
  }
  if (slot.id === "plot_03" && slot.unlockState !== "unlocked") {
    state.objective =
      state.resources.leaves >= THIRD_PLOT_UNLOCK_COST
        ? `${THIRD_PLOT_UNLOCK_COST}잎으로 3번 밭을 확장하기`
        : `3번 밭 확장까지 잎 ${THIRD_PLOT_UNLOCK_COST - state.resources.leaves}개 부족`;
    return;
  }
  if (slot.unlockState === "preview") {
    state.objective = `${slot.label}: 첫 수확 후 확장 목표`;
    return;
  }
  if (slot.unlockState === "locked") {
    state.objective = `${slot.label}: D1 보관 병목에서 해금`;
    return;
  }
  const plot = getPlotBySlot(state, slotId);
  if (plot?.state === "empty") {
    state.objective = state.lunarSourceSeedAvailable
      ? "초승달순 source 심기 · 첫 원정 보상 재배"
      : state.researchNextGoalSeedAvailable
        ? "달빛 새싹 목표 심기 · 다음 수집 루프 재개"
        : state.researchClueSeedAvailable
          ? "달빛 씨앗 단서 심기 · 다음 family clue 추적"
          : "말랑잎 씨앗을 심어 첫 생명체를 만나기";
  } else if (plot?.state === "planted" || plot?.state === "growing") {
    state.objective =
      plot.seedId === LUNAR_SOURCE_SEED_ID
        ? "초승달순 source 재배 중 · 다음 route 씨앗 성장"
        : plot.seedId === "seed_lunar_sprout_001"
        ? "달빛 새싹 돌보기 · 수확하면 다음 발견 준비"
        : "밭을 돌봐 성장률을 올리기";
  } else if (plot?.state === "ready") {
    state.objective =
      plot.seedId === "seed_lunar_sprout_001"
        ? "달빛 새싹 수확 · 다음 발견 reveal 준비"
        : "수확해서 말랑잎 포리를 정원 actor로 맞이하기";
  } else if (slot.id === "facility_workbench") {
    state.objective = state.actors.length > 0 ? "포리의 작업대 생산을 수령하기" : "첫 수확 후 포리가 작업대에서 일한다";
  }
}

export function plantStarterSeed(state: GardenState): void {
  const plot = getPlotBySlot(state, state.selectedSlotId);
  const slot = getSlot(state, state.selectedSlotId);
  if (!plot || slot.unlockState !== "unlocked" || plot.state !== "empty" || state.resources.starterSeeds <= 0) {
    return;
  }

  state.resources.starterSeeds -= 1;
  plot.seedId = "seed_malang_001";
  plot.state = "planted";
  plot.growth = 20;
  plot.careCount = 0;
  state.objective = "톡톡 돌보면 성장 시간이 줄어든다";
  state.receipts.unshift("말랑잎 씨앗을 심었다");
}

export function careSelectedPlot(state: GardenState): void {
  const plot = getPlotBySlot(state, state.selectedSlotId);
  if (!plot || (plot.state !== "planted" && plot.state !== "growing")) {
    return;
  }

  plot.careCount += 1;
  plot.growth = Math.min(100, plot.growth + 34);
  plot.state = plot.growth >= 100 ? "ready" : "growing";
  if (plot.seedId === "seed_lunar_sprout_001") {
    state.objective =
      plot.state === "ready" ? "달빛 새싹 수확 · 다음 발견 reveal 준비" : `달빛 새싹 성장 ${plot.growth}%`;
    state.receipts.unshift(plot.state === "ready" ? "달빛 새싹 수확 준비 완료" : `달빛 새싹 돌보기 +34%`);
    return;
  }
  state.objective = plot.state === "ready" ? "수확해서 첫 actor를 정원에 합류시키기" : `성장 ${plot.growth}% - 한 번 더 돌보기`;
  state.receipts.unshift(plot.state === "ready" ? "수확 준비 완료" : `돌보기 +34% (${plot.careCount}회)`);
}

export function harvestSelectedPlot(state: GardenState): void {
  const plot = getPlotBySlot(state, state.selectedSlotId);
  if (!plot || plot.state !== "ready") {
    return;
  }

  const slot = getSlot(state, state.selectedSlotId);
  const clueHarvest = plot.seedId === "seed_lunar_clue_001";
  const lunarSproutHarvest = plot.seedId === "seed_lunar_sprout_001";
  const firstPoriDiscovery = !state.actors.some((actor) => actor.id === "actor_pori");
  plot.state = "empty";
  plot.seedId = undefined;
  plot.growth = 0;
  plot.careCount = 0;
  state.resources.leaves += clueHarvest ? 18 : lunarSproutHarvest ? 22 : 12;
  if (clueHarvest) {
    state.researchClueHarvested = true;
    state.researchClueRecordReady = true;
    state.objective = "달빛 씨앗 family clue 발견 · 다음 WorkUnit에서 도감 단서로 연결";
    state.receipts.unshift("달빛 단서 수확 · 달빛 family clue +1 · 잎 +18");
    return;
  }
  if (lunarSproutHarvest) {
    state.researchNextGoalSeedHarvested = true;
    state.researchNextGoalRevealReady = true;
    state.objective = "달빛 새싹 발견 준비 · 다음 씨앗 family reveal 대기";
    state.receipts.unshift("달빛 새싹 수확 · 다음 발견 준비 · 잎 +22");
    return;
  }
  if (firstPoriDiscovery) {
    state.actors.push({
      id: "actor_pori",
      name: "말랑잎 포리",
      role: "caretaker",
      slotId: "plot_01",
      targetSlotId: "facility_workbench",
      task: "care_plot"
    });
  }
  state.objective = firstPoriDiscovery ? "포리가 작업대에서 잎 생산을 돕는다" : `${slot.label} 수확 완료 · 주문 반복 납품 준비`;
  state.receipts.unshift(firstPoriDiscovery ? "말랑잎 포리 합류 · 잎 +12" : `${slot.label} 수확 · 잎 +12`);
}

export function plantResearchClueSeed(state: GardenState): void {
  const plot = getPlotBySlot(state, state.selectedSlotId);
  const slot = getSlot(state, state.selectedSlotId);
  if (!plot || slot.unlockState !== "unlocked" || plot.state !== "empty" || !state.researchClueSeedAvailable) {
    return;
  }

  state.researchClueSeedAvailable = false;
  state.researchClueSeedPlanted = true;
  plot.seedId = "seed_lunar_clue_001";
  plot.state = "planted";
  plot.growth = 35;
  plot.careCount = 0;
  state.objective = "달빛 단서 씨앗 돌보기 · 수확하면 다음 family clue";
  state.receipts.unshift("달빛 단서 씨앗을 심었다");
}

export function claimResearchNextGoalSeed(state: GardenState): void {
  if (
    !state.researchClueGoalSurfaceVisible ||
    state.researchNextGoalSeedAvailable ||
    state.researchNextGoalSeedPlanted
  ) {
    return;
  }

  state.resources.starterSeeds += 1;
  state.researchNextGoalSeedAvailable = true;
  state.researchNextGoalSeedClaimed = true;
  state.objective = "달빛 새싹 씨앗 준비 · 빈 밭에 목표 심기";
  state.receipts.unshift("다음 목표 씨앗 수령 · 달빛 새싹 씨앗 +1");
}

export function plantResearchNextGoalSeed(state: GardenState): void {
  const plot = getPlotBySlot(state, state.selectedSlotId);
  const slot = getSlot(state, state.selectedSlotId);
  if (!plot || slot.unlockState !== "unlocked" || plot.state !== "empty" || !state.researchNextGoalSeedAvailable) {
    return;
  }

  state.resources.starterSeeds = Math.max(0, state.resources.starterSeeds - 1);
  state.researchNextGoalSeedAvailable = false;
  state.researchNextGoalSeedPlanted = true;
  state.researchClueGoalSurfaceVisible = false;
  plot.seedId = "seed_lunar_sprout_001";
  plot.state = "planted";
  plot.growth = 35;
  plot.careCount = 0;
  state.objective = "달빛 새싹 목표 재배 중 · 돌보기로 다음 발견 준비";
  state.receipts.unshift("달빛 새싹 목표 씨앗을 심었다");
}

export function plantLunarSourceSeed(state: GardenState): void {
  const plot = getPlotBySlot(state, state.selectedSlotId);
  const slot = getSlot(state, state.selectedSlotId);
  if (!plot || slot.unlockState !== "unlocked" || plot.state !== "empty" || !state.lunarSourceSeedAvailable) {
    return;
  }

  state.lunarSourceSeedAvailable = false;
  state.lunarSourceSeedPlanted = true;
  plot.seedId = LUNAR_SOURCE_SEED_ID;
  plot.state = "planted";
  plot.growth = 28;
  plot.careCount = 0;
  state.objective = "초승달순 source 재배 중 · 첫 rare route 씨앗";
  state.receipts.unshift("초승달순 씨앗을 심었다 · 첫 원정 source 소비");
}

export function recordResearchClueInAlbum(state: GardenState): void {
  if (!state.researchClueRecordReady || state.researchClueAlbumRecorded) {
    return;
  }

  state.researchClueRecordReady = false;
  state.researchClueAlbumRecorded = true;
  state.researchClueGoalSurfaceVisible = true;
  state.objective = "달빛 단서 기록됨 · 다음 씨앗 목표: 달빛 새싹";
  state.receipts.unshift("달빛 단서 도감 기록 · 다음 씨앗 목표 저장");
}

export function confirmLunarSproutDiscovery(state: GardenState): void {
  if (!state.researchNextGoalRevealReady || state.researchLunarFamilyRevealed) {
    return;
  }

  state.researchNextGoalRevealReady = false;
  state.researchLunarFamilyRevealed = true;
  state.selectedSlotId = "facility_research_shelf";
  state.objective = "달빛 family reveal 완료 · 다음 연구 목표: 원정 문 단서";
  state.receipts.unshift("달빛 새싹 발견 확인 · 달빛 family reveal");
}

export function previewExpeditionGateRoute(state: GardenState): void {
  if (!state.researchLunarFamilyRevealed || state.expeditionGatePreviewVisible) {
    return;
  }

  const expeditionSlot = getSlot(state, "facility_expedition_gate");
  const expeditionGate = getFacilityBySlot(state, "facility_expedition_gate");
  expeditionSlot.unlockState = "preview";
  if (expeditionGate) {
    expeditionGate.visualState = "preview";
  }
  state.expeditionGatePreviewVisible = true;
  state.expeditionState = "ready";
  state.selectedSlotId = "facility_expedition_gate";
  state.objective = "원정 문 preview 열림 · 첫 원정 route 준비";
  state.receipts.unshift("원정 문 단서 확인 · preview route 표시");
}

export function startBackyardGapExpedition(state: GardenState): void {
  if (!state.expeditionGatePreviewVisible || state.expeditionState !== "ready") {
    return;
  }

  const expeditionSlot = getSlot(state, "facility_expedition_gate");
  const expeditionGate = getFacilityBySlot(state, "facility_expedition_gate");
  expeditionSlot.unlockState = "unlocked";
  if (expeditionGate) {
    expeditionGate.level = 1;
    expeditionGate.visualState = "active";
    expeditionGate.progress = 50;
  }
  const expeditionActor = state.actors.find((actor) => actor.id === "actor_momo") ?? state.actors[0];
  if (expeditionActor) {
    expeditionActor.targetSlotId = "facility_expedition_gate";
    expeditionActor.task = "expedition";
  }
  state.selectedSlotId = "facility_expedition_gate";
  state.activeExpeditionRouteId = "expedition_backyard_gap";
  state.expeditionRewardLeaves = 35;
  state.expeditionState = "traveling";
  state.objective = "뒷마당 틈새길 원정 중 · 귀환 상자 준비";
  state.receipts.unshift("뒷마당 틈새길 출발 · actor 1명 원정 중");
}

export function markBackyardGapExpeditionReturned(state: GardenState): void {
  if (state.activeExpeditionRouteId !== "expedition_backyard_gap" || state.expeditionState !== "traveling") {
    return;
  }

  const expeditionGate = getFacilityBySlot(state, "facility_expedition_gate");
  if (expeditionGate) {
    expeditionGate.progress = 100;
    expeditionGate.visualState = "active";
  }
  state.selectedSlotId = "facility_expedition_gate";
  state.expeditionState = "returned";
  state.objective = "귀환 상자 도착 · 보상 열기";
  state.receipts.unshift("뒷마당 틈새길 귀환 · 상자 대기");
}

export function claimBackyardGapExpeditionReward(state: GardenState): void {
  if (state.activeExpeditionRouteId !== "expedition_backyard_gap" || state.expeditionState !== "returned") {
    return;
  }

  const rewardLeaves = state.expeditionRewardLeaves;
  const expeditionGate = getFacilityBySlot(state, "facility_expedition_gate");
  if (expeditionGate) {
    expeditionGate.progress = 0;
    expeditionGate.visualState = "active";
  }
  const expeditionActor = state.actors.find((actor) => actor.task === "expedition");
  if (expeditionActor) {
    expeditionActor.targetSlotId = "facility_order_crate";
    expeditionActor.task = expeditionActor.role === "carrier" ? "carry_leaves" : "care_plot";
  }
  state.resources.leaves += rewardLeaves;
  state.expeditionRewardLeaves = 0;
  state.expeditionState = "claimed";
  state.expeditionSourceClueAvailable = true;
  state.expeditionSourcePreviewVisible = false;
  state.nextExpeditionRoutePreviewId = undefined;
  state.lunarSourceSeedId = LUNAR_SOURCE_SEED_ID;
  state.objective = "첫 원정 완료 · 초승달순 source 단서 확인";
  state.receipts.unshift(`귀환 상자 열기 · 잎 +${rewardLeaves} · 초승달순 source 단서`);
}

export function previewExpeditionSourceClue(state: GardenState): void {
  if (!state.expeditionSourceClueAvailable || state.expeditionSourcePreviewVisible) {
    return;
  }

  state.expeditionSourcePreviewVisible = true;
  state.nextExpeditionRoutePreviewId = NEXT_EXPEDITION_ROUTE_PREVIEW_ID;
  state.lunarSourceSeedId = LUNAR_SOURCE_SEED_ID;
  state.lunarSourceSeedAvailable = !state.lunarSourceSeedPlanted;
  state.selectedSlotId = "facility_expedition_gate";
  state.objective = "초승달순 씨앗 source 발견 · 빈 밭에 심기";
  state.receipts.unshift("초승달순 단서 확인 · 달빛 울타리 route 잠김");
}

export function claimWorkbenchProduction(state: GardenState): void {
  const workbench = getFacilityBySlot(state, "facility_workbench");
  if (!workbench || state.actors.length === 0) {
    return;
  }

  workbench.progress = Math.min(100, workbench.progress + 35);
  state.resources.leaves += 8;
  const orderCrate = getFacilityBySlot(state, "facility_order_crate");
  if (orderCrate) {
    orderCrate.progress = Math.min(100, orderCrate.progress + 25);
    orderCrate.visualState = orderCrate.progress >= 100 ? "active" : "preview";
  }
  const storageSlot = getSlot(state, "facility_storage");
  const storageFill = storageSlot.unlockState === "unlocked" ? Math.min(4, state.storageCapacity - state.storedLeaves) : 0;
  if (storageFill > 0) {
    state.storedLeaves += storageFill;
  }
  if (!state.actors.some((actor) => actor.id === "actor_momo")) {
    state.actors.push({
      id: "actor_momo",
      name: "방패새싹 모모",
      role: "carrier",
      slotId: "facility_workbench",
      targetSlotId: "facility_order_crate",
      task: "carry_leaves"
    });
  }
  state.objective =
    orderCrate && orderCrate.progress >= 100 ? "주문 상자를 눌러 납품하기" : "잎을 모아 3번 밭 확장을 준비하기";
  state.receipts.unshift(
    storageFill > 0
      ? `포리 작업 수령 · 모모 운반 시작 · 잎 +8 · 주문 상자 +25% · 보관 +${storageFill}/${state.storageCapacity}`
      : "포리 작업 수령 · 모모 운반 시작 · 잎 +8 · 주문 상자 +25%"
  );
}

export function claimOrderCrateDelivery(state: GardenState): void {
  const orderCrate = getFacilityBySlot(state, "facility_order_crate");
  if (!orderCrate || orderCrate.progress < 100) {
    return;
  }

  orderCrate.progress = 0;
  orderCrate.visualState = "preview";
  const nextDeliveryCount = state.completedDeliveries + 1;
  state.completedDeliveries = nextDeliveryCount;
  state.resources.leaves += 30;
  state.objective =
    nextDeliveryCount === 1 ? "첫 주문 납품 완료 · 3번 밭 확장 준비" : `${nextDeliveryCount}번째 주문 납품 완료 · 보관 바구니 준비`;
  state.receipts.unshift(
    nextDeliveryCount === 1
      ? "주문 상자 납품 · 잎 +30 · 상회 평판 +1"
      : `반복 주문 납품 #${nextDeliveryCount} · 잎 +30 · 상회 평판 +1`
  );
}

export function unlockThirdPlot(state: GardenState): void {
  const slot = getSlot(state, "plot_03");
  if (slot.unlockState === "unlocked" || state.resources.leaves < THIRD_PLOT_UNLOCK_COST) {
    return;
  }

  state.resources.leaves -= THIRD_PLOT_UNLOCK_COST;
  slot.unlockState = "unlocked";
  slot.label = "3번 햇살 밭";
  if (!getPlotBySlot(state, "plot_03")) {
    state.plots.push({
      id: "plot_entity_03",
      slotId: "plot_03",
      state: "empty",
      growth: 0,
      careCount: 0
    });
  }
  state.resources.starterSeeds += 1;
  state.objective = "3번 햇살 밭에 새 씨앗 심기";
  state.receipts.unshift("3번 밭 확장 · 잎 -60 · 씨앗 +1 · 새 재배 자리 +1");
}

export function unlockStorageBasket(state: GardenState): void {
  const slot = getSlot(state, "facility_storage");
  const storage = getFacilityBySlot(state, "facility_storage");
  if (
    !storage ||
    slot.unlockState === "unlocked" ||
    state.completedDeliveries < 2 ||
    state.resources.leaves < STORAGE_BASKET_UNLOCK_COST
  ) {
    return;
  }

  state.resources.leaves -= STORAGE_BASKET_UNLOCK_COST;
  slot.unlockState = "unlocked";
  storage.level = 1;
  storage.visualState = "active";
  storage.progress = 100;
  state.storageCapacity = 24;
  state.objective = "보관 바구니 정리 완료 · 오프라인 보관 24";
  state.receipts.unshift("보관 바구니 정리 · 잎 -80 · 오프라인 보관 12 -> 24");
}

export function claimStoredLeaves(state: GardenState): void {
  const slot = getSlot(state, "facility_storage");
  const storage = getFacilityBySlot(state, "facility_storage");
  if (!storage || slot.unlockState !== "unlocked" || state.storedLeaves <= 0) {
    return;
  }

  const claimedLeaves = state.storedLeaves;
  state.storedLeaves = 0;
  state.resources.leaves += claimedLeaves;
  state.objective = `보관 잎 회수 완료 · 오프라인 보관 0/${state.storageCapacity}`;
  const researchSlot = getSlot(state, "facility_research_shelf");
  const researchShelf = getFacilityBySlot(state, "facility_research_shelf");
  researchSlot.unlockState = "preview";
  if (researchShelf) {
    researchShelf.visualState = "preview";
  }
  state.receipts.unshift(`오프라인 보관 회수 · 잎 +${claimedLeaves}`);
}

export function inspectResearchShelfPreview(state: GardenState): void {
  const slot = getSlot(state, "facility_research_shelf");
  const researchShelf = getFacilityBySlot(state, "facility_research_shelf");
  if (!researchShelf || researchShelf.kind !== "research_shelf" || slot.unlockState !== "preview") {
    return;
  }

  state.selectedSlotId = "facility_research_shelf";
  state.researchShelfPreviewSeen = true;
  state.researchClueSeedAvailable = true;
  state.objective = "달빛 씨앗 단서 확보 · 빈 밭에 단서 심기";
  state.receipts.unshift("연구 선반 살펴보기 · 달빛 씨앗 단서 확보");
}
