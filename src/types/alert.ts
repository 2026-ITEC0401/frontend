import { type Timestamp } from "firebase/firestore";

// 알람 종류 : 방문자 | 화재 | 소음
export type AlertType = "Visitor" | "Urgent" | "Noise";

export interface CommonData {
  location: string;
  sound: string;
  type: AlertType;
}

// 화면용 데이터 (웹/앱)
export interface AlertWebData extends CommonData {
  id: number | string;
  time: string;
}

// 서버용 데이터 (라즈베리파이)
export interface AlertServerData extends CommonData {
  id?: number;
  time: number | Timestamp;
}
