import { type AlertType } from "@/types/alert";
import iconEmergency from "@/assets/icon-emergency.png";
import iconVisitor from "@/assets/icon-visitor.png";
import iconNoise from "@/assets/icon-noise.png";

interface AlertConfig {
  icon: string;
  cardBg: string;
  iconBg: string;
  titleColor: string;
  subtitleColor: string;
  // 알람 목록의 종류 구분 점 색상 (빨강/파랑/노랑)
  dotColor: string;
  // 상세 보기 상단 뱃지 색상 (뱃지 문구는 알림의 sound 값을 사용)
  badgeBg: string;
}

export const ALERT_CONFIG: Record<AlertType, AlertConfig> = {
  Urgent: {
    icon: iconEmergency,
    cardBg: "bg-emergency-100",
    iconBg: "bg-emergency-300",
    titleColor: "text-white",
    subtitleColor: "text-white",
    dotColor: "bg-red-200",
    badgeBg: "bg-red-200",
  },

  Visitor: {
    icon: iconVisitor,
    cardBg: "bg-white",
    iconBg: "bg-blue-100",
    titleColor: "text-gray-600",
    subtitleColor: "text-gray-300",
    dotColor: "bg-blue-200",
    badgeBg: "bg-blue-200",
  },

  Noise: {
    icon: iconNoise,
    cardBg: "bg-white",
    iconBg: "bg-yellow-100",
    titleColor: "text-gray-600",
    subtitleColor: "text-gray-300",
    dotColor: "bg-yellow-200",
    badgeBg: "bg-yellow-200",
  },
};
