import { loginRequest } from "./api";
import type { AuthSession, LoginInput } from "./types";
import { demoUsers } from "./mock";

export async function login(input: LoginInput): Promise<AuthSession> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "false") {
    const user = demoUsers.find(item => item.username === input.username.trim().toLowerCase());
    const valid = Boolean(user) && ["demo123", "demoadmin"].includes(input.password);
    await new Promise(resolve => window.setTimeout(resolve, 500));
    if (!valid) throw new Error("Tài khoản hoặc mật khẩu chưa đúng.");
    return { isAuthenticated: true, user: user! };
  }
  return loginRequest(input);
}
