package com.example.demo.NeuralNetwork;
public interface ActivationFunction {
    double activate(double x);
    double derivative(double x);
}
