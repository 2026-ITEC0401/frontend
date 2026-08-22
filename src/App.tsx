import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import SettingsPage from "@/pages/SettingsPage";
import AlertsPage from "@/pages/AlertsPage";
import AlertInfoPage from "@/pages/AlertInfoPage";
import DeviceSettingPage from "@/pages/DeviceSettingPage";
import AppLayout from "@/components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/device/:id" element={<DeviceSettingPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/:id" element={<AlertInfoPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
