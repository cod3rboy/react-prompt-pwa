import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PwaPromptProvider } from "../";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PwaPromptProvider enableLogging>
      <App />
    </PwaPromptProvider>
  </StrictMode>
);
