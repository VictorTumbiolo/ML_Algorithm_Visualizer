package com.example.demo.GeneticAlgorithm;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Evaluator {

    private double LAMBDA = 0.0;
    private HypothesesUtilities utilities = new HypothesesUtilities();
    private HashMap<String, ArrayList<String>> attributeValues;
    private ArrayList<int[]> examples;

    // Cononical Constructor
    public Evaluator() {

    }

    // Additional Constructor for VaryRuleLengthCrossover
    public Evaluator(double LAMBDA) {
        this.LAMBDA = LAMBDA;
    }


    public void setExamples(ArrayList<int[]> examples) {
        this.examples = examples;
    }


    public ArrayList<int[]> getExamples() { return this.examples; }


    public double fitness(int[] hypothesis) {

        double accuracy = accuracy(hypothesis, examples);
        double ruleCount = Double.valueOf(hypothesis.length) / 11;

        double ruleCountPenalty = LAMBDA * ruleCount;
        double fitness = accuracy * accuracy - ruleCountPenalty;

        // Handles bounding error
        if (fitness <= 0) {
            return 0.001;
        }

        return fitness;
    }


    public double accuracy(int[] hypothesis, ArrayList<int[]> examples) {
        ArrayList<int[]> rules = utilities.breakHypIntoRules(hypothesis, 11);

        // Track correct count
        double correct = 0.0;

        // loop over training examples
        for (int[] example : examples) {

            boolean isCorrect = false;

            for (int[] rule : rules) {
                if (canClassify(example, rule)) {
                    // classify Example
                    isCorrect = classifyExample(example[example.length - 1], rule[rule.length - 1]);
                    break;
                }
            }


            if (isCorrect) {
                correct++;
            }
        }
        double accuracy = correct / examples.size();
        return accuracy;
    }


    public boolean classifyExample(int prediction, int answer) {
        return prediction == answer;
    }


    public boolean canClassify(int[] example, int[] rule) {

        String prefix = "Attribute: ";
        for (int i = 0; i < attributeValues.size() - 1; i++) {
            int attrSize = attributeValues.get(prefix + String.valueOf(i)).size();

            int begginingIndex = 0;
            for (int j = 0; j < i; j++) {
                begginingIndex += attributeValues.get(prefix + String.valueOf(j)).size();
            }

            if (!isAttrMatch(example, rule, attrSize, begginingIndex)) {
                return false;
            }
        }



        return true;
    }


    public boolean isAttrMatch(int[] example, int[] rule, int attrLength, int begginingIndex) {

        for (int i = begginingIndex; i < attrLength + begginingIndex; i++) {
            if (rule[i] == 1 && example[i] == rule[i]) {
                return true;
            }
        }

        return false;
    }


    public HashMap<String, ArrayList<String>> getAttributeInformation(String fileName) {
        boolean initalLoop = true;
        HashMap<String, ArrayList<String>> attrValues = new HashMap<>();
        try (Scanner scan = new Scanner(Paths.get(fileName))) {
            int index = 0;
            while (scan.hasNextLine()) {
                // Use first example for setup
                // Loop over the rest
                String line = scan.nextLine();
                String[] parts = line.split(" ");

                // Pre populate map w empty sets
                if (initalLoop) {


                    for (int i = 0; i < parts.length; i++) {
                        String key = "Attribute: " + String.valueOf(i);
                        if (i == parts.length - 1) {
                            key = "Target";
                        }

                        // Setup Map

                        attrValues.put(key, new ArrayList<String>());
                    }
                    initalLoop = false;
                }
                // add current value to the hashset
                for (int i = 0; i < parts.length; i++) {
                    String key = "Attribute: " + String.valueOf(i);
                    if (i == parts.length - 1) {
                        key = "Target";
                    }
                    ArrayList<String> values = attrValues.get(key);
                    if (!values.contains(parts[i])) {
                        values.add(parts[i]);
                    }

                }


            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        setAttributeValues(attrValues);
        return attrValues;
    }


    public void setAttributeValues(HashMap<String, ArrayList<String>> attributeValues) {
        this.attributeValues = attributeValues;
    }


    public ArrayList<int[]> processExamples2(String fileName, HashMap<String, ArrayList<String>> attributeValues, int ruleLength) {
        ArrayList<int[]> trainingExamples = new ArrayList<>();
        try (Scanner scan = new Scanner(Paths.get(fileName))) {
            String prefix = "Attribute: ";
            while (scan.hasNextLine()) {
                String line = scan.nextLine();
                String[] parts = line.split(" ");
                int[] example = new int[ruleLength];

                for (int i = 0; i < parts.length - 1; i++) {
                    String suffix = String.valueOf(i);
                    String key = prefix + suffix;
                    int attrIndex = attributeValues.get(key).indexOf(parts[i]);

                    for (int j = 0; j < i; j ++) {

                        String tempSuffix = String.valueOf(j);
                        String key2 = prefix + tempSuffix;
                        attrIndex += attributeValues.get(key2).size();
                    }
                    example[attrIndex]++;
                }
                ArrayList<String> temp = attributeValues.get("Target");
                int placeholder = ruleLength - 1;

                example[placeholder] = temp.indexOf(parts[parts.length - 1]);


                trainingExamples.add(example);
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        setExamples(trainingExamples);
        return trainingExamples;
    }


    public int getMajorityClass(ArrayList<int[]> examples) {

        int noCount = 0;
        int yesCount = 0;
        for (int[] example : examples) {
            if (example[example.length - 1] == 1) {
                yesCount++;
            } else {
                noCount++;
            }
        }

        if (yesCount > noCount) {
            return 1;
        }

        return 0;
    }

}
