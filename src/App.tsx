import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import AppLayout from "@/components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
