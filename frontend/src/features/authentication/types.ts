export type LoginInput = { username: string; password: string };
export type DemoRole = "employee" | "manager" | "resource_admin" | "system_admin" | "executive";
export type DemoPermission = "resource_usage" | "ai_usage" | "cost" | "people" | "approval";

export type AuthUser = {
  userId: number;
  username: string;
  name: string;
  initials: string;
  role: DemoRole;
  roleLabel: string;
  scope: string;
  permissions: DemoPermission[];
};

export type AuthSession = { isAuthenticated: boolean; user: AuthUser };
