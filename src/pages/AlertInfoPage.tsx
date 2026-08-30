import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmergencyActions from "@/components/EmergencyActions";
import Header from "@/components/Header";
import { getAlarmDetail } from "@/api/alarmApi";
import { ApiError } from "@/lib/api";
import { getHouseholdId } from "@/lib/auth";
import { ALERT_CONFIG } from "@/constants/alert";
import { type AlertWebData } from "@/types/alert";
import { toWebDataFromDetail } from "@/utils/alertMapper";
import { toAlertTimeParts } from "@/utils/alertTime";

export default function AlertInfoPage() {
  const { id } = useParams<{ id: string }>();
  const householdId = getHouseholdId();

  const [alert, setAlert] = useState<AlertWebData | null>(null);
  const [loading, setLoading] = useState(!!(householdId && id));
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!householdId || !id) return;
    let alive = true;
    getAlarmDetail(householdId, id)
      .then((res) => alive && setAlert(toWebDataFromDetail(res.alarm)))
      .catch((e) => {
        if (!alive) return;
        if (e instanceof ApiError && e.status === 404) setNotFound(true);
        else
          setError(
            e instanceof ApiError ? e.message : "알림을 불러오지 못했어요.",
          );
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [householdId, id]);

  if (loading) return <Fallback>불러오는 중…</Fallback>;
  if (notFound) return <Fallback>알림을 찾을 수 없어요.</Fallback>;
  if (error) return <Fallback tone="error">{error}</Fallback>;
  if (!alert) return <Fallback>알림을 찾을 수 없어요.</Fallback>;

  const config = ALERT_CONFIG[alert.type];
  const { date, meridiem, clock } = toAlertTimeParts(alert);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="상세 보기" />

      <div className="flex flex-col items-center gap-3 py-8">
        <img
          src={config.icon}
          alt={`${config.badgeLabel} 알림 아이콘`}
          className="h-26 w-26 object-contain"
        />
        <span
          className={`flex items-center rounded-full px-5 h-8 text-subtitle-03 text-white ${config.badgeBg}`}
        >
          {config.badgeLabel}
        </span>
      </div>

      <div className="px-5">
        <dl className="m-0 flex flex-col rounded-4xl bg-white px-5 py-1">
          <InfoRow label="날짜" value={date} />
          <InfoRow label={meridiem} value={clock} />
          <InfoRow label="위치" value={alert.location} />
          {/* 과거 알림은 raw_label이 null이라 상위 소리 이름으로 대체한다 */}
          <InfoRow label="소리" value={alert.raw_label ?? alert.sound} />
        </dl>
      </div>

      {alert.type === "Urgent" && <EmergencyActions alert={alert} />}
    </div>
  );
}

function Fallback({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "error";
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header title="상세 보기" />
      <div
        className={`flex flex-1 items-center justify-center text-body-01 ${
          tone === "error" ? "text-red-200" : "text-gray-300"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-border py-5 last:border-b-0">
      <dt className="m-0 text-subtitle-02 text-gray-500">{label}</dt>
      <dd className="m-0 text-body-01 text-gray-300">{value}</dd>
    </div>
  );
}
