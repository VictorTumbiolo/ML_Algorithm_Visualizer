package com.example.demo.GeneticAlgorithm;
import java.util.Random;

public abstract class AbstractMutationStrategy implements MutationStrategy {
    protected final Random randy = new Random();

    // mutation type not specified
    // mutationRate may be for standard or GABIL mutations
    protected boolean shouldMutate(double mutationRate) {
        return randy.nextDouble() < mutationRate;
    }

    protected int flipBit(int bit) {
        return (bit == 0) ? 1 : 0;
    }

    protected int[] standardMutation(int[] rule, double mutationRate) {
        for (int i = 0; i < rule.length; i++) {
            if (shouldMutate(mutationRate)) {
                int complement = flipBit(rule[i]);
                rule[i] = complement;
            }
        }

        return rule;
    }

}
