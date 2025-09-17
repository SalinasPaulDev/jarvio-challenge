// src/store/processTrackerStore.ts
import { create } from "zustand";
import {
  BlockType,
  BlockState,
  type AIAgentConfig,
  type SlackConfig,
  type GmailConfig,
  type AmazonSalesConfig,
} from "../types/blocks";

export interface ProcessStep {
  id: string;
  blockType: BlockType;
  blockLabel: string;
  state: BlockState;
  message: string;
  errorMessage?: string;
  timestamp: number;
}

interface ProcessTrackerState {
  // Current process state
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  steps: ProcessStep[];

  // Overall process message
  processMessage: string;

  // Actions
  startProcess: (totalSteps: number) => void;
  updateStep: (
    stepIndex: number,
    blockId: string,
    blockType: BlockType,
    blockLabel: string,
    state: BlockState,
    config?:
      | AIAgentConfig
      | AmazonSalesConfig
      | GmailConfig
      | SlackConfig
      | null,
    errorMessage?: string
  ) => void;
  completeProcess: () => void;
  resetProcess: () => void;
  setProcessMessage: (message: string) => void;
}

// Helper function to generate step messages based on block type and config
const generateStepMessage = (
  blockType: BlockType,
  state: BlockState,
  config?: AIAgentConfig | AmazonSalesConfig | GmailConfig | SlackConfig | null,
  errorMessage?: string
): string => {
  if (state === BlockState.ERROR) {
    return errorMessage || "An error occurred during execution";
  }

  switch (blockType) {
    case BlockType.AMAZON_SALES:
      if (state === BlockState.RUNNING) {
        const metric = (config as AmazonSalesConfig)?.metric || "sales data";
        const timeframe =
          (config as AmazonSalesConfig)?.timeframe || "specified timeframe";
        return `Fetching ${metric} for ${timeframe}...`;
      } else if (state === BlockState.SUCCESS) {
        return "Successfully retrieved Amazon sales data";
      }
      return "Ready to fetch Amazon sales data";

    case BlockType.AI_AGENT:
      if (state === BlockState.RUNNING) {
        const systemPrompt =
          (config as AIAgentConfig)?.systemPrompt || "specified system prompt";
        return `AI is analyzing the data and generating insights to ${systemPrompt.slice(
          0,
          30
        )}...`;
      } else if (state === BlockState.SUCCESS) {
        return "AI analysis completed successfully";
      }
      return "Ready to analyze data with AI";

    case BlockType.GMAIL:
      if (state === BlockState.RUNNING) {
        const recipient =
          (config as GmailConfig)?.recipientEmail || "specified recipient";
        return `Sending email to ${recipient}...`;
      } else if (state === BlockState.SUCCESS) {
        return "Email sent successfully";
      }
      return "Ready to send email";

    case BlockType.SLACK:
      if (state === BlockState.RUNNING) {
        const channel = (config as SlackConfig)?.channel || "specified channel";
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
  currentStep: 0,
  totalSteps: 0,
  steps: [],
  processMessage: "Ready to run test: click the 'Run Test' button to start",

  startProcess: (totalSteps: number) =>
    set({
      isRunning: true,
      currentStep: 0,
      totalSteps,
      steps: Array(totalSteps)
        .fill(null)
        .map((_, index) => ({
          id: `step-${index}`,
          blockType: BlockType.AMAZON_SALES, // Will be updated
          blockLabel: "Loading...",
          state: BlockState.IDLE,
          message: "Waiting to start...",
          timestamp: Date.now(),
        })),
      processMessage: `Starting test execution with ${totalSteps} step${
        totalSteps > 1 ? "s" : ""
      }...`,
    }),

  updateStep: (
    stepIndex: number,
    blockId: string,
    blockType: BlockType,
    blockLabel: string,
    state: BlockState,
    config?:
      | AIAgentConfig
      | AmazonSalesConfig
      | GmailConfig
      | SlackConfig
      | null,
    errorMessage?: string
  ) =>
    set((prevState) => {
      const newSteps = [...prevState.steps];
      const message = generateStepMessage(
        blockType,
        state,
        config,
        errorMessage
      );

      if (newSteps[stepIndex]) {
        newSteps[stepIndex] = {
          id: blockId,
          blockType,
          blockLabel,
          state,
          message,
          errorMessage,
          timestamp: Date.now(),
        };
      }

      let processMessage = prevState.processMessage;

      // Update overall process message based on current state
      if (state === BlockState.RUNNING) {
        processMessage = `Step ${stepIndex + 1} of ${
          prevState.totalSteps
        }: ${message}`;
      } else if (
        state === BlockState.SUCCESS &&
        stepIndex === prevState.totalSteps - 1
      ) {
        processMessage = "Test execution completed successfully!";
      } else if (state === BlockState.ERROR) {
        processMessage = `Error in step ${stepIndex + 1}: ${message}`;
      }

      return {
        ...prevState,
        steps: newSteps,
        currentStep:
          state === BlockState.RUNNING ? stepIndex : prevState.currentStep,
        processMessage,
      };
    }),

  completeProcess: () =>
    set((prevState) => ({
      ...prevState,
      isRunning: false,
      processMessage: "Test execution completed successfully!",
    })),

  resetProcess: () =>
    set({
      isRunning: false,
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      processMessage: "Ready to run test: click the 'Run Test' button to start",
    }),

  setProcessMessage: (message: string) =>
    set((prevState) => ({
      ...prevState,
      processMessage: message,
    })),
}));
