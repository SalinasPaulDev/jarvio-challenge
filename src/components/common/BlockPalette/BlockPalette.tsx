import React from "react";
import { BlockType } from "../../../types/blocks";
import { BLOCK_METADATA } from "../../../utils/blocks";
import logo from "../../../assets/jarvio-logo.webp";
import "./blockPalette.css";
import { Play, Loader2 } from "lucide-react";

interface BlockPaletteProps {
  onDragStart: (event: React.DragEvent, blockType: BlockType) => void;
  onRunTest: () => void;
  isTestRunning: boolean;
  isDisabled: boolean;
  isPaletteDisabled: boolean;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({
  onDragStart,
  onRunTest,
  isTestRunning,
  isDisabled,
  isPaletteDisabled,
}) => {
  return (
    <>
      <div className="blockPaletteMobileWarning">
        📱 This app is not optimized for mobile view. Please use a computer to
        access all functionalities. You can still run processes on mobile.
      </div>
      {isPaletteDisabled && (
        <div className="blockPaletteErrorMessage blockPaletteErrorMessage--mobile">
          ⚠️ You reached the maximum number of blocks
        </div>
      )}
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

        <div
          className={`blockPaletteBlocks ${
            isPaletteDisabled ? "blockPalette--disabled" : ""
          }`}
        >
          {Object.values(BlockType).map((blockType) => {
            const metadata = BLOCK_METADATA[blockType];

            return (
              <div
                key={blockType}
                className="blockPaletteItem"
                draggable
                onDragStart={(event) =>
                  isPaletteDisabled ? null : onDragStart(event, blockType)
                }
                style={{
                  backgroundColor: metadata.color,
                }}
              >
                <img
                  src={metadata.icon}
                  alt={metadata.label}
                  className="blockPaletteItemIcon"
                />

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

        {isPaletteDisabled ? (
          <div className="blockPaletteErrorMessage blockPaletteErrorMessage--desktop">
            ⚠️ You reached the maximum number of blocks
          </div>
        ) : (
          <div className="blockPaletteInstructions">
            💡 Drag blocks to the canvas to create your flow
          </div>
        )}
      </div>
    </>
  );
};

export default BlockPalette;
