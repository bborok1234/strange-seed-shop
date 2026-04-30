export type GardenPlotState = "locked" | "empty" | "growing" | "ready";

export type GardenPlayfieldAction =
  | { type: "tap_growth"; plotIndex: number }
  | { type: "harvest_plot"; plotIndex: number }
  | { type: "select_plot"; plotIndex: number };

export interface GardenPlotView {
  index: number;
  state: GardenPlotState;
  label: string;
  seedId?: string;
  family?: "herb" | "candy" | "lunar";
  progressPercent: number;
  secondsRemaining?: number;
  tapReductionLabel?: string;
  tapReductionSeconds?: number;
}

export interface GardenPlayfieldViewModel {
  plots: GardenPlotView[];
  headline: string;
  hint: string;
  productionLine?: string;
  orderLine?: string;
  productionScene?: {
    actorName: string;
    actorLine: string;
    rateLabel: string;
    pendingLabel: string;
    orderTitle: string;
    orderProgressLabel: string;
    orderReady: boolean;
    orderCompleted: boolean;
    workAssetPath?: string;
    crateAssetPath?: string;
  };
  updatedAt: number;
}

export type GardenPlayfieldActionHandler = (action: GardenPlayfieldAction) => void;
