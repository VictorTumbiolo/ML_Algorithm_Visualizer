package com.example.demo;

public class AccuracyRequest {
    private String testFile;

    // Default constructor is required for JSON deserialization
    public AccuracyRequest() {}

    public String getTestFile() {
        return testFile;
    }

    public void setTestFile(String testFile) {
        this.testFile = testFile;
    }
}
