// src/hooks/useTestRunner.ts
import { useCallback, useState } from "react";
import {
  BlockState,
  BlockType,
  type AIAgentConfig,
  type AmazonSalesConfig,
  type GmailConfig,
  type SlackConfig,
} from "../types/blocks";
import type { Node, Edge } from "@xyflow/react";
import { useCompletionStore } from "../store/completionStore";
import { useConfigStore } from "../store/configStore";
import { useProcessTrackerStore } from "../store/processTrackerStore";

interface TestRunnerState {
  isRunning: boolean;
  currentBlockId: string | null;
}

export const useTestRunner = (
  nodes: Node[],
  edges: Edge[],
  updateBlockState: (blockId: string, state: BlockState) => void
) => {
  const [testState, setTestState] = useState<TestRunnerState>({
    isRunning: false,
    currentBlockId: null,
  });

  // Get completion store and config store
  const { checkBlockCompletion } = useCompletionStore();
  const { getAIConfig, getAmazonConfig, getGmailConfig, getSlackConfig } =
    useConfigStore();
  const {
    startProcess,
    updateStep,
    completeProcess,
    resetProcess,
    setProcessMessage,
  } = useProcessTrackerStore();

  // Check if a block is properly configured
  const isBlockComplete = useCallback(
    (blockId: string, blockType: BlockType): boolean => {
      let config: unknown = null;

      switch (blockType) {
        case BlockType.AI_AGENT:
          config = getAIConfig(blockId);
          break;
        case BlockType.AMAZON_SALES:
          config = getAmazonConfig(blockId);
          break;
        case BlockType.GMAIL:
          config = getGmailConfig(blockId);
          break;
        case BlockType.SLACK:
          config = getSlackConfig(blockId);
          break;
        default:
          return true; // Unknown types are considered complete
      }

      return checkBlockCompletion(
        blockId,
        blockType,
        config as
          | AIAgentConfig
          | AmazonSalesConfig
          | GmailConfig
          | SlackConfig
          | null
      );
    },
    [
      checkBlockCompletion,
      getAIConfig,
      getAmazonConfig,
      getGmailConfig,
      getSlackConfig,
    ]
  );

  // Find the leftmost block (starting point)
  const findStartingBlock = useCallback((): Node | null => {
    if (nodes.length === 0) return null;

    // Find the leftmost block by x position
    return nodes.reduce((leftmost, current) => {
      return current.position.x < leftmost.position.x ? current : leftmost;
    });
  }, [nodes]);

  // Find the next connected block
  const findNextBlock = useCallback(
    (currentBlockId: string): Node | null => {
      // Find edge that has current block as source
      const outgoingEdge = edges.find((edge) => edge.source === currentBlockId);

      if (!outgoingEdge) return null;

      // Find the target node
      return nodes.find((node) => node.id === outgoingEdge.target) || null;
    },
    [edges, nodes]
  );

  // Get execution flow (sequence of blocks from left to right)
  const getExecutionFlow = useCallback((): Node[] => {
    const flow: Node[] = [];
    const startingBlock = findStartingBlock();

    if (!startingBlock) return flow;

    let currentBlock: Node | null = startingBlock;
    const visited = new Set<string>();

    // Build the connected flow
    while (currentBlock && !visited.has(currentBlock.id)) {
      visited.add(currentBlock.id);
      flow.push(currentBlock);
      currentBlock = findNextBlock(currentBlock.id);
    }

    return flow;
  }, [findStartingBlock, findNextBlock]);

  // Execute a single block with loading animation
  const executeBlock = useCallback(
    async (blockId: string, stepIndex: number): Promise<boolean> => {
      // Find the block to get its type
      const block = nodes.find((node) => node.id === blockId);
      if (!block) return false;

      const blockType = block.data.type as BlockType;

      // Get block configuration
      let config:
        | AIAgentConfig
        | AmazonSalesConfig
        | GmailConfig
        | SlackConfig
        | null = null;
      switch (blockType) {
        case BlockType.AI_AGENT:
          config = getAIConfig(blockId);
          break;
        case BlockType.AMAZON_SALES:
          config = getAmazonConfig(blockId);
          break;
        case BlockType.GMAIL:
          config = getGmailConfig(blockId);
          break;
        case BlockType.SLACK:
          config = getSlackConfig(blockId);
          break;
      }

      // Check if block is properly configured
      const isComplete = isBlockComplete(blockId, blockType);

      if (!isComplete) {
        // Update process tracker with error - this stops the progress
        updateStep(
          stepIndex,
          blockId,
          blockType,
          block.data.label as string,
          BlockState.ERROR,
          config,
          "Block configuration is incomplete. Please configure this block and try again."
        );

        // Set block to error state if not properly configured
        updateBlockState(blockId, BlockState.ERROR);

        // Update overall process message to show error and retry instruction
        setProcessMessage(
          `Test failed: ${block.data.label} is not properly configured. Complete the configuration and click 'Run Test' to retry.`
        );

        console.log(`Block ${block.data.type} is not properly configured`);
        return false;
      }

      // Update process tracker to running state
      updateStep(
        stepIndex,
        blockId,
        blockType,
        block.data.label as string,
        BlockState.RUNNING,
        config
      );

      // Set block to running state
      updateBlockState(blockId, BlockState.RUNNING);

      // Wait 2 seconds to show loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update process tracker to success state
      updateStep(
        stepIndex,
        blockId,
        blockType,
        block.data.label as string,
        BlockState.SUCCESS,
        config
      );

      updateBlockState(blockId, BlockState.SUCCESS);

      return true;
    },
    [
      updateBlockState,
      nodes,
      isBlockComplete,
      updateStep,
      setProcessMessage,
      getAIConfig,
      getAmazonConfig,
      getGmailConfig,
      getSlackConfig,
    ]
  );

  // Main test runner function
  const runTest = useCallback(async () => {
    if (testState.isRunning) return;

    // Reset all blocks to idle state first
    nodes.forEach((node) => {
      updateBlockState(node.id, BlockState.IDLE);
    });

    const executionFlow = getExecutionFlow();

    if (executionFlow.length === 0) {
      setProcessMessage("No blocks found on canvas");
      return;
    }

    // Start the process tracking
    startProcess(executionFlow.length);

    setTestState({
      isRunning: true,
      currentBlockId: null,
    });

    try {
      // Execute each block in the flow sequence
      for (let i = 0; i < executionFlow.length; i++) {
        const currentBlock = executionFlow[i];

        // Update current block being executed
        setTestState((prev) => ({
          ...prev,
          currentBlockId: currentBlock.id,
        }));

        // Execute current block with step index
        const success = await executeBlock(currentBlock.id, i);

        // If execution failed, STOP the entire process immediately
        if (!success) {
          setTestState({
            isRunning: false,
            currentBlockId: null,
          });
          // Don't call completeProcess() - leave it in error state
          return;
        }
      }

      const nodesNotInFlow = nodes.filter(
        (node) => !executionFlow.some((flowBlock) => flowBlock.id === node.id)
      );

      // Mark nodes not in execution flow as ERROR
      nodesNotInFlow.forEach((node) => {
        updateBlockState(node.id, BlockState.ERROR);
      });

      // Complete the process only if all steps succeeded
      completeProcess();

      // Test completed successfully
      setTestState({
        isRunning: false,
        currentBlockId: null,
      });
    } catch (error) {
      console.error("Error running test:", error);
      setProcessMessage(
        "An unexpected error occurred during test execution. Please try again."
      );
      setTestState({
        isRunning: false,
        currentBlockId: null,
      });
    }
  }, [
    testState.isRunning,
    nodes,
    getExecutionFlow,
    executeBlock,
    updateBlockState,
    startProcess,
    completeProcess,
    setProcessMessage,
  ]);

  // Stop test execution
  const stopTest = useCallback(() => {
    setTestState({
      isRunning: false,
      currentBlockId: null,
    });

    // Reset all blocks to idle
    nodes.forEach((node) => {
      updateBlockState(node.id, BlockState.IDLE);
    });

    // Reset process tracker
    resetProcess();
  }, [nodes, updateBlockState, resetProcess]);

  return {
    ...testState,
    runTest,
    stopTest,
    executionFlow: getExecutionFlow(),
  };
};
