import React, { useState, useEffect } from "react";
import { useConfigStore } from "../../store/configStore";
import { type GmailConfig as GmailConfigType } from "../../types/blocks";
import "./configForm.css";

interface GmailConfigProps {
  blockId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const GmailConfig: React.FC<GmailConfigProps> = ({
  blockId,
  onSave,
  onCancel,
}) => {
  const { getGmailConfig, updateGmailConfig } = useConfigStore();
  const [config, setConfig] = useState<GmailConfigType>(() =>
    getGmailConfig(blockId)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setConfig(getGmailConfig(blockId));
  }, [blockId, getGmailConfig]);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateConfig = (
    configToValidate: GmailConfigType
  ): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (
      !configToValidate.recipientEmail ||
      configToValidate.recipientEmail.trim().length === 0
    ) {
      newErrors.recipientEmail = "Recipient email is required";
    } else if (!isValidEmail(configToValidate.recipientEmail.trim())) {
      newErrors.recipientEmail = "Please enter a valid email address";
    }

    if (
      !configToValidate.subject ||
      configToValidate.subject.trim().length === 0
    ) {
      newErrors.subject = "Email subject is required";
    } else if (configToValidate.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters long";
    }

    if (
      !configToValidate.messageBody ||
      configToValidate.messageBody.trim().length === 0
    ) {
      newErrors.messageBody = "Email message is required";
    } else if (configToValidate.messageBody.trim().length < 10) {
      newErrors.messageBody = "Message must be at least 10 characters long";
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateConfig(config);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateGmailConfig(blockId, config);
      onSave?.();
    }
  };

  const handleChange = (field: keyof GmailConfigType, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="configForm">
      <div className="configFormHeader">
        <h2 className="configFormTitle">Gmail Configuration</h2>
        <p className="configFormDescription">
          Set up email delivery for your sales reports. Configure who receives
          the email, the subject line, and the message content.
        </p>
      </div>

      <div className="configFormFields">
        <div
          className={`configFormField ${
            errors.recipientEmail ? "configFormField--error" : ""
          }`}
        >
          <label className="configFormLabel">
            Recipient Email <span className="configFormRequired">*</span>
          </label>
          <input
            type="email"
            className="configFormInput"
            value={config.recipientEmail}
            onChange={(e) => handleChange("recipientEmail", e.target.value)}
            placeholder="recipient@example.com"
          />
          {errors.recipientEmail && (
            <div className="configFormError">{errors.recipientEmail}</div>
          )}
          <div className="configFormHelp">
            Email address where the report will be sent
          </div>
        </div>

        <div
          className={`configFormField ${
            errors.subject ? "configFormField--error" : ""
          }`}
        >
          <label className="configFormLabel">
            Email Subject <span className="configFormRequired">*</span>
          </label>
          <input
            type="text"
            className="configFormInput"
            value={config.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="Enter email subject line"
          />
          {errors.subject && (
            <div className="configFormError">{errors.subject}</div>
          )}
        </div>

        <div
          className={`configFormField ${
            errors.messageBody ? "configFormField--error" : ""
          }`}
        >
          <label className="configFormLabel">
            Message Body <span className="configFormRequired">*</span>
          </label>
          <textarea
            className="configFormTextarea"
            value={config.messageBody}
            onChange={(e) => handleChange("messageBody", e.target.value)}
            placeholder="Enter your email message content..."
            rows={6}
            style={{ minHeight: "150px" }}
          />
          {errors.messageBody && (
            <div className="configFormError">{errors.messageBody}</div>
          )}
          <div className="configFormHelp">
            The sales analysis results will be included automatically
          </div>
        </div>
      </div>

      <div className="configFormActions">
        <button
          className="configFormButton configFormButtonSecondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="configFormButton configFormButtonPrimary"
          onClick={handleSave}
          disabled={
            !config.recipientEmail.length ||
            !config.subject.length ||
            !config.messageBody.length
          }
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default GmailConfig;
