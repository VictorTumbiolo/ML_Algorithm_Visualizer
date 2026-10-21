package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;

public class SinglePointCrossover extends AbstractCrossoverStrategy {

    @Override
    public ArrayList<int[]> getOffspring(int[] a, int[] b) {
        int ruleLength = a.length;
        ArrayList<int[]> offspring = new ArrayList<>();
        int random = randy.nextInt(0, ruleLength);

        int[] holder = new int[ruleLength - random];
        int holderIndex = 0;
        for (int i = random; i < ruleLength; i++) {
            holder[holderIndex] = a[i];
            holderIndex++;
        }

        for (int i = random; i < ruleLength; i++) {
            a[i] = b[i];
        }
        holderIndex = 0;
        for (int i = random; i < ruleLength; i++) {
            b[i] = holder[holderIndex];
            holderIndex++;
        }

        offspring.add(a);
        offspring.add(b);

        return offspring;
    }
}
