package com.example.demo.GeneticAlgorithm;


import java.util.Random;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Collections;
import java.util.Comparator;

public class AlgoTester {

    public static Random randy = new Random();

    private static Island[] islands;
    private static HashMap<String, Island> populations = new HashMap();
    public static void main(String[] args) {

        // HypothesesUtilities utilities = new HypothesesUtilities();
        // Evaluator evaluate = new Evaluator(0.025);
        // // sets hashmap
        // HashMap<String, ArrayList<String>> attributeValues = evaluate.getAttributeInformation("Tennis-Train.txt");


        // for (HashMap.Entry<String, ArrayList<String>> entry : attributeValues.entrySet()) {
        //     String attribute = entry.getKey();
        //     ArrayList<String> values = entry.getValue();

        //     System.out.println("Attribute: " + attribute);
        //     for (String value : values) {
        //         System.out.println("  Value: " + value);
        //     }
        // }


        // ArrayList<int[]> examples = evaluate.processExamples2("Tennis-Train.txt", attributeValues, 11);

        // ArrayList<int[]> firstPop = generateFirstGeneration(150);
        // ArrayList<CandidateHyp> formattedPop = new ArrayList<>();
        // for (int[] pop : firstPop) {
        //     double fitness = evaluate.fitness(pop);
        //     CandidateHyp temp = new CandidateHyp(pop, fitness);
        //     formattedPop.add(temp);
        // }
        // int ruleLength = 11;

        // Island island1 = new Island(formattedPop, new TournamentSelection(3),
        //         new StandardMutation(0.01),
        //         new VaryingRuleLengthCrossover(ruleLength),
        //         evaluate,
        //         12 * 3, 38 * 3);

        // Island island2 = new Island(formattedPop, new FitnessSelection(),
        //         new GabilMutation(0.01, 0.0005, 0.0001, attributeValues),
        //         new VaryingRuleLengthCrossover(ruleLength), evaluate,
        //         12 * 3, 38 * 3);

        // Island island3 = new Island(formattedPop, new TournamentSelection(3),
        //         new GabilMutation(0.01, 0.0005, 0.0001, attributeValues),
        //         new VaryingRuleLengthCrossover(ruleLength), evaluate,
        //         12 * 3, 38 * 3);

        // Island island4 = new Island(formattedPop, new FitnessSelection(),
        //         new StandardMutation(0.01),
        //         new VaryingRuleLengthCrossover(ruleLength), evaluate,
        //         12 * 3, 38 * 3);

        // Island[] islands = new Island[] {island1, island2, island3, island4};

        // Island[] trainedIslands = train(islands, 500);

        // for (Island isl : trainedIslands) {
        //     Collections.sort(isl.getPopulation(), Comparator.comparingDouble(CandidateHyp::getFitness).reversed());
        //     CandidateHyp best = isl.getPopulation().get(0);
        //     double acc = evaluate.accuracy(best.getHypothesis(), examples);
        //     double fit = evaluate.fitness(best.getHypothesis());
        //     System.out.println("=============================================");
        //     utilities.printHypothesis(best.getHypothesis());

        //     System.out.println(acc);
        //     System.out.println(fit);

        // }

    }


    public static String setupIslands(GARequest request) {
        StringBuilder sb = new StringBuilder();

        sb.append("Algorithm: ").append(request.getAlgorithm()).append("\n");
        sb.append("Train file: ").append(request.getTrainFile()).append("\n");
        sb.append("Test file: ").append(request.getTestFile()).append("\n\n");

        for (int i = 0; i < request.getIslands().size(); i++) {
            IslandConfig cfg = request.getIslands().get(i);
            sb.append("Island ").append(i + 1).append(" config:\n");
            sb.append("  Selection: ").append(cfg.getSelectionStrategy())
            .append(" (rate=").append(cfg.getSelectionRate()).append(")\n");
            sb.append("  Mutation: ").append(cfg.getMutationStrategy())
            .append(" (rate=").append(cfg.getMutationRate()).append(")\n");
            sb.append("  Crossover: ").append(cfg.getCrossoverStrategy())
            .append(" (rate=").append(cfg.getCrossoverRate()).append(")\n");
            sb.append("  Rule Length Penalty: ").append(cfg.getRuleLengthPenalty()).append("\n");
            sb.append("  GABIL: ").append(cfg.getGabilExtension()).append("\n\n");
        }

        return sb.toString();
    }


