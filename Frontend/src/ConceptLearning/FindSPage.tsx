// src/ConceptLearning/FindSPage.tsx

import React, { useState, useRef } from "react";

export default function FindSPage() {
  const allExamples = [
    ["Sunny", "Warm", "Normal", "Strong", "Warm", "Same", "Yes"],
    ["Sunny", "Warm", "High", "Strong", "Warm", "Same", "Yes"],
    ["Rainy", "Cold", "High", "Strong", "Warm", "Change", "No"],
    ["Sunny", "Warm", "High", "Strong", "Cool", "Change", "Yes"],
  ];

  const [seenExamples, setSeenExamples] = useState<string[][]>([]);
  const [unseenExamples, setUnseenExamples] = useState<string[][]>(allExamples);
  const [currentHypothesis, setCurrentHypothesis] = useState<string[] | null>(null);

  // Refs for drag tracking
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

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

  const handleShuffle = () => {
    const shuffled = [...unseenExamples].sort(() => Math.random() - 0.5);
    setUnseenExamples(shuffled);
  };

  // ✅ Find-S core logic
  const handleNextExample = () => {
    if (unseenExamples.length === 0) return;

    const [next, ...rest] = unseenExamples;
    setSeenExamples([...seenExamples, next]);
    setUnseenExamples(rest);

    const label = next[next.length - 1];

    // If negative example, skip
    if (label === "No") return;

    // If hypothesis is not yet initialized, set it to this positive example
    if (!currentHypothesis) {
      setCurrentHypothesis(next.slice(0, -1)); // remove label
      return;
    }

    // Otherwise, generalize existing hypothesis
    const updated = currentHypothesis.map((hVal, i) => {
      if (hVal === next[i]) return hVal;
      return "?";
    });
    setCurrentHypothesis(updated);
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
            seenExamples.map((ex, i) => (
              <p key={i}>{ex.join(", ")}</p>
            ))
          )}
        </div>
      </div>

      {/* Middle Column — Hypothesis */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: "#4cafef" }}>Current Hypothesis</h2>
        <div
          style={{
            border: "1px solid #4cafef",
            borderRadius: 8,
            padding: "20px",
            background: "#2a9d8f",
            fontSize: "1.2rem",
            fontWeight: "bold",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentHypothesis ? currentHypothesis.join(" ") : "(Most specific hypothesis not yet set)"}
        </div>

        <button
          onClick={handleNextExample}
          style={{
            marginTop: "20px",
            background: "#e76f51",
            border: "none",
            color: "#fff",
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
