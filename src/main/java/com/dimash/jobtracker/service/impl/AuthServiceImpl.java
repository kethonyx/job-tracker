package com.dimash.jobtracker.service.impl;

import com.dimash.jobtracker.dto.auth.AuthResponse;
import com.dimash.jobtracker.dto.auth.LoginRequest;
import com.dimash.jobtracker.dto.auth.RegisterRequest;
import com.dimash.jobtracker.dto.auth.UserResponse;
import com.dimash.jobtracker.entity.User;
import com.dimash.jobtracker.repository.UserRepository;
import com.dimash.jobtracker.security.JwtService;
import com.dimash.jobtracker.service.AuthService;
import com.dimash.jobtracker.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.dimash.jobtracker.enumtype.Role;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public User register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exist!");

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .created_at(LocalDateTime.now()).build();

        return userRepository.save(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User Not Found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid Password!");


        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    @Override
    public UserResponse getCurrentUser() {
        String email = SecurityUtil.getCurrentUserEmail();
        System.out.println("EMAIL FROM SECURITY CONTEXT: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }


}
