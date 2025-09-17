import type { Edge, Node } from "@xyflow/react";

export const getDependencies = (nodeId: string, edges: Edge[]) => {
  return edges
    .filter((edge) => edge.target === nodeId)
    .map((edge) => edge.source);
};

export const getSource = (nodeId: string, edges: Edge[]) => {
  return edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.target);
};

export const getBlockWithoutDependenciesNorSource = (
  nodes: Node[],
  edges: Edge[]
) => {
  return nodes.filter(
    (node) =>
      getDependencies(node.id, edges).length === 0 &&
      getSource(node.id, edges).length === 0
  );
};
