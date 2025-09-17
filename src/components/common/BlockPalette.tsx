// src/components/common/BlockPalette.tsx
import React from "react";
import { BlockType } from "../../types/blocks";
import { BLOCK_METADATA } from "../../utils/blocks";
import logo from "../../assets/jarvio-logo.webp";
import "./blockPalette.css";
import { Play, Loader2 } from "lucide-react";

// Props for the block palette component
interface BlockPaletteProps {
  onDragStart: (event: React.DragEvent, blockType: BlockType) => void;
  onRunTest: () => void;
  isTestRunning: boolean;
  isDisabled: boolean;
}

// Block palette component - shows draggable block types
const BlockPalette: React.FC<BlockPaletteProps> = ({
  onDragStart,
  onRunTest,
  isTestRunning,
  isDisabled,
}) => {
  return (
    <div className="blockPalette">
      <div className="blockPaletteHeader">
        <img src={logo} alt="Logo" className="blockPaletteLogo" />
        <button
          className={`runTestButton ${
            isTestRunning ? "runTestButton--running" : ""
          }`}
          onClick={onRunTest}
          disabled={isTestRunning || isDisabled}
        >
          <span>{isTestRunning ? "Running..." : "Run Test"}</span>
          {isTestRunning ? (
            <Loader2
              size={14}
              color="orange"
              className="runTestButton__spinner"
            />
          ) : (
            <Play size={14} color="green" fill="green" />
          )}
        </button>
      </div>
      <h3 className="blockPaletteTitle">📦 Add a new block</h3>

      <div className="blockPaletteBlocks">
        {/* Create a draggable item for each block type */}
        {Object.values(BlockType).map((blockType) => {
          const metadata = BLOCK_METADATA[blockType];

          return (
            <div
              key={blockType}
              className="blockPaletteItem"
              draggable // Makes the element draggable
              onDragStart={(event) => onDragStart(event, blockType)} // Handle drag start
              style={{
                backgroundColor: metadata.color, // Keep dynamic color as inline style
              }}
            >
              {/* Block icon */}
              <img
                src={metadata.icon}
                alt={metadata.label}
                className="blockPaletteItemIcon"
              />

              {/* Block info */}
              <div>
                <div className="blockPaletteItemLabel">{metadata.label}</div>
                <div className="blockPaletteItemDescription">
                  {metadata.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions for users */}
      <div className="blockPaletteInstructions">
        💡 Drag blocks to the canvas to create your flow
      </div>
    </div>
  );
};

export default BlockPalette;
