import React, { useState, useEffect } from "react";
import { useConfigStore } from "../../store/configStore";
import { type SlackConfig as SlackConfigType } from "../../types/blocks";
import "./configForm.css";

interface SlackConfigProps {
  blockId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const SlackConfig: React.FC<SlackConfigProps> = ({
  blockId,
  onSave,
  onCancel,
}) => {
  const { getSlackConfig, updateSlackConfig } = useConfigStore();
  const [config, setConfig] = useState<SlackConfigType>(() =>
    getSlackConfig(blockId)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setConfig(getSlackConfig(blockId));
  }, [blockId, getSlackConfig]);

  const isValidChannel = (channel: string): boolean => {
    // Must start with # and contain valid characters
    const channelRegex = /^#[a-z0-9_-]+$/;
    return channelRegex.test(channel.toLowerCase());
  };

  const validateConfig = (
    configToValidate: SlackConfigType
  ): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (
      !configToValidate.channel ||
      configToValidate.channel.trim().length === 0
    ) {
      newErrors.channel = "Slack channel is required";
    } else if (!isValidChannel(configToValidate.channel.trim())) {
      newErrors.channel =
        "Channel must start with # and contain only lowercase letters, numbers, hyphens, and underscores";
    }

    if (
      !configToValidate.message ||
      configToValidate.message.trim().length === 0
    ) {
      newErrors.message = "Message is required";
    } else if (configToValidate.message.trim().length < 5) {
      newErrors.message = "Message must be at least 5 characters long";
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateConfig(config);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateSlackConfig(blockId, config);
      onSave?.();
    }
  };

  const handleChange = (field: keyof SlackConfigType, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const commonChannels = [
    "#general",
    "#sales",
    "#analytics",
    "#reports",
    "#notifications",
    "#team-updates",
    "#business-intel",
  ];

  return (
    <div className="configForm">
      <div className="configFormHeader">
        <h2 className="configFormTitle">Slack Configuration</h2>
        <p className="configFormDescription">
          Send automated notifications to your Slack workspace when sales
          reports are ready. Configure which channel receives the message and
          customize the notification content.
        </p>
      </div>

      <div className="configFormFields">
        <div className="configFormField">
          <label className="configFormLabel">Common Channels</label>
          <select
            className="configFormSelect"
            value={config.channel}
            onChange={(e) => handleChange("channel", e.target.value)}
          >
            <option value="">Choose a common channel (optional)</option>
            {commonChannels.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
          <div className="configFormHelp">
            Select a common channel or enter your own below
          </div>
        </div>

        <div
          className={`configFormField ${
            errors.message ? "configFormField--error" : ""
          }`}
        >
          <label className="configFormLabel">
            Message <span className="configFormRequired">*</span>
          </label>
          <textarea
            className="configFormTextarea"
            value={config.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Enter your Slack message..."
            rows={4}
            style={{ minHeight: "100px" }}
          />
          {errors.message && (
            <div className="configFormError">{errors.message}</div>
          )}
          <div className="configFormHelp">
            This message will be sent when the sales analysis is complete. Use
            emojis to make it more engaging!
          </div>
        </div>

        <div className="configFormField">
          <label className="configFormLabel">Preview</label>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e9ecef",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#495057",
              minHeight: "50px",
              fontFamily: "monospace",
            }}
          >
            <strong>{config.channel || "#channel"}</strong>
            <br />
            {config.message || "Your message will appear here..."}
          </div>
          <div className="configFormHelp">
            Preview of how your message will appear in Slack
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
          disabled={!config.channel.length || config.message.length < 4}
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default SlackConfig;
