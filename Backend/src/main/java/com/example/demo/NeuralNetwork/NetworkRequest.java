package com.example.demo.NeuralNetwork;

public class NetworkRequest {

    private String trainFile;
    private String testFile;
    private double learningRate;
    private double momentum;
    private int epocs;
    private String activationFunction;
    // private String lossFunction;
    private int hiddenLayers;
    private int neuronsPerLayer;

    // Getters and Setters
    public String getActivationFunction() { return activationFunction; }
    public void setActivationFunction(String activationFunction) { this.activationFunction = activationFunction; }

    // public String getLossFunction() { return lossFunction; }
    // public void setLossFunction(String lossFunction) { this.lossFunction = lossFunction; }

    public String getTrainFile() { return trainFile; }
    public void setTrainFile(String trainFile) { this.trainFile = trainFile; }

    public String getTestFile() { return testFile; }
    public void setTestFile(String testFile) { this.testFile = testFile; }

    public int getHiddenLayers() { return hiddenLayers; }
    public void setHiddenLayers(int hiddenLayers) { this.hiddenLayers = hiddenLayers; }

    public int getNeuronsPerLayer() { return neuronsPerLayer; }
    public void setNeuronsPerLayer(int neuronsPerLayer) { this.neuronsPerLayer = neuronsPerLayer; }

    public int getEpocs() {
        return this.epocs;
    }

    public double getLearningRate() {
        return this.learningRate;
    }

    public double getMomentum() {
        return this.momentum;
    }

    public String getTrainingFile() {
        return this.trainFile;
    }

    
}
