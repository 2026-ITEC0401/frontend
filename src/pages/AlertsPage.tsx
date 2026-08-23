import Header from "@/components/Header";
import AlertHistoryGroup from "@/components/AlertHistoryGroup";
import { type AlertHistoryResponse } from "@/types/alert";

// 목업 데이터 - IS_MOCK_MODE 로 서버 연결/해제 가능
import { mockAlertHistory } from "@/mocks/alert";
import { IS_MOCK_MODE } from "@/mocks/config";

// 명세 §7.3 GET /households/{household_id}/alarms/history
// 서버 연동 시 이 값만 실제 응답으로 교체하면 된다.
const EMPTY_HISTORY: AlertHistoryResponse = {
  timezone: "Asia/Seoul",
  start_date: "",
  end_date: "",
  total_count: 0,
  days: [],
};

export default function AlertsPage() {
  const history = IS_MOCK_MODE ? mockAlertHistory : EMPTY_HISTORY;

  // 서버는 알림이 없는 날짜도 빈 배열로 내려주므로 화면에서는 제외한다
  const daysWithAlarms = history.days.filter((day) => day.alarms.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="알람" showBackButton={false} />

      {daysWithAlarms.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-body-01 text-gray-300">
          최근 7일 동안 받은 알림이 없어요.
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-5 py-6">
          {daysWithAlarms.map((day) => (
            <AlertHistoryGroup
              key={day.date}
              date={day.date}
              display_label={day.display_label}
              alarms={day.alarms}
            />
          ))}
        </div>
      )}
    </div>
  );
}
