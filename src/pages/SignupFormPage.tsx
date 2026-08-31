import Header from "@/components/Header";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import type { SignupType } from "@/types/signup";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/api/authApi";
import { ApiError } from "@/lib/api";
import { setTokens, setHouseholdId } from "@/lib/auth";

interface SignupFormPageProps {
  signupType: SignupType;
}

export default function SignupFormPage({ signupType }: SignupFormPageProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [login_id, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [password_check, setPasswordCheck] = useState("");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const isNew = signupType === "new_household";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await signup({
        login_id,
        name,
        phone_number: phoneNumber,
        password,
        signup_type: signupType,
        household_name: isNew ? `${name} 가구` : undefined,
        terms_service_agreed: agreed,
        privacy_agreed: agreed,
      });

      setTokens(res.tokens.access_token, res.tokens.refresh_token);

      if (res.user.household_id) {
        setHouseholdId(res.user.household_id);
      }

      // 신규 가구 → 주소 등록 / 가족 → 초대 코드
      navigate(isNew ? "/signup/address" : "/signup/invite");
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
  // 빈 칸 없음 + 비밀번호 일치. 상세 규칙(§2.3)은 서버 field_errors로 처리
  const isFormValid =
    name.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    login_id.trim() !== "" &&
    password !== "" &&
    password_check !== "" &&
    password === password_check &&
    agreed;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-16">
      <Header title="회원가입" />

      <div className="flex flex-1 flex-col gap-6 px-5 pt-4">
        <div className="flex rounded-xl bg-border text-subtitle-03 p-1">
          <div
            className={`flex-1 rounded-lg py-3 text-center ${
              isNew ? "bg-gray-500 text-white" : " text-gray-300"
            }`}
          >
            신규 가구
          </div>
          <div
            className={`flex-1 rounded-lg py-3 text-center ${
              isNew ? " text-gray-300" : "bg-gray-500 text-white"
            }`}
          >
            가족 · 보호자
          </div>
        </div>
        <p className="text-body-01 text-gray-300">
          {isNew ? (
            <>
              신규 가구로 가입하면 센서 설치와
              <br />
              가구 정보를 직접 등록합니다.
            </>
          ) : (
            <>
              가입 후 초대 코드를 입력하면
              <br />
              가구 현황을 함께 볼 수 있어요.
            </>
          )}
        </p>

        <div className="flex flex-col gap-3">
          <Input
            id="name"
            label="이름"
            type="text"
            value={name}
            onChange={setName}
            placeholder="이름"
            autoComplete="name"
          />
          <Input
            id="phoneNumber"
            label="휴대폰 번호"
            type="text"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="휴대폰 번호"
            autoComplete="tel"
          />
          <Input
            id="login_id"
            label="아이디"
            type="text"
            value={login_id}
            onChange={setLoginId}
            placeholder="아이디"
            autoComplete="username"
          />

          <Input
            id="password"
            label="비밀번호"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="비밀번호"
            autoComplete="new-password"
          />
          <Input
            id="password_check"
            label="비밀번호 확인"
            type="password"
            value={password_check}
            onChange={setPasswordCheck}
            placeholder="비밀번호 확인"
            autoComplete="new-password"
          />
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setAgreed(!agreed)}
          className="flex items-center gap-3 text-left"
        >
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
              agreed ? "bg-gray-500" : "border-2 border-gray-200 bg-white"
            }`}
          >
            {agreed && <Check size={16} className="text-white" />}
          </div>
          <span className="text-body-02 text-gray-500">
            서비스 이용약관 · 개인정보 동의 (필수)
          </span>
        </button>

        {error && <p className="text-body-02 text-red-200">{error}</p>}
        <Button
          variant="dark"
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
        >
          가입 완료
        </Button>
      </div>
    </div>
  );
}
