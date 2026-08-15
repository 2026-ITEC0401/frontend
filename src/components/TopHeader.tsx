import userImg from "@/assets/user.svg";
import alertImg from "@/assets/alert-main.svg";

interface TopHeaderProps {
  userName: string;
}

export default function TopHeader({ userName }: TopHeaderProps) {
  return (
    <header className="flex items-center justify-between px-2">
      <div className="flex flex-row items-center justify-center gap-3">
        <img
          src={userImg}
          className="h-[50px] w-[50px] cursor-pointer rounded-full"
        ></img>
        <p className="m-0 p-0 text-sm leading-[1.35] font-light text-white">
          안녕하세요
          <br />
          <span className="font-semibold">{userName}</span>님
        </p>
      </div>
      <img src={alertImg} className="cursor-pointer"></img>
    </header>
  );
}
