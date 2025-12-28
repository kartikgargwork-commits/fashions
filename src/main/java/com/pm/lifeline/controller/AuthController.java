package com.pm.lifeline.controller;


import com.pm.lifeline.dto.auth.AuthResponse;
import com.pm.lifeline.dto.auth.LoginRequest;
import com.pm.lifeline.dto.auth.RegisterRequest;
import com.pm.lifeline.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
