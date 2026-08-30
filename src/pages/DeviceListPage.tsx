import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import { getDevices, setConnection } from "@/api/deviceApi";
import { ApiError } from "@/lib/api";
import { getHouseholdId } from "@/lib/auth";
import { connectWs } from "@/lib/ws";
import { useCurrentHousehold } from "@/hooks/useCurrentHousehold";
import { deviceStatusMeta, roomImages } from "@/constants/room";
import { type RoomDevice } from "@/types/room";

export default function DeviceListPage() {
  const householdId = getHouseholdId();
  const { isOwner } = useCurrentHousehold();
  const [devices, setDevices] = useState<RoomDevice[]>([]);
  const [loading, setLoading] = useState(!!householdId);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!householdId) return;
    let alive = true;
    getDevices(householdId)
      .then((res) => alive && setDevices(res.devices))
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
  }, [householdId]);

  // WS device.status_changed — 실시간 ui_status 반영 (§9, 낙관적 업데이트 대신 서버 확정)
  useEffect(() => {
    if (!householdId) return;
    const ws = connectWs(
      householdId,
      () => {},
      (list) => setDevices(list),
      (device_id, ui_status) =>
        setDevices((prev) =>
          prev.map((d) =>
            d.device_id === device_id ? { ...d, ui_status } : d,
          ),
        ),
    );
    return () => ws.close();
  }, [householdId]);

  // 응답 스키마 미정의 → 성공 후 재조회로 상태 확정 (WS로도 정합)
  const reconnect = async (deviceId: string) => {
    if (!householdId) return;
    setBusyId(deviceId);
    try {
      await setConnection(householdId, deviceId, true);
      const res = await getDevices(householdId);
      setDevices(res.devices);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "재연결하지 못했어요.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="기기 관리" />

      <div className="flex flex-col gap-3 px-5 py-4">
        {!householdId ? (
          <p className="m-0 py-10 text-center text-body-02 text-gray-300">
            가구 연동이 필요합니다.
          </p>
        ) : loading ? (
          <p className="m-0 py-10 text-center text-body-02 text-gray-300">
            불러오는 중…
          </p>
        ) : error ? (
          <p className="m-0 py-10 text-center text-body-02 text-red-200">
            {error}
          </p>
        ) : (
          devices.map((device) => (
            <DeviceRow
              key={device.device_id}
              device={device}
              canControl={isOwner}
              busy={busyId === device.device_id}
              onReconnect={() => reconnect(device.device_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface DeviceRowProps {
  device: RoomDevice;
  canControl: boolean;
  busy: boolean;
  onReconnect: () => void;
}

function DeviceRow({ device, canControl, busy, onReconnect }: DeviceRowProps) {
  const status = deviceStatusMeta[device.ui_status];
  const isConnected = device.ui_status === "connected";

  return (
    <Link
      to={`/settings/device/${device.device_id}`}
      className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 no-underline shadow-02 transition-colors hover:bg-gray-100"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center">
        <img
          src={roomImages[device.location]}
          alt={`${device.location} 아이콘`}
          className="max-h-full object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.dotColor}`}
          />
          <span className="text-subtitle-03 text-gray-600">
            {device.location}
          </span>
        </div>
        <span className="text-body-02 text-gray-300">{status.label}</span>
      </div>

      {/* 재연결은 owner 전용. member는 조회만 (버튼 숨김) */}
      {isConnected || !canControl ? (
        <ChevronRight size={22} className="shrink-0 text-gray-200" />
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={(e) => {
            // 카드 전체가 Link라 상세 이동을 막고 재연결만 실행
            e.preventDefault();
            e.stopPropagation();
            onReconnect();
          }}
          className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-label-05 text-gray-400 disabled:opacity-40"
        >
          {busy ? "연결 중…" : "재연결"}
        </button>
      )}
    </Link>
  );
}
