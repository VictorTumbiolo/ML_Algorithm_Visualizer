package com.example.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*") // allow frontend access
public class HelloController {

    @GetMapping("/hello")
    public String sayHello() {
        return "hello world";
    }
}
