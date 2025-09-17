import { useCallback } from "react";
import { BlockState } from "../types/blocks";
import type { Node } from "@xyflow/react";

export const useBlockStates = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
) => {
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

  return {
    updateBlockState,
  };
};
