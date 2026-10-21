package com.example.demo.NeuralNetwork;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

// To run your training logic
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

// java imports 
import java.util.ArrayList;

@RestController
@RequestMapping("/nn")  // matches frontend's /nn/train
@CrossOrigin(origins = "http://localhost:5173") // <-- Adjust if using Vite
public class NetworkController {

    public static NeuralNetwork network;

    @PostMapping("/train")
    public ResponseEntity<String> trainNetwork(@RequestBody NetworkRequest request) {
        try {
            // Capture console output (optional)
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PrintStream ps = new PrintStream(baos);
            PrintStream oldOut = System.out;
            System.setOut(ps);

            // Example: run your NN here
            // System.out.println("Training started...");
            // System.out.println("Activation: " + request.getActivationFunction());
            // System.out.println("Hidden Layers: " + request.getHiddenLayers());
            // System.out.println("Neurons per Layer: " + request.getNeuronsPerLayer());
            // System.out.println("Training File: " + request.getTrainFile());
            // System.out.println("Testing File: " + request.getTestFile());
            // System.out.println("Training finished successfully!");


            ArrayList<double[]> trainingExamples = Driver.processExamples(request.getTrainingFile());
            ArrayList<double[]> questions = new ArrayList<>();
            ArrayList<Double> answers = new ArrayList<>();
            for (double[] example : trainingExamples) {
                double[] qs = new double[example.length - 1];
                for (int i = 0; i < example.length - 1; i++) {
                    qs[i] = example[i];
                }
                questions.add(qs);
                answers.add(example[example.length - 1]);
            }

            // network = new NeuralNetwork(4, 3, 4, 3, questions, answers);
            network = new NeuralNetwork(4, request.getHiddenLayers(), request.getNeuronsPerLayer(), 3, questions, answers, request.getEpocs(), request.getLearningRate(), request.getMomentum());


            // Restore normal output
            System.out.flush();
            System.setOut(oldOut);

            return ResponseEntity.ok(baos.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error during training: " + e.getMessage());
        }
    }

    @GetMapping("/accuracy")
    public ResponseEntity<String> getAccuracy(@RequestParam String fileName) {

        // Get Examples 
        ArrayList<double[]> testingExamples = Driver.processExamples(fileName);
        ArrayList<double[]> questions = new ArrayList<>();
        ArrayList<Double> answers = new ArrayList<>();
        for (double[] example : testingExamples) {
            double[] qs = new double[example.length - 1];
            for (int i = 0; i < example.length - 1; i++) {
                qs[i] = example[i];
            }
            questions.add(qs);
            answers.add(example[example.length - 1]);
        }
        // Example — replace with actual accuracy
        // double accuracy = Driver.testExamples(network, questions, answers);
        String result = Driver.testExamples(network, questions, answers);
        // System.out.println(result);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/hiddenNodeInfo")
    public ResponseEntity<String> getHiddenNodeInfo(
            @RequestParam int layer,
            @RequestParam int layerPosition) {

        // System.out.println("Received layer=" + layer + ", layerPosition=" + layerPosition);
        String result = network.getHiddenNodeInfo(layer, layerPosition);
        // System.out.println("Returning: " + result);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/inputNodeInfo")
    public ResponseEntity<String> getInputNodeInfo(@RequestParam int nodePosition) {
        String result = network.getInputNodeInfo(nodePosition);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/outputNodeInfo")
    public ResponseEntity<String> getOutputNodeInfo(@RequestParam int nodePosition) {
        String result = network.getOutputNodeInfo(nodePosition);
        return ResponseEntity.ok(result);
    }

}
