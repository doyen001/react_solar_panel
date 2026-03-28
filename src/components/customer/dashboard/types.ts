export type TimelineStepState = "completed" | "current" | "upcoming";

export type TimelineStep = {
  id: string;
  title: string;
  /** Shown under title; omit or "—" for TBD */
  dateLabel: string | null;
  state: TimelineStepState;
};

export type DesignBadge = "approved" | "draft";

export type DesignOption = {
  id: string;
  title: string;
  badge: DesignBadge;
  kw: string;
  panels: string;
  price: string;
  savingsPerYr: string;
  outputKwh: string;
  imageSrc: string;
};
