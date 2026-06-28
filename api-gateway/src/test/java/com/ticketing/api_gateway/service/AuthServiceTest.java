package com.ticketing.api_gateway.service;

import com.ticketing.api_gateway.dto.AuthResponseDTO;
import com.ticketing.api_gateway.dto.RegisterRequestDTO;
import com.ticketing.api_gateway.model.User;
import com.ticketing.api_gateway.repository.UserRepository;
import com.ticketing.api_gateway.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private RegisterRequestDTO dto;

    @BeforeEach
    void setUp() {
        dto = new RegisterRequestDTO();
        dto.setName("Test User");
        dto.setEmail("test@test.com");
        dto.setPassword("password123");
    }

    @Test
    void register_withNullRole_shouldDefaultToCustomer() {
        dto.setRole(null);
        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encodedPassword");
        when(jwtUtil.generateToken(any(), anyString(), anyString(), anyString())).thenReturn("mockToken");

        authService.register(dto);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("CUSTOMER", savedUser.getRole());
        assertEquals("test@test.com", savedUser.getEmail());
    }

    @Test
    void register_withEventManagerRole_shouldSaveWithEventManagerRole() {
        dto.setRole("EVENT_MANAGER");
        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encodedPassword");
        when(jwtUtil.generateToken(any(), anyString(), anyString(), anyString())).thenReturn("mockToken");

        authService.register(dto);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("EVENT_MANAGER", savedUser.getRole());
        assertEquals("test@test.com", savedUser.getEmail());
    }
}
