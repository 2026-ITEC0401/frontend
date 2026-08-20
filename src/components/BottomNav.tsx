import { Bell, Home, Settings } from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";

const navItemClass =
  "flex flex-1 flex-col items-center justify-center gap-1 cursor-pointer text-gray-300 transition-colors duration-200 ";

const activeIconClass = "text-gray-600";
const activeLabelClass = "text-label-03 text-gray-600";
const inactiveLabelClass = "text-label-04";

export default function BottomNav() {
  const location = useLocation();

  const isAlertsActive = location.pathname === "/alerts";
  const isHomeActive = location.pathname === "/";
  const isSettingsActive = location.pathname === "/settings";

  return (
    <div className="fixed inset-x-0 bottom-0 z-100 mx-auto flex h-20 w-full max-w-97.5 items-center justify-around  bg-white pb-[env(safe-area-inset-bottom)]">
      <NavLink to="/alerts" className={navItemClass}>
        <Bell size={28} className={isAlertsActive ? activeIconClass : ""} />
        <span className={isAlertsActive ? activeLabelClass : inactiveLabelClass}>
          알람
        </span>
      </NavLink>

      <NavLink to="/" className={navItemClass}>
        <Home size={28} className={isHomeActive ? activeIconClass : ""} />
        <span className={isHomeActive ? activeLabelClass : inactiveLabelClass}>
          홈
        </span>
      </NavLink>

      <NavLink to="/settings" className={navItemClass}>
        <Settings size={28} className={isSettingsActive ? activeIconClass : ""} />
        <span
          className={isSettingsActive ? activeLabelClass : inactiveLabelClass}
        >
          설정
        </span>
      </NavLink>
    </div>
  );
}
