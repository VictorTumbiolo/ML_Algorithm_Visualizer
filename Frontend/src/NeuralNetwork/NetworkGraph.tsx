import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  Handle,
  Position,
} from "reactflow";
import { useLocation, useNavigate } from "react-router-dom";
import "reactflow/dist/style.css";

// --- Custom node type for hidden layers ---
const HiddenNode = ({ data }: any) => (
  <div
    style={{
      width: 80,
      height: 40,
      background: "#f5a623",
      borderRadius: 10,
      color: "#fff",
      fontWeight: 700,
      textAlign: "center",
      lineHeight: "40px",
      fontSize: 22,
      position: "relative",
      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    }}
  >
    σ
    <Handle type="target" position={Position.Left} style={{ background: "#fff" }} />
    <Handle type="source" position={Position.Right} style={{ background: "#fff" }} />
  </div>
);

// --- Helper: create layer nodes ---
function createLayerNodes(
  layerId: string,
  count: number,
  x: number,
  yStart: number,
  spacing: number,
  labels?: string[],
  type: string = "default"
): Node[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${layerId}-${i}`,
    type,
    position: { x, y: yStart + i * spacing },
    data: { label: labels ? labels[i] : `${layerId.toUpperCase()} ${i + 1}` },
    style:
      type === "hidden"
        ? undefined
        : {
            width: 120,
            height: 40,
            backgroundColor:
              layerId === "input"
                ? "#4caf50"
                : layerId === "output"
                ? "#2196f3"
                : "#f5a623",
            color: "#fff",
            borderRadius: 10,
            textAlign: "center",
            lineHeight: "40px",
            fontWeight: 600,
            cursor: "pointer",
          },
  })) as Node[];
}

// --- Helper: fully connect two layers ---
function fullyConnect(from: Node[], to: Node[]): Edge[] {
  const edges: Edge[] = [];
  for (const f of from) {
    for (const t of to) {
      edges.push({
        id: `e-${f.id}-${t.id}`,
        source: f.id,
        target: t.id,
        animated: true,
      });
    }
  }
  return edges;
}

const NetworkGraph: React.FC = () => {
  const { state } = useLocation() as {
    state?: {
      hiddenLayers?: number;
      neuronsPerLayer?: number;
      activation?: string;
      learningRate?: number;
      momentum?: number;
      epochs?: number;
    };
  };

  const navigate = useNavigate();

  // Pull values or defaults
  const hiddenLayers = state?.hiddenLayers ?? 1;
  const neuronsPerLayer = state?.neuronsPerLayer ?? 5;
  const inputLabels = ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"];
  const outputLabels = ["Setosa", "Virginica", "Versicolor"];

  // ✅ Memoize nodeTypes to prevent React Flow warnings
  const nodeTypes = useMemo(() => ({ hidden: HiddenNode }), []);

  // Create layers
  const inputNodes = createLayerNodes("input", inputLabels.length, 100, 100, 80, inputLabels);
  const hiddenLayerNodes: Node[] = [];

  for (let h = 0; h < hiddenLayers; h++) {
    hiddenLayerNodes.push(
      ...createLayerNodes(`hidden${h + 1}`, neuronsPerLayer, 250 + h * 150, 100, 70, undefined, "hidden")
    );
  }

  const outputNodes = createLayerNodes(
    "output",
    outputLabels.length,
    250 + hiddenLayers * 150,
    130,
    100,
    outputLabels
  );

  // Combine all nodes
  const allNodes = [...inputNodes, ...hiddenLayerNodes, ...outputNodes];

  // Connect layers
  let allEdges: Edge[] = [];
  if (hiddenLayers > 0) {
    allEdges = [
      ...fullyConnect(inputNodes, hiddenLayerNodes.filter((n) => n.id.startsWith("hidden1"))),
    ];

    for (let h = 1; h < hiddenLayers; h++) {
      const prev = hiddenLayerNodes.filter((n) => n.id.startsWith(`hidden${h}`));
      const next = hiddenLayerNodes.filter((n) => n.id.startsWith(`hidden${h + 1}`));
      allEdges.push(...fullyConnect(prev, next));
    }

    const lastHidden = hiddenLayerNodes.filter((n) =>
      n.id.startsWith(`hidden${hiddenLayers}`)
    );
    allEdges.push(...fullyConnect(lastHidden, outputNodes));
  } else {
    allEdges = fullyConnect(inputNodes, outputNodes);
  }

  const [nodes, , onNodesChange] = useNodesState(allNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(allEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // ✅ Handle node double-click
const onNodeDoubleClick = useCallback(
  (_: any, node: Node) => {
    let endpoint = "";
    let layer: number | null = null;
    let layerPosition: number | null = null;

    console.log("🧠 Double-clicked node:", node.id, "type:", node.type);

    // --- Hidden node ---
    if (node.type === "hidden") {
      const match = node.id.match(/^hidden(\d+)-(\d+)$/);
      if (match) {
        layer = parseInt(match[1]) - 1; // 0-based for backend
        layerPosition = parseInt(match[2]);
        endpoint = `http://localhost:8080/nn/hiddenNodeInfo?layer=${layer}&layerPosition=${layerPosition}`;
      } else {
        console.warn("❌ Invalid hidden node ID format:", node.id);
        return;
      }
    }

    // --- Input node ---
    else if (node.id.startsWith("input-")) {
      const nodePosition = parseInt(node.id.split("-")[1]);
      if (isNaN(nodePosition)) {
        console.warn("❌ Invalid input node ID:", node.id);
        return;
      }
      endpoint = `http://localhost:8080/nn/inputNodeInfo?nodePosition=${nodePosition}`;
    }

    // --- Output node ---
    else if (node.id.startsWith("output-")) {
      const nodePosition = parseInt(node.id.split("-")[1]);
      if (isNaN(nodePosition)) {
        console.warn("❌ Invalid output node ID:", node.id);
        return;
      }
      endpoint = `http://localhost:8080/nn/outputNodeInfo?nodePosition=${nodePosition}`;
    }

    // --- Safety check ---
    if (!endpoint) {
      console.warn("⚠️ Ignoring unrecognized node:", node.id);
      return;
    }

    console.log(`✅ Navigating to endpoint: ${endpoint}`);

    navigate("/node_info", {
      state: {
        id: node.id,
        label: node.data.label,
        type: node.type,
        endpoint,
        layer,
        layerPosition,
      },
    });
  },
  [navigate]
);





  return (
    <div style={{ width: "100%", height: "100vh", background: "#0b1628" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background gap={16} color="#aaa" />
      </ReactFlow>

      {/* Overlay info box */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#fff",
          background: "rgba(0,0,0,0.6)",
          padding: "10px 16px",
          borderRadius: 8,
        }}
      >
        <strong>Activation:</strong> {state?.activation ?? "sigmoid"} <br />
        <strong>Hidden Layers:</strong> {hiddenLayers} <br />
        <strong>Neurons/Layer:</strong> {neuronsPerLayer} <br />
        <strong>Learning Rate:</strong> {state?.learningRate ?? 0.05} <br />
        <strong>Momentum:</strong> {state?.momentum ?? 0.8} <br />
        <strong>Epochs:</strong> {state?.epochs ?? 500}
      </div>
    </div>
  );
};

export default NetworkGraph;
