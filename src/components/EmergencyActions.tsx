import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import {
  EMERGENCY_NUMBER,
  VIDEO_CALL_REQUEST_BODY,
  buildFamilyNoticeBody,
  buildReportBody,
} from "@/constants/emergency";
import { getEmergencyAddress, getMembers } from "@/api/householdApi";
import { getHouseholdId } from "@/lib/auth";
import { type AlertWebData } from "@/types/alert";
import { type EmergencyAddress, type HouseholdMember } from "@/types/household";
import { toAlertTimeParts } from "@/utils/alertTime";
import { buildSmsHref } from "@/utils/sms";

const buttonClass =
  "flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-none bg-main-200 h-15 text-subtitle-01 text-gray-600 shadow-02";

interface EmergencyActionsProps {
  alert: AlertWebData;
}

export default function EmergencyActions({ alert }: EmergencyActionsProps) {
  const householdId = getHouseholdId();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [address, setAddress] = useState<EmergencyAddress | null>(null);
  const [loading, setLoading] = useState(!!householdId);

  // 권한(role)·가족 전화·긴급 주소를 실데이터로 확보. 주소는 미등록(404)일 수 있다.
  useEffect(() => {
    if (!householdId) return;
    let alive = true;
    Promise.all([
      getMembers(householdId).then((r) => r.members),
      getEmergencyAddress(householdId).catch(() => null),
    ])
      .then(([memberList, addr]) => {
        if (!alive) return;
        setMembers(memberList);
        setAddress(addr);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [householdId]);

  const me = members.find((m) => m.is_me);
  const isOwner = me?.role === "owner";
  const owner = members.find((m) => m.role === "owner");
  const familyPhones = members
    .filter((m) => !m.is_me)
    .map((m) => m.phone_number);
  const { stamp } = toAlertTimeParts(alert);

  // 딥링크는 반드시 클릭 핸들러 안에서 호출해야 한다. 자동 실행은 브라우저가 차단한다.
  const openSms = (recipients: string[], body?: string) => {
    window.location.href = buildSmsHref(recipients, body);
  };

  if (loading) {
    return (
      <div className="px-5 pt-8 text-center text-body-02 text-gray-300">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-5 pt-8">
      {isOwner ? (
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
            disabled={!address}
            className={`${buttonClass} disabled:opacity-40`}
            onClick={() =>
              address &&
              openSms(
                [EMERGENCY_NUMBER],
                buildReportBody(address, stamp, alert.sound),
              )
            }
          >
            <Mail size={24} />
            119 문자 신고
          </button>
          <button
            type="button"
            disabled={familyPhones.length === 0}
            className={`${buttonClass} disabled:opacity-40`}
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
              // §5.5 display_name (보호자가 지정한 별칭, 없으면 가입 시 이름)
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
