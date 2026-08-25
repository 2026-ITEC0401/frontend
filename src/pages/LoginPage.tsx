import { useState } from "react";
import { login } from "@/api/authApi";
import { ApiError } from "@/lib/api";
import { setTokens, setHouseholdId } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [login_id, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit() {
    setError(null);
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
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">로그인</h1>

      <label className="mb-2 block text-lg" htmlFor="login_id">
        아이디
      </label>
      <input
        id="login_id"
        className="mb-4 w-full rounded border p-3 text-lg"
        value={login_id}
        onChange={(e) => setLoginId(e.target.value)}
      />

      <label className="mb-2 block text-lg" htmlFor="password">
        비밀번호
      </label>
      <input
        id="password"
        type="password"
        className="mb-6 w-full rounded border p-3 text-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="mb-4 text-lg text-red-600">{error}</p>}
      <button
        className="w-full rounded bg-black p-4 text-lg text-white"
        onClick={handleSubmit}
      >
        로그인
      </button>
    </div>
  );
}
