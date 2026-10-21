package com.example.demo.GeneticAlgorithm;
import java.util.ArrayList;
import java.util.HashMap;

public class GabilMutation extends AbstractMutationStrategy {
    private final double mutationRate;
    private final double addAlternativeRate;
    private final double dropConditionRate;
    private final HypothesesUtilities utilities = new HypothesesUtilities();
    private HashMap<String, ArrayList<String>> attributeValues;


    public GabilMutation(double mutationRate, double addAlternativeRate, double dropConditionRate,
                            HashMap<String, ArrayList<String>> attributeValues) {
        this.mutationRate = mutationRate;
        this.addAlternativeRate = addAlternativeRate;
        this.dropConditionRate = dropConditionRate;
        this.attributeValues = attributeValues;
    }

    @Override
    public int[] mutate(int[] hypothesis) {

        // Break Hypothesis into rules
        ArrayList<int[]> rules = utilities.breakHypIntoRules(hypothesis, 11);

        // get total for roulette mutation selection
        double total = mutationRate + addAlternativeRate + dropConditionRate;

        for (int i = 0; i < rules.size(); i++) {
            int[] rule = rules.get(i);
            double random = randy.nextDouble(0, total);

            if (random < dropConditionRate) {
                rule = dropCondition(rule, dropConditionRate);
            } else if (random < dropConditionRate + addAlternativeRate) {
                rule = addAlternative(rule, addAlternativeRate);
            } else {
                rule = standardMutation(rule, mutationRate);
            }

            rules.set(i, rule);
        }

        return utilities.buildHypothesis(rules, 11);
    }


    // ADD ALTERNATIVE
    // REPLACE RANDOM 0 BIT WITH 1
    public int[] addAlternative(int[] rule, double addRate) {

        // Minus One to account for Taget Class
        int attrCount = attributeValues.size() - 1;

        // turn all attr bits to 1 for each rule by chance

        for (int i = 0; i < attrCount; i++) {
            ArrayList<Integer> holder = new ArrayList<>();
            double chance = randy.nextDouble(0,1);
            String prefix = "Attribute: ";
            if (chance < addRate) {

                int startIndex = 0;
                for (int j = 0; j < i; j++) {
                    startIndex += attributeValues.get(prefix + String.valueOf(j)).size();
                }
                int endIndex = startIndex + attributeValues.get(prefix + i).size();

                for (int j = startIndex; j < endIndex; j++) {
                    if (rule[j] == 0) {
                        holder.add(j);
                    }
                }
                // All bits are 1, cannot generalize further
                if (holder.isEmpty()) {
                    continue;
                }
                int random = randy.nextInt(0, holder.size());
                rule[holder.get(random)] = 1;


            }

        }

        return rule;
    }

    // DROP CONDNITION
    // REPLACE ALL BITS WITH 1
    public int[] dropCondition(int[] rule, double dropRate) {


        // turn all attr bits to 1 for each rule by chance
        // Minus One to account for target class
        int attrCount = attributeValues.size() - 1;

        for (int i = 0; i < attrCount; i++) {
            double chance = randy.nextDouble(0, 1);
            String prefix = "Attribute: ";

            if (chance < dropRate) {

                int startIndex = 0;
                for (int j = 0; j < i; j++) {
                    startIndex += attributeValues.get(prefix + String.valueOf(j)).size();
                }
                int endIndex = startIndex + attributeValues.get(prefix + i).size();

                for (int j = startIndex; j < endIndex; j++) {
                    rule[j] = 1;
                }

            }

        }

        return rule;
    }
}
