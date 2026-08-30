import { Loader2 } from "lucide-react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  // 서버 응답 대기 중 표시 (낙관적 업데이트를 쓰지 않으므로 진행 중 피드백 제공)
  loading?: boolean;
}

export default function Toggle({
  checked,
  onChange,
  disabled,
  loading,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={loading}
      disabled={disabled || loading}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-main-200" : "bg-gray-200"
      } ${
        loading
          ? "cursor-wait"
          : disabled
            ? "cursor-not-allowed opacity-40"
            : "cursor-pointer"
      }`}
    >
      <span
        className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-all duration-200 ${
          checked ? "left-7" : "left-1"
        }`}
      >
        {loading && (
          <Loader2 size={14} className="animate-spin text-gray-300" />
        )}
      </span>
    </button>
  );
}
