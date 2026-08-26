import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuth,
} from "@/lib/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiErrorBody {
  code: string;
  message: string;
  field_errors?: Record<string, string>;
  request_id?: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  field_errors?: Record<string, string>;
  request_id?: string;

  constructor(status: number, body: Partial<ApiErrorBody>) {
    super(body.message ?? `API 요청 실패 (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code ?? "UNKNOWN";
    this.field_errors = body.field_errors;
    this.request_id = body.request_id;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  isRetry?: boolean;
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;

    const tokens = await res.json();
    setTokens(tokens.access_token, tokens.refresh_token);
    return true;
  } catch {
    return false;
  }
}
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, isRetry, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, {
      code: "NETWORK_ERROR",
      message: "인터넷 연결을 확인해 주세요.",
    });
  }

  if (res.status === 401 && auth && !isRetry) {
    const renewed = await refreshTokens();
    if (renewed) {
      return request<T>(path, { ...options, isRetry: true });
    }
    clearAuth();
    window.location.href = "/login";
    throw new ApiError(401, {
      code: "UNAUTHORIZED",
      message: "다시 로그인해 주세요.",
    });
  }

  if (!res.ok) {
    let errorBody: Partial<ApiErrorBody> = {};
    try {
      errorBody = await res.json();
    } catch {
      // 서버가 JSON이 아닌 응답(502 HTML 등)을 준 경우
    }
    throw new ApiError(res.status, errorBody);
  }

  // 로그아웃, 연락처 삭제
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
