import { Mail, Phone } from "lucide-react";
import {
  EMERGENCY_NUMBER,
  VIDEO_CALL_REQUEST_BODY,
  buildFamilyNoticeBody,
  buildReportBody,
} from "@/constants/emergency";
import {
  MOCK_MY_USER_ID,
  mockEmergencyAddress,
  mockMembers,
} from "@/mocks/household";
import { type AlertWebData } from "@/types/alert";
import { toAlertTimeParts } from "@/utils/alertTime";
import { buildSmsHref } from "@/utils/sms";

const buttonClass =
  "flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-none bg-main-200 h-15 text-subtitle-01 text-gray-600 shadow-02";

interface EmergencyActionsProps {
  alert: AlertWebData;
}

export default function EmergencyActions({ alert }: EmergencyActionsProps) {
  const me = mockMembers.find((m) => m.user_id === MOCK_MY_USER_ID);
  const owner = mockMembers.find((m) => m.role === "owner");
  const { stamp } = toAlertTimeParts(alert);

  // 본인을 제외한 나머지 가구 구성원 전체
  const familyPhones = mockMembers
    .filter((m) => m.user_id !== MOCK_MY_USER_ID)
    .map((m) => m.phone_number);

  // 딥링크는 반드시 클릭 핸들러 안에서 호출해야 한다. 자동 실행은 브라우저가 차단한다.
  const openSms = (recipients: string[], body?: string) => {
    window.location.href = buildSmsHref(recipients, body);
  };

  return (
    <div className="flex flex-col gap-6 px-5 pt-8">
      {me?.role === "owner" ? (
        <>
          <button
            type="button"
            className={buttonClass}
            onClick={() => openSms([EMERGENCY_NUMBER], VIDEO_CALL_REQUEST_BODY)}
          >
            <Phone size={24} />
            119 영상통화 요청
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() =>
              openSms(
                [EMERGENCY_NUMBER],
                buildReportBody(mockEmergencyAddress, stamp, alert.sound),
              )
            }
          >
            <Mail size={24} />
            119 문자 신고
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() =>
              openSms(
                familyPhones,
                buildFamilyNoticeBody(stamp, alert.location),
              )
            }
          >
            <Mail size={24} />
            가족 단체문자 전송
          </button>
        </>
      ) : (
        <>
          <a href={`tel:${EMERGENCY_NUMBER}`} className={buttonClass}>
            <Phone size={24} />
            119 전화 걸기
          </a>

          {/* 보호자 → owner 문자는 템플릿 없이 문자앱만 연다 */}
          <button
            type="button"
            className={buttonClass}
            onClick={() => openSms(owner ? [owner.phone_number] : [])}
          >
            <Mail size={24} />
            {owner ? (
              // 명세 §5.5 display_name (보호자가 지정한 별칭, 없으면 가입 시 이름)
              <span className="flex min-w-0">
                <span className="truncate">{owner.display_name}</span>
                <span className="shrink-0">에게 문자 전송</span>
              </span>
            ) : (
              "문자 전송"
            )}
          </button>
        </>
      )}
    </div>
  );
}
