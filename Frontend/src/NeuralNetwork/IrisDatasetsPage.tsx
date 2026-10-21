// src/pages/DatasetsPage.tsx
import React from "react";
import TrainingExamplesTable from "./IrisTrainingExamplesTable";

export default function DatasetsPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#fff" }}>Datasets</h2>
      <TrainingExamplesTable
        files={[
          "/Datasets/Iris-Test.json",
          "/Datasets/Iris-Train.json"
        ]}
      />
    </div>
  );
}
