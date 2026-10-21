import React from "react";
import { Handle, Position } from "reactflow";

export default function IslandNode({ data }: any) {
  return (
    <div
      style={{
        width: 150,
        height: 75, // half height
        borderTopLeftRadius: 150,
        borderTopRightRadius: 150,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        background: "radial-gradient(circle at 70% 30%, #fef6d8 40%, #4ecdc4 90%)", // sand → ocean
        border: "3px solid #2a9d8f",
        boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 16,
        color: "#2b2b2b",
        position: "relative"
      }}
    >
      {/* Palm tree emoji at the top */}
      <span
        style={{
          position: "absolute",
          top: -55,
          fontSize: 50
        }}
      >
        🌴
      </span>

      <span
        style={{
          position: "absolute",
          top: -30,
          left: -10,
          fontSize: 50
        }}
      >
        🌴
      </span>

       <span
        style={{
          position: "absolute",
          top: -25,
          right: -10,
          fontSize: 50
        }}
      >
        🌴
      </span>

      {/* Label + stats */}
      <div style={{ textAlign: "center" }}>
        {data.label}
        <br />
        Pop: {data.population}
      </div>

      {/* Optional handles for connecting edges */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
