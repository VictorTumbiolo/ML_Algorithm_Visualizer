import React, { createContext, useContext, useState } from "react";
import type { Edge } from "reactflow";

interface Island {
  selectionRate: number;
  selectionStrategy: string;
  mutationRate: number;
  mutationStrategy: string;
  crossoverRate: number;
  crossoverStrategy: string;
  ruleLengthPenalty: number;
  populationSize: number;
}

// Extend Edge type with direction if needed
export type IslandEdge = Edge & { direction?: "uni" | "bi" };

interface IslandsContextType {
  islands: Island[];
  setIslands: React.Dispatch<React.SetStateAction<Island[]>>;
  edges: IslandEdge[];
  setEdges: React.Dispatch<React.SetStateAction<IslandEdge[]>>;
}

const IslandsContext = createContext<IslandsContextType | undefined>(undefined);

export const IslandsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [islands, setIslands] = useState<Island[]>([]);
  const [edges, setEdges] = useState<IslandEdge[]>([]);

  return (
    <IslandsContext.Provider value={{ islands, setIslands, edges, setEdges }}>
      {children}
    </IslandsContext.Provider>
  );
};

export const useIslands = () => {
  const context = useContext(IslandsContext);
  if (!context) throw new Error("useIslands must be used within IslandsProvider");
  return context;
};
