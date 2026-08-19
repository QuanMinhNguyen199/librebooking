import { loginRequest } from "./api";
import type { AuthSession, LoginInput } from "./types";

export async function login(input: LoginInput): Promise<AuthSession> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "false") {
    const valid = input.username.trim().toLowerCase() === "admin" &&
      ["demo123", "demoadmin"].includes(input.password);
    await new Promise(resolve => window.setTimeout(resolve, 500));
    if (!valid) throw new Error("Tài khoản hoặc mật khẩu chưa đúng.");
    return { userId: 1, isAuthenticated: true };
  }
  return loginRequest(input);
}
