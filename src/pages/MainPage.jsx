import styled from "@emotion/styled";
import TopHeader from "@/components/TopHeader";
import AlertCard from "@/components/AlertCard";
import Notification from "@/components/Notification";
import AllConnect from "@/components/AllConnect";
import Room from "@/components/Room";
import Footer from "@/components/Footer";

//import { useState, useEffect } from "react";

// 목업데이터
const mockAlertData = [
  {
    id: 1,
    time: "10:23 AM",
    location: "현관",
    sound: "도어락 방문",
    type: "General",
  },
  {
    id: 2,
    time: "09:15 AM",
    location: "주방",
    sound: "화재 경보기",
    type: "Urgent",
  },
  {
    id: 3,
    time: "08:00 AM",
    location: "화장실",
    sound: "세탁기",
    type: "General",
  },
];

export default function MainPage() {
  //const [alerts, setAlerts] = useState(mockAlertData);
  return (
    <Container>
      <Header>
        <TopHeader />
        <Notification userName="홍길동" unreadCount={3} />
      </Header>
      <AllConnect />
      <DivideConnect>
        <Title>
          <Text>💡기기 연결 상태</Text>
        </Title>

        <GridContainer>
          <Room name="현관" isConnected={true} />
          <Room name="거실" isConnected={true} />
          <Room name="안방" isConnected={true} />
          <Room name="화장실" isConnected={false} />
        </GridContainer>
      </DivideConnect>

      <SoundAlarm>
        <Title>
          <Text>🔈실시간 소리 알림</Text>
        </Title>
        <AlertList>
          {mockAlertData.map((alert) => (
            <AlertCard
              key={alert.id}
              time={alert.time}
              location={alert.location}
              sound={alert.sound}
              type={alert.type}
            />
          ))}
        </AlertList>
      </SoundAlarm>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  background-color: #f8f8f8;
  padding-bottom: 100px;
`;
const DivideConnect = styled.div`
  padding: 28px 20px;
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 똑같은 크기로 2칸씩 쪼개라! */
  gap: 16px; /* 카드와 카드 사이의 가로세로 간격 */
  margin-top: 20px; /* 제목과 카드 사이의 여백 */
`;

const SoundAlarm = styled.div`
  padding: 10px 20px;
`;

const AlertList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
`;
