package com.example.demo.NeuralNetwork;
import java.util.Random;

public class NeuralNode {

    public String name;
    private Random randy = new Random();
    private NeuralNode[] children;
    private double[] weights;
    private double[] previousChangeInWeights;
    private double value;
    private double bias = randy.nextDouble() - 0.5;
    private double previousChangeInBias = 0;
    private double error = 0;


    SigmoidActivation activation = new SigmoidActivation();
    public NeuralNode(String name) {
        this.name = name;
    }

    public String getNodeName() {
        return this.name;
    }


    public void setChildren(NeuralNode[] children) {
        this.children = children;
        this.weights = new double[children.length];
        this.previousChangeInWeights = new double[children.length];
        setupWeights();
    }


    // weight initalization
    private void setupWeights() {
        for (int i = 0; i < children.length; i++) {
            weights[i] = randy.nextDouble() - 0.5;
        }
    }


    public double[] getWeights() {
        return this.weights;
    }


    public void setValue(double value) {
        this.value = value;
    }


    public double getValue() {
        return this.value;
    }


    public double getBias() {
        return this.bias;
    }


    public void setBias(double bias) {
        this.bias = bias;
    }


    public double getError() {
        return this.error;
    }


    public void setError(double error) {
        this.error = error;
    }


    public NeuralNode[] getChildren() {
        return this.children;
    }


    public void setPreviousChangeInWeights(int index, double value) {
        this.previousChangeInWeights[index] = value;
    }

    public double[] getPreviousChangeInWeights() {
        return this.previousChangeInWeights;
    }


    public double getPreviousChangeInBias() {
        return this.previousChangeInBias;
    }


    public void setPreviousChangeInBias(double changeInBias) {
        this.previousChangeInBias = changeInBias;
    }
}
