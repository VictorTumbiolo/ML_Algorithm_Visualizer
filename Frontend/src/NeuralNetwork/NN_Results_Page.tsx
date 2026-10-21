// Standard Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNeuralNetwork } from "./NeuralNetworkContext"; // ✅ use shared context

// Styling
import "./ResultsPage.css";

export default function NeuralNetworkResultsPage() {
  const navigate = useNavigate();
  const { settings, setSettings } = useNeuralNetwork(); // ✅ context state

  const {
    trainFile,
    testFile,
    learningRate,
    momentum,
    epochs,
    activation,
    hiddenLayers,
    neuronsPerLayer,
  } = settings;

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // UI-only state (these can reset safely)
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  // Endpoints
  const API = "http://localhost:8080";
  const trainEndpoint = `${API}/nn/train`;
  const testEndpoint = `${API}/nn/test`;
  const accuracyEndpoint = `${API}/nn/accuracy`;

  // Fetch training results
  async function trainNetwork() {
    setPosting(true);
    try {
      const payload = {
        trainFile,
        testFile,
        learningRate: Number(learningRate),
        momentum: Number(momentum),
        epochs: Number(epochs),
        activation,
        hiddenLayers: Number(hiddenLayers),
        neuronsPerLayer: Number(neuronsPerLayer),
      };

      console.log("Sending to backend:", payload);

      const res = await fetch(trainEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      setValue(text);
    } catch (err: any) {
      setValue(`Error: ${err?.message ?? String(err)}`);
    } finally {
      setPosting(false);
    }
  }

  // Fetch accuracy only
  async function checkResults() {
    setLoading(true);
    try {
      // include the selected testFile from your context
      const res = await fetch(`${accuracyEndpoint}?fileName=${encodeURIComponent(testFile)}`);
      if (!res.ok) throw new Error(`Accuracy request failed: ${res.status}`);
      const text = await res.text();
      setValue(text);
    } catch (err: any) {
      setValue(`Error: ${err?.message ?? String(err)}`);
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-inner">
          <h1>Victor Tumbiolo</h1>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/ml-algorithms">ML Algorithms</Link></li>
            <li><Link to="/nn-results">NN Results</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Results Section */}
      <div className="results-page">
        <div className="results-card">
          <div className="results-header" style={{ display: "grid", gap: 12 }}>
            {/* Control buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={checkResults} disabled={loading}>
                {loading ? "Loading…" : "Check Accuracy"}
              </button>
              <button onClick={trainNetwork} disabled={posting}>
                {posting ? "Training…" : "Train Network"}
              </button>
              <button onClick={() => navigate("/iris_datasets")}>View Datasets</button>

              <button
                onClick={() => {
                  navigate("/nn_graph", {
                    state: {
                      hiddenLayers,
                      neuronsPerLayer,
                      activation,
                      learningRate,
                      momentum,
                      epochs,
                    },
                  });
                }}
              >
                View Network
              </button>

              <div style={{ opacity: 0.8 }}>Endpoint: {trainEndpoint}</div>
            </div>

            {/* Training settings form */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <label>
                Train File:&nbsp;
                <select
                  value={trainFile}
                  onChange={(e) => updateSetting("trainFile", e.target.value)}
                >
                  <option value="IrisTrain.txt">IrisTrain.txt</option>
                  <option value="IrisTest.txt">IrisTest.txt</option>
                </select>
              </label>

              <label>
                Test File:&nbsp;
                <select
                  value={testFile}
                  onChange={(e) => updateSetting("testFile", e.target.value)}
                >
                  <option value="IrisTest.txt">IrisTest.txt</option>
                  <option value="IrisTrain.txt">IrisTrain.txt</option>
                </select>
              </label>

              <button onClick={() => navigate("/network_about_page")}>About the Algorithm</button>
            </div>
          </div>

          {/* NN Settings */}
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
            <h3 style={{ marginTop: 0, color: "#fff" }}>Neural Network Settings</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              <label style={{ color: "#ddd" }}>
                Learning Rate (η):<br />
                <input
                  type="number"
                  step={0.01}
                  value={learningRate}
                  onChange={(e) =>
                    updateSetting("learningRate", Number(e.target.value))
                  }
                />
              </label>

              <label style={{ color: "#ddd" }}>
                Momentum (α):<br />
                <input
                  type="number"
                  step={0.01}
                  value={momentum}
                  onChange={(e) =>
                    updateSetting("momentum", Number(e.target.value))
                  }
                />
              </label>

              <label style={{ color: "#ddd" }}>
                Epochs:<br />
                <input
                  type="number"
                  min={1}
                  value={epochs}
                  onChange={(e) => updateSetting("epochs", Number(e.target.value))}
                />
              </label>

              <label style={{ color: "#ddd" }}>
                Activation Function:<br />
                <select
                  value={activation}
                  onChange={(e) => updateSetting("activation", e.target.value)}
                >
                  <option value="sigmoid">Sigmoid</option>
                  <option value="tanh">Tanh</option>
                  <option value="relu">ReLU</option>
                  <option value="gelu">GELU</option>
                </select>
              </label>

              <label style={{ color: "#ddd" }}>
                Hidden Layers:<br />
                <input
                  type="number"
                  min={1}
                  value={hiddenLayers}
                  onChange={(e) =>
                    updateSetting("hiddenLayers", Number(e.target.value))
                  }
                />
              </label>

              <label style={{ color: "#ddd" }}>
                Neurons per Layer:<br />
                <input
                  type="number"
                  min={1}
                  value={neuronsPerLayer}
                  onChange={(e) =>
                    updateSetting("neuronsPerLayer", Number(e.target.value))
                  }
                />
              </label>
            </div>
          </div>

          {/* Results display */}
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
