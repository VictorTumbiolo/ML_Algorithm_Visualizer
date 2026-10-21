// Standard Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Styling
import "./ResultsPage.css";

// Islands import 
import { useIslands } from "./IslandsContext";


export default function GeneticResultsPage() {
  const navigate = useNavigate();

  // UI state
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  // Form state (for POST)
  const [algorithm, setAlgorithm] = useState("GA");
  const [trainFile, setTrainFile] = useState("Tennis-Train.txt");
  const [testFile, setTestFile] = useState("Tennis-Test.txt");
  const [islandsEnabled, setIslandsEnabled] = useState(false);
  const [numIslands, setNumIslands] = useState(2);

  // Defualt Settings
  const { islands, setIslands } = useIslands();
  const [selectionRate, setSelectionRate] = useState<number>(4);
  const [selectionStrategy, setSelectionStrategy] = useState("tournament");
  const [mutationRate, setMutationRate] = useState(0.01);
  const [mutationStrategy, setMutationStrategy] = useState("standardMutation");
  // const [gabilExtension, setGabilExtension] = useState("no");
  const [crossoverRate, setCrossoverRate] = useState(46);
  const [crossoverStrategy, setCrossoverStrategy] = useState("vary");
  const [ruleLengthPenalty, setRuleLengthPenalty] = useState<number>(0.015);
  const [populationSize, setPopulationSize] = useState<number>(50);

  // Endpoints
  const API = "http://localhost:8080";
  const accuracyEndpoint = `${API}/ga/accuracy`;
  const rulesEndpoint = `${API}/ga/rules`;
  const trainEndpoint = `${API}/ga/train`;
  const islandsEndpoint = `${API}/ga/setupIslands`;

  async function checkResults() {
    setLoading(true);
    try {
      const res = await fetch(trainEndpoint, { method: "POST" });

      if (!res.ok) throw new Error(`GA request failed: ${res.status}`);

      const text = await res.text();
      setValue(text);
    } catch (err: any) {
      setValue(`Error: ${err?.message ?? String(err)}`);
    } finally {
      setLoading(false);
    }
  }


async function setupIslandsRequest() {
  setPosting(true);
  try {
    const res = await fetch(islandsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        algorithm,
        trainFile,
        testFile,
        islands,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();   // 🔹 read backend response
    setValue(text);                  // 🔹 show backend response in textarea
  } catch (err: any) {
    setValue(`POST error: ${err?.message ?? String(err)}`);
  } finally {
    setPosting(false);
  }
}



  function handleAddIsland() {
    const newIsland = {
      selectionRate,
      selectionStrategy,
      mutationRate,
      mutationStrategy,
      crossoverRate,
      crossoverStrategy,
      ruleLengthPenalty,
      populationSize,
    };

    setIslands([...islands, newIsland]);

    // Reset after saving snapshot
    setSelectionRate(4);
    setSelectionStrategy("tournament");
    setMutationRate(0.01);
    setMutationStrategy("standardMutation");
    setCrossoverRate(46);
    setCrossoverStrategy("vary");
    setRuleLengthPenalty(0.015);
    setPopulationSize(50);
  }


  

  // Card component for saved islands (readonly form style)
  function IslandCard({
    island,
    idx,
    total,
  }: {
    island: any;
    idx: number;
    total: number;
  }) {
    return (
      <div
        style={{
          background: "#2a2a3a",
          border: "1px solid #444",
          borderRadius: 8,
          padding: "12px 16px",
          marginTop: 12,
        }}
      >
        <h4 style={{ margin: "0 0 12px 0", color: "#fff" }}>
          Island {total - idx}
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <label style={{ color: "#bbb" }}>
            Selection Rate:<br />
            <input value={island.selectionRate} disabled />
          </label>
          <label style={{ color: "#bbb" }}>
            Selection Strategy:<br />
            <input value={island.selectionStrategy} disabled />
          </label>
          <label style={{ color: "#bbb" }}>
            Mutation Rate:<br />
            <input value={island.mutationRate} disabled />
          </label>
          <label style={{ color: "#bbb" }}>
            Mutation Strategy:<br />
            <input value={island.mutationStrategy} disabled />
          </label>
          <label style={{ color: "#bbb" }}>
            Crossover Rate:<br />
            <input value={island.crossoverRate} disabled />
          </label>
          <label style={{ color: "#bbb" }}>
            Crossover Strategy:<br />
            <input value={island.crossoverStrategy} disabled />
          </label>
          <label style={{ color: "#bbb" }}>
            Rule Length Penalty:<br />
            <input value={island.ruleLengthPenalty} disabled />
          </label>

          <label style={{ color: "#bbb" }}>
            Population Size:<br />
            <input value={island.populationSize} disabled />
          </label>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <h1>Victor Tumbiolo</h1>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/ml-algorithms">ML Algorithms</Link></li>
            <li><Link to="/ga-results">GA Results</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>

      <div className="results-page">
        <div className="results-card">
          <div className="results-header" style={{ display: "grid", gap: 12 }}>
            {/* Controls row */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={checkResults} disabled={loading}>
                {loading ? "Loading..." : "Check Results"}
              </button>
              <button onClick={() => navigate("/ga-hypothesis")} style={{ cursor: "pointer" }}>
                View Hypothesis
              </button>
              <div className="results-endpoints" style={{ opacity: 0.8 }}>
                Endpoints: {accuracyEndpoint} + {rulesEndpoint}
              </div>
            </div>

            {/* Training form */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <label>
                Algorithm:&nbsp;
                <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                  <option value="GA">Genetic Algorithm</option>
                </select>
              </label>

              <label>
                Train file:&nbsp;
                <select value={trainFile} onChange={(e) => setTrainFile(e.target.value)}>
                  <option value="Tennis-Train.txt">Training Set</option>
                  <option value="Tennis-Set-2.txt">Extended Training Set</option>
                  <option value="Tennis-Test.txt">Testing Set</option>
                </select>
              </label>

              <label>
                Test file:&nbsp;
                <select value={testFile} onChange={(e) => setTestFile(e.target.value)}>
                  <option value="Tennis-Train.txt">Training Set</option>
                  <option value="Tennis-Set-2.txt">Extended Training Set</option>
                  <option value="Tennis-Test.txt">Testing Set</option>
                </select>
              </label>


              {islandsEnabled && (
                <label>
                  Number of islands:&nbsp;
                  <input
                    type="number"
                    min={1}
                    value={numIslands}
                    onChange={(e) => setNumIslands(Number(e.target.value))}
                  />
                </label>
              )}

              <button onClick={setupIslandsRequest} disabled={posting} style={{ cursor: "pointer" }}>
                {posting ? "Sending…" : "Send Train POST"}
              </button>

              <button onClick={() => navigate("/datasets")}>View Datasets</button>
              <button onClick={() => navigate("/genetic_islands")}>View Islands</button>
              <button onClick={() => navigate("/genetic_about_page")}>About the Algorithm</button>
            </div>
          </div>

          <textarea
            className="results-textarea"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Results will appear here…"
            spellCheck={false}
          />

          {/* Editable Island Settings Card */}
          <div
            style={{
              background: "#1e1e2f",
              border: "1px solid #333",
              borderRadius: 10,
              padding: "16px 20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 12, color: "#fff" }}>Island Settings</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                alignItems: "center",
              }}
            >
              <label style={{ color: "#ddd" }}>
                Selection Rate:<br />
                <input
                  type="number"
                  min={1}
                  value={selectionRate}
                  onChange={(e) => setSelectionRate(Number(e.target.value))}
                />
              </label>

              <label style={{ color: "#ddd" }}>
                Selection Strategy:<br />
                <select
                  value={selectionStrategy}
                  onChange={(e) => setSelectionStrategy(e.target.value)}
                >
                  <option value="rank">Rank Selection</option>
                  <option value="tournament">Tournament</option>
                  <option value="fitness">Fitness</option>
                  <option value="fitnessProportionate">Fitness Proportional</option>
                </select>
              </label>

              <label style={{ color: "#ddd" }}>
                Mutation Rate:<br />
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={mutationRate}
                  onChange={(e) => setMutationRate(Number(e.target.value))}
                />
              </label>

              <label style={{ color: "#ddd" }}>
                Mutation Strategy:<br />
                <select
                  value={mutationStrategy}
                  onChange={(e) => setMutationStrategy(e.target.value)}
                >
                  <option value="standard">Standard Mutation</option>
                  <option value="gabil">GABIL Extention</option>
                </select>
              </label>

              <label style={{ color: "#ddd" }}>
                Crossover Rate:<br />
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={crossoverRate}
                  onChange={(e) => setCrossoverRate(Number(e.target.value))}
                />
              </label>

              <label style={{ color: "#ddd" }}>
                Crossover Strategy:<br />
                <select
                  value={crossoverStrategy}
                  onChange={(e) => setCrossoverStrategy(e.target.value)}
                >
                  <option value="onePoint">One-Point</option>
                  <option value="twoPoint">Two-Point</option>
                  <option value="extendedTwoPoint">Extended Two-Point</option>
                  <option value="vary">Varying Rule Length</option>

                </select>
              </label>

              <label style={{ color: "#ddd" }}>
                Rule Length Penalty:<br />
                <input
                  type="number"
                  min={0}
                  value={ruleLengthPenalty}
                  onChange={(e) => setRuleLengthPenalty(Number(e.target.value))}
                />
              </label>


              <label style={{ color: "#ddd" }}>
                Population Size:<br />
                <input
                  type="number"
                  min={0}
                  value={populationSize}
                  onChange={(e) => setPopulationSize(Number(e.target.value))}
                />
              </label>
            </div>

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button
                onClick={handleAddIsland}
                style={{
                  cursor: "pointer",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontWeight: "bold",
                }}
              >
                Add Island
              </button>
            </div>
          </div>

          {/* Saved islands in descending order */}
          {[...islands].reverse().map((island, idx, arr) => (
            <IslandCard key={idx} island={island} idx={idx} total={arr.length} />
          ))}

        </div>
      </div>
    </>
  );
}
