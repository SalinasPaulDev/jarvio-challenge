import { create } from "zustand";
import {
  BlockType,
  type AIAgentConfig,
  type AmazonSalesConfig,
  type GmailConfig,
  type SlackConfig,
} from "../types/blocks";

interface CompletionState {
  checkBlockCompletion: (
    blockId: string,
    blockType: BlockType,
    config: AIAgentConfig | AmazonSalesConfig | GmailConfig | SlackConfig | null
  ) => boolean;
}

export const useCompletionStore = create<CompletionState>(() => ({
  checkBlockCompletion: (
    _blockId: string,
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
        isComplete = true;
    }
    return isComplete;
  },
}));
