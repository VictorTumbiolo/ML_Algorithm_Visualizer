package com.example.demo.NeuralNetwork;
public class SigmoidActivation implements ActivationFunction {
    @Override
    public double activate(double x) {
        return 1.0 / (1.0 + Math.exp(-x));
    }

    @Override
    // x is already activated Input
    public double derivative(double x) {

        return x * (1 - x);
    }
}