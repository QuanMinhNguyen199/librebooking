export type ResourceKind = "room" | "car" | "laptop";

export type ResourceSummary = {
  id: string;
  name: string;
  description: string;
  kind: ResourceKind;
  status: string;
  usagePercent: number;
};
