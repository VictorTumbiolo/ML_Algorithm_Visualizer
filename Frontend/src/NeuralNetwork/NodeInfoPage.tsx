import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NodeInfoPage: React.FC = () => {
  const { state } = useLocation() as {
    state?: {
      id: string;
      label: string;
      type: string;
      layer?: number | null;
      layerPosition?: number | null;
    };
  };
  const navigate = useNavigate();

  const [connectedNodes, setConnectedNodes] = useState<
    { target: string; weight: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Output labels for Iris dataset
  const outputLabels = ["Setosa", "Virginica", "Versicolor"];

  useEffect(() => {
    if (!state) return;

    // 🧠 Handle Output Nodes (no backend call)
    if (state.id.startsWith("output-")) {
      const pos = parseInt(state.id.split("-")[1]);
      const label = outputLabels[pos] || "Unknown Classification";

      setConnectedNodes([
        {
          target: `Classification: ${label}`,
          weight: "N/A",
        },
      ]);
      return;
    }

    const fetchNodeInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "";

        // ✅ Input node
        if (state.id.startsWith("input-")) {
          const pos = parseInt(state.id.split("-")[1]);
          url = `http://localhost:8080/nn/inputNodeInfo?nodePosition=${pos}`;
        }
        // ✅ Hidden node
        else if (state.layer !== null && state.layer !== undefined) {
          url = `http://localhost:8080/nn/hiddenNodeInfo?layer=${state.layer}&layerPosition=${state.layerPosition}`;
        } else {
          console.warn("⚠️ Unknown node type:", state);
          return;
        }

        console.log("Fetching node info from:", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();

        const lines = text.trim().split(/\r?\n/);
        const parsed = lines
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => {
            // ✅ Hidden layer connections: "Hidden Layer: X Node: Y weight"
            let match = line.match(/(Hidden Layer: \d+ Node: \d+)\s+([\-\d.eE]+)/);
            if (match) return { target: match[1], weight: match[2] };

            // ✅ Output connections: "Output: X weight"
            match = line.match(/(Output:\s*\d+)\s+([\-\d.eE]+)/);
            if (match) return { target: match[1], weight: match[2] };

            // ✅ Input connections: "Input: X weight"
            match = line.match(/(Input:\s*\d+)\s+([\-\d.eE]+)/);
            if (match) return { target: match[1], weight: match[2] };

            return { target: line, weight: "N/A" };
          });

        setConnectedNodes(parsed);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNodeInfo();
  }, [state]);

  if (!state)
    return (
      <div style={{ color: "#fff", padding: 40 }}>
        <h2>No node selected</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );

  return (
    <div
      style={{
        color: "#fff",
        padding: "40px",
        background: "#0b1628",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <h2 style={{ marginBottom: 10 }}>Node Information</h2>
      <p><strong>ID:</strong> {state.id}</p>
      <p><strong>Label:</strong> {state.label}</p>
      <p><strong>Type:</strong> {state.type ?? "default"}</p>
      <p><strong>Layer:</strong> {state.layer ?? "N/A"}</p>
      <p><strong>Layer Position:</strong> {state.layerPosition ?? "N/A"}</p>

      <hr style={{ borderColor: "#444", margin: "20px 0" }} />

      {loading && <p>Loading connections...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h3 style={{ marginBottom: 10 }}>Connections</h3>
      <div
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
          border: "1px solid #333",
          borderRadius: 8,
          padding: 16,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        {connectedNodes.length === 0 && !loading && (
          <p style={{ opacity: 0.6 }}>No connections found.</p>
        )}

        {connectedNodes.map((conn, index) => (
          <div
            key={index}
            style={{
              padding: "8px 0",
              borderBottom: index !== connectedNodes.length - 1 ? "1px solid #333" : "none",
            }}
          >
            <strong>Connected To:</strong> {conn.target} <br />
            <strong>Weight:</strong>{" "}
            {conn.weight !== "N/A"
              ? Number(conn.weight).toFixed(6)
              : conn.weight}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#2196f3",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ← Back to Network
        </button>
      </div>
    </div>
  );
};

export default NodeInfoPage;
