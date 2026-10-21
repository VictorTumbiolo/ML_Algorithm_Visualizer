package com.example.demo.NeuralNetwork;
import java.util.ArrayList;

public class NeuralNetwork {

    private NeuralNode[] inputLayer;
    private ArrayList<NeuralNode[]> hiddenLayers = new ArrayList<>();
    private NeuralNode[] outputLayer;
    private ArrayList<double[]> questions = new ArrayList<>();
    private ArrayList<Double> answers = new ArrayList<>();
    private int epocs;
    private double eta;  // learning rate
    private double alpha; // momentum value

    public NeuralNetwork(int inputSize, int hiddenLayers, int hiddenSize, int outputSize,
                            ArrayList<double[]> questions, ArrayList<Double> answers,
                            int epocs, double eta, double alpha) {
        this.inputLayer = new NeuralNode[inputSize];
        this.outputLayer = new NeuralNode[outputSize];
        this.questions = questions;
        this.answers = answers;
        this.epocs = epocs;
        this.eta = eta;
        this.alpha = alpha;
        setupLayers(hiddenLayers, hiddenSize);
        connectLayers();
        train(this.questions, this.answers);
    }


    public void train(ArrayList<double[]> features, ArrayList<Double> predictions) {

        int epocs = 300;
        for (int i = 0; i < epocs; i++) {
            for (int j = 0; j < features.size(); j++) {

                feedForward(features.get(j));
                calculateOutputError(predictions.get(j));
                calculateHiddenLayerError();
                updateWeights(i, epocs);
            }
        }

    }


    public void calculateOutputError(double answer) {

        for (int i = 0; i < outputLayer.length; i++) {
            NeuralNode currentNode = outputLayer[i];
            double outputTargetValue = -1;
            if (i == answer) {
                outputTargetValue = 1;
            } else {
                outputTargetValue = 0;
            }

//            double outputValue = outputLayer[i].getValue();
            double outputValue = currentNode.getValue();
            // Only for sigmoid
//            double error = (outputTargetValue - outputValue) * outputValue * (1 - outputValue);
            double error = (outputTargetValue - outputValue) * currentNode.activation.derivative(currentNode.getValue());
            outputLayer[i].setError(error);

        }
    }


    public void calculateHiddenLayerError() {

        for (int i = hiddenLayers.size() - 1; i >= 0; i--) {
            NeuralNode[] currentLayer = hiddenLayers.get(i);
            for (int j = 0; j < currentLayer.length; j++) {
                NeuralNode currentNode = currentLayer[j];
                // Calculate Error
                // Coefficient = Sigmoid Derivative
                double coefficient = currentNode.activation.derivative(currentNode.getValue());
//                double coefficient = currentNode.getValue() * (1 - currentNode.getValue());

                // Summation
                double[] weights = currentNode.getWeights();
                NeuralNode[] nextLayerNodes = currentNode.getChildren();
                double summation = 0.0;
                for (int k = 0; k < currentNode.getWeights().length; k++) {
                    summation += weights[k] * nextLayerNodes[k].getError();
                }
                double error = coefficient * summation;
                currentNode.setError(error);
            }
        }

    }


    public void updateWeights(int epocNumber, int epocs) {
        // double eta = 0.15;
        double decayValue = (epocs - epocNumber) / epocs;
        // double alpha = 0.25 * decayValue;

        // Hidden Layer Weights
        for (int i = hiddenLayers.size() - 1; i >= 0; i--) {
            NeuralNode[] currentLayer = hiddenLayers.get(i);

            for (int j = 0; j < currentLayer.length; j++) {
                NeuralNode currentNode = currentLayer[j];
                double[] weights = currentNode.getWeights();
                NeuralNode[] nextLayerNodes = currentNode.getChildren();
                double[] lastEpocDeltaWs = currentNode.getPreviousChangeInWeights();


                for (int k = 0; k < weights.length; k++) {
                    // place current last epoc delta w into momentum for use in this rounds calculation
                    double momentum = alpha * lastEpocDeltaWs[k];

                    // update previous to current value for next round calculation
                    double currentDeltaW =  eta * nextLayerNodes[k].getError() * currentNode.getValue();

                    // update the weight
                    weights[k] += currentDeltaW + momentum;
                    currentNode.setPreviousChangeInWeights(k, currentDeltaW + momentum);
//                    lastEpocDeltaWs[k] = currentDeltaW + momentum;

                }
                // update values
                double momentum = alpha * currentNode.getPreviousChangeInBias();
                double deltaBias =  eta * currentNode.getError();
                double bias = currentNode.getBias() + deltaBias + momentum;
                currentNode.setPreviousChangeInBias(deltaBias + momentum);
                currentNode.setBias(bias);
            }
        }

        // Input Layer weights
        for (int i = 0; i < inputLayer.length; i++) {
            NeuralNode currentNode = inputLayer[i];
            double[] weights = currentNode.getWeights();
            NeuralNode[] nextLayerNodes = currentNode.getChildren();
            double[] previousDeltaWs = currentNode.getPreviousChangeInWeights();
            for (int j = 0; j < weights.length; j++) {
                double momentum = alpha * previousDeltaWs[j];
                double currentDeltaW = eta * nextLayerNodes[j].getError() * currentNode.getValue();
                weights[j] += currentDeltaW + momentum;
                previousDeltaWs[j] = currentDeltaW + momentum;

            }
            // Bias term is not used in predictions and therefor, never updated
        }
    }


