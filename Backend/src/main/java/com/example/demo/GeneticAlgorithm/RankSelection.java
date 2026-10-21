package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class RankSelection extends AbstractSelectionStrategy {

    public RankSelection() {

    }


    @Override
    public List<CandidateHyp> select(List<CandidateHyp> candidates, int selectionRate) {
        Collections.sort(candidates, Comparator.comparingDouble(CandidateHyp::getFitness).reversed());
        ArrayList<CandidateHyp> selected = new ArrayList<>(selectionRate);
        double size = candidates.size();
        // sum of integers from 0 to n
        double rankSum = size * (size + 1) / 2;

        while (selected.size() < selectionRate) {
            double random = randy.nextDouble(0, rankSum);

            double sum = 0;
            int index = 0;
            while (sum <= random) {

                CandidateHyp candidate = candidates.get(index);
                sum += size - index;
                if (sum > random) {
                    selected.add(candidate);
                }
                index++;
            }
        }

        return selected;
    }
}
