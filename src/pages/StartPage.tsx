import logo from "@/assets/logo.svg";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-gray-400">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <img src={logo} alt="Hearo" />
        <p className="text-center text-gray-200">
          집 안의 소리를 감지해
          <br />
          가족과 실시간으로 함께 확인해요.
        </p>
      </div>
      <div className="flex flex-col gap-3 px-5 pb-10">
        <Button variant="primary" onClick={() => navigate("/login")}>
          로그인
        </Button>
        <Button variant="outline-light" onClick={() => navigate("/signup")}>
          회원가입
        </Button>
      </div>
    </div>
  );
}
