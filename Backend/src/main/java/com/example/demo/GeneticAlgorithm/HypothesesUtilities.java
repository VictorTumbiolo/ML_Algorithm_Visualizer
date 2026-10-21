package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;

public class HypothesesUtilities {

    private int ruleLength;

    public HypothesesUtilities() {

    }

    public void setRuleLength(int ruleLength) {
        this.ruleLength = ruleLength;
    }

    public int getRuleLength() {
        return this.ruleLength;
    }

    public ArrayList<int[]> splitHypothesis(int[] hyp, int split1, int split2) {
        if (split1 > split2) {
            int temp = split2;
            split2 = split1;
            split1 = temp;

        }

        ArrayList<int[]> parts = new ArrayList<>();
        // first split
        int[] arr1 = new int[split1];
        for (int i = 0; i < split1; i++) {
            arr1[i] = hyp[i];
        }

        // Middle split
        int[] arr2 = new int[split2 - split1];
        int indexHelper = 0;
        for (int i = split1; i < split2; i++) {
            arr2[indexHelper] = hyp[i];
            indexHelper++;
        }


        // End sPLIT
        int[] arr3 = new int[hyp.length - split2];
        // reset indexHelper
        indexHelper = 0;
        for (int i = split2; i < hyp.length; i++) {
            arr3[indexHelper] = hyp[i];
            indexHelper++;

        }
        parts.add(arr1);
        parts.add(arr2);
        parts.add(arr3);

        return parts;


    }

    public int[] buildHypothesis(int[] a, int[] b, int[] c) {
        int[] newHyp = new int[a.length + b.length + c.length];
        int hypIndex = 0;

        for (int i = 0; i < a.length; i++) {
            newHyp[hypIndex] = a[i];
            hypIndex++;
        }

        for (int i = 0; i < b.length; i++) {
            newHyp[hypIndex] = b[i];
            hypIndex++;
        }

        for (int i = 0; i < c.length; i++) {
            newHyp[hypIndex] = c[i];
            hypIndex++;
        }

        return newHyp;
    }

    // OVERLOAD
    public int[] buildHypothesis(ArrayList<int[]> rules, int ruleLength) {
        int[] hypothesis = new int[ruleLength * rules.size()];

        int hypIndex = 0;
        for (int[] rule : rules) {

            for (int i = 0; i < ruleLength; i++) {
                hypothesis[hypIndex] = rule[i];
                hypIndex++;
            }
        }

        return hypothesis;
    }


    public void printHypothesis(int[] hyp) {
        for (int i = 0; i < hyp.length; i++) {
            System.out.print(hyp[i]);
        }
        System.out.println();
    }


    public ArrayList<int[]> breakHypIntoRules(int[] hypothesis, int ruleLength) {
        ArrayList<int[]> rules = new ArrayList<>();

        int hypIndex = 0;
        for (int i = 0; i < hypothesis.length / ruleLength; i++) {
            int[] rule = new int[ruleLength];
            for (int j = 0; j < ruleLength; j++) {
                rule[j] = hypothesis[hypIndex];
                hypIndex++;
            }
            rules.add(rule);
        }

        return rules;
    }


}
