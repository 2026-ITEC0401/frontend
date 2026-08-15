import { FiBell, FiHome, FiSettings } from "react-icons/fi";

const navItemClass =
  "flex flex-1 flex-col items-center justify-center gap-1.5 cursor-pointer text-[#374151] transition-colors duration-200 hover:text-[#111827] active:text-[#111827]";

export default function Footer() {
  return (
    <div
      // 아이폰 하단 홈 바(Home Indicator) 영역을 침범하지 않도록 여백 확보
      // 알림 카드들이 스크롤될 때 Footer 위로 올라오지 않게 제일 위로 띄움
      className="fixed inset-x-0 bottom-0 z-[100] mx-auto flex h-[85px] w-full max-w-[390px] items-center justify-around border-t border-[#e5e7eb] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
    >
      <div className={navItemClass}>
        <FiBell size={28} />
        <span className="text-sm font-bold">알람</span>
      </div>

      <div className={navItemClass}>
        <FiHome size={28} />
        <span className="text-sm font-bold">홈</span>
      </div>

      <div className={navItemClass}>
        <FiSettings size={28} />
        <span className="text-sm font-bold">설정</span>
      </div>
    </div>
  );
}
