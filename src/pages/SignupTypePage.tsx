import Button from "@/components/Button";
import type { SignupType } from "@/types/signup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import TypeCard from "@/components/TypeCard";

export default function SignupTypePage() {
  const [signupType, setSignupType] = useState<SignupType | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-16">
      <Header title="회원가입" />

      <div className="flex flex-1 flex-col gap-6 px-5 pt-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-head-02 text-gray-500">가입 유형 선택</h1>
          <p className="text-body-01 text-gray-300">
            어떤 방식으로 이용하시나요?
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <TypeCard
            title="신규 가구 등록"
            description={
              <>
                우리 집을 처음 등록합니다.
                <br />
                센서 기기 설정을 진행해요.
              </>
            }
            isSelected={signupType === "new_household"}
            onClick={() => setSignupType("new_household")}
          />
          <TypeCard
            title="가족 · 보호자로 참여"
            description={
              <>
                이미 등록된 가구에
                <br />
                초대 코드로 연동합니다.
              </>
            }
            isSelected={signupType === "family_member"}
            onClick={() => setSignupType("family_member")}
          />
        </div>

        <div className="flex-1" />

        <Button
          variant="dark"
          disabled={signupType === null}
          onClick={() =>
            navigate(
              signupType === "new_household" ? "/signup/new" : "/signup/family",
            )
          }
        >
          다음
        </Button>
      </div>
    </div>
  );
}
