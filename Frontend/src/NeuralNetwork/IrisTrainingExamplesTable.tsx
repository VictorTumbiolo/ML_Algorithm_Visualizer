// src/components/TrainingExamplesTable.tsx
import React, { useEffect, useState } from "react";

type ExampleRow = Record<string, string | number | boolean>;

interface Props {
  files: string[];           // e.g. ["/Datasets/Tennis-Test.json", "/Datasets/Tennis-Train.json"]
  titles?: string[];         // optional: ["Tennis-Test", "Tennis-Train", ...]
}

const TrainingExamplesTable: React.FC<Props> = ({ files, titles }) => {
  const [dataSets, setDataSets] = useState<ExampleRow[][]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await Promise.all(
        files.map(async (file) => {
          try {
            const res = await fetch(file, { cache: "no-store" });
            if (!res.ok) throw new Error(`${file} -> ${res.status}`);
            const json = await res.json();
            // Expect: array of objects
            return Array.isArray(json) ? (json as ExampleRow[]) : [];
          } catch (err) {
            console.error("Failed to load", file, err);
            return [];
          }
        })
      );
      if (!cancelled) setDataSets(loaded);
    })();
    return () => { cancelled = true; };
  }, [files]);

  const titleFor = (i: number) => {
    if (titles?.[i]) return titles[i]!;
    const file = files[i] || "";
    const base = file.split("/").pop() || file;
    return base.replace(/\.[^/.]+$/, "");
  };

  const orderedHeaders = (row: ExampleRow) => {
    const keysInJsonOrder = Object.keys(row);
    const withoutPlay = keysInJsonOrder.filter(k => k !== "Play");
    return row.hasOwnProperty("Play") ? [...withoutPlay, "Play"] : withoutPlay;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {dataSets.map((rows, i) => {
        if (!rows.length) return null;

        const headers = orderedHeaders(rows[0]);

        return (
          <div
            key={`ds-${i}`}
            style={{
              background: "#0b1628",
              padding: "1rem",
              borderRadius: 8,
              overflowX: "auto",
              border: "1px solid #1d2a3f"
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>
              {titleFor(i)}
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
              <thead>
                <tr>
                  {/* New column header for numbering */}
                  <th
                    style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #333", width: "40px" }}
                  >
                    #
                  </th>
                  {headers.map((h) => (
                    <th
                      key={h}
                      style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #333" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={`r-${i}-${rIdx}`}>
                    {/* Row number */}
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #222",
                        opacity: 0.8,
                        textAlign: "center"
                      }}
                    >
                      {rIdx + 1}
                    </td>
                    {headers.map((h) => (
                      <td
                        key={`c-${i}-${rIdx}-${h}`}
                        style={{ padding: "8px", borderBottom: "1px solid #222" }}
                      >
                        {String(row[h] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default TrainingExamplesTable;
