import { useEffect } from "react";
import FireImg from "../assets/fire.svg";
import RockImg from "../assets/rock.png";
import NoiseImg from "../assets/noise.png";
import { type AlertWebData } from "../types/alert";

interface FullScreenAlertProps {
  alertData?: AlertWebData;
  onClose: () => void;
}

// --- Animations & Config ---  연동확인
// pulse / slideDown / textBlink keyframes는 src/styles/global.css에 정의되어 있습니다.

const ALERT_CONFIG = {
  Urgent: {
    color: "239, 68, 68", // 빨강
    title: "긴급 상황 감지",
    icon: (
      <img
        src={FireImg}
        alt="긴급 화재 아이콘"
        style={{ width: "12rem", height: "12rem" }}
      />
    ),
    animation: "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    vibratePattern: [500, 200, 500, 200, 500], // 강한 진동 반복
  },
  Visitor: {
    color: "59, 130, 246", // 파랑
    title: "방문 감지",
    icon: (
      <img
        src={RockImg}
        alt="잠금 아이콘"
        style={{ width: "12rem", height: "12rem" }}
      />
    ),
    animation: "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    vibratePattern: [200, 100, 200], // 짧게 두 번
  },

  Noise: {
    color: "242, 181, 11", // 노랑
    title: "주변 소음 감지",
    icon: (
      <img
        src={NoiseImg}
        alt="소음 아이콘"
        style={{ width: "12rem", height: "12rem" }}
      />
    ),
    animation: "slideDown 0.5s ease-out",
    vibratePattern: [300], // 짧게 한 번
  },
};

// --- Main Component ---
export default function FullScreenAlert({
  alertData,
  onClose,
}: FullScreenAlertProps) {
  // API 명세서에 맞춰 alertData의 type이 "Urgent" | "Visitor" | "Appliance" 로 온다고 가정합니다.
  const { type, sound, location, time } = alertData || {};

  // type에 맞는 설정이 없으면 렌더링하지 않거나 기본값 처리 (안전 장치)
  const config = type ? ALERT_CONFIG[type] : undefined;

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
      className="fixed inset-0 z-[9999] box-border mx-auto flex w-full max-w-[390px] flex-col items-center justify-center pb-[40vh] backdrop-blur-md transition-all duration-300 ease-in-out"
      style={{ backgroundColor: `rgba(${config.color}, 0.95)` }}
    >
      <div
        className="mt-[40vh] flex flex-col items-center p-12 text-center text-white"
        style={{ animation: config.animation }}
      >
        <div className="flex h-[15rem] w-[15rem] items-center justify-center rounded-full bg-[rgba(255,255,255,0.8)] text-[10rem]">
          {config.icon}
        </div>

        <h1 className="animate-text-blink -mb-4 text-5xl font-extrabold tracking-wider uppercase">
          {config.title}
        </h1>
        <p className="mb-6 text-[2rem] font-bold">{sound} </p>

        <div className="mb-6 w-full rounded-full bg-[rgba(0,0,0,0.2)] px-0 py-[1.7rem] text-[1.7rem] font-medium">
          {location} / {time}
        </div>

        <button
          className="w-full cursor-pointer rounded-full border-none bg-white px-0 py-[1.6rem] text-[1.8rem] font-extrabold shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ color: `rgb(${config.color})` }}
          onClick={onClose}
        >
          확인 및 닫기
        </button>
      </div>
    </div>
  );
}
