// 경고알림 테스트용 버튼
import { mockAlertData } from "@/mocks/alert";
import { type AlertWebData } from "@/types/alert";

interface MockAlertTriggerProps {
  onTrigger: (alert: AlertWebData) => void;
}
const buttonClass =
  "flex cursor-pointer items-center justify-center rounded-lg border-none px-3 py-2 font-bold text-white active:scale-95";

export default function MockAlertTrigger({ onTrigger }: MockAlertTriggerProps) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        className={`${buttonClass} bg-blue-200`}
        onClick={() => onTrigger(mockAlertData[0])}
      >
        Visitor
      </button>
      <button
        className={`${buttonClass} bg-red-200`}
        onClick={() => onTrigger(mockAlertData[1])}
      >
        Urgent
      </button>
      <button
        className={`${buttonClass} bg-yellow-200`}
        onClick={() => onTrigger(mockAlertData[2])}
      >
        Noise
      </button>
    </div>
  );
}