    public static void setupIslands2(GARequest request) {
        // Flush out old data
        populations.clear();
        

        int islandCount = request.getIslands().size();
        Evaluator evaluateOG = new Evaluator();

        Island[] tempIslands = new Island[islandCount];

        // Get Attribute Information for Gabil 
        HashMap<String, ArrayList<String>> attributeInfo = evaluateOG.getAttributeInformation("Tennis-Train.txt");
        ArrayList<int[]> examples = evaluateOG.processExamples2("Tennis-Train.txt", attributeInfo, 11);
        String prefix = "island-";
        for (int i = 0; i < islandCount; i++) {
            // get cfg
            IslandConfig cfg = request.getIslands().get(i);


            // Current Island Configuration
            double rulePenalty = cfg.getRuleLengthPenalty();
            Evaluator evaluate = new Evaluator(rulePenalty);
            evaluate.setExamples(examples);
            evaluate.setAttributeValues(attributeInfo);
            

            // Handle Population
            // cfg.setPopulationSize();
            int popSize = cfg.getPopulationSize();

            


            ArrayList<int[]> firstPop = generateFirstGeneration(popSize);
            ArrayList<CandidateHyp> formattedPop = new ArrayList<>();

            for (int[] individual : firstPop) {
                double fitness = evaluate.fitness(individual);
                CandidateHyp temp = new CandidateHyp(individual, fitness);
                formattedPop.add(temp);
            }

            // Handle Strategies
            // String selectionStrat = handleSeclectionInput(cfg.getSelectionStrategy);
            SelectionStrategy selectionStrat = handleSelectionInput(cfg.getSelectionStrategy());
            MutationStrategy mutationStrat = handleMutationInput(cfg, attributeInfo);
            CrossoverStrategy crossoverStrat = handleCrossoverInput(cfg.getCrossoverStrategy(), 11);


            Island isle = new Island(formattedPop, selectionStrat, mutationStrat, crossoverStrat, evaluate, cfg.getSelectionRate(), cfg.getCrossoverRate());

            tempIslands[i] = isle;
            // get unique aspect of key for hashmap
            String suffix = String.valueOf(i + 1);
            populations.put(prefix + suffix, isle);


            

        }

        islands = tempIslands;
    }


    public static CrossoverStrategy handleCrossoverInput(String crossoverStrat, int ruleLength) {

        if (crossoverStrat.equals("onePoint")) {
            return new SinglePointCrossover();
        } else if (crossoverStrat.equals("twoPoint")) {
            return new TwoPointCrossover();
        } else if (crossoverStrat.equals("extendedTwoPoint")) {
            return new ExtendedTwoPointCrossover(ruleLength);
        } else {
            // Default
            return new VaryingRuleLengthCrossover(ruleLength);
        }

    }


    public static SelectionStrategy handleSelectionInput(String strategy) {

        if (strategy.equals("rank")) {
            return new RankSelection();
        } else if (strategy.equals("tournament")) {
            return new TournamentSelection(3);
        } else if (strategy.equals("fitness")) {
            return new FitnessSelection();
        } else {
            // Default
            return new FitnessProportionalSelection();
        }
    }


    public static MutationStrategy handleMutationInput(IslandConfig cfg, HashMap<String, ArrayList<String>> attributeInfo) {

        String strategy = cfg.getMutationStrategy();

        double mutationRate = cfg.getMutationRate();
        if (strategy.equals("gabil")) {
            double addAlternativeRate = 0.0005;
            double dropConditionRate = 0.0001;

            return new GabilMutation(mutationRate, addAlternativeRate, dropConditionRate, attributeInfo);
        } else {
            // default
            return new StandardMutation(mutationRate);
        }
    }


    public static Island[] train2() {

        int epocs = 500;

        for (String key : populations.keySet()) {
            Island isle = populations.get(key);
            isle.evolve();
        }

        printResults2();

        return islands;

    }

    public static void printResults2() {
        Evaluator temp = new Evaluator();
        HashMap<String, ArrayList<String>> attrs = temp.getAttributeInformation("Tennis-Train.txt");
        temp.setExamples(temp.processExamples2("Tennis-Train.txt", attrs, 11));
        int i = 1;
        for (String key : populations.keySet()) {
            Island isle = populations.get(key);

            // Sort the island's population by fitness descending
            Collections.sort(
                isle.getPopulation(),
                Comparator.comparingDouble(CandidateHyp::getFitness).reversed()
            );

            // Get the best hypothesis (first after sorting)
            CandidateHyp best = isle.getPopulation().get(0);

            // Print results
            System.out.println("Island " + (i) + " best hypothesis:");
            i++;
            
            for (int j : best.getHypothesis()) {
                System.out.print(j);
            }
            System.out.println();
            System.out.println(best.getFitness());
            System.out.println(temp.accuracy(best.getHypothesis(), temp.getExamples()));
        }
    }



