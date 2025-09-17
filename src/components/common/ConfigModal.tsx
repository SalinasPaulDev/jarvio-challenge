// src/components/common/ConfigModal.tsx
import React, { useEffect } from "react";
import "./configModal.css";

// Props for the modal component
interface ConfigModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// Simple modal component for configuration and other uses
const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  children,
  className = "",
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onOpenChange]);

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Handle backdrop click to close modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div className="configModalOverlay" onClick={handleBackdropClick}>
      <div className={`configModal ${className}`}>
        {/* Modal Header */}
        {title && (
          <div className="configModalHeader">
            <h2 className="configModalTitle">{title}</h2>
            <button
              className="configModalCloseButton"
              onClick={() => onOpenChange(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Content */}
        <div className="configModalContent">{children}</div>
      </div>
    </div>
  );
};

export default ConfigModal;
