// src/hooks/useDragDrop.ts
import { useCallback, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { BlockType } from "../types/blocks";
import { createBlock, generateBlockId } from "../utils/blocks";
import type { Node } from "@xyflow/react";

// Custom hook to handle drag and drop functionality
export const useDragDrop = () => {
  // Get React Flow instance to access screen-to-flow coordinates conversion
  const reactFlowInstance = useReactFlow();

  // Store the block type being dragged
  const draggedBlockType = useRef<BlockType | null>(null);

  // Handle drag start - store what block type is being dragged
  const onDragStart = useCallback(
    (event: React.DragEvent, blockType: BlockType) => {
      // Store the block type for later use in onDrop
      draggedBlockType.current = blockType;

      // Set drag effect to 'move' to show appropriate cursor
      event.dataTransfer.effectAllowed = "move";

      // Store block type in dataTransfer for additional safety
      event.dataTransfer.setData("application/blockType", blockType);
    },
    []
  );

  // Handle drag over - required to allow dropping
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault(); // Prevent default to allow drop
    event.dataTransfer.dropEffect = "move"; // Show move cursor
  }, []);

  // Handle drop - create new block at drop position
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // Get the block type being dropped
      const blockType =
        draggedBlockType.current ||
        (event.dataTransfer.getData("application/blockType") as BlockType);

      if (!blockType || !reactFlowInstance) {
        console.warn("No block type or React Flow instance available");
        return null;
      }

      // Get the bounds of the React Flow wrapper
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();

      // Convert screen coordinates to flow coordinates
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Generate unique ID for the new block
      const newBlockId = generateBlockId();

      // Create the new node
      const newNode: Node = {
        id: newBlockId,
        type: "customBlock",
        position,
        data: createBlock(newBlockId, blockType, position),
      };

      // Clear the dragged block type
      draggedBlockType.current = null;

      // Return the new node (caller will add it to the nodes array)
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
