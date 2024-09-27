"use client";
import ActionNode from "@/components/Node/ActionTrigger";
import TriggerNode from "@/components/Node/TrigerNdoe";
import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";

// Define the type for each action item
type ActionType = {
  index: number;
  availableActionId: string;
  availableActionName: string;
  metadata: Record<string, any>;
};

// Define the node types mapping
const nodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
};

// Initial set of nodes with one Trigger Node and one Action Node
const initialNodes = [
  {
    id: "trigger-1",
    position: { x: 50, y: 50 },
    data: { label: "Trigger Node" },
    type: "triggerNode",
  },
  { id: "action-1", position: { x: 50, y: 150 }, data: { label: "Action Node" }, type: "actionNode" },
];
const initialEdges = [{ id: "edge-1", source: "trigger-1", target: "action-1" }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Use the ActionType for the selectedActions state
  const [selectedActions, setSelectedActions] = useState<ActionType[]>([]);

  // State to hold the button position
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  // Calculate the position of the button at the midpoint of the two nodes
  useEffect(() => {
    const triggerNode = nodes.find((node) => node.id === "trigger-1");
    const actionNode = nodes.find((node) => node.id === "action-1");

    if (triggerNode && actionNode) {
      const midpointX = (triggerNode.position.x + actionNode.position.x) / 2;
      const midpointY = (triggerNode.position.y + actionNode.position.y) / 2;

      setButtonPosition({ x: midpointX, y: midpointY });
    }
  }, [nodes]);

  // Function to add a new Action node based on custom fields
  const handleAddAction = (actionId: string, actionName: string, actionMetadata: Record<string, any>) => {
    const newNode = {
      id: `action-${nodes.length + 1}`,
      position: { x: 10, y: 100 },
      data: {
        label: `Action Node: ${actionName}`, // Use the action name in the label
        availableActionId: actionId,
        availableActionName: actionName,
        metadata: actionMetadata,
      },
    };

    // Update the nodes state with the new Action node
    setNodes((nds) => [...nds, newNode]);

    // Update the selectedActions state with the correct type
    setSelectedActions((actions) => [
      ...actions,
      {
        index: nodes.length + 1, // Maintain index consistency for new nodes
        availableActionId: actionId,
        availableActionName: actionName,
        metadata: actionMetadata,
      },
    ]);
  };

  // Handle connecting nodes
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-screen h-screen relative">
    
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes} 
        fitView
        style={{ background: "#f0f0f0" }}
      />
    </div>
  );
}
