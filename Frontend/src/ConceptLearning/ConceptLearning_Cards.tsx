// Standard imports
import React from "react";
import { Link } from "react-router-dom";

// Import styling
import "../css/ML_Cards.css";

// Functional Component
export default function ConceptLearning_Cards() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <h1>Victor Tumbiolo</h1>
          {/* Navigation */}
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/ml-algorithms">ML Algorithms</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Page Container */}
      <div className="page">
        <div className="container">
          <h2 className="title">Concept Learning Algorithms</h2>

          {/* Cards Section */}
          <div className="cards">
            <Link to="/learn-s" className="card">
              <h3>Learn-S</h3>
              <p>
                The simplest concept learning algorithm. It starts with the most specific
                hypothesis and generalizes only as needed to cover positive examples.
              </p>
            </Link>

            <Link to="/list-then-eliminate" className="card">
              <h3>List-Then-Eliminate</h3>
              <p>
                Maintains a list of all hypotheses consistent with the training data, 
                removing inconsistent ones as more examples are processed.
              </p>
            </Link>

            <Link to="/candidate_elim" className="card">
              <h3>Candidate Elimination</h3>
              <p>
                Simultaneously tracks the most specific and most general consistent hypotheses 
                (S and G sets), converging on the target concept as training progresses.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
