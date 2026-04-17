package com.dimash.jobtracker.controller;

import com.dimash.jobtracker.dto.auth.RegisterRequest;
import com.dimash.jobtracker.entity.User;
import com.dimash.jobtracker.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }
}
