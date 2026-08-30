import { request } from "@/lib/api";
import type {
  AlertDetailResponse,
  AlertHistoryResponse,
  AlertLatestResponse,
  SeenResponse,
  UnreadCountResponse,
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

export async function getUnreadCount(household_id: string) {
  return request<UnreadCountResponse>(
    `/households/${household_id}/alarms/unread-count`,
  );
}

// PATCH, 요청 바디 없음 — 서버가 처리 시각을 last_seen_at으로 저장
export async function markAlarmsSeen(household_id: string) {
  return request<SeenResponse>(`/households/${household_id}/alarms/seen`, {
    method: "PATCH",
  });
}
