import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center bg-white px-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로 가기"
        className="absolute left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
      >
        <ChevronLeft size={28} />
      </button>
      <h1 className="m-0 w-full text-center text-subtitle-01 text-gray-500">
        {title}
      </h1>
    </header>
  );
}
