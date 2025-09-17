import { create } from "zustand";
import {
  BlockType,
  BlockState,
  type AIAgentConfig,
  type AmazonSalesConfig,
  type SlackConfig,
  type GmailConfig,
} from "../types/blocks";

export interface ProcessStep {
  id: string;
  blockType: BlockType;
  blockLabel: string;
  state: BlockState;
  message: string;
  errorMessage?: string;
  timestamp: number;
  levelIndex: number;
}

export interface ExecutionLevel {
  levelIndex: number;
  steps: ProcessStep[];
  isComplete: boolean;
  hasError: boolean;
}

interface ProcessTrackerState {
  isRunning: boolean;
  currentLevel: number;
  totalLevels: number;
  levels: ExecutionLevel[];
  totalSteps: number;
  processMessage: string;

  startProcess: (totalSteps: number, totalLevels: number) => void;
  updateStep: (
    _stepIndex: number,
    blockId: string,
    blockType: BlockType,
    blockLabel: string,
    state: BlockState,
    levelIndex: number,
    config?: AIAgentConfig | AmazonSalesConfig | GmailConfig | SlackConfig,
    errorMessage?: string
  ) => void;
  setCurrentLevel: (level: number) => void;
  completeProcess: () => void;
  resetProcess: () => void;
  setProcessMessage: (message: string) => void;
}

const generateStepMessage = (
  blockType: BlockType,
  state: BlockState,
  config?: AIAgentConfig | AmazonSalesConfig | GmailConfig | SlackConfig,
  errorMessage?: string
): string => {
  if (state === BlockState.ERROR) {
    return errorMessage || "An error occurred during execution";
  }

  switch (blockType) {
    case BlockType.AMAZON_SALES:
      if (state === BlockState.RUNNING) {
        const currentConfig = config as AmazonSalesConfig;
        const metric = currentConfig?.metric || "sales data";
        const timeframe = currentConfig?.timeframe || "specified timeframe";
        return `Fetching ${metric} for ${timeframe}...`;
      } else if (state === BlockState.SUCCESS) {
        return "Successfully retrieved Amazon sales data";
      }
      return "Ready to fetch Amazon sales data";

    case BlockType.AI_AGENT:
      if (state === BlockState.RUNNING) {
        return "AI is analyzing the data and generating insights...";
      } else if (state === BlockState.SUCCESS) {
        return "AI analysis completed successfully";
      }
      return "Ready to analyze data with AI";

    case BlockType.GMAIL:
      if (state === BlockState.RUNNING) {
        const currentConfig = config as GmailConfig;
        const recipient =
          currentConfig?.recipientEmail || "specified recipient";
        return `Sending email to ${recipient}...`;
      } else if (state === BlockState.SUCCESS) {
        return "Email sent successfully";
      }
      return "Ready to send email";

    case BlockType.SLACK:
      if (state === BlockState.RUNNING) {
        const currentConfig = config as SlackConfig;
        const channel = currentConfig?.channel || "specified channel";
        return `Sending message to ${channel}...`;
      } else if (state === BlockState.SUCCESS) {
        return "Slack message sent successfully";
      }
      return "Ready to send Slack message";

    default:
      return "Processing...";
  }
};

export const useProcessTrackerStore = create<ProcessTrackerState>((set) => ({
  isRunning: false,
  currentLevel: 0,
  totalLevels: 0,
  levels: [],
  totalSteps: 0,
  processMessage: "Ready to run test: click the 'Run Test' button to start",

  startProcess: (totalSteps: number, totalLevels: number) =>
    set({
      isRunning: true,
      currentLevel: 0,
      totalLevels,
      totalSteps,
      levels: Array(totalLevels)
        .fill(null)
        .map((_, index) => ({
          levelIndex: index,
          steps: [],
          isComplete: false,
          hasError: false,
        })),
      processMessage: `Starting test execution with ${totalLevels} level${
        totalLevels > 1 ? "s" : ""
      } (${totalSteps} total blocks)...`,
    }),

  updateStep: (
    _stepIndex: number,
    blockId: string,
    blockType: BlockType,
    blockLabel: string,
    state: BlockState,
    levelIndex: number,
    config?: AIAgentConfig | AmazonSalesConfig | GmailConfig | SlackConfig,
    errorMessage?: string
  ) =>
    set((prevState) => {
      const newLevels = [...prevState.levels];
      const message = generateStepMessage(
        blockType,
        state,
        config,
        errorMessage
      );

      const step: ProcessStep = {
        id: blockId,
        blockType,
        blockLabel,
        state,
        message,
        errorMessage,
        timestamp: Date.now(),
        levelIndex,
      };

      if (!newLevels[levelIndex]) {
        newLevels[levelIndex] = {
          levelIndex,
          steps: [],
          isComplete: false,
          hasError: false,
        };
      }

      const existingStepIndex = newLevels[levelIndex].steps.findIndex(
        (s) => s.id === blockId
      );
      if (existingStepIndex >= 0) {
        newLevels[levelIndex].steps[existingStepIndex] = step;
      } else {
        newLevels[levelIndex].steps.push(step);
      }

      const levelSteps = newLevels[levelIndex].steps;
      newLevels[levelIndex].hasError = levelSteps.some(
        (s) => s.state === BlockState.ERROR
      );
      newLevels[levelIndex].isComplete =
        !newLevels[levelIndex].hasError &&
        levelSteps.length > 0 &&
        levelSteps.every((s) => s.state === BlockState.SUCCESS);

      let processMessage = prevState.processMessage;

      if (state === BlockState.RUNNING) {
        processMessage = `Level ${levelIndex + 1}: Executing ${
          levelSteps.filter((s) => s.state === BlockState.RUNNING).length
        } block${
          levelSteps.filter((s) => s.state === BlockState.RUNNING).length > 1
            ? "s"
            : ""
        }...`;
      } else if (state === BlockState.ERROR) {
        processMessage = `Error in Level ${levelIndex + 1}: ${message}`;
      } else if (
        newLevels[levelIndex].isComplete &&
        levelIndex === prevState.totalLevels - 1
      ) {
        processMessage = "Test execution completed successfully!";
      } else if (newLevels[levelIndex].isComplete) {
        processMessage = `Level ${levelIndex + 1} completed. Moving to Level ${
          levelIndex + 2
        }...`;
      }

      return {
        ...prevState,
        levels: newLevels,
        processMessage,
      };
    }),

  setCurrentLevel: (level: number) =>
    set((prevState) => ({
      ...prevState,
      currentLevel: level,
    })),

  completeProcess: () =>
    set((prevState) => ({
      ...prevState,
      isRunning: false,
      processMessage: "Test execution completed successfully!",
    })),

  resetProcess: () =>
    set({
      isRunning: false,
      currentLevel: 0,
      totalLevels: 0,
      levels: [],
      totalSteps: 0,
      processMessage: "Ready to run test: click the 'Run Test' button to start",
    }),

  setProcessMessage: (message: string) =>
    set((prevState) => ({
      ...prevState,
      processMessage: message,
    })),
}));
