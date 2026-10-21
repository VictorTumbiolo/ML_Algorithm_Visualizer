// Standard Imports
import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";

// Import Types
import type { TreeNode, Example } from "./Types";


// hardcoded backend endpoint
const ENDPOINT = "http://localhost:8080/tree"; 

// Must match TreePage child ordering (you sort by edge label there)
function edgeText(n: TreeNode) {
  // Use left value unless its null or undefined, then use right
  return (n.edgeLabel ?? n.attributeValue ?? "") || "";
}

// Searches the Decision Tree in Preorder for the ID matching what the user clicked on
// This allows us to populate the same template with unique information
// May Change later to a more efficient id mapping process
function findByAssignedId(root: TreeNode, targetId: string): { id: string; node: TreeNode } | null {
  let idCounter = 1;
  let found: { id: string; node: TreeNode } | null = null;

  // Recursive sub function
  function walk(n: TreeNode) {
    const myId = String(idCounter++);
    if (myId === targetId) {
      found = { id: myId, node: n };
      return;
    }
    if (!n.children || n.children.length === 0) return;

    const ordered = [...n.children].sort((a, b) =>
      edgeText(a).localeCompare(edgeText(b), undefined, { numeric: true, sensitivity: "base" })
    );
    for (const child of ordered) {
      if (found) break;
      walk(child);
    }
  }

  walk(root);
  return found;
}

// Functional Component
export default function NodePage() {

  // Get node ID from URL
  const { id } = useParams<{ id: string }>();

  // Componenet State
  const [node, setNode] = useState<TreeNode | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Fetches full tree and finds the requested node
  useEffect(() => {
    if (!id) return;
    fetch(ENDPOINT)
      .then((r) => r.json())
      .then((root: TreeNode) => {
        const hit = findByAssignedId(root, id);
        if (!hit) {
          setErr(`Node not found for id ${id}`);
          setNode(null);
        } else {
          setErr(null);
          setNode(hit.node);
        }
      })
      .catch((e) => {
        console.error(e);
        setErr("Failed to load tree from backend.");
        setNode(null);
      });
  }, [id]);

  // Builds Remaining Attrs List
  // Builds the Table for training examples at the specified Node
  const columns = useMemo(() => {
    const rows = node?.examples ?? [];
    if (!rows.length) return [];
    const order: string[] = [];
    if (node?.remainingAttributes?.length) order.push(...node.remainingAttributes);
    const seen = new Set(order);
    rows.forEach((row) => {
      Object.keys(row).forEach((k) => {
        if (!seen.has(k) && k !== "Play") {
          order.push(k);
          seen.add(k);
        }
      });
    });
    if (!seen.has("Play")) order.push("Play");
    return order;
  }, [node]);

  {/* HTML Content */}
  return (
    <div style={{ height: "100vh", background: "#0f172a", color: "#e5e7eb", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "10px 16px", background: "#111827", borderBottom: "1px solid #1f2937" }}>
        <Link to="/" style={{ color: "#93c5fd", textDecoration: "none" }}>← Back to Tree</Link>
      </header>

      <main style={{ flex: 1, overflow: "auto", padding: 24, display: "grid", gap: 16 }}>
        <section style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>{node ? node.name : "(unknown node)"}</h2>
          <div style={{ opacity: 0.8, fontSize: 14 }}>Node ID: {id}</div>
          {err && <div style={{ marginTop: 8, color: "#fca5a5" }}>{err}</div>}
        </section>

        <section style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Remaining Attributes</h3>
          {node?.remainingAttributes?.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {node.remainingAttributes.map((a) => <li key={a}>{a}</li>)}
            </ul>
          ) : (
            <div style={{ opacity: 0.7 }}>None</div>
          )}
        </section>

        <section style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Training Examples at This Node</h3>
          {(node?.examples?.length ?? 0) === 0 ? (
            <div style={{ opacity: 0.7 }}>No examples</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c} style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #1f2937" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {node!.examples!.map((row, i) => (
                    <tr key={i}>
                      {columns.map((c) => (
                        <td key={c} style={{ padding: "8px 10px", borderBottom: "1px solid #1f2937" }}>
                          {(row[c] as any) ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
