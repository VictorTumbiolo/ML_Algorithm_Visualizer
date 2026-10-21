// src/main/java/com/example/demo/dto/TrainRequest.java
package com.example.demo;

public class TrainRequest {
  private String algorithm;   // e.g., "ID3"
  private String measure;     // e.g., "infoGain" or "entropy"
  private String trainFile;   // e.g., "Tennis-Train.txt"
  private String testFile;    // optional

  public TrainRequest() {} // needed by Jackson

  public TrainRequest(String algorithm, String measure, String trainFile, String testFile) {
    this.algorithm = algorithm;
    this.measure = measure;
    this.trainFile = trainFile;
    this.testFile = testFile;
  }

  public String getAlgorithm() { return algorithm; }
  public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }

  public String getMeasure() { return measure; }
  public void setMeasure(String measure) { this.measure = measure; }

  public String getTrainFile() { return trainFile; }
  public void setTrainFile(String trainFile) { this.trainFile = trainFile; }

  public String getTestFile() { return testFile; }
  public void setTestFile(String testFile) { this.testFile = testFile; }
}
