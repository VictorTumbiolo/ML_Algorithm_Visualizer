package com.example.demo.GeneticAlgorithm;
import java.util.List;

public class GARequest {
    private String algorithm;
    private String trainFile;
    private String testFile;
    private List<IslandConfig> islands;
    private int popSize;

    // getters & setters
    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }

    public String getTrainFile() { return trainFile; }
    public void setTrainFile(String trainFile) { this.trainFile = trainFile; }

    public String getTestFile() { return testFile; }
    public void setTestFile(String testFile) { this.testFile = testFile; }

    public List<IslandConfig> getIslands() { return islands; }
    public void setIslands(List<IslandConfig> islands) { this.islands = islands; }
}
