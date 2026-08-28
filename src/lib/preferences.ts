// 앱 로컬 설정(localStorage). 백엔드에 저장하지 않는 값만 여기서 다룬다.
// 명세 회신 2번: 알림음 ON/OFF는 서버 저장 없이 프론트 localStorage로 처리.
const ALARM_SOUND_KEY = "hearo_alarm_sound_enabled";

export function getAlarmSoundEnabled(): boolean {
  // 기본값 ON. 사용자가 명시적으로 끈 경우("false")에만 OFF.
  return localStorage.getItem(ALARM_SOUND_KEY) !== "false";
}

export function setAlarmSoundEnabled(enabled: boolean): void {
  localStorage.setItem(ALARM_SOUND_KEY, String(enabled));
}
