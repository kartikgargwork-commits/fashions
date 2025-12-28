package com.pm.lifeline;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootTest
class LifelineApplicationTests {

    @Test
    void contextLoads() {
    }


    @GetMapping("/api/auth/test")
    public String test() {
        return "Backend is running ✅";
    }

}




