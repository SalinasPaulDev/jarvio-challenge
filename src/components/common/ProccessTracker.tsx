// src/components/common/ProcessTracker.tsx
import React from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { BlockState } from "../../types/blocks";
import { useProcessTrackerStore } from "../../store/processTrackerStore";
import "./processTracker.css";

// Progress bar component
const ProgressBar: React.FC<{
  currentStep: number;
  totalSteps: number;
  isRunning: boolean;
  hasError: boolean;
}> = ({ currentStep, totalSteps, isRunning, hasError }) => {
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="progressBarContainer">
      <div
        className={`progressBar ${
          isRunning && !hasError ? "progressBar--active" : ""
        } ${hasError ? "progressBar--error" : ""}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Main ProcessTracker component
const ProcessTracker: React.FC = () => {
  const { isRunning, currentStep, totalSteps, steps, processMessage } =
    useProcessTrackerStore();

  // Don't render if no steps have been set up
  if (steps.length === 0 && !processMessage) {
    return null;
  }

  // Check if any step has an error
  const hasError = steps.some((step) => step.state === BlockState.ERROR);

  // Check if all steps are successful
  const allSuccess =
    steps.length > 0 &&
    steps.every((step) => step.state === BlockState.SUCCESS);

  // Determine the main icon based on state priority: Error > Running > Success > Ready
  const getMainIcon = () => {
    if (hasError) {
      return <AlertCircle className="messageIcon messageIcon--error" />;
    } else if (isRunning && !hasError) {
      return <Loader2 className="messageIcon messageIcon--spinning" />;
    } else if (allSuccess) {
      return <CheckCircle className="messageIcon messageIcon--success" />;
    } else {
      return <div className="messageIcon messageIcon--ready">🚀</div>;
    }
  };

  return (
    <div className="processTracker">
      <div className="processTrackerContent">
        {/* Main message section */}
        <div className="processTrackerMessage">
          <div className="processTrackerMessageIcon">{getMainIcon()}</div>
          <div className="processTrackerMessageText">{processMessage}</div>
        </div>

        {/* Steps and progress section */}
        {steps.length > 0 && (
          <div className="processTrackerSteps">
            {/* Progress bar */}
            <ProgressBar
              currentStep={currentStep}
              totalSteps={totalSteps}
              isRunning={isRunning}
              hasError={hasError}
            />
          </div>
        )}

        {/* Additional info for running state (only show if running and no error) */}
        {isRunning && !hasError && (
          <div className="processTrackerInfo">
            Step {currentStep + 1} of {totalSteps}
          </div>
        )}

        {/* Show error info when there's an error */}
        {hasError && (
          <div className="processTrackerInfo processTrackerInfo--error">
            Test execution stopped due to configuration error
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessTracker;
