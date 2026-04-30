package com.dimash.jobtracker.controller;

import com.dimash.jobtracker.dto.auth.AuthResponse;
import com.dimash.jobtracker.dto.auth.LoginRequest;
import com.dimash.jobtracker.dto.auth.RegisterRequest;
import com.dimash.jobtracker.dto.auth.UserResponse;
import com.dimash.jobtracker.entity.User;
import com.dimash.jobtracker.repository.UserRepository;
import com.dimash.jobtracker.service.AuthService;
import com.dimash.jobtracker.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request){

        User user = authService.register(request);

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request){
        return authService.login(request);
    }

    @GetMapping("/me")

    public UserResponse me() {

        String email = SecurityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)

                .orElseThrow();

        return new UserResponse(

                user.getId(),

                user.getName(),

                user.getEmail()

        );

    }
}
