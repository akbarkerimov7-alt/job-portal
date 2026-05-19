package com.akbar.jobportal.service;

import com.akbar.jobportal.dto.AuthResponse;
import com.akbar.jobportal.dto.LoginRequest;
import com.akbar.jobportal.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
