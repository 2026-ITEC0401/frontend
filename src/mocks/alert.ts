import { type AlertWebData } from "@/types/alert";

export const mockUnreadCount = 3;

export const mockAlertData: AlertWebData[] = [
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
