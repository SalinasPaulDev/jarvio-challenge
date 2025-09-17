// src/App.tsx
import { useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  BackgroundVariant,
} from "@xyflow/react";
import { useTestRunner } from "./hooks/useTestRunner";
import { BlockType } from "./types/blocks";
import { createBlock, BLOCK_METADATA } from "./utils/blocks";
import { CustomBlock } from "./components/blocks";
import BlockPalette from "./components/common/BlockPalette";
import { useDragDrop } from "./hooks/useDragDrop";
import "./components/blocks/CustomBlock.css";
import { useBlockStates } from "./hooks/useBlockStates";
import { useModalStore } from "./store/modalStore";
import ModalManager from "./components/config/ModalManager";
import { CustomEdge } from "./components/customEdge/CustomEdge";
import "@xyflow/react/dist/style.css";
import "./components/customEdge/customEdge.css";
import ProcessTracker from "./components/common/ProccessTracker";

const nodeTypes = {
  customBlock: CustomBlock, // Register our custom block component
};

const edgeTypes = {
  custom: CustomEdge,
};

// Define initial nodes using our custom block system
const initialNodes: Node[] = [
  {
    id: "amazon_1",
    type: "customBlock",
    position: { x: 100, y: 100 },
    data: createBlock("amazon_1", BlockType.AMAZON_SALES, { x: 100, y: 100 }),
  },
  {
    id: "ai_1",
    type: "customBlock",
    position: { x: 400, y: 100 },
    data: createBlock("ai_1", BlockType.AI_AGENT, { x: 400, y: 100 }),
  },
  {
    id: "slack_1",
    type: "customBlock",
    position: { x: 700, y: 100 },
    data: createBlock("slack_1", BlockType.SLACK, { x: 700, y: 100 }),
  },
];

// Define initial edges showing the example flow: Amazon → AI Agent → Slack
const initialEdges: Edge[] = [
  {
    id: "e_amazon_to_ai",
    source: "amazon_1", // Source node ID
    target: "ai_1", // Target node ID
  },
  {
    id: "e_ai_to_slack",
    source: "ai_1",
    target: "slack_1",
  },
];

function App() {
  // useState hooks to manage nodes and edges state manually
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { updateBlockState } = useBlockStates(nodes, setNodes);
  const { isOpen, blockType, blockId, closeModal } = useModalStore();
  const { isRunning: testIsRunning, runTest } = useTestRunner(
    nodes,
    edges,
    updateBlockState
  );
  const modalData =
    isOpen && blockType && blockId ? { blockType, blockId } : null;

  // Add the drag and drop hook
  const { onDragStart, onDragOver, onDrop } = useDragDrop();

  // Callback to handle node changes (drag, select, delete, etc.)
  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  // Callback to handle edge changes (select, delete, etc.)
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  // Callback to handle new connections between nodes
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  // Add function to handle dropping new blocks
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      const newNode = onDrop(event);
      if (newNode) {
        // Add the new node to our nodes array
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [onDrop]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* Block Palette */}
      <BlockPalette
        onDragStart={onDragStart}
        onRunTest={runTest}
        isTestRunning={testIsRunning}
        isDisabled={nodes.length === 0}
      />

      {/* ReactFlow component with drag and drop handlers */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={handleDrop}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.8 }}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: "custom",
          animated: true,
          markerEnd: {
            type: "arrowclosed",
            width: 10,
            height: 10,
            color: "black",
          },
        }}
      >
        <Controls style={{ color: "blue" }} />
        <MiniMap
          nodeColor={(node) => {
            const blockType = node.data?.type;
            return blockType
              ? BLOCK_METADATA[blockType as BlockType]?.color || "#3B82F6"
              : "#3B82F6";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#E5E7EB"
        />
      </ReactFlow>
      <ModalManager
        isOpen={modalData}
        onOpenChange={(data) => {
          if (!data) {
            closeModal();
          }
        }}
      />
      <ProcessTracker />
    </div>
  );
}

// Wrapper component with ReactFlowProvider
function AppWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default AppWithProvider;
