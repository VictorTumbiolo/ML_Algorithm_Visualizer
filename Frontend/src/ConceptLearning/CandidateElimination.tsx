// src/ConceptLearning/CandidateEliminationPage.tsx

import React, { useState, useRef } from "react";

export default function CandidateEliminationPage() {
  // Example dataset
  const allExamples = [
    ["Sunny", "Warm", "Normal", "Strong", "Warm", "Same", "Yes"],
    ["Sunny", "Warm", "High", "Strong", "Warm", "Same", "Yes"],
    ["Rainy", "Cold", "High", "Strong", "Warm", "Change", "No"],
    ["Sunny", "Warm", "High", "Strong", "Cool", "Change", "Yes"],
  ];

  const [seenExamples, setSeenExamples] = useState<string[][]>([]);
  const [unseenExamples, setUnseenExamples] = useState<string[][]>(allExamples);

  // Candidate Elimination boundaries
  const [S, setS] = useState<string[]>(["Ø", "Ø", "Ø", "Ø", "Ø"]);
  const [G, setG] = useState<string[][]>([["?", "?", "?", "?", "?"]]);

  // Drag & drop refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Handle drag start
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  // Handle entering another item
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  // Handle drop reorder
  const handleDrop = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null) return;

    const items = [...unseenExamples];
    const [dragged] = items.splice(from, 1);
    items.splice(to, 0, dragged);
    setUnseenExamples(items);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Shuffle unseen examples
  const handleShuffle = () => {
    const shuffled = [...unseenExamples].sort(() => Math.random() - 0.5);
    setUnseenExamples(shuffled);
  };

  // Helper — check if hypothesis covers an example
  const covers = (hypothesis: string[], example: string[]): boolean =>
    hypothesis.every((val, i) => val === "?" || val === example[i]);

  // ✅ Candidate Elimination Core Update
  const handleNextExample = () => {
    if (unseenExamples.length === 0) return;

    const [next, ...rest] = unseenExamples;
    const label = next[next.length - 1];
    const attributes = next.slice(0, -1);

    setSeenExamples([...seenExamples, next]);
    setUnseenExamples(rest);

    // Initialize S if not yet set
    let newS = [...S];
    if (S.includes("Ø") && label === "Yes") {
      newS = [...attributes];
      setS(newS);
      return;
    }

    // --- Positive Example: specialize S, prune G
    if (label === "Yes") {
      // Generalize S minimally
      newS = S.map((sVal, i) =>
        sVal === attributes[i] ? sVal : "?"
      );

      // Remove any G hypotheses inconsistent with this example
      const newG = G.filter((g) => covers(g, attributes));

      setS(newS);
      setG(newG);
    }

    // --- Negative Example: specialize G, prune S
    else if (label === "No") {
      let newG: string[][] = [];

      G.forEach((g) => {
        // If g covers the negative example, specialize it
        if (covers(g, attributes)) {
          for (let i = 0; i < g.length; i++) {
            if (g[i] === "?") {
              const newHypothesis = [...g];
              newHypothesis[i] = S[i]; // specialize toward S
              if (!covers(newHypothesis, attributes)) {
                newG.push(newHypothesis);
              }
            }
          }
        } else {
          newG.push(g); // keep if already excludes example
        }
      });

      setG(newG);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "20px",
        background: "#0b1628",
        color: "#fff",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      {/* Left Column — Seen Examples */}
      <div>
        <h2 style={{ color: "#4cafef" }}>Seen Examples</h2>
        <div
          style={{
            border: "1px solid #4cafef",
            borderRadius: 8,
            padding: "12px",
            minHeight: "400px",
            background: "#264653",
          }}
        >
          {seenExamples.length === 0 ? (
            <p>No examples seen yet.</p>
          ) : (
            seenExamples.map((ex, i) => <p key={i}>{ex.join(", ")}</p>)
          )}
        </div>
      </div>

      {/* Middle Column — Boundaries */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: "#4cafef" }}>Current Boundaries</h2>

        {/* Specific Boundary */}
        <div
          style={{
            border: "1px solid #4cafef",
            borderRadius: 8,
            padding: "12px",
            background: "#2a9d8f",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#fff" }}>Specific Boundary (S)</h3>
          <p>{S.join(" ")}</p>
        </div>

        {/* General Boundary */}
        <div
          style={{
            border: "1px solid #4cafef",
            borderRadius: 8,
            padding: "12px",
            background: "#e76f51",
          }}
        >
          <h3 style={{ color: "#fff" }}>General Boundary (G)</h3>
          {G.map((g, idx) => (
            <p key={idx}>{g.join(" ")}</p>
          ))}
        </div>

        <button
          onClick={handleNextExample}
          style={{
            marginTop: "20px",
            background: "#e9c46a",
            border: "none",
            color: "#0b1628",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Show Next Example
        </button>
      </div>

      {/* Right Column — Unseen Examples */}
      <div>
        <h2 style={{ color: "#4cafef" }}>Unseen Examples</h2>
        <button
          onClick={handleShuffle}
          style={{
            background: "#e9c46a",
            border: "none",
            color: "#0b1628",
            fontWeight: "bold",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          Shuffle Examples
        </button>

        <div
          style={{
            border: "1px solid #4cafef",
            borderRadius: 8,
            padding: "12px",
            minHeight: "400px",
            background: "#264653",
          }}
        >
          {unseenExamples.length === 0 ? (
            <p>All examples processed.</p>
          ) : (
            unseenExamples.map((ex, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                style={{
                  padding: "8px",
                  marginBottom: "8px",
                  borderRadius: 6,
                  background: "#2a9d8f",
                  color: "#fff",
                  cursor: "grab",
                  transition: "transform 0.1s ease-in-out",
                }}
              >
                {ex.join(", ")}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