    public static Island[] train() {

        int epocs = 500;
        for (int i = 0; i < epocs; i++) {
            for (Island isl : islands) {
                isl.evolve();
            }
        }

        // for (Island isl : islands) {
        //     isl.getPopSize();
        // }

        printResults(islands);
        return islands;
    }


    public static void printResults(Island[] islands) {
        for (int i = 0; i < islands.length; i++) {
            Island isle = islands[i];

            // Sort the island's population by fitness descending
            Collections.sort(
                isle.getPopulation(),
                Comparator.comparingDouble(CandidateHyp::getFitness).reversed()
            );

            // Get the best hypothesis (first after sorting)
            CandidateHyp best = isle.getPopulation().get(0);

            // Print results
            System.out.println("Island " + (i + 1) + " best hypothesis:");
            
            for (int j : best.getHypothesis()) {
                System.out.print(j);
            }
            System.out.println();
            System.out.println(best.getFitness());
        }
    }


    public static ArrayList<int[]> generateFirstGeneration(int generationSize) {
        ArrayList<int[]> hypotheses = new ArrayList<>(generationSize);
        int ruleLength = 11;
        for (int i = 0; i < generationSize; i++) {
            int ruleCount = 5;
            if (randy.nextDouble() < 0.5) {
                ruleCount++;
            }
            int hypothesisSize = ruleLength * ruleCount;
            int[] hypothesis = new int[hypothesisSize];
            for (int j = 0; j < hypothesisSize; j++ ) {

                if (randy.nextDouble() < 0.5) {
                    hypothesis[j]++;
                }
            }
            hypotheses.add(hypothesis);

        }

        return hypotheses;
    }


    // removed rules that cant classify any training examples
    public static int[] pruneRules(int[] hypothesis, int ruleLength, ArrayList<int[]> trainingExamples) {
        HypothesesUtilities utilities = new HypothesesUtilities();
        Evaluator evaluate = new Evaluator();
        ArrayList<int[]> rules = utilities.breakHypIntoRules(hypothesis, ruleLength);

        for (int i = rules.size() - 1; i >= 0; i-- ) {
            boolean applicable = false;
            int[] rule = rules.get(i);

            for (int[] example : trainingExamples) {
                if (evaluate.canClassify(example, rule)) {
                    applicable = true;
                    break;
                }
            }

            // remove rule if its not applicable to any examples
            if (!applicable) {
                rules.remove(i);
            }

        }

        int[] prunedHypothesis = utilities.buildHypothesis(rules, ruleLength);

        return prunedHypothesis;
    }


    public static Island getIsland(String id) {
        return populations.get(id);
    }


    // public String getHypothesisStats(int[] hypothesis, String testFile) {
    //     HypothesesUtilities utilities = new HypothesesUtilities();
    //     ArrayList<int[]> rules = utilities.breakHypIntoRules(hypothesis, 11);

    //     // Initalize Stringbuilder
    //     StringBuilder hypothesisStatistics = new StringBuilder();
    //     hypothesisStatistics.append("Hypothesis: ");
    //     for (int i : hypothesis) {
    //         hypothesisStatistics.append(i)
    //     }
    //     hypothesisStatistics.append("\n");

    //     // Track correct count
    //     double correct = 0.0;

    //     // Build Correct and incorrect Matracies
    //     ArrayList<int[]> correctPredictions = new ArrayList<>();
    //     ArrayList<int[]> wrongPredictions = new ArrayList<>();

    //     // Get examples 
    //     Evaluator temp = new Evaluator();
    //     HashMap<String, ArrayList<String>> attrs = temp.getAttributeInformation("Tennis-Train.txt");
    //     temp.setExamples(temp.processExamples2("Tennis-Train.txt", attrs, 11));
    //     ArrayList<int[]> examples = temp.getExamples();

    //     // loop over training examples
    //     for (int[] example : examples) {
    //         int prediction = -1;
    //         boolean isCorrect = false;
    //         int count = 0;
    //         for (int[] rule : rules) {
    //             if (temp.canClassify(example, rule)) {
    //                 // classify Example
    //                 prediction = rule[rule.length - 1];
    //                 isCorrect = classifyExample(example[example.length - 1], prediction);
    //                 break;

    //             }
    //             count++;
    //         }

            
    //         if (count == rules.Size()) {
    //             prediction = temp.getMajorityClass(examples);
    //             // predict majority class from training data
    //             if (prediction == example[example.length - 1]) {
    //                 isCorrect = true;
    //             }
    //         }
    //         int[] metaData = new int[example.length + 1];
    //         for (int i = 0; i < example.length; i++) {

    //         }

    //         if (isCorrect) {
    //             correct++;
                
                
    //         } 
    //     }
    //     double accuracy = correct / examples.size();
    //     return accuracy;
    // }

}
