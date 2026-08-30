import Button from "@/components/Button";
import { Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompleteHeader from "@/components/CompleteHeader";

export default function InviteCodePage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-16">
      <CompleteHeader onSkip={() => navigate("/")} />

      <div className="flex flex-1 flex-col gap-6 px-5 pt-4">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-head-02 text-gray-500">가족 초대 코드 입력</h1>
          <p className="text-gray-300 text-body-01">
            대상자 가구에서 발급된
            <br />
            6자리 코드를 입력해 주세요.
          </p>
        </div>
        <div className="relative">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
            maxLength={6}
            autoCapitalize="characters"
            aria-label="초대 코드"
            className="absolute inset-0 h-full w-full opacity-0"
          />

          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex h-15 flex-1 items-center justify-center rounded-xl border-2 bg-white text-head-03 text-gray-500 ${
                  i === code.length ? "border-main-200" : "border-border"
                }`}
              >
                {code[i] ?? "–"}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Info size={16} className="text-gray-300" />
          <p className="text-body-02 text-gray-300">
            코드는 설정 › 가족 관리에서 발급할 수 있어요.
          </p>
        </div>
        <div className="flex-1" />

        <Button variant="dark" onClick={() => {}} disabled={code.length !== 6}>
          가구 찾기
        </Button>
      </div>
    </div>
  );
}
