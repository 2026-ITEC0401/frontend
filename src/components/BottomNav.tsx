import { GoHome, GoBell, GoBellFill, GoHomeFill } from "react-icons/go";
import { BsGear, BsGearFill } from "react-icons/bs";
import { useLocation, NavLink } from "react-router-dom";

const navItemClass =
  "flex flex-1 flex-col items-center justify-center gap-1.5 cursor-pointer text-gray-300 transition-colors duration-200 ";

export default function BottomNav() {
  const location = useLocation();

  const isAlertsActive = location.pathname === "/alerts";
  const isHomeActive = location.pathname === "/";
  const isSettingsActive = location.pathname === "/settings";

  return (
    <div className="fixed inset-x-0 bottom-0 z-100 mx-auto flex h-21.25 w-full max-w-97.5 items-center justify-around  bg-white pb-[env(safe-area-inset-bottom)]">
      <NavLink to="/alerts" className={navItemClass}>
        {isAlertsActive ? <GoBellFill size={28} /> : <GoBell size={28} />}
        {isAlertsActive ? (
          <span className="text-label-03">알람</span>
        ) : (
          <span className="text-label-04">알람</span>
        )}
      </NavLink>

      <NavLink to="/" className={navItemClass}>
        {isHomeActive ? <GoHomeFill size={28} /> : <GoHome size={30} />}
        {isHomeActive ? (
          <span className="text-label-03">홈</span>
        ) : (
          <span className="text-label-04">홈</span>
        )}
      </NavLink>

      <NavLink to="/settings" className={navItemClass}>
        {isSettingsActive ? <BsGearFill size={28} /> : <BsGear size={28} />}
        {isSettingsActive ? (
          <span className="text-label-03">설정</span>
        ) : (
          <span className="text-label-04">설정</span>
        )}
      </NavLink>
    </div>
  );
}
