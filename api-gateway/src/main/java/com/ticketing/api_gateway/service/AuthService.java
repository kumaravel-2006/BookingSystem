package com.ticketing.api_gateway.service;

import com.ticketing.api_gateway.dto.AuthResponseDTO;
import com.ticketing.api_gateway.dto.LoginRequestDTO;
import com.ticketing.api_gateway.dto.RegisterRequestDTO;
import com.ticketing.api_gateway.model.User;
import com.ticketing.api_gateway.repository.UserRepository;
import com.ticketing.api_gateway.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("CUSTOMER");

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());
        return new AuthResponseDTO(token, user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());
        return new AuthResponseDTO(token, user.getName(), user.getEmail(), user.getRole());
    }
}