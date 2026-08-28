import { type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, User } from "lucide-react";
import Header from "@/components/Header";
import { clearAuth } from "@/lib/auth";
import { getAlarmSoundEnabled } from "@/lib/preferences";
import { mockDeviceData } from "@/mocks/room";
import { MOCK_MY_USER_ID, mockMembers } from "@/mocks/household";

export default function SettingsPage() {
  const navigate = useNavigate();

  // GET /me · GET /households/current 연동 지점 (지금은 mock)
  const me = mockMembers.find((m) => m.user_id === MOCK_MY_USER_ID);
  const totalDevices = mockDeviceData.length;
  const connectedDevices = mockDeviceData.filter(
    (d) => d.ui_status === "connected",
  ).length;
  const alarmSoundLabel = getAlarmSoundEnabled() ? "소리 켬" : "소리 끔";

  const handleLogout = () => {
    // TODO(API): POST /auth/logout 으로 refresh token 폐기 (명세 §4.3)
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="설정" showBackButton={false} />

      <div className="flex flex-col gap-4 px-5 py-4">
        {/* 프로필 카드 */}
        <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-5 shadow-02">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-300">
            <User size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="m-0 text-subtitle-01 text-gray-600">
              {me?.display_name ?? "사용자"}님
            </p>
            <p className="m-0 text-body-02 text-gray-300">
              기기 {totalDevices}대 연결됨
            </p>
          </div>
        </div>

        {/* 메뉴 그룹 1 — 기기·알림 */}
        <MenuGroup>
          <MenuRow
            label="알림 설정"
            value={alarmSoundLabel}
            to="/settings/notifications"
          />
          <MenuRow
            label="기기 관리"
            value={`${totalDevices}대 중 ${connectedDevices}대 연결`}
            to="/settings/devices"
          />
          <MenuRow
            label="소리 설정"
            value="긴급 4 · 일반 3"
            to="/settings/sound"
          />
        </MenuGroup>

        {/* 메뉴 그룹 2 — 계정·가족 */}
        <MenuGroup>
          <MenuRow label="비밀번호 설정" to="/settings/password" />
          <MenuRow label="가족 설정" to="/settings/family" />
          <MenuRow label="개인정보 조회" to="/settings/profile" />
        </MenuGroup>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 cursor-pointer bg-transparent text-body-02 text-gray-300"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

function MenuGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-white shadow-02">
      {children}
    </div>
  );
}

interface MenuRowProps {
  label: string;
  value?: string;
  to: string;
}

function MenuRow({ label, value, to }: MenuRowProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-5 py-4.5 no-underline transition-colors hover:bg-gray-100"
    >
      <span className="text-label-01 text-gray-600">{label}</span>
      <span className="flex items-center gap-1 text-body-02 text-gray-300">
        {value}
        <ChevronRight size={20} className="text-gray-200" />
      </span>
    </Link>
  );
}
