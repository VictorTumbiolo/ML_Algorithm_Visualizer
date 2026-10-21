package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;

public class ExtendedTwoPointCrossover extends AbstractCrossoverStrategy {
    private static final HypothesesUtilities helperFunctions = new HypothesesUtilities();

    // Constructor
    public ExtendedTwoPointCrossover(int ruleLength) {
        helperFunctions.setRuleLength(ruleLength);
    }

    @Override
    public ArrayList<int[]> getOffspring(int[] a, int[] b) {
        int hypLength = a.length;

        int random1 = randy.nextInt(0, hypLength);

        int random2 = random1;

        while (random2 == random1) {
            random2 = randy.nextInt(0, hypLength);
        }

        // ensure proper indexing
        int temp = -1;
        if (random1 > random2) {
            temp = random1;
            random1 = random2;
            random2 = temp;
        }

        ArrayList<int[]> aParts = helperFunctions.splitHypothesis(a, random1, random2);
        ArrayList<int[]> bParts = helperFunctions.splitHypothesis(b, random1, random2);

        ArrayList<int[]> offspring = new ArrayList<>();
        int firstPartLength = aParts.get(0).length;
        int[] aFirstComp = aParts.get(0);
        int[] bFirstComp = bParts.get(0);


        // swap ends
        int[] endHolder = aParts.get(2).clone();
        int[] endB = bParts.get(2); // not clone
        int[] endA = aParts.get(2);

        //swap middle
        int[] midHolder = aParts.get(1).clone();
        int[] midB = bParts.get(1); // not clone
        int[] midA = aParts.get(1);



        double chance = randy.nextDouble();
        if (chance < 0.5) {


            // swap A and B ENDS
            for (int i = 0; i < endB.length; i++) {
                endA[i] = endB[i];
            }

            for (int i = 0; i < endB.length; i++) {
                endB[i] = endHolder[i];
            }
            // Another chance to swap middle

            double chance2 = randy.nextDouble();
            if (chance2 < 0.5) {

                // swap A and B
                for (int i = 0; i < midB.length; i++) {
                    midA[i] = midB[i];
                }

                for (int i = 0; i <  midB.length; i++) {
                    midB[i] = midHolder[i];
                }

            }

        } else {

            // swap A and B
            for (int i = 0; i < midB.length; i++) {
                midA[i] = midB[i];
            }

            for (int i = 0; i <  midB.length; i++) {
                midB[i] = midHolder[i];
            }


        }
        int[] childA = helperFunctions.buildHypothesis(aFirstComp, midA, endA);
        int[] childB = helperFunctions.buildHypothesis(bFirstComp, midB, endB);

        offspring.add(childA);
        offspring.add(childB);

        return offspring;
    }


}
