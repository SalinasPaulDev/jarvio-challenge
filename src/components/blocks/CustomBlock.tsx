import React, { useMemo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { BlockState, BlockType, type BlockData } from "../../types/blocks";
import { BLOCK_METADATA, getBlockStateColor } from "../../utils/blocks";
import { useModalStore } from "../../store/modalStore";
import { Settings } from "lucide-react";
import { useConfigStore } from "../../store/configStore";
import { useCompletionStore } from "../../store/completionStore";
import "./customBlock.css";

interface CustomBlockProps extends NodeProps {
  data: BlockData;
}

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

const CustomBlock: React.FC<CustomBlockProps> = ({ id, data, selected }) => {
  const metadata = BLOCK_METADATA[data.type];

  const { openModal } = useModalStore();
  const { getAIConfig, getAmazonConfig, getGmailConfig, getSlackConfig } =
    useConfigStore();
  const { checkBlockCompletion } = useCompletionStore();

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
  const isBlockComplete = useMemo((): boolean => {
    if (!currentConfig) return true;
    return checkBlockCompletion(id, data.type, currentConfig);
  }, [id, data.type, currentConfig, checkBlockCompletion]);

  const getIncompleteBlockColor = (): string => {
    return isBlockComplete ? metadata.color : "#C9CDCF";
  };

  const getBlockBackgroundColor = (
    state: BlockState,
    metadata: { color: string }
  ): string => {
    if (state === BlockState.IDLE) {
      const incompleteColor = getIncompleteBlockColor();
      if (incompleteColor !== metadata.color) {
        return incompleteColor;
      }
      return metadata.color;
    }

    if (state === BlockState.ERROR) {
      return "#EF4444";
    }

    return getBlockStateColor(state);
  };

  const handleBlockClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    openModal(data.type, id);
  };

  return (
    <div
      className={getBlockClassName(selected, data.state)}
      style={{
        background: getBlockBackgroundColor(data.state, metadata),
      }}
      onClick={handleBlockClick}
    >
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

      {data.state === BlockState.IDLE && !isBlockComplete && (
        <div className="customBlockIncompleteText">
          Complete the configuration
        </div>
      )}

      {data.state === BlockState.IDLE && (
        <div className="customBlockIdleState">{data.state}</div>
      )}

      {data.state !== BlockState.IDLE && (
        <div className={getStateClassName(data.state)}>
          {data.state === BlockState.RUNNING && "⚡ "}
          {data.state}
        </div>
      )}

      <div className="customBlockConfigIcon" title="Click to configure">
        <Settings />
      </div>

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={true}
        onClick={(e) => e.stopPropagation()}
      />

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default CustomBlock;
