import type { Node, Edge } from "@xyflow/react";
import { getDependencies } from "./nodesHandler";
export const getExecutionLevels = (nodes: Node[], edges: Edge[]) => {
  const levels = [];
  const completed = new Set();

  while (completed.size < nodes.length) {
    const readyNodes = nodes.filter(
      (node) =>
        !completed.has(node.id) &&
        getDependencies(node.id, edges).every((dep) => completed.has(dep))
    );

    if (readyNodes.length === 0) break; // Circular dependency

    levels.push(readyNodes);
    readyNodes.forEach((node) => completed.add(node.id));
  }

  return levels;
};

export const createStepMapping = (levels: Node[][]) => {
  const mapping = new Map();
  let stepIndex = 0;

  levels.forEach((level) => {
    level.forEach((block) => {
      mapping.set(block.id, stepIndex);
      stepIndex++;
    });
  });

  return mapping;
};
