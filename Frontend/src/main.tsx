// Standard imports
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Styling 
import "./css/index.css";

// Route Pages
import TreePage from "./ID3/TreePage";
import NodePage from "./ID3/NodePage";
import HomePage from "./HomePage";
import ML_Cards from "./ML_Cards";
import ResultsPage from "./ID3/ResultsPage";
import DatasetsPage from "./ID3/DatasetsPage";
import GA_Results_Page from "./GeneticAlgorithm/GA_Results_Page";
import ViewIslandsPage from "./GeneticAlgorithm/ViewIslandsPage";
import IslandDetailPage from "./GeneticAlgorithm/IslandDetailPage";
import HypothesisBreakdownPage from "./GeneticAlgorithm/HypothesisBreakdownPage";
import NN_Results_Page from "./NeuralNetwork/NN_Results_Page";
import IrisDatasetsPage from "./NeuralNetwork/IrisDatasetsPage";
import NetworkGraphPage from "./NeuralNetwork/NetworkGraph";
import NodeInfoPage from "./NeuralNetwork/NodeInfoPage";
import AboutNetworkPage from "./NeuralNetwork/AboutTheAlgorithm";
import AboutGeneticPage from "./GeneticAlgorithm/AboutTheAlgorithm";
import AboutID3Page from "./ID3/AboutTheAlgorithm";

import { NeuralNetworkProvider } from "./NeuralNetwork/NeuralNetworkContext";

// Concept Learning 
import ConceptLearningCards from "./ConceptLearning/ConceptLearning_Cards";
import FindSPage from "./ConceptLearning/FindSPage";
import CandidateEliminationPage from "./ConceptLearning/CandidateElimination";


// Context
import { IslandsProvider } from "./GeneticAlgorithm/IslandsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IslandsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ML_Cards" element={<ML_Cards />} />
          
          <Route path="/DecisionTreeLayout" element={<ResultsPage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/node/:id" element={<NodePage />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/ID3_about_page" element={<AboutID3Page />} />



          {/* Genetic Algorithm Routes */}
          <Route path="/ga_results" element={<GA_Results_Page />} />
          <Route path="/genetic_islands" element={<ViewIslandsPage />} />
          <Route path="/island/:id" element={<IslandDetailPage />} />
          <Route path="/hypothesis_breakdown" element={<HypothesisBreakdownPage />} />
          <Route path="/genetic_about_page" element={<AboutGeneticPage />} />


          <Route element={<NeuralNetworkProvider><Outlet /></NeuralNetworkProvider>}>
            <Route path="/nn_results" element={<NN_Results_Page />} />
            <Route path="/nn_graph" element={<NetworkGraphPage />} />
            <Route path="/iris_datasets" element={<IrisDatasetsPage />} />
            <Route path="/node_info" element={<NodeInfoPage />} />
            <Route path="/network_about_page" element={<AboutNetworkPage />} />
          </Route>

          {/* Concept Learning Routes */}
          <Route path="/cl_cards" element={<ConceptLearningCards />} />
          <Route path="/learn-s" element={<FindSPage />} />
          <Route path="/candidate_elim" element={<CandidateEliminationPage />} />




        </Routes>
      </BrowserRouter>
    </IslandsProvider>
  </React.StrictMode>
);
