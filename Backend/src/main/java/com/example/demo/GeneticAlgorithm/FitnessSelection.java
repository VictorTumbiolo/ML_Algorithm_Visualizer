package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class FitnessSelection extends AbstractSelectionStrategy {

    public FitnessSelection () {

    }

    @Override
    public List<CandidateHyp> select(List<CandidateHyp> candidates, int selectionRate) {
        Collections.sort(candidates, Comparator.comparingDouble(CandidateHyp::getFitness).reversed());
        ArrayList<CandidateHyp> selected = new ArrayList<>(selectionRate);
        for (int j = 0; j < selectionRate; j++) {
            selected.add(candidates.get(j));
        }
        return selected;
    }
}
