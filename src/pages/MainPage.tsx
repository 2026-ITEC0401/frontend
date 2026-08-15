import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { useState, useEffect } from "react";
import TopHeader from "@/components/TopHeader";
import AlertCard from "@/components/AlertCard";
import Notification from "@/components/Notification";
import Room from "@/components/Room";
import Footer from "@/components/Footer";
import FullScreenAlert from "@/components/FullScreenAlert";
import { type RoomDevice } from "@/types/room";
import { type AlertWebData, type AlertServerData } from "@/types/alert";

// true : 목업 데이터 사용 false : Firebase 서버 연결
const IS_MOCK_MODE = false;

// --- API 명세서 기준 목업(Mock) 데이터 건들지 마세요---

// 1. 유저 정보 데이터 (TopHeader & Notification 영역)
const mockUserInfo = {
  userName: "장원석",
  unreadCount: 3,
};

// 2. 기기 연결 상태 데이터 (DivideConnect 영역)
const mockDeviceData: RoomDevice[] = [
  { name: "현관", isConnected: true },
  { name: "거실", isConnected: true },
  { name: "안방", isConnected: true },
  { name: "화장실", isConnected: false },
];

// 3. 실시간 소리 알림 데이터 (SoundAlarm 영역)
const mockAlertData: AlertWebData[] = [
  {
    id: 1,
    time: "오전 08:00",
    location: "현관",
    sound: "현관문 열림",
    type: "Visitor", // 파랑 (방문자)
  },
  {
    id: 2,
    time: "오전 09:15",
    location: "주방",
    sound: "화재 경보기",
    type: "Urgent", // 빨강 (긴급, 화재)
  },
  {
    id: 3,
    time: "오후 02:22",
    location: "현관",
    sound: "아기 울음",
    type: "Noise", // 노랑 (생활 기기)
  },
];

export default function MainPage() {
  // 초기화 값 : null (꺼짐)
  const [currentAlert, setCurrentAlert] = useState<null | AlertWebData>(null);
  const [alertList, setAlertList] = useState<AlertWebData[]>(
    IS_MOCK_MODE ? mockAlertData : [],
  );

  useEffect(() => {
    // 💡 스위치가 true(목업 모드)일 때는 서버 연결 코드를 무시하고 빠져나갑니다.
    if (IS_MOCK_MODE) {
      console.log("🛠️ 현재 MOCK 모드로 실행 중입니다. (서버 연결 안 됨)");
      return;
    }

    // --- 👇 Firebase 연동 (화면 렌더링 + 로그 동시 확인) ---

    // time을 기준으로 최신순 정렬
    const q = query(
      collection(db, "alarms"),
      orderBy("time", "desc"),
      limit(1),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // 파이어베이스에서 막 도착한 순수 원본 데이터
          const serverData = change.doc.data() as AlertServerData;

          // 🚨 F12 관리자 모드 콘솔창에 데이터 찍기
          console.log("====================================");
          console.log("📡 [서버 원본 데이터 수신] :", serverData);
          console.log("====================================");

          let displayTime = "시간 오류";
          if (serverData.time) {
            let dateObj: undefined | Date;

            if (typeof serverData.time !== "number") {
              dateObj = serverData.time.toDate();
            } else {
              dateObj = new Date(
                serverData.time.toString().length === 10
                  ? serverData.time * 1000
                  : serverData.time,
              );
            }

            if (dateObj) {
              displayTime = dateObj.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              });
            }
          }

          const finalAlertData = {
            id: serverData.id || change.doc.id,
            time: displayTime,
            location: serverData.location,
            sound: serverData.sound,
            type: serverData.type,
          };

          console.log("🛠️ [UI 변환 결과 프리뷰] :", finalAlertData);

          // 💡 화면 렌더링 실행: 주석을 해제하여 콘솔 로그 출력과 함께 화면 팝업도 띄웁니다.
          setCurrentAlert(finalAlertData);
          setAlertList((prev) => [finalAlertData, ...prev]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-[100vh] flex-col bg-[#41444b]">
      <div className="flex flex-col gap-5 bg-[#41444b] px-5 py-4">
        <TopHeader userName={mockUserInfo.userName} />
        <Notification unreadCount={mockUserInfo.unreadCount} />
      </div>
      <div className="min-h-[calc(100vh-250px)] flex-1 rounded-t-[32px] bg-[#f8f8f8] pt-5 pb-[100px]">
        <div className="px-5 py-7">
          <div>
            <p className="m-0 text-[28px] font-bold text-[#41444b]">
              기기 연결 상태
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            {mockDeviceData.map((device, index) => (
              <Room
                key={index}
                name={device.name}
                isConnected={device.isConnected}
              />
            ))}
          </div>
        </div>

        <div className="px-5 py-2.5">
          <div>
            <p className="m-0 text-[28px] font-bold text-[#41444b]">
              실시간 소리 알림
            </p>
          </div>

          <div className="mt-4 flex flex-col">
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
          </div>
        </div>
        {/* 💡 조건부 렌더링: 스위치가 true일 때만 개발자용 테스트 버튼들을 화면에 보여줍니다 */}
        {IS_MOCK_MODE && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-lg border-none px-3 py-2 font-bold text-white active:scale-95"
              onClick={() => setCurrentAlert(mockAlertData[0])}
              style={{ background: "#2563eb" }}
            >
              방문
            </button>
            <button
              className="flex cursor-pointer items-center justify-center rounded-lg border-none px-3 py-2 font-bold text-white active:scale-95"
              onClick={() => setCurrentAlert(mockAlertData[1])}
              style={{ background: "#dc2626" }}
            >
              긴급
            </button>
            <button
              className="flex cursor-pointer items-center justify-center rounded-lg border-none px-3 py-2 font-bold text-white active:scale-95"
              onClick={() => setCurrentAlert(mockAlertData[2])}
              style={{ background: "#F2B50B", color: "#000" }}
            >
              소음
            </button>
          </div>
        )}
      </div>
      <Footer />
      {currentAlert && (
        <FullScreenAlert
          alertData={currentAlert}
          onClose={() => setCurrentAlert(null)}
        />
      )}
    </div>
  );
}
