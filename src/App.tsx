import "./App.css";
import { KEYTRUSTEE_URL, APPLICATION_ID } from "./config";
import ktIcon from "./assets/icon.png";
import { AiChat } from "@nlux/react";
import { personas } from "./personas";
import "@nlux/themes/nova.css";
import { useEffect, useState } from "react";
import { createStreamAdapter } from "./adapters";
import { KeyTrusteeModal } from "./Modal";

function App() {
  const [adapter, setAdapter] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin !== KEYTRUSTEE_URL) {
        return;
      }

      if (event.data && event.data.type === "LOGIN_SUCCESS") {
        const sessionId = event.data.sessionId;
        const applicationId = APPLICATION_ID.toString();
        const baseAdapter = createStreamAdapter({
          sessionId,
          applicationId,
          openModal,
        });
        setAdapter(baseAdapter);
      }
    });
  }, []);

  const openKeyTrustee = () => {
    const newWindow = window.open(
      `${KEYTRUSTEE_URL}?application_id=${APPLICATION_ID}`,
      "_blank",
      "noopener=false"
    );

    if (newWindow) {
      newWindow.focus();
    } else {
      console.error("Failed to open new window");
    }
  };

  return (
    <>
      <div>
        <svg
          viewBox="0 0 500 100"
          preserveAspectRatio="xMinYMin meet"
          className="logo-svg"
        >
          <defs>
            <linearGradient
              id="gold-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#ffd700", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#7d5100", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          <text x="50" y="75" className="logo-text-large">
            Key Trustee
          </text>
        </svg>
      </div>
      <div>
        <h1>AI App Starter</h1>
        <p>
          This starter provides everything you need to quickly create small AI
          applications. Once you've registered your application on{" "}
          <a href="https://app.keytrustee.org/">Key Trustee</a>, add your application's ID to your{" "}
          <strong>config.ts</strong> file.
        </p>
        {APPLICATION_ID == -1 ? (
          <p style={{ color: "rgb(192, 0, 0)" }}>
            You need to configure your Key Trustee application ID in your{" "}
            <strong>config.ts</strong> file.
          </p>
        ) : (
          ""
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={openKeyTrustee}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
            }}
          >
            <img src={ktIcon} alt="KT Icon" style={{ height: "24px" }} />
            Create Session
          </button>
        </div>
      </div>
      <div className="card" style={{ minWidth: 420, minHeight: 350 }}>
        <AiChat adapter={adapter} personaOptions={personas} />
      </div>

      <KeyTrusteeModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
}

export default App;
