package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;

public interface CrossoverStrategy {

    public abstract ArrayList<int[]> getOffspring(int[] a, int[] b);
}
