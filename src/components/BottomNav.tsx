import { GoGear, GoHome, GoBell } from "react-icons/go";

const navItemClass =
  "flex flex-1 flex-col items-center justify-center gap-1.5 cursor-pointer text-gray-300 transition-colors duration-200 ";

export default function Footer() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-100 mx-auto flex h-21.25 w-full max-w-97.5 items-center justify-around  bg-white pb-[env(safe-area-inset-bottom)]">
      <div className={navItemClass}>
        <GoBell size={28} />
        <span className="text-label-04">알람</span>
      </div>

      <div className={navItemClass}>
        <GoHome size={28} />
        <span className="text-label-04">홈</span>
      </div>

      <div className={navItemClass}>
        <GoGear size={28} />
        <span className="text-label-04">설정</span>
      </div>
    </div>
  );
}
