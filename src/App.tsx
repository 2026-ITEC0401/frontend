import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import SettingsPage from "@/pages/SettingsPage";
import AlertsPage from "@/pages/AlertsPage";
import AlertInfoPage from "@/pages/AlertInfoPage";
import DeviceSettingPage from "@/pages/DeviceSettingPage";
import DeviceListPage from "@/pages/DeviceListPage";
import FamilySettingsPage from "@/pages/FamilySettingsPage";
import NotificationSettingsPage from "@/pages/NotificationSettingsPage";
import PasswordSettingsPage from "@/pages/PasswordSettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import LoginPage from "@/pages/LoginPage";
import AppLayout from "@/components/AppLayout";
import RequireAuth from "@/components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <Outlet />
              </RequireAuth>
            }
          >
            <Route path="/" element={<MainPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/devices" element={<DeviceListPage />} />
            <Route
              path="/settings/device/:id"
              element={<DeviceSettingPage />}
            />
            <Route path="/settings/family" element={<FamilySettingsPage />} />
            <Route
              path="/settings/notifications"
              element={<NotificationSettingsPage />}
            />
            {/* 소리 설정은 9월 평가 후 구현 예정 (백엔드 회신 1번) */}
            <Route
              path="/settings/sound"
              element={<ComingSoonPage title="소리 설정" />}
            />
            <Route
              path="/settings/password"
              element={<PasswordSettingsPage />}
            />
            <Route path="/settings/profile" element={<ProfilePage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/alerts/:id" element={<AlertInfoPage />} />
          </Route>
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
