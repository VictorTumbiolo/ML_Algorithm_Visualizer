import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIslands } from "./IslandsContext";

interface Hypothesis {
  hypothesis: number[];
  fitness: number;
}

export default function IslandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { islands } = useIslands();
  const navigate = useNavigate();

  const islandIndex = id ? parseInt(id.replace("island-", "")) - 1 : -1;
  const island = islands[islandIndex];

  const [hypotheses, setHypotheses] = useState<Hypothesis[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchHypotheses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/ga/getPopulation/${id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Backend error");

        const data = await response.json();

        if (Array.isArray(data)) {
          setHypotheses(data);
        } else {
          setHypotheses(null);
        }
      } catch (err) {
        console.error("Error fetching hypotheses:", err);
        setHypotheses(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHypotheses();
  }, [id]);

  if (!island) {
    return (
      <div style={{ padding: 20, color: "#fff" }}>
        <p>Island not found</p>
        <button onClick={() => navigate("/genetic_islands")}>⬅ Back</button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* Left column: Island info */}
      <div style={{ flex: "0 0 300px", padding: 20 }}>
        <h2>{id}</h2>
        <p><strong>Population Size:</strong> {island.populationSize}</p>
        <p><strong>Selection:</strong> {island.selectionStrategy} ({island.selectionRate})</p>
        <p><strong>Mutation:</strong> {island.mutationStrategy} ({island.mutationRate})</p>
        <p><strong>Crossover:</strong> {island.crossoverStrategy} ({island.crossoverRate})</p>
        <p><strong>Rule Length Penalty:</strong> {island.ruleLengthPenalty}</p>

        <button
          onClick={() => navigate("/genetic_islands")}
          style={{ marginTop: "20px" }}
        >
          ⬅ Back to Islands
        </button>
      </div>

      {/* Right column: Hypotheses */}
      <div
        style={{
          flex: 1,
          padding: 20,
          overflowY: "auto",
        }}
      >
        <h3>Hypotheses</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {hypotheses
              ? hypotheses.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: 12,
                      background: "#2a9d8f",
                      color: "#fff",
                    }}
                  >
                    <strong>Hypothesis {idx + 1}</strong>
                    <p>{h.hypothesis.join(", ")}</p>
                    <p>Fitness: {h.fitness.toFixed(3)}</p>

                    {/* ✅ Updated button */}
<button
  onClick={async () => {
    try {
      // Convert hypothesis array into query params
      const params = new URLSearchParams();
      h.hypothesis.forEach((val) =>
        params.append("hypothesis", val.toString())
      );

      // Call backend
      const response = await fetch(
        `http://localhost:8080/ga/getHypothesisStats?${params.toString()}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Backend call failed");

      const backendInfo = await response.text(); // ⬅️ Capture backend text

      // Navigate after backend call
      navigate("/hypothesis_breakdown", {
        state: { hypothesis: h, backendInfo }, // ⬅️ Pass backend info
      });
    } catch (err) {
      console.error("Error sending hypothesis:", err);
      alert("Failed to send hypothesis to backend.");
    }
  }}
  style={{
    marginTop: "8px",
    padding: "6px 12px",
    background: "#264653",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
  }}
>
  Hypothesis Breakdown
</button>

                  </div>
                ))
              : Array.from({ length: island.populationSize }, (_, i) => (
                  <div
                    key={`na-${i}`}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: 12,
                      background: "#444",
                      color: "#fff",
                    }}
                  >
                    <strong>Hypothesis {i + 1}</strong>
                    <p>N/A</p>
                    <button
                      onClick={() => navigate(`/hypothesis_breakdown`)}
                      style={{
                        marginTop: "8px",
                        padding: "6px 12px",
                        background: "#555",
                        border: "none",
                        borderRadius: 6,
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Hypothesis Breakdown
                    </button>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
