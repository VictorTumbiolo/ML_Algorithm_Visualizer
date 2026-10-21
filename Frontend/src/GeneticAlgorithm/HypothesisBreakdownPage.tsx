// src/pages/HypothesisBreakdownPage.tsx

// @ts-ignore
import { InlineMath } from "react-katex";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// LaTeX Imports
import "katex/dist/katex.min.css";


interface Hypothesis {
  hypothesis: number[];
  fitness: number;
}

interface AttributeBlockProps {
  bits: string;
  label: string;
  values: string[];
}

function AttributeBlock({ bits, label, values }: AttributeBlockProps) {
  return (
    <div style={{ textAlign: "center" }}>
      {/* Bits with brace + label */}
      <InlineMath
        math={`\\overbrace{${bits}}^{\\text{\\textnormal{${label}}}}`}
      />
      {/* Vertical values */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
        {values.map((val, idx) => (
          <div
            key={idx}
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              margin: "0 6px",
            }}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
}

// Attribute mappings for decoding
const attributeMappings = {
  Outlook: ["Sunny", "Overcast", "Rainy"],       // 3 bits
  Temperature: ["Hot", "Mild", "Cool"],          // 3 bits
  Humidity: ["High", "Normal"],                  // 2 bits
  Wind: ["Weak", "Strong"],                      // 2 bits
  PlayTennis: ["No", "Yes"],                     // 1 bit (special case)
};

// Decode a rule's bits into a readable IF-THEN string
function decodeRule(bits: number[]) {
  const outlook = bits.slice(0, 3);
  const temp = bits.slice(3, 6);
  const humidity = bits.slice(6, 8);
  const wind = bits.slice(8, 10);
  const play = bits.slice(10, 11);

  function mapBits(bitArray: number[], labels: string[]) {
    return bitArray
      .map((b, i) => (b === 1 ? labels[i] : null))
      .filter(Boolean)
      .join(" OR ") || "Any";
  }

  const outlookVal = mapBits(outlook, attributeMappings.Outlook);
  const tempVal = mapBits(temp, attributeMappings.Temperature);
  const humidVal = mapBits(humidity, attributeMappings.Humidity);
  const windVal = mapBits(wind, attributeMappings.Wind);

  // ✅ Special case for classification (always Yes or No)
  const playVal = play[0] === 1 ? "Yes" : "No";

  return `IF Outlook = ${outlookVal} AND Temperature = ${tempVal} AND Humidity = ${humidVal} AND Wind = ${windVal} THEN PlayTennis = ${playVal}`;
}

export default function HypothesisBreakdownPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { hypothesis, backendInfo } = (location.state || {}) as {
  hypothesis?: Hypothesis;
  backendInfo?: string;
};


  if (!hypothesis) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No hypothesis data provided</h2>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>
    );
  }

  // Break hypothesis into rules of 11 bits
  const RULE_LENGTH = 11;
  const rules: number[][] = [];
  for (let i = 0; i < hypothesis.hypothesis.length; i += RULE_LENGTH) {
    rules.push(hypothesis.hypothesis.slice(i, i + RULE_LENGTH));
  }

  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);

  const handlePrev = () => {
    setCurrentRuleIndex((prev) => (prev - 1 + rules.length) % rules.length);
  };

  const handleNext = () => {
    setCurrentRuleIndex((prev) => (prev + 1) % rules.length);
  };

  // Sample hypothesis (hard-coded for now)
  const sampleHypothesis: Hypothesis = {
    hypothesis: [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1],
    fitness: 0.742,
  };

  // Attribute bit slices
  const outlookBits = sampleHypothesis.hypothesis.slice(0, 3).join("");
  const tempBits = sampleHypothesis.hypothesis.slice(3, 6).join("");
  const humidityBits = sampleHypothesis.hypothesis.slice(6, 8).join("");
  const windBits = sampleHypothesis.hypothesis.slice(8, 10).join("");
  const classificationBit = sampleHypothesis.hypothesis.slice(10, 11).join("");

  return (
    <div style={{ padding: 20 }}>
      <h2>Hypothesis Breakdown</h2>

      {/* Hypothesis Card */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 12,
          background: "#264653",
          color: "#fff",
          marginBottom: 20,
        }}
      >
        <p>
          <strong>Hypothesis Values:</strong>{" "}
          {hypothesis.hypothesis.join(", ")}
        </p>
        <p>
          <strong>Fitness:</strong> {hypothesis.fitness.toFixed(3)}
        </p>
      </div>

      {/* Three-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Left column: list of rule numbers + bits */}
        <div
          style={{
            borderRight: "1px solid #ccc",
            paddingRight: "10px",
          }}
        >
          <h3>Rules</h3>
          {rules.map((rule, idx) => (
            <div
              key={idx}
              style={{
                padding: "6px 0",
                cursor: "pointer",
                color: currentRuleIndex === idx ? "#e9c46a" : "#264653",
                fontWeight: currentRuleIndex === idx ? "bold" : "normal",
              }}
              onClick={() => setCurrentRuleIndex(idx)}
            >
              <span style={{ display: "block" }}>
                Rule {idx + 1}: {rule.join(", ")}
              </span>
            </div>
          ))}
        </div>

        {/* Middle column: wheel to cycle through rules */}
        <div
          style={{
            border: "1px solid #bbb",
            borderRadius: 8,
            padding: 16,
            background: "#2a9d8f",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h3>Rule {currentRuleIndex + 1}</h3>
          <p>{rules[currentRuleIndex].join(", ")}</p>

          {/* Human-readable decoded rule */}
          <p style={{ marginTop: "12px", fontStyle: "italic" }}>
            {decodeRule(rules[currentRuleIndex])}
          </p>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={handlePrev}
              style={{
                marginRight: 10,
                padding: "6px 12px",
                background: "#264653",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              ⬅ Prev
            </button>
            <button
              onClick={handleNext}
              style={{
                padding: "6px 12px",
                background: "#264653",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Next ➡
            </button>
          </div>
        </div>

        {/* Right column: sample hypothesis */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            paddingBottom: 12,
            background: "#e76f51",
            color: "#fff",
          }}
        >
          <h3>Sample Hypothesis</h3>
          <p>
            <strong>Values:</strong> {sampleHypothesis.hypothesis.join(", ")}
          </p>

          {/* Attributes row */}
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
            <AttributeBlock
              bits={outlookBits}
              label="Outlook"
              values={["Sunny", "Overcast", "Rainy"]}
            />
            <AttributeBlock
              bits={tempBits}
              label="Temperature"
              values={["Hot", "Mild", "Cool"]}
            />
            <AttributeBlock
              bits={humidityBits}
              label="Humidity"
              values={["High", "Normal"]}
            />
            <AttributeBlock
              bits={windBits}
              label="Wind"
              values={["Weak", "Strong"]}
            />
            <AttributeBlock
              bits={classificationBit}
              label="Play Tennis"
              values={["0 = No", "1 = Yes"]}
            />
          </div>
        </div>
      </div>

<textarea
  className="results-textarea"
  value={backendInfo || ""}
  readOnly
  placeholder="Results will appear here…"
  spellCheck={false}
  style={{
    width: "100%",
    height: "200px",
    background: "#264653",   // keep dark color
    color: "#fff",           // white text
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: "10px",
    marginTop: "20px",
    fontFamily: "monospace",
    resize: "none",
  }}
/>

      {/* Back Button */}
      
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 16px",
          background: "#2a9d8f",
          border: "none",
          borderRadius: 6,
          color: "#fff",
          cursor: "pointer",
          marginTop: 20,
        }}
      >
        ⬅ Back
      </button>

      
    </div>
  );
}
