import type { ResourceSummary } from "./types";

export const demoResources: ResourceSummary[] = [
  { id: "room-saigon", name: "Phòng họp Saigon", description: "Tầng 8 · 12 người", kind: "room", status: "Đang trống", usagePercent: 82 },
  { id: "car-corolla", name: "Toyota Corolla Cross", description: "Bãi xe B1 · 51A-239.18", kind: "car", status: "Đang sử dụng", usagePercent: 64 },
  { id: "macbook-024", name: "MacBook Pro M3 #024", description: "IT Pool · Nguyễn Minh An", kind: "laptop", status: "Đã cấp phát", usagePercent: 91 },
];
