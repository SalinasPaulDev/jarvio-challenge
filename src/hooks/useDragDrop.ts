import { useCallback, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { BlockType } from "../types/blocks";
import { createBlock, generateBlockId } from "../utils/blocks";
import type { Node } from "@xyflow/react";

export const useDragDrop = () => {
  const reactFlowInstance = useReactFlow();

  const draggedBlockType = useRef<BlockType | null>(null);

  const onDragStart = useCallback(
    (event: React.DragEvent, blockType: BlockType) => {
      draggedBlockType.current = blockType;
      event.dataTransfer.effectAllowed = "move";

      event.dataTransfer.setData("application/blockType", blockType);
    },
    []
  );


  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);


  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();


      const blockType =
        draggedBlockType.current ||
        (event.dataTransfer.getData("application/blockType") as BlockType);

      if (!blockType || !reactFlowInstance) {
        console.warn("No block type or React Flow instance available");
        return null;
      }

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newBlockId = generateBlockId();

      const newNode: Node = {
        id: newBlockId,
        type: "customBlock",
        position,
        data: createBlock(newBlockId, blockType, position),
      };

      draggedBlockType.current = null;

      return newNode;
    },
    [reactFlowInstance]
  );

  return {
    onDragStart,
    onDragOver,
    onDrop,
  };
};
