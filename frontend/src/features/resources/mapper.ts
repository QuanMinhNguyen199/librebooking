import type { ResourceSummary } from "./types";

type LibreBookingResource = {
  resourceId: number;
  name: string;
  location?: string;
  statusId?: number;
};

export function mapResource(resource: LibreBookingResource): ResourceSummary {
  return {
    id: String(resource.resourceId),
    name: resource.name,
    description: resource.location ?? "Chưa có vị trí",
    kind: "room",
    status: resource.statusId === 1 ? "Đang trống" : "Không khả dụng",
    usagePercent: 0,
  };
}
