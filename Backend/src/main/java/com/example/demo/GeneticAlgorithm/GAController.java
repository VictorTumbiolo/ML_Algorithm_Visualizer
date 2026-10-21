package com.example.demo.GeneticAlgorithm;

// Spring imports
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



// Java imports
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/ga")
public class GAController {

    @PostMapping("/train")
    public ResponseEntity<String> runGA() {
        // Capture System.out
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(baos);
        PrintStream oldOut = System.out;
        System.setOut(ps);

        try {
            AlgoTester.train2(); // runs GA with current hardcoded values
        } finally {
            System.out.flush();
            System.setOut(oldOut); // reset System.out
        }

        return ResponseEntity.ok(baos.toString());
    }


    @PostMapping("/setupIslands")
    public ResponseEntity<String> setupIslands(@RequestBody GARequest request) {
        AlgoTester.setupIslands2(request); // capture the StringBuilder output
        return ResponseEntity.ok("Islands Setup Complete");                 // send it back to frontend
    }


    @PostMapping("/getPopulation/{islandId}")
    public ResponseEntity<ArrayList<CandidateHyp>> getPopulation(@PathVariable String islandId) {
        Island island = AlgoTester.getIsland(islandId);

        if (island == null) {
            return ResponseEntity.notFound().build();
        }

        // return the population directly
        return ResponseEntity.ok(island.getPopulation());
    }


    @PostMapping("/getHypothesisStats")
    public ResponseEntity<String> getHypothesisStats(@RequestParam int[] hypothesis /* , @PathVariable String testFile */) {
        // System.out.println("Made it");
        // for (int i : hypothesis) {
        //     System.out.print(i + " ");
        // }
        // System.out.println();
        return ResponseEntity.ok("Coming Soon");
    }




}
