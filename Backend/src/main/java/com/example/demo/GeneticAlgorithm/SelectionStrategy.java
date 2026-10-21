package com.example.demo.GeneticAlgorithm;
import java.util.List;
public interface SelectionStrategy {
    List<CandidateHyp> select(List<CandidateHyp> candidates, int selectionRate);
}
