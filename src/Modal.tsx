import Modal from "react-modal";

// Required for accessibility, attaches the modal to the app root
Modal.setAppElement("#root");

export const KeyTrusteeModal = ({
  isModalOpen,
  closeModal,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Key Trustee Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          backgroundColor: "#242424",
          color: "rgba(255, 255, 255, 0.87)",
          padding: "20px",
          borderRadius: "10px",
          position: "relative",
          border: "none",
        },
      }}
    >
      <div>
        <svg
          viewBox="0 0 500 30"
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

          <text x="160" y="25" className="logo-text">
            Key Trustee
          </text>
        </svg>
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>

      <div style={{ textAlign: "center" }}>
        <p>Your session has expired, please begin a new one to proceed.</p>
        <button
          style={{
            backgroundColor: "rgba(255, 255, 255,0.15)",
            width: "100%",
          }}
        >
          Create Session
        </button>
      </div>
    </Modal>
  );
};
