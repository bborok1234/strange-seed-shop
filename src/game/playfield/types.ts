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
  source?: "research" | "greenhouse_mist" | "album_record_next_seed";
  sourceLabel?: string;
  sourceAssetPath?: string;
  progressPercent: number;
  secondsRemaining?: number;
  tapReductionLabel?: string;
  tapReductionSeconds?: number;
  growthPreviewLabel?: string;
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
    orderVariant?: "first-dispatched" | "mist-condenser-complete" | "lunar-guardian";
    orderStatusLabel?: string;
    actorFamily?: "herb" | "candy" | "lunar";
    workAssetPath?: string;
    crateAssetPath?: string;
  };
  updatedAt: number;
}

export type GardenPlayfieldActionHandler = (action: GardenPlayfieldAction) => void;
