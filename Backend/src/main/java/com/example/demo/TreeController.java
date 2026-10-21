/* 
REST controller that exposes
backend endpoints to the frontend
*/
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


// Mark as REST controller, return JSON formats
@RestController 

// CORS Policy
@CrossOrigin(origins = "*") 
public class TreeController {
    private static final Logger log = LoggerFactory.getLogger(TreeController.class);

    @Autowired
    private TreeService treeService;

    @PostMapping("/accuracy")
    public double getAccuracy(@RequestBody AccuracyRequest req) {
        return treeService.calculateAccuracy(req.getTestFile());
    }


    // // Learned Rules Endpoint
    @GetMapping("/rules")
    public List<String> getRules() {
        return treeService.generateRules();
    }

    @GetMapping("/tree")
    public TreeNodeFullDTO getTree() {
        return treeService.getFullTreeAsJson();
    }

    @PostMapping("/train")
    public void train(@RequestBody TrainRequest req) {
        log.info("POST /train payload -> algorithm={}, measure={}, trainFile={}, testFile={}",
        req.getAlgorithm(), req.getMeasure(), req.getTrainFile(), req.getTestFile());
        // (optional) basic validation
        if (req.getAlgorithm() == null || !"ID3".equalsIgnoreCase(req.getAlgorithm())) {
            throw new IllegalArgumentException("Only ID3 is supported right now.");
        }
        if (req.getMeasure() == null || req.getTrainFile() == null) {
            throw new IllegalArgumentException("measure and trainFile are required.");
        }

        treeService.train(req);  // <-- use the request to set params and build the model
    }


}
