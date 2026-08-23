import { type AlertType } from "@/types/alert";
import { ALERT_CONFIG } from "@/constants/alert";
interface AlertCardProps {
  time: string;
  location: string;
  sound: string;
  type: AlertType;
}

export default function AlertCard({
  time,
  location,
  sound,
  type,
}: AlertCardProps) {
  const config = ALERT_CONFIG[type];

  return (
    <div
      className={`flex items-center gap-5 rounded-3xl p-5 my-2 shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out ${config.cardBg}`}
    >
      <div
        className={`flex items-center justify-center rounded-[20px] p-2 ${config.iconBg}`}
      >
        <img
          src={config.icon}
          className="w-12 object-contain"
          alt={`${sound} 아이콘`}
        />
      </div>
      <div>
        <span className={`text-head-03 ${config.titleColor}`}>
          {sound} 감지
        </span>
        <br />
        <span className={`text-body-01 ${config.subtitleColor}`}>
          {time} {location}
        </span>
      </div>
    </div>
  );
}
