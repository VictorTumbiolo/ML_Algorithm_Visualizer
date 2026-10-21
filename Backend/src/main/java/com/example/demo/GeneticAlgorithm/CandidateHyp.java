package com.example.demo.GeneticAlgorithm;
public class CandidateHyp {

    private int[] hypothesis;
    private double fitness;

    public CandidateHyp(int[] hypothesis, double fitness) {
        this.hypothesis = hypothesis;
        this.fitness = fitness;
    }

    public int[] getHypothesis() {
        return this.hypothesis;
    }

    public double getFitness() {
        return this.fitness;
    }

    public void setHypothesis(int[] hypothesis) {
        this.hypothesis = hypothesis;
    }

    public void setFitness(double fitness) {
        this.fitness = fitness;
    }
}
