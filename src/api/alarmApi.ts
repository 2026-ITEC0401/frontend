import { request } from "@/lib/api";
import type { AlertLatestResponse } from "@/types/alert";

export async function getLatestAlarm(household_id: string) {
  return request<AlertLatestResponse>(
    `/households/${household_id}/alarms/latest`,
  );
}
