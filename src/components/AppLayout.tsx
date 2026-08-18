import { type ReactNode } from "react";
import BottomNav from "@/components/BottomNav";
interface AppLayoutProps {
  children: ReactNode;
}

// children : 페이지들
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative mx-auto w-full max-w-97.5 min-h-screen overflow-auto bg-[#c0c0c0]">
      {children}
      <BottomNav />
    </div>
  );
}
