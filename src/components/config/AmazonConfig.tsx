import React, { useState, useEffect } from "react";
import { useConfigStore } from "../../store/configStore";
import { type AmazonSalesConfig } from "../../types/blocks";
import "./configForm.css";

interface AmazonConfigProps {
  blockId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const AmazonConfig: React.FC<AmazonConfigProps> = ({
  blockId,
  onSave,
  onCancel,
}) => {
  const { getAmazonConfig, updateAmazonConfig } = useConfigStore();

  const [config, setConfig] = useState<AmazonSalesConfig>(() =>
    getAmazonConfig(blockId)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setConfig(getAmazonConfig(blockId));
  }, [blockId, getAmazonConfig]);

  const validateConfig = (
    configToValidate: AmazonSalesConfig
  ): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!configToValidate.metric) {
      newErrors.metric = "Please select a metric";
    }

    if (!configToValidate.timeframe) {
      newErrors.timeframe = "Please select a timeframe";
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateConfig(config);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateAmazonConfig(blockId, config);
      onSave?.();
    }
  };

  const handleChange = (field: keyof AmazonSalesConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="configForm">
      <div className="configFormHeader">
        <img
          src="/amazon-icon.png"
          alt="Amazon Sales"
          className="configFormIcon"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <h2 className="configFormTitle">Amazon Sales Report</h2>
        <p className="configFormDescription">
          Configure how to pull sales data from Amazon. This block will fetch
          the specified metric for your chosen timeframe.
        </p>
      </div>

      <div className="configFormFields">
        <div
          className={`configFormField ${
            errors.metric ? "configFormField--error" : ""
          }`}
        >
          <label className="configFormLabel">
            Sales Metric <span className="configFormRequired">*</span>
          </label>
          <select
            className="configFormSelect"
            value={config.metric}
            onChange={(e) => handleChange("metric", e.target.value)}
          >
            <option value="">Select a metric</option>
            <option value="revenue">Revenue ($)</option>
            <option value="units_sold">Units Sold</option>
            <option value="orders">Number of Orders</option>
          </select>
          {errors.metric && (
            <div className="configFormError">{errors.metric}</div>
          )}
          <div className="configFormHelp">
            Choose which sales data you want to analyze
          </div>
        </div>

        <div
          className={`configFormField ${
            errors.timeframe ? "configFormField--error" : ""
          }`}
        >
          <label className="configFormLabel">
            Time Period <span className="configFormRequired">*</span>
          </label>
          <select
            className="configFormSelect"
            value={config.timeframe}
            onChange={(e) => handleChange("timeframe", e.target.value)}
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
          </select>
          {errors.timeframe && (
            <div className="configFormError">{errors.timeframe}</div>
          )}
          <div className="configFormHelp">
            Data will be pulled for this time period
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
          disabled={!config.metric.length || !config.timeframe.length}
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default AmazonConfig;
