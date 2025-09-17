import React from "react";
import { useConfirmationModalStore } from "../../../store/confirmationModalStore";
import ConfigModal from "../ConfigModal/ConfigModal";
import { AlertCircle } from "lucide-react";

export const AlertBlockWithoutEdges: React.FC = () => {
  const { isOpen, handleModalResponse } = useConfirmationModalStore();

  return (
    <ConfigModal
      isOpen={isOpen}
      onOpenChange={() => handleModalResponse(false)}
    >
      <div className="alert-modal-content">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <AlertCircle color="red" />
          <h3>Blocks without connections detected</h3>
        </div>
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#E5E7EB",
            margin: "0 0 12px 0",
          }}
        ></div>
        <p>
          There are blocks that are not connected to the main flow. The blocks
          with no connections will be executed as a independent flow.
          <br />
          <span style={{ fontWeight: "bold" }}>
            Do you want to continue anyway?
          </span>
        </p>

        <div
          className="modal-buttons"
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => handleModalResponse(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6B7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleModalResponse(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </ConfigModal>
  );
};
