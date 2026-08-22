import { useParams } from "react-router-dom";
import EmergencyActions from "@/components/EmergencyActions";
import Header from "@/components/Header";
import { ALERT_CONFIG } from "@/constants/alert";
import { mockAlertData } from "@/mocks/alert";
import { toAlertTimeParts } from "@/utils/alertTime";

export default function AlertInfoPage() {
  const { id } = useParams<{ id: string }>();
  const alert = mockAlertData.find((a) => String(a.id) === id);

  if (!alert) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header title="상세 보기" />
        <div className="flex flex-1 items-center justify-center text-body-01 text-gray-300">
          알림을 찾을 수 없어요.
        </div>
      </div>
    );
  }

  const config = ALERT_CONFIG[alert.type];
  const { date, meridiem, clock } = toAlertTimeParts(alert);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="상세 보기" />

      <div className="flex flex-col items-center gap-3 py-8">
        <img
          src={config.icon}
          alt={`${alert.sound} 아이콘`}
          className="h-26 w-26 object-contain"
        />
        <span
          className={`flex items-center rounded-full px-5 h-8 text-subtitle-03 text-white ${config.badgeBg}`}
        >
          {alert.sound}
        </span>
      </div>

      <div className="px-5">
        <dl className="m-0 flex flex-col rounded-4xl bg-white px-5 py-1">
          <InfoRow label="날짜" value={date} />
          <InfoRow label={meridiem} value={clock} />
          <InfoRow label="위치" value={alert.location} />
          {/* 과거 알림은 raw_label이 null이라 상위 소리 이름으로 대체한다 (명세 §7.4) */}
          <InfoRow label="소리" value={alert.raw_label ?? alert.sound} />
        </dl>
      </div>

      {alert.type === "Urgent" && <EmergencyActions alert={alert} />}
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
