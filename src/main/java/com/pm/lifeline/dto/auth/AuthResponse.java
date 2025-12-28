package com.pm.lifeline.dto.auth;



public class AuthResponse {
    public String token;
    public String email;
    public String role;

    public AuthResponse(String token, String email, String role) {
        this.token = token;
        this.email = email;
        this.role = role;
    }
}
