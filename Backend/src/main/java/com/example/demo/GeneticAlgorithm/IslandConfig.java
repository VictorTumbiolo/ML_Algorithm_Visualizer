package com.example.demo.GeneticAlgorithm;

public class IslandConfig {
    private int selectionRate;
    private String selectionStrategy;
    private double mutationRate;
    private String mutationStrategy;
    private int crossoverRate;
    private String crossoverStrategy;
    private double ruleLengthPenalty;
    private String gabilExtension;
    private int populationSize;

    // getters & setters
    public int getSelectionRate() { return selectionRate; }
    public void setSelectionRate(int selectionRate) { this.selectionRate = selectionRate; }

    public String getSelectionStrategy() { return selectionStrategy; }
    public void setSelectionStrategy(String selectionStrategy) { this.selectionStrategy = selectionStrategy; }

    public double getMutationRate() { return mutationRate; }
    public void setMutationRate(double mutationRate) { this.mutationRate = mutationRate; }

    public String getMutationStrategy() { return mutationStrategy; }
    public void setMutationStrategy(String mutationStrategy) { this.mutationStrategy = mutationStrategy; }

    public int getCrossoverRate() { return crossoverRate; }
    public void setCrossoverRate(int crossoverRate) { this.crossoverRate = crossoverRate; }

    public String getCrossoverStrategy() { return crossoverStrategy; }
    public void setCrossoverStrategy(String crossoverStrategy) { this.crossoverStrategy = crossoverStrategy; }

    public double getRuleLengthPenalty() { return ruleLengthPenalty; }
    public void setRuleLengthPenalty(double ruleLengthPenalty) { this.ruleLengthPenalty = ruleLengthPenalty; }

    public String getGabilExtension() { return gabilExtension; }
    public void setGabilExtension(String gabilExtension) { this.gabilExtension = gabilExtension; }

    public int getPopulationSize() { return populationSize; }
    public void setPopulationSize(int populationSize) { this.populationSize = populationSize; }
}
