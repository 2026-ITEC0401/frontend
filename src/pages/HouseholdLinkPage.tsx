import Header from "@/components/Header";
import Button from "@/components/Button";
import { mockLinkPreview } from "@/mocks/household";
import { useNavigate } from "react-router-dom";

export default function HouseholdLinkPage() {
  const navigate = useNavigate();
  const ROOM_LABELS = ["현관", "거실", "안방", "화장실"];
  const registeredAt = mockLinkPreview.household?.created_at
    .slice(0, 7)
    .replace("-", ".");

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-16">
      <Header title="가구 연동" />
      <div className="flex flex-1 flex-col gap-6 px-5 pt-4">
        <div className="bg-white rounded-xl p-5 shadow-03">
          <div className="mb-4">
            <p className="text-subtitle-03 text-gray-300">연동 대상 가구</p>
          </div>
          <div className="mb-3">
            <h1 className="text-head-03 text-gray-500">
              {mockLinkPreview.household?.name}
            </h1>
            <p className="text-gray-300">{`가구원 ${mockLinkPreview.household?.member_count}명 · 등록일 ${registeredAt}`}</p>
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
        <Button variant="dark" onClick={() => navigate("/")}>
          연동하기
        </Button>
      </div>
    </div>
  );
}
