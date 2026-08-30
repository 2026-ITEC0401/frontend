import { request } from "@/lib/api";
import type {
  AlertDetailResponse,
  AlertHistoryResponse,
  AlertLatestResponse,
} from "@/types/alert";

export async function getLatestAlarm(household_id: string) {
  return request<AlertLatestResponse>(
    `/households/${household_id}/alarms/latest`,
  );
}

export async function getAlarmHistory(household_id: string) {
  return request<AlertHistoryResponse>(
    `/households/${household_id}/alarms/history`,
  );
}

export async function getAlarmDetail(household_id: string, alarm_id: string) {
  return request<AlertDetailResponse>(
    `/households/${household_id}/alarms/${alarm_id}`,
  );
}
