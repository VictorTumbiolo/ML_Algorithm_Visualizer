package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;
import java.util.List;

public class TournamentSelection extends AbstractSelectionStrategy {

    private int tournamentSize;

    public TournamentSelection(int tournamentSize) {
        this.tournamentSize = tournamentSize;
    }

    @Override
    public List<CandidateHyp> select(List<CandidateHyp> candidates, int selectionRate) {
        ArrayList<CandidateHyp> selected = new ArrayList<>(selectionRate);

        while (selected.size() < selectionRate) {

            CandidateHyp winner = null;
            for (int i = 0; i < tournamentSize; i++) {
                int index = randy.nextInt(0, candidates.size());
                CandidateHyp candidate = candidates.get(index);
                if (i == 0) {
                    winner = candidate;
                } else if (candidate.getFitness() > winner.getFitness()) {
                    winner = candidate;
                }

            }

            selected.add(winner);
        }


        return selected;
    }
}
