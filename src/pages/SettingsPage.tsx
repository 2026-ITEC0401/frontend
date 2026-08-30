import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, User } from "lucide-react";
import Header from "@/components/Header";
import { getMe } from "@/api/meApi";
import { getDevices } from "@/api/deviceApi";
import { logout } from "@/api/authApi";
import { useCurrentHousehold } from "@/hooks/useCurrentHousehold";
import { clearAuth, getHouseholdId, getRefreshToken } from "@/lib/auth";
import { getAlarmSoundEnabled } from "@/lib/preferences";
import type { AuthUser } from "@/types/auth";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { data: household, loading: householdLoading } = useCurrentHousehold();

  const [me, setMe] = useState<AuthUser | null>(null);
  const [deviceCount, setDeviceCount] = useState<{
    total: number;
    connected: number;
  } | null>(null);

  const alarmSoundLabel = getAlarmSoundEnabled() ? "소리 켬" : "소리 끔";

  useEffect(() => {
    let alive = true;
    getMe()
      .then((res) => alive && setMe(res))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const household_id = getHouseholdId();
    if (!household_id) return;
    let alive = true;
    getDevices(household_id)
      .then((res) => {
        if (!alive) return;
        setDeviceCount({
          total: res.devices.length,
          connected: res.devices.filter((d) => d.ui_status === "connected")
            .length,
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const handleLogout = async () => {
    // 명세 §4.3 POST /auth/logout — refresh token 폐기 (실패해도 로컬 세션은 정리)
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await logout(refreshToken);
    } catch {
      // 서버 폐기 실패해도 로컬 토큰은 반드시 정리
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const deviceValue = deviceCount
    ? `${deviceCount.total}대 중 ${deviceCount.connected}대 연결`
    : "";
  const profileSubtitle = deviceCount
    ? `기기 ${deviceCount.connected}대 연결됨`
    : "";
  const householdName = household?.household?.name;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="설정" showBackButton={false} />

      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-5 shadow-02">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-300">
            <User size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="m-0 text-subtitle-01 text-gray-600">
              {me?.name ?? "사용자"}님
            </p>
            <p className="m-0 text-body-02 text-gray-300">
              {householdLoading ? "" : (householdName ?? profileSubtitle)}
            </p>
          </div>
        </div>

        <MenuGroup>
          <MenuRow
            label="알림 설정"
            value={alarmSoundLabel}
            to="/settings/notifications"
          />
          <MenuRow
            label="기기 관리"
            value={deviceValue}
            to="/settings/devices"
          />
          <MenuRow
            label="소리 설정"
            value="긴급 4 · 일반 3"
            to="/settings/sound"
          />
        </MenuGroup>

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
