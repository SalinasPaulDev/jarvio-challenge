// src/store/completionStore.ts
import { create } from "zustand";
import {
  BlockType,
  type AIAgentConfig,
  type AmazonSalesConfig,
  type GmailConfig,
  type SlackConfig,
} from "../types/blocks";

interface CompletionState {
  // Map of blockId to completion status
  blockCompletions: Record<string, boolean>;

  // Actions
  setBlockCompletion: (blockId: string, isComplete: boolean) => void;
  getBlockCompletion: (blockId: string) => boolean;
  checkBlockCompletion: (
    blockId: string,
    blockType: BlockType,
    config: AIAgentConfig | AmazonSalesConfig | GmailConfig | SlackConfig | null
  ) => boolean;
  resetAllCompletions: () => void;
}

export const useCompletionStore = create<CompletionState>((set, get) => ({
  blockCompletions: {},

  setBlockCompletion: (blockId: string, isComplete: boolean) =>
    set((state) => ({
      blockCompletions: {
        ...state.blockCompletions,
        [blockId]: isComplete,
      },
    })),

  getBlockCompletion: (blockId: string) => {
    const state = get();
    return state.blockCompletions[blockId] ?? false;
  },

  checkBlockCompletion: (
    blockId: string,
    blockType: BlockType,
    config: AIAgentConfig | AmazonSalesConfig | GmailConfig | SlackConfig | null
  ) => {
    let isComplete = false;

    switch (blockType) {
      case BlockType.AI_AGENT:
        isComplete = !!(config as AIAgentConfig)?.systemPrompt?.trim();
        break;
      case BlockType.AMAZON_SALES:
        isComplete = !!(
          (config as AmazonSalesConfig)?.metric?.trim() &&
          (config as AmazonSalesConfig)?.timeframe?.trim()
        );
        break;
      case BlockType.GMAIL:
        isComplete = !!(
          (config as GmailConfig)?.recipientEmail?.trim() &&
          (config as GmailConfig)?.subject?.trim() &&
          (config as GmailConfig)?.messageBody?.trim()
        );
        break;
      case BlockType.SLACK:
        isComplete = !!(
          (config as SlackConfig)?.channel?.trim() &&
          (config as SlackConfig)?.message?.trim()
        );
        break;
      default:
        isComplete = true; // Default to complete for unknown types
    }

    // Update the store with the current completion status
    get().setBlockCompletion(blockId, isComplete);
    return isComplete;
  },

  resetAllCompletions: () =>
    set(() => ({
      blockCompletions: {},
    })),
}));
