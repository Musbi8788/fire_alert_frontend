import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (apiBaseUrl && apiBaseUrl.trim() !== "") {
  setBaseUrl(apiBaseUrl);
} else {
  setBaseUrl(null);
}

setAuthTokenGetter(() => localStorage.getItem("fire_alert_token"));

createRoot(document.getElementById("root")!).render(<App />);
