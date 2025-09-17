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
import { useConfirmationModalStore } from "../store/confirmationModalStore";
import { createStepMapping, getExecutionLevels } from "../utils/levelsHandler";
import { getBlockWithoutDependenciesNorSource } from "../utils/nodesHandler";

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
  const { showConfirmationModal } = useConfirmationModalStore();
  const { checkBlockCompletion } = useCompletionStore();
  const { getAIConfig, getAmazonConfig, getGmailConfig, getSlackConfig } =
    useConfigStore();
  const {
    startProcess,
    updateStep,
    completeProcess,
    setCurrentLevel,
    setProcessMessage,
  } = useProcessTrackerStore();

  const updateMultipleSteps = useCallback(
    (
      blockIds: string[],
      state: BlockState,
      levelIndex: number,
      errorMessage = ""
    ) => {
      // Get execution levels and step mapping
      const levels = getExecutionLevels(nodes, edges);
      const stepMapping = createStepMapping(levels);

      blockIds.forEach((blockId) => {
        const block = nodes.find((n) => n.id === blockId);
        const stepIndex = stepMapping.get(blockId);

        // Get correct configuration for each block
        let config = null;
        const blockType = block?.data?.type as BlockType;

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

        updateStep(
          stepIndex,
          blockId,
          blockType,
          block?.data?.label as string,
          state,
          levelIndex,
          config,
          errorMessage
        );
      });
    },
    [
      nodes,
      edges,
      getAIConfig,
      getAmazonConfig,
      getGmailConfig,
      getSlackConfig,
      updateStep,
    ]
  );

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
          return true;
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

  const executeBlock = useCallback(
    async (blockId: string): Promise<boolean> => {
      const block = nodes.find((node) => node.id === blockId);
      if (!block) return false;

      const blockType = block.data.type as BlockType;
      const isComplete = isBlockComplete(blockId, blockType);

      if (!isComplete) {
        updateBlockState(blockId, BlockState.ERROR);
        return false;
      }

      updateBlockState(blockId, BlockState.RUNNING);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateBlockState(blockId, BlockState.SUCCESS);

      return true;
    },
    [updateBlockState, nodes, isBlockComplete]
  );

  // Main test runner
  const runTest = useCallback(async () => {
    if (testState.isRunning) return;

    if (getBlockWithoutDependenciesNorSource(nodes, edges).length > 0) {
      const userWantsToContinue = await showConfirmationModal();

      if (!userWantsToContinue) {
        return;
      }
    }

    nodes.forEach((node) => updateBlockState(node.id, BlockState.IDLE));

    const levels = getExecutionLevels(nodes, edges);
    const totalSteps = levels.flat().length;

    if (levels.length === 0) {
      setProcessMessage("No blocks found on canvas");
      return;
    }

    startProcess(totalSteps, levels.length);

    setTestState({ isRunning: true, currentBlockId: null });

    try {
      for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
        const level = levels[levelIndex];

        setCurrentLevel(levelIndex);

        updateMultipleSteps(
          level.map((block) => block.id),
          BlockState.RUNNING,
          levelIndex
        );

        const promises = level.map((block) => executeBlock(block.id));
        const results = await Promise.all(promises);

        if (results.some((result) => !result)) {
          level.forEach((block, index) => {
            const blockResult = results[index];
            const newState = blockResult
              ? BlockState.SUCCESS
              : BlockState.ERROR;
            const errorMessage = blockResult
              ? ""
              : "Block configuration is incomplete";

            updateMultipleSteps([block.id], newState, levelIndex, errorMessage);
          });

          setTestState({ isRunning: false, currentBlockId: null });
          return;
        }

        updateMultipleSteps(
          level.map((block) => block.id),
          BlockState.SUCCESS,
          levelIndex
        );
      }

      completeProcess();
      setTestState({ isRunning: false, currentBlockId: null });
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
    executeBlock,
    updateBlockState,
    edges,
    startProcess,
    completeProcess,
    setProcessMessage,
    updateMultipleSteps,
    isBlockComplete,
  ]);

  return {
    ...testState,
    runTest,
  };
};
