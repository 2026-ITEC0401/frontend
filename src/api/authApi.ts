import { request } from "@/lib/api";
import type { LoginResponse } from "@/types/auth";

export async function login(login_id: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: { login_id, password },
  });
}
