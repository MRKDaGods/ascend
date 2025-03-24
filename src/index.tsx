import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Ensure this is correct
import "./index.css";
import App from "./App"; // ✅ Ensure this file exists
import reportWebVitals from "./reportWebVitals"; // ✅ Ensure this file exists

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found! Make sure your index.html has a <div id='root'></div>");
}

// Start measuring performance
reportWebVitals();
