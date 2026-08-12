import styled from "@emotion/styled";
import { FiBell, FiHome, FiSettings } from "react-icons/fi";

export default function Footer() {
  return (
    <FooterContainer>
      <NavItem>
        <FiBell size={28} />
        <IconLabel>알람</IconLabel>
      </NavItem>

      <NavItem>
        <FiHome size={28} />
        <IconLabel>홈</IconLabel>
      </NavItem>

      <NavItem>
        <FiSettings size={28} />
        <IconLabel>설정</IconLabel>
      </NavItem>
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  margin: 0 auto;
  height: 85px; // footer 높이
  background-color: #ffffff;

  max-width: 390px;

  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);

  display: flex;
  justify-content: space-around; //버튼 간격
  align-items: center;

  /* 아이폰 하단 홈 바(Home Indicator) 영역을 침범하지 않도록 여백 확보 */
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100; /* 알림 카드들이 스크롤될 때 Footer 위로 올라오지 않게 제일 위로 띄움 */
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  color: #374151;
  flex: 1;

  transition: color 0.2s;
  &:hover,
  &:active {
    color: #111827;
  }
`;

const IconLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
`;
