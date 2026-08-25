import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import SettingsPage from "@/pages/SettingsPage";
import AlertsPage from "@/pages/AlertsPage";
import AlertInfoPage from "@/pages/AlertInfoPage";
import DeviceSettingPage from "@/pages/DeviceSettingPage";
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
            <Route
              path="/settings/device/:id"
              element={<DeviceSettingPage />}
            />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/alerts/:id" element={<AlertInfoPage />} />
          </Route>
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
