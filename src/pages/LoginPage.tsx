import { useState } from "react";
import { login } from "@/api/authApi";
import { ApiError } from "@/lib/api";
import { setTokens, setHouseholdId } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function LoginPage() {
  const [login_id, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(login_id, password);
      setTokens(res.tokens.access_token, res.tokens.refresh_token);
      if (
        res.user.household_link_status !== "linked" ||
        !res.user.household_id
      ) {
        setError("가구 연동이 필요합니다. 초대 코드를 입력해 주세요.");
        return;
      }
      setHouseholdId(res.user.household_id);
      navigate("/", { replace: true });
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("알 수 없는 오류");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 px-5 pb-16 gap-6 ">
      <div className="flex h-18 items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="-ml-2 flex h-10 w-10 items-center justify-center"
        >
          <ChevronLeft size={28} className="text-gray-500" />
        </button>
      </div>
      <h1 className="text-head-01 text-gray-500">로그인</h1>
      <p className="text-gray-400 text-body-01">
        가구 현황을 확인하려면
        <br />
        로그인해 주세요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
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
          autoComplete="current-password"
        />

        {error && <p className="text-red-200">{error}</p>}
        <div className="flex-1" />
        <Button variant="dark" type="submit" disabled={loading}>
          로그인
        </Button>
      </form>
    </div>
  );
}
