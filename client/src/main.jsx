import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import OwnerPanel from "./OwnerPanel.jsx";

function Root() {
  const [ownerMode, setOwnerMode] = useState(
    window.location.pathname === "/owner"
  );

  if (ownerMode) {
    return (
      <>
        <div style={{ position: "fixed", top: 15, right: 15, zIndex: 10 }}>
          <button onClick={() => {
            window.history.pushState({}, "", "/");
            setOwnerMode(false);
          }}>
            Public Estimator
          </button>
        </div>

        <OwnerPanel />
      </>
    );
  }

  return (
    <>
      <div style={{ position: "fixed", top: 15, right: 15, zIndex: 10 }}>
        <button onClick={() => {
          window.history.pushState({}, "", "/owner");
          setOwnerMode(true);
        }}>
          Owner Panel
        </button>
      </div>

      <App />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);