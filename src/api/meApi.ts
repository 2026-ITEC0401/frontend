import { request } from "@/lib/api";
import type { AuthUser } from "@/types/auth";

export async function getMe() {
  return request<AuthUser>("/me");
}

export async function changePassword(
  current_password: string,
  new_password: string,
) {
  return request<void>("/me/password", {
    method: "PATCH",
    body: { current_password, new_password },
  });
}
