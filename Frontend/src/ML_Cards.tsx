
// Standard imports
import React from "react";
import { Link } from "react-router-dom";

// Import styling
import "./css/ML_Cards.css";


// Functional Component 
export default function ML_Cards() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <h1>Victor Tumbiolo</h1>
          {/* Eventually going to replace with Nav Componenet */}
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/ml-algorithms">ML Algorithms</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Header, Need to change later */}
      <div className="page">
        <div className="container">
          <h2 className="title">Machine Learning Algorithms</h2>

          {/* Cards  */}
          <div className="cards">
            <Link to="/DecisionTreeLayout" className="card">
              <h3>ID3</h3>
              <p>A decision tree algorithm that uses information gain to split data. Works well with discrete attributes.</p>
            </Link>

            <Link to="/c45" className="card">
              <h3>C4.5</h3>
              <p>An extension of ID3 that handles continuous attributes, pruning, and missing values using gain ratio.</p>
            </Link>

            <Link to="/nn_results" className="card">
              <h3>Neural Networks</h3>
              <p>Multi-layered systems capable of learning complex patterns via backpropagation.</p>
            </Link>

            <Link to="/ga_results" className="card">
              <h3>Genetic Algorithms</h3>
              <p>Search heuristics based on evolution: selection, crossover, and mutation.</p>
            </Link>

            <Link to="/sequential-covering" className="card">
              <h3>Sequential Covering</h3>
              <p>Iteratively learns rules to cover subsets of positive examples in rule learning.</p>
            </Link>

            <Link to="/cl_cards" className="card">
              <h3>Concept Learning</h3>
              <p>Infers a Boolean-valued function from examples. Includes Find-S and Candidate-Elimination.</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
