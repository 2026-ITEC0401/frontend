const ACCESS_TOKEN_KEY = "hearo_access_token";
const REFRESH_TOKEN_KEY = "hearo_refresh_token";
const HOUSEHOLD_ID_KEY = "hearo_household_id";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getHouseholdId(): string | null {
  return localStorage.getItem(HOUSEHOLD_ID_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function setHouseholdId(householdId: string): void {
  localStorage.setItem(HOUSEHOLD_ID_KEY, householdId);
}

export function clearAuth(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(HOUSEHOLD_ID_KEY);
}
