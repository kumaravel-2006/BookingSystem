package com.ticketing.api_gateway.controller;

import com.ticketing.api_gateway.dto.AuthResponseDTO;
import com.ticketing.api_gateway.dto.LoginRequestDTO;
import com.ticketing.api_gateway.dto.RegisterRequestDTO;
import com.ticketing.api_gateway.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody @Valid RegisterRequestDTO dto){
        return ResponseEntity.ok(authService.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto){
        return ResponseEntity.ok(authService.login(dto));
    }
}
