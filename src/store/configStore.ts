import { create } from "zustand";
import {
  type AmazonSalesConfig,
  type AIAgentConfig,
  type GmailConfig,
  type SlackConfig,
} from "../types/blocks";

interface ConfigStore {
  amazonConfigs: Record<string, AmazonSalesConfig>;
  aiConfigs: Record<string, AIAgentConfig>;
  gmailConfigs: Record<string, GmailConfig>;
  slackConfigs: Record<string, SlackConfig>;

  updateAmazonConfig: (blockId: string, config: AmazonSalesConfig) => void;
  updateAIConfig: (blockId: string, config: AIAgentConfig) => void;
  updateGmailConfig: (blockId: string, config: GmailConfig) => void;
  updateSlackConfig: (blockId: string, config: SlackConfig) => void;

  getAmazonConfig: (blockId: string) => AmazonSalesConfig;
  getAIConfig: (blockId: string) => AIAgentConfig;
  getGmailConfig: (blockId: string) => GmailConfig;
  getSlackConfig: (blockId: string) => SlackConfig;
}

const DEFAULT_AMAZON_CONFIG: AmazonSalesConfig = {
  metric: "revenue",
  timeframe: "last_7_days",
};

const DEFAULT_AI_CONFIG: AIAgentConfig = {
  systemPrompt:
    "Analyze the provided sales data and create a summary with key insights and recommendations.",
};

const DEFAULT_GMAIL_CONFIG: GmailConfig = {
  recipientEmail: "",
  subject: "Sales Report",
  messageBody: "Please find the sales analysis below.",
};

const DEFAULT_SLACK_CONFIG: SlackConfig = {
  channel: "#general",
  message: "Sales report has been generated.",
};

export const useConfigStore = create<ConfigStore>((set, get) => ({
  amazonConfigs: {},
  aiConfigs: {},
  gmailConfigs: {},
  slackConfigs: {},

  updateAmazonConfig: (blockId: string, config: AmazonSalesConfig) => {
    set((state) => ({
      amazonConfigs: {
        ...state.amazonConfigs,
        [blockId]: config,
      },
    }));
  },

  updateAIConfig: (blockId: string, config: AIAgentConfig) => {
    set((state) => ({
      aiConfigs: {
        ...state.aiConfigs,
        [blockId]: config,
      },
    }));
  },

  updateGmailConfig: (blockId: string, config: GmailConfig) => {
    set((state) => ({
      gmailConfigs: {
        ...state.gmailConfigs,
        [blockId]: config,
      },
    }));
  },

  updateSlackConfig: (blockId: string, config: SlackConfig) => {
    set((state) => ({
      slackConfigs: {
        ...state.slackConfigs,
        [blockId]: config,
      },
    }));
  },

  getAmazonConfig: (blockId: string) => {
    return get().amazonConfigs[blockId] || DEFAULT_AMAZON_CONFIG;
  },

  getAIConfig: (blockId: string) => {
    return get().aiConfigs[blockId] || DEFAULT_AI_CONFIG;
  },

  getGmailConfig: (blockId: string) => {
    return get().gmailConfigs[blockId] || DEFAULT_GMAIL_CONFIG;
  },

  getSlackConfig: (blockId: string) => {
    return get().slackConfigs[blockId] || DEFAULT_SLACK_CONFIG;
  },
}));
