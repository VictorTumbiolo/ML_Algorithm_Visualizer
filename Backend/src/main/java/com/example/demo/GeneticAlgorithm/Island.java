package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Island {

    private Random randy = new Random();

    private int selectionRate;
    private int crossoverRate;


    private final SelectionStrategy selectionStrategy;
    private final MutationStrategy mutationStrategy;
    private final CrossoverStrategy crossoverStrategy;

    private ArrayList<CandidateHyp> population;

    private Evaluator evaluate;

    public Island (ArrayList<CandidateHyp> population, SelectionStrategy selectionStrategy,
                   MutationStrategy mutationStrategy, CrossoverStrategy crossoverStrategy,
                   Evaluator evaluate, int selectionRate, int crossoverRate) {
        this.population = new ArrayList<>(population);
        this.selectionRate = selectionRate;
        this.crossoverRate = crossoverRate;
        this.selectionStrategy = selectionStrategy;
        this.mutationStrategy = mutationStrategy;
        this.crossoverStrategy = crossoverStrategy;
        this.evaluate = evaluate;
    }

    // Similar to train one epoc
    public void evolve() {
        // Island Selection
        List<CandidateHyp> selected = selectionStrategy.select(population, selectionRate);

        // Island Crossover
        List<CandidateHyp> crossover = selectionStrategy.select(population, crossoverRate);
        ArrayList<CandidateHyp> crossoverList = new ArrayList<>(crossover);

        // post crossover candidates
        ArrayList<CandidateHyp> crossedOver = crossover(crossoverList);

        // clear population
        population.clear();

        // Mutate
        mutate(selected, crossedOver);

    }


    private void mutate(List<CandidateHyp> selected, ArrayList<CandidateHyp> crossedOver) {
        // Mutate
        for (int j = 0; j < selected.size(); j++) {
            double chance = 0.75;

            if (randy.nextDouble() < chance) {
                population.add(selected.get(j));
            } else {
                int[] hyp = mutationStrategy.mutate(selected.get(j).getHypothesis());
                double fitness = evaluate.fitness(hyp);
                CandidateHyp temp = new CandidateHyp(hyp, fitness);
                population.add(temp);
            }
        }

        // mutate all crossover individuals
        for (CandidateHyp hyp : crossedOver) {
            int[] hypothesis = hyp.getHypothesis();
            int[] mutatedHyp = mutationStrategy.mutate(hypothesis);
            double fitness = evaluate.fitness(mutatedHyp);
            CandidateHyp nextGenCandidate = new CandidateHyp(mutatedHyp, fitness);
            population.add(nextGenCandidate);
        }
    }


    private ArrayList<CandidateHyp> crossover(ArrayList<CandidateHyp> crossoverList) {
        ArrayList<CandidateHyp> crossedOver = new ArrayList<>();

        while (crossedOver.size() <= crossoverList.size()) {
            int random1 = randy.nextInt(0, crossoverList.size());
            int random2 = randy.nextInt(0, crossoverList.size());

            int[] a = crossoverList.get(random1).getHypothesis();
            int[] b = crossoverList.get(random2).getHypothesis();

            ArrayList<int[]> offspring = crossoverStrategy.getOffspring(a, b);
            for (int[] child : offspring) {
                double fitness = evaluate.fitness(child);
                CandidateHyp candidate = new CandidateHyp(child, fitness);
                crossedOver.add(candidate);
            }

        }

        while (crossedOver.size() > crossoverList.size()) {
            int random = randy.nextInt(0, crossedOver.size());
            crossedOver.remove(crossedOver.get(random));
        }

        return crossedOver;
    }


    public ArrayList<CandidateHyp> getPopulation() {
        return this.population;
    }


    public void getPopSize() {
        System.out.println(this.population.size());
    }




}
