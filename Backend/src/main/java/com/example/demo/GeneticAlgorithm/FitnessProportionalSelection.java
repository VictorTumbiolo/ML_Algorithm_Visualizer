package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;
import java.util.List;

public class FitnessProportionalSelection extends AbstractSelectionStrategy {

    // empty constructor
    public FitnessProportionalSelection() {

    }


    @Override
    public List<CandidateHyp> select(List<CandidateHyp> population, int rate) {
        double totalFitness = 0;
        // Calculate total fitness
        // Associate individuals with their fitness
        for (CandidateHyp individual : population) {
            // filter out zombie hypotheses
            if (individual.getFitness() == 0.001) continue;

            // add to running sum
            totalFitness += individual.getFitness();

        }

        // choose which to select based on fitness
        ArrayList<CandidateHyp> selected = new ArrayList<>();
        while(selected.size() < rate) {

            double runningSum = 0;
            double chance = randy.nextDouble(0, totalFitness);

            for (CandidateHyp candidate : population) {
                // filter out zombie hypotheses
                if (candidate.getFitness() == 0.001) continue;
                runningSum += candidate.getFitness();

                if (runningSum >= chance) {
                    selected.add(candidate);
                    break;
                }
            }
        }
        return selected;
    }
}
