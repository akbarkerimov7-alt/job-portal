package com.akbar.jobportal.service;

import com.akbar.jobportal.dto.UserResponse;
import com.akbar.jobportal.model.User;
import com.akbar.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole());
    }
}
