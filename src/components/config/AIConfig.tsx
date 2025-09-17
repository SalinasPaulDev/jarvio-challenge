import React, { useState, useEffect } from "react";
import { useConfigStore } from "../../store/configStore";
import { type AIAgentConfig } from "../../types/blocks";
import "./configForm.css";

interface AIConfigProps {
  blockId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const AIConfig: React.FC<AIConfigProps> = ({ blockId, onSave, onCancel }) => {
  const { getAIConfig, updateAIConfig } = useConfigStore();
  const [config, setConfig] = useState<AIAgentConfig>(() =>
    getAIConfig(blockId)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setConfig(getAIConfig(blockId));
  }, [blockId, getAIConfig]);

  const validateConfig = (
    configToValidate: AIAgentConfig
  ): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (
      !configToValidate.systemPrompt ||
      configToValidate.systemPrompt.trim().length === 0
    ) {
      newErrors.systemPrompt = "System prompt is required";
    } else if (configToValidate.systemPrompt.trim().length < 10) {
      newErrors.systemPrompt =
        "System prompt must be at least 10 characters long";
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateConfig(config);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateAIConfig(blockId, config);
      onSave?.();
    }
  };

  const handleChange = (field: keyof AIAgentConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const promptTemplates = [
    {
      label: "Sales Analysis",
      value:
        "Analyze the provided sales data and create a summary with key insights and recommendations for improving performance.",
    },
    {
      label: "Performance Report",
      value:
        "Create a concise performance report highlighting trends, comparing to previous periods, and identifying areas of opportunity.",
    },
    {
      label: "Executive Summary",
      value:
        "Generate an executive-level summary of the sales data with actionable insights and strategic recommendations.",
    },
    {
      label: "Custom",
      value: " ",
    },
  ];

  const handleTemplateSelect = (templateValue: string) => {
    if (templateValue) {
      handleChange("systemPrompt", templateValue);
    }
  };

  return (
    <div className="configForm">
      <div className="configFormHeader">
        <h2 className="configFormTitle">AI Agent</h2>
        <p className="configFormDescription">
          Configure the AI agent to transform your sales data into meaningful
          insights. The system prompt guides how the AI analyzes and presents
          the data.
        </p>
      </div>

      <div className="configFormFields">
        <div className="configFormField">
          <label className="configFormLabel">Prompt Template</label>
          <select
            className="configFormSelect"
            value={config.systemPrompt}
            onChange={(e) => handleTemplateSelect(e.target.value)}
          >
            {promptTemplates.map((template) => (
              <option key={template.label} value={template.value}>
                {template.label}
              </option>
            ))}
          </select>
          <div className="configFormHelp">
            Select a pre-made template or create your own custom prompt below
          </div>
        </div>

        <div
          className={`configFormField ${
            errors.systemPrompt ? "configFormField--error" : ""
          }`}
        >
          <label className="configFormLabel">
            System Prompt <span className="configFormRequired">*</span>
          </label>
          <textarea
            className="configFormTextarea"
            value={config.systemPrompt}
            onChange={(e) => handleChange("systemPrompt", e.target.value)}
            placeholder="Enter instructions for how the AI should analyze and present your sales data..."
            rows={4}
            style={{ minHeight: "120px" }}
          />
          {errors.systemPrompt && (
            <div className="configFormError">{errors.systemPrompt}</div>
          )}
          <div className="configFormHelp">
            This prompt will guide the AI's analysis. Be specific about what
            insights you want (trends, comparisons, recommendations, etc.)
          </div>
        </div>

        <div className="configFormField">
          <div
            className="configFormHelp"
            style={{ textAlign: "right", marginTop: "-10px" }}
          >
            {config.systemPrompt.length} characters
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
          disabled={config.systemPrompt.length === 0}
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default AIConfig;
