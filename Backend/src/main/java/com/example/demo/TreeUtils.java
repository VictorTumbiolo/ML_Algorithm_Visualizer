package com.example.demo;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;
import java.io.InputStream;


public class TreeUtils {

    // Reads a file and returns each line as a string array
    public static ArrayList<String[]> processExamples(String fileName) {
        ArrayList<String[]> examples = new ArrayList<>();
            try (InputStream is = TreeUtils.class.getClassLoader().getResourceAsStream(fileName);
                Scanner scan = new Scanner(is)) {
            while (scan.hasNextLine()) {
                String line = scan.nextLine();
                String[] parts = line.trim().split(" ");
                examples.add(parts);
            }
        } catch (Exception e) {
            System.out.println("Error reading file: " + fileName);
            e.printStackTrace();
        }
        return examples;
    }

    // Checks if a keyword is in a list of values
    public static boolean contains(String[] list, String keyword) {
        for (String value : list) {
            if (keyword.equals(value)) {
                return true;
            }
        }
        return false;
    }

    // Filters rules to include only those tokens found in training examples
    public static String[] processRules(String[] rules, ArrayList<String[]> examples) {
        String[] filteredRules = new String[rules.length];
        Set<String> keywords = setKeywords(examples);

        for (int i = 0; i < rules.length; i++) {
            StringBuilder filtered = new StringBuilder();
            String[] parts = rules[i].split(" ");
            for (String part : parts) {
                if (keywords.contains(part)) {
                    filtered.append(part).append(" ");
                }
            }
            if (filtered.length() > 0) {
                filteredRules[i] = filtered.toString().trim();
            } else {
                filteredRules[i] = "";
            }
        }

        return filteredRules;
    }

    // Extracts all unique values (keywords) from a dataset
    public static Set<String> setKeywords(ArrayList<String[]> examples) {
        Set<String> keywords = new HashSet<>();
        for (String[] example : examples) {
            for (String value : example) {
                keywords.add(value);
            }
        }
        return keywords;
    }
}
