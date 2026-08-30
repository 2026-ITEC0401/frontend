import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { changePassword } from "@/api/meApi";
import { ApiError } from "@/lib/api";
import { clearAuth } from "@/lib/auth";

// 명세 §2.3 비밀번호 규칙: 10자 이상, 영문자와 숫자 포함
function validateNewPassword(pw: string): string | null {
  if (pw.length < 10) return "10자 이상 입력해 주세요.";
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) {
    return "영문자와 숫자를 모두 포함해 주세요.";
  }
  return null;
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-body-01 text-gray-600 outline-none focus:border-main-200";

// 명세 §4.5 PATCH /me/password — 성공(204) 시 토큰 전면 무효화 → 재로그인.
export default function PasswordSettingsPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  // 서버 검증 오류(field_errors) — 입력칸 하단 노출
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});

    if (!current) {
      setError("현재 비밀번호를 입력해 주세요.");
      return;
    }
    const pwError = validateNewPassword(next);
    if (pwError) {
      setError(pwError);
      return;
    }
    if (next !== confirm) {
      setError("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(current, next);
      // 성공 시 204 → 기존 토큰 전면 무효화. 로컬 세션 정리 후 재로그인 유도.
      setDone(true);
      setTimeout(() => {
        clearAuth();
        navigate("/login", { replace: true });
      }, 1500);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.field_errors) setFieldErrors(e.field_errors);
        setError(e.message);
      } else {
        setError("비밀번호를 변경하지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
        <Header title="비밀번호 설정" />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
          <p className="m-0 text-subtitle-02 text-gray-600">
            비밀번호를 변경했어요.
          </p>
          <p className="m-0 text-body-02 text-gray-300">
            보안을 위해 다시 로그인해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="비밀번호 설정" />

      <div className="flex flex-col gap-5 px-5 py-6">
        <Field label="현재 비밀번호" error={fieldErrors.current_password}>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            className={inputClass}
          />
        </Field>

        <Field label="새 비밀번호" error={fieldErrors.new_password}>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
          <p className="m-0 text-body-03 text-gray-300">
            10자 이상, 영문자와 숫자를 포함해 주세요.
          </p>
        </Field>

        <Field label="새 비밀번호 확인">
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>

        {error && <p className="m-0 text-body-02 text-red-200">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-2 h-14 cursor-pointer rounded-lg bg-gray-500 text-subtitle-02 text-white disabled:opacity-40"
        >
          {submitting ? "변경 중…" : "변경하기"}
        </button>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 text-label-03 text-gray-500">{label}</p>
      {children}
      {error && <p className="m-0 text-body-03 text-red-200">{error}</p>}
    </div>
  );
}
