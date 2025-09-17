import React, { useEffect } from "react";
import "./configModal.css";

interface ConfigModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  children,
  className = "",
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div className="configModalOverlay" onClick={handleBackdropClick}>
      <div className={`configModal ${className}`}>
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

        <div className="configModalContent">{children}</div>
      </div>
    </div>
  );
};

export default ConfigModal;
