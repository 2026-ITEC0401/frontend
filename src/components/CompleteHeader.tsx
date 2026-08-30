import { Check } from "lucide-react";

interface CompleteHeaderProps {
  onSkip: () => void;
}

export default function CompleteHeader({ onSkip }: CompleteHeaderProps) {
  return (
    <div className="flex items-center justify-between h-18 px-5">
      <div className="flex items-center gap-1">
        <Check size={20} className="text-success" />
        <p className="text-label-03 text-success">가입 완료</p>
      </div>
      <button
        type="button"
        onClick={onSkip}
        className="text-label-03 text-gray-300"
      >
        건너뛰기
      </button>
    </div>
  );
}
