import styled from "@emotion/styled";
import bellImg from "@/assets/bell.svg";

export default function Notification({ unreadCount }) {
  return (
    <Container>
      <TextSection>
        <p>
          확인하지 않은
          <br />
          <Highlight>{unreadCount}개의 알람</Highlight>이 있어요!
        </p>
      </TextSection>
      <Icon src={bellImg} alt="알람 아이콘" />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-size: 28px;
  font-weight: 300;

  p {
    margin: 0;
    line-height: 1.4; /* 줄간격을 조금 더 여유롭게 줍니다 */
  }
`;

const Highlight = styled.span`
  font-weight: 600;
`;

// 💡 종 이미지가 카드를 뚫고 나가지 않도록 크기를 딱 잡아줍니다.
const Icon = styled.img`
  width: 70px;
  height: auto;
  object-fit: contain;
`;
