package com.example.demo;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;


public class TreeNodeFullDTO {
    private String name;
    private String edgeLabel;
    private List<String> remainingAttributes;
    private List<Map<String, String>> examples;
    private List<TreeNodeFullDTO> children = new ArrayList<>();

    public TreeNodeFullDTO(String name, String edgeLabel, 
                           List<String> remainingAttributes, 
                           List<Map<String, String>> examples) {
        this.name = name;
        this.edgeLabel = edgeLabel;
        this.remainingAttributes = remainingAttributes;
        this.examples = examples;
    }

    public String getName() { return name; }
    public String getEdgeLabel() { return edgeLabel; }
    public List<String> getRemainingAttributes() { return remainingAttributes; }
    public List<Map<String, String>> getExamples() { return examples; }
    public List<TreeNodeFullDTO> getChildren() { return children; }
}
