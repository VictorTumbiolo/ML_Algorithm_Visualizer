package com.example.demo.GeneticAlgorithm;
public class StandardMutation extends AbstractMutationStrategy {
    double mutationRate;
    // Empty Constructor
    public StandardMutation(double mutationRate) {
        this.mutationRate = mutationRate;
    }

    @Override
    public int[] mutate(int[] hypothesis) {
        return standardMutation(hypothesis, mutationRate);
    }
}
