import React from "react";
import { useNavigate } from "react-router-dom";

const AboutTheAlgorithm: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        color: "#fff",
        padding: "40px",
        background: "#0b1628",
        minHeight: "100vh",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ marginBottom: 20 }}>About the Neural Network Algorithm</h1>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Overview</h2>
        <p>
          This project implements a fully connected <strong>feedforward neural network</strong> built entirely from scratch.
          It is trained to classify flower species from the <strong>Iris dataset</strong> based on their sepal and petal
          dimensions. The system includes custom code for forward propagation, backpropagation, weight updates, and
          activation functions — all without using machine learning libraries.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>How It Works</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Each <strong>input node</strong> represents a feature (Sepal Length, Sepal Width, Petal Length, Petal Width).
          </li>
          <li>
            The network contains one or more <strong>hidden layers</strong> with a configurable number of neurons and
            activation functions (Sigmoid, ReLU, Tanh, GELU).
          </li>
          <li>
            The <strong>output layer</strong> produces three activation values, each representing the probability of a
            flower being Setosa, Virginica, or Versicolor.
          </li>
          <li>
            The highest activation is selected as the final classification.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Training Process</h2>
        <p>
          The model is trained using <strong>backpropagation</strong> and the <strong>gradient descent</strong> optimization rule.
          The process minimizes prediction error over multiple epochs by adjusting the connection weights.
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Forward pass computes predictions layer by layer.</li>
          <li>Loss is calculated based on output error.</li>
          <li>Backward pass computes gradients using the chain rule.</li>
          <li>Weights are updated with a learning rate and momentum term.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Why Build It From Scratch?</h2>
        <p>
          Building this algorithm manually provides a deeper understanding of how each layer, weight, and activation
          contributes to the learning process. Unlike using TensorFlow or PyTorch, this approach demonstrates full
          control over the neural network’s internal mechanics — ideal for educational and research purposes.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Features</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>Configurable network size and number of layers.</li>
          <li>Multiple activation functions (Sigmoid, ReLU, Tanh, GELU).</li>
          <li>Interactive visualization of node connections and weights.</li>
          <li>Frontend and backend integration for real-time training results.</li>
        </ul>
      </section>

      <div style={{ marginTop: 40 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#2196f3",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default AboutTheAlgorithm;
