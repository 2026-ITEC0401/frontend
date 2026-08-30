import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Toggle from "@/components/Toggle";
import { getDevices, setConnection, setLedAlert } from "@/api/deviceApi";
import { ApiError } from "@/lib/api";
import { getHouseholdId } from "@/lib/auth";
import { connectWs } from "@/lib/ws";
import { useCurrentHousehold } from "@/hooks/useCurrentHousehold";
import { roomImages } from "@/constants/room";
import { type RoomDevice } from "@/types/room";

export default function DeviceSettingPage() {
  const { id } = useParams<{ id: string }>();
  const householdId = getHouseholdId();
  const { isOwner } = useCurrentHousehold();

  const [device, setDevice] = useState<RoomDevice | null>(null);
  const [loading, setLoading] = useState(!!householdId);
  const [error, setError] = useState<string | null>(null);
  // 어떤 토글이 서버 응답 대기 중인지 (낙관적 업데이트 대신 진행 표시)
  const [pending, setPending] = useState<"connection" | "led" | null>(null);

  // GET /households/{id}/devices — 단건 조회 API가 없어 목록에서 대상 기기 추출
  useEffect(() => {
    if (!householdId) return;
    let alive = true;
    getDevices(householdId)
      .then((res) => {
        if (!alive) return;
        setDevice(res.devices.find((d) => d.device_id === id) ?? null);
      })
      .catch(
        (e) =>
          alive &&
          setError(
            e instanceof ApiError ? e.message : "기기를 불러오지 못했어요.",
          ),
      )
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [householdId, id]);

  // WS device.status_changed — 이 기기 ui_status 실시간 반영 (§9)
  useEffect(() => {
    if (!householdId) return;
    const ws = connectWs(
      householdId,
      () => {},
      () => {},
      (device_id, ui_status) => {
        if (device_id === id)
          setDevice((prev) => (prev ? { ...prev, ui_status } : prev));
      },
    );
    return () => ws.close();
  }, [householdId, id]);

  // 변경 후 서버 상태로 재확정 (낙관적 업데이트 배제, 응답 스키마 미정의 대응)
  const refetch = async () => {
    if (!householdId) return;
    const res = await getDevices(householdId);
    setDevice(res.devices.find((d) => d.device_id === id) ?? null);
  };

  const toggleConnection = async (next: boolean) => {
    if (!householdId || !device) return;
    setPending("connection");
    setError(null);
    try {
      await setConnection(householdId, device.device_id, next);
      await refetch();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "변경하지 못했어요.");
    } finally {
      setPending(null);
    }
  };

  const toggleLed = async (next: boolean) => {
    if (!householdId || !device) return;
    setPending("led");
    setError(null);
    try {
      await setLedAlert(householdId, device.device_id, next);
      await refetch();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "변경하지 못했어요.");
    } finally {
      setPending(null);
    }
  };

  if (!householdId) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header title="상세 보기" />
        <div className="flex flex-1 items-center justify-center text-body-01 text-gray-300">
          가구 연동이 필요합니다.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header title="상세 보기" />
        <div className="flex flex-1 items-center justify-center text-body-01 text-gray-300">
          불러오는 중…
        </div>
      </div>
    );
  }

  if (error && !device) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header title="상세 보기" />
        <div className="flex flex-1 items-center justify-center text-body-01 text-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header title="상세 보기" />
        <div className="flex flex-1 items-center justify-center text-body-01 text-gray-300">
          기기를 찾을 수 없어요.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="상세 보기" />

      <div className="flex flex-col items-center py-12">
        <div
          className={`flex h-50 w-50 flex-col items-center justify-center gap-1 rounded-full bg-white shadow-01 ${
            device.ui_status === "connected"
              ? "border-8 border-success"
              : "border-8 border-gray-200"
          }`}
        >
          <img
            src={roomImages[device.location]}
            alt={`${device.location} 아이콘`}
            className="h-24 w-24 object-contain"
          />
          <p className="m-0 text-head-03 text-gray-600">{device.location}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5">
        <SettingRow label="기기 연결 상태">
          <Toggle
            checked={device.desired_mqtt_connected}
            disabled={!isOwner || pending !== null}
            loading={pending === "connection"}
            onChange={toggleConnection}
          />
        </SettingRow>

        <SettingRow label="LED 알림">
          <Toggle
            checked={device.led_alert_enabled}
            disabled={!isOwner || pending !== null}
            loading={pending === "led"}
            onChange={toggleLed}
          />
        </SettingRow>

        {/* owner만 변경 가능 (§6.2·§6.3). member는 조회 전용 */}
        {!isOwner && (
          <p className="m-0 px-1 text-body-03 text-gray-300">
            기기 설정은 가구 소유자만 변경할 수 있어요.
          </p>
        )}
        {error && <p className="m-0 px-1 text-body-03 text-red-200">{error}</p>}
      </div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  children: React.ReactNode;
}

function SettingRow({ label, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between rounded-4xl bg-white px-5 py-4 shadow-02">
      <p className="m-0 text-subtitle-02 text-gray-500">{label}</p>
      {children}
    </div>
  );
}
