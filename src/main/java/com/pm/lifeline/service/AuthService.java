package com.pm.lifeline.service;


import com.pm.lifeline.dto.auth.AuthResponse;
import com.pm.lifeline.dto.auth.LoginRequest;
import com.pm.lifeline.dto.auth.RegisterRequest;
import com.pm.lifeline.entity.User;
import com.pm.lifeline.entity.UserRole;
import com.pm.lifeline.repository.UserRepository;
import com.pm.lifeline.repository.UserRoleRepository;
import com.pm.lifeline.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            UserRoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ✅ REGISTER
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            throw new RuntimeException("Email already exists");
        }

        UserRole userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        User user = new User(
                request.email,
                passwordEncoder.encode(request.password),
                userRole
        );

        userRepository.save(user);
    }

    // ✅ LOGIN
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().getName()
        );

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().getName()
        );
    }
}

