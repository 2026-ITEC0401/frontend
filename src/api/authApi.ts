import { request } from "@/lib/api";
import type { LoginResponse, AuthTokens } from "@/types/auth";

export async function login(login_id: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: { login_id, password },
  });
}

export async function refresh(refresh_token: string) {
  return request<AuthTokens>("/auth/refresh", {
    method: "POST",
    auth: false,
    body: { refresh_token },
  });
}
