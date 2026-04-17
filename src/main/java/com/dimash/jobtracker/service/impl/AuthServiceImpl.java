package com.dimash.jobtracker.service.impl;

import com.dimash.jobtracker.dto.auth.RegisterRequest;
import com.dimash.jobtracker.entity.User;
import com.dimash.jobtracker.repository.UserRepository;
import com.dimash.jobtracker.service.AuthService;
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
}
