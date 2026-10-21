// src/pages/DatasetsPage.tsx
import React from "react";
import TrainingExamplesTable from "./TrainingExamplesTable";

export default function DatasetsPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#fff" }}>Datasets</h2>
      <TrainingExamplesTable
        files={[
          "/Datasets/Tennis-Test.json",
          "/Datasets/Tennis-Train.json",
          "/Datasets/Tennis-Train-Extended.json"
        ]}
      />
    </div>
  );
}
