import { BlockType, type BlockData, BlockState } from "../types/blocks";
import amazonIcon from "../assets/amazon-logo.webp";
import aiIcon from "../assets/jarvio-logo.webp";
import gmailIcon from "../assets/gmail-logo.webp";
import slackIcon from "../assets/slack-logo.webp";

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

export const BLOCK_METADATA = {
  [BlockType.AMAZON_SALES]: {
    label: "Amazon Sales Report",
    description: "Pull sales data from Amazon",
    color: "#FF9500",
    icon: amazonIcon,
  },
  [BlockType.AI_AGENT]: {
    label: "AI Agent",
    description: "Turn data into insights using AI",
    color: "#A855F7",
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
    color: "#4A154B",
    icon: slackIcon,
  },
};

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
    id,
  };
};

export const getBlockStateColor = (state: BlockState): string => {
  switch (state) {
    case BlockState.IDLE:
      return "#E5E7EB";
    case BlockState.RUNNING:
      return "#F59E0B";
    case BlockState.SUCCESS:
      return "#10B981";
    case BlockState.ERROR:
      return "#EF4444";
    default:
      return "#E5E7EB";
  }
};

export const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
