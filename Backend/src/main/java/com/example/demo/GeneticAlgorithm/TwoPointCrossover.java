package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;

public class TwoPointCrossover extends AbstractCrossoverStrategy {

    @Override
    public ArrayList<int[]> getOffspring(int[] a, int[] b) {
        int ruleLength = a.length;

        int random1 = randy.nextInt(0, ruleLength);

        int random2 = random1;

        while (random2 == random1) {
            random2 = randy.nextInt(0, ruleLength);
        }

        // ensure proprer indexing
        int temp = -1;
        if (random1 > random2) {
            temp = random1;
            random1 = random2;
            random2 = temp;
        }

        // holder array
        int[] holder = new int[random2 - random1];
        int holderIndex = 0;

        // LOOPS

        // create holder with a's middle
        for (int i = random1; i < random2; i++) {
            holder[holderIndex] = a[i];
            holderIndex++;
        }

        // place b's middle into a's middle
        for (int i = random1; i < random2; i++) {
            a[i] = b[i];
        }

        // reset holder
        holderIndex = 0;

        // populate b's middle with a's middle saved in holder
        for (int i = random1; i < random2; i++) {
            b[i] = holder[holderIndex];
            holderIndex++;
        }
        ArrayList<int[]> offspring = new ArrayList<>(2);
        offspring.add(a.clone());
        offspring.add(b.clone());

        return offspring;
    }


}
