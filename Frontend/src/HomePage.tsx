import React from "react";
import "./css/HomePage.css"; // we'll put the styles here

export default function HomePage() {
  return (
    <div>
      {/* Navigation */}
      <nav>
        <h1>Victor Tumbiolo</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/ML_Cards">Machine Learning Algorithms</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="hero">
        <h2>Welcome to My Portfolio</h2>
        <p>
          I build software that blends backend logic, frontend design, and
          machine learning into real-world applications.
        </p>
      </div>

      {/* Footer */}
      <footer>
        © 2025 Victor Tumbiolo. All rights reserved.
      </footer>
    </div>
  );
}
