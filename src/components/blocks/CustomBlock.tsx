// src/components/blocks/CustomBlock.tsx
import React, { useMemo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { BlockState, BlockType, type BlockData } from "../../types/blocks";
import { BLOCK_METADATA, getBlockStateColor } from "../../utils/blocks";
import { useModalStore } from "../../store/modalStore";
import { Settings } from "lucide-react";
import { useConfigStore } from "../../store/configStore";
import { useCompletionStore } from "../../store/completionStore";
import "./customBlock.css";

// Props for our custom block component
interface CustomBlockProps extends NodeProps {
  data: BlockData; // Our custom block data
}

// Helper functions for conditional styling (same as before)
const getBlockClassName = (selected: boolean, state: BlockState): string => {
  let className = "customBlock";

  if (selected) {
    className += " customBlock--selected";
  }

  switch (state) {
    case BlockState.RUNNING:
      className += " customBlock--running";
      break;
    case BlockState.SUCCESS:
      className += " customBlock--success";
      break;
    case BlockState.ERROR:
      className += " customBlock--error";
      break;
  }

  return className;
};

const getIconClassName = (state: BlockState): string => {
  let className = "customBlockIcon";

  if (state === BlockState.SUCCESS) {
    className += " customBlockIcon--success";
  }

  return className;
};

const getStateClassName = (state: BlockState): string => {
  let className = "customBlockState";

  if (state === BlockState.RUNNING) {
    className += " customBlockState--running";
  }

  return className;
};

// Custom block component that will replace the default React Flow nodes
const CustomBlock: React.FC<CustomBlockProps> = ({ id, data, selected }) => {
  // Get metadata for this block type (color, icon, etc.)
  const metadata = BLOCK_METADATA[data.type];

  // Get modal functions from Zustand store
  const { openModal } = useModalStore();
  const { getAIConfig, getAmazonConfig, getGmailConfig, getSlackConfig } =
    useConfigStore();
  const { checkBlockCompletion } = useCompletionStore();

  // Get the current configuration for this block type
  // This is called on every render to ensure we get the latest config values
  const currentConfig = (() => {
    switch (data.type) {
      case BlockType.AI_AGENT:
        return getAIConfig(id);
      case BlockType.AMAZON_SALES:
        return getAmazonConfig(id);
      case BlockType.GMAIL:
        return getGmailConfig(id);
      case BlockType.SLACK:
        return getSlackConfig(id);
      default:
        return null;
    }
  })();
  // Check if block configuration is complete
  const isBlockComplete = useMemo((): boolean => {
    if (!currentConfig) return true; // Unknown types are considered complete
    return checkBlockCompletion(id, data.type, currentConfig);
  }, [id, data.type, currentConfig, checkBlockCompletion]);

  // Get background color for incomplete blocks (gray) or normal block color
  const getIncompleteBlockColor = (): string => {
    return isBlockComplete ? metadata.color : "#C9CDCF";
  };

  const getBlockBackgroundColor = (
    state: BlockState,
    metadata: { color: string }
  ): string => {
    // For IDLE state, check if block configuration is complete
    if (state === BlockState.IDLE) {
      const incompleteColor = getIncompleteBlockColor();
      if (incompleteColor !== metadata.color) {
        return incompleteColor; // Gray color for incomplete blocks
      }
      return metadata.color; // Use block type color when idle and complete
    }

    // For all other states (RUNNING, SUCCESS, ERROR), use normal state colors
    if (state === BlockState.ERROR) {
      return "#EF4444"; // Red color for error state
    }

    return getBlockStateColor(state); // Use state color for running/success
  };

  // Handle block click to open configuration modal
  const handleBlockClick = (event: React.MouseEvent) => {
    // Prevent event from bubbling to ReactFlow (which would deselect the node)
    event.stopPropagation();

    // Open the configuration modal for this block
    openModal(data.type, id);
  };

  return (
    <div
      className={getBlockClassName(selected, data.state)}
      style={{
        background: getBlockBackgroundColor(data.state, metadata),
      }}
      onClick={handleBlockClick} // Add click handler
    >
      {/* Block icon and label */}
      <div className={getIconClassName(data.state)}>
        {data.state === BlockState.SUCCESS ? (
          "✅"
        ) : data.state === BlockState.ERROR ? (
          "❌"
        ) : (
          <img
            src={metadata.icon}
            alt={metadata.label}
            className="customBlockIconImage"
          />
        )}
      </div>

      <div className="customBlockLabel">{data.label}</div>

      {/* Show configuration warning text only for incomplete IDLE blocks */}
      {data.state === BlockState.IDLE && !isBlockComplete && (
        <div className="customBlockIncompleteText">
          Complete the configuration
        </div>
      )}

      {/* Show current state for feedback */}
      {data.state !== BlockState.IDLE && (
        <div className={getStateClassName(data.state)}>
          {data.state === BlockState.RUNNING && "⚡ "}
          {data.state}
        </div>
      )}

      {/* Configuration icon/indicator */}
      <div className="customBlockConfigIcon" title="Click to configure">
        <Settings />
      </div>

      {/* Input handle - connection point where other blocks can connect TO this block */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={true}
        onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking handles
      />

      {/* Output handle - connection point where this block can connect to other blocks */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking handles
      />
    </div>
  );
};

export default CustomBlock;
