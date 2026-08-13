import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import GlobalStyle from "./styles/global.jsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element를 찾을 수 없음");
}

createRoot(rootElement).render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>,
);
