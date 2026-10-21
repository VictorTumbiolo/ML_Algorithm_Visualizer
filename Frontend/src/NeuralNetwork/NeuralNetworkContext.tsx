import React, { createContext, useContext, useState } from "react";

interface NeuralSettings {
  trainFile: string;
  testFile: string;
  learningRate: number;
  momentum: number;
  epochs: number;
  activation: string;
  hiddenLayers: number;
  neuronsPerLayer: number;
}

interface NeuralContextType {
  settings: NeuralSettings;
  setSettings: React.Dispatch<React.SetStateAction<NeuralSettings>>;
}

const NeuralNetworkContext = createContext<NeuralContextType | undefined>(undefined);

export const NeuralNetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NeuralSettings>({
    trainFile: "IrisTrain.txt",
    testFile: "IrisTest.txt",
    learningRate: 0.05,
    momentum: 0.8,
    epochs: 500,
    activation: "sigmoid",
    hiddenLayers: 1,
    neuronsPerLayer: 5,
  });

  return (
    <NeuralNetworkContext.Provider value={{ settings, setSettings }}>
      {children}
    </NeuralNetworkContext.Provider>
  );
};

export const useNeuralNetwork = () => {
  const ctx = useContext(NeuralNetworkContext);
  if (!ctx) throw new Error("useNeuralNetwork must be used within NeuralNetworkProvider");
  return ctx;
};
