import { useEffect } from "react";
import EmergencyImg from "@/assets/icon-emergency.png";
import RockImg from "@/assets/icon-visitor.png";
import NoiseImg from "@/assets/icon-noise.png";
import { type AlertWebData } from "@/types/alert";

interface FullScreenAlertProps {
  alertData?: AlertWebData;
  onClose: () => void;
}

const ALERT_POPUP_CONFIG = {
  Urgent: {
    bgColor: "bg-red-200",
    iconBgColor: "bg-red-100",
    infoBgColor: "bg-red-300",
    textColor: "text-red-200",
    title: "화재 경보기 울림",
    icon: <img src={EmergencyImg} alt="긴급 상황 아이콘" className="size-48" />,
    vibratePattern: [500, 200, 500, 200, 500],
  },
  Visitor: {
    bgColor: "bg-blue-200",
    iconBgColor: "bg-blue-100",
    infoBgColor: "bg-blue-300",
    textColor: "text-blue-200",
    title: "도어락 열림",
    icon: <img src={RockImg} alt="방문 감지" className="size-48" />,
    vibratePattern: [200, 100, 200],
  },

  Noise: {
    bgColor: "bg-yellow-200",
    iconBgColor: "bg-yellow-100",
    infoBgColor: "bg-yellow-300",
    textColor: "text-yellow-200",
    title: "아기 울음 소리",
    icon: <img src={NoiseImg} alt="소음 아이콘" className="size-48" />,
    vibratePattern: [300],
  },
};

export default function FullScreenAlert({
  alertData,
  onClose,
}: FullScreenAlertProps) {
  const { type, sound, location, display_time } = alertData || {};

  // type에 맞는 설정이 없으면 렌더링하지 않거나 기본값 처리
  const config = type ? ALERT_POPUP_CONFIG[type] : undefined;

  useEffect(() => {
    if (!config) return;

    // 1. 스크롤 방지
    document.body.style.overflow = "hidden";

    // 2. Web Vibration API 호출 (지원하는 기기/브라우저에서 작동)
    if (navigator.vibrate) {
      navigator.vibrate(config.vibratePattern);
    }

    return () => {
      document.body.style.overflow = "auto";
      // 컴포넌트 언마운트 시 진동 중지
      if (navigator.vibrate) navigator.vibrate(0);
    };
  }, [config]);

  if (!alertData || !config) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 box-border mx-auto flex w-full max-w-97.5 flex-col items-center justify-center pb-[40vh] transition-all duration-300 ease-in-out ${config.bgColor}`}
    >
      <div className="mt-[40vh] flex flex-col items-center p-12 text-center text-white">
        <div
          className={`mb-4 flex h-60 w-60 items-center justify-center rounded-full  ${config.iconBgColor}`}
        >
          {config.icon}
        </div>

        <h1 className="animate-text-blink mb-2 text-alert-01 tracking-wider">
          {sound} 감지
        </h1>
        <p className="mb-6 text-head-01">{config.title} </p>

        <div
          className={`mb-6 w-full rounded-full px-7 py-[1.7rem] text-head-01 ${config.infoBgColor}`}
        >
          {location} / {display_time}
        </div>

        <button
          className={`w-full cursor-pointer rounded-full border-none bg-white px-0 py-[1.6rem] text-head-01 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-105 active:scale-95 ${config.textColor}`}
          onClick={onClose}
        >
          확인 및 닫기
        </button>
      </div>
    </div>
  );
}
