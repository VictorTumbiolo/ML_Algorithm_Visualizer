import React from "react";
import { useNavigate } from "react-router-dom";

const AboutTheAlgorithm: React.FC = () => {
  const navigate = useNavigate();
  const block = { marginBottom: 24 as number };

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
      <h1 style={{ marginBottom: 20 }}>About the Genetic Algorithm (GA)</h1>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Overview</h2>
        <p>
          A <strong>Genetic Algorithm (GA)</strong> is a stochastic optimization
          and search procedure inspired by natural selection. It maintains a
          <strong>population</strong> of candidate solutions, each represented
          as a <strong>hypothesis</strong>, and evolves this population through
          the iterative application of <em>selection</em>, <em>crossover</em>,
          and <em>mutation</em>. The algorithm searches the
          <strong>hypothesis space</strong> for individuals that maximize a
          given <strong>fitness function</strong>.
        </p>
      </section>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Hypothesis Representation</h2>
        <p>
          In machine learning tasks, each individual represents a hypothesis
          that maps input attributes to classifications. The most common
          representation is a fixed-length <strong>bit string</strong>, though
          other encodings such as integer, real-valued, or structured symbolic
          forms can be used.
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            For concept learning, a bit string may encode a conjunction of
            attribute constraints (e.g., 1 = present, 0 = absent, * = “don’t
            care”).
          </li>
          <li>
            In rule learning systems such as <strong>GABIL</strong>, a single
            chromosome may represent one or several IF–THEN rules, with segments
            indicating conditions and class labels.
          </li>
          <li>
            The <strong>search space</strong> is thus the set of all encodable
            hypotheses, which the GA explores using stochastic operators rather
            than deterministic enumeration.
          </li>
        </ul>
      </section>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Hypothesis Search Space</h2>
        <p>
          GAs differ from traditional concept learning algorithms (like ID3 or
          Candidate-Elimination) in that they perform a
          <strong>parallel, population-based search</strong> over the hypothesis
          space rather than refining a single hypothesis. The population
          implicitly samples many regions of the search space simultaneously.
        </p>
        <p>
          The learning dynamics can be interpreted through the{" "}
          <strong>Schema Theorem</strong>, which predicts that short,
          low-order, above-average schemata—i.e., collections of similar
          hypotheses—receive exponentially increasing trials in subsequent
          generations.
        </p>
      </section>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Crossover Variants</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong>Single-Point Crossover</strong>: Choose a random crossover
            point and swap the tail segments of two parents. Example: <br />
            Parent1 = 101|110 → Child1 = 101110; Parent2 = 011|001 → Child2 =
            011001.
          </li>
          <li>
            <strong>Two-Point Crossover</strong>: Choose two crossover points and
            exchange the middle segments.
          </li>
          <li>
            <strong>Uniform Crossover</strong>: Swap each gene independently with
            a fixed probability (e.g., 0.5), giving finer control of mixing.
          </li>
          <li>
            <strong>Rule-Based Crossover (for GABIL)</strong>: Exchange entire
            IF–THEN rules between two individuals, preserving semantic integrity.
          </li>
        </ul>
      </section>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Mutation</h2>
        <p>
          Mutation introduces random perturbations to maintain genetic diversity
          and prevent premature convergence. It operates with a small
          probability per gene (often 1/length). In bit encodings, it flips
          0→1 or 1→0; in rule-based systems, it may toggle literals, thresholds,
          or entire rule components.
        </p>
      </section>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Fitness Function</h2>
        <p>
          The <strong>fitness function</strong> evaluates how well each
          hypothesis performs on the learning task. In supervised learning, this
          typically measures the proportion of correctly classified training
          examples, optionally penalized by hypothesis complexity:
        </p>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#0a1220",
            padding: 16,
            borderRadius: 8,
          }}
        >{`Fitness(h) = Accuracy(h) – λ × Complexity(h)`}</pre>
        <p>
          This ensures the algorithm favors both accuracy and parsimony,
          preventing bloated or overfitted rule sets.
        </p>
      </section>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Selection Mechanisms</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong>Fitness-Proportionate (Roulette Wheel)</strong>: Probability
            of selection proportional to fitness.
          </li>
          <li>
            <strong>Rank Selection</strong>: Rank individuals and assign
            selection probabilities by order, reducing dominance by elites.
          </li>
          <li>
            <strong>Tournament Selection</strong>: Randomly sample k
            individuals and choose the fittest; controls selection pressure via
            tournament size.
          </li>
          <li>
            <strong>Elitism</strong>: Preserve top-performing individuals across
            generations.
          </li>
        </ul>
      </section>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Schema Theorem and Building Blocks</h2>
        <p>
          According to Holland’s <strong>Schema Theorem</strong>, GAs implicitly
          process a large number of schemata (patterns) in parallel. Short,
          low-order schemata with above-average fitness—“building blocks”—are
          propagated exponentially, enabling the GA to combine and refine useful
          sub-solutions over time.
        </p>
      </section>

      <section style={block}>
        <h2 style={{ color: "#4cafef" }}>Advantages and Limitations</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong>Advantages:</strong> Robust global search, minimal gradient
            assumptions, adaptable to discrete or continuous domains, and
            parallelizable.
          </li>
          <li>
            <strong>Limitations:</strong> Computationally expensive, parameter
            sensitive (population size, crossover, mutation), and may converge to
            local optima if diversity drops.
          </li>
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
