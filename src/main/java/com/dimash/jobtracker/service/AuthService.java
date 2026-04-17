package com.dimash.jobtracker.service;

import com.dimash.jobtracker.dto.auth.RegisterRequest;
import com.dimash.jobtracker.entity.User;

public interface AuthService {
    User register(RegisterRequest request);
}
