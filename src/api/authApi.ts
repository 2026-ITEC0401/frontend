import { request } from "@/lib/api";
import type { LoginResponse, AuthTokens } from "@/types/auth";
import type { SignupRequest, SignupResponse } from "@/types/signup";

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

export async function logout(refresh_token: string) {
  return request<void>("/auth/logout", {
    method: "POST",
    body: { refresh_token },
  });
}

export async function signup(data: SignupRequest) {
  return request<SignupResponse>("/auth/signup", {
    method: "POST",
    auth: false,
    body: data,
  });
}
