import styled from "@emotion/styled";
import UrgentImg from "../assets/Urgent_icon.svg";
import GeneralImg from "../assets/General_icon.svg";

export default function AlertCard({ time, location, sound, type }) {
  const isUrgent = type === "Urgent";

  return (
    <Container isUrgent={isUrgent}>
      <IconWrapper isUrgent={isUrgent}>
        <Icon src={isUrgent ? UrgentImg : GeneralImg}></Icon>
      </IconWrapper>
      <TextWrapper>
        <InfoText>{sound} 감지</InfoText>
        <br />
        <TimeText isUrgent={isUrgent}>
          {time} {location}
        </TimeText>
      </TextWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  margin: 8px 0;
  border-radius: 30px;
  transition: all 0.2s ease-in-out;
  gap: 20px;
  color: ${({ isUrgent }) => (isUrgent ? "#ffffff" : "#000000")};
  background-color: ${({ isUrgent }) => (isUrgent ? "#C23030" : "#ffffff")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ isUrgent }) => (isUrgent ? "#941A1A" : "#F1F1F1")};
  border-radius: 15px;
  padding: 8px;
`;

const Icon = styled.img`
  width: 45px;
  object-fit: contain;
`;
const TextWrapper = styled.div`
  font-size: 20px;
  font-weight: 600;

  line-height: 1.3;
`;

const TimeText = styled.span`
  color: ${({ isUrgent }) => (isUrgent ? "rgba(255,255,255,0.7)" : "#6b6b6b")};
`;
const InfoText = styled.span`
  font-size: 24px;
`;
