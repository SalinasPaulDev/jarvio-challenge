// src/utils/blockUtils.ts

import { BlockType, type BlockData, BlockState } from "../types/blocks";
import amazonIcon from "../assets/amazon-logo.webp";
import aiIcon from "../assets/jarvio-logo.webp";
import gmailIcon from "../assets/gmail-logo.webp";
import slackIcon from "../assets/slack-logo.webp";

// Default configurations for each block type
export const DEFAULT_CONFIGS = {
  [BlockType.AMAZON_SALES]: {
    metric: "revenue" as const,
    timeframe: "last_7_days" as const,
  },
  [BlockType.AI_AGENT]: {
    systemPrompt:
      "Analyze the provided sales data and create a summary with key insights and recommendations.",
  },
  [BlockType.GMAIL]: {
    recipientEmail: "",
    subject: "Sales Report",
    messageBody: "Please find the sales analysis below.",
  },
  [BlockType.SLACK]: {
    channel: "#general",
    message: "Sales report has been generated.",
  },
};

// Block metadata for UI display
export const BLOCK_METADATA = {
  [BlockType.AMAZON_SALES]: {
    label: "Amazon Sales Report",
    description: "Pull sales data from Amazon",
    color: "#FF9500", // Amazon orange
    icon: amazonIcon,
  },
  [BlockType.AI_AGENT]: {
    label: "AI Agent",
    description: "Turn data into insights using AI",
    color: "#A855F7", // Strong magenta purple - bold and distinct from blue
    icon: aiIcon,
  },
  [BlockType.GMAIL]: {
    label: "Gmail",
    description: "Send email via Gmail",
    color: "#A21CAF",
    icon: gmailIcon,
  },
  [BlockType.SLACK]: {
    label: "Slack",
    description: "Send message to Slack channel",
    color: "#4A154B", // Slack purple
    icon: slackIcon,
  },
};

// Function to create a new block with default configuration
export const createBlock = (
  id: string,
  type: BlockType,
  position: { x: number; y: number }
): BlockData => {
  const metadata = BLOCK_METADATA[type];
  const config = DEFAULT_CONFIGS[type];

  return {
    label: metadata.label,
    type,
    state: BlockState.IDLE,
    config,
    description: metadata.description,
    position,
  };
};

// Function to get block color based on its current state
export const getBlockStateColor = (state: BlockState): string => {
  switch (state) {
    case BlockState.IDLE:
      return "#E5E7EB"; // Gray
    case BlockState.RUNNING:
      return "#F59E0B"; // Yellow/Orange
    case BlockState.SUCCESS:
      return "#10B981"; // Green
    case BlockState.ERROR:
      return "#EF4444"; // Red
    default:
      return "#E5E7EB";
  }
};

// Function to validate block configuration
export const validateBlockConfig = (type: BlockType, config: any): boolean => {
  switch (type) {
    case BlockType.AMAZON_SALES:
      return config.metric && config.timeframe;
    case BlockType.AI_AGENT:
      return config.systemPrompt && config.systemPrompt.trim().length > 0;
    case BlockType.GMAIL:
      return (
        config.recipientEmail &&
        config.subject &&
        config.messageBody &&
        /\S+@\S+\.\S+/.test(config.recipientEmail) // Basic email validation
      );
    case BlockType.SLACK:
      return (
        config.channel && config.message && config.channel.startsWith("#") // Ensure channel starts with #
      );
    default:
      return false;
  }
};

// Function to generate a unique ID for blocks
export const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
