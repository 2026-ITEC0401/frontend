import styled from "@emotion/styled";
import TopHeader from "@/components/TopHeader";
import Notification from "@/components/Notification";
import AllConnect from "@/components/AllConnect";

export default function MainPage() {
  return (
    <Container>
      <Header>
        <TopHeader />
        <Notification userName="홍길동" unreadCount={2} />
      </Header>
      <AllConnect />
      <DivideConnect>
        <Title>
          <Text>💡기기 연결 상태</Text>
        </Title>
        <div></div>
      </DivideConnect>
      <div>실시간소리알림</div>
    </Container>
  );
}

const Container = styled.div``;
const DivideConnect = styled.div`
  padding: 0px 20px;
  background-color: #f8f8f8;
`;
const Header = styled.div`
  background-color: #52575d;
  padding: 16px 20px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.div``;
const Text = styled.p`
  font-size: 28px;
  font-weight: 600;
  margin: 0;
`;
