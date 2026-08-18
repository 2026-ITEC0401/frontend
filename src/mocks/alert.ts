import { type AlertWebData } from "@/types/alert";

export const mockUnreadCount = 4;

export const mockAlertData: AlertWebData[] = [
  {
    id: 1,
    time: "오전 08:00",
    location: "현관",
    sound: "도어락",
    type: "Visitor", // 파랑 (방문자)
  },
  {
    id: 2,
    time: "오전 09:15",
    location: "거실",
    sound: "화재",
    type: "Urgent", // 빨강 (긴급, 화재)
  },
  {
    id: 3,
    time: "오후 02:22",
    location: "현관",
    sound: "아기 울음",
    type: "Noise", // 노랑 (생활 기기)
  },
  {
    id: 4,
    time: "오후 03:02",
    location: "현관",
    sound: "노크",
    type: "Visitor", // 노랑 (생활 기기)
  },
];
