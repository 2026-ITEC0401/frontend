import { useEffect } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import FireImg from "../assets/fire.svg";
import RockImg from "../assets/rock.png";
import WashImg from "../assets/wash.png";

// --- Animations & Config ---
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const slideDown = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const textBlink = keyframes`
  0%, 100% { opacity: 1;  }
  50% { opacity: 0.3; text-shadow: none; }
`;

const ALERT_CONFIG = {
  Urgent: {
    color: "239, 68, 68",
    title: "긴급 상황 발생",
    icon: (
      <img
        src={FireImg}
        alt="긴급 화재 아이콘"
        style={{ width: "12rem", height: "12rem" }}
      />
    ),
    animation: `${pulse} 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    vibratePattern: [500, 200, 500, 200, 500], // 강한 진동 반복
  },
  Visitor: {
    color: "59, 130, 246", // Blue
    title: "도어락 감지",
    icon: (
      <img
        src={RockImg}
        alt="잠금 아이콘"
        style={{ width: "12rem", height: "12rem" }}
      />
    ),
    animation: `${slideDown} 0.5s ease-out`,
    vibratePattern: [200, 100, 200], // 짧게 두 번
  },
  Appliance: {
    color: "22, 163, 74", // Yellow
    title: "생활 기기 알림",
    icon: (
      <img
        src={WashImg}
        alt="잠금 아이콘"
        style={{ width: "12rem", height: "12rem" }}
      />
    ),
    animation: `${slideDown} 0.5s ease-out`,
    vibratePattern: [300], // 짧게 한 번
  },
};

// --- Main Component ---
export default function FullScreenAlert({ alertData, onClose }) {
  // API 명세서에 맞춰 alertData의 type이 "Urgent" | "Visitor" | "Appliance" 로 온다고 가정합니다.
  const { type, sound, location, time } = alertData || {};

  // type에 맞는 설정이 없으면 렌더링하지 않거나 기본값 처리 (안전 장치)
  const config = ALERT_CONFIG[type];

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
    <Overlay themeColor={config.color}>
      <AlertContainer animationRule={config.animation}>
        <IconWrapper>{config.icon}</IconWrapper>

        <Title $isUrgent={type === "Urgent"}>{config.title}</Title>
        <SubText>{sound} </SubText>

        <InfoText>
          {location} / {time}
        </InfoText>

        <CloseButton themeColor={config.color} onClick={onClose}>
          확인 및 닫기
        </CloseButton>
      </AlertContainer>
    </Overlay>
  );
}

// --- Styled Components ---
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: rgba(${(props) => props.themeColor}, 0.95);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease-in-out;

  box-sizing: border-box;

  margin: 0 auto;
  width: 100%;
  max-width: 390px;

  padding-bottom: 40vh;
`;

const AlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  color: white;
  padding: 3rem;
  animation: ${(props) => props.animationRule};
  margin-top: 40vh;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: -1rem;
  text-transform: uppercase;

  ${(props) =>
    props.$isUrgent &&
    css`
      animation: ${textBlink} 0.8s ease-in-out infinite;
    `}
`;

const SubText = styled.p`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const InfoText = styled.div`
  font-size: 1.7rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.7rem 0rem;
  width: 100%;
  border-radius: 9999px;
`;

const CloseButton = styled.button`
  padding: 1.6rem 0rem;
  background-color: white;
  color: rgb(${(props) => props.themeColor});
  font-size: 1.8rem;
  font-weight: 800;
  width: 100%;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10rem;

  /* 💡 핵심: 조건부 스타일 제거, 모든 상황 공통 적용 */
  width: 15rem; /* 원의 너비 */
  height: 15rem; /* 원의 높이 */
  background-color: rgba(255, 255, 255, 0.8); /* 반투명 흰색 원 */
  border-radius: 50%; /* 원형 만들기 */

  /* 아이콘 자체 크기 (img 태그) */
  img {
    width: 12rem;
    height: 12rem;
  }
`;
