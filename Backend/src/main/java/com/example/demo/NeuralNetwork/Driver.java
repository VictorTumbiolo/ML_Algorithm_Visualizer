package com.example.demo.NeuralNetwork;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Scanner;

public class Driver {

    public static void main(String[] args) {

//        NeuralNetwork network = new NeuralNetwork(4, 3, 4, 4);

//         ArrayList<double[]> trainingExamples = processExamples("IrisTrain.txt");
//         ArrayList<double[]> questions = new ArrayList<>();
//         ArrayList<Double> answers = new ArrayList<>();
//         for (double[] example : trainingExamples) {
//             double[] qs = new double[example.length - 1];
//             for (int i = 0; i < example.length - 1; i++) {
//                 qs[i] = example[i];
//             }
//             questions.add(qs);
//             answers.add(example[example.length - 1]);
//         }

// //        for (int i = 0; i < questions.size(); i++) {
// //            printExample(questions.get(i));
// //            System.out.println(answers.get(i));
// //        }

//         NeuralNetwork network = new NeuralNetwork(4, 3, 4, 4, questions, answers);
//         testExamples(network, questions, answers);

//         // processExamples("IrisTrain.txt");

    }


    public static String testExamples(NeuralNetwork network, ArrayList<double[]> features, ArrayList<Double> answers) {
        StringBuilder stats = new StringBuilder();
        ArrayList<double[]> correctPredictions = new ArrayList<>();
        ArrayList<double[]> confusionMatrix = new ArrayList<>();
        int correct = 0;

        for (int i = 0; i < features.size(); i++) {
            double[] feature = features.get(i);
            double prediction = network.makePrediction(feature);
            double answer = answers.get(i);

            double[] statInformation = new double[feature.length + 2];
            for (int j = 0; j < feature.length; j++) {
                statInformation[j] = feature[j];
            }
            statInformation[feature.length] = prediction;
            statInformation[feature.length + 1] = answer;

            if (prediction == answer) {
                correct++;
                correctPredictions.add(statInformation);
            } else {
                confusionMatrix.add(statInformation);
            }
        }

        double accuracy = (double) correct / features.size() * 100;
        stats.append(String.format("Accuracy: %.1f%%%n%n", accuracy));
        stats.append("Model Predictions\n\n");
        stats.append(String.format("Correct Predictions (%d)%n", correct));

        // Header
        String header = String.format(
                "%-12s %-12s %-13s %-12s %-18s %-22s%n",
                "Sepal Length", "Sepal Width", "Petal Length", "Petal Width",
                "Model Prediction", "Actual Classification"
        );
        stats.append(header);

        // Correct Predictions
        for (double[] row : correctPredictions) {
            String predictionLabel;
            if (row[4] == 0.0) predictionLabel = "Setosa";
            else if (row[4] == 1.0) predictionLabel = "Virginica";
            else predictionLabel = "Versicolor";

            String actualLabel;
            if (row[5] == 0.0) actualLabel = "Setosa";
            else if (row[5] == 1.0) actualLabel = "Virginica";
            else actualLabel = "Versicolor";

            stats.append(String.format(
                    "%-12.1f %-12.1f %-13.1f %-12.1f %-18s %-22s%n",
                    row[0], row[1], row[2], row[3],
                    predictionLabel, actualLabel
            ));
        }

        // Confusion Matrix
        stats.append("\nConfusion Matrix\n");
        if (!confusionMatrix.isEmpty()) {
            stats.append(header);
            for (double[] row : confusionMatrix) {
                String predictionLabel;
                if (row[4] == 0.0) predictionLabel = "Setosa";
                else if (row[4] == 1.0) predictionLabel = "Virginica";
                else predictionLabel = "Versicolor";

                String actualLabel;
                if (row[5] == 0.0) actualLabel = "Setosa";
                else if (row[5] == 1.0) actualLabel = "Virginica";
                else actualLabel = "Versicolor";

                stats.append(String.format(
                        "%-12.1f %-12.1f %-13.1f %-12.1f %-18s %-22s%n",
                        row[0], row[1], row[2], row[3],
                        predictionLabel, actualLabel
                ));
            }
        } else {
            stats.append("No misclassifications found!\n");
        }

        return stats.toString();
    }




    public static void printExample(double[] example) {
        for (int i = 0; i < example.length; i++) {
            System.out.print(example[i] + " ");
        }

    }

    public static ArrayList<double[]> processExamples(String fileName) {

        ArrayList<double[]> trainingExamples = new ArrayList<>();
        try (Scanner scan = new Scanner(Paths.get(fileName))) {

            while (scan.hasNextLine()) {
                String line = scan.nextLine();
                String[] parts = line.split(" ");
                double[] formattedParts = new double[parts.length];

                for (int i = 0; i < parts.length - 1; i++) {
                    formattedParts[i] = Double.valueOf(parts[i]);
                }

                String classification = parts[parts.length - 1];
                double classValue = -1;
                if (classification.equals("Iris-setosa")) {
                    classValue = 0;
                } else if (classification.equals("Iris-virginica")) {
                    classValue = 1;
                } else if (classification.equals("Iris-versicolor")) {
                    classValue = 2;
                }
                formattedParts[formattedParts.length - 1] = classValue;
                trainingExamples.add(formattedParts);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return trainingExamples;

    }
}
