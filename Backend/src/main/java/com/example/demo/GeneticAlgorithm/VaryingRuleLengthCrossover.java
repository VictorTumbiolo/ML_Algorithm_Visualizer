package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;

public class VaryingRuleLengthCrossover extends AbstractCrossoverStrategy {
    private static final HypothesesUtilities helperFunctions = new HypothesesUtilities();

    public VaryingRuleLengthCrossover(int ruleLength) {
        helperFunctions.setRuleLength(ruleLength);
    }

    @Override
    public ArrayList<int[]> getOffspring(int[] a, int[] b) {
        int[] splits = getSplits(a, b);
        ArrayList<int[]> componentsA = helperFunctions.splitHypothesis(a, splits[0], splits[1]);

        ArrayList<int[]> componentsB = helperFunctions.splitHypothesis(b, splits[2], splits[3]);
        ArrayList<int[]> offSpring = offSpring(componentsA, componentsB);
        return offSpring;
    }

    public static ArrayList<int[]> offSpring(ArrayList<int[]> componentsA, ArrayList<int[]> componentsB) {
        int hypASize = componentsA.get(0).length + componentsB.get(1).length + componentsA.get(2).length;
        int hypBSize = componentsB.get(0).length + componentsA.get(1).length + componentsB.get(2).length;
        int[] offSpringA = offSpringHelper(new int[hypASize], componentsA.get(0), componentsB.get(1), componentsA.get(2));
        int[] offSpringB = offSpringHelper(new int[hypBSize], componentsB.get(0), componentsA.get(1), componentsB.get(2));
        ArrayList<int[]> offSpring = new ArrayList<>(2);
        offSpring.add(offSpringA);
        offSpring.add(offSpringB);
        return  offSpring;
    }

    public static int[] offSpringHelper(int[] offSpring, int[] first, int[] second, int[] third) {

        int offSpringIndex = 0;
        for (int i = 0; i < first.length; i++) {
            offSpring[offSpringIndex] = first[i];
            offSpringIndex++;
        }

        for (int i = 0; i < second.length; i++) {
            offSpring[offSpringIndex] = second[i];
            offSpringIndex++;
        }

        for (int i = 0; i < third.length; i++) {
            offSpring[offSpringIndex] = third[i];
            offSpringIndex++;
        }

        return offSpring;
    }

    public int[] getSplits(int[] a, int[] b) {

        // Shared calculations
        int ruleLength = 11;
        int random1 = randy.nextInt(0, ruleLength);
        int random2 = randy.nextInt(0,ruleLength);

        if (random1 == random2 && random2 == ruleLength - 1) {
            random1 = randy.nextInt(0, ruleLength - 1);
        } else if (random1 == random2) {
            random1 = randy.nextInt(0, ruleLength);
        }

        if (random1 > random2) {
            int temp = random2;
            random2 = random1;
            random1 = temp;
        }

        // Hyp A rule selection
        int hypARuleCount = a.length / ruleLength;
        int random3 = randy.nextInt(hypARuleCount);
        int random4 = randy.nextInt(random3, hypARuleCount);

        int hypASplit1 = random3 * ruleLength + random1;
        int hypASplit2 = random4 * ruleLength + random2;

        // Hyp B rule selection
        int hypBRuleCount = b.length / ruleLength;
        int random5 = randy.nextInt(hypBRuleCount);
        int random6 = randy.nextInt(random5, hypBRuleCount);

        int hypBSplit1 = random5 * ruleLength + random1;
        int hypBSplit2 = random6 * ruleLength + random2;

        int[] splits = new int[4];
        splits[0] = hypASplit1;
        splits[1] = hypASplit2;
        splits[2] = hypBSplit1;
        splits[3] = hypBSplit2;
        return splits;

    }

}
