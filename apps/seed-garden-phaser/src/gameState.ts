export type SlotKind = "plot" | "facility" | "decor";
export type UnlockState = "unlocked" | "preview" | "locked";
export type PlotState = "empty" | "planted" | "growing" | "ready";
export type FacilityKind = "workbench" | "order_crate" | "storage";
export type ActorRole = "caretaker" | "carrier";

export const THIRD_PLOT_UNLOCK_COST = 60;

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
  task: "care_plot" | "carry_leaves" | "idle";
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
      }
    ],
    actors: [],
    receipts: [],
    completedDeliveries: 0
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
    state.objective = "말랑잎 씨앗을 심어 첫 생명체를 만나기";
  } else if (plot?.state === "planted" || plot?.state === "growing") {
    state.objective = "밭을 돌봐 성장률을 올리기";
  } else if (plot?.state === "ready") {
    state.objective = "수확해서 말랑잎 포리를 정원 actor로 맞이하기";
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
  state.objective = plot.state === "ready" ? "수확해서 첫 actor를 정원에 합류시키기" : `성장 ${plot.growth}% - 한 번 더 돌보기`;
  state.receipts.unshift(plot.state === "ready" ? "수확 준비 완료" : `돌보기 +34% (${plot.careCount}회)`);
}

export function harvestSelectedPlot(state: GardenState): void {
  const plot = getPlotBySlot(state, state.selectedSlotId);
  if (!plot || plot.state !== "ready") {
    return;
  }

  const slot = getSlot(state, state.selectedSlotId);
  const firstPoriDiscovery = !state.actors.some((actor) => actor.id === "actor_pori");
  plot.state = "empty";
  plot.seedId = undefined;
  plot.growth = 0;
  plot.careCount = 0;
  state.resources.leaves += 12;
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
  state.receipts.unshift("포리 작업 수령 · 모모 운반 시작 · 잎 +8 · 주문 상자 +25%");
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
