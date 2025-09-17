export enum BlockType {
  AMAZON_SALES = "amazon_sales",
  AI_AGENT = "ai_agent",
  GMAIL = "gmail",
  SLACK = "slack",
}

export enum BlockState {
  IDLE = "idle",
  RUNNING = "running",
  SUCCESS = "success",
  ERROR = "error",
}

export interface AmazonSalesConfig {
  metric: "revenue" | "units_sold" | "orders";
  timeframe: "last_7_days" | "last_30_days";
}

export interface AIAgentConfig {
  systemPrompt: string;
}

export interface GmailConfig {
  recipientEmail: string;
  subject: string;
  messageBody: string;
}

export interface SlackConfig {
  channel: string;
  message: string;
}

export type BlockConfig =
  | AmazonSalesConfig
  | AIAgentConfig
  | GmailConfig
  | SlackConfig;

export interface BlockData {
  label: string;
  type: BlockType;
  state: BlockState;
  config: BlockConfig;
  description?: string;
  [key: string]: unknown;
}
