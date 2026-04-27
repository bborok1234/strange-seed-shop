export type GardenPlotState = "locked" | "empty" | "growing" | "ready";

export type GardenPlayfieldAction =
  | { type: "tap_growth"; plotIndex: number }
  | { type: "harvest_plot"; plotIndex: number }
  | { type: "select_plot"; plotIndex: number };

export interface GardenPlotView {
  index: number;
  state: GardenPlotState;
  label: string;
  family?: "herb" | "candy" | "lunar";
  progressPercent: number;
  secondsRemaining?: number;
}

export interface GardenPlayfieldViewModel {
  plots: GardenPlotView[];
  headline: string;
  hint: string;
  updatedAt: number;
}

export type GardenPlayfieldActionHandler = (action: GardenPlayfieldAction) => void;
