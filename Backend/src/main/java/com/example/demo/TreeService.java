package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;       // <-- add this
import java.util.HashMap;  // <-- and this
import java.util.LinkedHashMap;


@Service
public class TreeService {

    private ID3tree currentTree;
    private String[] attrs = {"Outlook", "Temperature", "Humidity", "Wind"};

    public double calculateAccuracy(String testFile) {
        if (currentTree == null) return 0;

        ArrayList<String[]> testingExamples = TreeUtils.processExamples(testFile);
        String[] filteredRules = TreeUtils.processRules(currentTree.rules, currentTree.trainingExampes);

        double correctCount = 0;
        for (String[] example : testingExamples) {
            for (String rule : filteredRules) {
                String[] parts = rule.split(" ");
                int match = 0;
                for (int i = 0; i < parts.length - 1; i++) {
                    if (TreeUtils.contains(example, parts[i])) {
                        match++;
                    }
                }
                if (match == parts.length - 1) {
                    if (parts[parts.length - 1].equals(example[example.length - 1])) {
                        correctCount++;
                    }
                    break;
                }
            }
        }

        return (correctCount / testingExamples.size()) * 100.0;
    }


    
    public List<String> generateRules() {
        return Arrays.asList(currentTree.rules);
    }

    private TreeNodeFullDTO buildFullDTO(Node node, String edgeLabel) {
        // Convert remainingAttributes array to a List<String>
        List<String> remaining = new ArrayList<>();
        if (node.remainingAttributes != null) {
            remaining = Arrays.asList(node.remainingAttributes);
        }

        // Convert examples ArrayList<String[]> to List<Map<String, String>> with real attribute names
        List<Map<String, String>> exampleList = new ArrayList<>();
        for (String[] ex : node.examples) {
            Map<String, String> map = new LinkedHashMap<>();
            for (int i = 0; i < ex.length; i++) {
                String key;
                if (i < attrs.length) {
                    key = attrs[i]; // from your TreeService attrs array
                } else {
                    key = "Play"; // target/class label name
                }
                map.put(key, ex[i]);
            }
            exampleList.add(map);
        }

        // Create DTO
        TreeNodeFullDTO dto = new TreeNodeFullDTO(
            node.name,
            edgeLabel,
            remaining,
            exampleList
        );

        // Recursively add children
        node.children.forEach((edge, childNode) -> {
            dto.getChildren().add(buildFullDTO(childNode, edge));
        });

        return dto;
    }


    public TreeNodeFullDTO getFullTreeAsJson() {
        if (currentTree == null || currentTree.root == null) {
            return null;
        }
        return buildFullDTO(currentTree.root, null);
    }

    public void train(TrainRequest req) {
        // Simple proof it ran; you’ll see this in the server console
        System.out.println("TRAIN called: algorithm=" + req.getAlgorithm()
            + ", measure=" + req.getMeasure()
            + ", trainFile=" + req.getTrainFile()
            + ", testFile=" + req.getTestFile());

        // (Optional) actually train using the provided params:
        ArrayList<String[]> trainingExamples = TreeUtils.processExamples(req.getTrainFile());
        currentTree = new ID3tree(trainingExamples, attrs, req.getMeasure());
    }


}
