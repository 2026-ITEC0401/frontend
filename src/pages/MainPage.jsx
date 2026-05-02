//import { db } from "../firebase"; // (실제 firebase 설정 파일 경로에 맞게)
//import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import TopHeader from "@/components/TopHeader";
import AlertCard from "@/components/AlertCard";
import Notification from "@/components/Notification";
import AllConnect from "@/components/AllConnect";
import Room from "@/components/Room";
import Footer from "@/components/Footer";
import FullScreenAlert from "@/components/FullScreenAlert";

// true : 목업 데이터 사용 false : Firebase 서버 연결
const IS_MOCK_MODE = true;

// --- API 명세서 기준 목업(Mock) 데이터 건들지 마세요---

// 1. 유저 정보 데이터 (TopHeader & Notification 영역)
const mockUserInfo = {
  userName: "홍한희",
  unreadCount: 2,
};

// 2. 기기 연결 상태 데이터 (DivideConnect 영역)
const mockDeviceData = [
  { name: "현관", isConnected: true },
  { name: "거실", isConnected: true },
  { name: "안방", isConnected: true },
  { name: "화장실", isConnected: false },
];

// 3. 실시간 소리 알림 데이터 (SoundAlarm 영역)
const mockAlertData = [
  {
    id: 1,
    time: "10:23 AM",
    location: "현관",
    sound: "현관문 열림",
    type: "Visitor", // 파랑 (방문자)
  },
  {
    id: 2,
    time: "09:15 AM",
    location: "주방",
    sound: "화재 경보기",
    type: "Urgent", // 빨강 (긴급, 화재)
  },
  {
    id: 3,
    time: "08:00 AM",
    location: "화장실",
    sound: "세탁 완료",
    type: "Appliance", // 노랑 (생활 기기)
  },
];

export default function MainPage() {
  // 초기화 값 : null (꺼짐)
  const [currentAlert, setCurrentAlert] = useState(null);
  const [alertList, setAlertList] = useState(mockAlertData);

  useEffect(() => {
    // 💡 스위치가 true(목업 모드)일 때는 서버 연결 코드를 무시하고 빠져나갑니다.
    if (IS_MOCK_MODE) {
      console.log("🛠️ 현재 MOCK 모드로 실행 중입니다. (서버 연결 안 됨)");
      return;
    }

    // --- 👇 여기서부터는 IS_MOCK_MODE가 false일 때만 실행됩니다 (실제 서버 연동) ---
    /*
    const q = query(collection(db, "alarms"), orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newAlertData = change.doc.data();
          setCurrentAlert(newAlertData);
          setAlertList((prev) => [newAlertData, ...prev]);
        }
      });
    });
    return () => unsubscribe();
    */
  }, []);

  return (
    <Container>
      <Header>
        <TopHeader />
        <Notification
          userName={mockUserInfo.userName}
          unreadCount={mockUserInfo.unreadCount}
        />
      </Header>

      <AllConnect />

      <DivideConnect>
        <Title>
          <Text>💡기기 연결 상태</Text>
        </Title>

        <GridContainer>
          {mockDeviceData.map((device, index) => (
            <Room
              key={index}
              name={device.name}
              isConnected={device.isConnected}
            />
          ))}
        </GridContainer>
      </DivideConnect>

      <SoundAlarm>
        <Title>
          <Text>🔈실시간 소리 알림</Text>
        </Title>
        {/* 💡 조건부 렌더링: 스위치가 true일 때만 개발자용 테스트 버튼들을 화면에 보여줍니다 */}
        {IS_MOCK_MODE && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <TestButton
              onClick={() => setCurrentAlert(mockAlertData[0])}
              style={{ background: "#2563eb" }}
            >
              👤 방문자
            </TestButton>
            <TestButton
              onClick={() => setCurrentAlert(mockAlertData[1])}
              style={{ background: "#dc2626" }}
            >
              🚨 긴급
            </TestButton>
            <TestButton
              onClick={() => setCurrentAlert(mockAlertData[2])}
              style={{ background: "#82E21A", color: "#000" }}
            >
              🧺 기기
            </TestButton>
          </div>
        )}
        <AlertList>
          {/* 💡 수정됨: mockAlertData 대신 상태(State)인 alertList를 사용하여 렌더링 */}
          {alertList.map((alert) => (
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
      {currentAlert && (
        <FullScreenAlert
          alertData={currentAlert}
          onClose={() => setCurrentAlert(null)}
        />
      )}
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
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
`;
const SoundAlarm = styled.div`
  padding: 10px 20px;
`;
const AlertList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
`;

// 임시 테스트 버튼 스타일
const TestButton = styled.button`
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }
  display: flex;
  justify-content: center;
  align-items: center;
`;
