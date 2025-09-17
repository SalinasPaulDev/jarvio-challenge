// src/components/common/ProcessTracker.tsx
import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader2, Clock } from "lucide-react";
import { BlockState } from "../../../types/blocks";
import {
  useProcessTrackerStore,
  type ExecutionLevel,
  type ProcessStep,
} from "../../../store/processTrackerStore";
import { BLOCK_METADATA } from "../../../utils/blocks";
import { ChevronDown, ChevronRight } from "lucide-react";
import "./processTracker.css";

const StepItem: React.FC<{ step: ProcessStep }> = ({ step }) => {
  const metadata = BLOCK_METADATA[step.blockType];

  const getStepIcon = () => {
    switch (step.state) {
      case BlockState.RUNNING:
        return <Loader2 className="stepItemIcon stepItemIcon--spinning" />;
      case BlockState.SUCCESS:
        return <CheckCircle className="stepItemIcon stepItemIcon--success" />;
      case BlockState.ERROR:
        return <AlertCircle className="stepItemIcon stepItemIcon--error" />;
      default:
        return <Clock className="stepItemIcon stepItemIcon--waiting" />;
    }
  };

  const getStepClassName = () => {
    let className = "processStepItem";

    switch (step.state) {
      case BlockState.RUNNING:
        className += " processStepItem--running";
        break;
      case BlockState.SUCCESS:
        className += " processStepItem--success";
        break;
      case BlockState.ERROR:
        className += " processStepItem--error";
        break;
      default:
        className += " processStepItem--waiting";
    }

    return className;
  };

  return (
    <div className={getStepClassName()}>
      <div className="stepItemLeft">
        {getStepIcon()}
        <img
          src={metadata.icon}
          alt={metadata.label}
          className="stepItemBlockIcon"
        />
      </div>
      <div className="stepItemContent">
        <div className="stepItemLabel">{step.blockLabel}</div>
        <div className="stepItemMessage">{step.message}</div>
      </div>
    </div>
  );
};

const LevelSection: React.FC<{
  level: ExecutionLevel;
  isActive: boolean;
  isCompleted: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}> = ({ level, isActive, isCompleted, isCollapsed, onToggle }) => {
  const getLevelClassName = () => {
    let className = "processLevel";

    if (isActive) {
      className += " processLevel--active";
    } else if (isCompleted) {
      className += " processLevel--completed";
    } else {
      className += " processLevel--waiting";
    }

    if (level.hasError) {
      className += " processLevel--error";
    }

    return className;
  };

  const getLevelIcon = () => {
    if (level.hasError) {
      return <AlertCircle className="levelIcon levelIcon--error" />;
    } else if (isCompleted) {
      return <CheckCircle className="levelIcon levelIcon--success" />;
    } else if (isActive) {
      return <Loader2 className="levelIcon levelIcon--spinning" />;
    } else {
      return <Clock className="levelIcon levelIcon--waiting" />;
    }
  };

  const getStepsStatus = () => {
    const total = level.steps.length;
    const completed = level.steps.filter(
      (s) => s.state === BlockState.SUCCESS
    ).length;
    const running = level.steps.filter(
      (s) => s.state === BlockState.RUNNING
    ).length;
    const errors = level.steps.filter(
      (s) => s.state === BlockState.ERROR
    ).length;

    if (errors > 0) {
      return `${errors} error${errors > 1 ? "s" : ""}`;
    } else if (running > 0) {
      return `${running}/${total} running`;
    } else if (completed === total) {
      return "Completed";
    } else {
      return `${completed}/${total} completed`;
    }
  };

  return (
    <div className={getLevelClassName()}>
      <div className="processLevelHeader" onClick={onToggle}>
        <div className="processLevelTitle">
          {isCollapsed ? (
            <ChevronRight className="levelChevron" />
          ) : (
            <ChevronDown className="levelChevron" />
          )}
          {getLevelIcon()}
          <span>Level {level.levelIndex + 1}</span>
          <span className="processLevelStatus">({getStepsStatus()})</span>
        </div>
      </div>

      {!isCollapsed && (isActive || isCompleted || level.hasError) && (
        <div className="processLevelSteps">
          {level.steps.map((step) => (
            <StepItem key={step.id} step={step} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProgressBar: React.FC<{
  currentLevel: number;
  totalLevels: number;
  isRunning: boolean;
  hasError: boolean;
}> = ({ currentLevel, totalLevels, isRunning, hasError }) => {
  const progress =
    totalLevels > 0 ? ((currentLevel + 1) / totalLevels) * 100 : 0;

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

const ProcessTracker: React.FC = () => {
  const { isRunning, currentLevel, totalLevels, levels, processMessage } =
    useProcessTrackerStore();
  const [collapsedLevels, setCollapsedLevels] = useState(new Set<number>());

  useEffect(() => {
    levels.forEach((level) => {
      if (level.isComplete && !level.hasError) {
        setCollapsedLevels((prev) => {
          const newSet = new Set(prev);
          newSet.add(level.levelIndex);
          return newSet;
        });
      }
    });
  }, [levels]);

  const toggleLevel = (levelIndex: number) => {
    setCollapsedLevels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(levelIndex)) {
        newSet.delete(levelIndex);
      } else {
        newSet.add(levelIndex);
      }
      return newSet;
    });
  };

  if (levels.length === 0 && !processMessage) {
    return null;
  }

  const hasError = levels.some((level) => level.hasError);

  const allSuccess =
    levels.length > 0 && levels.every((level) => level.isComplete);

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
        <div className="processTrackerMessage">
          <div className="processTrackerMessageIcon">{getMainIcon()}</div>
          <div className="processTrackerMessageText">{processMessage}</div>
        </div>

        {levels.length > 0 && (
          <div className="processTrackerProgress">
            <ProgressBar
              currentLevel={currentLevel}
              totalLevels={totalLevels}
              isRunning={isRunning}
              hasError={hasError}
            />
            <div className="progressTrackerInfo">
              Level {currentLevel + 1} of {totalLevels}
            </div>
          </div>
        )}

        <div className="processLevelsWrapper">
          {levels.length > 0 && (
            <div className="processLevelsContainer">
              {levels.map((level, index) => {
                const isActive = index === currentLevel && isRunning;
                const isCompleted = index < currentLevel || level.isComplete;
                const isCollapsed = collapsedLevels.has(level.levelIndex);

                return (
                  <LevelSection
                    key={level.levelIndex}
                    level={level}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    isCollapsed={isCollapsed}
                    onToggle={() => toggleLevel(level.levelIndex)}
                  />
                );
              })}
            </div>
          )}
        </div>
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
