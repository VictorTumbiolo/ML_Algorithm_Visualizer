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
      <h1 style={{ marginBottom: 20 }}>About the ID3 Decision Tree Algorithm</h1>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Overview</h2>
        <p>
          The <strong>ID3 algorithm</strong> (Iterative Dichotomiser 3) is a
          fundamental method in machine learning used to build{" "}
          <strong>decision trees</strong> that classify discrete-valued target
          functions. It represents the learned hypothesis as a tree, where
          internal nodes test attributes, branches represent attribute values,
          and leaves correspond to class labels. The algorithm’s{" "}
          <strong>inductive bias</strong> favors smaller trees with high
          information gain near the root.
        </p>
        <p>
          Decision trees are often restructured into equivalent sets of{" "}
          <strong>if–then rules</strong> for improved readability and
          interpretability.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>How Instances Are Classified</h2>
        <p>
          To classify a new instance:
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Start at the <strong>root node</strong> of the decision tree.</li>
          <li>
            Test the attribute indicated by that node, then follow the branch
            corresponding to the example’s attribute value.
          </li>
          <li>
            Continue this process until reaching a <strong>leaf node</strong>,
            whose label determines the classification result.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Core Idea of ID3</h2>
        <p>
          ID3 constructs the decision tree in a{" "}
          <strong>top-down, greedy manner</strong>, selecting the attribute that
          best separates the training data at each step. It never backtracks to
          reconsider previous choices.
        </p>

        <h3 style={{ color: "#77ddff" }}>Algorithm Steps</h3>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Evaluate each attribute using a statistical test to measure how well
            it classifies the examples.
          </li>
          <li>
            Choose the attribute with the <strong>highest information gain</strong>{" "}
            as the root test.
          </li>
          <li>
            Create one branch for each possible value of this attribute, and
            partition the examples accordingly.
          </li>
          <li>
            Recursively repeat the process for each subset of examples to grow
            the subtrees.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Information Gain and Entropy</h2>
        <p>
          The algorithm’s decision criterion is based on{" "}
          <strong>information gain</strong>, which quantifies how much an
          attribute reduces uncertainty (entropy) in the dataset.
        </p>

        <h3 style={{ color: "#77ddff" }}>Entropy</h3>
        <p>
          Entropy measures the <strong>homogeneity</strong> of a dataset:
        </p>
        <pre
          style={{
            background: "#111a2f",
            padding: "10px",
            borderRadius: 6,
            overflowX: "auto",
          }}
        >
          {`Entropy(S) = - Σ p_i * log₂(p_i)`}
        </pre>
        <p>
          where <em>p₁, p₂, …</em> are the proportions of different class labels
          in the dataset.
        </p>

        <h3 style={{ color: "#77ddff" }}>Information Gain</h3>
        <p>
          The expected reduction in entropy from splitting on attribute <em>A</em>:
        </p>
        <pre
          style={{
            background: "#111a2f",
            padding: "10px",
            borderRadius: 6,
            overflowX: "auto",
          }}
        >
          {`Gain(S, A) = Entropy(S) - Σ (|Sᵢ| / |S|) * Entropy(Sᵢ)`}
        </pre>
        <p>
          Attributes with higher information gain are preferred for splitting.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Inductive Bias of ID3</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>Prefers <strong>shorter (simpler) trees</strong> over longer ones.</li>
          <li>
            Prefers trees that place attributes with{" "}
            <strong>high information gain</strong> near the root.
          </li>
          <li>
            Follows a <strong>simple-to-complex hill-climbing search</strong> in
            hypothesis space, without backtracking.
          </li>
          <li>
            The bias arises from the <strong>search strategy</strong>, not from
            restrictions on the hypothesis space.
          </li>
        </ul>
        <p>
          In contrast, algorithms like <strong>Candidate-Elimination</strong>{" "}
          have an inductive bias that stems from their restricted hypothesis
          representation rather than their search order.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Occam’s Razor Principle</h2>
        <p>
          ID3 follows the heuristic of <strong>Occam’s Razor</strong>: prefer the
          simplest hypothesis that fits the data. Simpler trees are less likely
          to overfit the training data and more likely to generalize.
        </p>
        <p>
          Because there are fewer short trees than large ones, it’s less likely
          that a simple tree coincidentally fits the data. Complex trees often
          overfit by capturing noise rather than true structure.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Overfitting and Pruning</h2>
        <p>
          Growing a decision tree until it perfectly fits the training data can
          cause <strong>overfitting</strong>, especially with noisy or limited
          data.
        </p>
        <p>
          A hypothesis <em>h</em> is said to overfit if there exists another
          hypothesis <em>h′</em> that performs better on unseen examples even
          though <em>h</em> fits the training data more closely.
        </p>

        <h3 style={{ color: "#77ddff" }}>Rule Post-Pruning (C4.5 Extension)</h3>
        <ol style={{ paddingLeft: 20 }}>
          <li>Grow the tree until it fits the training data completely.</li>
          <li>Convert the tree into a set of <strong>if–then rules</strong>.</li>
          <li>
            Prune each rule by removing conditions that do not improve accuracy.
          </li>
          <li>
            Sort the pruned rules by their estimated accuracy for use in
            classification.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Handling Attribute Bias and Gain Ratio</h2>
        <p>
          The information gain metric can sometimes favor attributes with many
          possible values (e.g., a “Date” attribute that uniquely identifies each
          record). Such attributes can perfectly split the training data but
          generalize poorly.
        </p>
        <p>
          To correct this, Quinlan introduced the <strong>Gain Ratio</strong>:
        </p>
        <pre
          style={{
            background: "#111a2f",
            padding: "10px",
            borderRadius: 6,
            overflowX: "auto",
          }}
        >
          {`GainRatio(S, A) = Gain(S, A) / SplitInformation(S, A)`}
        </pre>
        <p>
          where <strong>SplitInformation(S, A)</strong> is the entropy of the
          dataset with respect to the values of attribute <em>A</em>. This
          penalizes attributes that split the data too finely.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#4cafef" }}>Practical Considerations</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>Deciding how deeply to grow the tree.</li>
          <li>Handling continuous attributes and missing values.</li>
          <li>Choosing suitable attribute selection measures.</li>
          <li>Improving computational efficiency.</li>
          <li>Using pruning to prevent overfitting.</li>
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
