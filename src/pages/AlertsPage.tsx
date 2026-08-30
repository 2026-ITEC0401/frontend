import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AlertHistoryGroup from "@/components/AlertHistoryGroup";
import { getAlarmHistory } from "@/api/alarmApi";
import { ApiError } from "@/lib/api";
import { getHouseholdId } from "@/lib/auth";
import { type AlertHistoryResponse } from "@/types/alert";

export default function AlertsPage() {
  const householdId = getHouseholdId();
  const [history, setHistory] = useState<AlertHistoryResponse | null>(null);
  const [loading, setLoading] = useState(!!householdId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!householdId) return;
    let alive = true;
    getAlarmHistory(householdId)
      .then((res) => alive && setHistory(res))
      .catch(
        (e) =>
          alive &&
          setError(
            e instanceof ApiError ? e.message : "알림을 불러오지 못했어요.",
          ),
      )
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [householdId]);

  // 서버는 알림이 없는 날짜도 빈 배열로 내려주므로 화면에서는 제외한다
  const daysWithAlarms =
    history?.days.filter((day) => day.alarms.length > 0) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="알람" showBackButton={false} />

      {!householdId ? (
        <Centered>가구 연동이 필요합니다.</Centered>
      ) : loading ? (
        <Centered>불러오는 중…</Centered>
      ) : error ? (
        <Centered tone="error">{error}</Centered>
      ) : daysWithAlarms.length === 0 ? (
        <Centered>최근 7일 동안 받은 알림이 없어요.</Centered>
      ) : (
        <div className="flex flex-col gap-6 px-5 py-6">
          {daysWithAlarms.map((day) => (
            <AlertHistoryGroup
              key={day.date}
              date={day.date}
              display_label={day.display_label}
              alarms={day.alarms}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Centered({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "error";
}) {
  return (
    <div
      className={`flex flex-1 items-center justify-center text-body-01 ${
        tone === "error" ? "text-red-200" : "text-gray-300"
      }`}
    >
      {children}
    </div>
  );
}
