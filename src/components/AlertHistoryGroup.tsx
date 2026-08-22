import { ALERT_CONFIG } from "@/constants/alert";
import { type AlertHistoryAlarm, type AlertHistoryDay } from "@/types/alert";
import { formatAlertDayLabel, formatAlertTime } from "@/utils/date";

type AlertHistoryGroupProps = AlertHistoryDay;

export default function AlertHistoryGroup({
  date,
  display_label,
  alarms,
}: AlertHistoryGroupProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 text-subtitle-02 text-gray-600">
        {formatAlertDayLabel(date, display_label)}
      </h2>

      <ul className="m-0 flex list-none flex-col divide-y divide-border rounded-3xl bg-white px-5 py-1 shadow-03">
        {alarms.map((alarm) => (
          <AlertHistoryRow key={alarm.id} alarm={alarm} />
        ))}
      </ul>
    </section>
  );
}

interface AlertHistoryRowProps {
  alarm: AlertHistoryAlarm;
}

function AlertHistoryRow({ alarm }: AlertHistoryRowProps) {
  const config = ALERT_CONFIG[alarm.type];

  return (
    <li className="flex items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dotColor}`}
        />
        <span className="truncate text-subtitle-03 text-gray-600">
          {alarm.sound} 감지
        </span>
      </div>

      <span className="shrink-0 text-body-01 text-gray-300">
        {alarm.location} · {formatAlertTime(alarm.local_time)}
      </span>
    </li>
  );
}
