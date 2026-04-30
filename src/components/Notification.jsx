import styled from "@emotion/styled";
import bellImg from "@/assets/bell.svg";

export default function Notification({ userName, unreadCount }) {
  return (
    <Container>
      <TextSection>
        <p>
          <Highlight1>{userName}</Highlight1>님,
          <br />
          확인하지 않은
          <br />
          <Highlight2>{unreadCount}개의 알람</Highlight2>이 있어요!
        </p>
      </TextSection>
      <Icon src={bellImg}></Icon>
    </Container>
  );
}

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 300;
  p {
    margin: 0;
    line-height: 1.4;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const Icon = styled.img``;
const Highlight1 = styled.span`
  font-weight: 600;
`;
const Highlight2 = styled.span`
  font-weight: 500;
  color: #fddb3a;
`;
