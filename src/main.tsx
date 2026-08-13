import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "./styles/global.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element를 찾을 수 없음");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
