package com.vibewaves.music_streaming_app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        // Return the name of the file "index.html" (Spring Boot will automatically find it in the /static folder).
        return "index";
    }
}
