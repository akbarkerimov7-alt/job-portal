package com.akbar.jobportal.service;

import com.akbar.jobportal.dto.UserResponse;

public interface UserService {

    UserResponse getProfile(String email);
}
