// Standard Imports
import React, { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, Position, type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";

// Router Dom Import
import { useNavigate } from "react-router-dom";

// Import Types
import type { TreeNode, Example } from "./Types";

// API prefix
const API = "http://localhost:8080";

// Node Visual Params
const NODE_W = 220;
const NODE_H = 68;
const H_GAP = 70;
const V_GAP = 120;

// Palette (tuned for dark blue canvas)
const PALETTE = {
  internalBg: "#8B6B4A",     // brown
  internalBorder: "#6E543B",
  leafYesBg: "#CBEED1",      // soft green
  leafYesBorder: "#9AC5A3",
  leafNoBg: "#F6D7D7",       // soft red
  leafNoBorder: "#D7A7A7",
  text: "#0F1320"
};

function isLeaf(n: TreeNode) {
  return !n.children || n.children.length === 0;
}
function edgeText(n: TreeNode) {
  return (n.edgeLabel ?? n.attributeValue ?? "") || "";
}

// Converts Decision Tree JSON -> React Flow nodes/edges
function buildFlowFromJson(root: TreeNode) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 1;
  let edgeId = 1;

  function walk(n: TreeNode, parentId?: string) {
    const id = String(nodeId++);

    // style per node kind
    const leaf = isLeaf(n);
    const isYes = leaf && String(n.name).toLowerCase() === "yes";
    const bg = leaf ? (isYes ? PALETTE.leafYesBg : PALETTE.leafNoBg) : PALETTE.internalBg;
    const border = leaf ? (isYes ? PALETTE.leafYesBorder : PALETTE.leafNoBorder) : PALETTE.internalBorder;

    nodes.push({
      id,
      data: { label: leaf ? ` ${n.name}` : n.name },
      position: { x: 0, y: 0 },
      style: {
        width: NODE_W,
        height: NODE_H,
        borderRadius: 12,
        border: `2px solid ${border}`,
        background: bg,
        color: PALETTE.text,
        fontWeight: leaf ? 700 : 600,
        fontSize: 30,
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)"
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top
    });

    if (parentId) {
      edges.push({
        id: `e${edgeId++}`,
        source: parentId,
        target: id,
        label: edgeText(n)
      });
    }

    if (n.children && n.children.length) {
      const ordered = [...n.children].sort((a, b) =>
        edgeText(a).localeCompare(edgeText(b), undefined, { numeric: true, sensitivity: "base" })
      );
      ordered.forEach(child => walk(child, id));
    }
  }

  walk(root);
  return { nodes, edges };
}

/** Simple top-down, centered tree layout */
function centerTreeLayout(nodes: Node[], edges: Edge[]) {
  const children = new Map<string, string[]>();
  const hasParent = new Set<string>();
  nodes.forEach(n => children.set(n.id, []));
  edges.forEach(e => {
    children.get(e.source)!.push(e.target);
    hasParent.add(e.target);
  });
  const rootId = nodes.find(n => !hasParent.has(n.id))?.id;
  if (!rootId) return nodes;

  const depth = new Map<string, number>();
  (function dfsDepth(id: string, d: number) {
    depth.set(id, d);
    (children.get(id) || []).forEach(c => dfsDepth(c, d + 1));
  })(rootId, 0);

  const xPos = new Map<string, number>();
  let col = 0;
  function place(id: string): number {
    const kids = children.get(id) || [];
    if (kids.length === 0) {
      const x = col * (NODE_W + H_GAP);
      col += 1;
      xPos.set(id, x);
      return x;
    }
    const xs = kids.map(place);
    const x = xs.reduce((a, b) => a + b, 0) / xs.length;
    xPos.set(id, x);
    return x;
  }
  place(rootId);

  let laidOut = nodes.map(n => ({
    ...n,
    position: {
      x: xPos.get(n.id)!,
      y: depth.get(n.id)! * (NODE_H + V_GAP)
    }
  }));

  const xs = laidOut.map(n => n.position.x);
  const ys = laidOut.map(n => n.position.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys);
  const offsetX = -((minX + maxX) / 2);
  const offsetY = -minY;

  laidOut = laidOut.map(n => ({
    ...n,
    position: { x: n.position.x + offsetX, y: n.position.y + offsetY }
  }));

  return laidOut;
}

export default function TreePage() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/tree`)
      .then(r => r.json())
      .then(setTree)
      .catch(console.error);
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (!tree) return { nodes: [] as Node[], edges: [] as Edge[] };
    const built = buildFlowFromJson(tree);
    const laidOut = centerTreeLayout(built.nodes, built.edges);
    return { nodes: laidOut, edges: built.edges };
  }, [tree]);

  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        onNodeClick={(_, node) => navigate(`/node/${node.id}`)}
        defaultEdgeOptions={{
          labelStyle: { fontSize: 16, fontWeight: 600 },
          labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
          labelBgPadding: [6, 4],
          labelBgBorderRadius: 6
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
