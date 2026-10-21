// Standard Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Styling
import "./ResultsPage.css";

export default function ResultsPage() {
  const navigate = useNavigate();

  // UI state
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  // Form state (for POST)
  // Default values
  const [algorithm, setAlgorithm] = useState("ID3");
  const [measure, setMeasure] = useState("infoGain");
  const [trainFile, setTrainFile] = useState("Tennis-Train.txt");
  const [testFile, setTestFile] = useState("Tennis-Test.txt");

  // Endpoints
  const API = "http://localhost:8080";
  const accuracyEndpoint = `${API}/accuracy`;
  const rulesEndpoint = `${API}/rules?measure=infoGain`;
  const trainEndpoint = `${API}/train`;

  async function checkResults() {
    setLoading(true);
    try {
      const [accRes, rulesRes] = await Promise.all([
        fetch(accuracyEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testFile }) // assumes `testFile` is in state
        }),
        fetch(rulesEndpoint) // keep rules as GET
      ]);

      if (!accRes.ok) throw new Error(`Accuracy request failed: ${accRes.status} ${await accRes.text()}`);
      if (!rulesRes.ok) throw new Error(`Rules request failed: ${rulesRes.status} ${await rulesRes.text()}`);

      const accText = await accRes.text();
      const rulesText = await rulesRes.text();

      setValue(`Accuracy:\n${accText}\n\nRules:\n${rulesText}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setValue(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  }


  async function sendTrainRequest() {
    setPosting(true);
    try {
      const res = await fetch(trainEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algorithm,
          measure,
          trainFile,
          testFile
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setValue(
        `POST /train sent.\n\nalgorithm=${algorithm}\nmeasure=${measure}\ntrainFile=${trainFile}\ntestFile=${testFile}\n\nCheck backend console logs.`
      );
    } catch (err: any) {
      setValue(`POST error: ${err?.message ?? String(err)}`);
    } finally {
      setPosting(false);
    }
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
            <li><Link to="/results">Results</Link></li>
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
              <button onClick={() => navigate("/tree")} style={{ cursor: "pointer" }}>
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
                  <option value="ID3">ID3</option>
                  {/* Add more later if you support them */}
                </select>
              </label>

              <label>
                Measure:&nbsp;
                <select value={measure} onChange={(e) => setMeasure(e.target.value)}>
                  <option value="infoGain">Information Gain</option>
                  <option value="entropy">Entropy</option>
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

              <button onClick={sendTrainRequest} disabled={posting} style={{ cursor: "pointer" }}>
                {posting ? "Sending…" : "Send Train POST"}
              </button>

              <button onClick={() => navigate("/datasets")}>
                View Datasets
              </button>

              <button onClick={() => navigate("/ID3_about_page")}>
                About the Algorithm
              </button>
            </div>
          </div>

          <textarea
            className="results-textarea"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Results will appear here…"
            spellCheck={false}
          />
        </div>
      </div>
    </>
  );
}
