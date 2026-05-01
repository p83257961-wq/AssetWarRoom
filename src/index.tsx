import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PasswordGate from "./PasswordGate";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <PasswordGate>
      <App />
    </PasswordGate>
  </React.StrictMode>
);
