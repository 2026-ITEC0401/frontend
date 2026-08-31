import Header from "@/components/Header";
import Button from "@/components/Button";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { link } from "@/api/householdApi";
import { ApiError } from "@/lib/api";
import { setHouseholdId } from "@/lib/auth";
import type { HouseholdLinkPreview } from "@/types/household";
import { useState } from "react";

export default function HouseholdLinkPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    preview: HouseholdLinkPreview;
    inviteCode: string;
  } | null;

  const ROOM_LABELS = ["현관", "거실", "안방", "화장실"];
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!state) {
    return <Navigate to="/signup/invite" replace />;
  }

  // 이 아래는 state가 확실히 있는 상태
  const household = state.preview.household;
  const inviteCode = state.inviteCode;
  const registeredAt = household?.created_at.slice(0, 7).replace("-", ".");

  async function handleLink() {
    setError(null);
    setLoading(true);
    try {
      const res = await link(inviteCode);
      setHouseholdId(res.household_id);
      navigate("/", { replace: true });
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("알 수 없는 오류가 발생했어요.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-16">
      <Header title="가구 연동" />
      <div className="flex flex-1 flex-col gap-6 px-5 pt-4">
        <div className="bg-white rounded-xl p-5 shadow-03">
          <div className="mb-4">
            <p className="text-subtitle-03 text-gray-300">연동 대상 가구</p>
          </div>
          <div className="mb-3">
            <h1 className="text-head-03 text-gray-500">{household?.name}</h1>
            <p className="text-gray-300">{`가구원 ${household?.member_count}명 · 등록일 ${registeredAt}`}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ROOM_LABELS.map((room) => (
              <span
                key={room}
                className="rounded-full bg-gray-100 px-3 py-1 text-label-06 text-gray-300"
              >
                {room}
              </span>
            ))}
          </div>
        </div>
        <div className="border border-main-200 bg-yellow-100 rounded-xl p-4 ">
          <p className="text-gray-400">
            연동하면 이 가구의 알림과
            <br />
            감지 이력을 함께 받게 됩니다.
          </p>
        </div>
        <div className="flex-1" />
        {error && <p className="text-body-02 text-red-200">{error}</p>}
        <Button variant="dark" onClick={handleLink} disabled={loading}>
          연동하기
        </Button>
      </div>
    </div>
  );
}
