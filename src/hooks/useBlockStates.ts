// src/hooks/useBlockStates.ts
import { useCallback } from "react";
import { BlockState } from "../types/blocks";
import type { Node } from "@xyflow/react";

// Custom hook to manage block states
export const useBlockStates = (
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  // Function to update a single block's state
  const updateBlockState = useCallback(
    (blockId: string, newState: BlockState) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === blockId) {
            return {
              ...node,
              data: {
                ...node.data,
                state: newState,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Function to reset all blocks to idle state
  const resetAllBlockStates = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          state: BlockState.IDLE,
        },
      }))
    );
  }, [setNodes]);

  // Function to get current state of a specific block
  const getBlockState = useCallback(
    (blockId: string): BlockState => {
      const node = nodes.find((n) => n.id === blockId);
      return (node?.data?.state as BlockState) || BlockState.IDLE;
    },
    [nodes]
  );

  // Function to get all blocks with their current states
  const getAllBlockStates = useCallback(() => {
    return nodes.map((node) => ({
      id: node.id,
      label: (node.data?.label as string) || "Unknown",
      type: node.data?.type,
      state: (node.data?.state as BlockState) || BlockState.IDLE,
    }));
  }, [nodes]);

  return {
    updateBlockState,
    resetAllBlockStates,
    getBlockState,
    getAllBlockStates,
  };
};