    private void setupLayers(int hiddenLayerCount, int hiddenSize) {

        // setup input nodes
        for (int i = 0; i < inputLayer.length; i++) {
            inputLayer[i] = new NeuralNode("Input " + (i + 1));
        }

        // setup hidden Layers
        for (int i = 0; i < hiddenLayerCount; i++) {
            NeuralNode[] layer = new NeuralNode[hiddenSize];

            for (int j = 0; j < hiddenSize; j++) {
                layer[j] = new NeuralNode("Hidden Layer: " + (i + 1) + " Node: " + (j + 1));
            }
            this.hiddenLayers.add(layer);
        }

        // setup output layer
        for (int i = 0; i < outputLayer.length; i++) {
            outputLayer[i] = new NeuralNode("Output: " + (i + 1));
        }
    }


    private void connectLayers() {
        // input to first hidden
        NeuralNode[] firstHiddenLayer = hiddenLayers.get(0);
        for (int i = 0; i < inputLayer.length; i++) {
            inputLayer[i].setChildren(firstHiddenLayer);
        }

        // set remaining hidden layer up until last hidden layer
        for (int i = 0; i < hiddenLayers.size() - 1; i++) {
            NeuralNode[] currentLayer = hiddenLayers.get(i);
            NeuralNode[] nextLayer = hiddenLayers.get(i + 1);

            for (int j = 0; j < currentLayer.length; j++) {
                currentLayer[j].setChildren(nextLayer);
            }
        }

        // set last hidden layer children to output layer
        NeuralNode[] lastHiddenLayer = hiddenLayers.get(hiddenLayers.size() - 1);
        for (NeuralNode node : lastHiddenLayer) {
            node.setChildren(this.outputLayer);
        }
    }


    private void feedForward(double[] features) {

        // Feed into input layer
        for (int i = 0; i < features.length; i++) {
            inputLayer[i].setValue(features[i]);
        }

        NeuralNode[] firstHiddenLayer = hiddenLayers.get(0);
        // feed into first hidden
        for (int i = 0; i < firstHiddenLayer.length; i++) {
            NeuralNode hiddenLayerNode = firstHiddenLayer[i];
            double sum = hiddenLayerNode.getBias();
            for (int j = 0; j < inputLayer.length; j++) {
                NeuralNode currentInputNode = inputLayer[j];
                sum += currentInputNode.getValue() * currentInputNode.getWeights()[i];
            }
            double activationValue = hiddenLayerNode.activation.activate(sum);
            hiddenLayerNode.setValue(activationValue);
        }

        // feed into remaining hidden layers
        for (int i = 1; i < hiddenLayers.size(); i++) {
            NeuralNode[] currentHiddenLayer = hiddenLayers.get(i);
            NeuralNode[] previousHiddenLayer = hiddenLayers.get(i - 1);

            for (int j = 0; j < currentHiddenLayer.length; j++) {
                NeuralNode currentLayerNode = currentHiddenLayer[j];
                double sum = currentLayerNode.getBias();
                for (int k = 0; k < previousHiddenLayer.length; k++) {
                    NeuralNode previousLayerNode = previousHiddenLayer[k];
                    sum += previousLayerNode.getValue() * previousLayerNode.getWeights()[j];
                }
                double activationValue = currentLayerNode.activation.activate(sum);
                currentLayerNode.setValue(activationValue);
            }
        }

        // Feed into Output Layer
        NeuralNode[] lastHiddenLayer = hiddenLayers.get(hiddenLayers.size() - 1);

        for (int i = 0; i < outputLayer.length; i++) {
            NeuralNode currentOutputNode = outputLayer[i];
            double sum = currentOutputNode.getBias();
            for (int j = 0; j < lastHiddenLayer.length; j++) {
                NeuralNode hiddenNode = lastHiddenLayer[j];
                sum += hiddenNode.getValue() * hiddenNode.getWeights()[i];
            }
            double activationValue = currentOutputNode.activation.activate(sum);
            currentOutputNode.setValue(activationValue);
        }
    }


    public double makePrediction(double[] features) {
        feedForward(features);
        // Track Best Hypothesis
        int bestIndex = 0;
        double bestValue = outputLayer[0].getValue();
        double sum = bestValue;

        for (int i = 1; i < outputLayer.length; i++) {
            double value = outputLayer[i].getValue();

            sum += value;
            if (value > bestValue) {
                bestValue = value;
                bestIndex = i;
            }
        }
        // Probabilities should sum to 1
//        System.out.println(sum);

        return bestIndex;
    }


    public ArrayList<double[]> getQuestions() {
        return this.questions;
    }


    public ArrayList<Double> getAnswers() {
        return this.answers;
    }




    public String getHiddenNodeInfo(int layerNumber, int position) {

        NeuralNode node = hiddenLayers.get(layerNumber)[position];
        String result = getNodeInfo(node);
        return result;
    }


    public String getInputNodeInfo(int nodePosition) {
        NeuralNode node = inputLayer[nodePosition];
        String result = getNodeInfo(node);
        return result;
    }


    public String getOutputNodeInfo(int nodePosition) {
        NeuralNode node = outputLayer[nodePosition];
        String result = getNodeInfo(node);
        return result;
    }


    public String getNodeInfo(NeuralNode node) {
        StringBuilder sb = new StringBuilder();
        double[] weights = node.getWeights();
        NeuralNode[] currentNodeChildren = node.getChildren();
        for (int i = 0; i < currentNodeChildren.length; i++) {
            sb.append(currentNodeChildren[i].name +" ");
            sb.append(weights[i] + "\n");
        }

        // System.out.println(sb);
        return sb.toString();
    }

}
