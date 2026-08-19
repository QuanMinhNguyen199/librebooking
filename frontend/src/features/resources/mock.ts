import type { ResourceSummary } from "./types";

export const demoResources: ResourceSummary[] = [
  {
    id: "101", name: "Phòng họp Saigon", description: "Tầng 8 · 12 người", kind: "room", status: "Đang trống", usagePercent: 82,
    amenities: ["TV 65 inch", "Bảng trắng", "Điều hòa", "Hội nghị trực tuyến"],
    accessories: [
      { id: 1, name: "Micro không dây", quantityAvailable: 4, minQuantity: 1, maxQuantity: 2 },
      { id: 2, name: "Webcam hội nghị", quantityAvailable: 2, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "102", name: "Phòng họp Hanoi", description: "Tầng 6 · 8 người", kind: "room", status: "Đang trống", usagePercent: 68,
    amenities: ["Màn hình 55 inch", "Bảng kính", "Điều hòa"],
    accessories: [
      { id: 2, name: "Webcam hội nghị", quantityAvailable: 2, minQuantity: 1, maxQuantity: 1 },
      { id: 3, name: "Loa Bluetooth", quantityAvailable: 3, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  {
    id: "103", name: "Phòng Brainstorm", description: "Tầng 5 · 6 người", kind: "room", status: "Đang trống", usagePercent: 47,
    amenities: ["Bảng ghim", "Bảng trắng", "Điều hòa"],
    accessories: [
      { id: 4, name: "Máy chiếu di động", quantityAvailable: 1, minQuantity: 1, maxQuantity: 1 },
    ],
  },
  { id: "car-corolla", name: "Toyota Corolla Cross", description: "Bãi xe B1 · 51A-239.18", kind: "car", status: "Đang sử dụng", usagePercent: 64 },
  { id: "macbook-024", name: "MacBook Pro M3 #024", description: "IT Pool · Nguyễn Minh An", kind: "laptop", status: "Đã cấp phát", usagePercent: 91 },
];

export const demoRooms = demoResources.filter(resource => resource.kind === "room");
