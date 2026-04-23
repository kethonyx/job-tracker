package com.dimash.jobtracker.service;

import com.dimash.jobtracker.dto.auth.AuthResponse;
import com.dimash.jobtracker.dto.auth.LoginRequest;
import com.dimash.jobtracker.dto.auth.RegisterRequest;
import com.dimash.jobtracker.dto.auth.UserResponse;
import com.dimash.jobtracker.entity.User;

public interface AuthService {
    User register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser();
}
