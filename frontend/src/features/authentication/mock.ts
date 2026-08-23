import type { AuthUser } from "./types";

export const demoUsers: AuthUser[] = [
  { userId: 1, username: "employee", name: "An Nguyễn", initials: "AN", role: "employee", roleLabel: "Nhân viên", scope: "Cá nhân", permissions: [] },
  { userId: 2, username: "manager", name: "Minh Nguyễn", initials: "MN", role: "manager", roleLabel: "Manager", scope: "Phòng Marketing", permissions: ["resource_usage", "cost", "people", "approval"] },
  { userId: 3, username: "resourceadmin", name: "Hà Trần", initials: "HT", role: "resource_admin", roleLabel: "Admin tài nguyên", scope: "Văn phòng HCM", permissions: ["resource_usage", "cost", "approval"] },
  { userId: 4, username: "sysadmin", name: "Tùng Phạm", initials: "TP", role: "system_admin", roleLabel: "Admin hệ thống", scope: "Toàn hệ thống", permissions: ["resource_usage", "ai_usage", "cost", "people", "approval"] },
  { userId: 5, username: "ceo", name: "Quang Lê", initials: "QL", role: "executive", roleLabel: "CEO", scope: "Toàn công ty", permissions: ["resource_usage", "cost"] },
];
