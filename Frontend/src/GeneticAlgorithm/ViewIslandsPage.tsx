import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
import { useIslands } from "./IslandsContext";
import IslandNode from "./IslandNode";

// Optional: Define a type for your island data
interface IslandData {
  label: string;
  population: number;
  selectionRate: number;
  selectionStrategy: string;
  mutationRate: number;
  mutationStrategy: string;
  crossoverRate: number;
  crossoverStrategy: string;
  ruleLengthPenalty: number;
}

// Extend Edge type to support direction
type IslandEdge = Edge & { direction?: "uni" | "bi" };

const nodeTypes = { islandNode: IslandNode };

export default function ViewIslandsPage() {
  const navigate = useNavigate();

  

  // 🔹 State for nodes and edges
  const [nodes, setNodes] = useState<Node<IslandData>[]>([]);
  const { islands, edges, setEdges } = useIslands();

  // 🔹 User-selected edge direction
  const [edgeDirection, setEdgeDirection] = useState<"uni" | "bi">("uni");

  // 🔹 Sync nodes whenever islands change
  useEffect(() => {
    if (!islands) return;

    const newNodes: Node<IslandData>[] = islands.map((island, idx) => ({
      id: `island-${idx + 1}`,
      type: "islandNode",
      position: { x: idx * 300, y: 200 },
      data: {
        label: `Island ${idx + 1}`,
        population: island.populationSize,
        ...island,
      },
    }));

    setNodes(newNodes);
  }, [islands]);

  // 🔹 Allow dragging of nodes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // 🔹 Allow editing of edges
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // 🔹 Allow connecting nodes by dragging handles
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => {
        const newEdges: IslandEdge[] = [];

        // forward edge
        newEdges.push({
        id: `${params.source}-${params.target}`,
        source: params.source!,
        target: params.target!,
        label: edgeDirection === "bi" ? "bi" : "uni",
        style: { stroke: edgeDirection === "bi" ? "#ff6b6b" : "#999" },
        labelStyle: { fill: "#fff", fontWeight: 600 },
        direction: edgeDirection,
        } as IslandEdge);


        // reverse edge if bidirectional
        if (edgeDirection === "bi") {
          newEdges.push({
            ...params,
            id: `${params.target}-${params.source}`,
            source: params.target!,
            target: params.source!,
            label: "bi",
            style: { stroke: "#ff6b6b" },
            labelStyle: { fill: "#fff", fontWeight: 600 },
            direction: "bi",
          });
        }

        return [...eds, ...newEdges];
      }),
    [edgeDirection]
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {nodes.length === 0 ? (
        <div style={{ padding: 20 }}>
          <p style={{ color: "#fff" }}>No islands created yet.</p>
          <button
            onClick={() => navigate("/ga_results")}
            style={{
              marginTop: 16,
              cursor: "pointer",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
            }}
          >
            Back to Results
          </button>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={(_, node) => navigate(`/island/${node.id}`)}
          fitView
        >
          <Background gap={20} color="#555" />
          <MiniMap />
          <Controls />
        </ReactFlow>
      )}

      {/* Migration mode selector */}
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
        <label style={{ color: "#fff", marginRight: 8 }}>Connection Type:</label>
        <select
          value={edgeDirection}
          onChange={(e) => setEdgeDirection(e.target.value as "uni" | "bi")}
          style={{ padding: 6, borderRadius: 6 }}
        >
          <option value="uni">Unidirectional</option>
          <option value="bi">Bidirectional</option>
        </select>
      </div>

      {/* Back button */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <button
          onClick={() => navigate("/ga_results")}
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          ⬅ Back to Results
        </button>
      </div>
    </div>
  );
}
