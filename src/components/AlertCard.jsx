import styled from "@emotion/styled";
import UrgentImg from "../assets/Urgent_icon.svg";
import GeneralImg from "../assets/GeneraL_icon.svg";

export default function AlertCard({ time, location, sound, type }) {
  const isUrgent = type === "Urgent";

  return (
    <Container isUrgent={isUrgent}>
      <IconWrapper isUrgent={isUrgent}>
        <Icon src={isUrgent ? UrgentImg : GeneralImg}></Icon>
      </IconWrapper>
      <TextWrapper>
        <TimeText>[시간:{time}, </TimeText>
        <InfoText>
          위치: {location}, 소리: {sound}, 유형: {isUrgent ? "긴급" : "일반"}]
        </InfoText>
      </TextWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  margin: 8px 0;
  border-radius: 16px;
  transition: all 0.2s ease-in-out;
  gap: 20px;

  background-color: ${({ isUrgent }) => (isUrgent ? "#FFDEDE" : "#ffffff")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 50px;
  object-fit: contain;
`;
const TextWrapper = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
`;

const TimeText = styled.span``;
const InfoText = styled.span``;
