// src/types/blocks.ts

// Enum for different block types in our canvas
export enum BlockType {
  AMAZON_SALES = "amazon_sales",
  AI_AGENT = "ai_agent",
  GMAIL = "gmail",
  SLACK = "slack",
}

// Enum for block execution states during test runs
export enum BlockState {
  IDLE = "idle", // Default state, not running
  RUNNING = "running", // Currently executing
  SUCCESS = "success", // Successfully completed
  ERROR = "error", // Failed execution
}

// Configuration interface for Amazon Sales Report block
export interface AmazonSalesConfig {
  metric: "revenue" | "units_sold" | "orders"; // What metric to pull
  timeframe: "last_7_days" | "last_30_days"; // Time period for data
}

// Configuration interface for AI Agent block
export interface AIAgentConfig {
  systemPrompt: string; // The prompt that guides the AI's behavior
}

// Configuration interface for Gmail block
export interface GmailConfig {
  recipientEmail: string; // Who receives the email
  subject: string; // Email subject line
  messageBody: string; // Email content
}

// Configuration interface for Slack block
export interface SlackConfig {
  channel: string; // Slack channel name (e.g., #general)
  message: string; // Message to send
}

// Union type for all possible block configurations
export type BlockConfig =
  | AmazonSalesConfig
  | AIAgentConfig
  | GmailConfig
  | SlackConfig;

// Interface for our custom block data that extends React Flow's node data
export interface BlockData {
  label: string; // Display name of the block
  type: BlockType; // What kind of block this is
  state: BlockState; // Current execution state
  config: BlockConfig; // Block-specific configuration
  description?: string; // Optional description for the block
  [key: string]: unknown; // Index signature for React Flow compatibility
}

// Interface for the complete block node (extends React Flow's Node type)
export interface BlockNode {
  id: string; // Unique identifier for the node
  type: string; // React Flow node type (we'll use 'custom')
  position: { x: number; y: number }; // Position on the canvas
  data: BlockData; // Our custom block data
  selected?: boolean; // Whether the node is currently selected
}

// Interface for test run execution results
export interface ExecutionResult {
  blockId: string; // Which block was executed
  success: boolean; // Whether execution succeeded
  message: string; // Result message or error description
  data?: unknown; // Any data returned by the block
  executionTime?: number; // How long the execution took (in ms)
}

// Interface for the overall test run state
export interface TestRunState {
  isRunning: boolean; // Whether a test is currently running
  currentBlockId?: string; // ID of the block currently being executed
  results: ExecutionResult[]; // Results from all executed blocks
  startTime?: number; // When the test run started
}
